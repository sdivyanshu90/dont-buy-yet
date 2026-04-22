import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { COMPANIES, searchCompany } from '../data/companies'
import { trackEvent } from '../lib/analytics'
import { updateFeatureStats } from '../lib/persistence'

const SUGGESTED = ['Zomato', 'Paytm', 'IRCTC', 'Titan', 'Reliance', 'HDFC Bank', 'Infosys', 'Marico']

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-white rounded-2xl rounded-tl-sm w-fit card-shadow">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
    </div>
  )
}

function ChatBubble({ message, isNew }) {
  return (
    <div className={`flex gap-2 items-end transition-all duration-300 ${isNew ? 'animate-slideUp' : ''}`}>
      <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center text-sm flex-shrink-0 mb-1">
        🤖
      </div>
      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] card-shadow">
        <p className="text-navy text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  )
}

function UserBubble({ message }) {
  return (
    <div className="flex justify-end animate-slideUp">
      <div className="bg-navy text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[75%]">
        <p className="text-sm">{message}</p>
      </div>
    </div>
  )
}

function DrilldownOptions({ company, onSelect, disabled }) {
  const options = Object.entries(company.drilldowns).map(([key, val]) => ({ key, label: val.label }))
  return (
    <div className="flex flex-col gap-2 pl-9 animate-slideUp">
      {options.map(({ key, label }) => (
        <button
          key={key}
          disabled={disabled}
          onClick={() => onSelect(key)}
          className="text-left px-4 py-3 bg-saffron-light border-2 border-saffron/30 rounded-xl text-sm font-medium text-navy active:scale-95 transition-transform disabled:opacity-40"
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function InfoPill({ label, value }) {
  return (
    <div className="bg-white rounded-xl px-3 py-2 text-center card-shadow flex-shrink-0">
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className="text-navy font-bold text-sm">{value}</p>
    </div>
  )
}

export default function YehStockKyaKartaHai() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [company, setCompany] = useState(null)
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const [showDrilldowns, setShowDrilldowns] = useState(false)
  const [drilldownLocked, setDrilldownLocked] = useState(false)
  const [phase, setPhase] = useState('search') // 'search' | 'chat'
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)
  const queueRef = useRef([])
  const processingRef = useRef(false)

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing, showDrilldowns])

  const enqueueMessage = (msg, delay = 900) => {
    queueRef.current.push({ msg, delay })
  }

  const processQueue = async () => {
    if (processingRef.current) return
    processingRef.current = true
    while (queueRef.current.length > 0) {
      const { msg, delay } = queueRef.current.shift()
      setTyping(true)
      await new Promise(r => setTimeout(r, delay))
      setTyping(false)
      setMessages(prev => [...prev, { type: 'bot', text: msg, id: Date.now() + Math.random() }])
      await new Promise(r => setTimeout(r, 120))
    }
    processingRef.current = false
  }

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { type: 'user', text, id: Date.now() }])
  }

  const loadCompany = async (comp, searchQuery) => {
    trackEvent('company_search_completed', { query: searchQuery, company: comp.ticker })
    updateFeatureStats('companySearch', (stats) => ({
      ...stats,
      searches: (stats.searches || 0) + 1,
      lastCompany: comp.name,
    }))

    setCompany(comp)
    setPhase('chat')
    setShowDrilldowns(false)
    setDrilldownLocked(false)
    queueRef.current = []
    processingRef.current = false

    addUserMessage(searchQuery)

    enqueueMessage(comp.oneliner, 600)
    for (const line of comp.description) {
      enqueueMessage(line, Math.max(800, line.length * 12))
    }
    enqueueMessage('Ek cheez aur jaanna chahoge?', 700)

    await processQueue()
    setShowDrilldowns(true)
  }

  const handleSearch = (q = query) => {
    if (!q.trim()) return
    const found = searchCompany(q.trim())
    if (found) {
      loadCompany(found, q.trim())
    } else {
      trackEvent('company_search_missed', { query: q.trim() })
      setMessages([])
      addUserMessage(q.trim())
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            type: 'bot',
            text: `"${q}" abhi humare database mein nahi hai. Yeh companies try karo: ${SUGGESTED.join(', ')}`,
            id: Date.now(),
          },
        ])
      }, 800)
      setPhase('chat')
    }
  }

  const handleDrilldown = async (key) => {
    setShowDrilldowns(false)
    setDrilldownLocked(true)
    const drilldown = company.drilldowns[key]
    addUserMessage(drilldown.label)

    queueRef.current = []
    processingRef.current = false

    for (const msg of drilldown.messages) {
      enqueueMessage(msg, Math.max(800, msg.length * 11))
    }
    enqueueMessage('Kuch aur jaanna hai?', 600)

    await processQueue()
    setDrilldownLocked(false)
    setShowDrilldowns(true)
  }

  const handleReset = () => {
    setPhase('search')
    setQuery('')
    setCompany(null)
    setMessages([])
    setShowDrilldowns(false)
    queueRef.current = []
    processingRef.current = false
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  return (
    <div className="flex flex-col h-screen bg-chat-bg">
      {/* Header */}
      <div className="bg-navy px-4 pt-12 pb-4 flex-shrink-0">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <button onClick={() => navigate('/')} className="text-white/60 text-2xl">←</button>
          <div className="flex-1">
            <h1 className="text-white font-black text-xl">
              {company ? `${company.emoji} ${company.name}` : 'Yeh Stock Kya Karta Hai?'}
            </h1>
            <p className="text-white/60 text-xs">
              {company ? company.tagline : 'Koi bhi company naam likhke samjho'}
            </p>
          </div>
          {company && (
            <button onClick={handleReset} className="text-white/60 text-sm bg-white/10 px-3 py-1 rounded-full">
              Badlo
            </button>
          )}
        </div>
        {/* Company stats pills */}
        {company && (
          <div className="mx-auto mt-3 flex max-w-5xl gap-2 overflow-x-auto no-scrollbar pb-1">
            <InfoPill label="Price" value={company.currentPrice} />
            <InfoPill label="Market Cap" value={company.marketCap} />
            <InfoPill label="NSE" value={company.ticker} />
          </div>
        )}
      </div>

      {phase === 'search' ? (
        /* Search screen */
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-5">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-navy font-black text-xl mb-2 text-center">Kaunsi company?</h2>
            <p className="text-gray-500 text-sm text-center mb-6">
              Koi bhi naam likhho — brand naam bhi chalega.<br />
              Jaise: Parachute, Jio, Zomato...
            </p>

            <div className="w-full flex gap-2 mb-4">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Company ka naam..."
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-navy outline-none text-navy font-medium bg-white text-base"
                autoFocus
              />
              <button
                onClick={() => handleSearch()}
                className="bg-navy text-white px-4 py-3 rounded-xl font-bold active:scale-95 transition-transform"
              >
                →
              </button>
            </div>

            {/* Suggestions */}
            <p className="text-xs text-gray-400 mb-2 self-start">Popular companies:</p>
            <div className="flex flex-wrap gap-2 w-full">
              {SUGGESTED.map((name) => (
                <button
                  key={name}
                  onClick={() => { setQuery(name); handleSearch(name) }}
                  className="px-3 py-2 bg-white rounded-xl text-sm font-medium text-navy border border-gray-200 active:scale-95 transition-transform card-shadow"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Chat screen */
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-3 overflow-y-auto no-scrollbar p-4">
            {messages.map((msg) =>
              msg.type === 'bot'
                ? <ChatBubble key={msg.id} message={msg.text} isNew={true} />
                : <UserBubble key={msg.id} message={msg.text} />
            )}

            {typing && (
              <div className="flex gap-2 items-end">
                <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center text-sm flex-shrink-0">🤖</div>
                <TypingDots />
              </div>
            )}

            {showDrilldowns && company && (
              <DrilldownOptions
                company={company}
                onSelect={handleDrilldown}
                disabled={drilldownLocked}
              />
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input bar */}
          <div className="border-t border-gray-200 bg-chat-bg p-3 safe-bottom">
            <div className="mx-auto flex w-full max-w-5xl gap-2">
            <input
              type="text"
              placeholder="Aur koi company poochhna hai?"
              className="flex-1 px-4 py-2.5 rounded-full border border-gray-300 bg-white text-sm text-navy outline-none focus:border-navy"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleReset()
                  setTimeout(() => { setQuery(e.target.value); handleSearch(e.target.value) }, 50)
                }
              }}
            />
            <button
              onClick={handleReset}
              className="bg-navy text-white px-4 py-2.5 rounded-full text-sm font-bold active:scale-95 transition-transform"
            >
              Naya
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
