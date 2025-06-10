FROM node:20-alpine

WORKDIR /app

# Install root dependencies first
COPY package*.json ./
RUN npm ci --ignore-scripts && npm cache clean --force

# Copy source files
COPY . .

# Remove workspace dependencies to avoid protocol errors
RUN node build-fix-workspace-deps.js

# Build apps individually without workspace dependencies
RUN cd frontend/apps/super-admin && npm install --legacy-peer-deps && npm run build
RUN cd frontend/apps/admin-portal && npm install --legacy-peer-deps && npm run build
RUN cd frontend/apps/ecommerce-web && npm install --legacy-peer-deps && npm run build
RUN cd frontend/apps/ecommerce-mobile && npm install --legacy-peer-deps && npm run build
RUN cd frontend/apps/ops-delivery && npm install --legacy-peer-deps && npm run build

EXPOSE 8080

CMD ["node", "complete-platform-starter.js"]