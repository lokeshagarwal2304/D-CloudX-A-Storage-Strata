// Knowledge base for the D-CloudX chatbot assistant
// This contains structured information about various topics related to decentralized storage and Web3

export const CHATBOT_KNOWLEDGE_BASE = {
  // General information about D-CloudX
  general: {
    about: {
      question: "What is D-CloudX?",
      answer:
        "D-CloudX is a decentralized cloud storage platform that leverages blockchain technology and IPFS (InterPlanetary File System) to provide secure, transparent, and user-controlled file storage. Unlike traditional cloud storage services, D-CloudX gives you full ownership of your data through decentralized storage and smart contracts.",
    },
    benefits: {
      question: "What are the benefits of using D-CloudX?",
      answer:
        "D-CloudX offers several advantages over traditional cloud storage: 1) Full data ownership - your files are controlled by your wallet, not a central authority. 2) Enhanced security through automatic encryption and blockchain verification. 3) Censorship resistance - no single entity can remove your files. 4) Transparency - all file transactions are recorded on the blockchain. 5) Cost efficiency - pay only for what you use without intermediary markups.",
    },
    howItWorks: {
      question: "How does D-CloudX work?",
      answer:
        "D-CloudX works by combining blockchain technology with decentralized storage networks like IPFS. When you upload a file, it's encrypted (if you choose), split into pieces, and distributed across the IPFS network. A smart contract on the blockchain creates an NFT representing your file and stores metadata like the IPFS hash. This creates a permanent record of ownership while ensuring your files are securely stored across a distributed network.",
    },
  },

  // Information about file management
  files: {
    upload: {
      question: "How do I upload files?",
      answer:
        "To upload files to D-CloudX, first connect your Web3 wallet (like MetaMask). Then, navigate to the upload area and either drag and drop files or click to browse your device. You can choose to encrypt your files and select a category before uploading. The file will be processed, uploaded to IPFS, and registered on the blockchain as an NFT that represents your file ownership.",
    },
    download: {
      question: "How do I download my files?",
      answer:
        "To download a file, simply navigate to your files in the dashboard, find the file you want to download, and click on it to preview. From the preview window, click the 'Download' button. If the file is encrypted, it will be automatically decrypted using your wallet's credentials before download.",
    },
    sharing: {
      question: "How can I share files with others?",
      answer:
        "You can share files by selecting a file and clicking the 'Share' option. You'll need to enter the recipient's wallet address. This creates a transaction on the blockchain that grants permission to that address to access your file. You can revoke access at any time through the same interface.",
    },
    encryption: {
      question: "How does file encryption work?",
      answer:
        "When you enable encryption during upload, your files are encrypted client-side (in your browser) before being uploaded to IPFS. The encryption keys are derived from your wallet, ensuring that only you and those you explicitly share with can decrypt and access the files. This provides end-to-end encryption where not even the network operators can view your data.",
    },
    delete: {
      question: "Can I delete files from D-CloudX?",
      answer:
        "While files stored on IPFS are inherently persistent, D-CloudX allows you to 'delete' files by removing them from your account and revoking access through the smart contract. However, if others have pinned your file on IPFS, copies may still exist on the network. For sensitive data, we recommend using encryption to ensure that even if the encrypted file persists, it remains inaccessible without the proper keys.",
    },
  },

  // Information about blockchain and Web3 concepts
  blockchain: {
    wallets: {
      question: "What is a Web3 wallet?",
      answer:
        "A Web3 wallet (like MetaMask, Trust Wallet, or Coinbase Wallet) is a digital wallet that allows you to interact with blockchain applications. It stores your private keys and manages your blockchain identities and digital assets. In D-CloudX, your wallet serves as both your login method and the key to encrypting and accessing your files. It signs transactions when you upload, share, or manage files on the platform.",
    },
    gas: {
      question: "What are gas fees?",
      answer:
        "Gas fees are payments made to blockchain network validators to process your transactions. When you perform actions on D-CloudX that interact with the blockchain (like uploading or sharing files), you'll need to pay a small gas fee in the native cryptocurrency of the blockchain (e.g., ETH for Ethereum). These fees vary based on network congestion and the complexity of the transaction.",
    },
    smartContracts: {
      question: "What are smart contracts?",
      answer:
        "Smart contracts are self-executing programs stored on a blockchain that run when predetermined conditions are met. In D-CloudX, smart contracts manage file ownership, access permissions, and sharing capabilities. They automatically enforce the rules of file storage and access without requiring a central authority, creating a trustless system where the code itself guarantees the correct execution of file operations.",
    },
    networks: {
      question: "Which blockchain networks does D-CloudX support?",
      answer:
        "D-CloudX currently supports multiple EVM-compatible networks including Ethereum, Polygon, Optimism, Arbitrum, and Base. We recommend using Layer 2 solutions like Polygon for most users due to lower gas fees and faster transaction times, while still maintaining the security guarantees of Ethereum.",
    },
  },

  // Information about decentralized storage
  storage: {
    ipfs: {
      question: "What is IPFS?",
      answer:
        "IPFS (InterPlanetary File System) is a protocol and peer-to-peer network for storing and sharing data in a distributed file system. Unlike traditional HTTP where files are identified by their location, IPFS identifies files by their content (using a unique content identifier or CID). This makes IPFS resistant to censorship and creates a more resilient storage system where files can be retrieved from any node that has a copy, not just a central server.",
    },
    filecoin: {
      question: "What is Filecoin and how does it relate to D-CloudX?",
      answer:
        "Filecoin is a decentralized storage network built on top of IPFS that adds economic incentives for long-term file storage. While IPFS provides the distributed storage mechanism, Filecoin ensures files remain available by creating a marketplace where storage providers are paid to store data. D-CloudX can utilize Filecoin for persistent storage of your files, ensuring they remain available even if individual IPFS nodes go offline.",
    },
    pinning: {
      question: "What is IPFS pinning?",
      answer:
        "Pinning is the process of telling an IPFS node to keep a file in its local storage, preventing it from being removed during garbage collection. When you upload a file to D-CloudX, we automatically pin your file to ensure it remains available. We use reliable pinning services to maintain your files on the IPFS network even when you're offline.",
    },
    persistence: {
      question: "How long will my files be stored?",
      answer:
        "Files uploaded to D-CloudX are stored indefinitely as long as they remain pinned on IPFS. We ensure your files are pinned to reliable IPFS nodes and can optionally use Filecoin for guaranteed long-term storage. Unlike traditional cloud storage with monthly fees, D-CloudX uses a one-time payment model for storage, making it more cost-effective for long-term file storage.",
    },
  },

  // Information about NFTs and tokenization
  nfts: {
    fileNFTs: {
      question: "How are my files represented as NFTs?",
      answer:
        "When you upload a file to D-CloudX, our smart contract creates a non-fungible token (NFT) that represents ownership of that file. This NFT contains metadata about your file, including its IPFS hash, name, size, and other attributes. The NFT is minted to your wallet address, giving you provable ownership of the file on the blockchain. This tokenization enables features like transferring ownership or selling access to your files.",
    },
    viewing: {
      question: "Where can I see my file NFTs?",
      answer:
        "Your file NFTs are visible in the NFT Gallery section of D-CloudX. Additionally, since they're standard ERC-721 tokens, they can be viewed in any NFT marketplace or wallet that supports the blockchain network you're using (like OpenSea, Rarible, or directly in MetaMask).",
    },
    trading: {
      question: "Can I sell or trade my file NFTs?",
      answer:
        "Yes, the file NFTs created by D-CloudX are standard ERC-721 tokens that can be transferred or sold like any other NFT. This creates interesting possibilities for content creators who want to monetize their digital assets. However, remember that selling the NFT transfers ownership of the file access rights to the buyer.",
    },
  },

  // Information about security and privacy
  security: {
    dataPrivacy: {
      question: "How does D-CloudX protect my privacy?",
      answer:
        "D-CloudX protects your privacy through several mechanisms: 1) Client-side encryption ensures your files are encrypted before leaving your device. 2) Decentralized storage means no single entity has control over your data. 3) Blockchain-based access control ensures only authorized wallets can access your files. 4) No personal information is required to use the service - your wallet address is your identity.",
    },
    encryption: {
      question: "What encryption does D-CloudX use?",
      answer:
        "D-CloudX uses AES-256 encryption, a military-grade encryption standard, to secure your files. The encryption is performed client-side in your browser before the file is uploaded to IPFS. The encryption keys are derived from your wallet's cryptographic keys, ensuring that only you and those you explicitly share with can decrypt the files.",
    },
    security: {
      question: "How secure is D-CloudX compared to traditional cloud storage?",
      answer:
        "D-CloudX offers several security advantages over traditional cloud storage: 1) No central point of failure that can be hacked. 2) End-to-end encryption where not even the service providers can access your data. 3) Blockchain verification that prevents unauthorized modifications. 4) Distributed storage that makes data breaches much more difficult. 5) Cryptographic proof of ownership through NFTs.",
    },
  },

  // Troubleshooting and support
  support: {
    walletIssues: {
      question: "I'm having trouble connecting my wallet. What should I do?",
      answer:
        "If you're having trouble connecting your wallet: 1) Make sure you have a compatible wallet installed (MetaMask, Coinbase Wallet, etc.). 2) Check that you're on a supported network (Ethereum, Polygon, etc.). 3) Try refreshing the page or reconnecting the wallet. 4) Ensure your wallet is unlocked. 5) If using a hardware wallet, make sure it's connected and unlocked. If problems persist, please contact our support team.",
    },
    uploadFailed: {
      question: "My file upload failed. What should I do?",
      answer:
        "If your file upload failed: 1) Check your internet connection. 2) Ensure your wallet has enough funds for gas fees. 3) Verify the file isn't too large (current max size is 100MB). 4) Try disabling encryption temporarily to see if that's causing issues. 5) Check if the transaction was rejected in your wallet. If problems persist, try uploading a smaller file first to test the connection.",
    },
    cannotAccess: {
      question: "I can't access my files. What should I do?",
      answer:
        "If you can't access your files: 1) Ensure you're connected with the same wallet that uploaded the files. 2) Check that you're on the correct blockchain network. 3) Verify your internet connection. 4) Try clearing your browser cache. 5) Check if the IPFS gateway is responding by testing a public IPFS link. If problems persist, please contact support with your wallet address and details about the files you're trying to access.",
    },
  },
}

// Suggested questions based on user context
export const SUGGESTED_QUESTIONS = {
  newUser: ["What is D-CloudX?", "How does D-CloudX work?", "What is a Web3 wallet?", "How do I upload files?"],
  afterWalletConnect: [
    "How do I upload files?",
    "What are gas fees?",
    "Which blockchain networks does D-CloudX support?",
    "How secure is D-CloudX?",
  ],
  afterUpload: [
    "How can I share files with others?",
    "How does file encryption work?",
    "Where can I see my file NFTs?",
    "How long will my files be stored?",
  ],
  troubleshooting: [
    "I'm having trouble connecting my wallet. What should I do?",
    "My file upload failed. What should I do?",
    "I can't access my files. What should I do?",
    "What are gas fees?",
  ],
}

// Function to find the best matching response for a user query
export function findBestResponse(query: string): string {
  // Convert query to lowercase for case-insensitive matching
  const normalizedQuery = query.toLowerCase()

  // Check for exact matches in questions
  for (const category of Object.values(CHATBOT_KNOWLEDGE_BASE)) {
    for (const item of Object.values(category)) {
      if (item.question.toLowerCase() === normalizedQuery) {
        return item.answer
      }
    }
  }

  // Check for keyword matches
  const allResponses = Object.values(CHATBOT_KNOWLEDGE_BASE).flatMap((category) =>
    Object.values(category).map((item) => ({
      question: item.question,
      answer: item.answer,
      score: calculateRelevanceScore(normalizedQuery, item.question.toLowerCase()),
    })),
  )

  // Sort by relevance score
  allResponses.sort((a, b) => b.score - a.score)

  // Return the most relevant answer if it has a minimum score
  if (allResponses.length > 0 && allResponses[0].score > 0.3) {
    return allResponses[0].answer
  }

  // Default response if no good match is found
  return "I don't have specific information about that. Could you try rephrasing your question about D-CloudX or decentralized storage?"
}

// Calculate relevance score between query and potential match
function calculateRelevanceScore(query: string, target: string): number {
  // Simple keyword matching algorithm
  const queryWords = query.split(/\s+/).filter((word) => word.length > 2)
  const targetWords = target.split(/\s+/)

  let matchCount = 0
  for (const queryWord of queryWords) {
    if (target.includes(queryWord)) {
      matchCount++
    }
  }

  // Calculate score based on percentage of query words found in target
  return queryWords.length > 0 ? matchCount / queryWords.length : 0
}

// Get all available questions for browsing
export function getAllQuestions(): string[] {
  return Object.values(CHATBOT_KNOWLEDGE_BASE).flatMap((category) =>
    Object.values(category).map((item) => item.question),
  )
}

// Get suggested questions based on context
export function getSuggestedQuestions(context: keyof typeof SUGGESTED_QUESTIONS): string[] {
  return SUGGESTED_QUESTIONS[context] || SUGGESTED_QUESTIONS.newUser
}
