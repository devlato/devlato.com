#!/usr/bin/env bash

export SSHPASS=$SSH_PASS
export BUILD_DIR=./.build
export VERSION_FILE=$BUILD_DIR/version.txt
export LOCAL_ARCHIVE=$BUILD_DIR/release.zip
export REMOTE_ARCHIVE=/tmp/release.zip

export HEAD_COMMIT=$TRAVIS_COMMIT

echo Creating the build directory...
mkdir -p $BUILD_DIR

echo Copying files to the build directory...
git ls-files | xargs -IFILE bash -c 'export file=FILE; mkdir -p build/$( dirname $file ); cp -R $file build/$file'

echo Generating the local version file...
echo $HEAD_COMMIT > $VERSION_FILE

echo Creating the archive...
zip -r $LOCAL_ARCHIVE $BUILD_DIR

echo Copying the archive to the remote host...
sshpass -e scp -vr $LOCAL_ARCHIVE $SSH_USER@$SSH_HOST:$REMOTE_ARCHIVE

echo Extracting the files from the archive...
sshpass -e ssh -v SSH_USER@$SSH_HOST unzip $REMOTE_ARCHIVE -d $SERVER_ROOT

echo Removing the remove archive...
sshpass -e ssh -v SSH_USER@$SSH_HOST rm -rf $REMOTE_ARCHIVE

echo Removing the build directory...
rm -rf $BUILD_DIR

echo Done.
