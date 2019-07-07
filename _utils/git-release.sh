#!/bin/bash

# Print out current command and exit as soon as any line in the script fails
set -ex

# source ./constants.sh .

# ensure there are no uncommitted changes
git diff-index --quiet HEAD -- || { echo "Please commit changes before deploy" >&2; exit 1; }

# derive variables
branch="$(git symbolic-ref --short HEAD)"
timestamp="$(date +%Y%m%dT%H%M%S)"

# do work on a separate branch
git checkout -b "deploy/$timestamp" &&

# build the app
yarn build &&

# force checkin the build
git add ./.next --force &&
git commit -am "Adding production build" &&

# deploy the branch (uses git under the hood)
eb deploy "prod" &&
echo "Deployment completed successfully"

# switch back to main branch
git checkout $branch
