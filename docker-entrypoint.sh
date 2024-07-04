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
cd /qni-gl/backend
gunicorn --daemon

# 任意のコマンドを実行
exec "$@"
