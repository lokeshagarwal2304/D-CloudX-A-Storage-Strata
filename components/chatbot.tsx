"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Send, X, Sparkles, Bot, User, Paperclip, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hello! I'm your D-CloudX assistant. How can I help you today?",
    sender: "bot",
    timestamp: new Date(),
  },
]

const botResponses = [
  {
    keywords: ["hello", "hi", "hey"],
    responses: [
      "Hello! How can I assist you with D-CloudX today?",
      "Hi there! What would you like to know about your decentralized storage?",
    ],
  },
  {
    keywords: ["upload", "file", "files"],
    responses: [
      "You can upload files by dragging and dropping them into the upload area or by clicking the upload button.",
      "To upload files, simply drag them to the upload area. Your files will be automatically encrypted and distributed across the network.",
    ],
  },
  {
    keywords: ["encrypt", "encryption", "secure", "security"],
    responses: [
      "All files on D-CloudX are automatically encrypted using AES-256 before being distributed across the network.",
      "Your files are secured with end-to-end encryption. Only you have the keys to decrypt your data.",
    ],
  },
  {
    keywords: ["share", "sharing"],
    responses: [
      "You can share files by selecting them and clicking the 'Share' option. You can set permissions and expiration dates for shared links.",
      "To share a file, open the file menu and select 'Share'. You can then generate a secure link or add specific users who can access the file.",
    ],
  },
  {
    keywords: ["delete", "remove"],
    responses: [
      "To delete a file, select it and click the delete option in the menu. The file will be removed from the network after confirmation.",
      "You can delete files by selecting them and choosing 'Delete' from the dropdown menu. This will remove them from all storage nodes.",
    ],
  },
  {
    keywords: ["storage", "space", "capacity"],
    responses: [
      "You can view your storage usage in the Storage tab. It shows a breakdown of your usage by file type and category.",
      "Your storage details are available in the Storage section. You can see how much space you're using and how it's distributed.",
    ],
  },
  {
    keywords: ["blockchain", "decentralized", "nodes"],
    responses: [
      "D-CloudX uses blockchain technology to track file ownership and access. Your files are stored across multiple decentralized nodes for redundancy.",
      "Our platform distributes your files across a network of decentralized storage nodes, ensuring high availability and censorship resistance.",
    ],
  },
  {
    keywords: ["ai", "suggestions", "organize"],
    responses: [
      "The AI assistant provides suggestions to help you organize files, enhance security, and optimize your storage usage.",
      "Our AI analyzes your usage patterns to offer personalized suggestions for better file organization and security improvements.",
    ],
  },
]

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate bot thinking and responding
    setTimeout(
      () => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: generateBotResponse(input),
          sender: "bot",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    ) // Random delay between 1-2 seconds
  }

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    // Check for matches in predefined responses
    for (const item of botResponses) {
      if (item.keywords.some((keyword) => input.includes(keyword))) {
        return item.responses[Math.floor(Math.random() * item.responses.length)]
      }
    }

    // Default responses if no keyword matches
    const defaultResponses = [
      "I'm here to help with any questions about D-CloudX. Could you provide more details?",
      "I'm not sure I understand. Could you rephrase your question about D-CloudX?",
      "I'd be happy to help with your D-CloudX storage. What specific information are you looking for?",
      "As your D-CloudX assistant, I can help with file management, security, and storage questions.",
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const toggleChatbot = () => {
    setIsOpen((prev) => !prev)
    if (isMinimized) setIsMinimized(false)
  }

  const toggleMinimize = () => {
    setIsMinimized((prev) => !prev)
  }

  return (
    <>
      {/* Chatbot toggle button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChatbot}
      >
        <MessageSquare size={24} />
      </motion.button>

      {/* Chatbot interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "auto" : "500px",
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed bottom-20 right-6 z-50 w-80 sm:w-96 rounded-xl overflow-hidden border border-slate-700/50 shadow-xl",
              "bg-slate-900/95 backdrop-blur-lg flex flex-col",
            )}
          >
            {/* Header */}
            <div className="p-3 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/50">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mr-2">
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">D-CloudX Assistant</h3>
                  <p className="text-xs text-slate-400">AI-powered help</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-400 hover:text-white"
                  onClick={toggleMinimize}
                >
                  {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-400 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={14} />
                </Button>
              </div>
            </div>

            {/* Messages area */}
            {!isMinimized && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg p-3",
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
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-50 text-right mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 text-white rounded-lg rounded-tl-none max-w-[80%] p-3">
                      <div className="flex items-center mb-1">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mr-2">
                          <Bot size={12} className="text-white" />
                        </div>
                        <span className="text-xs opacity-70">Assistant</span>
                      </div>
                      <div className="flex space-x-1 items-center h-5">
                        <div
                          className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input area */}
            {!isMinimized && (
              <div className="p-3 border-t border-slate-700/50 bg-slate-800/50">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="flex items-center space-x-2"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-white flex-shrink-0"
                  >
                    <Paperclip size={16} />
                  </Button>
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="h-8 w-8 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white flex-shrink-0"
                    disabled={!input.trim() || isTyping}
                  >
                    <Send size={16} />
                  </Button>
                </form>
                <div className="mt-2 flex items-center justify-center">
                  <Sparkles size={12} className="text-cyan-400 mr-1" />
                  <p className="text-xs text-slate-500">Powered by D-CloudX AI</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
