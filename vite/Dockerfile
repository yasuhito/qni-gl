# 1. The Qniapp is built as follows:
#   $ git clone https://github.com/qniapp/qni.git
#   $ cd qni
#   $ docker build -f Dockerfile . -t qni_server
# 2. Then run by:
#   $ docker run -p 3000:3000 --rm -it -v .:/qni qni_server
# 3. access http://127.0.0.1:3000 in your browser

# Troubleshooting
#   If the port 3000 is already used, change 3000 to 4000 (for example)
#    $ docker run -p 4000:3000 --rm -it qni_server
#   and access http://127.0.0.1:4000 in your browser

# Inside VS Code with DevContainer
# open this directory with 'Dev Containers: Open Folder in Container'

# Playwrightの公式Dockerイメージを使用
FROM mcr.microsoft.com/playwright:v1.44.1-jammy

RUN ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

# 必要な追加の依存関係をインストール
RUN apt update && \
    apt -y upgrade && \
    apt install -y sudo tzdata build-essential git wget time curl libssl-dev zlib1g-dev libpq-dev libnss3 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libgbm1 redis-server

# タイムゾーンの設定
# ENV TZ=Asia/Tokyo
# RUN echo "${TZ}" > /etc/timezone && \
#     rm /etc/localtime && \
#     ln -s /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
#     dpkg-reconfigure -f noninteractive tzdata

# cirq のインストール
RUN apt install -y software-properties-common
RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt -y update
RUN apt install -y python3.8 pip

# set python 3 as the default python version
RUN update-alternatives --install /usr/bin/python python /usr/bin/python3 1 \
    && update-alternatives --install /usr/bin/pip pip /usr/bin/pip3 1
RUN pip3 install --upgrade pip requests setuptools pipenv

RUN python -m pip install --upgrade pip
RUN python -m pip install cirq

# ruby-build を使って任意の Ruby バージョンをインストール
RUN git clone --depth=1 https://github.com/rbenv/ruby-build
RUN PREFIX=/usr/local ./ruby-build/install.sh
RUN rm -rf ruby-build
RUN ruby-build 2.7.4 /usr/local

# backend/ で bundle するのに必要なライブラリをインストール
RUN apt install -y libyaml-dev

# Node.jsのインストール
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && \
    apt install -y nodejs

# npmのインストール
RUN curl -qL https://www.npmjs.com/install.sh | sh

# yarnのインストール
RUN npm install -g yarn

# エントリーポイントスクリプトをコピーし、実行権限を付与
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# 開発サーバーを開始するためのコマンド
ENTRYPOINT ["docker-entrypoint.sh"]

# デフォルトコマンドを設定
CMD ["/bin/bash"]
