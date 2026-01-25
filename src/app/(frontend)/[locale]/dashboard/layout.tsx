import React from 'react'
export const dynamic = 'force-dynamic'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Container } from '@/components/ui/Container'
import { DashboardNav } from '@/components/layout/DashboardNav'
import { Header } from '@/components/layout/Header'
import { MobileTabNav } from '@/components/layout/MobileTabNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full relative">
      <Header />
      <MobileTabNav />

      {/* Floating Sidebar - Left side, detached from edges */}
      <aside className="fixed left-4 top-20 bottom-4 w-64 z-40 hidden lg:block">
        <IceGlassCard className="h-full w-full flex flex-col p-4" backdropBlur="md">
          <DashboardNav />
        </IceGlassCard>
      </aside>

      {/* Main Content Area */}
      <main className="pt-4 md:pt-20 lg:pl-72 min-h-screen pb-8">
        <Container className="h-full">{children}</Container>
      </main>
    </div>
  )
}
