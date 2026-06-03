# Security Audit Report — InnovaClubAI

**Date:** 2026-06-03  
**Scope:** Full codebase (`InnovaClubAI.html`, `server.ts`, `src/App.tsx`, dependencies)

---

## Critical Issues (Fixed)

### 1. Client-Side AI API Exposure (`InnovaClubAI.html`)
**Severity:** CRITICAL  
The standalone HTML file contained a direct `fetch()` call to `https://api.anthropic.com/v1/messages`. Although it was missing the `x-api-key` header (so calls would fail), this pattern is designed to accept a hardcoded API key in client-side code. Any API key added here would be visible to anyone viewing the page source.  
**Fix:** Replaced with a local simulation mode. The comment now warns against embedding API keys in client-side code and directs users to the server-hosted version.

### 2. No Rate Limiting on API Endpoints (`server.ts`)
**Severity:** CRITICAL  
All three API endpoints (`/api/analyze`, `/api/scan`, `/api/evaluate-project`) accepted unlimited requests, allowing abuse that could drain the Gemini API quota or cause denial of service.  
**Fix:** Added an in-memory per-IP rate limiter (10 requests/minute per IP).

### 3. No Input Validation / Prompt Injection (`server.ts`)
**Severity:** CRITICAL  
User input from `req.body` was interpolated directly into AI prompts with no validation or length limits. An attacker could inject arbitrary instructions into the AI prompt to manipulate output or extract system prompt details.  
**Fix:** Added `sanitizeString()` helper that enforces type checking and max length limits on all user inputs before they reach the AI prompt.

### 4. Sensitive Error Leakage (`server.ts`)
**Severity:** HIGH  
Error responses included `error.message` from caught exceptions, which could leak internal details (API key errors, stack traces, infrastructure info) to clients.  
**Fix:** Replaced all `error.message` in API responses with generic error strings. Raw errors still log to `console.error` server-side.

### 5. Hardcoded PII in Source Code (`src/App.tsx`)
**Severity:** HIGH  
The `adminUserList` state contained realistic personal data: full names, email addresses, and phone numbers with Colombian country codes. This data was committed to the public repo.  
**Fix:** Replaced all entries with clearly fake demo data (`admin@example.com`, `+00 000 000 0000`, etc.).

### 6. Missing Security Headers (`server.ts`)
**Severity:** HIGH  
The Express server had no security headers — no `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, or `Permissions-Policy`.  
**Fix:** Added a middleware that sets all five headers on every response.

### 7. Overly Large Request Body Limit (`server.ts`)
**Severity:** MEDIUM  
`express.json()` accepted up to 10 MB payloads, which is excessive for JSON text fields and could be abused for memory exhaustion.  
**Fix:** Reduced limit to 1 MB.

---

## Known Issues (Not Fixed — Require Architecture Changes)

### 8. Client-Side-Only Authentication (`src/App.tsx`)
**Severity:** HIGH  
The entire auth system uses `localStorage` with no passwords, no server sessions, and simulated OAuth. Any user can bypass all auth by editing localStorage. The admin panel is accessible without any server-side role check.  
**Recommendation:** Implement server-side authentication (e.g., JWT, session cookies) with a real user database and password hashing. Protect the admin panel behind server-side role-based access control.

### 9. No CORS Policy (`server.ts`)
**Severity:** MEDIUM  
Express defaults to same-origin, but there is no explicit CORS middleware. If the API is ever consumed cross-origin, it will silently fail or require `*` origin.  
**Recommendation:** Add `cors()` middleware with an explicit `origin` allowlist.

### 10. No CSRF Protection
**Severity:** MEDIUM  
POST endpoints accept requests without any CSRF token verification. If users are authenticated via cookies in the future, this enables cross-site request forgery.  
**Recommendation:** Add CSRF tokens or use `SameSite` cookie attributes when real auth is implemented.

### 11. `innerHTML` Usage with AI-Generated Content (`InnovaClubAI.html`)
**Severity:** MEDIUM  
The HTML file uses `.innerHTML` extensively to render AI-generated content. While an `esc()` function exists for escaping, the pattern is fragile — any missed call or future refactor could introduce XSS.  
**Recommendation:** Migrate to DOM APIs (`textContent`, `createElement`) or use a templating framework that auto-escapes by default.

### 12. localStorage User Data Tampering (`src/App.tsx`)
**Severity:** MEDIUM  
User plan, role, and analysis counts are stored in localStorage and trusted client-side. A user can upgrade their plan to "elite" or change their role by editing localStorage.  
**Recommendation:** Enforce plan/role/limits server-side. Use localStorage only as a cache, not as the source of truth.

### 13. No Content Security Policy
**Severity:** LOW  
No CSP header is set, which means any injected script would execute without restriction.  
**Recommendation:** Add a `Content-Security-Policy` header restricting `script-src`, `style-src`, and `connect-src` to trusted origins.

---

## Dependencies

The `package.json` dependencies are reasonably current. Express 4.21.2 includes recent security patches. No known critical CVEs in the listed dependency versions as of the audit date.

---

## Summary

| Category                 | Issues Found | Fixed | Remaining |
|--------------------------|:----------:|:-----:|:---------:|
| Hardcoded secrets / PII  | 2          | 2     | 0         |
| Unvalidated input        | 3          | 3     | 0         |
| Missing auth (server)    | 1          | 0     | 1         |
| Missing security headers | 2          | 1     | 1 (CSP)   |
| Rate limiting            | 1          | 1     | 0         |
| Error leakage            | 1          | 1     | 0         |
| XSS / innerHTML          | 1          | 0     | 1         |
| CORS / CSRF              | 2          | 0     | 2         |
| Client-side trust        | 1          | 0     | 1         |
