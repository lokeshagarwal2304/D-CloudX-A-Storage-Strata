"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Monitor, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const getThemeIcon = () => {
    if (theme === "light") return <Sun size={18} />
    if (theme === "dark") return <Moon size={18} />
    return <Monitor size={18} />
  }

  const getThemeName = () => {
    if (theme === "light") return "Light"
    if (theme === "dark") return "Dark"
    return "System"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-auto px-3 bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700/50"
        >
          <motion.div key={theme} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mr-2">
            {getThemeIcon()}
          </motion.div>
          <span className="mr-1">{getThemeName()}</span>
          <ChevronDown size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-white">
        <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-2 cursor-pointer">
          <Sun size={16} className="text-amber-400" />
          <span>Light</span>
          {theme === "light" && (
            <motion.div
              layoutId="activeTheme"
              className="ml-auto h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-2 cursor-pointer">
          <Moon size={16} className="text-blue-400" />
          <span>Dark</span>
          {theme === "dark" && (
            <motion.div
              layoutId="activeTheme"
              className="ml-auto h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center gap-2 cursor-pointer">
          <Monitor size={16} className="text-purple-400" />
          <span>System</span>
          {theme === "system" && (
            <motion.div
              layoutId="activeTheme"
              className="ml-auto h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"
            />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
