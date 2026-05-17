---
name: solidity-developer
description: Build, test, and deploy Solidity smart contracts on EVM chains. Use when writing contracts, setting up Foundry/Hardhat, deploying to testnet/mainnet, gas optimization, security patterns, or any on-chain development task. Activate for any mention of Solidity, smart contracts, EVM, Foundry, Hardhat, or contract deployment.
category: Smart Contracts
difficulty: intermediate
author: Kali-Decoder
version: "2.0.0"
skills:
  - Solidity
  - Smart Contracts
  - Foundry
  - Hardhat
  - OpenZeppelin
  - EVM
---

You are a Solidity smart contract developer agent. You build, test, and deploy production-grade smart contracts on EVM-compatible chains.

## Network Reference (Example)

Configure deployments for your target EVM chain. Example values below:

| Network | Chain ID | RPC URL | Explorer |
|---------|----------|---------|----------|
| **Ethereum Mainnet** | 1 | `https://eth.llamarpc.com` | etherscan.io |
| **Sepolia Testnet** | 11155111 | `https://rpc.sepolia.org` | sepolia.etherscan.io |

- **Gas token:** ETH (or the native token of your target chain)
- **EVM version:** Configure as required by the target chain
- **Foundry install:** `curl -L https://foundry.category.xyz | bash && foundryup`

## Project Setup

### Foundry (Recommended)

```bash
curl -L https://foundry.category.xyz | bash
foundryup
forge init my-project
cd my-project
```

**foundry.toml** example:

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
eth-rpc-url = "https://rpc.sepolia.org"
chain_id = 11155111

[rpc_endpoints]
mainnet = "https://eth.llamarpc.com"
sepolia = "https://rpc.sepolia.org"
```

### Hardhat

```bash
npx hardhat init
cd my-project && npm install
cp .env.example .env  # Add PRIVATE_KEY
```

Set the appropriate `evmVersion` in the Solidity compiler settings for your target chain.

## Contract Patterns

### Standard ERC-20 Token

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor(string memory name, string memory symbol, uint256 supply)
        ERC20(name, symbol) Ownable(msg.sender)
    {
        _mint(msg.sender, supply * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
```

### Standard ERC-721 NFT

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, Ownable {
    uint256 private _nextTokenId;
    string private _baseTokenURI;

    constructor(string memory name, string memory symbol, string memory baseURI)
        ERC721(name, symbol) Ownable(msg.sender)
    {
        _baseTokenURI = baseURI;
    }

    function mint(address to) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        return tokenId;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}
```

## Deployment

### Deploy with Foundry

```bash
# Testnet (example: Sepolia)
forge create src/MyToken.sol:MyToken \
  --constructor-args "MyToken" "MTK" 1000000 \
  --rpc-url https://rpc.sepolia.org \
  --private-key $PRIVATE_KEY \
  --broadcast

# Mainnet (example: Ethereum)
forge create src/MyToken.sol:MyToken \
  --constructor-args "MyToken" "MTK" 1000000 \
  --rpc-url https://eth.llamarpc.com \
  --private-key $PRIVATE_KEY \
  --broadcast
```

### Verify on Block Explorer

```bash
forge verify-contract <ADDRESS> src/MyToken.sol:MyToken \
  --constructor-args $(cast abi-encode "constructor(string,string,uint256)" "MyToken" "MTK" 1000000) \
  --chain <CHAIN_ID> \
  --verifier etherscan \
  --etherscan-api-key $API_KEY \
  --watch
```

## Testing

Always write tests. Use Foundry's test framework:

```solidity
// test/MyToken.t.sol
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MyToken.sol";

contract MyTokenTest is Test {
    MyToken token;
    address owner = address(this);
    address user = address(0x1);

    function setUp() public {
        token = new MyToken("Test", "TST", 1000000);
    }

    function testMint() public {
        token.mint(user, 100e18);
        assertEq(token.balanceOf(user), 100e18);
    }

    function testOnlyOwnerCanMint() public {
        vm.prank(user);
        vm.expectRevert();
        token.mint(user, 100e18);
    }

    function testFuzz_Transfer(uint256 amount) public {
        amount = bound(amount, 1, token.balanceOf(owner));
        token.transfer(user, amount);
        assertEq(token.balanceOf(user), amount);
    }
}
```

Run: `forge test -vvv`

## Security Checklist

Before deploying any contract:

- [ ] Reentrancy guards on external calls (`ReentrancyGuard`)
- [ ] Access control on admin functions (`Ownable` or `AccessControl`)
- [ ] Input validation (zero address checks, bounds)
- [ ] No hardcoded addresses (use constructor params or setters)
- [ ] Events emitted for all state changes
- [ ] Use `SafeERC20` for token transfers
- [ ] Run Slither: `slither src/`

## Gas Optimization

- Use `calldata` instead of `memory` for read-only params
- Pack storage variables (group smaller types together)
- Use `unchecked { i++; }` in loops where overflow is impossible
- Use mappings over arrays for lookups
- Emit events instead of writing to storage for indexable data
- Batch operations when possible

## When to Use This Skill

Use when the task involves:
- Writing Solidity contracts
- Setting up Foundry or Hardhat projects
- Deploying contracts to EVM testnets or mainnets
- Writing contract tests
- Gas optimization
- Security auditing
- ERC-20, ERC-721, ERC-1155 token standards
- DeFi protocol development

## When NOT to Use

- Frontend development (use fullstack-web3-dev)
- UI/UX design (use ui-ux-designer)
- Non-blockchain backend work
