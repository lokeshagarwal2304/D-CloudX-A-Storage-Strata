"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, Check, Loader2 } from "lucide-react"
import type { FileData } from "@/lib/types"
import { generateUniqueId } from "@/lib/utils"

interface UploadAreaProps {
  onFileUpload: (files: FileData[]) => void
}

export default function UploadArea({ onFileUpload }: UploadAreaProps) {
  const [uploadingFiles, setUploadingFiles] = useState<
    {
      file: File
      progress: number
      status: "uploading" | "complete" | "error"
    }[]
  >([])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Simulate file upload process
      const newUploadingFiles = acceptedFiles.map((file) => ({
        file,
        progress: 0,
        status: "uploading" as const,
      }))

      setUploadingFiles((prev) => [...prev, ...newUploadingFiles])

      // Simulate upload progress
      newUploadingFiles.forEach((fileObj, index) => {
        const intervalId = setInterval(() => {
          setUploadingFiles((prev) => {
            const newFiles = [...prev]
            const fileIndex = newFiles.findIndex((f) => f.file === fileObj.file)

            if (fileIndex !== -1) {
              if (newFiles[fileIndex].progress < 100) {
                newFiles[fileIndex].progress += 5
              } else {
                newFiles[fileIndex].status = "complete"
                clearInterval(intervalId)

                // Convert to FileData and add to main files list
                setTimeout(() => {
                  const newFileData: FileData[] = [
                    {
                      id: generateUniqueId(),
                      name: fileObj.file.name,
                      size: fileObj.file.size / (1024 * 1024), // Convert to MB
                      type: fileObj.file.name.split(".").pop() || "unknown",
                      lastModified: new Date(fileObj.file.lastModified),
                      category: getCategoryFromType(fileObj.file.type),
                      encrypted: true,
                      shared: false,
                    },
                  ]

                  onFileUpload(newFileData)

                  // Remove from uploading list after a delay
                  setTimeout(() => {
                    setUploadingFiles((prev) => prev.filter((f) => f.file !== fileObj.file))
                  }, 1000)
                }, 500)
              }
            }

            return newFiles
          })
        }, 100)
      })
    },
    [onFileUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: uploadingFiles.length > 0,
  })

  const getCategoryFromType = (type: string): string => {
    if (type.includes("image")) return "Images"
    if (type.includes("video")) return "Videos"
    if (type.includes("audio")) return "Audio"
    if (type.includes("pdf")) return "Documents"
    if (type.includes("spreadsheet") || type.includes("excel")) return "Spreadsheets"
    if (type.includes("zip") || type.includes("archive")) return "Archives"
    return "Other"
  }

  return (
    <div className="mb-6">
      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden rounded-xl 
          border-2 border-dashed transition-all duration-300
          ${
            isDragActive
              ? "border-cyan-500 bg-slate-800/50"
              : "border-slate-700 bg-slate-800/30 hover:bg-slate-800/40 hover:border-slate-600"
          }
          backdrop-blur-lg p-6
        `}
      >
        <input {...getInputProps()} />

        {uploadingFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div
              className={`
              mb-4 rounded-full p-3
              ${isDragActive ? "bg-cyan-500/20 text-cyan-400" : "bg-slate-700/50 text-slate-400"}
            `}
            >
              <Upload size={24} className={isDragActive ? "animate-bounce" : ""} />
            </div>
            <p className="text-lg font-medium text-white mb-1">
              {isDragActive ? "Drop files here" : "Drag & drop files here"}
            </p>
            <p className="text-sm text-slate-400">
              or <span className="text-cyan-400">browse</span> to upload
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Files are automatically encrypted and distributed across the network
            </p>
          </div>
        ) : (
          <div className="space-y-3 py-2">
            <AnimatePresence>
              {uploadingFiles.map((fileObj, index) => (
                <motion.div
                  key={`${fileObj.file.name}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center bg-slate-800/80 rounded-lg p-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center mr-3">
                    {fileObj.status === "uploading" && <Loader2 size={20} className="text-cyan-400 animate-spin" />}
                    {fileObj.status === "complete" && <Check size={20} className="text-green-400" />}
                    {fileObj.status === "error" && <X size={20} className="text-red-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{fileObj.file.name}</p>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                        initial={{ width: "0%" }}
                        animate={{ width: `${fileObj.progress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </div>
                  <div className="ml-3 text-xs text-slate-400 w-12 text-right">
                    {fileObj.progress < 100 ? `${fileObj.progress}%` : "Done"}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {uploadingFiles.length > 0 && uploadingFiles.some((f) => f.status === "uploading") && (
              <div className="flex justify-center pt-2">
                <p className="text-xs text-slate-500">Encrypting and uploading to decentralized network...</p>
              </div>
            )}
          </div>
        )}

        {isDragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-sm"
          />
        )}
      </div>
    </div>
  )
}
