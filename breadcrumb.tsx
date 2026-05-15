"use client"

import { GraduationCap, Wallet, BookOpen, Calendar, Building2, HelpCircle, IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SuggestionChipsProps {
  onSelectSuggestion: (suggestion: string) => void
  /** Compact mode: smaller chips, horizontal scroll, used in the post-message strip */
  compact?: boolean
}

const suggestions = [
  {
    icon: GraduationCap,
    label: "Admissions",
    query: "Tell me about the admission process and eligibility requirements for DR MGR University.",
  },
  {
    icon: Wallet,
    label: "Financial Aid",
    query: "What financial aid options and scholarships are available for students?",
  },
  {
    icon: BookOpen,
    label: "Course Catalog",
    query: "Show me all the courses and degree programmes offered at the university.",
  },
  {
    icon: Calendar,
    label: "Academic Calendar",
    query: "What are the important dates in the 2025–26 academic calendar?",
  },
  {
    icon: Building2,
    label: "Campus Info",
    query: "Tell me about the campus facilities — hostel, library, sports and health centre.",
  },
  {
    icon: IndianRupee,
    label: "Fee Structure",
    query: "What is the fee structure for all B.Tech departments?",
  },
  {
    icon: HelpCircle,
    label: "Need Help?",
    query: "I have a question not listed here. Who should I contact?",
  },
]

export function SuggestionChips({ onSelectSuggestion, compact = false }: SuggestionChipsProps) {
  if (compact) {
    return (
      <div className="flex gap-2 overflow-x-auto px-3 sm:px-6 pb-0.5 scrollbar-none">
        {suggestions.map((s) => (
          <button
            key={s.label}
            onClick={() => onSelectSuggestion(s.query)}
            className="
              inline-flex items-center gap-1.5 shrink-0
              px-3 py-1.5 rounded-full
              border border-border bg-card
              text-xs font-medium text-foreground/80
              hover:bg-primary hover:text-primary-foreground hover:border-primary
              transition-colors
            "
          >
            <s.icon className="w-3 h-3 shrink-0" />
            {s.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-lg px-2">
      {suggestions.map((s) => (
        <Button
          key={s.label}
          variant="outline"
          onClick={() => onSelectSuggestion(s.query)}
          className="
            h-auto py-3 px-3 flex flex-col items-center gap-1.5
            rounded-xl border-border bg-card
            hover:bg-primary hover:text-primary-foreground hover:border-primary
            transition-all group text-center
          "
        >
          <s.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors shrink-0" />
          <span className="text-xs font-semibold leading-tight">{s.label}</span>
        </Button>
      ))}
    </div>
  )
}
