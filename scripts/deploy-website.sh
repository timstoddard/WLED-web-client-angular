## UPLOAD WEBSITE ##

# IMPORTANT: this script requires `jq` to be installed

# TODO this should be a script param
# built prod website static files
BUILT_FILES_DIR='dist/WLED-Web-Client'
# TODO use fewer vars for file name... (ideally 1)
# output file from cloudfront-stack.ts
BASE_OUTPUT_FILE='cdk-output-data'
CDK_OUTPUT_DATA_FILE_INNER="../$BASE_OUTPUT_FILE"
CDK_OUTPUT_DATA_FILE="./$BASE_OUTPUT_FILE"

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

# Deploys the CDK stack to AWS.
# Writes output to the provided file.
cdk_deploy() {
  cd cdk-aws
  cdk synth
  cdk deploy --outputs-file $CDK_OUTPUT_DATA_FILE_INNER
  cd ..
}

# Extracts the bucket name and distribution id from the CDK output.
extract_cdk_output() {
  S3_BUCKET_NAME=$(cat $CDK_OUTPUT_DATA_FILE | jq -r '.[].bucketName')
  DISTRIBUTION_ID=$(cat $CDK_OUTPUT_DATA_FILE | jq -r '.[].distributionId')
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
  ts-node-esm ./scripts/cloudflare-purge-cache.ts
}


cdk_deploy

extract_cdk_output

upload_to_s3 $BUILT_FILES_DIR $S3_BUCKET_NAME

purge_caches

# notification sound after script completes
# echo $'\a'
