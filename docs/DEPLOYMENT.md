# Deployment guide and security gates

## Confirmed
- Local running service: http://127.0.0.1:8788 on the authorized Windows PC.
- GitHub public source: https://github.com/enstest1/veil-receipt.
- GitHub Actions test workflow: completed SUCCESS on 2026-10-17.

## Local server
Run `./start-local.ps1` in PowerShell. This generates a local-only operator token at `data/operator-key.txt` and binds to 127.0.0.1. Do not paste the token in issues, logs or chats.

## Public deployment
**NOT DEPLOYED** as of this document. Existing node service lacks production-grade auth, database durability, tenant isolation and protective rate limits. Do not publicly expose mutable endpoints with real invoices until hardened. A public read-only gallery should be separate from the operator backend, with no secrets and no false chain-verification claims.

A future Railway deployment can use `railway.json` and the repository, with `OPERATOR_SECRET` absent for read-only mode. Review encryption, CORS, TLS, persistent volume and rate limits before real users.

## Production blockers
- Beldex Privacy Token transfer and receiver-authorized payment proof APIs unconfirmed.
- Official browser wallet extension needs installation, testnet funding and user approval.
- No token registration or actual transaction ID recorded.
- Independent security review for custody/payment claims not performed.
