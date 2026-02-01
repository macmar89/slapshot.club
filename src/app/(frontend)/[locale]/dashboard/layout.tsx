import React from 'react'
export const dynamic = 'force-dynamic'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Container } from '@/components/ui/Container'
import { DashboardNav } from '@/components/layout/DashboardNav'
import { Header } from '@/components/layout/Header'
import { MobileTabNav } from '@/components/layout/MobileTabNav'
import { FeedbackModal } from '@/components/feedback/FeedbackModal'
import { MessageSquarePlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full relative">
      <Header />
      <MobileTabNav />

      {/* Bottom Fade Gradient for Mobile - Taller and Smoother */}
      <div className="fixed bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-slate-950 via-slate-950/80 via-slate-950/40 to-transparent pointer-events-none z-40 lg:hidden" />

      {/* Floating Sidebar - Left side, detached from edges */}
      <aside className="fixed left-4 top-20 bottom-4 w-64 z-40 hidden lg:block">
        <IceGlassCard className="h-full w-full flex flex-col p-4" backdropBlur="md">
          <DashboardNav />
          <div className="mt-auto pt-4 border-t border-white/5">
            <FeedbackModal triggerClassName="w-full flex gap-3 text-white/40 hover:text-white justify-start px-4 py-3 uppercase tracking-wider font-bold text-xs hover:bg-white/5 transition-all">
              <div className="flex items-center gap-3 cursor-pointer">
                <MessageSquarePlus className="w-5 h-5" />
                <span>Feedback</span>
              </div>
            </FeedbackModal>
          </div>
        </IceGlassCard>
      </aside>

      {/* Main Content Area */}
      <main className="pt-4 md:pt-20 lg:pl-72 min-h-screen pb-32 md:pb-0">
        <Container className="h-full">{children}</Container>
      </main>
    </div>
  )
}
