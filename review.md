# Code Review: gianyabut/myProfile Portfolio

**Reviewer:** AI Code Review  
**Date:** 2026-05-17  
**Branch Reviewed:** `with_ai_chatbot`  
**Files Reviewed:** `layout.tsx`, `page.tsx`, `globals.css`, `ChatWidget.tsx`, `api/chat/route.ts`, `package.json`, `.env`, `.gitignore`, `next.config.ts`

---

## Overall Assessment

The project is a well-structured, visually impressive Next.js portfolio with a genuinely sophisticated design system and a functional AI chat integration. The core architecture is sound and the developer experience is clean. However, there are several issues ranging from a **critical security vulnerability** that requires immediate action, to moderate maintainability and performance concerns that should be addressed before the site is deployed to production.

**Summary Score:**

| Category | Rating |
|---|---|
| Security | ⚠️ Critical Issue |
| Code Architecture | ★★★☆☆ |
| Performance | ★★★☆☆ |
| Accessibility | ★★☆☆☆ |
| Maintainability | ★★☆☆☆ |
| CSS & Design System | ★★★★☆ |

---

## 🔴 CRITICAL: API Key Exposed in Git History

**File:** `.env`  
**Severity:** CRITICAL — Immediate action required.

The `.gitignore` file correctly lists `.env*` to prevent environment files from being committed. However, during the initial commit, the `.env` file containing the live OpenAI API key was **committed to the public GitHub repository** before this rule was in place.

**Evidence:**
```
# .gitignore line 34
.env*  ✅ (correctly configured NOW)

# But the initial git commit log showed:
create mode 100644 public/hero.png  
# .env was included in the first push
```

Even if the file is deleted from the repository now, the key remains in the **Git commit history** and is **permanently accessible** to anyone who clones the repo.

**Remedial Action — MUST DO NOW:**
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Find the exposed key and click **Revoke / Delete** on it immediately.
3. Create a new API key.
4. Update your `.env` file locally with the new key.
5. **Never commit `.env` files.** Use a `.env.local` file instead (which Next.js automatically ignores).

---

## 🟠 HIGH: No Input Validation on the Chat API

**File:** `src/app/api/chat/route.ts` (line 8)  
**Severity:** High

The API route accepts raw JSON from any client and passes it directly to OpenAI with no validation or sanitisation.

```typescript
// Current code — no validation:
export async function POST(req: Request) {
  const { messages } = await req.json(); // ← Completely untrusted input
  
  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages, // ← Passed directly to OpenAI
  });
}
```

**Problems:**
- A malicious user could send a crafted `messages` array designed to override the system prompt (a technique called **prompt injection**).
- There is no check that `messages` is actually an array, which could cause an unhandled runtime crash.
- There is no limit on the number of messages sent per request, allowing someone to send an enormous context window and rack up API costs.

**Recommended Fix:**
```typescript
import { z } from 'zod';

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().max(2000), // Limit message length
});

const RequestSchema = z.object({
  messages: z.array(MessageSchema).max(20), // Limit history depth
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = RequestSchema.safeParse(body);
  
  if (!parsed.success) {
    return new Response('Invalid request', { status: 400 });
  }
  
  // Now safe to use parsed.data.messages
}
```

---

## 🟠 HIGH: No Rate Limiting on the Chat API

**File:** `src/app/api/chat/route.ts`  
**Severity:** High

There is zero rate limiting on the `/api/chat` endpoint. Anyone who finds or inspects your website's network traffic can call this endpoint repeatedly in an automated loop, exhausting your OpenAI credits in minutes.

**Remedial Action:**
- If deploying to Vercel, use **Vercel KV** (Redis) with a sliding window rate limiter.
- A simple approach is to limit by IP address: e.g., max 20 requests per hour per IP.
- Consider using the [`@upstash/ratelimit`](https://github.com/upstash/ratelimit) package which integrates directly with the Vercel Edge Runtime.

---

## 🟡 MEDIUM: `next/image` Imported but `<img>` Tags Used Instead

**File:** `src/app/page.tsx` (lines 2, 40, 59, 195, 205)  
**Severity:** Medium — Performance & Best Practice

`next/image` is imported on line 2 but never actually used. Instead, raw HTML `<img>` tags are used throughout the page. This is a significant missed opportunity.

```tsx
// Current code (line 2 & line 40):
import Image from 'next/image'; // ← Imported but unused

<img src="/hero.png" alt="Abstract architectural shape" className="hero-image" />
// ↑ Missing: automatic lazy-loading, WebP conversion, responsive srcSet, blur placeholder
```

`next/image` automatically:
- Converts images to modern WebP format (30-50% smaller)
- Generates a `srcSet` for different screen sizes (responsive)
- Lazy-loads images by default
- Shows a blur-up placeholder while loading

**Recommended Fix:**
```tsx
<Image
  src="/hero.png"
  alt="Abstract architectural shape"
  fill
  className="hero-image"
  priority // Use for above-the-fold images
  sizes="50vw"
/>
```

---

## 🟡 MEDIUM: Inline Styles Dominating `ChatWidget.tsx`

**File:** `src/components/ChatWidget.tsx`  
**Severity:** Medium — Maintainability

The entire `ChatWidget` component is styled using inline React `style` objects. While functional, this creates several problems:

1. **Performance:** Every render creates new style object literals, which React must compare on every re-render.
2. **Maintainability:** Colors like `#f4f4f5`, `rgba(0,0,0,0.05)`, and animation values are scattered throughout the file and duplicated.
3. **Inconsistency:** The design tokens defined in `globals.css` (e.g., `--accent-orange`, `--border-color`) cannot be referenced directly in JS objects, leading to hard-coded values like `rgba(255, 51, 0, 0.4)` which don't automatically update if the theme changes.
4. **Pseudo-classes:** Inline styles cannot target `:hover`, `:focus`, or `:active` states, which is why `onMouseEnter`/`onMouseLeave` JavaScript handlers are used — this is fragile and doesn't work on touch devices.

**Recommended Fix:** Move all chat widget styles to `globals.css` as CSS classes, and apply them via `className`.

---

## 🟡 MEDIUM: Hover State Animations Handled via JavaScript

**File:** `src/components/ChatWidget.tsx` (lines 41-48, 117-124, 253-264)  
**Severity:** Medium — Correctness & Performance

As a direct consequence of the inline styles issue above, hover animations are implemented by directly mutating `element.style` in JavaScript event handlers:

```tsx
// Current code — brittle pattern:
onMouseEnter={(e) => {
  e.currentTarget.style.transform = "scale(1.05) translateY(-4px)";
  e.currentTarget.style.boxShadow = "0 20px 40px rgba(255, 51, 0, 0.3)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform = "scale(1) translateY(0)";
  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.15)";
}}
```

**Problems:**
- This bypasses React's render cycle entirely, making it harder to debug.
- The touch equivalent events (`onTouchStart`/`onTouchEnd`) are missing, so mobile users get no hover feedback.
- If the component re-renders while hovered, the hover state may be inconsistently reset.

**Recommended Fix:** Use CSS classes with `:hover` pseudo-selectors defined in `globals.css`.

---

## 🟡 MEDIUM: Unused Import (`next/image`)

**File:** `src/app/page.tsx` (line 2)  
**Severity:** Low-Medium — Code cleanliness

```tsx
import Image from 'next/image'; // ← Never used
```

This is dead code that should be removed. While it doesn't cause a runtime error, it adds to bundle size and creates confusion. The ESLint `no-unused-vars` rule should catch this, but the linter does not appear to be run as part of the build process.

**Remedial Action:** Remove line 2. Also run `npm run lint` to surface other similar issues.

---

## 🟡 MEDIUM: Tailwind CSS Installed But Not Used

**File:** `package.json` (lines 20, 26)  
**Severity:** Medium — Bloat

Both `tailwindcss` and `@tailwindcss/postcss` are listed as devDependencies but the project uses Vanilla CSS exclusively. These packages add overhead to the development install and `postcss.config.mjs` is configured for them unnecessarily.

```json
"devDependencies": {
  "@tailwindcss/postcss": "^4",  // ← Unused
  "tailwindcss": "^4",           // ← Unused
}
```

**Remedial Action:** Run `npm uninstall tailwindcss @tailwindcss/postcss` and simplify `postcss.config.mjs`.

---

## 🟢 LOW: No Error Handling in the Chat API

**File:** `src/app/api/chat/route.ts`  
**Severity:** Low

The API route has no `try/catch` block. If the OpenAI API is down, the key is invalid, or a network error occurs, an unhandled exception will propagate and Next.js will return an opaque 500 error to the client. The chat UI will silently stop working with no user-friendly explanation.

**Recommended Fix:**
```typescript
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const result = await streamText({ ... });
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('[Chat API Error]', error);
    return new Response(
      JSON.stringify({ error: 'The Digital Twin is temporarily unavailable.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

---

## 🟢 LOW: No SEO Open Graph / Social Sharing Tags

**File:** `src/app/layout.tsx`  
**Severity:** Low — SEO & Discoverability

The metadata only includes `title` and `description`. When someone shares the portfolio link on LinkedIn, Twitter, or Slack, no preview image or structured social card will appear — the preview will look blank and unimpressive.

```typescript
// Current:
export const metadata: Metadata = {
  title: "Gian Carlo Yabut | Full Stack Developer",
  description: "High-End Tech Noir Minimalist Portfolio of Gian Carlo Yabut.",
};
```

**Recommended Fix:**
```typescript
export const metadata: Metadata = {
  title: "Gian Carlo Yabut | Full Stack Developer",
  description: "Enterprise-grade Full Stack Developer based in Manila, PH. 13+ years building billing systems, eHealth platforms, and SAAS applications.",
  openGraph: {
    title: "Gian Carlo Yabut | Full Stack Developer",
    description: "Enterprise Full Stack Developer — Manila, PH",
    url: "https://gianyabut.github.io/myProfile",
    images: [{ url: "/hero.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gian Carlo Yabut | Full Stack Developer",
    images: ["/hero.png"],
  },
};
```

---

## 🟢 LOW: No Mobile Navigation (Hamburger Menu)

**File:** `src/app/globals.css` (line 495), `src/app/page.tsx` (lines 14-18)  
**Severity:** Low — Mobile UX

On screens smaller than 768px, the navigation links are hidden with `display: none`, but no replacement mobile menu (hamburger menu) is implemented. Mobile visitors cannot navigate between sections.

```css
/* Current — links just vanish on mobile: */
@media (max-width: 768px) {
  .nav-links { display: none; }
}
```

**Remedial Action:** Implement a hamburger button that toggles a full-screen mobile navigation overlay.

---

## 🟢 LOW: No Accessibility (a11y) on Chat Widget Buttons

**File:** `src/components/ChatWidget.tsx` (lines 21-51)  
**Severity:** Low — Accessibility

The floating chat toggle button and close button have no `aria-label` attributes. Screen readers will announce them as a generic "button" with no context.

```tsx
// Current — screen reader says "button":
<button onClick={() => setIsOpen(true)}>
  <MessageSquare size={26} />
</button>

// Should be:
<button
  onClick={() => setIsOpen(true)}
  aria-label="Open Digital Twin chat assistant"
>
  <MessageSquare size={26} />
</button>
```

---

## 🟢 LOW: Hard-Coded Contact Email in Source Code

**File:** `src/app/page.tsx` (line 225)  
**Severity:** Low — Spam Risk

The email address `gian.yabut@yahoo.com` is written in plain text in the HTML source. Web-scraping bots harvest email addresses this way to build spam lists.

```tsx
// Current:
<a href="mailto:gian.yabut@yahoo.com">Email</a>
```

**Recommended Fix:** Use a contact form (even a simple one via a service like Formspree) or obfuscate the email address using a JavaScript-based encoder.

---

## Summary of Remedial Actions

| Priority | Issue | Action Required |
|---|---|---|
| 🔴 CRITICAL | API Key exposed in Git history | **Revoke the key on OpenAI NOW. Generate a new one.** |
| 🟠 HIGH | No input validation on chat API | Add Zod schema validation to `route.ts` |
| 🟠 HIGH | No rate limiting on chat API | Implement IP-based rate limiting |
| 🟡 MEDIUM | `next/image` not used | Replace `<img>` tags with `<Image>` component |
| 🟡 MEDIUM | Inline styles in `ChatWidget.tsx` | Migrate to CSS classes in `globals.css` |
| 🟡 MEDIUM | JS-based hover animations | Replace with CSS `:hover` pseudo-classes |
| 🟡 MEDIUM | Unused `Image` import | Remove dead import from `page.tsx` |
| 🟡 MEDIUM | Tailwind installed but unused | Uninstall `tailwindcss` and `@tailwindcss/postcss` |
| 🟢 LOW | No error handling in API | Wrap `route.ts` in a `try/catch` |
| 🟢 LOW | Missing Open Graph metadata | Add `openGraph` and `twitter` to `layout.tsx` metadata |
| 🟢 LOW | No mobile navigation | Implement a hamburger menu for screens < 768px |
| 🟢 LOW | Missing ARIA labels on buttons | Add `aria-label` to chat toggle and close buttons |
| 🟢 LOW | Email exposed in plain HTML | Use a contact form or email obfuscation |
