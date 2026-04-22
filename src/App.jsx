import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home'
import SachYaJhooth from './components/SachYaJhooth'
import YehStockKyaKartaHai from './components/YehStockKyaKartaHai'
import DecodeTip from './components/DecodeTip'
import Onboarding from './components/Onboarding'
import TipTrial from './components/TipTrial'
import MarketReplay from './components/MarketReplay'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-stone-100 text-gray-900">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,107,53,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(15,31,61,0.1),_transparent_30%),linear-gradient(180deg,_#f7f4ef_0%,_#f3efe7_100%)]" />
        <div className="relative min-h-screen px-0 py-0 sm:px-4 sm:py-4 lg:px-8 lg:py-6">
          <div className="mx-auto min-h-screen w-full max-w-7xl overflow-hidden bg-white shadow-[0_24px_80px_rgba(15,31,61,0.12)] sm:min-h-[calc(100vh-2rem)] sm:rounded-[32px] sm:border sm:border-white/70 lg:min-h-[calc(100vh-3rem)]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/sach-ya-jhooth" element={<SachYaJhooth />} />
            <Route path="/yeh-stock" element={<YehStockKyaKartaHai />} />
            <Route path="/decode-tip" element={<DecodeTip />} />
            <Route path="/tip-trial" element={<TipTrial />} />
            <Route path="/market-replay" element={<MarketReplay />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  )
}
