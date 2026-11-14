# SATU Workers AI private pilot — NOT DEPLOYED

This is an isolated, opt-in experiment. The existing `tgpu-satu` production Worker and SATU UI are untouched.

## Purpose
Draft Malay/English product descriptions and WhatsApp replies from manually entered, non-sensitive text. No invoice, notes, customer records, or localStorage data are sent automatically.

## Required setup before a private test
1. Create a dedicated Cloudflare KV namespace for pilot request limits; replace the placeholder ID in `pilot-ai/wrangler.jsonc`.
2. Configure a strong `SATU_AI_PILOT_TOKEN` secret in the **pilot Worker only**.
3. Confirm the selected Workers AI model is available under the account's free allocation and check current pricing.
4. Run `npx wrangler deploy --config pilot-ai/wrangler.jsonc` only in an authorised private test environment. **Do not deploy to SATU production.**
5. POST to `/api/ai/draft` with `Authorization: Bearer <pilot token>`, JSON `{"kind":"description","language":"ms","text":"Kek batik homemade"}`. Do not expose the token in public frontend code.

## Safeguards and limitations
- No paid upgrades or payment activation.
- Fails closed if the secret, AI binding, or usage-control KV is absent.
- Five requests per day **for the entire pilot**, not per user. KV increments are not atomic; concurrent requests may exceed this threshold. Use an atomic Durable Object or Cloudflare rate limiter before opening access beyond a single controlled tester.
- Avoid customer names, phone numbers, addresses, health data and other private information.
- Manual human review required. Outputs are drafts, not guarantees.
- The API is not yet connected to the SATU frontend. Production rollout requires a separate founder-approved change.
