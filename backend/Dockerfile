# Reference: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

# This is our starting point, the base image we will build on top of
FROM node:latest

# Use LABEL to add metadata to the built image as key/value pairs
LABEL "maintainer"="johncmunson91@gmail.com"

# Reference build-time envs supplied by docker-compose, defaulting to 3000
ARG BACKEND_PORT=3000

# Create app directory
# All following commands, such as COPY, will be in relation to this directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied where available (npm@5+)
COPY package*.json ./
COPY yarn.lock ./

# If you are building your code for production
# RUN npm install --only=production
RUN npm install -g yarn
RUN yarn

# Bundle app source
COPY . .

# The app binds to AUTH_PORT so use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE $BACKEND_PORT

# Define the command to run your app using CMD which defines your runtime
CMD [ "yarn", "start" ]
