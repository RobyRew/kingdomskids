# syntax=docker/dockerfile:1.10
# ─────────────────────────────────────────────────────────────────────────────
# Stage 1: build (Node only at build time) — Node 22 LTS
# ─────────────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

# Build toolchain (safety net for any package that compiles from source).
RUN apk add --no-cache --virtual .build-deps libc6-compat python3 make g++

COPY package.json package-lock.json* ./

# Tell npm to fetch the correct native binaries for this image
# (Tailwind v4 -> lightningcss / @tailwindcss/oxide, and sharp) instead of
# the darwin-arm64 ones pinned in the macOS-generated lockfile.
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1
ENV npm_config_arch=x64
ENV npm_config_platform=linux
ENV npm_config_libc=musl

# Install WITHOUT the lockfile so npm resolves linux/musl platform binaries
# rather than replaying the host platform's pins.
RUN npm install --no-audit --no-fund --no-package-lock

# Copy the rest and build (runs `astro check && astro build`).
COPY . .
RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2: serve — unprivileged nginx (no Node at runtime, no root)
# ─────────────────────────────────────────────────────────────────────────────
FROM nginxinc/nginx-unprivileged:1.29-alpine AS runtime

# nginx-unprivileged runs as UID 101 (`nginx`); root only for setup.
USER root
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html
USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
