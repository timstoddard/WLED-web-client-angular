#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { CloudFrontStack } from '../lib/cloudfront-stack'

const app = new cdk.App()

// shared constants
const publicSSLCertificateArn = 'arn:aws:acm:us-east-1:114243598814:certificate/653a0d54-1df6-4d8c-828c-02b2996d96e0'

// Note to user, bucket region will be `aws configure` setting
new CloudFrontStack(app, 'CloudFrontStack', {
  websiteUrl: 'dev.wled.io',
  websiteDescription: 'dev wled client',
  publicSSLCertificateArn,
})

// TODO uncomment when ready
/*new CloudFrontStack(app, 'CloudFrontStack', {
  websiteUrl: 'wled.io',
  websiteDescription: 'wled client',
  publicSSLCertificateArn,
})*/
