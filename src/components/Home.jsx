import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAnalyticsSummary, trackEvent } from '../lib/analytics'
import { getDecodeHistory, getFeatureStats, readStoredJSON, STORAGE_KEYS } from '../lib/persistence'
import { buildDecodeTipLink, openWhatsAppShare } from '../lib/share'

const FEATURES = [
  {
    id: 'tip-trial',
    route: '/tip-trial',
    emoji: '⚖️',
    title: 'Tip Trial',
    subtitle: '60-sec courtroom for any tip',
    description: 'Tip ko blindly follow mat karo. 3 sawaalon mein cross-examine karo aur decide karo: ignore, watchlist, ya investigate.',
    tag: 'Tip chaser format',
    tagColor: 'bg-emerald-100 text-emerald-700',
    accent: 'bg-emerald-50 border-emerald-200',
  },
  {
    id: 'market-replay',
    route: '/market-replay',
    emoji: '🕵️',
    title: 'Market Replay Stories',
    subtitle: '90-sec what-actually-happened',
    description: 'Real Indian market events ko mystery game ki tarah decode karo. Guess karo, reveal dekho, aur next tip ke liye ek transfer rule le jao.',
    tag: 'Story mode',
    tagColor: 'bg-indigo-100 text-indigo-700',
    accent: 'bg-indigo-50 border-indigo-200',
  },
  {
    id: 'onboarding',
    route: '/onboarding',
    emoji: '🚶',
    title: 'Fear To First Step',
    subtitle: 'Fear se pehle kadam tak',
    description: 'Persona A ke liye 7-step psychological journey. Lecture nahi, confidence loop.',
    tag: 'Satta skeptic',
    tagColor: 'bg-blue-100 text-blue-700',
    accent: 'bg-blue-50 border-blue-200',
  },
  {
    id: 'sach-ya-jhooth',
    route: '/sach-ya-jhooth',
    emoji: '🃏',
    title: 'Sach Ya Jhooth?',
    subtitle: 'Swipe se myths pakdo',
    description: 'India ke sabse common stock market myths. Swipe karo aur behavioral traps ko spot karna seekho.',
    tag: 'Myth game',
    tagColor: 'bg-orange-100 text-orange-700',
    accent: 'bg-orange-50 border-orange-200',
  },
  {
    id: 'yeh-stock',
    route: '/yeh-stock',
    emoji: '💬',
    title: 'Yeh Stock Kya Karta Hai?',
    subtitle: 'Company ko dost ki tarah samjho',
    description: 'Zomato, Paytm, IRCTC ya koi bhi naam likho. Plain Hinglish mein company story milti hai.',
    tag: 'Company decode',
    tagColor: 'bg-green-100 text-green-700',
    accent: 'bg-green-50 border-green-200',
  },
]

const TRIGGERS = [
  {
    id: 'whatsapp-tip',
    title: 'WhatsApp par tip aayi',
    subtitle: '2 min mein decide karo: investigate, watchlist, ya ignore.',
    route: '/decode-tip',
    accent: 'bg-red-50 border-red-200',
    emoji: '💬',
  },
  {
    id: 'fear',
    title: 'Market satta lag raha hai',
    subtitle: 'Fear ko break karo. Lecture ke bina pehla confident step lo.',
    route: '/onboarding',
    accent: 'bg-blue-50 border-blue-200',
    emoji: '🛟',
  },
  {
    id: 'move',
    title: 'Yeh stock aise kyun hila?',
    subtitle: 'Real market stories ko 90 sec mein decode karo.',
    route: '/market-replay',
    accent: 'bg-indigo-50 border-indigo-200',
    emoji: '🕵️',
  },
]

function loadDashboard() {
  return {
    summary: getAnalyticsSummary(),
    decodeHistory: getDecodeHistory(),
    stats: getFeatureStats(),
    onboarding: readStoredJSON(STORAGE_KEYS.onboarding, null),
  }
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-4">
      {eyebrow && <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-saffron">{eyebrow}</p>}
      <h2 className="mt-2 text-2xl font-black text-navy sm:text-3xl">{title}</h2>
      {description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">{description}</p>}
    </div>
  )
}

function MetricCard({ label, value, tone = 'default' }) {
  const tones = {
    default: 'bg-white border-gray-200 text-navy',
    warm: 'bg-saffron-light border-saffron/30 text-navy',
    cool: 'bg-navy text-white border-navy',
  }

  return (
    <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-2 text-3xl font-black leading-none">{value}</p>
    </div>
  )
}

function FeatureCard({ feature, onPress }) {
  return (
    <button
      onClick={() => onPress(feature)}
      className={`w-full rounded-[24px] border-2 p-5 text-left transition-transform active:scale-[0.99] ${feature.accent}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{feature.emoji}</span>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${feature.tagColor}`}>
            {feature.tag}
          </span>
        </div>
        <span className="text-lg text-gray-400">→</span>
      </div>
      <h3 className="mt-5 text-lg font-black text-navy">{feature.title}</h3>
      <p className="mt-1 text-sm font-medium text-gray-500">{feature.subtitle}</p>
      <p className="mt-3 text-sm leading-relaxed text-gray-700">{feature.description}</p>
    </button>
  )
}

function ResumeCard({ onboarding, onContinue }) {
  if (!onboarding) {
    return (
      <div className="rounded-[24px] border border-blue-200 bg-blue-50 p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-700">Fear to first step</p>
        <p className="mt-3 text-xl font-black text-navy">Abhi tak start nahi kiya</p>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Agar market abhi bhi satta lagta hai, yeh 7-step journey tumhare liye hai. End goal: ya toh simulated portfolio, ya 10 rupees micro-step.
        </p>
        <button onClick={() => onContinue(false)} className="mt-4 rounded-xl bg-navy px-4 py-3 text-sm font-bold text-white">
          Journey start karo
        </button>
      </div>
    )
  }

  const completed = Boolean(onboarding.completedAt)

  return (
    <div className={`rounded-[24px] border p-5 ${completed ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}`}>
      <p className={`text-[11px] font-bold uppercase tracking-[0.24em] ${completed ? 'text-green-700' : 'text-blue-700'}`}>
        {completed ? 'Journey complete' : 'Resume journey'}
      </p>
      <p className="mt-3 text-xl font-black text-navy">
        {completed ? 'Analyst mindset unlocked' : `Step ${onboarding.step || 1} of 7 ready hai`}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">
        {completed
          ? 'Tum fear loop se nikal chuke ho. Ab momentum ko tip testing aur market replay se strong karo.'
          : 'Journey wahi se resume hogi jahan tumne stop kiya tha. Sirf ek chhota step aur.'}
      </p>
      <button onClick={() => onContinue(completed)} className="mt-4 rounded-xl bg-navy px-4 py-3 text-sm font-bold text-white">
        {completed ? 'Journey dobara chalao' : 'Continue onboarding'}
      </button>
    </div>
  )
}

function RecentTipCard({ item, onOpen }) {
  if (!item) {
    return (
      <div className="rounded-[24px] border border-gray-200 bg-white p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">Recent decode</p>
        <p className="mt-3 text-lg font-black text-navy">Abhi tak koi tip decode nahi hui</p>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Next WhatsApp forward aate hi is box ko use karo. Product ka sabse important habit loop yahi hai.
        </p>
      </div>
    )
  }

  return (
    <button onClick={() => onOpen(item)} className="w-full rounded-[24px] border border-gray-200 bg-white p-5 text-left">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">Recent decode</p>
      <p className="mt-3 line-clamp-2 text-lg font-black text-navy">{item.tipText}</p>
      <p className="mt-2 text-sm text-gray-600">Verdict: <span className="font-bold text-navy">{item.decisionLabel}</span></p>
      <p className="mt-1 text-xs text-gray-500">Source: {item.sourceLabel}</p>
    </button>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [tipDraft, setTipDraft] = useState('')
  const [dashboard, setDashboard] = useState(loadDashboard)

  useEffect(() => {
    const refresh = () => setDashboard(loadDashboard())
    window.addEventListener('dby:storage', refresh)
    window.addEventListener('dby:analytics', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('dby:storage', refresh)
      window.removeEventListener('dby:analytics', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const quickDecodeTip = () => {
    trackEvent('quick_decode_started', { hasPrefill: Boolean(tipDraft.trim()) })
    if (tipDraft.trim()) {
      navigate('/decode-tip', { state: { tip: tipDraft, source: 'whatsapp' } })
      return
    }

    navigate('/decode-tip')
  }

  const jumpFromTrigger = (trigger) => {
    trackEvent('home_trigger_clicked', { trigger: trigger.id, route: trigger.route })
    navigate(trigger.route)
  }

  const openFeature = (feature) => {
    trackEvent('feature_clicked', { feature: feature.id, route: feature.route })
    navigate(feature.route)
  }

  const handleWhatsAppShare = () => {
    const link = buildDecodeTipLink({ tip: tipDraft.trim(), source: 'whatsapp' })
    const text = tipDraft.trim()
      ? `Mujhe yeh stock tip mili. Blindly follow mat karo. Pehle yahan decode karo:\n${link}`
      : `Stock tip blindly mat follow karo. Pehle is link par decode karo:\n${buildDecodeTipLink({ source: 'whatsapp' })}`

    trackEvent('home_whatsapp_shared', { hasPrefill: Boolean(tipDraft.trim()) })
    openWhatsAppShare(text)
  }

  const recentTip = dashboard.decodeHistory[0]
  const summary = dashboard.summary
  const mythBest = dashboard.stats.sachYaJhooth?.bestScore || 0

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <section className="border-b border-stone-200 bg-navy px-5 pb-10 pt-14 text-white sm:px-8 lg:px-10 lg:pt-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-saffron">Pre-Varsity layer</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
              Stock market ko boring class nahi, decision game ki tarah samjho.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              Yeh Varsity ka replacement nahi hai. Yeh woh layer hai jo user ko tip, fear aur FOMO ke moment par intercept karti hai.
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-white/70">
              <span className="rounded-full border border-white/15 px-3 py-1">WhatsApp-first</span>
              <span className="rounded-full border border-white/15 px-3 py-1">Hinglish copy</span>
              <span className="rounded-full border border-white/15 px-3 py-1">2-minute loops</span>
              <span className="rounded-full border border-white/15 px-3 py-1">No syllabus mode</span>
            </div>

            <div className="mt-8 rounded-[28px] border border-white/10 bg-white/10 p-4 backdrop-blur-sm sm:p-5">
              <p className="text-sm font-bold">Tip mili? Yahin se shuru karo.</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={tipDraft}
                  onChange={(event) => setTipDraft(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && quickDecodeTip()}
                  placeholder='Example: "Paytm 3x hoga"'
                  className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/90 px-4 py-3 text-sm text-navy outline-none placeholder:text-gray-400"
                />
                <div className="grid grid-cols-2 gap-2 sm:flex sm:w-auto sm:shrink-0">
                  <button onClick={quickDecodeTip} className="rounded-2xl bg-saffron px-4 py-3 text-sm font-bold text-white">
                    Decode now
                  </button>
                  <button onClick={handleWhatsAppShare} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white">
                    WhatsApp
                  </button>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-white/60">
                Deep link generate hota hai, taaki WhatsApp se aaya user directly prefilled Decode My Tip page par land kare.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
            <MetricCard label="Tips decoded" value={summary.tipsDecoded} tone="cool" />
            <MetricCard label="Journeys finished" value={summary.onboardingCompleted} tone="warm" />
            <MetricCard label="Stories solved" value={summary.replayRunsCompleted} />
            <MetricCard label="Best myth score" value={mythBest} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-10">
        <div>
          <SectionHeading
            eyebrow="Intercept triggers"
            title="User ka actual moment kya tha?"
            description="Product yahin se start hota hai. Pahle trigger, baad mein learning. Dream11 aur ShareChat ki tarah entry behavior-led honi chahiye, syllabus-led nahi."
          />
          <div className="grid gap-3 md:grid-cols-3">
            {TRIGGERS.map((trigger) => (
              <button
                key={trigger.id}
                onClick={() => jumpFromTrigger(trigger)}
                className={`rounded-[24px] border-2 p-5 text-left transition-transform active:scale-[0.99] ${trigger.accent}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-3xl">{trigger.emoji}</span>
                  <span className="text-lg text-gray-400">→</span>
                </div>
                <p className="mt-4 text-lg font-black text-navy">{trigger.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{trigger.subtitle}</p>
              </button>
            ))}
          </div>

          <SectionHeading
            eyebrow="Core formats"
            title="Entertainment-first learning modules"
            description="Har format ka first aha moment 90 seconds ke andar aata hai. Jo user voluntarily Varsity nahi kholta, woh yeh khol sakta hai."
          />
          <div className="grid gap-4 xl:grid-cols-2">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} onPress={openFeature} />
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <ResumeCard
            onboarding={dashboard.onboarding}
            onContinue={(restart) => navigate('/onboarding', restart ? { state: { restart: true } } : undefined)}
          />
          <RecentTipCard
            item={recentTip}
            onOpen={(item) => navigate('/decode-tip', { state: { tip: item.tipText, source: item.sourceId } })}
          />

          <div className="rounded-[24px] border border-gray-200 bg-white p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">This device</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                <span className="text-sm text-gray-600">Tip trials completed</span>
                <span className="text-lg font-black text-navy">{summary.tipTrialsCompleted}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                <span className="text-sm text-gray-600">Myth rounds played</span>
                <span className="text-lg font-black text-navy">{summary.mythRoundsCompleted}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                <span className="text-sm text-gray-600">Companies explored</span>
                <span className="text-lg font-black text-navy">{summary.companiesSearched}</span>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-gray-200 bg-white p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">Share loop</p>
            <p className="mt-3 text-xl font-black text-navy">WhatsApp se user lao, article se nahi.</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Forwardable behavior is the acquisition engine. Har shared link user ko directly Decode My Tip par utaarta hai.
            </p>
            <button onClick={handleWhatsAppShare} className="mt-4 w-full rounded-xl bg-green-500 px-4 py-3 text-sm font-bold text-white">
              Share product on WhatsApp
            </button>
          </div>
        </aside>
      </section>

      <footer className="border-t border-stone-200 bg-white px-5 py-6 text-center sm:px-8 lg:px-10">
        <p className="text-xs text-gray-500">Educational purpose only. SEBI-registered investment advice nahi hai.</p>
      </footer>
    </div>
  )
}