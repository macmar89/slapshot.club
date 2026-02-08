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
        <IceGlassCard className="h-full w-full" backdropBlur="md">
          <div className="flex flex-col h-full p-4">
            <DashboardNav />
            <div className="mt-auto pt-6 border-t border-white/5">
              <FeedbackModal triggerClassName="w-full">
                <div className="flex items-center gap-3 px-4 py-3 rounded-app bg-warning/5 border border-warning/10 text-warning/60 hover:text-warning hover:bg-warning/10 hover:border-warning/20 transition-all cursor-pointer group/feedback">
                  <MessageSquarePlus className="w-5 h-5 transition-transform group-hover/feedback:scale-110" />
                  <span className="uppercase tracking-widest font-black text-[10px]">Feedback</span>
                </div>
              </FeedbackModal>
            </div>
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
