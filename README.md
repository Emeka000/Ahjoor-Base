# Ahjoor-Base
this repository is for the solidity smart contract that will be deployed on the base testnet and mainnet t implements the core savings-circle (tontine) features you listed:

create_group

contribute

claim_payout

get_group_info

get_group_count

I wrote the contract using OpenZeppelin utilities (ReentrancyGuard & Ownable) and used a pull-based payout (set pending payouts, recipient calls claimPayout) to reduce reentrancy risk.
   Explanation & mapping to your README

create_group — creates a group with ordered participantAddresses. The participant order determines payout order (like your app).

contribute — participants call this and must send exactly contributionAmount (ETH). When every participant has contributed for the round, the contract queues a pendingPayout for that round's recipient and resets contribution flags for the next round.

claim_payout — the recipient of the completed round must call this to withdraw the pooled amount (pull pattern).

get_group_info & get_group_count — read-only helpers for the frontend (match the README functions).

Security: uses nonReentrant and pull-based payouts. Participant uniqueness checked at creation.

Notes, suggestions, and next steps

Testing: test locally with Hardhat / Foundry and a local node (anvil). Write unit tests for:

create_group with duplicate participants (should revert)

full round flow (all contribute -> pendingPayout set -> recipient claims)

reentrancy / attempted double-claim behavior

ERC20 support: if you want a stablecoin (USDC/DAI) instead of native ETH, we can add ERC20 deposit/withdraw logic.

Timeouts / penalties: production systems usually include:

deadlines per round

ability to remove/replace non-paying members

slashing or redistribution of late funds

Gas & batching: resetting the contributed mapping loop is O(n). For very large groups you'd want a different approach (bitmaps, epoch counters).

Frontend integration:

Use get_group_count then get_group_info(groupId) to render groups.

create_group will be a sendTransaction from the group creator.

contribute is sendTransaction with value = contributionAmount.

claim_payout called by recipient to withdraw.

Deployment to Base: compile and deploy with Hardhat using Base RPC (or via Remix). Replace OpenZeppelin imports via npm (@openzeppelin/contracts) when using Hardhat. If you want, I can provide a Hardhat deployment script next.
