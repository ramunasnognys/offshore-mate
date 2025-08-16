Of course. This is an excellent decision that will significantly improve the user experience. A technical specification file is the perfect way to plan this feature.

Here is a detailed spec for implementing the URL shortening feature using a serverless function and a Key-Value store, tailored for your Next.js/Vercel environment.

---

### **Technical Specification: URL Shortening for Shared Calendars**

**Version:** 1.0
**Date:** 2024-05-21
**Author:** AI Assistant

#### 1. Feature Overview

This feature will introduce a URL shortening service to replace the long, data-encoded URLs currently used for sharing calendars. The goal is to provide users with clean, manageable, and branded links (e.g., `offshore-mate.app/s/shortId`) that are easy to share and aesthetically pleasing.

This will be achieved without a traditional database by leveraging a serverless API route and a high-performance Key-Value (KV) store, such as Vercel KV (powered by Upstash Redis).

#### 2. Core User Flow

1.  **Sharer's Flow:**
    *   A user generates a calendar and clicks the "Share" button.
    *   The `ShareModal` opens. In the background, it sends the long, `pako`-compressed URL to a new API endpoint.
    *   The modal displays a "Generating short link..." message.
    *   The API returns a short URL (e.g., `https://[your-domain]/s/aB1cD2eF`).
    *   The modal updates to display this short, clean URL.
    *   All sharing actions (Copy Link, Share on WhatsApp, etc.) now use this short URL.

2.  **Recipient's Flow:**
    *   The recipient clicks the short URL.
    *   They are instantly and seamlessly redirected to the original long URL containing the calendar data.
    *   The shared calendar page (`/shared/[id]`) loads and decompresses the data from the URL, exactly as it does now.

#### 3. Technical Architecture

*   **Frontend Component:** `src/components/ShareModal.tsx` will be modified to handle the API communication and display the short URL.
*   **API Endpoint:** A new Next.js API Route at `src/app/api/share/route.ts` will handle the creation of short links.
*   **Redirect Handler:** A new dynamic page route at `src/app/s/[shareId]/page.tsx` will handle the redirection logic.
*   **Data Store:** **Vercel KV** will be used to store the mapping between the short ID and the long URL. It's fast, serverless, and integrates perfectly with Vercel hosting.

#### 4. Detailed Implementation Steps

##### **Step 1: Setup and Dependencies**

1.  **Install Vercel KV:**
    ```bash
    npm install @vercel/kv
    ```
2.  **Install `nanoid`:** A utility to generate unique, URL-friendly short IDs.
    ```bash
    npm install nanoid
    ```
3.  **Configure Vercel KV:**
    *   Go to your project dashboard on Vercel.
    *   Navigate to the "Storage" tab and create a new KV database.
    *   Connect it to your project. This will automatically add the necessary environment variables (`KV_URL`, `KV_REST_API_URL`, etc.) to your project settings.

##### **Step 2: Create the API Endpoint for Shortening**

**File:** `src/app/api/share/route.ts`

```typescript
import { kv } from '@vercel/kv';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { longUrl } = await req.json();

    // 1. Validate the input URL
    if (!longUrl || typeof longUrl !== 'string' || !longUrl.startsWith(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')) {
      return NextResponse.json({ error: 'Invalid URL provided.' }, { status: 400 });
    }

    // 2. Generate a unique short ID (e.g., 8 characters)
    const shareId = nanoid(8);
    const key = `share:${shareId}`;

    // 3. Store the mapping in Vercel KV with a Time-To-Live (TTL)
    // TTL: 90 days in seconds (90 * 24 * 60 * 60 = 7,776,000)
    await kv.set(key, longUrl, { ex: 7776000 });

    // 4. Construct the short URL
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const shortUrl = `${baseUrl}/s/${shareId}`;

    return NextResponse.json({ shortUrl }, { status: 200 });

  } catch (error) {
    console.error('URL shortening failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

##### **Step 3: Create the Redirect Page**

**File:** `src/app/s/[shareId]/page.tsx`

```typescript
import { kv } from '@vercel/kv';
import { redirect, notFound } from 'next/navigation';

interface ShareRedirectPageProps {
  params: {
    shareId: string;
  };
}

export default async function ShareRedirectPage({ params }: ShareRedirectPageProps) {
  const { shareId } = params;
  const key = `share:${shareId}`;

  // Fetch the long URL from Vercel KV
  const longUrl = await kv.get<string>(key);

  if (!longUrl) {
    // If the key doesn't exist (or has expired), show a 404 page.
    notFound();
  }

  // Perform the redirect to the long URL.
  redirect(longUrl);
}
```
*Note: This component must be a Server Component to work correctly with `async/await` and `redirect()`.*

##### **Step 4: Update the Frontend `ShareModal`**

**File:** `src/components/ShareModal.tsx`

```typescript
'use client'

import React, { useState, useEffect } from 'react';
// ... other imports

export function ShareModal({ isOpen, onClose, scheduleId }: ShareModalProps) {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  // ... other hooks and state

  // Effect to generate the long URL and trigger shortening
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setCopied(false); // Reset copied state
      
      // Generate the long URL with pako data (your existing logic)
      const generatedLongUrl = shareUtils.generateShareUrl(scheduleId, /* schedule object */);
      setLongUrl(generatedLongUrl);

      // Call our new API to shorten it
      fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longUrl: generatedLongUrl }),
      })
      .then(res => res.json())
      .then(data => {
        if (data.shortUrl) {
          setShortUrl(data.shortUrl);
        } else {
          // Fallback to the long URL if API fails
          setShortUrl(generatedLongUrl);
        }
      })
      .catch(err => {
        console.error("Shortening failed, falling back to long URL:", err);
        setShortUrl(generatedLongUrl); // Fallback
      })
      .finally(() => {
        setIsLoading(false);
      });
    } else {
      // Reset state on close
      setLongUrl('');
      setShortUrl('');
    }
  }, [isOpen, scheduleId, /* dependencies for generating schedule object */]);

  const urlToDisplay = isLoading ? 'Generating short link...' : (shortUrl || longUrl);

  const handleCopy = async () => {
    if (isLoading || !urlToDisplay.startsWith('http')) return;
    await navigator.clipboard.writeText(urlToDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ... (Update other share handlers to use `urlToDisplay`)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContentComponent /* ... */>
        {/* ... (Header) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="p-4 rounded-lg bg-gray-50/50 backdrop-blur border border-gray-200/50">
            {/* ... (Share Preview) */}
            <div className="mt-3 p-2 bg-white/80 rounded border border-gray-200/50">
              <p className="text-xs text-gray-500 break-all">{urlToDisplay}</p>
            </div>
          </div>
          {/* ... (Share Buttons that use the short URL) */}
        </div>
        {/* ... (Footer) */}
      </DialogContentComponent>
    </Dialog>
  );
}
```

#### 5. API Endpoint Specification (`/api/share`)

*   **Method:** `POST`
*   **Request Body:**
    ```json
    {
      "longUrl": "https://your-domain.com/shared/abc?data=..."
    }
    ```
*   **Success Response (Status `200`):**
    ```json
    {
      "shortUrl": "https://your-domain.com/s/shortId"
    }
    ```
*   **Error Responses:**
    *   **Status `400`:** If `longUrl` is missing, invalid, or doesn't match the application's domain.
    *   **Status `500`:** If there is a server-side error (e.g., Vercel KV is unavailable).

#### 6. Data Model (Vercel KV)

*   **Key:** A string prefixed for namespacing, e.g., `share:<nanoid>`.
*   **Value:** The full, long URL string.
*   **TTL (Time-To-Live):** **90 days**. This is crucial for keeping the database clean and preventing indefinite storage of old links.

#### 7. Error Handling & Edge Cases

*   **API Failure:** The `ShareModal` must gracefully fall back to using the long URL if the `/api/share` endpoint fails.
*   **Invalid Short Link:** The `[shareId]` page must use `notFound()` from Next.js to render a standard 404 page for expired or non-existent links.
*   **Rate Limiting:** Not implemented in this spec, but Vercel's platform has built-in protections. Can be added later if needed.

---

This specification provides a complete, end-to-end plan for implementing the URL shortening feature in a robust and scalable way, while staying true to the lightweight, "no database" philosophy of your project.