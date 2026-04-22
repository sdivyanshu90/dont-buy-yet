import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { parseTip } from '../data/tipPatterns'
import { trackEvent } from '../lib/analytics'
import { updateFeatureStats } from '../lib/persistence'

const QUESTION_BANK = [
  {
    key: 'evidence',
    title: 'Is tip ke saath koi real reason diya gaya?',
    options: [
      { id: 'none', label: 'Nahi, bas "pakka" type line hai', score: -20 },
      { id: 'vague', label: 'Thoda vague reason hai', score: -5 },
      { id: 'clear', label: 'Haan, clear business reason diya hai', score: 15 },
    ],
  },
  {
    key: 'timeline',
    title: 'Timeline realistic lagti hai?',
    options: [
      { id: 'hype', label: 'Nahi, bahut jaldi-rich wala claim hai', score: -20 },
      { id: 'mixed', label: 'Not sure, maybe ho sakta hai', score: -5 },
      { id: 'realistic', label: 'Haan, moderate lag rahi hai', score: 10 },
    ],
  },
  {
    key: 'riskPlan',
    title: 'Agar ulta hua to plan kya hai?',
    options: [
      { id: 'none', label: 'No plan, bas dekh lenge', score: -20 },
      { id: 'basic', label: 'Thoda plan hai (alert / wait)', score: 0 },
      { id: 'clear', label: 'Clear plan hai (exit rule + amount limit)', score: 15 },
    ],
  },
]

function DecisionBlock({ verdict, confidence }) {
  const config = {
    avoid: {
      title: 'Skip For Now',
      subtitle: 'Yeh abhi impulse lag raha hai, research nahi.',
      cls: 'bg-red-50 border-red-300 text-red-700',
    },
    watch: {
      title: 'Watchlist Only',
      subtitle: 'Abhi buy nahi. Trigger/alert set karo aur observe karo.',
      cls: 'bg-amber-50 border-amber-300 text-amber-700',
    },
    investigate: {
      title: 'Investigate First',
      subtitle: 'Claim possible hai, par 3 checks ke baad hi action.',
      cls: 'bg-green-50 border-green-300 text-green-700',
    },
  }

  const chosen = config[verdict]
  return (
    <div className={`rounded-2xl border-2 p-4 ${chosen.cls}`}>
      <p className="text-xs font-bold uppercase tracking-wide mb-1">Tip Trial Verdict</p>
      <p className="text-xl font-black">{chosen.title}</p>
      <p className="text-sm mt-1">{chosen.subtitle}</p>
      <p className="text-xs mt-3 opacity-80">Decision confidence: {confidence}%</p>
    </div>
  )
}

export default function TipTrial() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState('input')
  const [tipText, setTipText] = useState('')
  const [stance, setStance] = useState('')
  const [qIndex, setQIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [resultTracked, setResultTracked] = useState(false)

  const parsed = useMemo(() => (tipText.trim() ? parseTip(tipText) : null), [tipText])

  const handleStart = () => {
    if (!tipText.trim()) return
    trackEvent('tip_trial_started', { hasTipText: Boolean(tipText.trim()) })
    setPhase('stance')
  }

  const handleStance = (value) => {
    setStance(value)
    setPhase('questions')
  }

  const handleAnswer = (option) => {
    const key = QUESTION_BANK[qIndex].key
    const next = { ...answers, [key]: option }
    setAnswers(next)

    if (qIndex + 1 >= QUESTION_BANK.length) {
      setPhase('result')
      return
    }
    setQIndex((prev) => prev + 1)
  }

  const handleReset = () => {
    setPhase('input')
    setTipText('')
    setStance('')
    setQIndex(0)
    setAnswers({})
    setResultTracked(false)
  }

  const result = useMemo(() => {
    if (phase !== 'result' || !parsed) return null

    const questionScore = Object.values(answers).reduce((acc, item) => acc + (item?.score || 0), 0)
    const stanceBias = stance === 'cross' ? 8 : -8
    const raw = 55 + questionScore + stanceBias - parsed.hyp * 0.45
    const confidence = Math.max(5, Math.min(95, Math.round(raw)))

    let verdict = 'watch'
    if (confidence < 35) verdict = 'avoid'
    if (confidence >= 65) verdict = 'investigate'

    return { confidence, verdict }
  }, [answers, parsed, phase, stance])

  useEffect(() => {
    if (phase !== 'result' || !result || resultTracked) return

    trackEvent('tip_trial_completed', {
      verdict: result.verdict,
      confidence: result.confidence,
    })

    updateFeatureStats('tipTrial', (stats) => ({
      ...stats,
      sessions: (stats.sessions || 0) + 1,
      lastVerdict: result.verdict,
      bestConfidence: Math.max(stats.bestConfidence || 0, result.confidence),
    }))

    setResultTracked(true)
  }, [phase, result, resultTracked])

  const currentQ = QUESTION_BANK[qIndex]

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-navy px-4 pt-12 pb-5">
        <div className="mx-auto flex max-w-4xl items-center gap-3 mb-1">
          <button onClick={() => navigate('/')} className="text-white/60 text-2xl">←</button>
          <div>
            <h1 className="text-white font-black text-xl">Tip Trial</h1>
            <p className="text-white/60 text-xs">60-sec courtroom for stock tips</p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-4xl flex-1 p-5 overflow-y-auto no-scrollbar">
        {phase === 'input' && (
          <div className="space-y-4">
            <div className="bg-navy/5 border border-navy/10 rounded-2xl p-4">
              <p className="text-navy font-bold text-sm">Tip paste karo, judge ban jao.</p>
              <p className="text-gray-600 text-xs mt-1">90 sec ke andar decide: ignore, watchlist, ya investigate.</p>
            </div>
            <textarea
              value={tipText}
              onChange={(e) => setTipText(e.target.value)}
              placeholder='Example: "XYZ 2x in 6 months, pakka source"'
              className="w-full h-36 p-4 rounded-2xl border-2 border-gray-200 focus:border-navy outline-none text-sm resize-none"
            />
            <button
              onClick={handleStart}
              disabled={!tipText.trim()}
              className="w-full py-4 bg-navy text-white rounded-2xl font-bold disabled:opacity-40"
            >
              Trial Start Karo
            </button>
          </div>
        )}

        {phase === 'stance' && (
          <div className="space-y-3 animate-slideUp">
            <p className="text-navy font-black text-lg">Courtroom stance choose karo:</p>
            <button
              onClick={() => handleStance('believe')}
              className="w-full text-left rounded-2xl border-2 border-amber-300 bg-amber-50 p-4"
            >
              <p className="font-bold text-amber-700">Believe First</p>
              <p className="text-xs text-amber-700/80 mt-1">"Shayad sahi ho" mindset</p>
            </button>
            <button
              onClick={() => handleStance('cross')}
              className="w-full text-left rounded-2xl border-2 border-green-300 bg-green-50 p-4"
            >
              <p className="font-bold text-green-700">Cross-Examine First</p>
              <p className="text-xs text-green-700/80 mt-1">"Proof dikhao" mindset</p>
            </button>
          </div>
        )}

        {phase === 'questions' && currentQ && (
          <div className="space-y-4 animate-slideUp">
            <p className="text-xs font-semibold text-gray-500">Question {qIndex + 1}/3</p>
            <h2 className="text-navy font-black text-xl leading-snug">{currentQ.title}</h2>
            <div className="space-y-2">
              {currentQ.options.map((op) => (
                <button
                  key={op.id}
                  onClick={() => handleAnswer(op)}
                  className="w-full text-left rounded-xl border border-gray-200 bg-white p-3 text-sm font-medium active:scale-[0.99]"
                >
                  {op.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'result' && result && parsed && (
          <div className="space-y-4 animate-slideUp pb-20">
            <DecisionBlock verdict={result.verdict} confidence={result.confidence} />

            <div className="bg-white rounded-2xl p-4 card-shadow">
              <p className="text-navy font-bold text-sm mb-2">3 sawaal jo action se pehle puchne hi hain:</p>
              {parsed.questions.map((q, idx) => (
                <p key={idx} className="text-sm text-gray-700 mb-2">
                  {idx + 1}. {q.heading}
                </p>
              ))}
            </div>

            <div className="bg-navy rounded-2xl p-4 text-white">
              <p className="text-white/60 text-xs mb-1">Identity Shift</p>
              <p className="font-bold">Aaj tumne tip follow nahi kiya. Tumne tip test kiya.</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleReset} className="py-3 rounded-xl border-2 border-navy text-navy font-bold">Aur Tip Try Karo</button>
              <button onClick={() => navigate('/decode-tip', { state: { tip: tipText } })} className="py-3 rounded-xl bg-navy text-white font-bold">Decode Deep Dive</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
