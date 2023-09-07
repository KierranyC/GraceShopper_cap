# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=16.17.1
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python

# Throw-away build stage to reduce the size of the final image
FROM base as build

# Create a directory for the React build files
WORKDIR /build

# Copy and install dependencies for the build
COPY --link package-lock.json package.json ./
RUN npm ci

# Copy the React application source code
COPY --link . .

# Build the React application
RUN npm run build

# Final stage for the app image
FROM base

# Copy the built React application from the build stage to the /app directory
COPY --from=build /build/build /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "npm", "run", "start" ]
