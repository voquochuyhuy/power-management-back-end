#!/bin/bash

# Print out current command and exit as soon as any line in the script fails
set -ex
set -o errexit
set -o pipefail

PROJECT_NAME="neuraldisplay"
IMAGE_NAME="power-mgmt-api"
VERSION="1.0.0"

API_NAME="power-api"
DB_NAME="power-db"
NETWORK="power-network"

stackname='infras'
volPath=/gendocker/volumes
nginxPath=$volPath/nginx-conf-vol
postgresPath=$volPath/postgres-vol
