# Beldex Proto testnet registration and verification runbook

**Source:** https://www.beldex.io/blog/how-to-set-up-the-beldex-extension-wallet (October 15, 2026)

1. Open the official Chrome Web Store listing from the Beldex site. Confirm publisher before clicking Add to Chrome.
2. Use a fresh test-only wallet. Generate and back up the **25-word seed completely offline**, outside this repository or any remote automation. Verify recovery words locally.
3. Switch extension network to **Testnet** and verify testnet badge.
4. Use https://faucet.beldex.dev to obtain at least 200 BDX plus fee buffer. These test tokens have no real value.
5. In extension, Register > Register Token. Suggested: **Veil Receipt / VEIL / 9 decimals / initial 5000 / max 100000**. Check availability before approval.
6. Review costs: **100 locked collateral** (~6 months), **50 burned**, **50 governance**, plus transaction fees, all test BDX.
7. Review and approve registration in wallet. Copy Privacy Token ID and hash into `docs/TESTNET-EVIDENCE.md` (public identifiers only; never addresses or seed phrases unless explicitly public).
8. Verify displayed token balance/mint finality and explorer where supported. For a real transaction, send only between wallets the user controls, record timestamp and public hash, and avoid exposing receiver-private metadata.
9. Investigate a protocol-supported selective disclosure or merchant payment proof. A public hash alone does not reveal a confidential recipient, amount or successful settlement.

**Never** handle 25-word seed, private spend key or secret view key through this app or external logs.
