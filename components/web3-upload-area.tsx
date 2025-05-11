"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, Check, Loader2, Lock, Unlock } from "lucide-react"
import { useWeb3 } from "@/lib/web3/hooks/useWeb3Provider"
import { useFileStorage } from "@/lib/web3/hooks/useFileStorage"
import type { FileData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Web3UploadAreaProps {
  onFileUpload: (files: FileData[]) => void
}

export default function Web3UploadArea({ onFileUpload }: Web3UploadAreaProps) {
  const { isConnected } = useWeb3()
  const { uploadFile, isProcessing, error } = useFileStorage()

  const [uploadingFiles, setUploadingFiles] = useState<
    {
      file: File
      progress: number
      status: "uploading" | "complete" | "error" | "processing"
      message?: string
    }[]
  >([])

  const [encrypt, setEncrypt] = useState(true)
  const [category, setCategory] = useState("Documents")

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!isConnected) {
        alert("Please connect your wallet first")
        return
      }

      // Add files to uploading state
      const newUploadingFiles = acceptedFiles.map((file) => ({
        file,
        progress: 0,
        status: "uploading" as const,
      }))

      setUploadingFiles((prev) => [...prev, ...newUploadingFiles])

      // Process each file
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i]
        const fileIndex = i

        try {
          // Simulate upload progress
          const progressInterval = setInterval(() => {
            setUploadingFiles((prev) => {
              const newFiles = [...prev]
              const currentFileIndex = newFiles.findIndex((f) => f.file === file)

              if (currentFileIndex !== -1 && newFiles[currentFileIndex].status === "uploading") {
                if (newFiles[currentFileIndex].progress < 90) {
                  newFiles[currentFileIndex].progress += 5
                }
              }

              return newFiles
            })
          }, 200)

          // Update status to processing when upload is "complete"
          setTimeout(() => {
            setUploadingFiles((prev) => {
              const newFiles = [...prev]
              const currentFileIndex = newFiles.findIndex((f) => f.file === file)

              if (currentFileIndex !== -1 && newFiles[currentFileIndex].status === "uploading") {
                newFiles[currentFileIndex].status = "processing"
                newFiles[currentFileIndex].progress = 95
                newFiles[currentFileIndex].message = "Processing blockchain transaction..."
              }

              return newFiles
            })
          }, 3000)

          // Upload to IPFS and blockchain
          const fileData = await uploadFile(file, category, encrypt)

          // Clear interval and update status
          clearInterval(progressInterval)

          setUploadingFiles((prev) => {
            const newFiles = [...prev]
            const currentFileIndex = newFiles.findIndex((f) => f.file === file)

            if (currentFileIndex !== -1) {
              newFiles[currentFileIndex].status = "complete"
              newFiles[currentFileIndex].progress = 100
            }

            return newFiles
          })

          // Add to main files list
          onFileUpload([fileData])

          // Remove from uploading list after a delay
          setTimeout(() => {
            setUploadingFiles((prev) => prev.filter((f) => f.file !== file))
          }, 2000)
        } catch (err: any) {
          console.error("Error uploading file:", err)

          setUploadingFiles((prev) => {
            const newFiles = [...prev]
            const currentFileIndex = newFiles.findIndex((f) => f.file === file)

            if (currentFileIndex !== -1) {
              newFiles[currentFileIndex].status = "error"
              newFiles[currentFileIndex].message = err.message || "Failed to upload file"
            }

            return newFiles
          })
        }
      }
    },
    [isConnected, uploadFile, category, encrypt, onFileUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: uploadingFiles.length > 0 || !isConnected,
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
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Switch id="encrypt" checked={encrypt} onCheckedChange={setEncrypt} />
          <Label htmlFor="encrypt" className="text-white flex items-center">
            {encrypt ? (
              <>
                <Lock size={14} className="mr-1 text-cyan-400" /> Encrypt Files
              </>
            ) : (
              <>
                <Unlock size={14} className="mr-1 text-amber-400" /> Files Unencrypted
              </>
            )}
          </Label>
        </div>

        <div className="flex-1 sm:max-w-xs">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              <SelectItem value="Documents">Documents</SelectItem>
              <SelectItem value="Images">Images</SelectItem>
              <SelectItem value="Videos">Videos</SelectItem>
              <SelectItem value="Audio">Audio</SelectItem>
              <SelectItem value="Spreadsheets">Spreadsheets</SelectItem>
              <SelectItem value="Archives">Archives</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden rounded-xl 
          border-2 border-dashed transition-all duration-300
          ${
            !isConnected
              ? "border-slate-700 bg-slate-800/30 opacity-60 cursor-not-allowed"
              : isDragActive
                ? "border-cyan-500 bg-slate-800/50"
                : "border-slate-700 bg-slate-800/30 hover:bg-slate-800/40 hover:border-slate-600"
          }
          backdrop-blur-lg p-6
        `}
      >
        <input {...getInputProps()} disabled={!isConnected} />

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
              {!isConnected
                ? "Connect wallet to upload files"
                : isDragActive
                  ? "Drop files here"
                  : "Drag & drop files here"}
            </p>
            <p className="text-sm text-slate-400">
              {isConnected && (
                <>
                  or <span className="text-cyan-400">browse</span> to upload
                </>
              )}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              {encrypt
                ? "Files are automatically encrypted and stored on IPFS"
                : "Files will be stored unencrypted on IPFS"}
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
                    {fileObj.status === "processing" && <Loader2 size={20} className="text-purple-400 animate-spin" />}
                    {fileObj.status === "complete" && <Check size={20} className="text-green-400" />}
                    {fileObj.status === "error" && <X size={20} className="text-red-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{fileObj.file.name}</p>
                    {fileObj.message && <p className="text-xs text-slate-400">{fileObj.message}</p>}
                    <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
                      <motion.div
                        className={`h-full ${
                          fileObj.status === "error"
                            ? "bg-red-500"
                            : fileObj.status === "processing"
                              ? "bg-gradient-to-r from-purple-500 to-blue-500"
                              : "bg-gradient-to-r from-cyan-500 to-blue-500"
                        }`}
                        initial={{ width: "0%" }}
                        animate={{ width: `${fileObj.progress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </div>
                  <div className="ml-3 text-xs text-slate-400 w-12 text-right">
                    {fileObj.status === "error"
                      ? "Error"
                      : fileObj.status === "complete"
                        ? "Done"
                        : fileObj.status === "processing"
                          ? "Processing"
                          : `${fileObj.progress}%`}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {uploadingFiles.length > 0 && uploadingFiles.some((f) => f.status === "uploading") && (
              <div className="flex justify-center pt-2">
                <p className="text-xs text-slate-500">Uploading to IPFS...</p>
              </div>
            )}

            {uploadingFiles.length > 0 && uploadingFiles.some((f) => f.status === "processing") && (
              <div className="flex justify-center pt-2">
                <p className="text-xs text-slate-500">Processing blockchain transaction...</p>
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

        {!isConnected && (
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
            <Button
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              onClick={(e) => {
                e.stopPropagation()
                // Connect wallet logic is handled by the WalletConnect component
              }}
            >
              Connect Wallet to Upload
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
