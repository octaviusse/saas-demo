# Multi-stage Docker build for SaaS Dashboard Demo
# Stage 1: Build stage with Node.js and data generation
# Stage 2: Runtime stage with static file server

# ============================================
# Stage 1: Builder
# ============================================
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++ sqlite

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy application source
COPY . .

# Build arguments for environment variables
ARG POSTHOG_API_KEY
ARG POSTHOG_HOST
ARG APP_NAME="SaaS Demo"
ARG ENV="production"

# Set environment variables for build
ENV VITE_POSTHOG_API_KEY=${POSTHOG_API_KEY}
ENV VITE_POSTHOG_HOST=${POSTHOG_HOST}
ENV VITE_APP_NAME=${APP_NAME}
ENV VITE_ENV=${ENV}

# Create and seed SQLite database, then generate mock data
# - Create database file and schema using sqlite3 utility
# - Seed database using the provided Node script
# - Generate src/mockData.json from demo.db
RUN rm -f demo.db \
  && sqlite3 demo.db < schema.sql \
  && node scripts/seed-database.js \
  && node generate-mock-data.js

# Build application with Vite
RUN npm run build

# ============================================
# Stage 2: Runtime
# ============================================
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install serve for static file serving
RUN npm install -g serve@14.2.1

# Copy built static files from builder stage
COPY --from=builder /app/dist ./dist

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Run static file server
CMD ["serve", "-s", "dist", "-l", "3000", "--no-clipboard"]
