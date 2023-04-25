import * as cdk from 'aws-cdk-lib'
import * as certificate_manager from 'aws-cdk-lib/aws-certificatemanager'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as logs from 'aws-cdk-lib/aws-logs'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment'
import { Construct } from 'constructs'
import * as path from 'path'

// define constants
// TODO add user flag/prop for this
const IS_DEV_MODE = true

// toggle HTTP instead of HTTPS
const FORCE_HTTP = true

const urlToIdFormat = (url: string) => url.replace(/[^a-z0-9-]+/gi, '-')

export interface CloudFrontStackProps extends cdk.StackProps {
  websiteUrl: string
  websiteDescription: string
  publicSSLCertificateArn: string
}

export class CloudFrontWebsiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CloudFrontStackProps) {
    const {
      websiteUrl,
      websiteDescription,
      publicSSLCertificateArn,
    } = props
    
    super(scope, `${id}-${urlToIdFormat(websiteUrl)}`, props)

    // create origin S3 bucket
    const {
      bucketName,
      cfnBucketId,
    } = this.createBucketNameAndId(websiteUrl)
    const websiteBucket = this.createS3Bucket(bucketName, cfnBucketId)

    // create CF Distribution to securely serve content from S3 bucket
    const distribution = this.createDistribution(
      cfnBucketId,
      websiteBucket,
      websiteUrl,
      websiteDescription,
      publicSSLCertificateArn,
    )

    // update bucket resource policy to allow read only access for the distribution
    websiteBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
      effect: iam.Effect.ALLOW,
      resources: [websiteBucket.arnForObjects('*')],
      conditions: {
        StringEquals: {
          'AWS:SourceArn': this.getDistributionArn(distribution),
        },
      },
    }))

    // TODO remove bucket policy granting (deprecated) OAI access

    // upload built files to bucket
    this.deployBuiltWebsiteFiles(websiteBucket, distribution, '../../dist/WLED-Web-Client')

    // output key info to console
    this.createCdkOutputs(websiteBucket, distribution)
  }

  /**
   * Set up CF Distribution to serve content from S3 bucket securely.
   * @param cfnIdPrefix 
   * @param originBucket 
   * @param websiteUrl 
   * @param websiteDescription 
   * @param publicSSLCertificateArn 
   * @returns 
   */
  private createDistribution = (
    cfnIdPrefix: string,
    originBucket: s3.Bucket,
    websiteUrl: string,
    websiteDescription: string,
    publicSSLCertificateArn: string,
  ) => {
    const DESCRIPTION_WARNING_MESSAGE = 'Warning - If distribution is deleted, delete any associated DNS records before the distribution is recreated.'
    const distributionProps = {
      defaultBehavior: {
        origin: new origins.S3Origin(originBucket),
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
        originRequestPolicy: cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN,
        responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT_AND_SECURITY_HEADERS,
        viewerProtocolPolicy: FORCE_HTTP
          ? cloudfront.ViewerProtocolPolicy.ALLOW_ALL
          : cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      certificate: FORCE_HTTP
        ? undefined
        : this.getCertificate(publicSSLCertificateArn, cfnIdPrefix),
      comment: `${websiteDescription} | ${DESCRIPTION_WARNING_MESSAGE}`,
      defaultRootObject: 'index.html',
      domainNames: [
        websiteUrl,
      ],
      enabled: true,
      enableIpv6: true,
      enableLogging: false,
      errorResponses: this.createErrorResponses(),
      geoRestriction: this.createGeoRestrictions(),
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      // TODO no log bucket... yet
      logBucket: undefined,
      // logIncludesCookies: true,
      // logFilePrefix: '',
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100, // possible future upgrade
      sslSupportMethod: cloudfront.SSLMethod.SNI,
    }

    const distribution = new cloudfront.Distribution(this, `${cfnIdPrefix}-cdn`, distributionProps)
    const oac = this.createOAC(cfnIdPrefix)

    // associate OAC with the distribution
    // https://github.com/aws/aws-cdk/issues/21771
    const cfnDistribution = distribution.node.defaultChild as cloudfront.CfnDistribution
    cfnDistribution.addPropertyOverride(
      'DistributionConfig.Origins.0.S3OriginConfig.OriginAccessIdentity',
      '',
    )
    cfnDistribution.addPropertyOverride(
      'DistributionConfig.Origins.0.OriginAccessControlId',
      oac.getAtt('Id')
    )

    return distribution
  }

  /**
   * Creates a new S3 bucket to store the static website files.
   * @param name cdk bucket name
   * @param cfnIdPrefix cdk id prefix
   * @returns the named S3 bucket
   */
  private createS3Bucket = (
    name: string,
    cfnIdPrefix: string,
  ): s3.Bucket => {
    const PERMANENTLY_DELETE_NONCURRENT_VERSIONS_AFTER_DAYS = 30
    const lifecycleRules: s3.LifecycleRule[] = [{
      enabled: true,
      id: `${cfnIdPrefix}-delete-noncurrent-after-${PERMANENTLY_DELETE_NONCURRENT_VERSIONS_AFTER_DAYS}-days`,
      noncurrentVersionExpiration: cdk.Duration.days(PERMANENTLY_DELETE_NONCURRENT_VERSIONS_AFTER_DAYS),
    }]

    let bucketProps: s3.BucketProps = {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      bucketName: name,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      lifecycleRules,
      versioned: true,
    }
    if (IS_DEV_MODE) {
      bucketProps = {
        ...bucketProps,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
      }
    }

    const bucket = new s3.Bucket(this, cfnIdPrefix, bucketProps)
    return bucket 
  }

  private deployBuiltWebsiteFiles(
    websiteBucket: s3.Bucket,
    distribution: cloudfront.Distribution,
    relativePath: string,
  ) {
    // TODO remove this if it becomes a pain, alternative is AWS CLI
    new s3Deployment.BucketDeployment(this, 'DeployWebsite', {
      destinationBucket: websiteBucket,
      sources: [
        s3Deployment.Source.asset(
          path.join(__dirname, relativePath),
        ),
      ],
      distribution,
      logRetention: logs.RetentionDays.ONE_MONTH,
    })
  }

  /**
   * Creates an Origin Access Control to use for accessing the S3 bucket.
   * @returns the created OAI
   */
  private createOAC(cfnIdPrefix: string) {
    const oac = new cloudfront.CfnOriginAccessControl(this, `${cfnIdPrefix}-oac`, {
      originAccessControlConfig: {
        name: `${cfnIdPrefix}-oac`,
        originAccessControlOriginType: 's3',
        signingBehavior: 'always',
        signingProtocol: 'sigv4',
        description: `OAC for website origin S3 bucket ${cfnIdPrefix}`,
      },
    })
    return oac
  }

  /**
   * Base name can only consist of lowercase letters, numbers, dots (.), and hyphens (-).
   * @param baseName 
   */
  private createBucketNameAndId = (baseName: string) => {
    const sanitized = baseName.replace(/[^a-z0-9.-]+/g, '')
    if (sanitized !== baseName) {
      console.warn(`Sanitized provided bucket name ${baseName} to ${sanitized}`)
    }
    const bucketName = `${sanitized}-static-website`
    const cfnBucketId = bucketName.replace(/[.-]+/g, '-')

    return {
      bucketName,
      cfnBucketId,
    }
  }

  /**
   * Defines the countries in which the website is distributed. 
   * @returns list of allowed geo locations
   */
  private createGeoRestrictions = () => {
    const geoRestrictions = cloudfront.GeoRestriction.allowlist(
      'US', // United States
      'UM', // United States Minor Outlying Islands
      'DE', // Germany
      'FR', // France
    )
    return geoRestrictions
  }

  /**
   * Gets a reference to the public SSL certificate.
   * @returns viewer certificate
   */
  private getCertificate = (certificateArn: string, cfnIdPrefix: string) => {
    const publicSSLCertificate = certificate_manager.Certificate
      .fromCertificateArn(this, `${cfnIdPrefix}-PublicSSLCertificate`, certificateArn)
    return publicSSLCertificate
  }

  /**
   * Creates list of custom CloudFront HTTP responses for error status codes.
   * 
   * valid status codes: 400, 403, 404, 405, 414, 416, 500, 501, 502, 503, 504
   * https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GeneratingCustomErrorResponses.html#creating-custom-error-pages
   * @returns list of custom responses
   */
  private createErrorResponses = () => {
    return [
      // generic error for page reload, need to serve index file for front-end routing to work
      {
        httpStatus: 403, // Forbidden
        ttl: cdk.Duration.seconds(60),
        responseHttpStatus: 200,
        responsePagePath: '/index.html',
      },
      // generic error for incorrect paths, need to serve index file for front-end routing to work
      {
        httpStatus: 404, // Not Found
        ttl: cdk.Duration.seconds(60),
        responseHttpStatus: 200,
        responsePagePath: '/index.html',
      },
    ]
  }

  /**
   * Outputs important metadata  to the console.
   * @param bucket 
   * @param distribution 
   */
  private createCdkOutputs(
    bucket: s3.Bucket,
    distribution: cloudfront.Distribution,
  ) {
    new cdk.CfnOutput(this, 'bucketName', {
      value: bucket.bucketName,
      description: 'S3 bucket name',
      exportName: 'bucketName',
    })
    new cdk.CfnOutput(this, 'distributionId', {
      value: distribution.distributionId,
      description: 'CloudFront distribution ID',
      exportName: 'distributionId',
    })
  }

  /**
   * Returns the ARN of the distribution.
   * @param distribution 
   * @returns 
   */
  private getDistributionArn = (distribution: cloudfront.Distribution) => {
    return cdk.Stack.of(this).formatArn({
      service: 'cloudfront',
      region: '',
      resource: 'distribution',
      resourceName: distribution.distributionId,
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
    })
  }
}
