FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --silent || npm install --silent

# Copy source and build
COPY . .

# Allow passing the public API URL at build time.
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN test -n "$VITE_API_URL" || (echo "VITE_API_URL is required for production builds" && exit 1)

RUN npm run build

FROM nginx:stable-alpine

ENV PORT=80

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# SPA fallback and dynamic port support for Railway
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
