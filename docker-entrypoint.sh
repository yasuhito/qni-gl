#!/bin/bash

# エラーが発生した場合にスクリプトを終了する
set -e

# vite のビルド
cd /qni-gl/vite
yarn
yarn build

# nginx の起動
nginx

# gunicorn の起動
cd /qni-gl/backend
gunicorn --bind unix:/tmp/gunicorn.sock --daemon

# 任意のコマンドを実行
exec "$@"
