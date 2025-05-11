"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { FileData } from "@/lib/types"
import { formatFileSize } from "@/lib/utils"
import { HardDrive, Shield, Globe, Server, BarChart3, PieChart } from "lucide-react"

interface StorageStatsProps {
  files: FileData[]
}

export default function StorageStats({ files }: StorageStatsProps) {
  const [activeTab, setActiveTab] = useState("usage")

  // Calculate total storage
  const totalStorage = files.reduce((acc, file) => acc + file.size, 0)
  const totalStorageGB = totalStorage / 1024 // Convert to GB
  const storageLimit = 100 // GB
  const storagePercentage = (totalStorageGB / storageLimit) * 100

  // Calculate storage by category
  const storageByCategory = files.reduce(
    (acc, file) => {
      if (!acc[file.category]) {
        acc[file.category] = 0
      }
      acc[file.category] += file.size
      return acc
    },
    {} as Record<string, number>,
  )

  // Sort categories by size
  const sortedCategories = Object.entries(storageByCategory).sort(([, a], [, b]) => b - a)

  // Generate random colors for categories
  const categoryColors: Record<string, string> = {
    Documents: "from-blue-500 to-blue-600",
    Images: "from-purple-500 to-purple-600",
    Videos: "from-red-500 to-red-600",
    Spreadsheets: "from-green-500 to-green-600",
    Archives: "from-amber-500 to-amber-600",
    Other: "from-slate-500 to-slate-600",
  }

  // Network stats (simulated)
  const networkNodes = 128
  const networkAvailability = 99.99
  const networkRedundancy = 3

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/30 backdrop-blur-lg rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="flex border-b border-slate-700/50">
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === "usage" ? "text-white bg-slate-800/50" : "text-slate-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("usage")}
          >
            Storage Usage
          </button>
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === "network" ? "text-white bg-slate-800/50" : "text-slate-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("network")}
          >
            Network Status
          </button>
        </div>

        <div className="p-6">
          {activeTab === "usage" ? (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-white">Storage Used</h3>
                  <p className="text-sm text-slate-400">
                    {formatFileSize(totalStorage)} / {storageLimit} GB
                  </p>
                </div>

                <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min(storagePercentage, 100)}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>

                <div className="mt-1 text-xs text-slate-500 text-right">{storagePercentage.toFixed(1)}% used</div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-4">Storage by Category</h3>

                <div className="space-y-3">
                  {sortedCategories.map(([category, size]) => {
                    const percentage = (size / totalStorage) * 100
                    return (
                      <div key={category}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm text-slate-300">{category}</p>
                          <p className="text-sm text-slate-400">{formatFileSize(size)}</p>
                        </div>
                        <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${categoryColors[category] || "from-slate-500 to-slate-600"}`}
                            initial={{ width: "0%" }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-white">Files</h3>
                    <PieChart size={16} className="text-slate-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">{files.length}</p>
                  <p className="text-xs text-slate-500 mt-1">Total files stored</p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-white">Bandwidth</h3>
                    <BarChart3 size={16} className="text-slate-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">2.4 GB</p>
                  <p className="text-xs text-slate-500 mt-1">Used this month</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Server size={16} className="text-cyan-400 mr-2" />
                    <h3 className="text-sm font-medium text-white">Nodes</h3>
                  </div>
                  <p className="text-2xl font-bold text-white">{networkNodes}</p>
                  <p className="text-xs text-slate-500 mt-1">Active storage nodes</p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Shield size={16} className="text-green-400 mr-2" />
                    <h3 className="text-sm font-medium text-white">Uptime</h3>
                  </div>
                  <p className="text-2xl font-bold text-white">{networkAvailability}%</p>
                  <p className="text-xs text-slate-500 mt-1">Network availability</p>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-3">
                  <Globe size={16} className="text-purple-400 mr-2" />
                  <h3 className="text-sm font-medium text-white">Network Distribution</h3>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate-300">North America</p>
                    <p className="text-sm text-slate-400">42 nodes</p>
                  </div>
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden mb-3">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "35%" }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate-300">Europe</p>
                    <p className="text-sm text-slate-400">38 nodes</p>
                  </div>
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden mb-3">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "30%" }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate-300">Asia</p>
                    <p className="text-sm text-slate-400">32 nodes</p>
                  </div>
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden mb-3">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "25%" }}
                      transition={{ duration: 1, delay: 0.4 }}
                    />
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate-300">Other Regions</p>
                    <p className="text-sm text-slate-400">16 nodes</p>
                  </div>
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-500 to-red-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "10%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <HardDrive size={16} className="text-blue-400 mr-2" />
                  <h3 className="text-sm font-medium text-white">Redundancy</h3>
                </div>

                <p className="text-sm text-slate-300 mb-2">
                  Your files are stored across {networkRedundancy}x redundant nodes
                </p>

                <div className="flex space-x-2">
                  {[...Array(networkRedundancy)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      className="flex-1 h-8 rounded-md bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center"
                    >
                      <Server size={16} className="text-cyan-400" />
                    </motion.div>
                  ))}
                </div>

                <p className="text-xs text-slate-500 mt-3">
                  Your data is automatically distributed to ensure high availability
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
