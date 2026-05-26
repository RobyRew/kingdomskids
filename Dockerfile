# syntax=docker/dockerfile:1.10
# ─────────────────────────────────────────────────────────────────────────────
# Stage 1: build — Node 22 LTS
# ─────────────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

RUN apk add --no-cache --virtual .build-deps libc6-compat \
 && apk add --no-cache vips-dev

# npm install (not ci) + --legacy-peer-deps to survive missing lockfile
# OR peer-dep version clashes. Reproducible only when lockfile is committed.
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund --legacy-peer-deps --prefer-offline

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
