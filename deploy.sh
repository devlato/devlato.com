#!/usr/bin/env bash

export HEAD_COMMIT=$TRAVIS_COMMIT
export SSHPASS=$SSH_PASS

export BUILD_ROOT=$( pwd )/build
export RELEASE_DIR=$BUILD_ROOT/release-$HEAD_COMMIT
export VERSION_FILE=$RELEASE_DIR/version.txt
export LOCAL_ARCHIVE=$BUILD_ROOT/release-$HEAD_COMMIT.zip
export REMOTE_ARCHIVE=/tmp/release-$HEAD_COMMIT.zip

echo -e \\nInitialized with variables:
echo HEAD_COMMIT=$HEAD_COMMIT
echo BUILD_ROOT=$BUILD_ROOT
echo RELEASE_DIR=$RELEASE_DIR
echo VERSION_FILE=$VERSION_FILE
echo LOCAL_ARCHIVE=$LOCAL_ARCHIVE
echo REMOTE_ARCHIVE=$REMOTE_ARCHIVE
echo SERVER_ROOT=$SERVER_ROOT
echo SSH_USER=$SSH_USER
echo SSH_HOST=$SSH_HOST

echo -e \\nRemoving the previous build directory...
rm -rf $RELEASE_DIR

echo -e \\nCreating the build directory...
mkdir -p $RELEASE_DIR

echo -e \\nCopying files to the build directory...
git ls-files | \
xargs -IFILE bash -c '\
  export file=FILE; \
  mkdir -p $RELEASE_DIR/$( dirname $file ); \
  cp -R $file $RELEASE_DIR/$file\
'

echo -e \\nGenerating the local version file...
echo -n $HEAD_COMMIT > $VERSION_FILE

echo -e \\nCreating the archive...
cd $RELEASE_DIR
zip -r $LOCAL_ARCHIVE .
cd -

echo -e \\nCopying the archive to the remote host...
sshpass -e scp -vr $LOCAL_ARCHIVE $SSH_USER@$SSH_HOST:$REMOTE_ARCHIVE

echo -e \\nExtracting the files from the archive...
sshpass -e ssh -v $SSH_USER@$SSH_HOST unzip -o $REMOTE_ARCHIVE -d $SERVER_ROOT

echo -e \\nRemoving the remote archive...
sshpass -e ssh -v $SSH_USER@$SSH_HOST rm -rf $REMOTE_ARCHIVE

echo -e \\nRemoving the build directory...
rm -rf $BUILD_ROOT

echo -e \\nDone.
