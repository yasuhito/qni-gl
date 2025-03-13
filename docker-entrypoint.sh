#!/bin/bash

# Exit the script if any command fails
set -e

# Set PYTHONPATH to include the qni module
export PYTHONPATH=/qni-gl/backend/src:$PYTHONPATH

# Build the Vite project
cd /qni-gl/frontend
# VITE_USE_GPU=true yarn build
yarn build

# Start gunicorn
cd /qni-gl/backend
uv run gunicorn --bind unix:/tmp/gunicorn.sock --daemon

# Start nginx
nginx

# Execute any passed command
cd /qni-gl
exec "$@"
