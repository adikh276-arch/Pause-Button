FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Create the subdirectory to match the base path
RUN mkdir -p /usr/share/nginx/html/pause_button

# Copy build artifacts to the subdirectory
COPY --from=builder /app/dist /usr/share/nginx/html/pause_button

# Remove default config and copy our custom config
RUN rm /etc/nginx/conf.d/default.conf
COPY vite-nginx.conf /etc/nginx/conf.d/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
