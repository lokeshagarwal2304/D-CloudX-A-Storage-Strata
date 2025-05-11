"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { FileData } from "@/lib/types"
import { Sparkles, FolderPlus, Clock, AlertTriangle, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AiSuggestionsProps {
  files: FileData[]
}

export default function AiSuggestions({ files }: AiSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<
    {
      id: string
      type: "organize" | "security" | "cleanup"
      title: string
      description: string
      action: string
      dismissed: boolean
    }[]
  >([
    {
      id: "1",
      type: "organize",
      title: "Organize Project Files",
      description: "We noticed several project-related files. Would you like to organize them into a new folder?",
      action: "Create Folder",
      dismissed: false,
    },
    {
      id: "2",
      type: "security",
      title: "Enhance Security",
      description: "Some of your shared files contain sensitive information. Consider adding password protection.",
      action: "Secure Files",
      dismissed: false,
    },
    {
      id: "3",
      type: "cleanup",
      title: "Clean Up Duplicates",
      description: "We detected 3 potential duplicate files that could be removed to save space.",
      action: "Review Files",
      dismissed: false,
    },
  ])

  const [recentActivity, setRecentActivity] = useState<
    {
      id: string
      action: string
      file: string
      time: string
      user: string
    }[]
  >([
    {
      id: "1",
      action: "Uploaded",
      file: "Financial Report Q1.xlsx",
      time: "2 hours ago",
      user: "You",
    },
    {
      id: "2",
      action: "Shared",
      file: "Team Photo.jpg",
      time: "5 hours ago",
      user: "You",
    },
    {
      id: "3",
      action: "Downloaded",
      file: "Project Proposal.pdf",
      time: "Yesterday",
      user: "Alex M.",
    },
  ])

  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")

  const dismissSuggestion = (id: string) => {
    setSuggestions((prev) =>
      prev.map((suggestion) => (suggestion.id === id ? { ...suggestion, dismissed: true } : suggestion)),
    )
  }

  const handleAction = (suggestion: (typeof suggestions)[0]) => {
    setNotificationMessage(`Action taken: ${suggestion.action} for "${suggestion.title}"`)
    setShowNotification(true)
    dismissSuggestion(suggestion.id)
  }

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showNotification])

  const getIconForSuggestion = (type: string) => {
    switch (type) {
      case "organize":
        return <FolderPlus className="text-cyan-400" />
      case "security":
        return <AlertTriangle className="text-amber-400" />
      case "cleanup":
        return <Clock className="text-purple-400" />
      default:
        return <Sparkles className="text-blue-400" />
    }
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-4 max-w-sm"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <Sparkles className="h-5 w-5 text-cyan-400" />
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium text-white">AI Assistant</p>
                <p className="mt-1 text-sm text-slate-400">{notificationMessage}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="inline-flex text-slate-400 hover:text-slate-300"
                  onClick={() => setShowNotification(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-slate-800/30 backdrop-blur-lg rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-700/50 flex items-center">
          <Sparkles className="h-5 w-5 text-cyan-400 mr-2" />
          <h2 className="text-lg font-semibold text-white">AI Suggestions</h2>
        </div>

        <div className="p-4">
          <AnimatePresence>
            {suggestions.filter((s) => !s.dismissed).length > 0 ? (
              suggestions
                .filter((suggestion) => !suggestion.dismissed)
                .map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 p-4 mb-3 last:mb-0 hover:border-slate-600/70 transition-all duration-300"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">{getIconForSuggestion(suggestion.type)}</div>
                      <div className="ml-3 flex-1">
                        <h3 className="text-sm font-medium text-white">{suggestion.title}</h3>
                        <p className="mt-1 text-xs text-slate-400">{suggestion.description}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <Button
                            size="sm"
                            className="h-8 text-xs bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                            onClick={() => handleAction(suggestion)}
                          >
                            {suggestion.action}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs text-slate-400 hover:text-white"
                            onClick={() => dismissSuggestion(suggestion.id)}
                          >
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6 text-slate-500">
                <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No suggestions at the moment</p>
                <p className="text-xs mt-1">Check back later for AI recommendations</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-slate-800/30 backdrop-blur-lg rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-700/50 flex items-center">
          <Clock className="h-5 w-5 text-purple-400 mr-2" />
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>

        <div className="p-4">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              className="flex items-center py-2 border-b border-slate-700/30 last:border-0"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 mr-3" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">
                  <span className="text-slate-400">{activity.action}</span> {activity.file}
                </p>
                <p className="text-xs text-slate-500">
                  {activity.time} by {activity.user}
                </p>
              </div>
              <ChevronRight size={16} className="text-slate-600" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
