FROM node:20-alpine

WORKDIR /app

# Copy root + workspace manifests only
COPY package*.json ./
COPY frontend/package.json frontend/
COPY frontend/packages/*/package.json frontend/packages/*/
COPY frontend/apps/*/package.json frontend/apps/*/

# Single install for the whole monorepo
RUN npm ci --workspaces --include-workspace-root && npm cache clean --force

# Copy the rest of the source
COPY . .

# Build frontend applications using workspace
RUN cd frontend && npm install && npm run build

EXPOSE 8080

CMD ["node", "complete-platform-starter.js"]