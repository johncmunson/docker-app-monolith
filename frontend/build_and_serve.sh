#!/bin/sh

# We are using this script to build the frontend for production when the container boots up
# instead of doing this as a step in the Dockerfile. This is to ensure that CRA
# picks up environment vars prefixed with REACT_APP_. Technically, we could do
# this in the Dockerfile by using a bunch of ARG statements to define vars that
# are available only during the image build time, but that would be hard to
# maintain I think.
# If any .env variables change or get added, you will need to run `docker-compose build`
# before running `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`
yarn build
yarn serve
