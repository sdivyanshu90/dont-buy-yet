// Company data for "Yeh Stock Kya Karta Hai?" feature
// Each company has a conversational intro + 3 drill-down paths

export const COMPANIES = {
  zomato: {
    name: 'Zomato',
    ticker: 'ZOMATO',
    emoji: '🍕',
    tagline: 'Food delivery + Blinkit grocery',
    oneliner: 'Zomato toh jaanta hai — food delivery app.',
    description: [
      'Zomato ne FY24 mein ₹3,288 crore profit kamaya. Pehle loss mein tha, ab profitable hai.',
      'Iski kamai teen jagah se hoti hai: delivery charges, restaurant ads, aur Blinkit.',
      'Plot twist: Blinkit (grocery delivery) ne last quarter mein food business ko overtake kiya revenue mein.',
    ],
    currentPrice: '₹238',
    marketCap: '~₹2.1 lakh crore',
    drilldowns: {
      risk: {
        label: '⚠️ Isme risk kya hai?',
        messages: [
          "Zomato ka main risk: profitability abhi fragile hai.",
          "FY22 mein delivery costs badhe toh net loss ₹1,200 crore tha. Stock 70% gira tha peak se.",
          "Blinkit agar slow ho jaaye, ya Swiggy Instamart aggressively compete kare — numbers phir flip ho sakte hain.",
          "Ek aur risk: dark kitchen regulations. Agar govt ne delivery fees cap ki, margins squeeze hongi.",
        ],
      },
      history: {
        label: '📈 Yeh stock kab badhna shuru hua?',
        messages: [
          "Zomato IPO July 2021 mein ₹76 par aaya — listing pe ₹116 hua.",
          "Phir ek bada crash: 2022 mein ₹40 tak gira. Market darr gaya losses se.",
          "Turnaround 2023 mein hua jab company ne pehli baar operating profit dikhaya.",
          "FY24 profits ke baad stock ₹200+ ho gaya. Journey: ₹40 → ₹240 in 2 years. 500%+.",
        ],
      },
      compare: {
        label: '🆚 Swiggy se compare karo',
        messages: [
          "Zomato profitable hai. Swiggy abhi bhi loss mein hai (Nov 2024 IPO ke time pe).",
          "Zomato ka Blinkit 10-min grocery delivery mein market leader hai India mein.",
          "Swiggy ka Instamart competitor hai, lekin market share mein peeche.",
          "Valuation: Zomato ka P/E already high hai growth ke expectations se. Risk-reward mein Swiggy cheaper tha IPO par.",
        ],
      },
    },
  },

  paytm: {
    name: 'Paytm',
    ticker: 'PAYTM',
    emoji: '📱',
    tagline: 'Payments + Financial services',
    oneliner: 'Paytm — woh app jo sabne pandemic mein use kiya payments ke liye.',
    description: [
      "Company ka full naam: One97 Communications. NSE par PAYTM ticker se listed hai.",
      "Inka business: UPI payments, merchant QR codes, loans, insurance, aur Paytm Money (investing).",
      "Big controversy: RBI ne Jan 2024 mein Paytm Payments Bank ka license cancel kiya — stock ₹761 se ₹310 par aa gaya ek mahine mein.",
    ],
    currentPrice: '₹370',
    marketCap: '~₹23,500 crore',
    drilldowns: {
      risk: {
        label: '⚠️ Isme risk kya hai?',
        messages: [
          "Regulatory risk Paytm ka sabse bada risk hai — RBI ne 2024 mein dikhaaya.",
          "UPI par PhonePe aur Google Pay ka combined share ~80%+ hai. Paytm 3rd place par hai.",
          "Revenue diversification abhi ho raha hai — loans aur insurance par depend ho rahe hain. Dono regulated sectors hain.",
          "Founder Vijay Shekhar Sharma ki significant stake hai — good (skin in game) aur risky (key man dependence) dono.",
        ],
      },
      history: {
        label: '📈 Yeh IPO ka kya hua tha?',
        messages: [
          "November 2021: India ka biggest IPO — ₹18,300 crore raise kiya ₹2,150 par share.",
          "Listing day: ₹1,560 par open hua — 27% below IPO price. Historic flop.",
          "2022: ₹440 tak gira. Investors roye.",
          "2023 recovery: profitability ki taraf move kiya, stock ₹800+ ho gaya.",
          "2024 RBI ban: phir crash, ₹310. Now rebuilding again.",
        ],
      },
      compare: {
        label: '🆚 PhonePe se compare karo',
        messages: [
          "PhonePe listed nahi hai (Walmart subsidiary). Zomato IPO expected tha before Paytm but didn't happen.",
          "UPI market share: PhonePe ~48%, Google Pay ~36%, Paytm ~8-10%.",
          "Paytm ka advantage: merchant ecosystem (offline QR codes) aur financial services revenue.",
          "PhonePe ka IPO agar aaye toh Paytm ko serious competition milegi valuation battle mein.",
        ],
      },
    },
  },

  irctc: {
    name: 'IRCTC',
    ticker: 'IRCTC',
    emoji: '🚂',
    tagline: 'Indian Railways ka official ticket booking monopoly',
    oneliner: 'IRCTC — Indian Railways ka online ticket booking aur catering ka monopoly.',
    description: [
      "Government of India ki company. Indian Railways ka 100% online ticketing rights sirf IRCTC ke paas hain.",
      "Revenue 4 jagah se: internet booking fee (₹15–30 per ticket), catering (train food), tourism packages, aur Rajdhani/Shatabdi catering contracts.",
      "FY24 mein ₹1,111 crore profit — aur growing. Har saal 8–10 crore tickets book hote hain.",
    ],
    currentPrice: '₹855',
    marketCap: '~₹68,000 crore',
    drilldowns: {
      risk: {
        label: '⚠️ Isme risk kya hai?',
        messages: [
          "IRCTC ka main risk: government policy. Ek decision se unka monopoly khatam ho sakta hai.",
          "2021 mein govt ne ek din ke liye convenience fee share formula change kiya — stock 30% gira same day.",
          "Valuation risk: P/E ~60–70 hai — premium valuation hai monopoly ke liye. Any slowdown big correction la sakta hai.",
          "Train travel growth ceiling: aviation boom se premium passengers shift kar rahe hain planes ki taraf.",
        ],
      },
      history: {
        label: '📈 Yeh stock kaise badhna shuru hua?',
        messages: [
          "IRCTC IPO October 2019: ₹320 par issue hua.",
          "COVID ne tourism hit kiya — stock ₹900 tak gira briefly, phir recover.",
          "2021 mein massive bull run: ₹320 se ₹6,390 tak — 20x in 2 years.",
          "Stock split Oct 2021: 1:5 split. Abhi effectively ₹1,278 from original.",
          "Moat strong hai: no competition allowed by law for railway tickets.",
        ],
      },
      compare: {
        label: '🆚 MakeMyTrip se compare karo',
        messages: [
          "MakeMyTrip private sector travel company hai — flights, hotels, buses sab. IRCTC sirf railways.",
          "IRCTC ka monopoly unassailable hai legally. MakeMyTrip compete karta hai with OYO, Booking.com.",
          "Margins: IRCTC ka profit margin ~30%+. MakeMyTrip ka ~5–8% in good years.",
          "Growth ceiling: IRCTC tied to Indian Railways expansion. MakeMyTrip tied to travel industry overall.",
        ],
      },
    },
  },

  reliance: {
    name: 'Reliance',
    ticker: 'RELIANCE',
    emoji: '⚡',
    tagline: 'India ka sabse bada conglomerate',
    oneliner: "Reliance Industries — India ki sabse badi private company. Jio, Retail, Petrol, aur ab Green Energy.",
    description: [
      "Reliance ka revenue ~₹9 lakh crore/year — India ke GDP ka almost 3%.",
      "Teen main businesses: Jio telecom (~450M subscribers), Reliance Retail (India ka largest retailer), aur oil-to-chemicals.",
      "Ab ek naya bet: Mukesh Ambani ne ₹75,000 crore green energy mein invest karne ka plan announce kiya hai.",
    ],
    currentPrice: '₹2,930',
    marketCap: '~₹19.8 lakh crore',
    drilldowns: {
      risk: {
        label: '⚠️ Isme risk kya hai?',
        messages: [
          "Conglomerate risk: itni badi company hogi toh growth rate naturally slow hoti hai.",
          "Succession risk: Mukesh Ambani ne already transition planning kiya hai (3 children). But any uncertainty = stock hit.",
          "Jio ka ARPU (revenue per user) abhi ~₹180/month hai. Growth ke liye tariff hike zaroori hai — competitive risk.",
          "Green energy bet: ₹75,000 crore ka investment future mein return aayega toh well, warna big write-off.",
        ],
      },
      history: {
        label: '📈 Reliance ka stock journey kaisa raha?',
        messages: [
          "2002 mein Dhirubhai Ambani ke death ke baad bhai ladai — stock volatile raha.",
          "2008 global crisis: ₹3,000 se ₹800 tak gira.",
          "Jio launch 2016: game changer. Stock ne 2016–2021 mein 5x kiya.",
          "2020 COVID: Rights issue kiya ₹1,257 par. Woh investors ne ₹2,500+ dekha 18 months mein.",
          "Abhi: ₹2,800–3,000 range mein trade kar raha hai.",
        ],
      },
      compare: {
        label: '🆚 Tata Group se compare karo',
        messages: [
          "Tata Group listed entities: TCS, Tata Motors, Tata Steel, Tata Consumer, TITAN — sab separate stocks.",
          "Reliance single listed entity mein sab hai. Tata diversification across sectors.",
          "Market cap: Reliance ~₹20 lakh crore. TCS alone ~₹15 lakh crore.",
          "Philosophy: Reliance = concentrated bet on Ambani's vision. Tata = diversified India bet.",
        ],
      },
    },
  },

  hdfc_bank: {
    name: 'HDFC Bank',
    ticker: 'HDFCBANK',
    emoji: '🏦',
    tagline: "India ka largest private sector bank",
    oneliner: "HDFC Bank — India ka sabse trusted private bank. Loan deta hai, savings leta hai, fee kamaata hai.",
    description: [
      "India ka largest private sector bank by assets. ~8 crore customers, 8,000+ branches.",
      "Business simple hai: logo se savings account mein paisa lo at 3-4% interest. Loan do at 10-18% interest. Difference = NIM (net interest margin).",
      "FY24 profit: ~₹60,000 crore. Consistent grower — 20% profit growth last decade mein.",
    ],
    currentPrice: '₹1,880',
    marketCap: '~₹14.3 lakh crore',
    drilldowns: {
      risk: {
        label: '⚠️ Isme risk kya hai?',
        messages: [
          "HDFC-HDFC Bank merger 2023: India's biggest banking merger. Integration challenge real hai.",
          "NPA (bad loans) risk: economic slowdown mein loan defaults badhte hain.",
          "Regulatory risk: RBI HDFC Bank par 2020–2022 mein new credit card issuance rok di thi due to IT issues.",
          "Growth slowdown: Itna bada ho gaya hai ki 20% growth maintain karna increasingly tough hai.",
        ],
      },
      history: {
        label: '📈 Yeh stock itna consistent kaise raha?',
        messages: [
          "IPO 1995 mein ₹40 par — abhi ₹1,880. 47x in ~29 years.",
          "Nearly every major market crash mein HDFC Bank recovered faster than Nifty.",
          "2022–2023 mein underperformance: merger concerns aur deposit growth slowdown.",
          "Key: consistent management, conservative lending, and technology investment kept it compounding.",
        ],
      },
      compare: {
        label: '🆚 SBI se compare karo',
        messages: [
          "SBI: govt bank, cheapest deposits (trust factor), but also carries govt obligations.",
          "HDFC Bank: private, nimble, but higher deposit costs than SBI.",
          "NPA rate: HDFC Bank ~1.3% bad loans. SBI ~2.2%.",
          "Return on Equity: HDFC Bank ~17%. SBI ~18% — surprisingly close now. SBI has improved significantly.",
        ],
      },
    },
  },

  titan: {
    name: 'Titan',
    ticker: 'TITAN',
    emoji: '⌚',
    tagline: 'Tata ka watch + jewelry company',
    oneliner: "Titan — Tata Group ka company jo watches (Fastrack, Titan), jewelry (Tanishq), aur eyewear (Titan Eye+) banata hai.",
    description: [
      "India ka largest organized jewelry retailer. Jewelry se ~90% revenue aata hai (Tanishq).",
      "Premium pricing power: Tanishq brand Indians ke liye trust = premium. 5–7% making charges vs 12–15% local jeweller.",
      "FY24 revenue ~₹53,000 crore. Profit ~₹3,500 crore. Strong consistent growth.",
    ],
    currentPrice: '₹3,450',
    marketCap: '~₹3.06 lakh crore',
    drilldowns: {
      risk: {
        label: '⚠️ Isme risk kya hai?',
        messages: [
          "Gold price sensitivity: Titan ka jewelry business gold prices par depend karta hai. Gold mehnga → customers hesitate.",
          "Import duty risk: Govt ne 2024 mein gold import duty cut ki — short-term demand boost but also margin pressure.",
          "Valuation premium: P/E ~90–100 hai. Any earnings miss = sharp correction.",
          "Wedding season dependency: India mein jewelry ka bulk wedding/festive season mein bikta hai. Slowdown in weddings = Titan hit.",
        ],
      },
      history: {
        label: '📈 Titan ne investors ko kya diya hai?',
        messages: [
          "2004 mein ₹25 around tha (split-adjusted). 2024 mein ₹3,450. 138x in 20 years.",
          "It's a Tata company — management quality consistently high.",
          "2020 COVID: showrooms band thi, stock ₹700 tak gira. Buy the dip investors ne 5x kiya agle 3 saal mein.",
          "Key insight: organized jewelry market share badhna is the structural story. Local jewellers losing to Tanishq.",
        ],
      },
      compare: {
        label: '🆚 Kalyan Jewellers se compare karo',
        messages: [
          "Kalyan Jewellers South India dominant, pan-India expanding. Cheaper valuations than Titan.",
          "Titan vs Kalyan: Titan aspirational premium brand. Kalyan more value-focused.",
          "Tanishq making charges 5–7%. Kalyan ~8–12%. Both cheaper than local jewellers.",
          "Growth: Both growing but Titan's brand moat deeper. Kalyan better at value segment penetration.",
        ],
      },
    },
  },

  infosys: {
    name: 'Infosys',
    ticker: 'INFY',
    emoji: '💻',
    tagline: 'India ka iconic IT services company',
    oneliner: "Infosys — Bangalore wala IT giant jo American aur European companies ke liye software services karta hai.",
    description: [
      "Business model: India mein cheap engineers rakho, US/Europe ki companies ko IT services do. Arbitrage model.",
      "Revenue FY24: ₹1.54 lakh crore (~$18.5B USD). Clients: Apple, Goldman Sachs, Walmart, Verizon.",
      "Margin pressure: US mein recession fear + AI tools replace kuch kaam = slower growth era mein enter kiya hai.",
    ],
    currentPrice: '₹1,590',
    marketCap: '~₹6.6 lakh crore',
    drilldowns: {
      risk: {
        label: '⚠️ Isme risk kya hai?',
        messages: [
          "AI disruption: ChatGPT aur coding AI tools se junior developers ke kaam zyada automated ho rahe hain. Infosys business model directly threatened.",
          "US client spending cuts: US recession ya slowdown mein IT budgets pehle katte jaate hain.",
          "Attrition: talent war continuously raises salary costs, squeezing margins.",
          "INR appreciation bhi ek risk hai — dollar revenue mein same but INR mein less.",
        ],
      },
      history: {
        label: '📈 Infosys ki real story kya hai?',
        messages: [
          "1999 mein Narayan Murthy ne US mein listed karaya — pehla Indian company on NASDAQ.",
          "2000–2010 golden era: Indian IT boom. Infosys the 'darling stock.'",
          "2011–2019: relative underperformance. TCS ne takeover kiya India's top IT spot.",
          "2020–2021 tech boom: stock ₹600 se ₹1,900 tak. Then 2022 correction back to ₹1,400.",
        ],
      },
      compare: {
        label: '🆚 TCS se compare karo',
        messages: [
          "TCS: Tata Group ki company, larger than Infosys (~₹14L crore vs ₹6.6L crore market cap).",
          "TCS more stable, Infosys sometimes more aggressive on growth.",
          "Dividend yield: TCS gives higher dividends. Infosys also solid.",
          "AI strategy: Both investing in AI upskilling, but disruption risk same for both.",
        ],
      },
    },
  },

  marico: {
    name: 'Marico',
    ticker: 'MARICO',
    emoji: '🥥',
    tagline: 'Parachute coconut oil + Saffola waale',
    oneliner: "Marico — Parachute coconut oil, Saffola cooking oil, aur Set Wet hair gel banane wali FMCG company.",
    description: [
      "India ka coconut oil market mein 55%+ market share sirf Parachute ke through.",
      "International business bhi strong hai: Bangladesh, Egypt, Vietnam mein market leader hai personal care mein.",
      "FY24 profit: ~₹1,500 crore. Revenue ~₹9,700 crore. Steady, boring, but reliable.",
    ],
    currentPrice: '₹652',
    marketCap: '~₹84,000 crore',
    drilldowns: {
      risk: {
        label: '⚠️ Isme risk kya hai?',
        messages: [
          "Raw material risk: coconut oil prices directly tied to copra (raw coconut) prices. Bad harvest = margin squeeze.",
          "Urban young consumers shift kar rahe hain hair oil se serums/conditioners ki taraf. Volume growth challenged.",
          "Competition: HUL, Dabur, Patanjali continuously challenge Marico's market share.",
          "Premium product innovation mein Marico relatively slower than HUL.",
        ],
      },
      history: {
        label: '📈 Marico ka investor return kaisa raha?',
        messages: [
          "2000 mein ₹3 (split-adjusted). 2024 mein ₹652. 200x+ in 24 years.",
          "Boring FMCG stocks ka real magic: consistent earnings + dividends + buybacks = compounding.",
          "COVID period: essential goods — barely impacted. Stock recovered faster than market.",
          "Management: Harsh Mariwala family still controls. Consistent capital allocation track record.",
        ],
      },
      compare: {
        label: '🆚 HUL se compare karo',
        messages: [
          "HUL (Hindustan Unilever) much larger — Surf, Rin, Dove, Knorr, Lipton sab.",
          "Marico more focused (oils + foods). HUL more diversified.",
          "P/E: Both premium FMCG valuations. HUL ~55x, Marico ~50x.",
          "Dividend: Both consistent dividend payers. Marico slightly higher yield historically.",
        ],
      },
    },
  },
}

// Alias mapping so users can type common names
export const COMPANY_ALIASES = {
  zomato: 'zomato',
  food: 'zomato',
  swiggy: 'zomato',
  blinkit: 'zomato',
  paytm: 'paytm',
  one97: 'paytm',
  upi: 'paytm',
  payments: 'paytm',
  irctc: 'irctc',
  railway: 'irctc',
  railways: 'irctc',
  train: 'irctc',
  trains: 'irctc',
  ticket: 'irctc',
  reliance: 'reliance',
  jio: 'reliance',
  ril: 'reliance',
  ambani: 'reliance',
  hdfc: 'hdfc_bank',
  'hdfc bank': 'hdfc_bank',
  hdfcbank: 'hdfc_bank',
  bank: 'hdfc_bank',
  titan: 'titan',
  tanishq: 'titan',
  fastrack: 'titan',
  watches: 'titan',
  jewellery: 'titan',
  jewelry: 'titan',
  infosys: 'infosys',
  infy: 'infosys',
  it: 'infosys',
  software: 'infosys',
  marico: 'marico',
  parachute: 'marico',
  saffola: 'marico',
  coconut: 'marico',
}

export const searchCompany = (query) => {
  const q = query.toLowerCase().trim()
  // Direct key match
  if (COMPANIES[q]) return COMPANIES[q]
  // Alias match
  for (const [alias, key] of Object.entries(COMPANY_ALIASES)) {
    if (q.includes(alias)) return COMPANIES[key]
  }
  // Partial name match
  for (const [key, company] of Object.entries(COMPANIES)) {
    if (company.name.toLowerCase().includes(q) || q.includes(company.name.toLowerCase())) {
      return company
    }
  }
  return null
}
