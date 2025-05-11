"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Send, X, Sparkles, Bot, Maximize2, Minimize2, Search, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useWeb3 } from "@/lib/web3/hooks/useWeb3Provider"
import ChatbotMessage, { type ChatMessage } from "./chatbot-message"
import SuggestedQuestions from "./suggested-questions"
import {
  findBestResponse,
  getAllQuestions,
  getSuggestedQuestions,
  CHATBOT_KNOWLEDGE_BASE,
} from "./chatbot-knowledge-base"

export default function Chatbot() {
  const { isConnected } = useWeb3()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: "Hello! I'm your D-CloudX assistant. How can I help you with decentralized storage today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Scroll when messages change
  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom()
    }
  }, [messages, isOpen, isMinimized])

  // Set initial suggested questions
  useEffect(() => {
    const context = isConnected ? "afterWalletConnect" : "newUser"
    setSuggestedQuestions(getSuggestedQuestions(context))
  }, [isConnected])

  // Handle sending a message
  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Generate response
    setTimeout(
      () => {
        const response = findBestResponse(input)

        // Check if we should update suggested questions based on the query
        if (input.toLowerCase().includes("upload")) {
          setSuggestedQuestions(getSuggestedQuestions("afterUpload"))
        } else if (
          input.toLowerCase().includes("error") ||
          input.toLowerCase().includes("problem") ||
          input.toLowerCase().includes("issue")
        ) {
          setSuggestedQuestions(getSuggestedQuestions("troubleshooting"))
        }

        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: response,
          sender: "bot",
          timestamp: new Date(),
          links: getRelevantLinks(input),
        }

        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    ) // Random delay between 1-2 seconds
  }

  // Get relevant links based on user query
  const getRelevantLinks = (query: string): { text: string; url: string }[] => {
    // This is a simplified example - in a real app, you'd have a more sophisticated matching system
    const normalizedQuery = query.toLowerCase()

    if (normalizedQuery.includes("ipfs")) {
      return [{ text: "IPFS Documentation", url: "https://docs.ipfs.tech/" }]
    }

    if (normalizedQuery.includes("wallet") || normalizedQuery.includes("metamask")) {
      return [{ text: "MetaMask Documentation", url: "https://metamask.io/learn/" }]
    }

    if (normalizedQuery.includes("nft")) {
      return [{ text: "NFT Standards", url: "https://ethereum.org/en/developers/docs/standards/tokens/erc-721/" }]
    }

    return []
  }

  // Handle selecting a suggested question
  const handleSelectQuestion = (question: string) => {
    setInput(question)
    handleSendMessage()
  }

  // Toggle chatbot open/closed
  const toggleChatbot = () => {
    setIsOpen((prev) => !prev)
    if (isMinimized) setIsMinimized(false)
    if (isSearchOpen) setIsSearchOpen(false)
  }

  // Toggle minimize
  const toggleMinimize = () => {
    setIsMinimized((prev) => !prev)
  }

  // Toggle search
  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev)
    setSearchQuery("")
    setSearchResults([])
  }

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)

    if (query.trim().length < 2) {
      setSearchResults([])
      return
    }

    const allQuestions = getAllQuestions()
    const filteredQuestions = allQuestions.filter((q) => q.toLowerCase().includes(query.toLowerCase()))

    setSearchResults(filteredQuestions)
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
                  <p className="text-xs text-slate-400">Web3 Storage Expert</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-400 hover:text-white"
                  onClick={toggleSearch}
                >
                  <Search size={14} />
                </Button>
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

            {/* Search interface */}
            <AnimatePresence>
              {isSearchOpen && !isMinimized && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-b border-slate-700/50 overflow-hidden"
                >
                  <div className="p-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search for help topics..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-9 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                      />
                    </div>

                    {searchResults.length > 0 && (
                      <div className="mt-2 max-h-40 overflow-y-auto">
                        {searchResults.map((question, index) => (
                          <button
                            key={index}
                            className="w-full text-left p-2 text-sm text-slate-300 hover:bg-slate-800/50 rounded-md transition-colors"
                            onClick={() => {
                              setInput(question)
                              setIsSearchOpen(false)
                              handleSendMessage()
                            }}
                          >
                            <div className="flex items-start">
                              <HelpCircle size={14} className="text-cyan-400 mt-0.5 mr-2 flex-shrink-0" />
                              <span>{question}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {searchQuery && searchResults.length === 0 && (
                      <p className="text-sm text-slate-400 mt-2">No results found. Try a different search term.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages area */}
            {!isMinimized && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <ChatbotMessage key={message.id} message={message} isLatest={index === messages.length - 1} />
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

                {/* Suggested questions */}
                {!isTyping && suggestedQuestions.length > 0 && messages.length < 3 && (
                  <SuggestedQuestions questions={suggestedQuestions} onSelectQuestion={handleSelectQuestion} />
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
                    onClick={() => {
                      // Show all questions as a message
                      const allTopics = Object.keys(CHATBOT_KNOWLEDGE_BASE)
                        .map((key) => key.charAt(0).toUpperCase() + key.slice(1))
                        .join(", ")

                      const botMessage: ChatMessage = {
                        id: Date.now().toString(),
                        content: `I can help with various topics related to D-CloudX and decentralized storage. Here are some areas I'm knowledgeable about: ${allTopics}. What would you like to know more about?`,
                        sender: "bot",
                        timestamp: new Date(),
                      }

                      setMessages((prev) => [...prev, botMessage])
                    }}
                  >
                    <HelpCircle size={16} />
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
