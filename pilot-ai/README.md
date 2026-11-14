# SATU Workers AI private pilot — DEPLOYED BUT LOCKED

This is an isolated Cloudflare Worker (`tgpu-satu-ai-pilot`), separate from the existing production `tgpu-satu` website. It was uploaded through the Cloudflare API on 14 November 2026. Its workers.dev subdomain is disabled. **Not operational or publicly accessible yet.**

## Implemented
- Standalone private test UI (product descriptions / WhatsApp replies, Malay / English).
- Workers AI binding and dedicated KV namespace `SATU_AI_PILOT_LIMITS` (`a7b015dda309473ca7e86f39e2e80d1e`).
- AI endpoint at `POST /api/ai/draft`, requiring a secret bearer token and rejecting requests if not configured.
- Shared five-requests-per-day pilot counter, manual input only, no access to SATU's customer records or localStorage.
- No paid model upgrade, no changes to production SATU and no public release.

## Blocker
The Cloudflare connector refused the secret-write operation. The `SATU_AI_PILOT_TOKEN` Worker secret is **not configured**. Do not enable the workers.dev subdomain until the secret is present and validated.

## Finish securely
1. In Cloudflare Dashboard > Workers & Pages > `tgpu-satu-ai-pilot` > Settings > Variables and Secrets, add an encrypted **Secret** named `SATU_AI_PILOT_TOKEN` with a new, long, random value. Never commit it to GitHub or share it in public chat.
2. Verify the AI and KV bindings remain present.
3. Enable workers.dev only for this isolated pilot Worker, then open its private test page. The page can be viewed publicly, but AI generation requires the secret. For stronger privacy, protect the entire test Worker with Cloudflare Access before inviting additional testers.
4. Run tests: unauthenticated POST must return 401; invalid input 400; valid input returns a draft; sixth daily request 429; missing binding 503. Check Cloudflare AI usage and logs.
5. Review model eligibility and pricing before using it. No paid plan or charges should be enabled.
6. Before wider access, replace the non-atomic KV rate limit with an atomic solution, review privacy, run automated tests and integrate an authenticated backend route into SATU. Never embed the secret in public frontend code.

## Safety
Drafts require human review. Never submit customer phone numbers, addresses, financial details or other personal data. The UI does not read SATU's existing business data. Do not merge the PR or deploy to production without owner acceptance.
