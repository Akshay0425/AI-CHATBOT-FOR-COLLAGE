"use client"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading?: boolean
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea — deferred to avoid forced synchronous layout
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    const raf = requestAnimationFrame(() => {
      el.style.height = "auto"
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`
    })
    return () => cancelAnimationFrame(raf)
  }, [message])

  const canSend = message.trim().length > 0 && !isLoading

  const submit = () => {
    if (!canSend) return
    onSendMessage(message.trim())
    setMessage("")
    // Let the useEffect handle the height reset via the message state change —
    // do NOT manually set height here to avoid a double-write flash.
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (not Shift+Enter)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="border-t border-border bg-card px-3 sm:px-4 pt-3 pb-4 shrink-0">
      <div className="max-w-3xl mx-auto">
        <div
          className={cn(
            "flex items-end gap-2 rounded-2xl border bg-input px-3 py-2 transition-shadow",
            "focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent"
          )}
        >
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about admissions, courses, fees…"
            rows={1}
            disabled={isLoading}
            className={cn(
              "flex-1 bg-transparent resize-none border-0 focus:outline-none",
              "text-sm leading-relaxed py-1.5 min-h-[36px] max-h-[160px]",
              "placeholder:text-muted-foreground disabled:opacity-50"
            )}
          />

          {/* Send button */}
          <button
            type="button"
            onClick={submit}
            disabled={!canSend}
            aria-label="Send message"
            className={cn(
              "flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-all",
              canSend
                ? "bg-primary text-primary-foreground hover:bg-primary/85 active:scale-95"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-2 leading-relaxed">
          Responses are sourced from the official DR MGR Institute Handbook.{" "}
          <span className="hidden sm:inline">Verify critical information directly with the Institute.</span>
        </p>
      </div>
    </div>
  )
}
