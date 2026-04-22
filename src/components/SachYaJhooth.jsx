import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CARDS, getRandomCards } from '../data/cards'
import { trackEvent } from '../lib/analytics'
import { updateFeatureStats } from '../lib/persistence'

const SWIPE_THRESHOLD = 80
const TOTAL_CARDS = 10

function VerdictBadge({ color }) {
  const map = {
    red: 'bg-red-100 border-red-400 text-red-700',
    amber: 'bg-amber-100 border-amber-400 text-amber-700',
    green: 'bg-green-100 border-green-400 text-green-700',
  }
  return map[color] || map.amber
}

// Single swipeable card
function SwipeCard({ card, onSwipe, isTop }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [flyOut, setFlyOut] = useState(null) // 'left' | 'right' | null
  const startRef = useRef({ x: 0, y: 0 })
  const cardRef = useRef(null)

  const dragStart = useCallback((clientX, clientY) => {
    if (!isTop) return
    setDragging(true)
    startRef.current = { x: clientX, y: clientY }
  }, [isTop])

  const dragMove = useCallback((clientX, clientY) => {
    if (!dragging) return
    setPos({
      x: clientX - startRef.current.x,
      y: (clientY - startRef.current.y) * 0.3,
    })
  }, [dragging])

  const dragEnd = useCallback(() => {
    if (!dragging) return
    setDragging(false)
    if (pos.x > SWIPE_THRESHOLD) {
      setFlyOut('right')
      setTimeout(() => onSwipe('sach'), 300)
    } else if (pos.x < -SWIPE_THRESHOLD) {
      setFlyOut('left')
      setTimeout(() => onSwipe('jhooth'), 300)
    } else {
      setPos({ x: 0, y: 0 })
    }
  }, [dragging, pos.x, onSwipe])

  // Touch handlers
  const onTouchStart = (e) => dragStart(e.touches[0].clientX, e.touches[0].clientY)
  const onTouchMove = (e) => { e.preventDefault(); dragMove(e.touches[0].clientX, e.touches[0].clientY) }
  const onTouchEnd = () => dragEnd()

  // Mouse handlers
  const onMouseDown = (e) => dragStart(e.clientX, e.clientY)
  useEffect(() => {
    if (!dragging) return
    const move = (e) => dragMove(e.clientX, e.clientY)
    const up = () => dragEnd()
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
  }, [dragging, dragMove, dragEnd])

  const rotation = pos.x * 0.07
  const swipeProgress = Math.min(Math.abs(pos.x) / SWIPE_THRESHOLD, 1)
  const goingRight = pos.x > 20
  const goingLeft = pos.x < -20

  let flyStyle = {}
  if (flyOut === 'right') flyStyle = { transform: 'translateX(120vw) rotate(20deg)', transition: 'transform 0.3s ease-out', opacity: 0 }
  if (flyOut === 'left') flyStyle = { transform: 'translateX(-120vw) rotate(-20deg)', transition: 'transform 0.3s ease-out', opacity: 0 }

  const cardStyle = flyOut
    ? flyStyle
    : {
        transform: `translateX(${pos.x}px) translateY(${pos.y}px) rotate(${rotation}deg)`,
        transition: dragging ? 'none' : 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1)',
        cursor: dragging ? 'grabbing' : 'grab',
      }

  return (
    <div
      ref={cardRef}
      className={`absolute inset-0 select-none ${isTop ? 'z-10' : 'z-0 scale-95 opacity-60'}`}
      style={cardStyle}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
    >
      {/* Sach overlay */}
      {goingRight && (
        <div
          className="absolute inset-0 rounded-2xl bg-green-400 flex items-start justify-end p-5 z-20 pointer-events-none"
          style={{ opacity: swipeProgress * 0.7 }}
        >
          <span className="text-white font-black text-2xl border-4 border-white rounded-xl px-3 py-1 rotate-[-12deg] mt-6">
            SACH ✓
          </span>
        </div>
      )}
      {/* Jhooth overlay */}
      {goingLeft && (
        <div
          className="absolute inset-0 rounded-2xl bg-red-400 flex items-start justify-start p-5 z-20 pointer-events-none"
          style={{ opacity: swipeProgress * 0.7 }}
        >
          <span className="text-white font-black text-2xl border-4 border-white rounded-xl px-3 py-1 rotate-[12deg] mt-6">
            JHOOTH ✗
          </span>
        </div>
      )}

      <div className="w-full h-full bg-white rounded-2xl card-shadow flex flex-col justify-between p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
            {card.category}
          </span>
          <span className="text-2xl">🃏</span>
        </div>

        <div className="flex-1 flex items-center justify-center text-center px-2">
          <p className="text-xl font-bold leading-snug text-navy">
            "{card.statement}"
          </p>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-2xl border-2 border-red-300">
              ✗
            </div>
            <span className="text-xs font-semibold text-red-500">JHOOTH</span>
          </div>
          <p className="text-xs text-gray-400 text-center">Swipe karo ya button tap karo</p>
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl border-2 border-green-300">
              ✓
            </div>
            <span className="text-xs font-semibold text-green-600">SACH</span>
          </div>
        </div>

        {/* Tap buttons for accessibility */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => { setFlyOut('left'); setTimeout(() => onSwipe('jhooth'), 300) }}
            className="flex-1 py-3 rounded-xl bg-red-50 border-2 border-red-200 text-red-600 font-bold text-sm active:scale-95 transition-transform"
          >
            ← Jhooth
          </button>
          <button
            onClick={() => { setFlyOut('right'); setTimeout(() => onSwipe('sach'), 300) }}
            className="flex-1 py-3 rounded-xl bg-green-50 border-2 border-green-200 text-green-600 font-bold text-sm active:scale-95 transition-transform"
          >
            Sach →
          </button>
        </div>
      </div>
    </div>
  )
}

// Verdict screen shown after each swipe
function VerdictScreen({ card, userAnswer, onNext }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  const isCorrect = userAnswer === card.correctSwipe
  const colorMap = { red: 'border-red-400 bg-red-50', amber: 'border-amber-400 bg-amber-50', green: 'border-green-400 bg-green-50' }
  const textMap = { red: 'text-red-700', amber: 'text-amber-700', green: 'text-green-700' }

  return (
    <div className={`absolute inset-0 flex flex-col transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex-1 flex flex-col p-5 overflow-y-auto no-scrollbar">
        {/* Result header */}
        <div className={`rounded-2xl p-4 mb-4 text-center ${isCorrect ? 'bg-green-50 border-2 border-green-300' : 'bg-amber-50 border-2 border-amber-300'}`}>
          <div className="text-3xl mb-1">{isCorrect ? '🎯' : '😮'}</div>
          <p className={`font-black text-lg ${isCorrect ? 'text-green-700' : 'text-amber-700'}`}>
            {isCorrect ? 'Sahi socha!' : 'Surprise!'}
          </p>
          <p className={`text-sm mt-1 ${isCorrect ? 'text-green-600' : 'text-amber-600'}`}>
            {isCorrect ? 'Tune yeh myth pakad liya.' : 'Yeh common misconception hai.'}
          </p>
        </div>

        {/* Verdict label */}
        <div className={`inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full border-2 font-bold text-sm mb-3 ${colorMap[card.verdictColor]}`}>
          <span className={textMap[card.verdictColor]}>{card.verdictLabel}</span>
        </div>

        {/* Statement */}
        <p className="text-navy font-semibold text-base mb-3 leading-snug">"{card.statement}"</p>

        {/* Explanation */}
        <div className="bg-navy rounded-2xl p-4 mb-3">
          <p className="text-white text-sm leading-relaxed">{card.explanation}</p>
        </div>

        {/* Real fact */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-4">
          <p className="text-gray-700 text-sm">{card.fact}</p>
        </div>
      </div>

      {/* Next button */}
      <div className="p-5 pt-0">
        <button
          onClick={onNext}
          className="w-full py-4 bg-navy text-white font-bold text-base rounded-2xl active:scale-95 transition-transform"
        >
          Agla card →
        </button>
      </div>
    </div>
  )
}

// Completion screen
function CompletionScreen({ score, total, onRestart, onHome }) {
  const pct = Math.round((score / total) * 100)
  const msg =
    pct >= 80 ? 'Bahut badiya! Tu already zyada log se better samajhta hai.' :
    pct >= 60 ? 'Accha! Kuch myths pakad liye tune.' :
    'Seekhna hua! Ye wahi traps hain joh investors ko hurt karte hain.'

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-fadeIn">
      <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 60 ? '🎯' : '📚'}</div>
      <h2 className="text-2xl font-black text-navy mb-1">{score}/{total} Sahi</h2>
      <p className="text-gray-500 text-sm mb-4">{msg}</p>

      <div className="w-full bg-gray-100 rounded-full h-4 mb-6 overflow-hidden">
        <div
          className="h-4 bg-saffron rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="bg-navy rounded-2xl p-4 w-full mb-6 text-left">
        <p className="text-white font-bold mb-1">Tu jaanta hai?</p>
        <p className="text-gray-300 text-sm">
          Yeh wahi myths hain jo real investors ko hurt karte hain. Ab tune inhe recognize karna seekh liya — woh ek edge hai.
        </p>
      </div>

      <button
        onClick={onRestart}
        className="w-full py-4 bg-saffron text-white font-bold rounded-2xl mb-3 active:scale-95 transition-transform"
      >
        🔄 Phir khelo
      </button>
      <button
        onClick={onHome}
        className="w-full py-3 text-navy font-semibold text-sm"
      >
        ← Wapas home
      </button>
    </div>
  )
}

export default function SachYaJhooth() {
  const navigate = useNavigate()
  const [cards] = useState(() => getRandomCards(TOTAL_CARDS))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState('swipe') // 'swipe' | 'verdict' | 'done'
  const [lastAnswer, setLastAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [completionTracked, setCompletionTracked] = useState(false)

  const currentCard = cards[currentIndex]

  const handleSwipe = useCallback((direction) => {
    setLastAnswer(direction)
    if (direction === currentCard.correctSwipe) {
      setScore((value) => value + 1)
      setStreak((value) => {
        const nextStreak = value + 1
        setBestStreak((currentBest) => Math.max(currentBest, nextStreak))
        return nextStreak
      })
    } else {
      setStreak(0)
    }
    setPhase('verdict')
  }, [currentCard])

  useEffect(() => {
    if (phase !== 'done' || completionTracked) return

    trackEvent('myth_round_completed', {
      score,
      total: cards.length,
      bestStreak,
    })

    updateFeatureStats('sachYaJhooth', (stats) => ({
      ...stats,
      sessions: (stats.sessions || 0) + 1,
      lastScore: score,
      bestScore: Math.max(stats.bestScore || 0, score),
      bestStreak: Math.max(stats.bestStreak || 0, bestStreak),
    }))

    setCompletionTracked(true)
  }, [bestStreak, cards.length, completionTracked, phase, score])

  const handleNext = () => {
    if (currentIndex + 1 >= cards.length) {
      setPhase('done')
    } else {
      setCurrentIndex(i => i + 1)
      setPhase('swipe')
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setCompletionTracked(false)
    setPhase('swipe')
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-navy px-4 pt-12 pb-4 flex-shrink-0">
        <div className="mx-auto mb-3 flex max-w-4xl items-center gap-3">
          <button onClick={() => navigate('/')} className="text-white/60 text-2xl">←</button>
          <div>
            <h1 className="text-white font-black text-xl">Sach Ya Jhooth?</h1>
            <p className="text-white/60 text-xs">Stock market myths — pakad lo</p>
          </div>
        </div>

        {/* Progress + streak */}
        {phase !== 'done' && (
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <div className="flex-1 bg-white/20 rounded-full h-2 mr-4 overflow-hidden">
              <div
                className="h-2 bg-saffron rounded-full transition-all duration-300"
                style={{ width: `${(currentIndex / cards.length) * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-3 text-white text-sm">
              <span>{currentIndex}/{cards.length}</span>
              {streak >= 2 && (
                <span className="bg-saffron text-white px-2 py-0.5 rounded-full text-xs font-bold animate-pulse">
                  🔥 {streak} streak
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Card area */}
  <div className="mx-auto flex w-full max-w-4xl flex-1 relative p-4 overflow-hidden">
        {phase === 'done' ? (
          <CompletionScreen
            score={score}
            total={cards.length}
            onRestart={handleRestart}
            onHome={() => navigate('/')}
          />
        ) : phase === 'verdict' ? (
          <VerdictScreen card={currentCard} userAnswer={lastAnswer} onNext={handleNext} />
        ) : (
          <div className="relative h-full">
            {/* Next card preview */}
            {currentIndex + 1 < cards.length && (
              <div className="absolute inset-0 z-0 scale-95 opacity-50">
                <div className="w-full h-full bg-white rounded-2xl card-shadow" />
              </div>
            )}
            <SwipeCard
              key={currentCard.id}
              card={currentCard}
              onSwipe={handleSwipe}
              isTop={true}
            />
          </div>
        )}
      </div>
    </div>
  )
}
