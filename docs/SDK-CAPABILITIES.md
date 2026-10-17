# Beldex integration capability matrix — 2026-10-17

Installed official npm package: **@bdxi/web3js@1.0.1**, published from https://github.com/Beldex-Coin/bdx-web3js.

| Capability | SDK documented | VEIL app |
|---|---|---|
| Provider detection | Yes | Wired to Connect button |
| User-approved wallet connection | Yes | Wired (requires official Chrome extension/user consent) |
| User wallet balance (BDX) | Yes | Wired (requires connection) |
| User-approved BDX send | Yes | SDK capability exists; intentionally not exposed until funded testnet wallet and user-approved recipient are provided |
| Privacy Token registration | In wallet extension UI | Guide only; not programmatically implemented |
| Privacy Token transfer API | Not independently confirmed | Not implemented |
| Independent proof of private payment | Not independently confirmed | Not implemented |
| Source of truth for token evidence | Testnet registration hash and official wallet confirmation | Awaiting genuine transaction |

Bundled file `public/wallet-sdk.js` comes from the upstream official NPM package; see its MIT license and copyright terms. The app does not request wallet seeds or private keys.
