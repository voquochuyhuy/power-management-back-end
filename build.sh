#!/bin/bash

# Print out current command and exit as soon as any line in the script fails
set -ex

# Using Docker Hub as Repository
PROJECT_NAME="neuraldisplay"
IMAGE_NAME="power-mgmt-api"
VERSION="1.0.0"

# NODE_ENV="${1:-development}"

# if [ "$NODE_ENV" = "development" ]; then
#   VERSION="$VERSION-dev"
# fi

# Remove first
# docker rmi $IMAGE_NAME:$VERSION -f


# Override buildtime variables
  # --build-arg NODE_ENV=$NODE_ENV \
docker build \
  -t $IMAGE_NAME:$VERSION \
  -f ./Dockerfile .

# docker tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]
# docker tag $IMAGE_NAME:$VERSION ${PROJECT_NAME}/$IMAGE_NAME:$VERSION
# docker tag $IMAGE_NAME:$VERSION repo.treescale.com/vincentphan/$IMAGE_NAME

# docker push repo.treescale.com/vincentphan/$IMAGE_NAME




# Copy SSH keys for Docker builder to pull code from private repositories.
# \cp -Rf ~/.ssh ./.ssh

# Delete ssh key after use
# \rm -rf ./.ssh
