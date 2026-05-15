"use client"

import { useState } from "react"
import { MessageSquare, Plus, Search, Clock, Trash2, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface ChatHistory {
  id: string
  title: string
  timestamp: string
  preview: string
}

interface ChatSidebarProps {
  chatHistory: ChatHistory[]
  activeChatId: string | null
  onNewChat: () => void
  onSelectChat: (id: string) => void
  onDeleteChat: (id: string) => void
  isOpen: boolean
}

export function ChatSidebar({
  chatHistory,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}: ChatSidebarProps) {
  const [query, setQuery] = useState("")

  const filtered = chatHistory.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.preview.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <aside className="flex flex-col h-full w-72 bg-sidebar text-sidebar-foreground">
      {/* Brand header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-4 border-b border-sidebar-border shrink-0">
        <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center shrink-0">
          <GraduationCap className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm leading-tight truncate">DR MGR University</p>
          <p className="text-[11px] text-sidebar-foreground/50 truncate">Official AI Assistant</p>
        </div>
      </div>

      {/* New chat */}
      <div className="px-3 pt-3 pb-2 shrink-0">
        <Button
          onClick={onNewChat}
          className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/85 font-semibold rounded-xl h-10"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Conversation
        </Button>
      </div>

      {/* Search */}
      <div className="px-3 pb-3 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sidebar-foreground/40 pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations…"
            className="pl-9 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/40 text-sm h-9 rounded-lg focus-visible:ring-sidebar-ring"
          />
        </div>
      </div>

      {/* History list */}
      <ScrollArea className="flex-1 px-2">
        <div className="pb-2">
          <div className="flex items-center gap-1.5 px-2 py-1.5 mb-1">
            <Clock className="w-3 h-3 text-sidebar-foreground/40" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
              Recent
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <MessageSquare className="w-8 h-8 text-sidebar-foreground/20" />
              <p className="text-sm text-sidebar-foreground/40">
                {query ? "No results found." : "No conversations yet."}
              </p>
              {!query && (
                <p className="text-xs text-sidebar-foreground/30">Start a new conversation!</p>
              )}
            </div>
          ) : (
            <div className="space-y-0.5">
              {filtered.map((chat) => {
                const isActive = activeChatId === chat.id
                return (
                  <div
                    key={chat.id}
                    className={cn(
                      "group relative rounded-lg transition-colors",
                      isActive
                        ? "bg-sidebar-primary"
                        : "hover:bg-sidebar-accent"
                    )}
                  >
                    <button
                      onClick={() => onSelectChat(chat.id)}
                      className="w-full text-left px-3 py-2.5 pr-9"
                    >
                      <p className={cn(
                        "font-medium text-sm truncate leading-snug",
                        isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground"
                      )}>
                        {chat.title}
                      </p>
                      <p className={cn(
                        "text-xs truncate mt-0.5",
                        isActive ? "text-sidebar-primary-foreground/65" : "text-sidebar-foreground/50"
                      )}>
                        {chat.preview}
                      </p>
                      <p className={cn(
                        "text-[10px] mt-1",
                        isActive ? "text-sidebar-primary-foreground/45" : "text-sidebar-foreground/35"
                      )}>
                        {chat.timestamp}
                      </p>
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteChat(chat.id)
                      }}
                      className={cn(
                        "absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 p-0",
                        "opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity",
                        isActive
                          ? "text-sidebar-primary-foreground/60 hover:text-sidebar-primary-foreground hover:bg-white/10"
                          : "text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-border"
                      )}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="sr-only">Delete conversation</span>
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-sidebar-border shrink-0">
        <p className="text-[10px] text-sidebar-foreground/35 text-center leading-relaxed">
          Answers are based on the official Institute Handbook.
          <br />
          © 2024 DR MGR Educational &amp; Research Institute
        </p>
      </div>
    </aside>
  )
}
