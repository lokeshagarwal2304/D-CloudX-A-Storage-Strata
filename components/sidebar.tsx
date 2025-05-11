"use client"

import { Home, FolderOpen, HardDrive, Share2, Shield, Settings, LogOut, Database, ImageIcon } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "files", label: "My Files", icon: FolderOpen },
    { id: "storage", label: "Storage", icon: HardDrive },
    { id: "nfts", label: "NFT Gallery", icon: ImageIcon },
    { id: "shared", label: "Shared", icon: Share2 },
    { id: "security", label: "Security", icon: Shield },
    { id: "nodes", label: "Nodes", icon: Database },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="w-20 lg:w-64 h-full bg-slate-900/50 backdrop-blur-xl border-r border-slate-700/50 flex flex-col">
      <div className="p-4 flex items-center justify-center lg:justify-start">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-white font-bold text-lg">D</span>
        </div>
        <h1 className="hidden lg:block ml-3 text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
          D-CloudX
        </h1>
      </div>

      <nav className="mt-8 flex-1">
        <ul className="space-y-2 px-2">
          {menuItems.map((item) => {
            const isActive = activeView === item.id
            const Icon = item.icon

            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  className={cn(
                    "w-full flex items-center justify-center lg:justify-start p-3 rounded-xl transition-all duration-300",
                    isActive ? "bg-slate-800/80 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/50",
                  )}
                >
                  <div className="relative">
                    <Icon size={20} />
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -left-1 -right-1 -bottom-1 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </div>
                  <span className={cn("hidden lg:block ml-3", isActive && "font-medium")}>{item.label}</span>
                  {isActive && (
                    <div className="hidden lg:block ml-auto w-1.5 h-6 rounded-full bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-600" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 mt-auto">
        <button className="w-full flex items-center justify-center lg:justify-start p-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-300">
          <LogOut size={20} />
          <span className="hidden lg:block ml-3">Logout</span>
        </button>
      </div>
    </div>
  )
}
