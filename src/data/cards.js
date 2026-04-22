// Sach Ya Jhooth — myth card dataset
// answer: 'sach' | 'jhooth' | 'aadha' (half-truth treated as jhooth for swipe)
// correctSwipe: which swipe direction is "more correct"

export const CARDS = [
  {
    id: 1,
    statement: 'SIP karo toh market crash ka koi farak nahi padta',
    category: 'SIP',
    correctSwipe: 'jhooth',
    verdictLabel: 'AADHA SACH ⚠️',
    verdictColor: 'amber',
    explanation:
      'SIP crash se timing risk hatata hai — lekin value recover hone mein 3–5 saal lag sakte hain. March 2020 investors ne full recovery ke liye Dec 2021 tak wait kiya.',
    fact: '📅 March 2020 crash: Nifty 50 ne 38% girne ke baad full recovery mein 20 mahine liye.',
  },
  {
    id: 2,
    statement: 'Blue chip stocks kabhi doobnge nahi — safe hai 100%',
    category: 'Stocks',
    correctSwipe: 'jhooth',
    verdictLabel: 'JHOOTH ❌',
    verdictColor: 'red',
    explanation:
      'Yes Bank, DHFL, Jet Airways — sab ek waqt "blue chip" category mein the. Company fail ho sakti hai. "Safe" relative term hai, guarantee nahi.',
    fact: '📉 Yes Bank 2020: ₹400 se ₹5 tak gira — 98% crash. Blue chip tha, dooba bhi.',
  },
  {
    id: 3,
    statement: 'Sensex oopar gaya toh mera stock bhi badhega',
    category: 'Market',
    correctSwipe: 'jhooth',
    verdictLabel: 'JHOOTH ❌',
    verdictColor: 'red',
    explanation:
      'Sensex sirf 30 companies ka average hai. Tumhara stock alag sector mein ho sakta hai. Jab pharma sector gira tha, IT stocks upar the — same time.',
    fact: '📊 2022 mein Sensex flat raha, lekin midcap stocks average 20% gire.',
  },
  {
    id: 4,
    statement: 'FD se zyada return long term mein stock market nahi deta',
    category: 'Returns',
    correctSwipe: 'jhooth',
    verdictLabel: 'JHOOTH ❌',
    verdictColor: 'red',
    explanation:
      'Nifty 50 ne last 20 saal mein average ~13% CAGR diya. FD ka best rate ~7.5%. Inflation 5–6% hoti hai — FD mein real return 1–2% hi hota hai.',
    fact: '💰 ₹1 lakh FD (2004) → ~₹4.2 lakh (2024). Nifty 50 mein wahi → ~₹13.5 lakh.',
  },
  {
    id: 5,
    statement: 'Options mein stocks se zyada paisa milta hai',
    category: 'Options',
    correctSwipe: 'jhooth',
    verdictLabel: 'SAHI — LEKIN DANGEROUS ⚠️',
    verdictColor: 'amber',
    explanation:
      'Options mein zyada return possible hai — lekin 90% se zyada options buyers lose karte hain expiry par. SEBI report: FY24 mein 93% individual F&O traders net loss mein rahe.',
    fact: '📋 SEBI FY24 data: 93% individual F&O traders ne average ₹1.5 lakh/year lose kiya.',
  },
  {
    id: 6,
    statement: 'Company ka brand famous ho toh uska stock zaroor accha hoga',
    category: 'Stocks',
    correctSwipe: 'jhooth',
    verdictLabel: 'JHOOTH ❌',
    verdictColor: 'red',
    explanation:
      'Valuation alag cheez hai brand se. Paytm ka brand bahut famous tha, but IPO ke baad stock 70% gira pehle 2 saal mein. Brand ≠ profitable business.',
    fact: '📉 Paytm IPO Nov 2021: ₹2,150 par launch. 6 mahine baad: ₹540. Famous brand, painful stock.',
  },
  {
    id: 7,
    statement: 'Dividend milta hai toh company definitely profitable hai',
    category: 'Dividends',
    correctSwipe: 'jhooth',
    verdictLabel: 'AADHA SACH ⚠️',
    verdictColor: 'amber',
    explanation:
      'Companies kabhi kabhi debt lekar bhi dividend deti hain — investors ko khush rakhne ke liye. Dividend consistency zyada important hai ek baar ke dividend se.',
    fact: '🔍 Jab company debt se dividend de, woh future growth sacrifice kar rahi hoti hai.',
  },
  {
    id: 8,
    statement: 'Penny stocks mein hi 10x ka chance hota hai, large cap mein nahi',
    category: 'Stocks',
    correctSwipe: 'jhooth',
    verdictLabel: 'JHOOTH ❌',
    verdictColor: 'red',
    explanation:
      'Titan, Bajaj Finance — dono large-caps ne 10x+ returns diye hain last decade mein. Penny stocks mein mostly manipulation hoti hai, genuine 10x rare hai.',
    fact: '📈 Bajaj Finance 2014–2024: ₹200 → ₹7,000+. Large cap, 35x return.',
  },
  {
    id: 9,
    statement: 'Market crash mein sab investors paisa doob jaate hain',
    category: 'Market',
    correctSwipe: 'jhooth',
    verdictLabel: 'JHOOTH ❌',
    verdictColor: 'red',
    explanation:
      'Long-term investors ke liye crash buying opportunity hai. 2020 crash mein jinhone SIP continue kiya ya extra invest kiya, unhe 2021 mein 80%+ returns mile.',
    fact: '💡 Warren Buffett rule: "Be fearful when others are greedy, greedy when others are fearful."',
  },
  {
    id: 10,
    statement: 'IPO mein invest karo — listing pe profit pakka milta hai',
    category: 'IPO',
    correctSwipe: 'jhooth',
    verdictLabel: 'JHOOTH ❌',
    verdictColor: 'red',
    explanation:
      'FY24 ke top IPOs mein se 40% ne listing day par negative returns diye. Zomato IPO listing: +52%. Paytm IPO listing: -27%. LIC IPO listing: -8%.',
    fact: '📊 2021–2023 Indian IPOs: ~35% ne listing day pe loss diya investors ko.',
  },
  {
    id: 11,
    statement: 'P/E ratio jitna kam, stock utna hi accha hota hai',
    category: 'Fundamentals',
    correctSwipe: 'jhooth',
    verdictLabel: 'AADHA SACH ⚠️',
    verdictColor: 'amber',
    explanation:
      'Low P/E ka matlab low growth expectation bhi ho sakta hai — "value trap." IT stocks ka P/E naturally high hota hai. Sector ke hisaab se compare karo, absolute number se nahi.',
    fact: '🔍 PSU banks ka P/E 5–8 tha years tak — lekin stocks flat rahe. "Cheap" cheap rahne ki wajah se.',
  },
  {
    id: 12,
    statement: 'Finfluencer ke tip par invest karna smart move hai',
    category: 'Tips',
    correctSwipe: 'jhooth',
    verdictLabel: 'JHOOTH ❌',
    verdictColor: 'red',
    explanation:
      'SEBI ne 2024 mein registered finfluencers ke liye strict rules lagaye. Unregistered finfluencers legally advice dene ke authorized NAHI hain. Unka incentive views hai, tumhara profit nahi.',
    fact: '⚖️ SEBI 2024 circular: Unregistered finfluencers stock tips dene par ₹10 lakh tak fine.',
  },
  {
    id: 13,
    statement: 'Demat account kholne ke liye bahut paisa chahiye hota hai',
    category: 'Getting Started',
    correctSwipe: 'jhooth',
    verdictLabel: 'JHOOTH ❌',
    verdictColor: 'red',
    explanation:
      'Zerodha, Groww, Upstox par free mein demat open hota hai. ₹1 se bhi mutual fund SIP shuru ho sakti hai. Entry barrier almost zero hai 2024 mein.',
    fact: '🆓 Groww, Paytm Money par account: ₹0 fee. Minimum SIP: ₹100/month Nifty 50 index fund.',
  },
  {
    id: 14,
    statement: 'Stock market mein sirf short-term trading mein paisa milta hai',
    category: 'Strategy',
    correctSwipe: 'jhooth',
    verdictLabel: 'JHOOTH ❌',
    verdictColor: 'red',
    explanation:
      'SEBI data: Intraday traders mein 80%+ net loss mein hain. Long-term investors (5+ saal) ne consistently positive returns banaye hain Nifty 50 ke through.',
    fact: '📋 SEBI 2023: 80% intraday equity traders lost money. Long-term Nifty 50 investors — near zero failures over 10yr.',
  },
  {
    id: 15,
    statement: '"Agar sab ko ek tip pata ho toh woh kaam nahi karta" — yeh sach hai',
    category: 'Market Logic',
    correctSwipe: 'sach',
    verdictLabel: 'SACH ✅',
    verdictColor: 'green',
    explanation:
      'Yeh market efficiency ka basic principle hai. Agar sab jaante hain stock X badhega, woh pehle hi buy kar chuke hote hain — price already adjusted ho jaata hai. WhatsApp tips isi liye kaam nahi karte.',
    fact: '📚 Efficient Market Hypothesis: Public information pehle se stock price mein "priced in" hoti hai.',
  },
  {
    id: 16,
    statement: 'Bonus shares milne se investor actually richer ho jaata hai',
    category: 'Corporate Actions',
    correctSwipe: 'jhooth',
    verdictLabel: 'JHOOTH ❌',
    verdictColor: 'red',
    explanation:
      'Bonus shares mein total value wahi rehti hai — sirf shares zyada ho jaate hain aur price proportionally kam. 1:1 bonus = shares double, price half. Net worth same.',
    fact: '🔢 Example: ₹200 ka 1 share → 1:1 bonus → 2 shares × ₹100 each. Value: ₹200. Same.',
  },
  {
    id: 17,
    statement: 'Index fund se better returns individual stocks mein milte hain — hamesha',
    category: 'Strategy',
    correctSwipe: 'jhooth',
    verdictLabel: 'JHOOTH ❌',
    verdictColor: 'red',
    explanation:
      'S&P 500 data: 15 saal mein 92% active fund managers index se underperform karte hain. India mein bhi 60–70% large-cap funds Nifty 50 index fund se peeche hain.',
    fact: '📊 SPIVA India 2023: 64% large-cap active funds ne Nifty 50 index ko 5 saal mein underperform kiya.',
  },
  {
    id: 18,
    statement: 'Circuit breaker market ko sudden crash se 100% bachata hai',
    category: 'Market Mechanism',
    correctSwipe: 'jhooth',
    verdictLabel: 'AADHA SACH ⚠️',
    verdictColor: 'amber',
    explanation:
      'Circuit breakers trading pause karte hain (15 min ya zyada) — complete stop nahi hota. Panic selling baad mein bhi ho sakti hai. Circuit breaker delay hai, shield nahi.',
    fact: '⏸️ NSE circuit: Nifty 10% gire → 45 min halt. 15% gire → 1hr 45min halt. 20% gire → full day halt.',
  },
  {
    id: 19,
    statement: 'Stop-loss lagane se trading mein loss ensure ho jaata hai',
    category: 'Trading',
    correctSwipe: 'jhooth',
    verdictLabel: 'JHOOTH ❌',
    verdictColor: 'red',
    explanation:
      'Stop-loss MAXIMUM loss limit karta hai — ensure nahi. Stop-loss na lagne par ek bad trade pure portfolio ko wipe kar sakti hai. Professional traders hamesha stop-loss use karte hain.',
    fact: '🛡️ Stop-loss = seatbelt. Accident nahi rokta — lekin agar hua toh damage limit karta hai.',
  },
  {
    id: 20,
    statement: 'Market mein naye IPO hamesha listing par sabse zyada return dete hain',
    category: 'IPO',
    correctSwipe: 'jhooth',
    verdictLabel: 'JHOOTH ❌',
    verdictColor: 'red',
    explanation:
      '2020–2023 ke data mein, best IPO returns listing ke 6–12 mahine baad aaye the — not listing day. LIC, Paytm jaise mega-IPOs ne listing par heavy losses diye.',
    fact: '📈 Zomato: listing par +52%, but 6 months later -60%. Patience > listing-day gambling.',
  },
  {
    id: 21,
    statement: 'Diversification matlab: zyada stocks kharido, portfolio safe ho jaata hai',
    category: 'Strategy',
    correctSwipe: 'jhooth',
    verdictLabel: 'AADHA SACH ⚠️',
    verdictColor: 'amber',
    explanation:
      'Research kehta hai 15–20 stocks se beyond diversification ka marginal benefit bahut kam ho jaata hai. 50 IT stocks rakhna "diversification" nahi hai — correlation zyada hai.',
    fact: '📚 Optimal portfolio: 15–20 uncorrelated stocks. Beyond that: di-worsification.',
  },
  {
    id: 22,
    statement: 'Quarterly earnings bad aayi toh stock definitely girega',
    category: 'Fundamentals',
    correctSwipe: 'jhooth',
    verdictLabel: 'AADHA SACH ⚠️',
    verdictColor: 'amber',
    explanation:
      'Market "expectations vs reality" pe move karta hai, not just numbers. Agar bad earnings expected thi lekin "less bad" aayi, stock chadh sakta hai. "Buy the rumour, sell the news."',
    fact: '🤯 Wipro Q3 FY24: earnings slightly miss kiye — stock 7% ek din mein badhga. Market had priced in worse.',
  },
  {
    id: 23,
    statement: 'Apne paas ke stocks ka rate roz check karna smart investor jaisa hai',
    category: 'Behavior',
    correctSwipe: 'jhooth',
    verdictLabel: 'JHOOTH ❌',
    verdictColor: 'red',
    explanation:
      'Daily checking anxiety badhata hai aur impulsive decisions karvata hai. Long-term investors quarter mein ek baar review sufficient maante hain. Nobel winner Kahneman: roz check karne wale zyada galat decisions lete hain.',
    fact: '🧠 Behavioral finance: Daily price checking = more panic selling, less returns over time.',
  },
]

export const getRandomCards = (count = 10) => {
  const shuffled = [...CARDS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
