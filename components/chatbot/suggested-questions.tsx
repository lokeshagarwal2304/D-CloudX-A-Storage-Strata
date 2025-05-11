"use client"

import { motion } from "framer-motion"
import { HelpCircle } from "lucide-react"

interface SuggestedQuestionsProps {
  questions: string[]
  onSelectQuestion: (question: string) => void
}

export default function SuggestedQuestions({ questions, onSelectQuestion }: SuggestedQuestionsProps) {
  if (!questions.length) return null

  return (
    <div className="mt-2">
      <div className="flex items-center mb-2">
        <HelpCircle size={12} className="text-cyan-400 mr-1" />
        <p className="text-xs text-slate-400">Suggested questions:</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
            className="text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-full transition-colors"
            onClick={() => onSelectQuestion(question)}
          >
            {question}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
