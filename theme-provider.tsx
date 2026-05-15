"use client"

import { useState, useCallback } from "react"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatWindow } from "@/components/chat/chat-window"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

interface ChatHistory {
  id: string
  title: string
  timestamp: string
  preview: string
  messages: Message[]
}

// ─── Official DR MGR Institute Handbook (source of truth) ─────────────────────
const HANDBOOK: Record<string, string> = {
  admissions: `**Admissions — DR MGR Educational and Research Institute**

**Eligibility Criteria:**
• UG Programs (B.Tech, B.Sc, B.Com, BBA, BA): Completion of 10+2 with a minimum of 50% aggregate marks in relevant subjects.
• PG Programs (M.Tech, M.Sc, MBA, MA, M.Com): A Bachelor's degree in the relevant discipline with a minimum of 55% aggregate marks.
• PhD Programs: A Master's degree with a minimum of 60% marks and passing the Institute's Research Entrance Test (RET).

**Application Process:**
1. Submit the online application via the official portal at **drmgrdu.ac.in**.
2. Upload certified copies of all required documents.
3. Pay the non-refundable application fee (Rs. 500 for UG; Rs. 750 for PG/PhD).
4. Attend the scheduled counselling session with original documents.
5. Complete fee remittance within 48 hours of seat allotment to confirm admission.

**Required Documents:**
• Mark sheets and pass certificates (all qualifying examinations)
• Transfer Certificate (TC) and Conduct Certificate from last institution
• Community Certificate (SC/ST/OBC/MBC — if applicable)
• Nativity Certificate
• Aadhaar Card (student and parent)
• Recent passport-size photographs (4 copies)
• Income Certificate (for scholarship applicants)

For specific program cut-offs and intake details, please visit drmgrdu.ac.in/admissions.`,

  financial: `**Financial Aid — DR MGR Educational and Research Institute**

**Institute Scholarships:**
• **DR MGR Merit Scholarship:** Awarded to students scoring 90% and above in qualifying examinations. Covers up to 50% of tuition fees.
• **Sports Excellence Award:** For students with achievements at national or state-level sports events.
• **Research Fellowship:** Available for PhD scholars; covers stipend and contingency grant.

**Government Scholarships (facilitated by the Institute):**
• Tamil Nadu State Government Scholarship (SC/ST/MBC/OBC)
• Post-Matric Scholarship — Ministry of Minority Affairs
• Central Sector Scheme of Scholarships for College and University Students

**Fee Concessions:**
• Wards of Institute employees: 50% concession on tuition fees.
• Siblings enrolled simultaneously: 10% discount on the second child's tuition fees.
• Single-parent households (verified): Up to 25% fee waiver on a case-by-case basis.

**Education Loan Assistance:**
The Institute has memoranda of understanding (MoUs) with the following banks for hassle-free education loans:
• State Bank of India (SBI)
• Indian Bank
• Canara Bank
• HDFC Bank

Students seeking loan letters or bonafide certificates should approach the Accounts Office (Block A, Ground Floor).

For queries not covered here, please contact the Registrar's office at **registrar@drmgrdu.ac.in**.`,

  catalog: `**Course Catalog — DR MGR Educational and Research Institute**

**Faculty of Engineering & Technology:**
• B.Tech: Computer Science & Engineering, Electronics & Communication, Mechanical Engineering, Civil Engineering, AI & Machine Learning, Information Technology
• M.Tech: VLSI Design, Structural Engineering, Computer Science, Embedded Systems

**Faculty of Medical & Health Sciences:**
• MBBS (5.5 years including internship)
• BDS (4 years + 1 year internship)
• B.Pharm / M.Pharm
• B.Sc & M.Sc Nursing
• B.Sc Physiotherapy

**Faculty of Arts, Science & Humanities:**
• BA: English Literature, Tamil, Economics, History
• B.Sc: Physics, Chemistry, Mathematics, Computer Science, Microbiology
• MA: English, Tamil, Economics
• M.Sc: Physics, Chemistry, Mathematics, Computer Science

**Faculty of Management Studies:**
• BBA (3 years)
• MBA — Dual Specialisation: Marketing & Finance, HR & Marketing (2 years)

**Faculty of Law:**
• BA LLB (5-year integrated programme)
• LLB (3 years)
• LLM (2 years)

**Research Programmes:**
• Ph.D. in all faculties (Full-time and Part-time)
• M.Phil. (select disciplines)

All programmes are approved by the UGC and the respective regulatory bodies (AICTE, MCI, BCI). The Institute is accredited by NAAC with 'A' Grade.

For detailed syllabi, contact the respective faculty office or email **academics@drmgrdu.ac.in**.`,

  calendar: `**Academic Calendar 2025–26 — DR MGR Educational and Research Institute**

**Odd Semester (July – November 2025):**
• Classes commence: 14 July 2025
• Internal Assessment I: 25–29 August 2025
• Internal Assessment II: 13–17 October 2025
• Last working day: 14 November 2025
• End-semester examinations: 17 November – 4 December 2025

**Even Semester (January – May 2026):**
• Classes commence: 2 January 2026
• Internal Assessment I: 9–13 February 2026
• Internal Assessment II: 30 March – 3 April 2026
• Last working day: 30 April 2026
• End-semester examinations: 4–21 May 2026

**Holidays & Recess:**
• Pongal Holidays: 13–16 January 2026
• College Day: 27 February 2026 (No classes)
• Mid-semester break: 18–19 April 2026

Revised schedules, if any, will be notified on the official notice boards and the student portal.`,

  fees: `**Fee Structure — DR MGR Educational and Research Institute (B.Tech Programmes)**

The following annual tuition fees are applicable for the academic year 2025–26:

| Programme | Department | Annual Tuition Fee |
|---|---|---|
| B.Tech | Computer Science & Engineering (CSE) | Rs. 1,20,000 |
| B.Tech | Electronics & Communication Engineering (ECE) | Rs. 80,000 |
| B.Tech | Electrical & Electronics Engineering (EEE) | Rs. 70,000 |
| B.Tech | Information Technology (IT) | Rs. 1,00,000 |
| B.Tech | Mechanical Engineering | Rs. 70,000 |

**Additional Fees (All Departments):**
• Admission / Enrollment Fee: Rs. 2,000 (one-time, non-refundable)
• University Examination Fee: Rs. 1,200 per semester
• Library & Laboratory Fee: Rs. 3,500 per year
• Sports & Cultural Activities Fee: Rs. 1,000 per year
• Student Welfare Fund: Rs. 500 per year

**Payment Schedule:**
• Semester I fee: Due at the time of admission (July)
• Semester II fee: Due by the first week of January
• Late payment penalty: Rs. 100 per day after the due date

**Accepted Payment Modes:**
• Online transfer / NEFT / RTGS to the Institute bank account
• Demand Draft (DD) drawn in favour of "DR MGR Educational and Research Institute"
• Cash payment at the Accounts Office (Block A, Ground Floor), Monday–Saturday, 9:00 AM – 4:00 PM

**Fee Concessions Available:**
• SC/ST students: Government-subsidised fee as per Tamil Nadu state norms
• DR MGR Merit Scholarship holders: Up to 50% waiver on tuition fees
• Single-parent households (verified): Up to 25% waiver on a case-by-case basis

For fee receipts, fee revision queries, or scholarship adjustments, contact the Accounts Office or email **accounts@drmgrdu.ac.in**.`,

  campus: `**Campus Facilities — DR MGR Educational and Research Institute**

**Hostel:**
• Separate hostels for male and female students with 24-hour security.
• Rooms: Single, double, and triple occupancy options.
• Facilities include Wi-Fi, laundry, common rooms, and a reading hall.
• Warden contact: **hostel@drmgrdu.ac.in**

**Library:**
• Central Library: Open Monday–Saturday, 8:00 AM – 8:00 PM.
• Collection: 1,50,000+ volumes; access to IEEE, Elsevier, Springer, and JSTOR digital databases.
• E-library available 24/7 via student portal login.

**Sports & Recreation:**
• Facilities: Cricket ground, football field, basketball and volleyball courts, indoor badminton and table tennis.
• Annual Sports Meet is held in February.

**Canteen & Dining:**
• Central canteen operates 7:00 AM – 9:00 PM serving vegetarian and non-vegetarian meals.
• Hostel mess provides breakfast, lunch, and dinner for resident students.

**Health Centre:**
• Campus health centre with a resident medical officer.
• 24-hour ambulance service available.
• Contact: **healthcentre@drmgrdu.ac.in**

**Transport:**
• Bus service from major routes in Chennai; routes and schedules available at the Transport Office.`,
}

const REGISTRAR_EMAIL = "registrar@drmgrdu.ac.in"

// ─── System persona (enforced entirely inside getAIResponse) ──────────────────
// "You are the official DR MGR Educational and Research Institute Assistant.
//  You only answer based on the provided handbook. If you don't know an answer,
//  provide the email for the Registrar's office."
// ─────────────────────────────────────────────────────────────────────────────

/** Strip leading/trailing punctuation and whitespace for clean keyword matching. */
function sanitize(text: string): string {
  return text.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, "").trim()
}

/** Returns true if the cleaned input exactly equals a keyword OR starts with it followed by a space/punctuation. */
function matchesAny(clean: string, lower: string, keywords: string[]): boolean {
  return keywords.some(
    (kw) => clean === kw || lower === kw || lower.startsWith(kw + " ") || lower.startsWith(kw + "!")  || lower.startsWith(kw + ",") || lower.startsWith(kw + ".")
  )
}

function getAIResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase().trim()
  const clean = sanitize(userMessage)

  // ── 1. Greetings ─────────────────────────────────────────────────────────
  const greetingKeywords = [
    "hello", "hi", "hey", "good morning", "good afternoon", "good evening",
    "howdy", "greetings", "what's up", "whats up", "sup",
  ]
  if (matchesAny(clean, lower, greetingKeywords)) {
    return `Hello! I am the official **DR MGR Educational and Research Institute** Assistant.

I can help you with information from the official Institute Handbook on:
• **Admissions** — Eligibility criteria, application steps, required documents
• **Financial Aid** — Scholarships, fee concessions, education loans
• **Course Catalog** — All programmes offered across faculties
• **Academic Calendar** — Semester dates, exam schedules, holidays
• **Campus Facilities** — Hostel, library, sports, health centre, transport

Please go ahead and ask your question!`
  }

  // ── 2. Farewells ──────────────────────────────────────────────────────────
  const farewellKeywords = [
    "bye", "goodbye", "good bye", "see you", "see ya", "take care",
    "farewell", "good night", "goodnight", "cya", "later",
  ]
  if (matchesAny(clean, lower, farewellKeywords)) {
    return `Goodbye! It was a pleasure assisting you. If you ever need help again, the **DR MGR Educational and Research Institute** Assistant is always here for you. Have a great day!`
  }

  // ── 3. Thank-you messages ─────────────────────────────────────────────────
  const thanksKeywords = ["thank", "thanks", "thank you", "thx", "ty"]
  if (matchesAny(clean, lower, thanksKeywords)) {
    return `You are most welcome! If you have any other questions about DR MGR Educational and Research Institute, feel free to ask — I am always here to help.`
  }

  // ── 4. Who / What are you ────────────────────────────────────────────────
  const isIdentityQuery =
    lower.includes("who are you") || lower.includes("what are you") ||
    lower.includes("what can you do") || lower.includes("what do you do") ||
    lower.includes("how can you help") || lower.includes("how do you help") ||
    lower.includes("tell me about yourself") || lower.includes("introduce yourself") ||
    clean === "help" || clean === "info" || clean === "information"
  if (isIdentityQuery) {
    return `I am the official **DR MGR Educational and Research Institute** Assistant.

I am here to help students and applicants with information directly from the official Institute Handbook. Here is what I can assist you with:

• **Admissions** — Eligibility criteria, application process, required documents
• **Financial Aid** — Scholarships, fee concessions, education loans
• **Course Catalog** — All programmes offered across faculties
• **Academic Calendar** — Semester dates, exam schedules, holidays
• **Campus Facilities** — Hostel, library, sports, health centre, transport

For anything beyond the handbook, I will direct you to the Registrar's office at **registrar@drmgrdu.ac.in**.`
  }

  // ── 5. How are you / general well-being ──────────────────────────────────
  const isWellbeing =
    lower.includes("how are you") || lower.includes("how r you") ||
    lower.includes("are you okay") || lower.includes("you good") ||
    lower.includes("how's it going") || lower.includes("hows it going") ||
    lower.includes("how are things") || lower.includes("what's going on") ||
    lower.includes("whats going on")
  if (isWellbeing) {
    return `I am doing great, thank you for asking! I am always ready to assist you with information about **DR MGR Educational and Research Institute**.

Is there anything I can help you with today? Feel free to ask about admissions, courses, financial aid, the academic calendar, or campus facilities.`
  }

  // ── 6. Handbook topic matching ────────────────────────────────────────────
  const isAdmissions =
    lower.includes("admission") || lower.includes("apply") || lower.includes("application") ||
    lower.includes("eligib") || lower.includes("document") ||
    lower.includes("enroll") || lower.includes("register") ||
    lower.includes("intake") || lower.includes("cut-off") || lower.includes("cutoff") ||
    lower.includes("counsell")

  // Fee structure check — matched BEFORE isFinancial to avoid being swallowed by "fee" in financial
  const isFees =
    lower.includes("fee structure") || lower.includes("fees structure") ||
    lower.includes("how much") || lower.includes("fees for") || lower.includes("fee for") ||
    lower.includes("cse fee") || lower.includes("ece fee") || lower.includes("eee fee") ||
    lower.includes("it fee") || lower.includes("mechanical fee") ||
    lower.includes("tuition fee") || lower.includes("annual fee") ||
    lower.includes("semester fee") || lower.includes("course fee") ||
    lower.includes("fees per year") || lower.includes("fee per year") ||
    lower.includes("college fees") || lower.includes("department fee") ||
    lower.includes("payment schedule") || lower.includes("fee payment") ||
    (lower.includes("fee") && (
      lower.includes("cse") || lower.includes("ece") || lower.includes("eee") ||
      lower.includes("mech") || lower.includes(" it ") || lower.includes("information technology") ||
      lower.includes("engineering") || lower.includes("btech") || lower.includes("b.tech") ||
      lower.includes("structure") || lower.includes("detail") || lower.includes("total")
    ))

  const isFinancial =
    lower.includes("financial") || lower.includes("scholarship") ||
    lower.includes("loan") || lower.includes("concession") ||
    lower.includes("waiver") || lower.includes("stipend") || lower.includes("bursary") ||
    lower.includes("merit award")

  const isCatalog =
    lower.includes("course") || lower.includes("program") || lower.includes("catalog") ||
    lower.includes("catalogue") || lower.includes("degree") ||
    lower.includes("btech") || lower.includes("b.tech") || lower.includes("mba") ||
    lower.includes("mbbs") || lower.includes("bds") || lower.includes("bba") ||
    lower.includes("llb") || lower.includes("phd") || lower.includes("m.phil") ||
    lower.includes("department") || lower.includes("syllab") ||
    lower.includes("speciali") || lower.includes("stream") || lower.includes("branch")

  const isCalendar =
    lower.includes("calendar") || lower.includes("semester") || lower.includes("schedule") ||
    lower.includes("exam date") || lower.includes("holiday") || lower.includes("recess") ||
    lower.includes("assessment") || lower.includes("timetable") ||
    lower.includes("college day") || lower.includes("pongal") ||
    (lower.includes("when") && (lower.includes("exam") || lower.includes("class") || lower.includes("start")))

  const isCampus =
    lower.includes("hostel") || lower.includes("library") ||
    lower.includes("canteen") || lower.includes("sport") ||
    lower.includes("transport") || lower.includes("bus") || lower.includes("facilit") ||
    lower.includes("ameniti") || lower.includes("mess") || lower.includes("dining") ||
    lower.includes("wifi") || lower.includes("wi-fi") ||
    lower.includes("accommodation") || lower.includes("ambulance") || lower.includes("doctor")

  if (isAdmissions) return HANDBOOK.admissions
  if (isFees) return HANDBOOK.fees
  if (isFinancial) return HANDBOOK.financial
  if (isCatalog) return HANDBOOK.catalog
  if (isCalendar) return HANDBOOK.calendar
  if (isCampus) return HANDBOOK.campus

  // ── 7. Out-of-scope fallback — direct to Registrar ────────────────────────
  return `I am the official **DR MGR Educational and Research Institute** Assistant and I can only answer questions based on the official Institute Handbook.

I was unable to find information about your query in the handbook.

For assistance with this matter, please contact the **Registrar's Office** directly:

**Email:** REGISTRAR_EMAIL_LINK

The Registrar's office will be happy to help you with any queries not covered here.

Alternatively, you can ask me about:
• **Admissions** — Eligibility, application process, required documents
• **Financial Aid** — Scholarships, fee concessions, education loans
• **Course Catalog** — All programmes offered across faculties
• **Academic Calendar** — Semester dates, exams, holidays
• **Campus Facilities** — Hostel, library, sports, health centre`
    .replace("REGISTRAR_EMAIL_LINK", REGISTRAR_EMAIL)
}

function formatTime(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export default function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    {
      id: "1",
      title: "Admission Requirements",
      timestamp: "Today, 10:30 AM",
      preview: "What are the admission requirements?",
      messages: [],
    },
    {
      id: "2",
      title: "Engineering Programs",
      timestamp: "Yesterday",
      preview: "Tell me about B.Tech courses...",
      messages: [],
    },
  ])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleNewChat = useCallback(() => {
    setActiveChatId(null)
    setMessages([])
    setIsSidebarOpen(false)
  }, [])

  const handleSelectChat = useCallback((id: string) => {
    const chat = chatHistory.find((c) => c.id === id)
    if (chat) {
      setActiveChatId(id)
      setMessages(chat.messages)
    }
    setIsSidebarOpen(false)
  }, [chatHistory])

  const handleDeleteChat = useCallback((id: string) => {
    setChatHistory((prev) => prev.filter((chat) => chat.id !== id))
    if (activeChatId === id) {
      setActiveChatId(null)
      setMessages([])
    }
  }, [activeChatId])

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content,
      timestamp: formatTime(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 900 + Math.random() * 800))

    const assistantMessage: Message = {
      id: generateId(),
      role: "assistant",
      content: getAIResponse(content),
      timestamp: formatTime(),
    }

    setMessages((prev) => {
      const newMessages = [...prev, assistantMessage]

      if (activeChatId) {
        setChatHistory((prevHistory) =>
          prevHistory.map((chat) =>
            chat.id === activeChatId
              ? { ...chat, messages: newMessages, preview: content.substring(0, 50) }
              : chat
          )
        )
      } else {
        const newChatId = generateId()
        const newChat: ChatHistory = {
          id: newChatId,
          title: content.substring(0, 32) + (content.length > 32 ? "…" : ""),
          timestamp: "Just now",
          preview: content.substring(0, 50),
          messages: newMessages,
        }
        setChatHistory((prevHistory) => [newChat, ...prevHistory])
        setActiveChatId(newChatId)
      }

      return newMessages
    })

    setIsLoading(false)
  }, [activeChatId])

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev)
  }, [])

  return (
    <main className="flex h-[100dvh] overflow-hidden bg-background">

      {/* Dark overlay — mobile only, tap-to-close, never unmounts (opacity transition) */}
      <div
        className={[
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden",
          "transition-opacity duration-300",
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar — always in DOM, translated off-screen on mobile when closed */}
      <div
        className={[
          "fixed inset-y-0 left-0 z-50 h-full will-change-transform",
          "transition-transform duration-300 ease-in-out",
          "lg:relative lg:translate-x-0 lg:z-auto lg:flex-shrink-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <ChatSidebar
          chatHistory={chatHistory}
          activeChatId={activeChatId}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          isOpen={isSidebarOpen}
        />
      </div>

      {/* Main chat area �� always visible, fills remaining width, never resizes */}
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          onToggleSidebar={handleToggleSidebar}
          isLoading={isLoading}
          isSidebarOpen={isSidebarOpen}
        />
      </div>
    </main>
  )
}
