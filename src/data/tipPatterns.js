// Tip pattern analysis engine — client-side, no API needed
// Analyzes user-submitted stock tips and produces a structured verdict

const KNOWN_STOCKS = {
  paytm: {
    name: 'Paytm',
    fullName: 'One97 Communications',
    ticker: 'PAYTM',
    currentPrice: 370,
    allTimeHigh: 1955,
    ipoPrice: 2150,
    maxSixMonthGain: 85,   // historical max 6-month gain %
    maxOneYearGain: 120,
    avgVolatility: 'high',
    recentStory: 'RBI ne Jan 2024 mein Paytm Payments Bank license cancel kiya. Tab se company restructure kar rahi hai. Q3 FY25 mein pehli baar operating profit positive hua.',
    legitimateBull: 'Financial services (loans, insurance) mein growth + Payments Bank issue resolve hone par recovery possible.',
    redFlags: ['Regulatory history weak hai', 'UPI market share sirf ~9% hai', 'Profitability abhi bhi fragile'],
  },
  zomato: {
    name: 'Zomato',
    fullName: 'Zomato Ltd',
    ticker: 'ZOMATO',
    currentPrice: 238,
    allTimeHigh: 169,
    ipoPrice: 76,
    maxSixMonthGain: 95,
    maxOneYearGain: 180,
    avgVolatility: 'high',
    recentStory: 'FY24 mein ₹3,288 crore profit — pehla profitable year. Blinkit grocery delivery segment ne food business ko overtake kiya.',
    legitimateBull: 'India mein food delivery + quick commerce market growing rapidly. Duopoly market (Zomato + Swiggy).',
    redFlags: ['High valuation (P/E >300)', 'Competition from Swiggy Instamart', 'Profitability fragile'],
  },
  irctc: {
    name: 'IRCTC',
    fullName: 'Indian Railway Catering and Tourism Corporation',
    ticker: 'IRCTC',
    currentPrice: 855,
    allTimeHigh: 1279,
    ipoPrice: 320,
    maxSixMonthGain: 200,
    maxOneYearGain: 450,
    avgVolatility: 'medium',
    recentStory: 'Government ka monopoly in online railway ticketing. Consistent profit grower. Railway passenger traffic recovering strongly post-COVID.',
    legitimateBull: 'Monopoly business + India rail travel growth + tourism recovery.',
    redFlags: ['Policy risk (govt can change fee structure anytime)', 'High valuation for a PSU', 'Growth rate slowing'],
  },
  reliance: {
    name: 'Reliance',
    fullName: 'Reliance Industries Ltd',
    ticker: 'RELIANCE',
    currentPrice: 2930,
    allTimeHigh: 3217,
    ipoPrice: null,
    maxSixMonthGain: 40,
    maxOneYearGain: 65,
    avgVolatility: 'low',
    recentStory: 'Jio 5G expansion + Retail consolidation + Green Energy bet ka ₹75,000 crore plan. Mukesh Ambani succession planning visible.',
    legitimateBull: 'Diversified India growth story. Jio + Retail + Green Energy = three large growing businesses.',
    redFlags: ['Size limits growth rate (hard to grow fast when already so big)', 'Green energy execution risk', 'Conglomerate discount'],
  },
  titan: {
    name: 'Titan',
    fullName: 'Titan Company Ltd',
    ticker: 'TITAN',
    currentPrice: 3450,
    allTimeHigh: 3886,
    ipoPrice: null,
    maxSixMonthGain: 55,
    maxOneYearGain: 90,
    avgVolatility: 'medium',
    recentStory: 'India ki organized jewelry market mein dominant player. Wedding season demand strong. Gold import duty cut ne near-term demand boost kiya.',
    legitimateBull: 'Organized jewelry market share gain + Tanishq brand premium + Watches + Eyewear diversification.',
    redFlags: ['Very high valuation (P/E ~90-100)', 'Gold price sensitivity', 'Urban youth shifting away from hair oil (for Titan, wedding dependency)'],
  },
  infosys: {
    name: 'Infosys',
    fullName: 'Infosys Ltd',
    ticker: 'INFY',
    currentPrice: 1590,
    allTimeHigh: 1953,
    ipoPrice: null,
    maxSixMonthGain: 45,
    maxOneYearGain: 80,
    avgVolatility: 'medium',
    recentStory: 'FY25 mein revenue guidance maintained. AI tools integration ongoing. US/Europe IT spending recovery expected.',
    legitimateBull: 'AI services demand growing. Cost arbitrage India-US still strong. Strong balance sheet.',
    redFlags: ['AI disruption risk to business model', 'US recession impact on IT budgets', 'Slow growth phase'],
  },
  adani: {
    name: 'Adani',
    fullName: 'Adani Group (multiple listed companies)',
    ticker: 'ADANIENT / ADANIPORTS / ADANIGREEN etc.',
    currentPrice: null,
    allTimeHigh: null,
    ipoPrice: null,
    maxSixMonthGain: 200,
    maxOneYearGain: 500,
    avgVolatility: 'very high',
    recentStory: 'Hindenburg Research report Jan 2023 ne stocks crash karwaye. 2024 mein partial recovery. Bribery allegations FY25 mein uthe.',
    legitimateBull: 'India infrastructure growth story. Ports, airports, power generation real assets.',
    redFlags: ['Leverage (debt) bahut zyada hai across group companies', 'Regulatory/legal risk', 'Governance concerns raised multiple times', 'Related party transactions complex'],
  },
}

// Keywords that signal hype/pump
const HYPE_KEYWORDS = [
  'pakka', 'pakki', 'guaranteed', 'confirm', 'confirmed', '100%', 'definitely',
  'zaroor', 'sure', 'badhega', 'chalega', 'next big', 'multibagger', 'rocket',
  '🚀', '💰', '🔥', 'inside info', 'tip', 'sources mein hai', 'heard',
  'bhaiya ne bataya', 'uncle ne bataya', 'xyz ne bataya', 'finfluencer',
]

// Keywords that signal reasonable due-diligence
const DUE_DILIGENCE_KEYWORDS = [
  'research', 'results', 'earnings', 'revenue', 'profit', 'loss',
  'management', 'sector', 'fundamentals', 'pe ratio', 'valuation',
]

export function parseTip(tipText) {
  const lower = tipText.toLowerCase()

  // Extract company
  let matchedStock = null
  for (const [key, stock] of Object.entries(KNOWN_STOCKS)) {
    if (lower.includes(key) || lower.includes(stock.ticker.toLowerCase()) || lower.includes(stock.name.toLowerCase())) {
      matchedStock = { key, ...stock }
      break
    }
  }

  // Extract multiplier claim (e.g., "2x", "3x", "10x")
  const multiplierMatch = tipText.match(/(\d+\.?\d*)\s*x/i)
  const multiplier = multiplierMatch ? parseFloat(multiplierMatch[1]) : null

  // Extract percentage claim (e.g., "50%", "200%", "+100%")
  const percentMatch = tipText.match(/[+]?\s*(\d+)\s*%/)
  const percent = percentMatch ? parseInt(percentMatch[1]) : null

  // Extract timeframe (months)
  const monthMatch = tipText.match(/(\d+)\s*(month|mahine|mahina)/i)
  const weekMatch = tipText.match(/(\d+)\s*(week|hafta)/i)
  const yearMatch = tipText.match(/(\d+)\s*(year|saal)/i)
  const dayMatch = tipText.match(/(\d+)\s*(day|din)/i)

  let timeframeDays = null
  if (monthMatch) timeframeDays = parseInt(monthMatch[1]) * 30
  else if (weekMatch) timeframeDays = parseInt(weekMatch[1]) * 7
  else if (yearMatch) timeframeDays = parseInt(yearMatch[1]) * 365
  else if (dayMatch) timeframeDays = parseInt(dayMatch[1])
  else if (lower.includes('diwali') || lower.includes('budget')) timeframeDays = 90
  else if (lower.includes('next year') || lower.includes('agle saal')) timeframeDays = 365

  // Normalize claim to percentage gain
  let claimedGainPct = null
  if (multiplier) claimedGainPct = (multiplier - 1) * 100
  else if (percent) claimedGainPct = percent

  // Hype score calculation (0–100)
  let hyp = 30 // base hype
  const hyp_reasons = []
  const caution_flags = []

  // Factor 1: magnitude vs timeframe
  if (claimedGainPct && timeframeDays) {
    const annualized = (claimedGainPct / timeframeDays) * 365
    if (annualized > 500) { hyp += 30; hyp_reasons.push(`${claimedGainPct}% in ${Math.round(timeframeDays/30)} months — historical mein almost impossible`) }
    else if (annualized > 200) { hyp += 20; hyp_reasons.push(`${claimedGainPct}% in ${Math.round(timeframeDays/30)} months — bahut aggressive claim`) }
    else if (annualized > 100) { hyp += 10; hyp_reasons.push(`${claimedGainPct}% — high but not impossible for this stock`) }
  } else if (claimedGainPct && !timeframeDays) {
    if (claimedGainPct >= 200) { hyp += 25; hyp_reasons.push('3x+ claim bina timeframe ke — classic hype pattern') }
    else if (claimedGainPct >= 100) { hyp += 15; hyp_reasons.push('2x claim — timeframe jaane bina evaluate karna mushkil') }
  } else if (multiplier >= 5) {
    hyp += 30; hyp_reasons.push(`${multiplier}x claim — extreme, almost never happens in legitimate stocks`)
  }

  // Factor 2: hype language
  const foundHypeWords = HYPE_KEYWORDS.filter(kw => lower.includes(kw))
  if (foundHypeWords.length > 0) {
    hyp += foundHypeWords.length * 5
    caution_flags.push(`Hype language detected: "${foundHypeWords.slice(0, 2).join('", "')}"`)
  }

  // Factor 3: no due diligence language = more hype
  const foundDDWords = DUE_DILIGENCE_KEYWORDS.filter(kw => lower.includes(kw))
  if (foundDDWords.length === 0) {
    hyp += 10
    caution_flags.push('Koi bhi fundamental reason mention nahi kiya gaya')
  }

  // Factor 4: stock-specific history
  if (matchedStock) {
    if (claimedGainPct && matchedStock.maxSixMonthGain && timeframeDays <= 180) {
      if (claimedGainPct > matchedStock.maxSixMonthGain) {
        hyp += 15
        hyp_reasons.push(`${matchedStock.name} ne historically kabhi ${Math.round(claimedGainPct)}% 6 mahine mein nahi kiya`)
      }
    }
    if (matchedStock.avgVolatility === 'very high') {
      caution_flags.push(`${matchedStock.name} mein controversy/risk history significant hai`)
    }
    if (matchedStock.key === 'adani') {
      hyp += 15
      caution_flags.push('Adani group stocks mein governance concerns documented hain')
    }
  }

  hyp = Math.min(hyp, 100)

  // Determine verdict
  let verdict, verdictColor, verdictEmoji, verdictAction
  if (hyp >= 80) {
    verdict = 'PUMP ALERT'
    verdictColor = 'red'
    verdictEmoji = '🚨'
    verdictAction = 'Yeh wala bhool jao. Pattern classic pump-and-dump jaisa hai.'
  } else if (hyp >= 65) {
    verdict = 'HIGH HYPE'
    verdictColor = 'orange'
    verdictEmoji = '🔥🔥🔥🔥'
    verdictAction = 'Company real ho sakti hai — claim fake lagta hai. Pehle khud check karo.'
  } else if (hyp >= 45) {
    verdict = 'INVESTIGATE'
    verdictColor = 'amber'
    verdictEmoji = '🔍'
    verdictAction = '3 sawaal hain — answer dhundo pehle. Tab decide karo.'
  } else if (hyp >= 25) {
    verdict = 'POSSIBLE'
    verdictColor = 'green'
    verdictEmoji = '🟢'
    verdictAction = 'Logic hai. Par abhi bhi khud verify karo before acting.'
  } else {
    verdict = 'CONSERVATIVE CLAIM'
    verdictColor = 'blue'
    verdictEmoji = '🔵'
    verdictAction = 'Yeh claim surprisingly conservative hai. FUD (Fear, Uncertainty, Doubt) pattern check karo.'
  }

  // Build the three questions
  const questions = buildQuestions(matchedStock, claimedGainPct, timeframeDays, hyp)

  return {
    company: matchedStock,
    claimedGainPct,
    multiplier,
    timeframeDays,
    hyp,
    hyp_reasons,
    caution_flags,
    verdict,
    verdictColor,
    verdictEmoji,
    verdictAction,
    questions,
  }
}

function buildQuestions(stock, claimedGainPct, timeframeDays, hyp) {
  const q1 = {
    icon: '1️⃣',
    heading: 'YEH CLAIM REALISTIC HAI?',
    answer: stock
      ? `${stock.name} ka historical max ${timeframeDays && timeframeDays <= 180 ? '6-month' : '1-year'} gain ${timeframeDays && timeframeDays <= 180 ? stock.maxSixMonthGain : stock.maxOneYearGain}% raha hai. ${claimedGainPct ? `${Math.round(claimedGainPct)}% ka claim yeh benchmark ${claimedGainPct > (timeframeDays && timeframeDays <= 180 ? stock.maxSixMonthGain : stock.maxOneYearGain) ? 'exceed karta hai' : 'possible range mein hai'}.` : ''}`
      : claimedGainPct
        ? `${Math.round(claimedGainPct)}% gain ka matlab stock ko ${Math.round(claimedGainPct)}% badhna padega. Nifty 50 ka average annual return sirf 13% hai.`
        : 'Koi specific number mention nahi kiya. Bina target ke tip almost meaningless hoti hai.',
    signal: claimedGainPct > 100 ? '⚠️ Mushkil' : claimedGainPct > 50 ? '⚠️ Aggressive' : '✅ Possible range',
  }

  const q2 = {
    icon: '2️⃣',
    heading: 'TIP AAYA KAHAN SE?',
    answer: 'WhatsApp group / finfluencer / "bhaiya"? Jo log apna portfolio publicly nahi dikhate unki tip ka motivation clear nahi hai. SEBI-registered analyst nahi hai toh legally advice nahi de sakte.',
    signal: '⚠️ Source verify karo',
  }

  const q3 = {
    icon: '3️⃣',
    heading: 'COMPANY KI SITUATION KYA HAI ABHI?',
    answer: stock
      ? stock.recentStory
      : 'Company ka naam search karo + "latest news" likhke dekhte hain koi recent earnings ya controversy news aai hai kya.',
    signal: stock ? (stock.redFlags.length > 2 ? '⚠️ Multiple risks hain' : '🔍 Story complex hai') : '🔍 Research zaroori hai',
  }

  return [q1, q2, q3]
}
