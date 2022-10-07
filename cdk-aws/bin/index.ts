#!/usr/bin/env node
import { App, Tags } from 'aws-cdk-lib'
import { CloudFrontStack, CloudFrontStackProps } from '../lib/cloudfront-stack'

const app = new App()

// shared constants
const publicSSLCertificateArn = 'arn:aws:acm:us-east-1:114243598814:certificate/653a0d54-1df6-4d8c-828c-02b2996d96e0'

const websites: CloudFrontStackProps[] = [
  // TODO uncomment when ready
  // {
  //   websiteUrl: 'wled.io',
  //   websiteDescription: 'prod wled client',
  //   publicSSLCertificateArn,
  // },
  {
    websiteUrl: 'dev.wled.io',
    websiteDescription: 'dev wled client',
    publicSSLCertificateArn,
  },
]

for (const website of websites) {
  const {
    websiteUrl,
    websiteDescription,
    publicSSLCertificateArn,
  } = website
  // NOTE: bucket region will be `aws configure` setting
  const websiteInfraStack = new CloudFrontStack(app, 'CloudFrontStack', {
    websiteUrl,
    websiteDescription,
    publicSSLCertificateArn,
  })

  // Add a tag to all constructs in the stack
  Tags.of(websiteInfraStack).add('projectName', websiteUrl);
}
