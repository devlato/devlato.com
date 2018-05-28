#!/usr/bin/env bash

export SSHPASS=$SSH_PASS
export LOCAL_ARCHIVE=./.build/release.zip
export REMOTE_ARCHIVE=/tmp/release.zip

echo Creating the archive...
git ls-files | xargs zip $LOCAL_ARCHIVE

echo Copying the archive to the remote host...
sshpass -e scp -vr $LOCAL_ARCHIVE $SSH_USER@$SSH_HOST:$REMOTE_ARCHIVE

echo Extracting the files from the archive...
sshpass -e ssh SSH_USER@$SSH_HOST unzip $REMOTE_ARCHIVE -d $SERVER_ROOT

echo Removing the remove archive...
sshpass -e ssh SSH_USER@$SSH_HOST rm -rf $REMOTE_ARCHIVE

echo Removing the local archive...
rm -rf $LOCAL_ARCHIVE

echo Done.
