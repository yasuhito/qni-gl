#!/bin/bash

# エラーが発生した場合にスクリプトを終了する
set -e

# vite ディレクトリに移動
cd /qni-gl/vite
yarn
yarn build

nginx

# 任意のコマンドを実行
exec "$@"
