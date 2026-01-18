import { LayoutDashboard, Calendar, Table, Users, Settings } from 'lucide-react'

export interface DashboardItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

export const dashboardConfig = {
  sidebarNav: [
    {
      title: 'Prehľad',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Zápasy',
      href: '/dashboard/matches',
      icon: Calendar,
    },
    {
      title: 'Tabuľky',
      href: '/dashboard/tables',
      icon: Table,
    },
    {
      title: 'Tímy',
      href: '/dashboard/teams',
      icon: Users,
    },
    {
      title: 'Nastavenia',
      href: '/dashboard/settings',
      icon: Settings,
    },
  ] as DashboardItem[],
}
