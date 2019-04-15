#!/usr/bin/env bash

# See this stack-overflow answer for an overview of the
# strategy being used to employ environment variables
# in the nginx config file.
# https://serverfault.com/a/919212
envsubst '${PROXY_PORT} ${FRONTEND_PORT} ${BACKEND_PORT}' < nginx.conf.template > nginx.conf
nginx -g "daemon off;"
