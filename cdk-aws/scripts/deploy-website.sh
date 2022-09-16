## UPLOAD WEBSITE ##

# This script should be run from the top level directory:
# > ./scripts/upload-website.sh 

upload_to_s3 () {
  LOCAL_DIR="$1"
  S3_DIR="$2"

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

# same as S3_BUCKET_NAME_FILE in cloudfront-stack.ts
S3_BUCKET_NAME_FILE="./output-s3-bucket-name"

# run cdk to create an S3 bucket with a unique name, and rest of infra for serving website files
cdk synth
cdk deploy
S3_BUCKET_NAME=$(cat $S3_BUCKET_NAME_FILE)

# upload files to S3
# TODO make this not a relative path
DIST_DIR="../dist/WLED-Web-Client"
echo "upload_to_s3 $DIST_DIR $S3_BUCKET_NAME"
upload_to_s3 $DIST_DIR $S3_BUCKET_NAME
