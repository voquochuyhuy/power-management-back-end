#!/bin/bash

#
# Use to run standalone
#

# Print out current command and exit as soon as any line in the script fails
set -ex

# Using Docker Hub as Repository
PROJECT_NAME="neuraldisplay"
IMAGE_NAME="power-mgmt-api"
VERSION="1.0.0"

NODE_ENV="${1:-development}"
ENV_FILE=.env

NAME="power-api"
DB_NAME="power-db"
NETWORK="power-network"


# Create network if not exist
if [ -z $(docker network ls --filter name=^${NETWORK}$ --format="{{ .Name }}") ] ; then
     docker network create ${NETWORK} ;
fi


# docker pull repo.treescale.com/vincentphan/${PROJECT_NAME}/$IMAGE_NAME:$VERSION

# ./_utils/start-postgres-container.sh

if [ "$NODE_ENV" = "production" ]; then
  # docker run -d \
  docker run \
  --name $NAME\
  --rm -it \
  --env-file=${ENV_FILE} \
  -p 3000:3000 \
  --link=${DB_NAME} \
  --network=${NETWORK} \
  $IMAGE_NAME:$VERSION

elif [ "$NODE_ENV" = "development" ]; then

  VERSION="$VERSION-dev"

  docker run \
  --name $NAME \
  --rm -it \
  --env-file=${ENV_FILE} \
  -p 1337:1337 \
  --volume ${PWD}:/usr/src/app \
  --link=${DB_NAME} \
  --network=${NETWORK} \
  $IMAGE_NAME:$VERSION
fi

# Debug if something wrong - exit code 1 @@!
# docker run -it --entrypoint /bin/bash $IMAGE_NAME:$VERSION -s
