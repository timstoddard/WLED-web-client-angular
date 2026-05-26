#!/bin/bash
set -e  # exit immediately if any command fails

## UPLOAD WEBSITE ##

# IMPORTANT: this script requires `jq` to be installed

# absolute path to script (used below)
PWD=$(pwd)
echo "PWD $PWD"

# output file from cloudfront-stack.ts
CDK_OUTPUT_FILE="$PWD/temp-cdk-output-data"
echo "CDK_OUTPUT_FILE $CDK_OUTPUT_FILE"

# built prod website static files
BUILT_FILES_DIR="../$1"
echo "BUILT_FILES_DIR $BUILT_FILES_DIR"

# debug - print the built files output
echo "ls -al $BUILT_FILES_DIR"
ls -al $BUILT_FILES_DIR

# constants
CACHE_IMMUTABLE='public, max-age=31536000, immutable'
CACHE_NO_STORE='no-cache, no-store, must-revalidate'
CACHE_PURGE_FAILURE_MESSAGE='[WARNING] Cache purge failed — deploy succeeded but caches may be stale'

# Syncs files of a specific type to S3 with explicit content-type and cache-control.
# Param 1: Local directory path
# Param 2: S3 bucket path
# Param 3: Glob pattern to include (e.g. '*.js')
# Param 4: Content-Type header value
# Param 5: (optional) Additional glob pattern to exclude after include (e.g. '*.json')
sync_type() {
  LOCAL_DIR=$1
  S3_DIR=$2
  INCLUDE_PATTERN=$3
  CONTENT_TYPE=$4
  EXCLUDE_PATTERN=${5:-}

  local cmd=(
    aws s3 sync "$LOCAL_DIR" "s3://$S3_DIR"
    --exclude '*'
    --include "$INCLUDE_PATTERN"
    --delete
    --content-type "$CONTENT_TYPE"
    --cache-control "$CACHE_IMMUTABLE"
  )

  if [ -n "$EXCLUDE_PATTERN" ]; then
    cmd+=(--exclude "$EXCLUDE_PATTERN")
  fi

  "${cmd[@]}"
}

# Uploads specified file types to S3 bucket.
# Param 1: Local directory path
# Param 2: S3 bucket path
upload_to_s3() {
  S3_DIR="$1"
  echo "upload_to_s3 $S3_DIR"

  # recursively delete all .DS_Store files
  find . -name '.DS_Store' -type f -delete

  # upload built files to s3

  # index html
  aws s3 cp "$BUILT_FILES_DIR/index.html" "s3://$S3_DIR/index.html" \
  --content-type 'text/html; charset=utf-8' \
  --cache-control "$CACHE_NO_STORE"

  # upload by content type
  sync_type "$BUILT_FILES_DIR" "$S3_DIR" '*.js'   'application/javascript; charset=utf-8' '*.json'
  sync_type "$BUILT_FILES_DIR" "$S3_DIR" '*.css'  'text/css; charset=utf-8'
  sync_type "$BUILT_FILES_DIR" "$S3_DIR" '*.json' 'application/json; charset=utf-8'
  sync_type "$BUILT_FILES_DIR" "$S3_DIR" '*.png'  'image/png'
  sync_type "$BUILT_FILES_DIR" "$S3_DIR" '*.svg'  'image/svg+xml'
  sync_type "$BUILT_FILES_DIR" "$S3_DIR" '*.ico'  'image/vnd.microsoft.icon'
}

setup() {
  # reads in env variables from .env file
  set -a # automatically export all variables
  source .env
  set +a
}

cleanup() {
  rm -rf "$CDK_OUTPUT_FILE"
}

# Deploys the CDK stack to AWS.
# Writes output to the provided file.
cdk_deploy() {
  cdk synth
  cdk deploy \
    --context BUILT_FILES_DIR="$BUILT_FILES_DIR" \
    --outputs-file "$CDK_OUTPUT_FILE"
}

# Extracts the bucket name and distribution id from the CDK output.
extract_cdk_output() {
  S3_BUCKET_NAME=$(cat "$CDK_OUTPUT_FILE" | jq -r '.[].bucketName')
  DISTRIBUTION_ID=$(cat "$CDK_OUTPUT_FILE" | jq -r '.[].distributionId')
}

# Purges CloudFront & CloudFlare caches.
purge_caches() {
  # purge cloudfront cache
  # TODO handle not logged into aws
  CLOUDFRONT_PURGE_CACHE_OUTPUT=$(aws cloudfront create-invalidation \
    --distribution-id "$DISTRIBUTION_ID" \
    --paths '/*')
  CLOUDFRONT_PURGE_CACHE_STATUS=$(echo "$CLOUDFRONT_PURGE_CACHE_OUTPUT" | jq -r '.Invalidation.Status')
  
  echo "[CloudFront] Cache purge status: $CLOUDFRONT_PURGE_CACHE_STATUS"

  # purge cloudflare cache
  CLOUDFLARE_PURGE_CACHE_OUTPUT=$(curl -X DELETE "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
  -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
  -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
  -H "Content-Type:application/json" \
  --data '{"purge_everything":true}')
  CLOUDFLARE_PURGE_CACHE_STATUS=$(echo "$CLOUDFLARE_PURGE_CACHE_OUTPUT" | jq -r '.success')

  echo "[CloudFlare] Cache purge status: success=$CLOUDFLARE_PURGE_CACHE_STATUS"
}

# main script logic
setup

cdk_deploy

extract_cdk_output

upload_to_s3 "$S3_BUCKET_NAME"

purge_caches || echo "$CACHE_PURGE_FAILURE_MESSAGE"

cleanup

# notification sound after script completes
# echo $'\a'
