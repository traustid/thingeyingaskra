FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Production execution stage
FROM nginx:alpine
# Copy compiled static files to Nginx directory
COPY --from=build /app/build/client /usr/share/nginx/html
# Copy custom Nginx configuration if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]