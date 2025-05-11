"use client"

import { useState } from "react"
import { User, Bot, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ChatMessage {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  isMarkdown?: boolean
  links?: {
    text: string
    url: string
  }[]
}

interface ChatbotMessageProps {
  message: ChatMessage
  isLatest: boolean
}

export default function ChatbotMessage({ message, isLatest }: ChatbotMessageProps) {
  const [expanded, setExpanded] = useState(false)

  // Check if message is long and should be expandable
  const isLongMessage = message.content.length > 300
  const displayContent = !expanded && isLongMessage ? `${message.content.substring(0, 280)}...` : message.content

  // Format links in message
  const formatContent = (content: string) => {
    // Replace URLs with clickable links
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return content.replace(
      urlRegex,
      (url) =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:underline">${url}</a>`,
    )
  }

  // Format numbered lists
  const formatLists = (content: string) => {
    // Split by line breaks
    const lines = content.split("\n")

    // Check for numbered lists (e.g., "1) Item" or "1. Item")
    const formattedLines = lines.map((line) => {
      const listItemRegex = /^(\d+[).]) (.+)$/
      const match = line.match(listItemRegex)

      if (match) {
        return `<div class="flex"><span class="text-cyan-400 mr-2">${match[1]}</span><span>${match[2]}</span></div>`
      }

      return line
    })

    return formattedLines.join("\n")
  }

  // Process content with formatting
  const processedContent = formatLists(formatContent(displayContent))

  return (
    <div className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-lg p-3",
          message.sender === "user"
            ? "bg-blue-600 text-white rounded-tr-none"
            : "bg-slate-800 text-white rounded-tl-none",
        )}
      >
        <div className="flex items-center mb-1">
          <div
            className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center mr-2",
              message.sender === "user" ? "bg-blue-700" : "bg-gradient-to-r from-cyan-500 to-blue-500",
            )}
          >
            {message.sender === "user" ? (
              <User size={12} className="text-white" />
            ) : (
              <Bot size={12} className="text-white" />
            )}
          </div>
          <span className="text-xs opacity-70">{message.sender === "user" ? "You" : "Assistant"}</span>
        </div>

        <div className="text-sm space-y-2">
          <div dangerouslySetInnerHTML={{ __html: processedContent }} />

          {isLongMessage && (
            <button onClick={() => setExpanded(!expanded)} className="text-xs text-cyan-300 hover:underline mt-1">
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {message.links && message.links.length > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-700/50">
            <p className="text-xs text-slate-400 mb-1">Related links:</p>
            <div className="space-y-1">
              {message.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-xs text-cyan-400 hover:underline"
                >
                  <ExternalLink size={10} className="mr-1" />
                  {link.text}
                </a>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs opacity-50 text-right mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  )
}
