#!/bin/sh

# Print out current command and exit as soon as any line in the script fails
set -ex

if [ "$NODE_ENV" = "production" ]; then
  yarn install --no-cache --production
elif [ "$NODE_ENV" = "development" ]; then
  yarn install --no-cache
  touch yarn-error.log
  mkdir -p -m 777 build node_modules /home/node/.cache/yarn
  chown -R node:node build node_modules package.json yarn.lock yarn-error.log /home/node/.cache/yarn
fi
