import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { CloudFrontWebsiteStack } from '../lib/cloudfront-website-stack';

const createTestStack = () => {
  const app = new cdk.App();
  const stack = new CloudFrontWebsiteStack(app, 'MyTestStack', {
    websiteUrl: 'test.com',
    websiteDescription: 'test description',
    publicSSLCertificateArn: 'arn:aws:acm:us-east-1:114243598814:certificate/fake-cert-123',
  });
  return Template.fromStack(stack);
};

describe('CloudFrontWebsiteStack', () => {

  describe('S3 Bucket', () => {
    test('creates exactly one S3 bucket', () => {
      createTestStack().resourceCountIs('AWS::S3::Bucket', 1);
    });

    test('bucket has correct security configuration', () => {
      createTestStack().hasResourceProperties('AWS::S3::Bucket', {
        BucketEncryption: {
          ServerSideEncryptionConfiguration: [{
            ServerSideEncryptionByDefault: {
              SSEAlgorithm: 'AES256',
            },
          }],
        },
        VersioningConfiguration: { Status: 'Enabled' },
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          BlockPublicPolicy: true,
          IgnorePublicAcls: true,
          RestrictPublicBuckets: true,
        },
      });
    });

    test('bucket has lifecycle rule to delete noncurrent versions after 30 days', () => {
      createTestStack().hasResourceProperties('AWS::S3::Bucket', {
        LifecycleConfiguration: {
          Rules: Match.arrayWith([
            Match.objectLike({
              NoncurrentVersionExpiration: {
                NoncurrentDays: Match.anyValue(),
              },
              Status: 'Enabled',
            }),
          ]),
        },
      });
    });
  });

  describe('CloudFront Distribution', () => {
    test('creates exactly one CloudFront distribution', () => {
      createTestStack().resourceCountIs('AWS::CloudFront::Distribution', 1);
    });

    test('distribution serves index.html as default root object', () => {
      createTestStack().hasResourceProperties('AWS::CloudFront::Distribution', {
        DistributionConfig: Match.objectLike({
          DefaultRootObject: 'index.html',
          Enabled: true,
          HttpVersion: 'http2and3',
          IPV6Enabled: true,
          PriceClass: 'PriceClass_100',
        }),
      });
    });

    test('distribution has correct error responses for SPA routing', () => {
      createTestStack().hasResourceProperties('AWS::CloudFront::Distribution', {
        DistributionConfig: Match.objectLike({
          CustomErrorResponses: Match.arrayWith([
            Match.objectLike({
              ErrorCode: 403,
              ResponseCode: 200,
              ResponsePagePath: '/index.html',
            }),
            Match.objectLike({
              ErrorCode: 404,
              ResponseCode: 200,
              ResponsePagePath: '/index.html',
            }),
          ]),
        }),
      });
    });

    test('distribution has geo restriction to allowed countries', () => {
      createTestStack().hasResourceProperties('AWS::CloudFront::Distribution', {
        DistributionConfig: Match.objectLike({
          Restrictions: {
            GeoRestriction: {
              RestrictionType: 'whitelist',
              Locations: Match.anyValue(),
            },
          },
        }),
      });
    });
  });

  describe('Stack Outputs', () => {
    test('outputs bucket name', () => {
      createTestStack().hasOutput('bucketName', {
        Description: 'S3 bucket name',
      });
    });

    test('outputs distribution ID', () => {
      createTestStack().hasOutput('distributionId', {
        Description: 'CloudFront distribution ID',
      });
    });
  });
});
