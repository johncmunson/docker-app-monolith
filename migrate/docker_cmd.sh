#!/bin/sh

# Run database migrations when the container boots up
npm run migrate

# The container needs some sort of process running to prevent it from exiting
# https://stackoverflow.com/a/30209974
tail -f /dev/null
