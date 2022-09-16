# AWS CDK Project: Static Website Infrastructure

Creates a CloudFront distribution associated with the following resources:
- an S3 bucket to serve website files from
- an origin access identity for CloudFront to access the bucket
- a public SSL certificate for the website's custom domain name (user must provide the ARN of this)

The `cdk.json` file tells the CDK Toolkit how to execute the app.

## Useful commands

* `npm run deploy`  custom command, builds & deploys the stack to AWS
* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
