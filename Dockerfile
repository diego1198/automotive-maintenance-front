FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --silent || npm install --silent

# Copy source and build
COPY . .

# Log the build-time API variables so Railway config can be verified quickly.
ARG VITE_API_URL
ARG API_VITE_URL

RUN API_URL_TO_USE="${VITE_API_URL:-$API_VITE_URL}"; \
	echo "VITE_API_URL=${VITE_API_URL:-<empty>}" && \
	echo "API_VITE_URL=${API_VITE_URL:-<empty>}" && \
	echo "Using API URL: ${API_URL_TO_USE:-<default production URL>}" && \
	VITE_API_URL="$API_URL_TO_USE" npm run build

FROM nginx:stable-alpine

ENV PORT=80

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# SPA fallback and dynamic port support for Railway
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
