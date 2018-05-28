#!/usr/bin/env bash

git ls-files | xargs zip ./.build/build.zip unzip
sshpass -p "$SSH_PASS" scp -rf ./.build/build.zip $SSH_USER@$SSH_HOST:/tmp/build.zip
sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST unzip /tmp/build.zip -d $SERVER_ROOT
rm -rf ./build/build.zip
