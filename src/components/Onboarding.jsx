import { useReducer, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { trackEvent } from '../lib/analytics'
import { readStoredJSON, STORAGE_KEYS, writeStoredJSON } from '../lib/persistence'

// ─── State machine ────────────────────────────────────────────────────────────
const INITIAL_STATE = {
  step: 1,
  answers: {},
  badges: [],
  portfolio: { titan: 0, irctc: 0, wipro: 0 },
  riskTolerance: null, // 'low' | 'medium' | 'high'
  completedAt: null,
  investmentChoice: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'NEXT': return { ...state, step: state.step + 1 }
    case 'ANSWER': return { ...state, answers: { ...state.answers, [action.key]: action.value } }
    case 'SET_RISK': return { ...state, riskTolerance: action.value }
    case 'EARN_BADGE': return { ...state, badges: [...state.badges, action.badge] }
    case 'SET_PORTFOLIO': return { ...state, portfolio: action.portfolio }
    case 'MARK_COMPLETE':
      return {
        ...state,
        completedAt: state.completedAt || new Date().toISOString(),
        investmentChoice: action.value,
      }
    case 'RESET':
      return INITIAL_STATE
    default: return state
  }
}

function loadOnboardingState() {
  const stored = readStoredJSON(STORAGE_KEYS.onboarding, null)
  if (!stored) return INITIAL_STATE

  return {
    ...INITIAL_STATE,
    ...stored,
    answers: stored.answers || {},
    badges: stored.badges || [],
    portfolio: stored.portfolio || INITIAL_STATE.portfolio,
  }
}

// ─── Shared UI primitives ─────────────────────────────────────────────────────
function ProgressBar({ current, total }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-white/20 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-1.5 bg-saffron rounded-full transition-all duration-500"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
      <span className="text-white/60 text-xs">{current}/7</span>
    </div>
  )
}

function StepWrapper({ children, step }) {
  return (
    <div key={step} className="flex-1 flex flex-col overflow-y-auto no-scrollbar animate-slideUp">
      {children}
    </div>
  )
}

function BigButton({ onClick, children, variant = 'primary' }) {
  const cls = variant === 'primary'
    ? 'bg-navy text-white'
    : 'bg-saffron text-white'
  return (
    <button
      onClick={onClick}
      className={`w-full py-4 ${cls} font-bold text-base rounded-2xl active:scale-95 transition-transform`}
    >
      {children}
    </button>
  )
}

function ChoiceCard({ label, sublabel, onClick, selected }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border-2 transition-all active:scale-95
        ${selected ? 'border-navy bg-navy/5' : 'border-gray-200 bg-white'}`}
    >
      <p className={`font-bold text-sm ${selected ? 'text-navy' : 'text-gray-800'}`}>{label}</p>
      {sublabel && <p className="text-gray-500 text-xs mt-0.5">{sublabel}</p>}
    </button>
  )
}

function BadgePop({ badge }) {
  const [show, setShow] = useState(false)
  useEffect(() => { setTimeout(() => setShow(true), 100) }, [])
  return (
    <div className={`transition-all duration-500 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
      <div className="bg-saffron text-white rounded-2xl px-5 py-3 text-center card-shadow">
        <div className="text-3xl mb-1">{badge.emoji}</div>
        <p className="font-black text-sm">{badge.label}</p>
        {badge.sub && <p className="text-white/80 text-xs mt-0.5">{badge.sub}</p>}
      </div>
    </div>
  )
}

// ─── Step 1: Fear Validation ──────────────────────────────────────────────────
function Step1({ dispatch }) {
  return (
    <StepWrapper step={1}>
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-5xl text-center mb-5">😰</div>

          <div className="bg-navy rounded-2xl p-5 mb-4">
            <p className="text-white font-bold text-base leading-relaxed mb-3">
              "Ek cheez seedhi baat:"
            </p>
            <p className="text-white/90 text-sm leading-relaxed">
              Stock market mein paisa doob sakta hai. Yeh sach hai.
            </p>
            <p className="text-white/90 text-sm leading-relaxed mt-2">
              Tumhare rishtedaar ke saath jo hua woh real tha. Hum yeh nahi bolenge ke sab theek hai.
            </p>
          </div>

          <div className="bg-saffron-light border-2 border-saffron/20 rounded-2xl p-4">
            <p className="text-navy font-bold text-sm mb-2">Lekin ek cheez aur bhi sach hai:</p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Jo galti unhone ki — woh <strong>galti thi</strong>. Market nahi.
            </p>
            <p className="text-gray-600 text-xs mt-2">
              Kya galti thi? Chalte hain dekhin.
            </p>
          </div>
        </div>

        <BigButton onClick={() => dispatch({ type: 'NEXT' })}>
          Haan, batao kya galti thi →
        </BigButton>
        <p className="text-center text-xs text-gray-400">Koi account, koi login nahi chahiye</p>
      </div>
    </StepWrapper>
  )
}

// ─── Step 2: Gambling vs Investing distinction ────────────────────────────────
function Step2({ dispatch }) {
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)

  const handleChoice = (choice) => {
    if (revealed) return
    setSelected(choice)
    setRevealed(true)
    dispatch({ type: 'ANSWER', key: 'gamblingVsInvesting', value: choice })
  }

  const OPTION_A = {
    id: 'a',
    name: 'Ramesh',
    text: 'Ramesh ne kal ₹5,000 lagaye "XYZ stock mein 2 din mein double hoga" sunke. WhatsApp pe tip mili thi.',
  }
  const OPTION_B = {
    id: 'b',
    name: 'Priya',
    text: 'Priya ne ₹500/month SIP shuru kiya Nifty 50 index fund mein. 10 saal ke liye. Bina kisi tip ke.',
  }

  return (
    <StepWrapper step={2}>
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex-1 flex flex-col justify-center gap-4">
          <p className="text-navy font-black text-lg text-center">
            Kaunsa behavior zyada risky lagta hai?
          </p>

          <ChoiceCard
            label="🎲 Ramesh"
            sublabel={OPTION_A.text}
            onClick={() => handleChoice('a')}
            selected={selected === 'a'}
          />
          <ChoiceCard
            label="📈 Priya"
            sublabel={OPTION_B.text}
            onClick={() => handleChoice('b')}
            selected={selected === 'b'}
          />

          {revealed && (
            <div className="bg-navy rounded-2xl p-4 animate-slideUp">
              <p className="text-saffron font-bold text-sm mb-2">✓ Sahi pakda.</p>
              <p className="text-white text-sm leading-relaxed">
                <strong>Ramesh wala behavior — woh satta hai.</strong> Priya wala — woh investing hai.
              </p>
              <p className="text-white/70 text-xs mt-2 leading-relaxed">
                Difference behavior mein hai, market mein nahi. Tumhare rishtedaar ne probably Ramesh wala kiya tha.
              </p>
            </div>
          )}
        </div>

        {revealed && (
          <BigButton onClick={() => dispatch({ type: 'NEXT' })}>
            Samajh aaya → Aage chalte hain
          </BigButton>
        )}
      </div>
    </StepWrapper>
  )
}

// ─── Step 3: Smallest Possible World ─────────────────────────────────────────
const COMPANY_SIMULATIONS = {
  hul: {
    name: 'Hindustan Unilever (HUL)',
    tagline: 'Woh company jo Surf, Rin, Dove banati hai',
    emoji: '🧴',
    start: 2015,
    startAmount: 1000,
    endAmount: 4200,
    growth: '320%',
    note: 'Kuch hua nahi tha. Bas rakhna tha.',
  },
  asian_paints: {
    name: 'Asian Paints',
    tagline: 'Ghar ki paints — Asian Paints waale',
    emoji: '🎨',
    start: 2015,
    startAmount: 1000,
    endAmount: 3800,
    growth: '280%',
    note: '10 saal, koi drama nahi — sirf compounding.',
  },
  itc: {
    name: 'ITC',
    tagline: 'Wills cigarettes + Sunfeast biscuits + Classmate copies',
    emoji: '🍪',
    start: 2015,
    startAmount: 1000,
    endAmount: 2600,
    growth: '160%',
    note: 'Slower growth but consistent dividends.',
  },
}

function Step3({ dispatch }) {
  const [chosen, setChosen] = useState(null)

  const sim = chosen ? COMPANY_SIMULATIONS[chosen] : null

  return (
    <StepWrapper step={3}>
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex-1 flex flex-col justify-center gap-4">
          <div className="text-center">
            <div className="text-4xl mb-2">💰</div>
            <p className="text-navy font-black text-xl mb-1">₹1,000 se kya hota?</p>
            <p className="text-gray-500 text-sm">Ek company chuno — 2015 mein invest kiye hote toh?</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {Object.entries(COMPANY_SIMULATIONS).map(([key, c]) => (
              <button
                key={key}
                onClick={() => setChosen(key)}
                className={`p-3 rounded-xl border-2 text-center transition-all active:scale-95
                  ${chosen === key ? 'border-navy bg-navy/5' : 'border-gray-200 bg-white'}`}
              >
                <div className="text-2xl mb-1">{c.emoji}</div>
                <p className="text-xs font-semibold text-navy leading-tight">{c.tagline.split(' ')[0]}</p>
              </button>
            ))}
          </div>

          {sim && (
            <div className="bg-navy rounded-2xl p-5 animate-slideUp text-center">
              <p className="text-white/60 text-xs mb-1">
                {sim.emoji} {sim.name}
              </p>
              <div className="flex justify-center items-center gap-4 my-3">
                <div>
                  <p className="text-white/60 text-xs">2015 mein</p>
                  <p className="text-white font-black text-2xl">₹1,000</p>
                </div>
                <div className="text-saffron text-2xl">→</div>
                <div>
                  <p className="text-white/60 text-xs">Aaj</p>
                  <p className="text-saffron font-black text-3xl">₹{sim.endAmount.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <p className="text-green-400 text-sm font-bold">{sim.growth} growth</p>
              <p className="text-white/60 text-xs mt-2 italic">"{sim.note}"</p>
            </div>
          )}
        </div>

        {sim && (
          <BigButton onClick={() => dispatch({ type: 'NEXT' })}>
            Interesting hai → Aage chalte hain
          </BigButton>
        )}
        {!sim && <div className="h-14" />}
      </div>
    </StepWrapper>
  )
}

// ─── Step 4: Risk Reality Check ───────────────────────────────────────────────
const RISK_OPTIONS = [
  {
    id: 'low',
    label: '😰 Neend nahi aayegi',
    sub: 'Paise ka sochke anxiety hogi',
    response: 'Sahi jawab diya. Iska matlab hai tu abhi ₹1,000 ke liye ready nahi — yeh bilkul theek hai. Pahle ₹10 se shuruaat karte hain.',
    next: 'Chalo ₹10 waali cheez dekhte hain',
  },
  {
    id: 'medium',
    label: '😐 Thoda bura lagega, par theek hai',
    sub: 'Handle kar lenge',
    response: 'Perfect starting point. ₹700 dekhna uncomfortable hoga — par woh temporary hai. Long-term mein woh ₹1,500+ ban sakta hai.',
    next: 'Haan, aise soch sakta hoon →',
  },
  {
    id: 'high',
    label: '😎 Koi farak nahi padta',
    sub: 'Money is just a tool',
    response: 'Strong mindset! Lekin ek check: agar yeh ₹1,000 tumhari savings ka significant hissa hai — toh thoda conservative rehna smart hai.',
    next: 'Samajh aaya, chalo aage →',
  },
]

function Step4({ dispatch }) {
  const [selected, setSelected] = useState(null)
  const option = RISK_OPTIONS.find(o => o.id === selected)

  const handleSelect = (id) => {
    setSelected(id)
    dispatch({ type: 'SET_RISK', value: id })
    dispatch({ type: 'ANSWER', key: 'riskTolerance', value: id })
  }

  return (
    <StepWrapper step={4}>
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex-1 flex flex-col justify-center gap-4">
          <div className="text-center">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-navy font-black text-lg">Ek seedha sawaal:</p>
            <p className="text-gray-600 text-sm mt-1 leading-relaxed">
              Agar tune ₹1,000 lagaye aur 6 mahine baad ₹700 ho gaye — toh kya hoga?
            </p>
          </div>

          <div className="space-y-2">
            {RISK_OPTIONS.map((o) => (
              <ChoiceCard
                key={o.id}
                label={o.label}
                sublabel={o.sub}
                onClick={() => handleSelect(o.id)}
                selected={selected === o.id}
              />
            ))}
          </div>

          {option && (
            <div className="bg-navy rounded-2xl p-4 animate-slideUp">
              <p className="text-white/60 text-xs mb-1">✓ Honest jawab</p>
              <p className="text-white text-sm leading-relaxed">{option.response}</p>
            </div>
          )}
        </div>

        {option && (
          <BigButton onClick={() => dispatch({ type: 'NEXT' })}>
            {option.next}
          </BigButton>
        )}
      </div>
    </StepWrapper>
  )
}

// ─── Step 5: Identity Shift ───────────────────────────────────────────────────
function Step5({ dispatch }) {
  const [selected, setSelected] = useState(null)
  const [badgeEarned, setBadgeEarned] = useState(false)

  const handleAnswer = (choice) => {
    if (selected) return
    setSelected(choice)
    setTimeout(() => {
      dispatch({ type: 'EARN_BADGE', badge: { emoji: '🧠', label: 'Analyst Mindset: Unlocked', sub: 'Tune analyst ki tarah socha' } })
      setBadgeEarned(true)
    }, 800)
  }

  const isCorrect = selected === 'up'

  return (
    <StepWrapper step={5}>
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex-1 flex flex-col justify-center gap-4">
          <div className="bg-white rounded-2xl p-4 card-shadow">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🥥</span>
              <p className="text-navy font-bold text-sm">Marico — Parachute coconut oil waale</p>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Company ne kaha: <strong>"Iss saal raw material (copra) costs kam hue, toh hamare margins badhe."</strong>
            </p>
            <p className="text-navy font-bold text-sm mt-3">Iska matlab stock ke liye kya hua hoga?</p>
          </div>

          {!selected && (
            <div className="space-y-2">
              <ChoiceCard label="📈 Badhega — kyunki zyada profit" sublabel="Cost kam, revenue same = better margins" onClick={() => handleAnswer('up')} selected={false} />
              <ChoiceCard label="📉 Girega — kuch toh gadbad hogi" sublabel="Cheap raw material = quality issues?" onClick={() => handleAnswer('down')} selected={false} />
              <ChoiceCard label="🤷 Pata nahi" sublabel="Honestly not sure" onClick={() => handleAnswer('dunno')} selected={false} />
            </div>
          )}

          {selected && (
            <div className={`rounded-2xl p-4 animate-slideUp ${isCorrect ? 'bg-green-50 border-2 border-green-300' : 'bg-amber-50 border-2 border-amber-300'}`}>
              <p className={`font-black text-base mb-2 ${isCorrect ? 'text-green-700' : 'text-amber-700'}`}>
                {isCorrect ? '✅ Sahi socha!' : '💡 Almost — yahan logic yeh hai:'}
              </p>
              <p className={`text-sm leading-relaxed ${isCorrect ? 'text-green-600' : 'text-amber-600'}`}>
                Cost down + revenue same = <strong>margin expansion</strong>. Company zyada profitable ho gayi. Aise socha — yahi analysts karte hain.
              </p>
            </div>
          )}

          {badgeEarned && (
            <div className="animate-slideUp">
              <BadgePop badge={{ emoji: '🧠', label: 'Analyst Mindset: Unlocked', sub: 'Tune analyst ki tarah socha' }} />
              <p className="text-center text-gray-500 text-xs mt-2">
                Analysts ₹2 lakh/month kamate hain yahi karne ke liye.
              </p>
            </div>
          )}
        </div>

        {badgeEarned && (
          <BigButton onClick={() => dispatch({ type: 'NEXT' })}>
            Badiya! Aage chalte hain →
          </BigButton>
        )}
      </div>
    </StepWrapper>
  )
}

// ─── Step 6: Simulated Portfolio ──────────────────────────────────────────────
const PORTFOLIO_COMPANIES = [
  {
    id: 'titan',
    name: 'Titan',
    emoji: '⌚',
    desc: 'Luxury watches + Tanishq jewelry. India ki shaadi season ka fayda uthata hai.',
    risk: 'High valuation — premium segment.',
    news: 'Q3 FY25: Revenue 10% YoY up. Tanishq gaining rural market share.',
  },
  {
    id: 'irctc',
    name: 'IRCTC',
    emoji: '🚂',
    desc: 'Indian Railways ka monopoly ticketing. Govt-backed business.',
    risk: 'Policy risk — govt can change fee structure.',
    news: 'FY25 passenger traffic at all-time high. Tourism packages strong.',
  },
  {
    id: 'wipro',
    name: 'Wipro',
    emoji: '💻',
    desc: 'IT services — codes karta hai US/Europe ki companies ke liye.',
    risk: 'AI disruption + US spending slowdown.',
    news: 'FY25 Q3: Revenue guidance maintained. AI practice growing.',
  },
]

function Step6({ dispatch, state }) {
  const [alloc, setAlloc] = useState({ titan: 3334, irctc: 3333, wipro: 3333 })
  const [locked, setLocked] = useState(false)
  const total = 10000

  const handleSlider = (id, value) => {
    const val = parseInt(value)
    const others = PORTFOLIO_COMPANIES.filter(c => c.id !== id)
    const remaining = total - val
    const split = Math.floor(remaining / 2)
    setAlloc({ ...alloc, [id]: val, [others[0].id]: split, [others[1].id]: remaining - split })
  }

  const handleLock = () => {
    setLocked(true)
    dispatch({ type: 'SET_PORTFOLIO', portfolio: alloc })
    dispatch({ type: 'ANSWER', key: 'portfolio', value: alloc })
  }

  const topPick = PORTFOLIO_COMPANIES.reduce((a, b) => alloc[a.id] > alloc[b.id] ? a : b)

  return (
    <StepWrapper step={6}>
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex-1 flex flex-col gap-4">
          <div className="text-center">
            <div className="text-4xl mb-1">🎮</div>
            <p className="text-navy font-black text-lg">Virtual ₹10,000</p>
            <p className="text-gray-500 text-xs mt-1">Teen companies mein baanto — koi risk nahi, sirf practice</p>
          </div>

          {PORTFOLIO_COMPANIES.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl p-4 card-shadow">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{c.emoji}</span>
                <div className="flex-1">
                  <p className="text-navy font-bold text-sm">{c.name}</p>
                  <p className="text-gray-500 text-xs">{c.desc}</p>
                </div>
                <span className="text-navy font-black text-base">
                  ₹{alloc[c.id].toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-xs text-amber-600 mb-2">⚠️ {c.risk}</p>
              <p className="text-xs text-gray-400 mb-3 italic">📰 {c.news}</p>
              <input
                type="range"
                min="0"
                max="10000"
                step="500"
                value={alloc[c.id]}
                onChange={(e) => !locked && handleSlider(c.id, e.target.value)}
                disabled={locked}
                className="w-full accent-navy"
              />
            </div>
          ))}

          {/* Total checker */}
          <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
            <span className="text-gray-500 text-sm">Total invested</span>
            <span className={`font-black text-sm ${Object.values(alloc).reduce((a,b) => a+b, 0) === total ? 'text-green-600' : 'text-red-500'}`}>
              ₹{Object.values(alloc).reduce((a,b) => a+b, 0).toLocaleString('en-IN')} / ₹10,000
            </span>
          </div>

          {locked && (
            <div className="bg-navy rounded-2xl p-4 animate-slideUp">
              <p className="text-white text-sm">
                Tu ne ₹{alloc[topPick.id].toLocaleString('en-IN')} {topPick.name} mein lagaye.{' '}
                Smart move agar tu believe karta hai {topPick.desc.split('.')[0].toLowerCase()}.
              </p>
              <p className="text-white/60 text-xs mt-2">
                Virtual portfolio ready! 30 din mein dekhhein kaise perform karta hai.
              </p>
            </div>
          )}
        </div>

        {!locked ? (
          <BigButton onClick={handleLock}>
            🎯 Yeh portfolio lock karo
          </BigButton>
        ) : (
          <BigButton onClick={() => dispatch({ type: 'NEXT' })}>
            Ekdum! Aakhri step →
          </BigButton>
        )}
      </div>
    </StepWrapper>
  )
}

// ─── Step 7: First Real Step ──────────────────────────────────────────────────
function Step7({ dispatch, state }) {
  const navigate = useNavigate()
  const [choice, setChoice] = useState(state.investmentChoice)

  const finalizeChoice = (value) => {
    setChoice(value)
    dispatch({ type: 'ANSWER', key: 'firstDecision', value })
    dispatch({ type: 'MARK_COMPLETE', value })
    trackEvent('onboarding_completed', { choice: value })
  }

  const handleInvest = () => {
    if (choice) return
    finalizeChoice('invest')
    // Deep-link to Groww (safe external URL for index fund)
    window.open('https://groww.in/mutual-funds/category/index-funds', '_blank', 'noopener,noreferrer')
  }

  const handleSkip = () => {
    if (choice) return
    finalizeChoice('skip')
  }

  return (
    <StepWrapper step={7}>
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex-1 flex flex-col justify-center gap-4">
          <div className="text-center">
            <div className="text-5xl mb-3">🏁</div>
            <p className="text-navy font-black text-xl mb-1">Teri virtual portfolio ready hai.</p>
            <p className="text-gray-500 text-sm leading-relaxed">Ek optional step aur hai.</p>
          </div>

          <div className="bg-saffron-light border-2 border-saffron/20 rounded-2xl p-4">
            <p className="text-navy font-bold text-sm mb-2">₹10 mein real investing</p>
            <p className="text-gray-700 text-sm leading-relaxed">
              ₹10 se ek Nifty 50 index fund khareedna possible hai. Yeh basket hai India ki 50 sabse badi companies ka — TCS, Reliance, HDFC Bank sab ek saath.
            </p>
            <p className="text-gray-500 text-xs mt-2 italic">
              ₹10 = ek chai ki chai ka risk. Par pehli baar tera paisa real market mein hoga.
            </p>
          </div>

          {!choice && (
            <div className="space-y-3">
              <button
                onClick={handleInvest}
                className="w-full py-4 bg-navy text-white font-bold rounded-2xl active:scale-95 transition-transform"
              >
                💰 ₹10 se shuru karo — UPI se
              </button>
              <button
                onClick={handleSkip}
                className="w-full py-3 text-gray-500 font-semibold text-sm active:scale-95 transition-transform"
              >
                Abhi nahi — virtual portfolio continue karo
              </button>
            </div>
          )}

          {choice === 'invest' && (
            <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-4 animate-slideUp">
              <p className="text-green-700 font-black text-base mb-1">🎉 Historic moment!</p>
              <p className="text-green-600 text-sm leading-relaxed">
                Tune aaj woh kiya jo 90% log nahi karte — tune socha, samjha, phir decide kiya. <strong>Wahi investing hai.</strong>
              </p>
            </div>
          )}

          {choice === 'skip' && (
            <div className="bg-navy rounded-2xl p-4 animate-slideUp">
              <p className="text-white font-bold text-sm mb-1">Bilkul theek hai. 👍</p>
              <p className="text-white/80 text-sm leading-relaxed">
                Virtual portfolio ready hai. Dekho kaise perform karta hai — 30 din mein real data dikhega.
              </p>
              <p className="text-saffron text-xs mt-2">
                Tune aaj analyst ki tarah socha. Woh skill real hai.
              </p>
            </div>
          )}
        </div>

        {choice && (
          <BigButton onClick={() => navigate('/')} variant="secondary">
            🏠 Home par jao
          </BigButton>
        )}
      </div>
    </StepWrapper>
  )
}

// ─── Main Onboarding shell ────────────────────────────────────────────────────
const STEP_LABELS = [
  '',
  'Darna Theek Hai',
  'Satta vs Investing',
  '₹1,000 se kya hota?',
  'Tera risk level',
  'Analyst Mindset',
  'Virtual Portfolio',
  'Pehla Qadam',
]

export default function Onboarding() {
  const location = useLocation()
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(
    reducer,
    null,
    () => (location.state?.restart ? INITIAL_STATE : loadOnboardingState()),
  )

  useEffect(() => {
    writeStoredJSON(STORAGE_KEYS.onboarding, state)
  }, [state])

  useEffect(() => {
    trackEvent('onboarding_step_viewed', { step: state.step })
  }, [state.step])

  const stepComponents = [
    null,
    <Step1 dispatch={dispatch} />,
    <Step2 dispatch={dispatch} />,
    <Step3 dispatch={dispatch} />,
    <Step4 dispatch={dispatch} />,
    <Step5 dispatch={dispatch} state={state} />,
    <Step6 dispatch={dispatch} state={state} />,
    <Step7 dispatch={dispatch} state={state} />,
  ]

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-navy px-4 pt-12 pb-4 flex-shrink-0">
        <div className="mx-auto mb-3 flex max-w-4xl items-center gap-3">
          {state.step > 1 ? (
            <button
              onClick={() => navigate(-1)}
              className="text-white/60 text-2xl"
            >
              ←
            </button>
          ) : (
            <button onClick={() => navigate('/')} className="text-white/60 text-2xl">←</button>
          )}
          <div className="flex-1">
            <p className="text-white/50 text-xs">Step {state.step} of 7</p>
            <h1 className="text-white font-black text-lg leading-tight">
              {STEP_LABELS[state.step]}
            </h1>
          </div>
          {state.badges.length > 0 && (
            <div className="flex gap-1">
              {state.badges.map((b, i) => (
                <span key={i} className="text-xl" title={b.label}>{b.emoji}</span>
              ))}
            </div>
          )}
        </div>
        <div className="mx-auto max-w-4xl">
          <ProgressBar current={state.step} total={7} />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-4xl flex-1">{stepComponents[state.step]}</div>
    </div>
  )
}
