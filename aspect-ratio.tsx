"use client"

import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

interface ChatMessageProps {
  message: Message
}

const EMAIL_RE = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g

/** Convert plain text fragments: bold markers → <strong>, emails → <a>. */
function renderTextFragment(text: string): React.ReactNode[] {
  // First split on **bold**
  const boldParts = text.split(/\*\*(.*?)\*\*/g)
  return boldParts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part}
        </strong>
      )
    }
    // Inside plain text, linkify email addresses
    const emailParts = part.split(EMAIL_RE)
    if (emailParts.length === 1) return part
    return emailParts.map((seg, j) =>
      EMAIL_RE.test(seg) ? (
        <a
          key={`${i}-${j}`}
          href={`mailto:${seg}`}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          {seg}
        </a>
      ) : (
        seg
      )
    )
  })
}

/** Render a single line, converting **bold** markers, emails, and • bullets. */
function renderLine(line: string, index: number): React.ReactNode {
  const rendered = renderTextFragment(line)

  // Bullet line
  const isBullet = line.trimStart().startsWith("•")
  // Numbered list line
  const isNumbered = /^\d+\./.test(line.trimStart())

  if (isBullet) {
    return (
      <li key={index} className="flex gap-2 leading-relaxed">
        <span className="text-primary mt-0.5 shrink-0">•</span>
        <span>{rendered}</span>
      </li>
    )
  }

  if (isNumbered) {
    return (
      <li key={index} className="leading-relaxed list-decimal list-inside">
        <span>{rendered}</span>
      </li>
    )
  }

  // Empty line → spacing
  if (line.trim() === "") {
    return <div key={index} className="h-2" />
  }

  return (
    <p key={index} className="leading-relaxed">
      {rendered}
    </p>
  )
}

function MessageContent({ content }: { content: string }) {
  const lines = content.split("\n")
  return (
    <div className="text-sm space-y-0.5">
      {lines.map((line, i) => renderLine(line, i))}
    </div>
  )
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant"

  return (
    <div
      className={cn(
        "group flex gap-3 px-3 sm:px-6 py-4",
        isAssistant ? "bg-muted/25" : "bg-transparent"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
          isAssistant
            ? "bg-secondary text-secondary-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        {isAssistant ? (
          <Bot className="w-4 h-4" />
        ) : (
          <User className="w-4 h-4" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="font-semibold text-sm">
            {isAssistant ? "MGR Assistant" : "You"}
          </span>
          <span className="text-[11px] text-muted-foreground">{message.timestamp}</span>
        </div>

        <div className="text-foreground/90">
          <MessageContent content={message.content} />
        </div>
      </div>
    </div>
  )
}
