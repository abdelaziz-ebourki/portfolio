# Portfolio UI — multi-stage build (Vite SPA + nginx).
# Build context is ui/. Tests/lint run in CI and locally via npm;
# the image build only compiles the production bundle.
FROM node:22-alpine AS build
WORKDIR /build

# Dependency layer first: re-runs only when manifests change.
COPY package.json package-lock.json ./
RUN npm ci

# Application layer: re-runs on every source change.
COPY . ./
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s --retries=5 \
  CMD wget -qO- http://127.0.0.1/ | grep -q "<!doctype html>"

ENTRYPOINT ["nginx", "-g", "daemon off;"]
