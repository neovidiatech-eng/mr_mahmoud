# --- Stage 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy Prisma schema, config, and generate client
COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN npx prisma generate

# Copy source code
COPY . .

# --- Stage 2: Runtime ---
FROM node:20-alpine
 
WORKDIR /app

# Non-root user for security
RUN addgroup -S nodejs && adduser -S mr_mahmoud -G nodejs
# Copy only what is needed from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src

# Required by Prisma CLI (migrate deploy) at runtime to resolve DATABASE_URL
COPY --from=builder /app/prisma.config.ts ./

# Install runtime dependencies and setup permissions
RUN apk add --no-cache openssl && \
    mkdir -p /app/src/uploads && \
    chown -R mr_mahmoud:nodejs /app/src/uploads && \
    chown -R mr_mahmoud:nodejs /app/node_modules /app/prisma /app/src

USER mr_mahmoud

# Ensure production environment
ENV NODE_ENV=production

EXPOSE 3013

# Run migrations and start app
CMD ["sh", "-c", "until npx prisma migrate deploy; do echo 'Waiting for database connection...'; sleep 3; done && npm start"]
