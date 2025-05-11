// Web3 configuration
export const WEB3_CONFIG = {
  // Supported networks
  networks: {
    // Ethereum Mainnet
    1: {
      name: "Ethereum Mainnet",
      rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID",
      blockExplorer: "https://etherscan.io",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
    },
    // Polygon Mainnet
    137: {
      name: "Polygon Mainnet",
      rpcUrl: "https://polygon-rpc.com",
      blockExplorer: "https://polygonscan.com",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
    },
    // Optimism
    10: {
      name: "Optimism",
      rpcUrl: "https://mainnet.optimism.io",
      blockExplorer: "https://optimistic.etherscan.io",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
    },
    // Arbitrum
    42161: {
      name: "Arbitrum One",
      rpcUrl: "https://arb1.arbitrum.io/rpc",
      blockExplorer: "https://arbiscan.io",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
    },
    // Base
    8453: {
      name: "Base",
      rpcUrl: "https://mainnet.base.org",
      blockExplorer: "https://basescan.org",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
    },
    // Sepolia testnet
    11155111: {
      name: "Sepolia",
      rpcUrl: "https://rpc.sepolia.org",
      blockExplorer: "https://sepolia.etherscan.io",
      nativeCurrency: {
        name: "Sepolia Ether",
        symbol: "ETH",
        decimals: 18,
      },
    },
  },

  // Contract addresses
  contracts: {
    fileStorage: {
      1: "0x...", // Ethereum Mainnet
      137: "0x...", // Polygon Mainnet
      11155111: "0x...", // Sepolia testnet
    },
  },

  // IPFS configuration
  ipfs: {
    gateway: "https://ipfs.io/ipfs/",
    pinningService: "pinata", // or "web3.storage", "nft.storage", etc.
  },

  // Default network ID
  defaultNetworkId: 11155111, // Sepolia testnet
}

// Contract ABIs
export const CONTRACT_ABIS = {
  fileStorage: [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "revokedFrom",
          type: "address",
        },
      ],
      name: "FileAccessRevoked",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "sharedWith",
          type: "address",
        },
      ],
      name: "FileShared",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "ipfsHash",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
      ],
      name: "FileUploaded",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
      ],
      name: "getFileMetadata",
      outputs: [
        {
          components: [
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "fileType",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "size",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "ipfsHash",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "timestamp",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "encrypted",
              type: "bool",
            },
            {
              internalType: "string",
              name: "category",
              type: "string",
            },
          ],
          internalType: "struct FileStorage.FileMetadata",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_ipfsHash",
          type: "string",
        },
      ],
      name: "getTokenIdByHash",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_user",
          type: "address",
        },
      ],
      name: "getUserFiles",
      outputs: [
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_user",
          type: "address",
        },
      ],
      name: "hasAccess",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_user",
          type: "address",
        },
      ],
      name: "revokeAccess",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_user",
          type: "address",
        },
      ],
      name: "shareFile",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_name",
          type: "string",
        },
        {
          internalType: "string",
          name: "_fileType",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "_size",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_ipfsHash",
          type: "string",
        },
        {
          internalType: "string",
          name: "_tokenURI",
          type: "string",
        },
        {
          internalType: "bool",
          name: "_encrypted",
          type: "bool",
        },
        {
          internalType: "string",
          name: "_category",
          type: "string",
        },
      ],
      name: "uploadFile",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
}
