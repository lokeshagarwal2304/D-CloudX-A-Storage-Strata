"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  File,
  FileText,
  FileImage,
  FileVideo,
  FileSpreadsheet,
  FileArchive,
  MoreVertical,
  Lock,
  Users,
  Search,
  Grid,
  List,
} from "lucide-react"
import type { FileData } from "@/lib/types"
import { formatFileSize, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import FilePreview from "./file-preview"

interface FileExplorerProps {
  files: FileData[]
}

export default function FileExplorer({ files }: FileExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [previewFile, setPreviewFile] = useState<FileData | null>(null)

  const categories = Array.from(new Set(files.map((file) => file.category)))

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory ? file.category === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
      case "doc":
      case "docx":
      case "txt":
      case "md":
        return <FileText className="text-blue-400" />
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "svg":
        return <FileImage className="text-purple-400" />
      case "mp4":
      case "mov":
      case "avi":
      case "webm":
        return <FileVideo className="text-red-400" />
      case "xls":
      case "xlsx":
      case "csv":
        return <FileSpreadsheet className="text-green-400" />
      case "zip":
      case "rar":
      case "7z":
        return <FileArchive className="text-amber-400" />
      default:
        return <File className="text-slate-400" />
    }
  }

  const handleFileClick = (file: FileData) => {
    setPreviewFile(file)
  }

  return (
    <div className="bg-slate-800/30 backdrop-blur-lg rounded-xl border border-slate-700/50 overflow-hidden">
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <h2 className="text-lg font-semibold text-white">My Files</h2>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 w-full"
              />
            </div>

            <div className="flex items-center rounded-md border border-slate-700 overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className={`h-9 w-9 rounded-none ${viewMode === "grid" ? "bg-slate-700 text-white" : "text-slate-400"}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-9 w-9 rounded-none ${viewMode === "list" ? "bg-slate-700 text-white" : "text-slate-400"}`}
                onClick={() => setViewMode("list")}
              >
                <List size={18} />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-full text-xs px-3 h-7 ${!selectedCategory ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
            onClick={() => setSelectedCategory(null)}
          >
            All Files
          </Button>

          {categories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              size="sm"
              className={`rounded-full text-xs px-3 h-7 ${selectedCategory === category ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.length > 0 ? (
            filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                whileHover={{ y: -5 }}
                className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden hover:border-slate-600/70 transition-all duration-300 cursor-pointer"
                onClick={() => handleFileClick(file)}
              >
                <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-white">
                      <DropdownMenuItem>Download</DropdownMenuItem>
                      <DropdownMenuItem>Share</DropdownMenuItem>
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="p-4 flex flex-col items-center">
                  <div className="w-16 h-16 flex items-center justify-center mb-3">{getFileIcon(file.type)}</div>

                  <h3 className="text-sm font-medium text-white text-center truncate w-full">{file.name}</h3>

                  <p className="text-xs text-slate-400 mt-1">{formatFileSize(file.size)}</p>
                </div>

                <div className="px-4 py-2 bg-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center">
                    {file.encrypted && (
                      <div className="text-cyan-400 mr-2" title="Encrypted">
                        <Lock size={14} />
                      </div>
                    )}
                    {file.shared && (
                      <div className="text-purple-400" title="Shared">
                        <Users size={14} />
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-500">{formatDate(file.lastModified)}</p>
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-500">
              <File size={48} className="mb-4 opacity-50" />
              <p>No files found</p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4">
          <div className="rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/70">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Modified
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredFiles.length > 0 ? (
                  filteredFiles.map((file, index) => (
                    <motion.tr
                      key={file.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="bg-slate-800/30 hover:bg-slate-800/60 transition-colors duration-200 cursor-pointer"
                      onClick={() => handleFileClick(file)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center mr-3">
                            {getFileIcon(file.type)}
                          </div>
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-white">{file.name}</p>
                            <div className="flex ml-2">
                              {file.encrypted && (
                                <div className="text-cyan-400 mr-1" title="Encrypted">
                                  <Lock size={14} />
                                </div>
                              )}
                              {file.shared && (
                                <div className="text-purple-400" title="Shared">
                                  <Users size={14} />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-400">
                        {formatFileSize(file.size)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-400">
                        {formatDate(file.lastModified)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-slate-700/50 text-slate-300">
                          {file.category}
                        </span>
                      </td>
                      <td
                        className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-white">
                            <DropdownMenuItem>Download</DropdownMenuItem>
                            <DropdownMenuItem>Share</DropdownMenuItem>
                            <DropdownMenuItem>Rename</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                      No files found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {previewFile && <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />}
    </div>
  )
}
