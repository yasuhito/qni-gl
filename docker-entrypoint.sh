#!/bin/bash

# エラーが発生した場合にスクリプトを終了する
set -e

# vite のビルド
cd /qni-gl/vite
yarn
yarn build

# nginx の起動
nginx

# 任意のコマンドを実行
exec "$@"
