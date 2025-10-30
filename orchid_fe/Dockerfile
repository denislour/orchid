FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install --no-frozen-lockfile

COPY . .

RUN pnpm build

FROM node:18-alpine

RUN apk add --no-cache curl

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Create a simple static file server
RUN echo 'const express = require("express"); const app = express(); app.use(express.static("dist")); app.get("/health", (req, res) => res.status(200).send("healthy")); app.listen(3000, () => console.log("Server running on port 3000"));' > server.js && \
    npm install express

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
