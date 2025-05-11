export interface FileData {
  id: string
  name: string
  size: number // in MB
  type: string
  lastModified: Date
  category: string
  encrypted: boolean
  shared: boolean
  ipfsHash?: string
  tokenURI?: string
}

export interface NetworkInfo {
  name: string
  chainId: number
  icon?: string
}

export interface TransactionStatus {
  hash: string
  status: "pending" | "confirmed" | "failed"
  description: string
  timestamp: Date
}
