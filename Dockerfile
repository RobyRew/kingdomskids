# syntax=docker/dockerfile:1.10
FROM node:22-alpine AS build
WORKDIR /app
RUN apk add --no-cache --virtual .build-deps libc6-compat python3 make g++
COPY package.json package-lock.json* ./
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1
ENV npm_config_arch=x64
ENV npm_config_platform=linux
ENV npm_config_libc=musl
RUN npm install --no-audit --no-fund --no-package-lock
COPY . .
RUN npm run build

# Shared runtime, replacing an 89-line nginx.conf that duplicated the
# portfolio's almost exactly. See RobyRew/platform.
FROM ghcr.io/robyrew/static-web:1
# Astro emits extensionless URLs. $uri is escaped because Docker substitutes
# variables in ENV and an undefined $uri would leave "/index.html .html =404".
ENV WEB_FALLBACK="\$uri/index.html \$uri.html =404"
COPY --chown=nginx:nginx nginx/app.d/ /etc/nginx/robyrew/app.d/
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html
