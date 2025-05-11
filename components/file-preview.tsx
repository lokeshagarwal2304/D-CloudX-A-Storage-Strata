"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download, Share2, Lock, FileText, FileImage, FileVideo, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FileData } from "@/lib/types"
import { formatFileSize, formatDate } from "@/lib/utils"

interface FilePreviewProps {
  file: FileData | null
  onClose: () => void
}

export default function FilePreview({ file, onClose }: FilePreviewProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (file) {
      // Simulate loading delay
      const timer = setTimeout(() => {
        setLoading(false)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [file])

  if (!file) return null

  const getFileIcon = () => {
    const type = file.type.toLowerCase()

    if (["pdf", "doc", "docx", "txt", "md"].includes(type)) {
      return <FileText size={48} className="text-blue-400" />
    } else if (["jpg", "jpeg", "png", "gif", "svg"].includes(type)) {
      return <FileImage size={48} className="text-purple-400" />
    } else if (["mp4", "mov", "avi", "webm"].includes(type)) {
      return <FileVideo size={48} className="text-red-400" />
    } else {
      return <File size={48} className="text-slate-400" />
    }
  }

  const renderPreview = () => {
    const type = file.type.toLowerCase()

    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
        </div>
      )
    }

    if (["jpg", "jpeg", "png", "gif"].includes(type)) {
      return (
        <div className="flex items-center justify-center h-full">
          <img
            src={`/placeholder.svg?height=400&width=600&text=${file.name}`}
            alt={file.name}
            className="max-h-full max-w-full object-contain rounded-lg"
          />
        </div>
      )
    } else if (["mp4", "mov", "webm"].includes(type)) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="relative w-full max-w-2xl aspect-video bg-slate-900 rounded-lg flex items-center justify-center">
            <FileVideo size={64} className="text-slate-700" />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <div className="bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full">
                <p className="text-white text-sm">Video preview not available</p>
              </div>
            </div>
          </div>
        </div>
      )
    } else if (["pdf", "doc", "docx", "txt"].includes(type)) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 max-w-lg w-full">
            <div className="flex justify-center mb-6">{getFileIcon()}</div>
            <h3 className="text-lg font-medium text-white text-center mb-2">{file.name}</h3>
            <p className="text-sm text-slate-400 text-center mb-6">
              This document requires special rendering. Please download to view.
            </p>
            <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
              <Download size={16} className="mr-2" />
              Download to View
            </Button>
          </div>
        </div>
      )
    } else {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50">
            <div className="flex justify-center mb-4">{getFileIcon()}</div>
            <h3 className="text-lg font-medium text-white text-center mb-2">{file.name}</h3>
            <p className="text-sm text-slate-400 text-center">Preview not available for this file type</p>
          </div>
        </div>
      )
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-900/90 backdrop-blur-xl rounded-xl border border-slate-700/50 w-full max-w-4xl h-[80vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center">
              {getFileIcon()}
              <div className="ml-3">
                <h2 className="text-lg font-semibold text-white">{file.name}</h2>
                <p className="text-sm text-slate-400">
                  {formatFileSize(file.size)} • {formatDate(file.lastModified)}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5 text-slate-400" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">{renderPreview()}</div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {file.encrypted && (
                <div className="flex items-center text-cyan-400 text-xs">
                  <Lock size={14} className="mr-1" />
                  <span>Encrypted</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="h-9">
                <Share2 size={16} className="mr-2" />
                Share
              </Button>
              <Button
                size="sm"
                className="h-9 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                <Download size={16} className="mr-2" />
                Download
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
