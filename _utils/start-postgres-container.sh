#!/bin/sh

NAME="power-db"

docker run \
  --name ${NAME} \
  --hostname ${NAME} \
  -d --rm -it \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=first \
  -e POSTGRES_USER=first \
  -e POSTGRES_DB=power \
  --network=power-network \
  postgres:9.6.13-alpine
