import React from 'react' // Added background adjustment details.
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Container } from '@/components/ui/Container'
import { DashboardNav } from '@/components/dashboard/DashboardNav'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full relative">
      <DashboardHeader />

      {/* Floating Sidebar - Left side, detached from edges */}
      <aside className="fixed left-4 top-20 bottom-4 w-64 z-40 hidden lg:block">
        <IceGlassCard className="h-full w-full flex flex-col p-4" backdropBlur="md">
          <DashboardNav />
        </IceGlassCard>
      </aside>

      {/* Main Content Area */}
      <main className="pt-20 lg:pl-72 min-h-screen pb-8">
        <Container className="h-full">{children}</Container>
      </main>
    </div>
  )
}
