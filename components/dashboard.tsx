"use client"

import { useState } from "react"
import Sidebar from "./sidebar"
import FileExplorer from "./file-explorer"
import StorageStats from "./storage-stats"
import AiSuggestions from "./ai-suggestions"
import Web3UploadArea from "./web3-upload-area"
import ThemeToggle from "./theme-toggle"
import WalletConnect from "./wallet-connect"
import TransactionList from "./transaction-list"
import NFTGallery from "./nft-gallery"
import Chatbot from "./chatbot/chatbot"
import { Web3Provider } from "@/lib/web3/hooks/useWeb3Provider"
import type { FileData } from "@/lib/types"
import { AnimatePresence, motion } from "framer-motion"

export default function Dashboard() {
  const [files, setFiles] = useState<FileData[]>([
    {
      id: "1",
      name: "Project Proposal.pdf",
      size: 2.4,
      type: "pdf",
      lastModified: new Date("2023-04-15"),
      category: "Documents",
      encrypted: true,
      shared: false,
    },
    {
      id: "2",
      name: "Financial Report Q1.xlsx",
      size: 1.8,
      type: "xlsx",
      lastModified: new Date("2023-04-10"),
      category: "Spreadsheets",
      encrypted: true,
      shared: true,
    },
    {
      id: "3",
      name: "Team Photo.jpg",
      size: 3.2,
      type: "jpg",
      lastModified: new Date("2023-04-05"),
      category: "Images",
      encrypted: true,
      shared: false,
    },
    {
      id: "4",
      name: "Product Demo.mp4",
      size: 15.7,
      type: "mp4",
      lastModified: new Date("2023-04-01"),
      category: "Videos",
      encrypted: true,
      shared: true,
    },
    {
      id: "5",
      name: "API Documentation.md",
      size: 0.5,
      type: "md",
      lastModified: new Date("2023-03-28"),
      category: "Documents",
      encrypted: true,
      shared: false,
    },
    {
      id: "6",
      name: "Source Code.zip",
      size: 7.3,
      type: "zip",
      lastModified: new Date("2023-03-25"),
      category: "Archives",
      encrypted: true,
      shared: false,
    },
  ])

  const [activeView, setActiveView] = useState("files")
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: string }[]>([])

  const handleFileUpload = (newFiles: FileData[]) => {
    setFiles((prev) => [...prev, ...newFiles])

    // Add notification
    const newNotification = {
      id: Date.now().toString(),
      message: `${newFiles.length} file${newFiles.length > 1 ? "s" : ""} uploaded successfully`,
      type: "success",
    }

    setNotifications((prev) => [...prev, newNotification])

    // Remove notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id))
    }, 5000)
  }

  return (
    <Web3Provider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />

        <div className="flex-1 overflow-hidden">
          <div className="h-full p-6 overflow-auto">
            {/* Header with Theme Toggle and Wallet Connect */}
            <div className="fixed top-6 right-6 z-40 flex items-center space-x-3">
              <ThemeToggle />
              <WalletConnect />
            </div>

            {/* Notifications */}
            <div className="fixed top-20 right-6 z-40 space-y-2">
              <AnimatePresence>
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: -20, x: 20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg p-3 pr-4 max-w-sm flex items-center"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-400 mr-3"></div>
                    <p className="text-sm text-white">{notification.message}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 gap-6 lg:grid-cols-3 pt-16"
            >
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {activeView === "files" && (
                    <motion.div
                      key="files"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Web3UploadArea onFileUpload={handleFileUpload} />
                      <FileExplorer files={files} />
                    </motion.div>
                  )}
                  {activeView === "storage" && (
                    <motion.div
                      key="storage"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <StorageStats files={files} />
                      <div className="mt-6">
                        <TransactionList />
                      </div>
                    </motion.div>
                  )}
                  {activeView === "nfts" && (
                    <motion.div
                      key="nfts"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <NFTGallery />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="lg:col-span-1">
                <AiSuggestions files={files} />
              </div>
            </motion.div>

            {/* Chatbot */}
            <Chatbot />
          </div>
        </div>
      </div>
    </Web3Provider>
  )
}
