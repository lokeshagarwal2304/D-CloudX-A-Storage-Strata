"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useWeb3 } from "@/lib/web3/hooks/useWeb3Provider"
import { useFileStorage } from "@/lib/web3/hooks/useFileStorage"
import type { FileData } from "@/lib/types"
import { FileText, FileImage, FileVideo, File, ExternalLink, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NFTGallery() {
  const { isConnected, account } = useWeb3()
  const { getUserFiles } = useFileStorage()
  const [files, setFiles] = useState<FileData[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isConnected) {
      loadUserFiles()
    }
  }, [isConnected, account])

  const loadUserFiles = async () => {
    try {
      setLoading(true)
      const userFiles = await getUserFiles()
      setFiles(userFiles)
    } catch (error) {
      console.error("Error loading user files:", error)
    } finally {
      setLoading(false)
    }
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
      case "doc":
      case "docx":
      case "txt":
      case "md":
        return <FileText className="text-blue-400" size={32} />
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "svg":
        return <FileImage className="text-purple-400" size={32} />
      case "mp4":
      case "mov":
      case "avi":
      case "webm":
        return <FileVideo className="text-red-400" size={32} />
      default:
        return <File className="text-slate-400" size={32} />
    }
  }

  if (!isConnected) {
    return (
      <div className="bg-slate-800/30 backdrop-blur-lg rounded-xl border border-slate-700/50 p-6 text-center">
        <h2 className="text-lg font-semibold text-white mb-4">NFT Gallery</h2>
        <p className="text-slate-400 mb-4">Connect your wallet to view your file NFTs</p>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
          Connect Wallet
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/30 backdrop-blur-lg rounded-xl border border-slate-700/50 overflow-hidden">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-semibold text-white">NFT Gallery</h2>
        <p className="text-sm text-slate-400">Your files represented as NFTs on the blockchain</p>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-10 h-10 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
          </div>
        ) : files.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 overflow-hidden hover:border-slate-600/70 transition-all duration-300"
              >
                <div className="p-4 flex items-center">
                  <div className="w-16 h-16 bg-slate-700/30 rounded-lg flex items-center justify-center mr-4">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">{file.name}</h3>
                    <div className="flex items-center mt-1">
                      <p className="text-xs text-slate-400">Token ID: {file.id.substring(0, 8)}...</p>
                      {file.encrypted && (
                        <div className="ml-2 text-cyan-400" title="Encrypted">
                          <Lock size={12} />
                        </div>
                      )}
                    </div>
                    <div className="mt-2 flex items-center">
                      <a
                        href={`https://ipfs.io/ipfs/${file.ipfsHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-cyan-400 hover:underline flex items-center"
                      >
                        <ExternalLink size={10} className="mr-1" />
                        View on IPFS
                      </a>
                      <span className="mx-2 text-slate-600">•</span>
                      <a
                        href={`https://sepolia.etherscan.io/token/${file.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-cyan-400 hover:underline flex items-center"
                      >
                        <ExternalLink size={10} className="mr-1" />
                        View NFT
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <p>No NFTs found</p>
            <p className="text-sm mt-2">Upload files to create NFTs</p>
          </div>
        )}
      </div>
    </div>
  )
}
