# 1. The Qniapp is built as follows:
#   $ git clone https://github.com/qniapp/qni.git
#   $ cd qni
#   $ docker build -f Dockerfile . -t qni_server
# 2. Then run by:
#   $ docker run -p 3000:3000 --rm -it qni_server
# 3. access http://127.0.0.1:3000 in your browser

# Troubleshooting
#   If the port 3000 is already used, change 3000 to 4000 (for example)
#    $ docker run -p 4000:3000 --rm -it qni_server
#   and access http://127.0.0.1:4000 in your browser

# Inside VS Code with DevContainer
# open this directory with 'Dev Containers: Open Folder in Container'

FROM ubuntu:20.04

RUN apt update
RUN apt -y upgrade
RUN apt install -y sudo
RUN apt install -y tzdata
# set your timezone
ENV TZ Asia/Tokyo
RUN echo "${TZ}" > /etc/timezone \
  && rm /etc/localtime \
  && ln -s /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
  && dpkg-reconfigure -f noninteractive tzdata

RUN apt install -y build-essential
RUN apt install -y git wget time curl libssl-dev zlib1g-dev libpq-dev libgtk2.0-0 libnss3 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libgbm1
RUN apt install -y redis-server
RUN apt install -y ng-common ng-cjk emacs-nox
#RUN apt install -y postgresql postgresql-contrib

## node.js
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
RUN apt-get install -y nodejs

## npm
RUN curl -qL https://www.npmjs.com/install.sh | sh

## yarn
RUN npm install -g yarn

#COPY ./package.json /
#COPY ./yarn.lock /

RUN yarn
# RUN yarn build

## to start the dev server exec
## $ yarn dev

ENTRYPOINT ["/bin/bash"]
