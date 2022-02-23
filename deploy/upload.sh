upload_to_s3 () {
  # recursively delete all .DS_Store files
  find . -name '.DS_Store' -type f -delete

  # remove old built files before uploading new ones
  aws s3 rm $1 --recursive

  # upload built files to s3
  BUILD_DIR=dist/WLED-Web-Client
  aws s3 cp $BUILD_DIR/index.html $1/index.html --content-type 'text/html; charset=utf-8'
  aws s3 cp $BUILD_DIR $1 --recursive --exclude '*' --include '*.js' --content-type 'application/javascript; charset=utf-8'
  aws s3 cp $BUILD_DIR $1 --recursive --exclude '*' --include '*.css' --content-type 'text/css; charset=utf-8'
  aws s3 cp $BUILD_DIR $1 --recursive --exclude '*' --include '*.txt' --content-type 'text/plain; charset=utf-8'

  # images
  aws s3 cp $BUILD_DIR $1 --recursive --exclude '*' --include '*.ico' --content-type 'image/vnd.microsoft.icon'
}
