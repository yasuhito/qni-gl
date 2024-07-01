#!/bin/bash

# エラーが発生した場合にスクリプトを終了する
set -e

# Railsサーバーの起動
# cd /qni-gl/backend_rails
# bundle install
# ./bin/rails s -d -b 0.0.0.0

# vite ディレクトリに移動
cd /qni-gl/vite
yarn
yarn build

# 任意のコマンドを実行
exec "$@"
