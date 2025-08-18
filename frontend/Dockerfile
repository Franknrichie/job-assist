# frontend/Dockerfile

# Build stage
FROM node:18 AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# Serve stage
FROM nginx:1.25-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 