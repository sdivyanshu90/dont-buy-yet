export const MARKET_REPLAYS = [
  {
    id: 'paytm-rbi-2024',
    headline: 'Paytm ek mahine me 50%+ kyun gira?',
    stock: 'Paytm',
    move: '-52% in ~4 weeks',
    options: [
      { id: 'festival', text: 'UPI users ne app uninstall kar diya festive season ke baad', correct: false },
      { id: 'rbi', text: 'RBI action on Payments Bank ne trust aur operations hit kiye', correct: true },
      { id: 'bonus', text: 'Company ne bonus issue announce nahi kiya', correct: false },
    ],
    reveal:
      'Major trigger policy/regulatory tha. Jab regulator action leta hai, market valuation ko jaldi reset karta hai. Price move random nahi tha.',
    transferQuestion: 'Agle tip pe pehla sawaal: isme policy/regulatory risk hai kya?',
  },
  {
    id: 'irctc-fee-2021',
    headline: 'IRCTC ek din me sharp kyun toota?',
    stock: 'IRCTC',
    move: '-28% in 1 day',
    options: [
      { id: 'hack', text: 'Railway booking app hack ho gaya', correct: false },
      { id: 'govt', text: 'Govt fee-sharing policy change ne earnings fear create kiya', correct: true },
      { id: 'strike', text: 'Nationwide train strike hua', correct: false },
    ],
    reveal:
      'Monopoly companies bhi policy shocks se hil sakti hain. Business strong ho sakta hai, par policy headline short-term move karwati hai.',
    transferQuestion: 'Agle buy se pehle: company ka revenue kis external rule pe depend karta hai?',
  },
  {
    id: 'zomato-profitability',
    headline: 'Zomato crash ke baad wapas strong kaise hua?',
    stock: 'Zomato',
    move: '+120% in ~12 months',
    options: [
      { id: 'celebrity', text: 'Celebrity ads viral ho gaye', correct: false },
      { id: 'profit', text: 'Loss-to-profit shift + Blinkit growth narrative strong hua', correct: true },
      { id: 'split', text: 'Stock split se price artificial badha', correct: false },
    ],
    reveal:
      'Market ne sirf app popularity nahi, unit economics aur profitability trajectory ko re-price kiya. Story + numbers dono matter karte hain.',
    transferQuestion: 'Agle tip me check karo: growth ke saath profit path clear hai kya?',
  },
]
