# Upstash Redis Setup for URL Shortening Service

## Overview

The URL shortening service requires Upstash Redis for storing short URL mappings. This document provides step-by-step setup instructions.

## Quick Setup via Vercel Marketplace (Recommended)

### 1. Install Upstash Integration

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project
3. Go to **Integrations** tab
4. Search for "Upstash" or visit [Vercel Marketplace - Upstash](https://vercel.com/marketplace/upstash)
5. Click **"Add Integration"**
6. Select your project
7. Choose to create a new Upstash Redis database or connect existing one

### 2. Environment Variables (Auto-configured)

The integration automatically adds these environment variables to your Vercel project:

```bash
UPSTASH_REDIS_REST_URL=https://your-region.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

### 3. Local Development

For local development, copy the environment variables from Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Copy the Upstash variables
4. Create a `.env.local` file in your project root:

```bash
# .env.local
UPSTASH_REDIS_REST_URL=https://your-region.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

**Note**: The `.env.local` file is already in `.gitignore` and will not be committed.

## Manual Setup (Alternative)

### 1. Create Upstash Account

1. Visit [Upstash.com](https://upstash.com)
2. Sign up for a free account
3. Verify your email

### 2. Create Redis Database

1. In Upstash Console, click **"Create Database"**
2. Choose a name (e.g., "offshore-mate-urls")
3. Select region closest to your users
4. Choose **"Free"** tier (sufficient for most use cases)
5. Click **"Create"**

### 3. Get Connection Details

1. Click on your created database
2. Scroll to **"REST API"** section
3. Copy the **"UPSTASH_REDIS_REST_URL"**
4. Copy the **"UPSTASH_REDIS_REST_TOKEN"**

### 4. Configure Environment Variables

#### For Vercel Deployment:
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add both variables for all environments (Production, Preview, Development)

#### For Local Development:
Create `.env.local` with the credentials as shown above.

## Testing the Setup

### 1. Start Development Server

```bash
pnpm dev
```

### 2. Test API Endpoint

```bash
curl -X POST http://localhost:3000/api/share \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "http://localhost:3000/shared/test?data=compressed_data"}'
```

**Expected Response:**
```json
{
  "shortUrl": "http://localhost:3000/s/abc12345",
  "shareId": "abc12345",
  "expiresAt": "2025-11-15T12:00:00.000Z"
}
```

### 3. Test Redirect

Visit the returned short URL in your browser - it should redirect to the original URL.

## Troubleshooting

### Environment Variables Not Loading

1. Restart your development server after adding `.env.local`
2. Verify file name is exactly `.env.local` (not `.env.local.txt`)
3. Check that variables don't have quotes around values

### Connection Errors

1. Verify your Upstash Redis database is active
2. Check that REST API is enabled on your database
3. Confirm the URL includes `https://` protocol
4. Ensure no trailing slashes in the URL

### Rate Limiting

Free tier includes:
- 10,000 requests per day
- 256 MB storage
- Max 100 concurrent connections

If you exceed limits, consider upgrading to a paid plan.

## URL Shortening Service Behavior

### With Redis Connected
- Short URLs generated (e.g., `domain.com/s/abc12345`)
- 90-day expiration automatic cleanup
- Fast redirects via Redis lookup

### Without Redis (Fallback)
- Falls back to long URLs with pako compression
- All share functionality still works
- No URL shortening but maintains compatibility

## Security Notes

1. **Environment Variables**: Never commit Redis credentials to git
2. **CORS**: API only accepts same-domain URLs
3. **TTL**: URLs automatically expire after 90 days
4. **Rate Limiting**: Consider adding rate limiting for production

## Support

- **Upstash Documentation**: [docs.upstash.com](https://docs.upstash.com)
- **Vercel Integration**: [vercel.com/marketplace/upstash](https://vercel.com/marketplace/upstash)
- **Community**: Upstash Discord or GitHub discussions

## Migration Notes

This service replaces the deprecated Vercel KV. The implementation is designed to be:
- **Drop-in compatible** with existing share functionality
- **Gracefully degrading** if Redis is unavailable
- **Future-proof** with standard Redis API