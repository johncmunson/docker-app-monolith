# Reference: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

# This is our starting point, the base image we will build on top of
FROM node:latest

# Use LABEL to add metadata to the built image as key/value pairs
LABEL "maintainer"="johncmunson91@gmail.com"

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

# Default command to run when the container initializes
CMD [ "sh", "docker_cmd.sh" ]
