# =============================================================================
# Stage 1 — deps: install production + dev dependencies
# =============================================================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# =============================================================================
# Stage 2 — builder: compile the Next.js app
# =============================================================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Provide build-time env vars required by Next.js config (no secrets here).
# Real secrets (MONGODB_URI, NEXTAUTH_SECRET, STRIPE_* etc.) are injected at
# runtime via Railway / Azure App Service → Configuration → Application Settings.
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Placeholder values so NextAuth initialises cleanly during build.
# These are overridden by real values injected at runtime.
ENV NEXTAUTH_SECRET=build-time-placeholder-not-used-at-runtime
ENV NEXTAUTH_URL=http://localhost:3000
ENV AUTH_TRUST_HOST=true
ENV MONGODB_URI=mongodb://placeholder-build-only

RUN npm run build

# =============================================================================
# Stage 3 — runner: minimal production image
# =============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Railway injects PORT at runtime (typically 8080). Do NOT hardcode it here
# so the runtime value always wins. Next.js standalone server.js respects PORT.
EXPOSE 8080

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copy only what the standalone build needs
COPY --from=builder /app/public           ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static

USER nextjs

# Next.js standalone entry point
CMD ["node", "server.js"]
