#!/bin/bash

# エラーが発生した場合にスクリプトを終了する
set -e

# vite のビルド
cd /qni-gl/vite
yarn build

# gunicorn の起動
cd /qni-gl/backend
gunicorn --bind unix:/tmp/gunicorn.sock --daemon

# nginx の起動
nginx

# 任意のコマンドを実行
exec "$@"
