#!/bin/bash

SRC=./dist
# 系统用户
USER=bootapp
# 目标主机
HOST=10.32.226.7
# 目标目录
DEST=/export/www/dse

function deploy() {
    echo 'Build files...';
    # Build
    npm run build

    ssh $USER@$HOST "rm -fr $DEST/*"
    scp -r $SRC/* "$USER@$HOST:$DEST/"

    # # Rsync
    # echo 'Rsync dist files...'
    # rsync -rltDPczv \
    #     --delete \
    #     --exclude=deploy.sh \
    #     ${SRC} ${USER}@${HOST}:${DEST}

    # Clean
    echo 'Clean files...'
    rm -fr $SRC

    echo 'OK.'
}

deploy