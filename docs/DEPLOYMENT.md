# Deployment Guide

This guide covers deploying the Developers Blog platform to various hosting providers and production environments.

## 📋 Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Environment Variables](#environment-variables)
- [Vercel Deployment](#vercel-deployment)
- [Netlify Deployment](#netlify-deployment)
- [Railway Deployment](#railway-deployment)
- [DigitalOcean App Platform](#digitalocean-app-platform)
- [AWS Amplify](#aws-amplify)
- [Docker Deployment](#docker-deployment)
- [Production Considerations](#production-considerations)
- [Monitoring and Analytics](#monitoring-and-analytics)
- [Troubleshooting](#troubleshooting)

## ✅ Pre-Deployment Checklist

Before deploying to production, ensure you have:

- [ ] **Supabase Production Project**: Set up a production Supabase project
- [ ] **Database Schema**: Applied all database migrations and RLS policies
- [ ] **Environment Variables**: Configured all required environment variables
- [ ] **Authentication**: Set up authentication providers and redirect URLs
- [ ] **Storage**: Configured storage buckets (if using image uploads)
- [ ] **Domain**: Registered and configured your domain name
- [ ] **SSL Certificate**: Ensured HTTPS is enabled
- [ ] **Error Monitoring**: Set up error tracking (optional but recommended)

## 🔐 Environment Variables

### Required Variables

```env
# Supabase Configuration (Production)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# Application Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

### Optional Variables

```env
# Analytics (if using)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-umami-id

# Error Monitoring (if using Sentry)
SENTRY_DSN=your-sentry-dsn
SENTRY_ORG=your-sentry-org
SENTRY_PROJECT=your-sentry-project

# Email Configuration (if implementing)
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
```

## 🚀 Vercel Deployment (Recommended)

Vercel is the recommended platform for deploying Next.js applications.

### 1. Deploy from GitHub

1. **Connect Repository**:

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**:

   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   Development Command: npm run dev
   ```

3. **Environment Variables**:

   - Add all required environment variables in the Vercel dashboard
   - Go to Project Settings > Environment Variables

4. **Domain Configuration**:
   - Add your custom domain in Project Settings > Domains
   - Configure DNS records as instructed

### 2. Deploy from CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add NEXT_PUBLIC_APP_URL production
```

### 3. Continuous Deployment

Vercel automatically redeploys when you push to the main branch. To configure:

1. Go to Project Settings > Git
2. Configure production and preview branches
3. Set up build & development settings

## 🌐 Netlify Deployment

### 1. Deploy from GitHub

1. **Connect Repository**:

   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Settings**:

   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Environment Variables**:
   - Go to Site settings > Environment variables
   - Add all required environment variables

### 2. Configure Next.js for Netlify

Create `netlify.toml` in the project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "8"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/api/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

## 🚂 Railway Deployment

Railway provides an easy way to deploy Node.js applications.

### 1. Deploy from GitHub

1. **Connect Repository**:

   - Go to [railway.app](https://railway.app)
   - Click "Deploy from GitHub repo"
   - Select your repository

2. **Configure Service**:
   - Railway automatically detects Next.js
   - Set environment variables in the dashboard

### 2. Railway Configuration

Create `railway.toml`:

```toml
[build]
  builder = "NIXPACKS"

[deploy]
  startCommand = "npm start"
  healthcheckPath = "/"
  healthcheckTimeout = 100
  restartPolicyType = "ON_FAILURE"
  restartPolicyMaxRetries = 10
```

## 🌊 DigitalOcean App Platform

### 1. App Specification

Create `.do/app.yaml`:

```yaml
name: developers-blog
services:
  - name: web
    source_dir: /
    github:
      repo: your-username/developers-blog
      branch: main
    run_command: npm start
    build_command: npm run build
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs
    routes:
      - path: /
    envs:
      - key: NODE_ENV
        value: production
      - key: NEXT_PUBLIC_SUPABASE_URL
        value: your_supabase_url
      - key: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
        value: your_anon_key
      - key: SUPABASE_SERVICE_ROLE_KEY
        value: your_service_role_key
```

### 2. Deploy

1. Go to DigitalOcean App Platform
2. Create new app from GitHub
3. Select your repository
4. Configure environment variables
5. Deploy

## ☁️ AWS Amplify

### 1. Connect Repository

1. Go to AWS Amplify Console
2. Click "Host your web app"
3. Connect your GitHub repository
4. Configure build settings

### 2. Build Configuration

Create `amplify.yml`:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### 3. Environment Variables

Configure in Amplify Console > App settings > Environment variables.

## 🐳 Docker Deployment

### 1. Dockerfile

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=${NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
```

### 3. Build and Deploy

```bash
# Build the image
docker build -t developers-blog .

# Run with docker-compose
docker-compose up -d

# Or run directly
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_key \
  developers-blog
```

## 🔧 Production Considerations

### Performance Optimization

1. **Next.js Configuration**:

   ```typescript
   // next.config.ts
   const nextConfig = {
     experimental: {
       optimizeCss: true,
     },
     images: {
       domains: ['your-supabase-project.supabase.co'],
       formats: ['image/webp', 'image/avif'],
     },
     compress: true,
     poweredByHeader: false,
   };
   ```

2. **Bundle Analysis**:
   ```bash
   npm install --save-dev @next/bundle-analyzer
   ```

### Security Headers

Create `middleware.ts`:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );

  return response;
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
```

### Database Production Setup

1. **Supabase Production**:

   - Enable Point-in-Time Recovery
   - Set up daily backups
   - Configure read replicas (if needed)
   - Monitor database performance

2. **Connection Pooling**:
   ```typescript
   // Use connection pooling for better performance
   const supabase = createClient(url, key, {
     db: {
       schema: 'public',
     },
     auth: {
       autoRefreshToken: true,
       persistSession: true,
       detectSessionInUrl: true,
     },
     global: {
       headers: { 'x-my-custom-header': 'my-app-name' },
     },
   });
   ```

## 📊 Monitoring and Analytics

### 1. Error Monitoring with Sentry

```bash
npm install @sentry/nextjs
```

Create `sentry.client.config.ts`:

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

### 2. Performance Monitoring

```typescript
// lib/analytics.ts
export const trackEvent = (event: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, properties);
  }
};

export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
};
```

### 3. Uptime Monitoring

Set up monitoring with services like:

- **UptimeRobot**: Free uptime monitoring
- **Pingdom**: Advanced monitoring features
- **DataDog**: Comprehensive monitoring suite

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**:

   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build

   # Check for TypeScript errors
   npx tsc --noEmit
   ```

2. **Environment Variables**:

   ```bash
   # Verify environment variables are set
   echo $NEXT_PUBLIC_SUPABASE_URL

   # Check if variables are accessible in the app
   console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
   ```

3. **Database Connection Issues**:

   - Verify Supabase URL and keys
   - Check RLS policies
   - Verify network connectivity
   - Check Supabase service status

4. **Authentication Issues**:
   - Verify redirect URLs in Supabase Auth settings
   - Check site URL configuration
   - Verify JWT secret

### Debug Mode

Enable debug mode for troubleshooting:

```env
DEBUG=1
NEXT_PUBLIC_DEBUG=true
```

### Health Check Endpoint

Create `src/app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Perform health checks
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
      environment: process.env.NODE_ENV,
    };

    return NextResponse.json(health, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', error: 'Health check failed' },
      { status: 500 }
    );
  }
}
```

## 📚 Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-to-prod)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

For more information, see the main [README.md](../README.md) file or consult the specific platform documentation.
