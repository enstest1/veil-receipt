# Beldex testnet wallet integration checkpoint — 2026-10-17

## Verified software
- Official `@bdxi/web3js` 1.0.1 SDK is installed.
- Local merchant app exposes a **testnet-only BDX transfer** with explicit wallet approval.
- A transfer may only be initiated on localhost / 127.0.0.1.
- The app rejects mainnet, bad addresses and invalid / >10 BDX test transfer amounts.
- Safe-send idempotency and unresolved-outcome warnings are used. A wallet-reported submitted transaction is not independently verified finality.
- Token registration is currently performed **inside the official wallet extension**, not through the SDK.
- No usable Privacy Token transfer or independent merchant payment-proof API is documented in this installed SDK.

## Wallet custody and previous projects
- Prior Robinhood Chain EVM test wallet is **not** a compatible Beldex testnet wallet. Never copy its private key or recovery phrase into Beldex.
- Chrome and Edge installation checks found no official Beldex extension installed as of this checkpoint.
- No Beldex wallet address, faucet disbursement, token ID or transaction hash is confirmed.
- The 25-word Beldex wallet recovery seed must be generated and backed up privately by the operator. Do not save it in this repo, enter it into our app, or send it to an assistant.

## Completion evidence checklist
| Item | Status | Evidence |
| --- | --- | --- |
| App tests | Passed | Run `npm test` on Pelpa |
| Wallet extension installed | Pending | Extension panel on Pelpa |
| Own testnet wallet created and backed up | Pending | User private confirmation; do not record phrase |
| Testnet BDX from faucet | Pending | Wallet balance, optionally faucet receipt |
| VEIL Privacy Token registration | Pending | Copy public Privacy Token ID and tx hash |
| Real 0.01 BDX test transfer | Pending | Public tx hash and wallet-reported status |
| Independent recipient / amount proof | Blocked | Requires protocol-specific cryptographic verification |

## Official resources
- Wallet onboarding: https://www.beldex.io/blog/how-to-set-up-the-beldex-extension-wallet
- Beldex Wallet Chrome listing: https://chromewebstore.google.com/detail/beldex-wallet/onhnehjhhionmnbidajneakngpiefapa
- Test BDX: https://faucet.beldex.dev
- Explorer: https://testnet.beldex.dev
- Grant proposal and submitted status: `docs/GRANT-PROPOSAL.md`, `docs/GRANT-SUBMISSION-2026-10-17.md`
