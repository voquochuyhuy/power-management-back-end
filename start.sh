#!/bin/bash

# Command execute when container start running
set -ex

# if [ "$NODE_ENV" = "production" ]; then
  NODE_ENV=production node app.js --port=3000 --verbose

# elif [ "$NODE_ENV" = "development" ]; then
#   echo "Hello Dev World"
#   ./node_modules/.bin/sails lift --port 1337 --verbose --silly --drop
# fi
