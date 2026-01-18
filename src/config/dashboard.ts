import {
  LayoutDashboard,
  Calendar,
  Table,
  Users,
  Settings,
  Trophy,
  FileText,
  User,
} from 'lucide-react'

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
      title: 'Rebríček',
      href: '/dashboard/leaderboard',
      icon: Trophy,
    },
    {
      title: 'Pravidlá',
      href: '/dashboard/rules',
      icon: FileText,
    },
    {
      title: 'Profil',
      href: '/dashboard/profile',
      icon: User,
    },
    {
      title: 'Nastavenia',
      href: '/dashboard/settings',
      icon: Settings,
    },
  ] as DashboardItem[],
}
