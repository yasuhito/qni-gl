# Note:
# The default command starts the Vite server using `yarn dev`.
# You can override this default command using `docker run` with a different command.
#
# Examples:
# 1. Build the Docker image:
#    docker build -f Dockerfile . -t qni-gl
#    - This command builds the Docker image using the Dockerfile in the current directory and tags it as `qni-gl`.
#
# 2. Start an interactive bash session inside the container:
#    docker run -p 8000:8000 --rm -it qni-gl /bin/bash
#    - This will start a bash session instead of the Vite server.
#    - Useful for debugging or running other commands manually.
#
# 3. Start the Vite server with the source code mounted from the host:
#    docker run -p 8000:8000 --rm -it -v $(pwd):/qni-gl qni-gl
#    - The `-v $(pwd):/qni-gl` option mounts the current directory from the host to the container.
#    - This allows you to edit files on your host and see changes immediately in the container.
#
# 4. Run a different command inside the container:
#    docker run -p 8000:8000 --rm -it qni-gl /bin/bash -c "yarn build"
#    - This will execute `yarn build` inside the container instead of the default `yarn dev`.
#
# 5. Run the container without mounting the source code:
#    docker run -p 8000:8000 --rm -it qni-gl
#    - This will start the Vite server using the code copied into the container during the build.

# Use the official Playwright Docker image
FROM mcr.microsoft.com/playwright:v1.45.3-jammy

# Set the timezone
RUN ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

# Install necessary dependencies
RUN apt-get update && \
  apt-get -y upgrade && \
  apt-get install -y --no-install-recommends libssl-dev zlib1g-dev libnss3

# Setup Python and install cirq
RUN apt-get install -y --no-install-recommends software-properties-common && \
  add-apt-repository ppa:deadsnakes/ppa && \
  apt-get -y update && \
  apt-get install -y --no-install-recommends python3.8 python3-pip && \
  update-alternatives --install /usr/bin/python python /usr/bin/python3.8 1 && \
  update-alternatives --install /usr/bin/pip pip /usr/bin/pip3 1 && \
  pip install --upgrade pip requests setuptools pipenv cirq gunicorn flask-cors

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
  apt-get install -y --no-install-recommends nodejs

# Install npm
RUN curl -qL https://www.npmjs.com/install.sh | sh

# Install yarn
RUN npm install -g yarn

# Install nginx and other dependencies
RUN apt-get install -y --no-install-recommends nginx apache2-utils python3-flask && \
  rm -rf /var/lib/apt/lists/* /var/cache/apt/archives

# Prepare nginx configuration
COPY backend/merged.conf /etc/nginx/conf.d/
RUN htpasswd -bc /etc/nginx/.htpasswd userA passA

# Copy the source code
RUN mkdir /qni-gl
COPY . /qni-gl

# Copy the entrypoint script and set permissions
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]

# Install dependencies
WORKDIR /qni-gl/frontend
RUN yarn

CMD ["/bin/bash"]
