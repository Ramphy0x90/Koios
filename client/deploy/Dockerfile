FROM node:18-bullseye AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
ARG NG_BUILD_CONFIGURATION=production
ENV NG_BUILD_CONFIGURATION=${NG_BUILD_CONFIGURATION}
RUN if [ "$NG_BUILD_CONFIGURATION" = "production" ]; then npm run build-prod; else npm run build; fi

# Runtime image
FROM nginx:1.25-alpine

# Nginx config
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app
COPY --from=build /app/dist/koios /usr/share/nginx/html

EXPOSE 80


