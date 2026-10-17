# VEIL//RECEIPT

Privacy-conscious merchant invoicing and signed **operator review statements**, built as a Beldex Proto testnet engineering prototype.

**Status (2026-10-17):** Local website and APIs work; Node tests pass. Does NOT verify Beldex blockchain payments; no Privacy Token minted by this software; no financial custody. Do not interpret signed statements as payment settlement.

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

- User-approved Beldex wallet integration (official extension must be installed by a human).
- Privacy Token API support for transfer or independent payment proof.
- Actual VEIL registration, faucet funding and real test transfers.
- Database, auth, rate limiting, encrypted storage, external security audit for public hosting.
- GitHub publish, public demo, Beldex grant submission until verified.

## Token registration

See [Testnet Runbook](docs/TESTNET-RUNBOOK.md). Test proposal: name **Veil Receipt**, ticker **VEIL**, 9 decimals, initial 5,000, max 100,000. 200 test BDX plus transaction fees required. Store token ID and transaction hash, but never wallet secrets.

## Grant proposal

See [Grant Proposal](docs/GRANT-PROPOSAL.md) for proposed US$30K milestones. These are a request, not program-assigned amounts.

## Threat model

The service should not be internet-exposed in its current form; operator password is for a local single-user demo only. A valid issuer signature says ONLY the issuer signed an assessment, not that the transfer happened or that any onchain state is final. No real funds should be sent through this prototype.
