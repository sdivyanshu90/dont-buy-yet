import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MARKET_REPLAYS } from '../data/marketReplay'
import { trackEvent } from '../lib/analytics'
import { updateFeatureStats } from '../lib/persistence'

export default function MarketReplay() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showReveal, setShowReveal] = useState(false)
  const [score, setScore] = useState(0)
  const [completionTracked, setCompletionTracked] = useState(false)

  const item = MARKET_REPLAYS[index]
  const done = index >= MARKET_REPLAYS.length

  const progress = useMemo(() => {
    const total = MARKET_REPLAYS.length
    return Math.round((index / total) * 100)
  }, [index])

  const submit = (opt) => {
    if (showReveal) return
    setSelected(opt.id)
    setShowReveal(true)
    if (opt.correct) setScore((s) => s + 1)
  }

  const next = () => {
    setSelected(null)
    setShowReveal(false)
    setIndex((i) => i + 1)
  }

  useEffect(() => {
    if (!done || completionTracked) return

    trackEvent('market_replay_completed', {
      score,
      total: MARKET_REPLAYS.length,
    })

    updateFeatureStats('marketReplay', (stats) => ({
      ...stats,
      sessions: (stats.sessions || 0) + 1,
      lastScore: score,
      bestScore: Math.max(stats.bestScore || 0, score),
    }))

    setCompletionTracked(true)
  }, [completionTracked, done, score])

  if (done) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="bg-navy px-4 pt-12 pb-5">
          <div className="mx-auto flex max-w-4xl items-center gap-3">
            <button onClick={() => navigate('/')} className="text-white/60 text-2xl">←</button>
            <div>
              <h1 className="text-white font-black text-xl">Market Replay</h1>
              <p className="text-white/60 text-xs">What-actually-happened stories</p>
            </div>
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center p-5">
          <div className="bg-white rounded-2xl p-5 card-shadow text-center">
            <p className="text-5xl mb-2">🕵️</p>
            <h2 className="text-navy font-black text-2xl">{score}/{MARKET_REPLAYS.length}</h2>
            <p className="text-gray-600 text-sm mt-1">Tumne market moves ko guess nahi, reason se decode kiya.</p>
            <p className="text-xs text-gray-500 mt-4">Process wins {'>'} tip wins.</p>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => {
                setIndex(0)
                setSelected(null)
                setShowReveal(false)
                setScore(0)
                setCompletionTracked(false)
              }}
              className="py-3 rounded-xl border-2 border-navy text-navy font-bold"
            >
              Phir Karo
            </button>
            <button onClick={() => navigate('/')} className="py-3 rounded-xl bg-navy text-white font-bold">
              Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-navy px-4 pt-12 pb-5">
        <div className="mx-auto mb-3 flex max-w-4xl items-center gap-3">
          <button onClick={() => navigate('/')} className="text-white/60 text-2xl">←</button>
          <div>
            <h1 className="text-white font-black text-xl">Market Replay</h1>
            <p className="text-white/60 text-xs">90-sec market mystery</p>
          </div>
        </div>
        <div className="mx-auto w-full max-w-4xl bg-white/20 rounded-full h-2 overflow-hidden">
          <div className="h-2 bg-saffron rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl flex-1 p-5 overflow-y-auto no-scrollbar">
        <div className="bg-white rounded-2xl p-4 card-shadow mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.stock}</p>
          <h2 className="text-navy font-black text-xl mt-1 leading-snug">{item.headline}</h2>
          <p className="text-sm text-gray-500 mt-1">Move: {item.move}</p>
        </div>

        <p className="text-sm font-bold text-navy mb-2">Tumhare hisaab se main reason kya tha?</p>
        <div className="space-y-2">
          {item.options.map((op) => {
            const isSelected = selected === op.id
            const isCorrect = op.correct
            const revealCls = showReveal
              ? isCorrect
                ? 'border-green-300 bg-green-50 text-green-700'
                : isSelected
                  ? 'border-red-300 bg-red-50 text-red-700'
                  : 'border-gray-200 bg-white text-gray-700'
              : 'border-gray-200 bg-white text-gray-700'

            return (
              <button
                key={op.id}
                onClick={() => submit(op)}
                className={`w-full text-left rounded-xl border p-3 text-sm font-medium transition-all ${revealCls}`}
              >
                {op.text}
              </button>
            )
          })}
        </div>

        {showReveal && (
          <div className="mt-4 space-y-3 animate-slideUp pb-16">
            <div className="rounded-2xl bg-navy p-4">
              <p className="text-white/70 text-xs mb-1">What Actually Happened</p>
              <p className="text-white text-sm leading-relaxed">{item.reveal}</p>
            </div>

            <div className="rounded-2xl border-2 border-saffron/40 bg-saffron-light p-4">
              <p className="text-navy font-bold text-sm">Transfer question:</p>
              <p className="text-gray-700 text-sm mt-1">{item.transferQuestion}</p>
            </div>

            <button onClick={next} className="w-full py-4 rounded-xl bg-navy text-white font-bold">
              Next Replay →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
