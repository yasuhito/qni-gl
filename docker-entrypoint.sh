#!/bin/bash

# Exit the script if any command fails
set -e

# Build the Vite project
cd /qni-gl/vite
yarn build

# Start gunicorn
cd /qni-gl/backend
gunicorn --bind unix:/tmp/gunicorn.sock --daemon

# Start nginx
nginx

# Execute any passed command
exec "$@"
