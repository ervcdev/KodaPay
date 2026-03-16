require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Import ethers for mnemonic to private key conversion
const { ethers } = require("ethers");

/**
 * Hardhat Configuration for PolkaPay Deployment
 * 
 * WESTEND REVIVE CONFIGURATION:
 * - RPC: https://westend-revive-rpc.polkadot.io
 * - Chain ID: 42 (Westend Revive Testnet)
 * - Block Time: ~6 seconds (Polkadot consensus)
 * - Gas Model: EVM-compatible on RISC-V architecture
 * 
 * TALISMAN WALLET INTEGRATION:
 * - Uses MNEMONIC from .env instead of PRIVATE_KEY
 * - Compatible with Talisman's seed phrase export
 * - Derives first account (index 0) from mnemonic
 * - Fallback to PRIVATE_KEY for backward compatibility
 * 
 * COMPILATION TARGET:
 * - Solidity 0.8.18 for stability and PVM compatibility
 * - Optimizer enabled for gas efficiency on Substrate
 * - RISC-V bytecode generation for Polkadot Virtual Machine
 * 
 * @type import('hardhat/config').HardhatUserConfig
 */

// Helper function to get accounts from mnemonic or private key
function getAccounts() {
  if (process.env.MNEMONIC) {
    // Create wallet from mnemonic and derive first account
    const wallet = ethers.Wallet.fromPhrase(process.env.MNEMONIC);
    console.log("🔑 Using mnemonic-derived account:", wallet.address);
    return [wallet.privateKey];
  } else if (process.env.PRIVATE_KEY) {
    // Fallback to private key
    console.log("🔑 Using private key from .env");
    return [process.env.PRIVATE_KEY];
  } else {
    console.log("⚠️  No MNEMONIC or PRIVATE_KEY found in .env, using Hardhat default accounts");
    // Return empty array to use Hardhat's default accounts
    return [];
  }
}
module.exports = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
        details: {
          yul: true,
          yulDetails: {
            stackAllocation: true,
            optimizerSteps: "dhfoDgvulfnTUtnIf"
          }
        }
      },
      // RISC-V compilation settings for PVM (Polkadot Virtual Machine)
      // Enhanced for Pallet Revive compatibility
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode", "evm.deployedBytecode", "evm.methodIdentifiers", "metadata", "storageLayout"],
        },
      },
      // PVM-specific compiler settings
      evmVersion: "london", // EIP-1559 support for Pallet Revive
      viaIR: false, // Disable IR for better PVM compatibility
      // Metadata settings for contract verification
      metadata: {
        bytecodeHash: "ipfs",
        useLiteralContent: true
      }
    },
  },
  networks: {
    // Polkadot Hub TestNet - Official Polkadot EVM Testnet (Updated for 2026)
    westendRevive: {
      url: "https://eth-rpc-testnet.polkadot.io/",
      accounts: getAccounts(), // Uses mnemonic or private key
      chainId: 420420417, // Polkadot Hub TestNet Chain ID
      gasPrice: "auto",
      gas: "auto",
      timeout: 120000, // Increased timeout for PVM
      // Polkadot Hub specific settings
      blockGasLimit: 15000000, // 15M gas limit per block
      allowUnlimitedContractSize: false,
      // PVM optimization settings
      hardfork: "london", // EIP-1559 compatibility
      initialBaseFeePerGas: 1000000000, // 1 gwei
    },
    // Local PVM Development Node (Hardhat)
    localPVM: {
      url: "http://127.0.0.1:8545",
      // Don't specify accounts to use Hardhat's default pre-funded accounts
      chainId: 31337, // Hardhat default chain ID
      gasPrice: "auto",
      gas: "auto",
      timeout: 60000,
      // Local development settings
      blockGasLimit: 15000000,
      allowUnlimitedContractSize: true, // More permissive for local dev
    },
    // Local development network
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      accounts: getAccounts(), // Uses mnemonic or private key
      gas: "auto",
      gasPrice: "auto",
    },
    // Hardhat network for testing
    hardhat: {
      chainId: 31337,
      gas: "auto",
      gasPrice: "auto",
      blockGasLimit: 15000000,
      allowUnlimitedContractSize: false,
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  // Gas reporter for optimization analysis
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  // Contract verification settings
  etherscan: {
    // Note: Westend Revive may have its own block explorer
    apiKey: process.env.ETHERSCAN_API_KEY || "dummy",
  },
};
