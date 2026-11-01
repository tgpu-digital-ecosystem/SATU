# SATU Phase 1 — Founder QA and release gates

Status: **DRAFT / NOT RELEASED**. This document is a test plan, not evidence of real-device approval.

## Zero-cost constraints
Use existing GitHub checks, available devices and browser developer tools only. Do not buy infrastructure, APIs, fonts or testing services.

## Founder device checks
- [ ] Open the preview build on iPhone Safari and Android Chrome; verify no horizontal overflow at 320px, 375px and tablet width.
- [ ] Switch Malay, English and Arabic. Verify navigation, labels, inputs, RTL alignment and document contents.
- [ ] Create notes, invoices and receipts, edit quantities and totals, then reload. Verify persistence and correct currency.
- [ ] In Arabic, print an invoice and a paid receipt; choose Save as PDF. Check Arabic shaping, page breaks, long item descriptions and totals.
- [ ] Test print dialog when pop-ups are blocked; verify a meaningful message.
- [ ] Export a JSON backup. Re-import on a test device after saving a separate safety backup. Verify all notes, invoices, profile and language.
- [ ] Attempt an invalid backup and an unsupported future-version backup; verify existing records remain intact.
- [ ] Simulate storage quota denial and verify that failure is reported and existing data remains intact where rollback is possible.
- [ ] Test offline reload, weak connection, keyboard-only navigation and text zoom.

## Rollback rehearsal (no production changes)
1. Record current production commit SHA, deployment identifier, storage schema and available restore mechanism.
2. Build and test the candidate SHA on an isolated preview. Do not overwrite production data.
3. Confirm that the previous known-good build can be redeployed to the preview environment without schema/data loss.
4. Re-test the existing saved notes and invoices after preview rollback.
5. Record evidence, tested SHA, device/browser versions, tester, results and unresolved issues.

## Release decision
- All automated CI checks pass at the exact candidate SHA.
- Founder reviews actual device results and evidence; all critical issues resolved.
- Rollback rehearsal is evidenced, not merely described.
- **Production merge, deployment and public release require explicit founder approval bound to the tested SHA.**
