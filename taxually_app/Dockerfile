# Use the official Node.js image as the base image
FROM node:20.13.1

# Set the working directory inside the container
WORKDIR /app

# Argument for build environment
ARG BUILD_ENVIRONMENT

# Set environment variables based on the build argument
ENV NODE_ENV=$BUILD_ENVIRONMENT

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install npm version 10.8.1
RUN npm install -g npm@10.8.1

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Install the Stripe CLI version 1.19.5
RUN curl -L https://github.com/stripe/stripe-cli/releases/download/v1.19.5/stripe_1.19.5_linux_x86_64.tar.gz -o stripe.tar.gz && \
    tar -xzf stripe.tar.gz && \
    mv stripe /usr/local/bin/stripe && \
    rm stripe.tar.gz

# Expose the port the app runs on
EXPOSE 8080

# Start the application
CMD ["npm", "start"]