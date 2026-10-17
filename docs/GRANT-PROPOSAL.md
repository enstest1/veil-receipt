# Beldex Developer Grants — VEIL//RECEIPT

Submission status: **DRAFT, NOT SUBMITTED**. Proposed ask **US$30,000**. Beldex advertises a $1M total pool, without fixed award sizes.

## Project
VEIL//RECEIPT is a developer-first merchant checkout/invoice toolkit intended for Beldex Proto Privacy Tokens. It focuses on customer and recipient confidentiality, noncustodial user-approved wallet actions, reproducible receipts and narrowly scoped proof of fulfillment, without exposing public transaction histories.

## Existing deliverables
Local functioning Node.js app, responsive invoice and receipt UI, persistent prototype store, access-controlled review, signed Ed25519 operator-attestation format, signature verifier and five passing automated tests. **No real Beldex token registration, independent chain verification, or live payment is claimed.**

## Proposed milestones / budget

| Milestone | Scope | Proposed USD |
|---|---|---:|
| M1: testnet integration | Official wallet integration research, VEIL registration, evidence ledger, compatibility tests | 5,000 |
| M2: private checkout | User-consented BDX and Privacy Token flows using documented wallet APIs, explicit fallbacks | 9,000 |
| M3: receipt proof | Recipient-approved narrowly scoped proof or wallet-supported attestation, anti-replay validation, reconciliation | 9,000 |
| M4: open source and security | Multi-tenant security design, reproducible integration suite, audited demo and developer docs | 7,000 |
| Total | | **30,000** |

## Why Beldex
The Proto hard fork activated the Privacy Token standard on testnet at block 4,242,200 on October 6, 2026. This proposal aims to convert token issuance into useful merchant infrastructure, rather than issuing speculative assets.

## Security and privacy
No seed phrases collected; wallet-side approvals only; avoid public transaction trail leaks. Signed operator statements are *not* blockchain proofs. Any transfer verifier must be explicitly supported by Beldex and tested for forgery, replay, wrong receiver, wrong amount, reorg/finality and information exposure. No custody or live monetary service before review.

## Maintainer questions
1. Which browser SDK methods support Privacy Token send/receive and token ID/balance lookup?
2. What receiver-authorized selective-disclosure proofs exist, and how are they independently verified?
3. What confirmation/finality and network/version checks should a merchant apply?
4. Is official audit guidance or a review of this integration available?

## Grant form answers
**Team name:** VEIL//RECEIPT (working name)
**Project name:** VEIL//RECEIPT
**GitHub handle:** enstest1 (connected account)
**Team size:** Applicant must confirm
**Telegram handle:** Applicant must provide their own actual handle
**Project description:** Use the project and milestones above and openly state prototype limitations.
**Public repo, hosted demo, token ID, transaction hashes:** Add only once confirmed.
**Submission:** https://www.beldex.io/grants. Do not claim submitted until confirmation.
