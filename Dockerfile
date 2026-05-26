# syntax=docker/dockerfile:1.10
# ─────────────────────────────────────────────────────────────────────────────
# Stage 1: build — Node 22 LTS
# ─────────────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

# Keep build tools but DO NOT install vips-dev. Installing system libvips
# tells sharp "compile yourself against my libvips", and that path needs
# node-addon-api + node-gyp toolchain bits. We want the prebuilt sharp
# binaries instead — they're already on linux/x64/musl on npm.
RUN apk add --no-cache --virtual .build-deps libc6-compat python3 make g++

# Force sharp to fetch its prebuilt binary for the container's platform
# instead of inheriting whatever the lockfile recorded (likely darwin/arm64
# from the Mac that generated it).
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1
ENV npm_config_arch=x64
ENV npm_config_platform=linux
ENV npm_config_libc=musl

# `--no-package-lock` so npm resolves fresh against the env above instead
# of replaying the lockfile's platform-locked entries. Trades reproducibility
# for cross-platform builds — acceptable for a static site rebuilt on push.
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund --legacy-peer-deps --prefer-offline --no-package-lock

COPY . .
RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2: serve — unprivileged nginx
# ─────────────────────────────────────────────────────────────────────────────
FROM nginxinc/nginx-unprivileged:1.29-alpine AS runtime

USER root
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html
USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8080/en/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
