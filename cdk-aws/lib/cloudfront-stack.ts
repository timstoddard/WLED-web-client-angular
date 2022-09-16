import * as cdk from 'aws-cdk-lib'
import * as certificate_manager from 'aws-cdk-lib/aws-certificatemanager'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as s3 from 'aws-cdk-lib/aws-s3'
import { Construct } from 'constructs'
import { writeFileSync } from 'fs'

// define constants
const S3_BUCKET_NAME_FILE = './output-s3-bucket-name'
// TODO add user flag/prop for this
const IS_DEV_MODE = true

interface CloudFrontStackProps extends cdk.StackProps {
  websiteUrl: string
  websiteDescription: string
  publicSSLCertificateArn: string
}

export class CloudFrontStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CloudFrontStackProps) {
    const {
      websiteUrl,
      websiteDescription,
      publicSSLCertificateArn,
    } = props
    const formattedUrl = websiteUrl.replace(/[^a-z0-9-]+/gi, '-')
    super(scope, `${id}-${formattedUrl}`, props)

    const {
      bucketName,
      bucketId,
    } = this.getBucketNameAndId(websiteUrl)
    const websiteBucket = this.createS3Bucket(bucketName, bucketId)

    // set up CF Distribution to serve content from S3 bucket securely
    new cloudfront.Distribution(this, `${bucketId}-cdn`, {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket, {
          originAccessIdentity: this.createOAI(bucketId),
        }),
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
        originRequestPolicy: cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN,
        responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT_AND_SECURITY_HEADERS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      certificate: this.getCertificate(publicSSLCertificateArn, bucketId),
      comment: websiteDescription,
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
    })
  }

  /**
   * Creates a new S3 bucket to store the static website files.
   * @param name cdk bucket name
   * @param id cdk bucket id
   * @returns the named S3 bucket
   */
  private createS3Bucket = (
    name: string,
    id: string,
  ): s3.IBucket => {
    const PERMANENTLY_DELETE_NONCURRENT_VERSIONS_AFTER_DAYS = 30
    let bucketProps: s3.BucketProps = {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      bucketName: name,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      lifecycleRules: [{
        enabled: true,
        id: `${id}-delete-noncurrent-after-${PERMANENTLY_DELETE_NONCURRENT_VERSIONS_AFTER_DAYS}-days`,
        prefix: undefined,
        expiration: undefined,
        noncurrentVersionExpiration: cdk.Duration.days(PERMANENTLY_DELETE_NONCURRENT_VERSIONS_AFTER_DAYS),
        noncurrentVersionsToRetain: undefined,
      }],
      versioned: true,
    }
    if (IS_DEV_MODE) {
      bucketProps = {
        ...bucketProps,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
      }
    }
    const bucket = new s3.Bucket(this, id, bucketProps)
    return bucket 
  }

  /**
   * Base name can only consist of lowercase letters, numbers, dots (.), and hyphens (-).
   * @param baseName 
   */
  private getBucketNameAndId = (baseName: string) => {
    const sanitized = baseName.replace(/[^a-z0-9.-]+/g, '')
    if (sanitized !== baseName) {
      console.warn(`Sanitized provided bucket name ${baseName} to ${sanitized}`)
    }
    const bucketName = `${sanitized}-static-website`
    const bucketId = bucketName.replace(/[.-]+/g, '-')

    // save s3 bucket name to file
    try {
      writeFileSync(S3_BUCKET_NAME_FILE, bucketName)
    } catch (err) {
      console.error(err)
    }

    return {
      bucketName,
      bucketId,
    }
  }

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
  private getCertificate = (certificateArn: string, bucketId: string) => {
    const publicSSLCertificate = certificate_manager.Certificate
      .fromCertificateArn(this, `${bucketId}-PublicSSLCertificate`, certificateArn)
    return publicSSLCertificate
  }

  /**
   * Creates an Origin Access Identity to use for accessing the S3 bucket.
   * @returns the created OAI
   */
  private createOAI = (bucketId: string) => {
    // TODO replace with OAC when available in CDK
    const oai = new cloudfront.OriginAccessIdentity(this, `${bucketId}-oai`, {
      comment: `OAI for ${bucketId} website bucket`,
    })
    return oai
  }

  /**
   * Creates list of custom CloudFront HTTP responses for error status codes.
   * @returns list of custom responses
   */
  private createErrorResponses = () => {
    // valid status codes: 400, 403, 404, 405, 414, 416, 500, 501, 502, 503, 504
    // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GeneratingCustomErrorResponses.html#creating-custom-error-pages
    return [
      {
        ttl: cdk.Duration.seconds(0),
        httpStatus: 400, // Bad Input
        // TODO set this to show custom page
        responsePagePath: undefined,
      },
      {
        ttl: cdk.Duration.seconds(60),
        httpStatus: 403, // Forbidden
        // TODO set this to show custom page
        responsePagePath: undefined,
      },
      {
        ttl: cdk.Duration.seconds(0),
        httpStatus: 404, // Not Found
        // TODO set this to show custom page
        responsePagePath: undefined,
      },
      {
        ttl: cdk.Duration.seconds(60),
        httpStatus: 500, // Internal Server Error
        // TODO set this to show custom page
        responsePagePath: undefined,
      },
      // TODO add other status codes?
    ]
  }
}
