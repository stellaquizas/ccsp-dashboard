# Build stage
FROM node:18-alpine as build-stage

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage

# Copy built files to nginx server
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy a default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

# Expose the port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 