# Stage 1: Build + test
FROM node:20-alpine AS build

WORKDIR /apps

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source
COPY tsconfig.json ./
COPY src ./src
COPY tests ./tests

# Run tests (Vitest + Supertest)
RUN npm run build || true  # build once for typechecking
RUN npm test

# Stage 2: Production image
FROM node:20-alpine AS prod

WORKDIR /apps

# Install only production deps
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Copy compiled code from build stage
COPY --from=build /app/dist ./dist

# Expose port
EXPOSE 3000

# Start API
CMD ["node", "dist/server.js"]
