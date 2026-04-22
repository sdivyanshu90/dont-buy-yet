# dont-buy-yet — Product Strategy & Design Document

> **Platform Positioning:** A psychologically-driven financial literacy platform that intercepts India's retail investor *before* they open Zerodha, *before* they act on a bad tip, and *before* fear calcifies into permanent avoidance.

---

## PHASE 1 — Differentiation Strategy

### What Varsity Is (and Why That's the Problem)

Zerodha Varsity is a library. It is the best financial textbook India has ever produced — free, thorough, and respected. But a library requires:
- **Intent** to learn
- **Patience** to read
- **Self-awareness** to know what you don't know

The Satta Skeptic and the Tip Chaser have none of these three things at the moment of first contact. Varsity's core design assumption is that the user *wants* to learn. This platform's core design assumption is the **opposite**: the user *doesn't know they need to learn anything*.

---

### Precise Differentiation: What This Platform Does That Varsity Structurally Cannot

| Dimension | Zerodha Varsity | dont-buy-yet |
|---|---|---|
| **Entry trigger** | User pulls content (searches, opens app) | Platform intercepts a real event (tip received, market crash news, relative's story) |
| **User's self-identity at entry** | "I want to learn investing" | "I just got a tip" / "My cousin lost ₹50,000" |
| **Format assumption** | User will read 800-word modules | User will not read more than 60 words |
| **Feedback loop** | Knowledge → quiz → badge | Curiosity → micro-action → identity shift |
| **Output** | Comprehension | **Behavioral change** |
| **Content type** | Encyclopedic, structured | Event-reactive, conversational |
| **Jargon policy** | Explained carefully | **Banned entirely** |
| **Success metric** | Module completion | First independent decision made |

---

### The Structural Gap Varsity Cannot Fill

Varsity's architecture is **supply-side**: great content waiting to be discovered. The users this platform targets are **demand-less** — they will never search for financial education because they don't believe they need it.

**Varsity cannot:**
- Intercept a user *mid-tip* in a WhatsApp group
- Replace the emotional hit of a "hot stock tip" with a curiosity loop
- Build identity ("I am someone who checks before acting") before knowledge
- Operate inside the 90-second attention window of a Reels-conditioned brain
- Make a person feel *smart* before they know anything

**dont-buy-yet can**, because it is built around **reactive triggers**, not proactive curriculum.

---

### The Interception Moment: Where This Platform Finds the User

**The Varsity user** opens a browser, types "how to read candlestick charts," and finds Varsity. That user is already converted.

**This platform's user** is in one of these exact moments:

| Trigger Moment | User's Emotional State | Platform Entry Point |
|---|---|---|
| Just received a WhatsApp tip: "Buy IRFC, will 2x by Diwali" | Excited + uncertain | "Decode My Tip" share-sheet shortcut |
| Read a headline: "Sensex crashes 1,200 points" | Anxious, confused | "What just happened in 60 seconds" reactive card |
| Relative lost money in options | Fearful, vindicated ("satta hi hai") | "Why he lost — and why it wasn't random bad luck" story card |
| Opened a Zerodha account but never bought anything | Frozen by paradox of choice | "Your first ₹10 decision" onboarding arc |
| Saw a finfluencer YouTube short | Mildly curious, FOMO-adjacent | "Is this real? Let's check" instant verdict feature |

**The platform does not wait for the user to come to it. It lives inside the moments that already exist in the user's day.**

---

## PHASE 2 — Two Innovative Product Formats

### Format 1: "Sach Ya Jhooth" (True or False — Stock Edition)

**Concept:** A swipe-based, Tinder-style card game built around stock market *myths and half-truths* that Indian retail investors actually believe. Zero knowledge required. Maximum curiosity activation.

**Why this works behaviorally:**
- Exploits the **Curiosity Gap** (George Loewenstein): a question you can't answer creates cognitive tension that demands resolution
- Exploits **Overconfidence Bias**: users *think* they know the answer, swipe confidently, and are surprised — this surprise is the learning
- The swipe mechanic is **motor memory** for every Indian who has used Shaadi.com, Hinge, or even Amazon product browsing
- Loss aversion activated: getting it *wrong* feels worse than expected, creating a memory anchor

**Exact User Interaction Flow:**

```
Step 1 — Cold Open (0–5 seconds)
User opens app. No login gate. No tutorial. Directly sees:

  ┌────────────────────────────────────────┐
  │  🃏  SACH YA JHOOTH?                   │
  │                                        │
  │  "SIP mein invest karo, toh market    │
  │   crash ka koi farak nahi padta"       │
  │                                        │
  │  ← JHOOTH          SACH →              │
  └────────────────────────────────────────┘

Step 2 — User swipes (5–10 seconds)
Say user swipes SACH (True).

Step 3 — Instant Verdict Card (10–25 seconds)
Screen splits with a satisfying animation (inspired by Dream11's team reveal):

  ┌────────────────────────────────────────┐
  │  ⚠️  AADHA SACH                        │
  │                                        │
  │  SIP crash se *timing risk* hatata hai │
  │  — lekin crash ke baad value recover   │
  │  hone mein 3–5 saal lag sakte hain.    │
  │                                        │
  │  Real example: March 2020 SIP investors│
  │  ne full recovery ke liye Dec 2021 tak │
  │  wait kiya.                            │
  │                                        │
  │  [Next Card →]    [Share this]         │
  └────────────────────────────────────────┘

Step 4 — Streak + Identity Nudge (25–30 seconds)
Below the card:
  "3 cards played. You're thinking like a fact-checker."
  [🔥 Streak: 3]

Step 5 — Soft Hook (after 5 cards)
  "You got 3/5. The 2 you missed are the exact traps that cost
   investors money. Want to see where the real money is lost?"
   [Yes, show me] → Leads into Decode My Tip or onboarding arc
```

**Content Strategy:**
- 300+ cards, seeded with India-specific myths: "Blue chip = safe", "FD beats stocks long term", "Options mein zyada paisa hai", "Sensex oopar gaya matlab mera stock bhi badhega"
- Cards refreshed weekly, pegged to trending market events (when Adani stocks move, a card about conglomerate risk appears)
- Cards sourced from **actual WhatsApp forward screenshots** (with text extracted) — users recognize the language immediately
- Hinglish throughout, no English financial terms without a one-line parenthetical

**Virality Mechanic:**
- Share card = shares the *question*, not the answer → friend has to play to see the reveal → **built-in referral loop**
- Weekly "Sabse Bada Myth" leaderboard: "This week, 87% of users got this wrong — did you?"

---

### Format 2: "Yeh Stock Kya Karta Hai?" (What Does This Company Actually Do?)

**Concept:** An interactive, conversational company explainer that works like a WhatsApp chat. User types (or voice-inputs) any company name they've heard — even Tier 2/3 city users who only know brands, not tickers. The platform responds in the voice of a knowledgeable *dost*, not a textbook.

**Why this works behaviorally:**
- **Curiosity-first architecture**: the user is already curious about a stock (they heard a tip, or they use the product). This format *meets* them at that curiosity rather than trying to create it
- **Conversational UI = lowest friction possible** for WhatsApp-native users — they already spend 3 hours/day in this exact interface paradigm
- **Concrete-to-abstract pedagogy**: explain what a company *does* in physical, relatable terms first → only then show financial implication
- Exploits the **IKEA Effect**: the user generated the input (the company name) so they feel ownership over the output

**Exact User Interaction Flow:**

```
Step 1 — Zero-friction entry (0–5 seconds)
Home screen has a single text box:

  ┌────────────────────────────────────────┐
  │  Kaunsi company ke baare mein jaanna   │
  │  hai? Koi bhi naam likho 👇            │
  │  ________________________________      │
  └────────────────────────────────────────┘

User types: "Zomato"

Step 2 — "Dost Mode" company brief (5–30 seconds)
Rendered as a WhatsApp-style chat bubble sequence:

  🤖 "Zomato toh jaanta hai — food delivery."

  🤖 "But picture yeh hai: Zomato ne FY24 mein
      ₹3,288 crore profit kamaya. Pehle loss mein
      tha. Ab profitable hai."

  🤖 "Iski kamai kahan se? Teen jagah:"
      📦 Delivery charges (restaurant + user)
      📢 Restaurant ads (promoted listings)
      ⚡ Blinkit (grocery delivery — ab biggest
         growth driver)

  🤖 "Blinkit ne last quarter mein Zomato food
      business ko overtake kiya revenue mein.
      Yeh plot twist tha."

Step 3 — One-question hook (30–50 seconds)
  🤖 "Ek cheez poochhna chahoge?"

  User sees 3 tap-to-ask options:
    [📈 Yeh stock kab se badhna shuru hua?]
    [⚠️  Isme risk kya hai?]
    [🆚 Swiggy se compare karo]

Step 4 — Drill-down response (50–80 seconds)
User taps "Risk kya hai?" → Gets:

  🤖 "Zomato ka main risk: profitability abhi
      fragile hai."

  🤖 "Ek real example: FY22 mein jab delivery
      costs badhe, net loss ₹1,200 crore tha.
      Stock 70% gira tha peak se."

  🤖 "Matlab: agar Blinkit slow ho jaaye, ya
      koi bada competitor aaye — numbers
      phir flip ho sakte hain."

Step 5 — Identity moment + action hook (80–90 seconds)
  🤖 "Tune abhi jo kiya — that's called
      'business model analysis'. Analysts
      ₹2 lakh/month kamate hain yahi karne ke."

  [🔍 Decode a tip about Zomato]
  [📊 Compare with Swiggy IPO]
  [🎯 Add to my Watchlist]
```

**Technical feasibility for mid-range Android:**
- All responses are pre-generated and cached for the top 200 BSE/NSE companies (covers ~85% of retail investor interest)
- Voice input via standard Android speech API — no custom ML required at launch
- WhatsApp-style chat UI: minimal render load, works on 2GB RAM devices, 3G-compatible
- Company data refreshed weekly, not real-time — reduces API cost and latency

**Differentiation from Screener/Tickertape:**
- Those platforms show *data* and expect the user to interpret it
- This format gives *narrative* and lets the user ask follow-up questions
- Language is Hinglish-first, not English-with-Hindi-translation
- No charts, no tables in the primary flow — only introduced in drill-down if user explicitly requests

---

## PHASE 3 — "Decode My Tip" — Core Feature Design

### Feature Overview

User receives a tip (WhatsApp forward, YouTube comment, office colleague, finfluencer Reel). They input it here. Within 2 minutes, they get a **Tip Verdict Card** — not a financial recommendation, but a **thinking scaffold**: three questions that reveal whether this tip has any logical foundation.

**Core Behavioral Insight:** The goal is not to tell users the tip is wrong. It is to make them *feel smart for questioning it*. The platform never says "don't buy." It says "here's what to check" — which is more trustworthy, more durable, and avoids the backlash of being perceived as a killjoy.

---

### Entry Points

1. **In-app text input**: "Tip mila? Check karo" — single text field, home screen
2. **Share sheet integration**: From WhatsApp, user long-presses a message → "Share to dont-buy-yet" → pre-fills the tip text
3. **Voice input**: "Paytm ka tip mila, 3x in 6 months bolte hain" → speech-to-text → auto-parsed

---

### Parsing Logic (What the Platform Extracts)

From the tip: *"Paytm will 3x in 6 months"*

| Extracted Element | Value |
|---|---|
| **Company** | Paytm (One97 Communications) |
| **Claim type** | Price target |
| **Claim magnitude** | 3x = +200% |
| **Claim timeframe** | 6 months |
| **Source credibility signals** | None (anonymous tip) |

The platform maps the claim against 4 internal benchmarks:
1. **Historical precedent**: Has this stock *ever* moved 3x in 6 months? (Anchoring)
2. **Sector context**: What would need to be true for this to happen? (Plausibility)
3. **Recent news signal**: Any basis in recent company announcements? (Timing check)
4. **Tip pattern match**: Does this match known pump-and-dump or finfluencer hype patterns?

---

### Output: The Tip Verdict Card

**Visual metaphor: A "Helmet Check"**

Every tip goes through a 3-point safety check — like checking a helmet before a bike ride. The metaphor is deliberate: it's about *protection before action*, not about stopping action.

```
┌─────────────────────────────────────────────────┐
│  🔍 TIP VERDICT: Paytm 3x in 6 months           │
│  ─────────────────────────────────────────────  │
│                                                 │
│  🌡️  HYPE TEMPERATURE: 🔥🔥🔥🔥 (HIGH)          │
│                                                 │
│  ⛑️  HELMET CHECK — 3 Sawaal Pehle              │
│                                                 │
│  1️⃣  YEH CLAIM REALISTIC HAI?                   │
│     Paytm ne kabhi bhi 6 mahine mein 3x         │
│     nahi kiya — even in its best years.         │
│     3x ka matlab stock ko ₹1,100 pahunchna      │
│     hoga. Abhi ₹370 hai.                        │
│     → Historically: Bahut mushkil               │
│                                                 │
│  2️⃣  TIP AAYA KAHAN SE?                         │
│     WhatsApp group / finfluencer / "bhaiya"?    │
│     Agar source ne apna portfolio nahi           │
│     dikhaya — motivation unknown hai.            │
│     → Source check: ⚠️ Verify karo              │
│                                                 │
│  3️⃣  COMPANY KI SITUATION KYA HAI ABHI?        │
│     Paytm RBI license issue ke baad recover     │
│     kar raha hai. Q3 FY25 mein pehli baar       │
│     operating profit positive hua.              │
│     Real growth hai — but 3x? That needs        │
│     something much bigger to happen.            │
│     → Story: Real, but tip is exaggerated       │
│                                                 │
│  ─────────────────────────────────────────────  │
│  VERDICT: 🟡 INVESTIGATE — TIP NAHI, STORY HAI  │
│  "Company interesting hai. 3x claim nahi."      │
│                                                 │
│  [📖 Paytm ka pura story]  [🎯 Watchlist mein] │
│  [🔍 Aur tips decode karo]                      │
└─────────────────────────────────────────────────┘
```

---

### Verdict System (5 Levels)

| Verdict | Color | Meaning | User Action Prompted |
|---|---|---|---|
| **PUMP ALERT** | 🔴 Red | Known hype pattern, no fundamentals | "Yeh wala bhool jao. Iska pattern dekho." |
| **HIGH HYPE** | 🟠 Orange | Exaggerated claim, some real base | "Company real hai, claim fake hai" |
| **INVESTIGATE** | 🟡 Yellow | Mixed signals, needs more checking | "3 sawaal hai — answer dhundo pehle" |
| **POSSIBLE** | 🟢 Green | Plausible claim, verifiable basis | "Logic hai. Ab khud verify karo." |
| **ALERT: TOO SAFE** | 🔵 Blue | Tip is overly conservative, possible FUD | "Koi yeh stock *giraana* chahta hai kya?" |

---

### Anti-Patterns Deliberately Avoided

- ❌ **No percentage probability** ("This tip has a 23% chance of success") — users anchor on this and either dismiss or over-trust
- ❌ **No "Buy/Sell/Hold" verdict** — this is not SEBI-registered advice and must not feel like it
- ❌ **No charts in primary output** — charts trigger cognitive load and make users feel like they need to understand them before acting
- ❌ **No negativity spiral** — the verdict never says "this is a scam" unless it genuinely is; it always ends with *a question the user can actually answer*

---

### The 2-Minute Pacing Design

| Time | What Happens |
|---|---|
| 0–5s | User inputs tip, share-sheet or voice |
| 5–15s | Loading animation: "Checking 3 things..." (shows progress, not a spinner) |
| 15–45s | Hype Temperature + Claim 1 (realistic?) appears |
| 45–75s | Claims 2 and 3 appear sequentially (WhatsApp-style bubble animation) |
| 75–100s | Verdict card reveals with a satisfying "stamp" animation |
| 100–120s | Action options + optional "explain more" drill-down |

The sequential reveal is intentional: **it mimics the experience of a smart friend thinking through the problem in real time**, which is more persuasive than an instant data dump.

---

## PHASE 4 — "Fear to First Step" Onboarding Journey (Persona A)

### Design Principle

Persona A — the Satta Skeptic — is not ignorant. They are **correctly calibrated to a risk they don't understand**. They've seen real losses. They distrust the system. Any onboarding that leads with features, accounts, or KYC will lose them in 10 seconds.

The pathway must do four things in order:
1. **Validate their fear** (not dismiss it)
2. **Create a distinction** between gambling and investing that they feel, not just hear
3. **Give them a win** before they risk anything
4. **Shift their identity** before asking for any commitment

---

### The 7-Step Pathway: "Darna Theek Hai"

---

#### Step 1 — The Fear Validation Hook
**Emotional State:** Defensive, skeptical, closed
**Required Action:** Read one 40-word card. Nothing else.
**Trigger:** Platform never says "don't worry." It says "you're right to be worried."

> **Screen content:**
> *"Ek cheez seedhi baat: stock market mein paisa doob sakta hai. Yeh sach hai. Tumhare rishtedaar ke saath jo hua woh real tha. Hum yeh nahi bolenge ke sab theek hai."*
>
> *"Lekin ek cheez aur bhi sach hai — jo unhone ki galti, woh galti thi. Market nahi."*
>
> **[Kya galti thi? Batao →]**

**Behavioral Trigger:** The **Validation Principle** (Carl Rogers) — before behavior change is possible, the person must feel heard. This card does not ask for anything. It gives acknowledgment. The CTA is pure curiosity.

**Reward:** Emotional relief. "Finally someone isn't dismissing my fear."

---

#### Step 2 — The Gambling vs. Investing Distinction (Felt, Not Told)
**Emotional State:** Mildly curious, still guarded
**Required Action:** Play one round of a 2-option interactive scenario
**Trigger:** **Experiential learning** — the distinction is demonstrated, not explained

> **Screen content:**
> *"Do log hain. Kaunsa behavior zyada risky lagta hai?"*
>
> **Option A:** Ramesh ne kal ₹5,000 lagaye "XYZ stock mein 2 din mein double hoga" sunke. Kisi ne tip diya tha WhatsApp pe.
>
> **Option B:** Priya ne ₹500/month SIP shuru kiya HDFC Nifty 50 index fund mein. 10 saal ke liye. Bina tip ke.
>
> **[Ramesh]** or **[Priya]**

After selection:
> *"Ramesh wala behavior — woh satta hai. Priya wala — woh investing hai. Difference behavior mein hai, market mein nahi."*
>
> *"Tumhare rishtedaar ne probably Ramesh wala kiya tha."*

**Behavioral Trigger:** **Self-generated insight** — the user arrives at the conclusion themselves by making a choice. This is far more durable than being told the answer (per the **Generation Effect** in memory research).

**Reward:** Clarity. The "Aha" moment that reframes their entire prior experience.

---

#### Step 3 — The Smallest Possible World
**Emotional State:** Intrigued, but still not trusting
**Required Action:** Watch a 45-second interactive simulation (not a video — a tappable timeline)
**Trigger:** **Concrete anchoring** with real Indian data, familiar companies

> **Screen content:**
> *"₹1,000 se kya hota?"*
>
> A horizontal timeline appears (2015 → 2025). User taps anywhere on it.
>
> *"Agar tumne January 2015 mein ₹1,000 Hindustan Unilever mein lagaye hote — woh company jo Rin sabun aur Surf banati hai — toh aaj ₹4,200 hote."*
>
> *"Kuch hua nahi tha. Bas rakhna tha."*

Three company options are shown — all household names: HUL, Asian Paints, ITC. User picks one and sees their own simulation.

**Behavioral Trigger:** **Ownership bias** — by choosing the company, the simulation result feels personal. Also, using brands they physically buy breaks the abstraction of "stock market" into something tangible.

**Reward:** A number. A concrete, imaginable outcome. The brain now has an anchor to hold onto.

---

#### Step 4 — The Risk Reality Check (Inoculation)
**Emotional State:** Warming up, but fear still present beneath the surface
**Required Action:** Answer one honest question about themselves
**Trigger:** **Pre-emptive inoculation** (McGuire's Inoculation Theory) — address the fear before it resurfaces as a blocker

> **Screen content:**
> *"Ek seedha sawaal: agar tune ₹1,000 lagaye aur woh 6 mahine baad ₹700 ho gaye — toh kya hoga?"*
>
> **[Neend nahi aayegi]**
> **[Thoda bura lagega, par theek hai]**
> **[Koi farak nahi padta]**

All three answers lead to the same next card, but with customized language:

For "Neend nahi aayegi":
> *"Sahi jawab diya. Iska matlab hai tu abhi ₹1,000 ke liye ready nahi — aur yeh bilkul theek hai. Pahle ₹10 se shuruaat karte hain."*

**Behavioral Trigger:** **Self-concordance** — the platform matches its ask to the user's stated risk tolerance, not a standard template. This builds radical trust.

**Reward:** The feeling of being understood, not judged. A bespoke path forward.

---

#### Step 5 — The Identity Shift Moment
**Emotional State:** Open, curious, slightly hopeful
**Required Action:** Complete a one-tap "Analyst Move" exercise
**Trigger:** **Identity labeling** (from Robert Cialdini's *Influence*) — giving the user a new self-concept before the behavior, not after

> **Screen content:**
> A company card appears: *"Marico — Jo Parachute coconut oil banata hai"*
>
> *"Company ne kaha: 'Iss saal raw material costs kam hue, toh margins badhe.'"*
>
> *"Iska matlab kya hua stock ke liye?"*
>
> **[Badhega — kyunki zyada profit]**
> **[Girega — kuch toh gadbad hogi]**
> **[Pata nahi]**

User taps "Badhega."
> ✅ *"Sahi socha. Yahi analysts sochte hain. Cost down + revenue same = margin expansion. Tune abhi ek analyst ki tarah socha."*
>
> 🏷️ **"Analyst Mindset: Unlocked"**

**Behavioral Trigger:** **Implementation intention + identity labeling**. The user is not told they *could* be an analyst. They are told they *just acted like one*. Past tense is critical — it makes the identity feel earned, not aspirational.

**Reward:** A status badge. An identity claim. Something to repeat.

---

#### Step 6 — The Simulated Decision
**Emotional State:** Engaged, identity-shifted, ready for a low-stakes test
**Required Action:** Make a simulated ₹10,000 allocation across 3 companies (play money, zero real risk)
**Trigger:** **Behavioral rehearsal** — the brain practices the decision so the real version feels familiar, not foreign

> **Screen content:**
> *"Virtual ₹10,000 hain tere paas. Inhe teen companies mein lagana hai:"*
>
> Three cards: **Titan** (luxury watches + jewelry), **IRCTC** (Indian Railways tickets online), **Wipro** (IT services)
>
> Each card shows: What the company does (one sentence, no jargon), One recent news headline, One risk factor
>
> User drags a slider to allocate. No "right answer."
>
> After allocation:
> *"Tu ne ₹5,000 IRCTC mein lagaye. Smart move agar tu believe karta hai ke railway travel badhti rahegi. Let's see how your portfolio does over the next 30 days."*

**Behavioral Trigger:** **Variable reward schedule** (Nir Eyal's Hooked model) — the user now has a simulated portfolio that will update over 30 days. This creates a daily pull-back trigger. They will return to check.

**Reward:** A personal stake. Something to track. The beginning of habit formation.

---

#### Step 7 — The ₹10 First Real Decision
**Emotional State:** Confident, curious, identity-anchored
**Required Action:** Optional: make a real ₹10 investment via UPI into a Nifty 50 index fund
**Trigger:** **Foot-in-the-door technique** — 6 steps of zero-risk engagement have built enough trust that ₹10 feels trivially small

> **Screen content:**
> *"Teri virtual portfolio 30 din chalti rahegi. Ek cheez aur:"*
>
> *"₹10 se ek real index fund khareedna possible hai. Yeh ek basket hai 50 India ki sabse badi companies ka — HUL, TCS, HDFC Bank — sab ek saath."*
>
> *"₹10 mein ek chai ka risk. Par pehli baar apna real paisa market mein hoga."*
>
> **[₹10 se shuru karo — UPI se]** → Deeplink to partner broker (Groww / Zerodha / Paytm Money)
> **[Abhi nahi — virtual portfolio continue karo]** → No guilt, no pressure
>
> Both options proceed to the home screen. The "no" option is equally celebrated:
> *"Bilkul theek hai. Virtual portfolio ready hai. Dekho kaise perform karta hai."*

**Behavioral Trigger:** **Loss aversion minimization** — ₹10 is below the psychological loss threshold for most users. Also, UPI is motor memory for every Indian smartphone user — the payment step has zero new friction.

**Identity Reward:** *"Tune aaj woh kiya jo 90% log nahi karte — tune soche, phir decide kiya. Wahi investing hai."*

---

### Onboarding Journey Summary

| Step | User State | Action | Trigger | Reward |
|---|---|---|---|---|
| 1 | Defensive | Read 40-word card | Validation | Emotional relief |
| 2 | Guarded | Make a 2-option choice | Self-generated insight | Clarity on gambling vs. investing |
| 3 | Curious | Tap a company timeline | Ownership bias | A concrete number |
| 4 | Warming | Answer a risk question | Inoculation | Being understood |
| 5 | Open | One-tap analyst exercise | Identity labeling | "Analyst Mindset: Unlocked" |
| 6 | Engaged | Simulate ₹10,000 allocation | Behavioral rehearsal | A portfolio to track |
| 7 | Confident | Optional ₹10 real investment | Foot-in-door + UPI familiarity | "First real investor" identity |

---

## Appendix: Cross-Feature Behavioral Architecture

### The Three Loops That Keep Users Returning

**Loop 1 — The Curiosity Loop (Daily)**
- Sach Ya Jhooth daily card → user gets one wrong → needs to understand why → enters Yeh Stock Kya Karta Hai → gets pulled into deeper content → exits feeling smarter

**Loop 2 — The Social Proof Loop (Weekly)**
- Decode My Tip → user shares verdict card on WhatsApp → friend in the same group sees it → downloads app to check their own tips → new user acquired at zero CAC

**Loop 3 — The Stakes Loop (Monthly)**
- Simulated portfolio updates every day → user checks → after 30 days, sees results → platform compares to "if you had done nothing" → creates both pride (if up) and learning (if down) → either path leads to deeper engagement

---

### Language & Tone Guidelines

| Principle | Do | Don't |
|---|---|---|
| **Hinglish-first** | "Market ne aaj bada move kiya" | "The market experienced significant volatility" |
| **Peer-voice, not teacher-voice** | "Tune sahi socha" | "That is correct. Well done." |
| **Concrete before abstract** | "Woh company jo Maggi banati hai" | "FMCG sector constituent" |
| **Respect the skeptic** | "Yeh cheez samajhna genuinely complicated hai" | "It's actually quite simple!" |
| **Never shame the tip-chaser** | "Yeh tip interesting hai — chalte hain check karte hain" | "This is obviously a scam tip" |

---

### KPIs That Actually Measure Behavioral Change (Not Vanity Metrics)

| Metric | What It Measures | Target (Month 3) |
|---|---|---|
| **Tip-to-Question Rate** | % of users who input a tip and ask at least 1 follow-up question | >60% |
| **Identity Badge Retention** | % of users who return to the app after earning their first identity badge | >45% |
| **Simulation-to-Real Conversion** | % of simulated portfolio users who make a real ₹10+ investment | >15% |
| **Sach Ya Jhooth Streak 3+** | % of users who play 3+ consecutive cards in one session | >55% |
| **WhatsApp Share Rate** | % of Decode My Tip results shared externally | >20% |
| **D30 Retention** | Users active on day 30 who were also active on day 1 | >25% |

---

*Document version: 1.0 | Platform: dont-buy-yet | Audience: Internal product & design team*
