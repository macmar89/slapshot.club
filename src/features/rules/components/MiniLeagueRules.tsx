'use client'

import React from 'react'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Users, Crown, Shield, Info } from 'lucide-react'

export function MiniLeagueRules() {
  return (
    <IceGlassCard className="p-6 md:p-8 space-y-8">
      <section>
        <h2 className="text-2xl font-black uppercase text-warning mb-6 flex items-center gap-3">
          <Users className="w-6 h-6" />
          Typy Predplatného
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-4">Free</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex gap-2"><span className="text-destructive font-bold">✕</span> Nemôže vytvárať ligy</li>
              <li className="flex gap-2"><span className="text-emerald-500 font-bold">✓</span> Max 1 pripojená liga (s kódom)</li>
            </ul>
          </div>

          {/* Pro */}
          <div className="bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-blue-400" />
              <h3 className="text-xl font-bold text-blue-100">Pro</h3>
            </div>
            <ul className="space-y-3 text-sm text-blue-100/70">
              <li className="flex gap-2"><span className="text-emerald-400 font-bold">✓</span> Vytvorí max 2 ligy</li>
              <li className="flex gap-2"><span className="text-emerald-400 font-bold">✓</span> Max 5 líg súčasne</li>
              <li className="flex gap-2"><span className="text-blue-300 font-bold">ℹ</span> Označenie "C" (Kapitán) vo vlastnej</li>
              <li className="flex gap-2"><span className="text-blue-300 font-bold">ℹ</span> Označenie "A" (Asistent) v cudzej</li>
            </ul>
          </div>

          {/* VIP */}
          <div className="bg-gradient-to-br from-warning/10 to-transparent rounded-xl p-6 border border-warning/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Crown className="w-24 h-24 rotate-12" />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-warning" />
              <h3 className="text-xl font-bold text-warning">VIP</h3>
            </div>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex gap-2"><span className="text-warning font-bold">✓</span> Vytvorí max 5 líg</li>
              <li className="flex gap-2"><span className="text-warning font-bold">✓</span> Max 10 líg súčasne</li>
              <li className="flex gap-2"><span className="text-warning font-bold">ℹ</span> Označenie "C" aj "A"</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-black uppercase text-white mb-4 flex items-center gap-3">
          <Info className="w-5 h-5 text-white/50" />
          Kapacita Líg
        </h2>
        <div className="bg-black/20 rounded-xl p-6 border border-white/5">
          <p className="text-white/80 leading-relaxed max-w-2xl">
            Hráči vytvárajú vždy <strong>súkromné</strong> mini ligy. Kapacita ligy nie je fixná, ale <strong>dynamická</strong>.
          </p>
          <div className="mt-4 p-4 bg-warning/5 border border-warning/10 rounded-lg">
            <p className="text-warning font-bold text-lg mb-2">Pravidlo kapacity</p>
            <ul className="text-white/70 text-sm space-y-2">
              <li>• **Pro** člen navýši kapacitu o **5 miest** (1 pre seba + 4 Free).</li>
              <li>• **VIP** člen navýši kapacitu o **10 miest** (1 pre seba + 9 Free).</li>
            </ul>
            <p className="text-white/40 text-xs mt-2 italic">
              Čím viac platiacich hráčov v lige máte, tým väčšia je jej kapacita pre ostatných.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-black uppercase text-white mb-4">
          Právomoci Majiteľa
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="font-bold text-white mb-1">Invite Kód</h4>
            <p className="text-xs text-white/50">Iba majiteľ vidí kód na pozývanie.</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="font-bold text-white mb-1">Schvaľovanie</h4>
            <p className="text-xs text-white/50">Majiteľ musí potvrdiť každého nového člena (Waiting List).</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="font-bold text-white mb-1">Správa</h4>
            <p className="text-xs text-white/50">Môže vyhodiť člena alebo zrušiť ligu.</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="font-bold text-white mb-1">Presun</h4>
            <p className="text-xs text-white/50">Môže odovzdať "kapitánsku pásku" inému.</p>
          </div>
        </div>
      </section>
    </IceGlassCard>
  )
}
