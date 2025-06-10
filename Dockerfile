FROM node:20-alpine

WORKDIR /app

# Use workspace-enabled package.json for Docker build
COPY package-workspace.json ./package.json
COPY frontend/package.json frontend/
COPY frontend/apps/*/package.json frontend/apps/*/

# Single install for the whole monorepo
RUN npm ci --workspaces --include-workspace-root && npm cache clean --force

# Build every workspace that has a build script
RUN npm run build --workspaces --if-present

# Copy the rest of the source
COPY . .

EXPOSE 8080

CMD ["node", "complete-platform-starter.js"]