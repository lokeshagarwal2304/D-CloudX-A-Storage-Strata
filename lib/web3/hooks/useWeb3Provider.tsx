"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { WEB3_CONFIG } from "../config"

// Mock ethers for frontend demo purposes
const mockEthers = {
  providers: {
    Web3Provider: class {
      constructor(ethereum: any) {
        // Mock constructor
      }

      getNetwork() {
        return { chainId: 11155111 } // Sepolia testnet
      }

      getSigner() {
        return {
          getAddress: async () => "0x1234567890123456789012345678901234567890",
          // Add other signer methods as needed
        }
      }
    },
  },
  Contract: class {
    constructor(address: string, abi: any, signerOrProvider: any) {
      // Mock constructor
    }

    // Add mock contract methods as needed
  },
}

// Mock window.ethereum for frontend demo
if (typeof window !== "undefined" && !window.ethereum) {
  window.ethereum = {
    isMetaMask: true,
    request: async ({ method, params }: { method: string; params?: any[] }) => {
      if (method === "eth_requestAccounts") {
        return ["0x1234567890123456789012345678901234567890"]
      }
      if (method === "eth_chainId") {
        return "0xaa36a7" // Sepolia chainId in hex
      }
      if (method === "wallet_switchEthereumChain") {
        return null
      }
      throw new Error(`Unhandled method: ${method}`)
    },
    on: (event: string, callback: any) => {
      // Mock event listener
    },
    removeListener: (event: string, callback: any) => {
      // Mock remove listener
    },
  }
}

interface Web3ContextType {
  provider: any | null
  signer: any | null
  account: string | null
  chainId: number | null
  isConnected: boolean
  isConnecting: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  getContract: (contractName: string) => any | null
  networkName: string | null
  switchNetwork: (chainId: number) => Promise<void>
  error: string | null
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export function Web3Provider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<any | null>(null)
  const [signer, setSigner] = useState<any | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if window is defined (browser environment)
  const isBrowser = typeof window !== "undefined"

  // Check if MetaMask is installed
  const isMetaMaskInstalled = isBrowser && typeof window.ethereum !== "undefined"

  // Connect wallet
  const connectWallet = async () => {
    if (!isMetaMaskInstalled) {
      setError("MetaMask is not installed. Please install MetaMask to use this application.")
      return
    }

    try {
      setIsConnecting(true)
      setError(null)

      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

      // Create ethers provider (using mock for demo)
      const ethersProvider = new mockEthers.providers.Web3Provider(window.ethereum)
      const ethersSigner = ethersProvider.getSigner()
      const network = await ethersProvider.getNetwork()

      setProvider(ethersProvider)
      setSigner(ethersSigner)
      setAccount(accounts[0])
      setChainId(network.chainId)

      // Save connection state to localStorage
      localStorage.setItem("walletConnected", "true")
    } catch (err: any) {
      console.error("Error connecting wallet:", err)
      setError(err.message || "Failed to connect wallet")
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setProvider(null)
    setSigner(null)
    setAccount(null)
    setChainId(null)

    // Remove connection state from localStorage
    localStorage.removeItem("walletConnected")
  }

  // Get contract instance
  const getContract = (contractName: string) => {
    if (!signer || !chainId) return null

    const contractAddresses = WEB3_CONFIG.contracts[contractName as keyof typeof WEB3_CONFIG.contracts]

    if (!contractAddresses) {
      console.error(`Contract ${contractName} not found in config`)
      return null
    }

    const contractAddress = contractAddresses[chainId as keyof typeof contractAddresses]

    if (!contractAddress) {
      console.error(`Contract ${contractName} not deployed on network ${chainId}`)
      return null
    }

    // Return mock contract for demo
    return new mockEthers.Contract(contractAddress, [], signer)
  }

  // Switch network
  const switchNetwork = async (targetChainId: number) => {
    if (!isMetaMaskInstalled || !provider) {
      setError("MetaMask is not installed or not connected")
      return
    }

    const networkConfig = WEB3_CONFIG.networks[targetChainId as keyof typeof WEB3_CONFIG.networks]

    if (!networkConfig) {
      setError(`Network with chain ID ${targetChainId} is not supported`)
      return
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      })

      // Update chainId after successful switch
      setChainId(targetChainId)
    } catch (switchError: any) {
      console.error("Error switching network:", switchError)
      setError("Failed to switch network")
    }
  }

  // Get network name
  const networkName = chainId
    ? WEB3_CONFIG.networks[chainId as keyof typeof WEB3_CONFIG.networks]?.name || `Unknown Network (${chainId})`
    : null

  // Auto-connect if previously connected
  useEffect(() => {
    const wasConnected = localStorage.getItem("walletConnected") === "true"

    if (wasConnected && isMetaMaskInstalled) {
      connectWallet()
    }
  }, [isMetaMaskInstalled])

  const value = {
    provider,
    signer,
    account,
    chainId,
    isConnected: !!account,
    isConnecting,
    connectWallet,
    disconnectWallet,
    getContract,
    networkName,
    switchNetwork,
    error,
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

export function useWeb3() {
  const context = useContext(Web3Context)

  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }

  return context
}

// Add TypeScript declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}
