#!/bin/bash

## UPLOAD WEBSITE ##

# IMPORTANT: this script requires `jq` to be installed

# built prod website static files
BUILT_FILES_DIR=$1
echo "BUILT_FILES_DIR $BUILT_FILES_DIR"
# absolute path to script (used below)
PWD=$(pwd)
echo "PWD $PWD"
# output file from cloudfront-stack.ts
CDK_OUTPUT_FILE="$PWD/cdk-output-data"

# Uploads specified file types to S3 bucket.
# Param 1: Local directory path
# Param 2: S3 bucket path
upload_to_s3() {
  LOCAL_DIR=$1
  S3_DIR=$2
  echo "upload_to_s3 $LOCAL_DIR $S3_DIR"

  # recursively delete all .DS_Store files
  find . -name '.DS_Store' -type f -delete

  # upload built files to s3

  # remove old built files before uploading new ones
  aws s3 rm s3://$S3_DIR --recursive

  # index html
  aws s3 cp $LOCAL_DIR/index.html s3://$S3_DIR/index.html --content-type 'text/html; charset=utf-8'

  # js files
  aws s3 cp $LOCAL_DIR s3://$S3_DIR --recursive \
    --content-type 'application/javascript; charset=utf-8' \
    --exclude '*' \
    --include '*.js' \
    --exclude '*.json' # exclude json files which match '*.js'
  # css files
  aws s3 cp $LOCAL_DIR s3://$S3_DIR --recursive \
    --content-type 'text/css; charset=utf-8' \
    --exclude '*' \
    --include '*.css'
  # json files
  aws s3 cp $LOCAL_DIR s3://$S3_DIR --recursive \
    --content-type 'application/json; charset=utf-8' \
    --exclude '*' \
    --include '*.json'
  # png files
  aws s3 cp $LOCAL_DIR s3://$S3_DIR --recursive \
    --content-type 'image/png' \
    --exclude '*' \
    --include '*.png'
  # svg files
  aws s3 cp $LOCAL_DIR s3://$S3_DIR --recursive \
    --content-type 'image/svg+xml' \
    --exclude '*' \
    --include '*.svg'
  # ico files (favicon)
  aws s3 cp $LOCAL_DIR s3://$S3_DIR --recursive \
    --content-type 'image/vnd.microsoft.icon' \
    --exclude '*' \
    --include '*.ico'

  # TODO get this to work
  # only upload new/modified media files
  # aws s3 sync media s3://$S3_DIR/media
}

setup() {
  # reads in env variables from .env file
  set -a # automatically export all variables
  source .env
  set +a
}

cleanup() {
  rm -rf $CDK_OUTPUT_FILE
}

# Deploys the CDK stack to AWS.
# Writes output to the provided file.
cdk_deploy() {
  cd cdk-aws
  cdk synth
  cdk deploy --outputs-file $CDK_OUTPUT_FILE
  cd ..
}

# Extracts the bucket name and distribution id from the CDK output.
extract_cdk_output() {
  S3_BUCKET_NAME=$(cat $CDK_OUTPUT_FILE | jq -r '.[].bucketName')
  DISTRIBUTION_ID=$(cat $CDK_OUTPUT_FILE | jq -r '.[].distributionId')
}

# Purges CloudFront & CloudFlare caches.
purge_caches() {
  # purge cloudfront cache
  # TODO handle not logged into aws
  CLOUDFRONT_PURGE_CACHE_OUTPUT=$(aws cloudfront create-invalidation \
    --distribution-id $DISTRIBUTION_ID \
    --paths '/*')
  CLOUDFRONT_PURGE_CACHE_STATUS=$(echo $CLOUDFRONT_PURGE_CACHE_OUTPUT | jq -r '.Invalidation.Status')
  
  echo "[CloudFront] Cache purge status: $CLOUDFRONT_PURGE_CACHE_STATUS"

  # purge cloudflare cache
  CLOUDFLARE_PURGE_CACHE_OUTPUT=$(curl -X DELETE "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
  -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
  -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
  -H "Content-Type:application/json" \
  --data '{"purge_everything":true}')
  CLOUDFLARE_PURGE_CACHE_STATUS=$(echo $CLOUDFLARE_PURGE_CACHE_OUTPUT | jq -r '.success')

  echo "[CloudFlare] Cache purge status: success=$CLOUDFLARE_PURGE_CACHE_STATUS"
}

# main script logic
setup

cdk_deploy

extract_cdk_output

upload_to_s3 $BUILT_FILES_DIR $S3_BUCKET_NAME

purge_caches

cleanup

# notification sound after script completes
# echo $'\a'
