# 1. The Qniapp is built as follows:
#   $ git clone https://github.com/qniapp/qni.git
#   $ cd qni
#   $ docker build -f Dockerfile . -t vite
# 2. Then run by:
#   $ docker run -p 5173:5173 --rm -it -v .:/qni vite
# 3. access http://127.0.0.1:5173 in your browser

# Inside VS Code with DevContainer
# open this directory with 'Dev Containers: Open Folder in Container'

# Playwrightの公式Dockerイメージを使用
FROM mcr.microsoft.com/playwright:v1.44.1-jammy

# Rails app lives here
WORKDIR /vite

RUN ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

# 必要な追加の依存関係をインストール
RUN apt update && \
    apt -y upgrade && \
    apt install -y sudo && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Node.jsのインストール
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && \
    apt install -y nodejs

# npmのインストール
RUN curl -qL https://www.npmjs.com/install.sh | sh

# yarnのインストール
RUN npm install -g yarn

# Copy application code
COPY . .

RUN yarn

# # エントリーポイントスクリプトをコピーし、実行権限を付与
# COPY docker-entrypoint.sh /usr/local/bin/
# RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# # 開発サーバーを開始するためのコマンド
# ENTRYPOINT ["docker-entrypoint.sh"]

# Start the server by default, this can be overwritten at runtime
EXPOSE 5173
CMD ["yarn", "dev", "--host"]
