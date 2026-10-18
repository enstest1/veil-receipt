# VEIL//RECEIPT

Privacy-conscious merchant invoicing and signed **operator review statements**, built as a Beldex Proto testnet engineering prototype.

**Status (2026-10-17):** Public GitHub https://github.com/enstest1/veil-receipt ; local website and APIs work; seven automated tests pass; official wallet SDK connection/balance interface is wired but needs a real user-approved extension. Does NOT verify Beldex blockchain payments; no Privacy Token minted by this software; no financial custody. Do not interpret signed statements as payment settlement.

## Public read-only preview

**https://enstest1.github.io/veil-receipt/** (GitHub Pages, verified HTTP 200 on October 17, 2026). The publicly hosted site is read-only: it cannot issue invoices, operate the backend, or verify real Beldex payments. The functional merchant app runs locally only.

## Start (Windows PowerShell)

```powershell
npm test
.\start-local.ps1
```

Open http://127.0.0.1:8788. Enter the operator key saved only on the local machine at `data/operator-key.txt`. **Never post this key, recovery seed, or wallet private keys.** The app binds to loopback by default and stores invoice data and issuer keys in `data/` (Git-ignored). This storage is a prototype, not hardened production infrastructure.

## What works

- Local responsive merchant dashboard and invoice creation.
- Operator review of user-supplied external evidence with clear unverified status.
- Ed25519 signed issuer statements and signature verification.
- Input validation; operator authorization; Node automated tests.
- Official wallet and grant preparation documentation.

## What is missing

- Live Chrome wallet authorization and real BDX testnet balance check (SDK UI exists; user has not installed/approved extension).
- Privacy Token API support for transfer or independent payment proof.
- Actual VEIL registration, faucet funding and real test transfers.
- Database, auth, rate limiting, encrypted storage, external security audit for public hosting.
- Public hosted demo and wallet-backed testnet activity (GitHub and Beldex grant form submissions are complete).

## Token registration

See [Testnet Runbook](docs/TESTNET-RUNBOOK.md). Test proposal: name **Veil Receipt**, ticker **VEIL**, 9 decimals, initial 5,000, max 100,000. 200 test BDX plus transaction fees required. Store token ID and transaction hash, but never wallet secrets.

## Grant submission

Official Beldex developer grant application **submitted October 17, 2026** with Google Forms confirmation. Proposed milestone budget US$30,000, not approved. See [submission evidence](docs/GRANT-SUBMISSION-2026-10-17.md).

## Grant proposal

See [Grant Proposal](docs/GRANT-PROPOSAL.md) for proposed US$30K milestones. These are a request, not program-assigned amounts.

## Threat model

The service should not be internet-exposed in its current form; operator password is for a local single-user demo only. A valid issuer signature says ONLY the issuer signed an assessment, not that the transfer happened or that any onchain state is final. No real funds should be sent through this prototype.

## Local Beldex testnet BDX send (October 17)
The Beldex testnet setup screen now includes a local-only, user-approved test BDX send flow using the official SDK. It rejects mainnet, invalid addresses and transfers over 10 test BDX. A submitted tx is not settlement proof and this SDK does not implement Privacy Token registration or independent confidential transfer verification. See [wallet integration checkpoint](docs/BELDEX-WALLET-GATE.md). No wallet secret was accessed or saved.
