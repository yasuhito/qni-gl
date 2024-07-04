# イメージのビルド
#   docker build -f Dockerfile.flask-test . -t qni-gl-flask
# イメージの実行
#   docker run -p 8000:8000 -p 9323:9323 --rm -it -v .:/qni-gl qni-gl-flask

# Playwright の公式 Docker イメージを使用
FROM mcr.microsoft.com/playwright:v1.44.1-jammy

# タイムゾーンの設定
RUN ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

RUN mkdir /qni-gl
COPY . /qni-gl

# 必要な追加の依存関係をインストール
RUN apt update && \
  apt -y upgrade && \
  apt install -y libssl-dev zlib1g-dev libnss3

# Python のセットアップと cirq のインストール
RUN apt install -y software-properties-common && \
  add-apt-repository ppa:deadsnakes/ppa && \
  apt -y update && \
  apt install -y python3.8 python3-pip && \
  update-alternatives --install /usr/bin/python python /usr/bin/python3.8 1 && \
  update-alternatives --install /usr/bin/pip pip /usr/bin/pip3 1 && \
  pip install --upgrade pip requests setuptools pipenv cirq gunicorn flask-cors

# Node.jsのインストール
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
  apt install -y nodejs

# npmのインストール
RUN curl -qL https://www.npmjs.com/install.sh | sh

# yarnのインストール
RUN npm install -g yarn

# nginx 等のインストール
RUN apt install -y nginx apache2-utils uwsgi python3-flask uwsgi-plugin-python3 && \
  rm -rf /var/lib/apt/lists/* /var/cache/apt/archives

# nginx 用の設定ファイルを準備
COPY backend/merged.conf /etc/nginx/conf.d/
RUN htpasswd -bc /etc/nginx/.htpasswd userA passA

# vite のビルドと nginx の起動
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]

# uWSGI を起動
CMD ["/bin/bash"]
