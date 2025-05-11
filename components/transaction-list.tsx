"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, Clock, ExternalLink } from "lucide-react"
import { useWeb3 } from "@/lib/web3/hooks/useWeb3Provider"
import { WEB3_CONFIG } from "@/lib/web3/config"
import type { TransactionStatus } from "@/lib/types"

interface TransactionListProps {
  limit?: number
}

export default function TransactionList({ limit = 5 }: TransactionListProps) {
  const { chainId } = useWeb3()
  const [transactions, setTransactions] = useState<TransactionStatus[]>([])

  // Mock transactions for demo purposes
  useEffect(() => {
    const mockTransactions: TransactionStatus[] = [
      {
        hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        status: "confirmed",
        description: "Upload Project Proposal.pdf",
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      },
      {
        hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        status: "confirmed",
        description: "Share Financial Report with 0x1234...5678",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
      {
        hash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
        status: "pending",
        description: "Upload Team Photo.jpg",
        timestamp: new Date(Date.now() - 1000 * 60), // 1 minute ago
      },
    ]

    setTransactions(mockTransactions)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Check size={16} className="text-green-400" />
      case "failed":
        return <X size={16} className="text-red-400" />
      case "pending":
        return <Clock size={16} className="text-amber-400" />
      default:
        return <Clock size={16} className="text-slate-400" />
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return `${diffInSeconds} sec ago`
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} min ago`
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hr ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const getExplorerUrl = (hash: string) => {
    if (!chainId) return "#"
    const network = WEB3_CONFIG.networks[chainId as keyof typeof WEB3_CONFIG.networks]
    if (!network) return "#"
    return `${network.blockExplorer}/tx/${hash}`
  }

  return (
    <div className="bg-slate-800/30 backdrop-blur-lg rounded-xl border border-slate-700/50 overflow-hidden">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
      </div>

      <div className="p-4">
        <AnimatePresence>
          {transactions.length > 0 ? (
            transactions.slice(0, limit).map((tx, index) => (
              <motion.div
                key={tx.hash}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-center py-3 border-b border-slate-700/30 last:border-0"
              >
                <div className="w-8 h-8 rounded-full bg-slate-800/70 flex items-center justify-center mr-3">
                  {getStatusIcon(tx.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{tx.description}</p>
                  <div className="flex items-center mt-1">
                    <p className="text-xs text-slate-400 truncate">
                      {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                    </p>
                    <span className="mx-2 text-slate-600">•</span>
                    <p className="text-xs text-slate-500">{formatTime(tx.timestamp)}</p>
                  </div>
                </div>
                <a
                  href={getExplorerUrl(tx.hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              </motion.div>
            ))
          ) : (
            <div className="py-6 text-center text-slate-500">
              <p>No transactions yet</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
