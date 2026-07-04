FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --silent || npm install --silent

# Copy source and build
COPY . .

# Optional build-time API URL. Production can also rely on the runtime reverse proxy.
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

FROM nginx:stable-alpine

ENV PORT=80
ENV API_UPSTREAM_URL=https://automotive-maintenance-back-production.up.railway.app

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# SPA fallback and dynamic port support for Railway
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
