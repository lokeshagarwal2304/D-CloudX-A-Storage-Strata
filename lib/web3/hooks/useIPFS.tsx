"use client"

import { useState } from "react"

// Mock IPFS client for frontend demo purposes
// In a production environment, you would use the actual IPFS HTTP client
const mockIpfsClient = {
  add: async (data: ArrayBuffer | string): Promise<{ path: string }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate a mock CID (Content Identifier)
    const mockCid = `Qm${Array.from(
      { length: 44 },
      () => "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"[Math.floor(Math.random() * 58)],
    ).join("")}`

    return { path: mockCid }
  },
}

interface IPFSHookReturn {
  uploadToIPFS: (file: File) => Promise<string>
  uploadJSONToIPFS: (json: object) => Promise<string>
  isUploading: boolean
  error: string | null
  getIPFSUrl: (cid: string) => string
}

export function useIPFS(): IPFSHookReturn {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Upload file to IPFS
  const uploadToIPFS = async (file: File): Promise<string> => {
    try {
      setIsUploading(true)
      setError(null)

      // Read file as array buffer
      const buffer = await file.arrayBuffer()

      // Upload to IPFS (using mock client for demo)
      const result = await mockIpfsClient.add(buffer)

      return result.path
    } catch (err: any) {
      console.error("Error uploading to IPFS:", err)
      setError(err.message || "Failed to upload to IPFS")
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  // Upload JSON to IPFS
  const uploadJSONToIPFS = async (json: object): Promise<string> => {
    try {
      setIsUploading(true)
      setError(null)

      // Convert JSON to string
      const jsonString = JSON.stringify(json)

      // Upload to IPFS (using mock client for demo)
      const result = await mockIpfsClient.add(jsonString)

      return result.path
    } catch (err: any) {
      console.error("Error uploading JSON to IPFS:", err)
      setError(err.message || "Failed to upload JSON to IPFS")
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  // Get IPFS URL from CID
  const getIPFSUrl = (cid: string): string => {
    return `https://ipfs.io/ipfs/${cid}`
  }

  return {
    uploadToIPFS,
    uploadJSONToIPFS,
    isUploading,
    error,
    getIPFSUrl,
  }
}
