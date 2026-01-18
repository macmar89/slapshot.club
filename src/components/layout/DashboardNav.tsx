import React from 'react'
import { dashboardConfig } from '@/config/dashboard'

export function DashboardNav() {
  return (
    <nav className="flex flex-col gap-2 mt-4">
      {dashboardConfig.sidebarNav.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="flex gap-3 px-4 py-3 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium uppercase tracking-wider"
        >
          <item.icon className="w-5 h-5" />
          {item.title}
        </a>
      ))}
    </nav>
  )
}
