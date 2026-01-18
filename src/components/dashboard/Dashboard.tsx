import React from 'react'

export const Dashboard = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Vitaj späť!</h1>
        <p className="text-white/60">Tvoj prehľad aktivít a zápasov.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder Cards */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 h-40 flex items-center justify-center text-white/40">
          Widget 1
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 h-40 flex items-center justify-center text-white/40">
          Widget 2
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 h-40 flex items-center justify-center text-white/40">
          Widget 3
        </div>
      </div>
    </div>
  )
}
