"use client"

import { useRef, useEffect } from "react"
import { Bot, Menu, GraduationCap, PanelLeftOpen, PanelLeftClose } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { SuggestionChips } from "./suggestion-chips"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

interface ChatWindowProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  onToggleSidebar: () => void
  isLoading?: boolean
  isSidebarOpen: boolean
}

export function ChatWindow({
  messages,
  onSendMessage,
  onToggleSidebar,
  isLoading,
  isSidebarOpen,
}: ChatWindowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom only when messages change (new message sent or received).
  // Use "instant" so there is no competing smooth-scroll animation that causes
  // the screen to lurch when the user presses Enter.
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    container.scrollTop = container.scrollHeight
  }, [messages])

  return (
    <div className="flex flex-col h-full min-w-0 bg-background">

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Sidebar toggle — always visible */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="h-9 w-9 p-0 shrink-0 text-muted-foreground hover:text-foreground"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen
              ? <PanelLeftClose className="w-5 h-5" />
              : <PanelLeftOpen className="w-5 h-5" />
            }
          </Button>

          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>

          <div className="min-w-0">
            <h1 className="font-semibold text-sm leading-tight truncate">
              <span className="hidden sm:inline">DR MGR </span>AI Assistant
            </h1>
            <p className="text-[11px] text-muted-foreground truncate hidden sm:block">
              Powered by the Official Institute Handbook
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-medium shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="hidden sm:inline">Online</span>
        </span>
      </header>

      {/* ── Messages / Empty state ── */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overscroll-contain"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 py-10 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
              <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-balance max-w-xs sm:max-w-md">
              DR MGR Institute Official Assistant
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs sm:max-w-md mb-2 text-pretty leading-relaxed">
              I am the official assistant for <span className="font-medium text-foreground">DR MGR Educational and Research Institute</span>. I only answer questions based on the official Institute Handbook.
            </p>
            <p className="text-xs text-muted-foreground max-w-xs mb-1 text-pretty leading-relaxed">
              For anything outside the handbook, I will direct you to the Registrar&apos;s office:
            </p>
            <a
              href="mailto:registrar@drmgrdu.ac.in"
              className="text-xs font-semibold text-primary underline-offset-2 hover:underline mb-8 inline-block"
            >
              registrar@drmgrdu.ac.in
            </a>
            <SuggestionChips onSelectSuggestion={onSendMessage} />
          </div>
        ) : (
          <div className="py-2">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-3 px-4 py-4 bg-muted/30">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-secondary-foreground" />
                </div>
                <div className="flex flex-col justify-center gap-1">
                  <span className="text-xs font-semibold text-foreground/60">MGR Assistant is typing…</span>
                  <div className="flex gap-1 pt-0.5">
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div className="h-2" />
          </div>
        )}
      </div>

      {/* Quick suggestions strip — always rendered to prevent layout shift */}
      <div
        className={[
          "border-t border-border/60 py-2 shrink-0 transition-all duration-200",
          messages.length > 0 && messages.length < 6 && !isLoading
            ? "opacity-100 max-h-20 pointer-events-auto"
            : "opacity-0 max-h-0 overflow-hidden pointer-events-none py-0 border-t-0",
        ].join(" ")}
      >
        <SuggestionChips onSelectSuggestion={onSendMessage} compact />
      </div>

      {/* ── Input ── */}
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  )
}
