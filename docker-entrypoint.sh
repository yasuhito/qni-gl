#!/bin/bash

# エラーが発生した場合にスクリプトを終了する
set -e

# vite のビルド
cd /qni-gl/vite
yarn
yarn build

# nginx の起動
nginx

# uWSGI の起動
uwsgi --chdir /qni-gl/backend --ini /qni-gl/backend/backend.ini --uid uwsgiuser --gid uwsgiuser --master --daemonize /var/log/uwsgi.log

# 任意のコマンドを実行
exec "$@"
