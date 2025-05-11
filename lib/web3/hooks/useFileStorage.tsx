"use client"

import { useState } from "react"
import { useWeb3 } from "./useWeb3Provider"
import { useIPFS } from "./useIPFS"
import type { FileData } from "@/lib/types"
import { generateUniqueId } from "@/lib/utils"

interface FileStorageHookReturn {
  uploadFile: (file: File, category: string, encrypted: boolean) => Promise<FileData>
  shareFile: (tokenId: string, address: string) => Promise<void>
  revokeAccess: (tokenId: string, address: string) => Promise<void>
  getUserFiles: () => Promise<FileData[]>
  isProcessing: boolean
  error: string | null
}

export function useFileStorage(): FileStorageHookReturn {
  const { getContract, account } = useWeb3()
  const { uploadToIPFS, uploadJSONToIPFS, getIPFSUrl } = useIPFS()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Upload file to IPFS and store metadata on blockchain
  const uploadFile = async (file: File, category: string, encrypted: boolean): Promise<FileData> => {
    try {
      setIsProcessing(true)
      setError(null)

      // Get file storage contract
      const fileStorageContract = getContract("fileStorage")
      if (!fileStorageContract) {
        throw new Error("File storage contract not found")
      }

      // Upload file to IPFS
      const ipfsHash = await uploadToIPFS(file)

      // Create metadata
      const metadata = {
        name: file.name,
        description: `File uploaded to D-CloudX by ${account}`,
        image: `ipfs://${ipfsHash}`,
        properties: {
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          category,
          encrypted,
        },
      }

      // Upload metadata to IPFS
      const metadataHash = await uploadJSONToIPFS(metadata)
      const tokenURI = `ipfs://${metadataHash}`

      // For demo purposes, simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a mock token ID
      const tokenId = generateUniqueId()

      // Return file data
      return {
        id: tokenId,
        name: file.name,
        size: file.size / (1024 * 1024), // Convert to MB
        type: file.name.split(".").pop() || "unknown",
        lastModified: new Date(file.lastModified),
        category,
        encrypted,
        shared: false,
        ipfsHash,
        tokenURI,
      }
    } catch (err: any) {
      console.error("Error uploading file:", err)
      setError(err.message || "Failed to upload file")
      throw err
    } finally {
      setIsProcessing(false)
    }
  }

  // Share file with another user
  const shareFile = async (tokenId: string, address: string): Promise<void> => {
    try {
      setIsProcessing(true)
      setError(null)

      // Get file storage contract
      const fileStorageContract = getContract("fileStorage")
      if (!fileStorageContract) {
        throw new Error("File storage contract not found")
      }

      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 1500))
    } catch (err: any) {
      console.error("Error sharing file:", err)
      setError(err.message || "Failed to share file")
      throw err
    } finally {
      setIsProcessing(false)
    }
  }

  // Revoke access to file
  const revokeAccess = async (tokenId: string, address: string): Promise<void> => {
    try {
      setIsProcessing(true)
      setError(null)

      // Get file storage contract
      const fileStorageContract = getContract("fileStorage")
      if (!fileStorageContract) {
        throw new Error("File storage contract not found")
      }

      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 1500))
    } catch (err: any) {
      console.error("Error revoking access:", err)
      setError(err.message || "Failed to revoke access")
      throw err
    } finally {
      setIsProcessing(false)
    }
  }

  // Get user files
  const getUserFiles = async (): Promise<FileData[]> => {
    try {
      setIsProcessing(true)
      setError(null)

      // Get file storage contract
      const fileStorageContract = getContract("fileStorage")
      if (!fileStorageContract || !account) {
        throw new Error("File storage contract not found or not connected")
      }

      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Return mock files for demo
      return [
        {
          id: "nft-1",
          name: "Blockchain Whitepaper.pdf",
          size: 3.2,
          type: "pdf",
          lastModified: new Date(Date.now() - 86400000 * 2), // 2 days ago
          category: "Documents",
          encrypted: true,
          shared: false,
          ipfsHash: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
        },
        {
          id: "nft-2",
          name: "Smart Contract Architecture.png",
          size: 1.8,
          type: "png",
          lastModified: new Date(Date.now() - 86400000), // 1 day ago
          category: "Images",
          encrypted: true,
          shared: true,
          ipfsHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
        },
      ]
    } catch (err: any) {
      console.error("Error getting user files:", err)
      setError(err.message || "Failed to get user files")
      return []
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    uploadFile,
    shareFile,
    revokeAccess,
    getUserFiles,
    isProcessing,
    error,
  }
}
