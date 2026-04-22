import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { parseTip } from '../data/tipPatterns'
import { trackEvent } from '../lib/analytics'
import { appendDecodeHistory } from '../lib/persistence'
import { buildDecodeTipLink, openWhatsAppShare } from '../lib/share'

const SOURCE_OPTIONS = [
  { id: 'whatsapp', label: 'WhatsApp group', note: 'Forwarded conviction', risk: 12 },
  { id: 'youtube', label: 'YouTube finfluencer', note: 'Views != proof', risk: 10 },
  { id: 'telegram', label: 'Telegram channel', note: 'Pump risk high', risk: 14 },
  { id: 'friend', label: 'Dost / bhaiya', note: 'Relationship != research', risk: 8 },
  { id: 'broker', label: 'Broker / RM', note: 'Target pucho, logic bhi pucho', risk: 6 },
  { id: 'self', label: 'Khud dekha', note: 'Bias bhi check karo', risk: 2 },
]

const RITUAL_QUESTIONS = [
  {
    key: 'evidence',
    title: 'Is tip ke peeche koi real reason diya gaya?',
    helper: '"Upper circuit aayega" reason nahi hota.',
    options: [
      { id: 'no', label: 'Nahi, bas hype line hai', score: -18 },
      { id: 'some', label: 'Thoda vague reason hai', score: -6 },
      { id: 'yes', label: 'Haan, business reason diya hai', score: 12 },
    ],
  },
  {
    key: 'timeline',
    title: 'Timeline realistic lag rahi hai?',
    helper: 'Jitna jaldi-rich promise, utna zyada doubt.',
    options: [
      { id: 'no', label: 'Nahi, bahut aggressive hai', score: -18 },
      { id: 'some', label: 'Not sure, stretch lag raha hai', score: -6 },
      { id: 'yes', label: 'Haan, manageable lag rahi hai', score: 10 },
    ],
  },
  {
    key: 'downside',
    title: 'Agar ulta hua toh plan kya hai?',
    helper: 'Risk ko ignore karna bhi decision hi hai.',
    options: [
      { id: 'no', label: 'No plan, bas dekh lenge', score: -18 },
      { id: 'some', label: 'Watchlist / alert lagaunga', score: 2 },
      { id: 'yes', label: 'Amount limit + exit plan hai', score: 12 },
    ],
  },
]

const DECISION_CONFIG = {
  skip: {
    label: 'Abhi Nahi',
    tone: 'red',
    subtitle: 'Yeh tip abhi investigate ke layak bhi weak lag rahi hai.',
    action: 'Source se proof maango. Proof na ho toh ignore karo.',
    identity: 'Aaj tumne FOMO pe brake lagaya.',
  },
  watch: {
    label: 'Watchlist Only',
    tone: 'amber',
    subtitle: 'Story mein thoda dum ho sakta hai, par buy ka signal nahi hai.',
    action: 'Abhi buy mat karo. Alert set karo aur latest result/news check karo.',
    identity: 'Aaj tumne impulse ko pause kiya.',
  },
  investigate: {
    label: 'Haan, Investigate Karo',
    tone: 'green',
    subtitle: 'Claim ko aur dekhna worth ho sakta hai, bas blind faith se nahi.',
    action: 'Latest quarterly result, recent news, aur business reason ko confirm karo.',
    identity: 'You just thought like an analyst.',
  },
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function getSourceConfig(sourceId) {
  return SOURCE_OPTIONS.find((option) => option.id === sourceId) || SOURCE_OPTIONS[0]
}

function getSignalTone(score) {
  if (score >= 65) return 'green'
  if (score >= 40) return 'amber'
  return 'red'
}

function buildAnalysis(parsed, ritualAnswers, sourceId) {
  const source = getSourceConfig(sourceId)
  const ritualScore = Object.entries(ritualAnswers).reduce((total, [key, answerId]) => {
    const question = RITUAL_QUESTIONS.find((item) => item.key === key)
    const answer = question?.options.find((option) => option.id === answerId)
    return total + (answer?.score || 0)
  }, 0)

  const rawScore = 100 - parsed.hyp - source.risk + ritualScore
  const investigateScore = clamp(Math.round(rawScore), 5, 95)
  const tone = getSignalTone(investigateScore)
  const decisionKey = tone === 'green' ? 'investigate' : tone === 'amber' ? 'watch' : 'skip'

  const xray = [
    {
      label: 'Reason',
      icon: '🧾',
      tone: ritualAnswers.evidence === 'yes' ? 'green' : ritualAnswers.evidence === 'some' ? 'amber' : 'red',
      value: ritualAnswers.evidence === 'yes' ? 'Reason mila' : ritualAnswers.evidence === 'some' ? 'Half clear' : 'Hype only',
    },
    {
      label: 'Timeline',
      icon: '⏱️',
      tone: ritualAnswers.timeline === 'yes' && parsed.hyp < 60 ? 'green' : ritualAnswers.timeline === 'some' ? 'amber' : 'red',
      value: ritualAnswers.timeline === 'yes' ? 'Realistic' : ritualAnswers.timeline === 'some' ? 'Stretch' : 'Fantasy zone',
    },
    {
      label: 'Seatbelt',
      icon: '🪖',
      tone: ritualAnswers.downside === 'yes' ? 'green' : ritualAnswers.downside === 'some' ? 'amber' : 'red',
      value: ritualAnswers.downside === 'yes' ? 'Plan ready' : ritualAnswers.downside === 'some' ? 'Basic plan' : 'No plan',
    },
  ]

  const primaryQuestions = [
    'Iska real business reason kya hai?',
    'Itni jaldi kyun? Timeline ka base kya hai?',
    'Agar 20% gir gaya toh mera plan kya hai?',
  ]

  const summaryReasons = [
    ...parsed.hyp_reasons.slice(0, 2),
    ...parsed.caution_flags.slice(0, 2),
  ].slice(0, 3)

  return {
    investigateScore,
    tone,
    decisionKey,
    decision: DECISION_CONFIG[decisionKey],
    source,
    xray,
    primaryQuestions,
    summaryReasons,
    parsed,
  }
}

function toneClasses(tone) {
  if (tone === 'green') {
    return {
      soft: 'bg-green-50 border-green-300 text-green-700',
      text: 'text-green-700',
    }
  }

  if (tone === 'amber') {
    return {
      soft: 'bg-amber-50 border-amber-300 text-amber-700',
      text: 'text-amber-700',
    }
  }

  return {
    soft: 'bg-red-50 border-red-300 text-red-700',
    text: 'text-red-700',
  }
}

function TrafficSignal({ tone, score }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {[
        { key: 'red', label: 'Stop' },
        { key: 'amber', label: 'Watch' },
        { key: 'green', label: 'Go check' },
      ].map((item) => {
        const active = item.key === tone
        return (
          <div
            key={item.key}
            className={`rounded-xl border-2 px-3 py-3 text-center transition-all ${active ? toneClasses(item.key).soft : 'border-gray-200 bg-white text-gray-400'}`}
          >
            <p className="text-[11px] font-bold uppercase tracking-wide">{item.label}</p>
          </div>
        )
      })}
      <p className="col-span-3 text-xs text-gray-500 mt-1">Investigate score: {score}/100</p>
    </div>
  )
}

function XrayPanel({ xray }) {
  return (
    <div className="bg-white rounded-2xl p-4 card-shadow">
      <div className="flex items-center justify-between mb-3">
        <p className="text-navy font-bold text-sm">🩻 Tip X-Ray</p>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">3 checks</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {xray.map((item) => (
          <div key={item.label} className={`rounded-xl border px-2 py-3 text-center ${toneClasses(item.tone).soft}`}>
            <p className="text-lg mb-1">{item.icon}</p>
            <p className="text-[11px] font-bold uppercase tracking-wide">{item.label}</p>
            <p className="text-xs mt-1 font-medium">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function LoadingProgress({ step }) {
  const steps = [
    'Claim check kar rahe hain...',
    'Company story scan ho rahi hai...',
    'Hype pattern decode ho raha hai...',
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="text-5xl mb-6 animate-pulse">⛑️</div>
      <h3 className="text-navy font-black text-xl mb-2">Helmet Check</h3>
      <p className="text-gray-500 text-sm mb-6">2 minute ke andar decision clarity denge.</p>
      <div className="w-full space-y-3">
        {steps.map((text, index) => (
          <div key={text} className={`flex items-center gap-3 transition-all ${index <= step ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index < step ? 'bg-green-500 text-white' : index === step ? 'bg-saffron text-white animate-pulse' : 'bg-gray-200 text-gray-400'}`}>
              {index < step ? '✓' : index + 1}
            </div>
            <p className={`text-sm ${index <= step ? 'text-navy font-medium' : 'text-gray-400'}`}>{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function RitualStep({ question, step, total, onAnswer, tipText, source }) {
  return (
    <div className="flex-1 flex flex-col p-5 overflow-y-auto no-scrollbar">
      <div className="bg-navy rounded-2xl p-4 mb-5">
        <p className="text-white/60 text-xs mb-1">Quick pause before action</p>
        <p className="text-white font-bold text-sm leading-relaxed">"{tipText}"</p>
        <p className="text-saffron text-xs mt-2">Source: {source.label}</p>
      </div>

      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Sawal {step} / {total}</p>
        <h2 className="text-navy font-black text-xl leading-snug mt-1">{question.title}</h2>
        <p className="text-gray-500 text-sm mt-2">{question.helper}</p>
      </div>

      <div className="space-y-2 mt-2">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onAnswer(option.id)}
            className="w-full text-left rounded-2xl border border-gray-200 bg-white p-4 text-sm font-medium text-gray-700 active:scale-[0.99] transition-transform card-shadow"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function VerdictCard({ analysis, sourceId, tipText, onReset }) {
  const [revealIndex, setRevealIndex] = useState(-1)

  useEffect(() => {
    const timers = [0, 1, 2].map((index) => setTimeout(() => setRevealIndex(index), 200 + index * 220))
    return () => timers.forEach(clearTimeout)
  }, [])

  const shareText = `"${tipText}"\nVerdict: ${analysis.decision.label}\nNext move: ${analysis.decision.action}`

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'Decode My Tip', text: shareText })
      trackEvent('decode_shared', { channel: 'system-share', decision: analysis.decisionKey })
      return
    }

    await navigator.clipboard.writeText(shareText)
    trackEvent('decode_shared', { channel: 'copy-link', decision: analysis.decisionKey })
  }

  const handleWhatsAppShare = () => {
    const link = buildDecodeTipLink({ tip: tipText, source: sourceId })
    openWhatsAppShare(`${shareText}\n\nForwarded from dont-buy-yet:\n${link}`)
    trackEvent('decode_shared', { channel: 'whatsapp', decision: analysis.decisionKey })
  }

  return (
    <div className="mx-auto flex-1 w-full max-w-4xl overflow-y-auto no-scrollbar p-5 pb-8 space-y-4">
      <div className="bg-navy rounded-2xl p-4">
        <p className="text-white/60 text-xs mb-1">Decode My Tip</p>
        <p className="text-white font-bold text-base leading-snug">"{tipText}"</p>
        <p className="text-saffron text-xs mt-2">Source note: {analysis.source.note}</p>
      </div>

      <div className={`rounded-2xl border-2 p-4 ${toneClasses(analysis.tone).soft}`}>
        <p className="text-xs font-bold uppercase tracking-wide mb-1">Worth investigating?</p>
        <p className="text-2xl font-black">{analysis.decision.label}</p>
        <p className="text-sm mt-1">{analysis.decision.subtitle}</p>
      </div>

      <TrafficSignal tone={analysis.tone} score={analysis.investigateScore} />
      <XrayPanel xray={analysis.xray} />

      <div className="bg-white rounded-2xl p-4 card-shadow">
        <p className="text-navy font-bold text-sm mb-3">Why this verdict</p>
        <div className="space-y-2">
          {analysis.summaryReasons.map((reason, index) => (
            <div key={reason} className={`transition-all ${revealIndex >= index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
              <p className="text-sm text-gray-700 leading-relaxed">• {reason}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 card-shadow">
        <p className="text-navy font-bold text-sm mb-3">3 questions before acting</p>
        <div className="space-y-2">
          {analysis.primaryQuestions.map((question, index) => (
            <div key={question} className="rounded-xl bg-gray-50 px-3 py-3">
              <p className="text-sm font-medium text-gray-700">{index + 1}. {question}</p>
            </div>
          ))}
        </div>
      </div>

      {analysis.parsed.company && (
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Current company story</p>
          <p className="text-sm text-gray-700 leading-relaxed">{analysis.parsed.company.recentStory}</p>
        </div>
      )}

      <div className="bg-navy rounded-2xl p-4">
        <p className="text-white/60 text-xs mb-1">Next move</p>
        <p className="text-white text-sm leading-relaxed">{analysis.decision.action}</p>
        <p className="text-saffron text-xs mt-3">{analysis.decision.identity}</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <button
          onClick={handleShare}
          className="py-3 bg-saffron-light border-2 border-saffron/40 rounded-xl text-saffron font-bold text-sm active:scale-95 transition-transform"
        >
          Share
        </button>
        <button
          onClick={handleWhatsAppShare}
          className="py-3 bg-green-500 text-white rounded-xl font-bold text-sm active:scale-95 transition-transform"
        >
          WhatsApp
        </button>
        <button
          onClick={onReset}
          className="py-3 bg-navy text-white rounded-xl font-bold text-sm active:scale-95 transition-transform sm:col-span-2"
        >
          Aur Tip
        </button>
      </div>
    </div>
  )
}

export default function DecodeTip() {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const initialTip = location.state?.tip || searchParams.get('tip') || ''
  const initialSource = location.state?.source || searchParams.get('source') || 'whatsapp'
  const textareaRef = useRef(null)
  const [tipText, setTipText] = useState(initialTip)
  const [sourceId, setSourceId] = useState(initialSource)
  const [phase, setPhase] = useState('input')
  const [loadStep, setLoadStep] = useState(0)
  const [parsedResult, setParsedResult] = useState(null)
  const [ritualStep, setRitualStep] = useState(0)
  const [ritualAnswers, setRitualAnswers] = useState({})
  const [resultTracked, setResultTracked] = useState(false)

  const currentQuestion = RITUAL_QUESTIONS[ritualStep]
  const selectedSource = getSourceConfig(sourceId)

  const analysis = useMemo(() => {
    if (!parsedResult) return null
    return buildAnalysis(parsedResult, ritualAnswers, sourceId)
  }, [parsedResult, ritualAnswers, sourceId])

  useEffect(() => {
    if (location.state?.tip || searchParams.get('tip')) {
      trackEvent('decode_prefilled_opened', { sourceId: initialSource })
    }
  }, [initialSource, location.state?.tip, searchParams])

  useEffect(() => {
    if (phase !== 'result' || !analysis || resultTracked) return

    trackEvent('decode_completed', {
      sourceId,
      decision: analysis.decisionKey,
      investigateScore: analysis.investigateScore,
      company: analysis.parsed.company?.ticker || null,
    })

    appendDecodeHistory({
      tipText,
      sourceId,
      sourceLabel: analysis.source.label,
      decisionKey: analysis.decisionKey,
      decisionLabel: analysis.decision.label,
      investigateScore: analysis.investigateScore,
    })

    setResultTracked(true)
  }, [analysis, phase, resultTracked, sourceId, tipText])

  const handleAnalyze = () => {
    if (!tipText.trim()) return

    trackEvent('decode_started', { sourceId, hasTipText: Boolean(tipText.trim()) })
    setPhase('loading')
    setLoadStep(0)
    setResultTracked(false)

    setTimeout(() => setLoadStep(1), 450)
    setTimeout(() => setLoadStep(2), 900)
    setTimeout(() => {
      setParsedResult(parseTip(tipText))
      setPhase('ritual')
    }, 1500)
  }

  const handleRitualAnswer = (answerId) => {
    const nextAnswers = { ...ritualAnswers, [currentQuestion.key]: answerId }
    setRitualAnswers(nextAnswers)

    if (ritualStep + 1 >= RITUAL_QUESTIONS.length) {
      setPhase('result')
      return
    }

    setRitualStep((prev) => prev + 1)
  }

  const handleReset = () => {
    setTipText('')
    setSourceId('whatsapp')
    setParsedResult(null)
    setRitualAnswers({})
    setRitualStep(0)
    setLoadStep(0)
    setResultTracked(false)
    setPhase('input')
    setTimeout(() => textareaRef.current?.focus(), 100)
  }

  const exampleTips = [
    'Paytm will 3x in 6 months — confirmed source hai',
    'Adani Power buy karo, 2 mahine mein double hoga 🚀',
    'IRCTC long term ke liye accha hai, railways expand ho raha hai',
    'Infosys next quarter earnings strong honge, AI business growing',
  ]

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-navy px-4 pt-12 pb-5 flex-shrink-0">
        <div className="mx-auto flex max-w-4xl items-center gap-3 mb-1">
          <button onClick={() => navigate('/')} className="text-white/60 text-2xl">←</button>
          <div>
            <h1 className="text-white font-black text-xl">Decode My Tip</h1>
            <p className="text-white/60 text-xs">Paste tip. 3 taps. Fir verdict.</p>
          </div>
        </div>
      </div>

      {phase === 'loading' && <LoadingProgress step={loadStep} />}

      {phase === 'ritual' && parsedResult && currentQuestion && (
        <RitualStep
          question={currentQuestion}
          step={ritualStep + 1}
          total={RITUAL_QUESTIONS.length}
          onAnswer={handleRitualAnswer}
          tipText={tipText}
          source={selectedSource}
        />
      )}

      {phase === 'result' && analysis && (
        <VerdictCard analysis={analysis} sourceId={sourceId} tipText={tipText} onReset={handleReset} />
      )}

      {phase === 'input' && (
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col p-5 overflow-y-auto no-scrollbar">
          <div className="bg-navy/5 border border-navy/10 rounded-2xl p-4 mb-5 flex gap-3 items-start">
            <span className="text-2xl flex-shrink-0">⛑️</span>
            <div>
              <p className="text-navy font-bold text-sm mb-1">Helmet Check</p>
              <p className="text-gray-500 text-xs leading-relaxed">
                Tip paste karo. Hum jargon nahi phenkenge. Bas ek tip ko decision ritual mein tod denge.
              </p>
            </div>
          </div>

          <label className="text-navy font-bold text-sm mb-2 block">Tip yahan likho ya paste karo:</label>
          <textarea
            ref={textareaRef}
            value={tipText}
            onChange={(event) => setTipText(event.target.value)}
            placeholder={`Example:\n"Zomato will 2x in 3 months"\n"IRFC buy karo, listing ke baad badh raha hai"\n"Adani ka koi bhi stock lo, Diwali tak double hoga"`}
            className="w-full h-36 p-4 rounded-2xl border-2 border-gray-200 focus:border-navy outline-none text-navy text-sm resize-none bg-white leading-relaxed"
            autoFocus
          />

          <div className="mt-4">
            <p className="text-navy font-bold text-sm mb-2">Tip kahan se aayi?</p>
            <div className="flex flex-wrap gap-2">
              {SOURCE_OPTIONS.map((option) => {
                const active = option.id === sourceId
                return (
                  <button
                    key={option.id}
                    onClick={() => setSourceId(option.id)}
                    className={`px-3 py-2 rounded-full text-xs font-semibold border transition-all ${active ? 'bg-navy text-white border-navy' : 'bg-white text-gray-600 border-gray-200'}`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!tipText.trim()}
            className="w-full mt-5 py-4 bg-navy text-white font-black text-base rounded-2xl disabled:opacity-40 active:scale-95 transition-transform"
          >
            Start 2-Min Check
          </button>

          <div className="mt-3 rounded-xl bg-saffron-light border border-saffron/30 p-3">
            <p className="text-xs text-navy font-semibold">Output milega:</p>
            <p className="text-xs text-gray-600 mt-1">Worth investigating ya nahi, 3 sawaal, aur next move.</p>
          </div>

          <div className="mt-6">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">Ya yeh try karo:</p>
            <div className="space-y-2">
              {exampleTips.map((tip) => (
                <button
                  key={tip}
                  onClick={() => setTipText(tip)}
                  className="w-full text-left p-3 bg-white rounded-xl border border-gray-200 text-sm text-gray-600 active:scale-95 transition-transform card-shadow"
                >
                  <span className="text-gray-400 mr-2">💬</span>
                  {tip}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}