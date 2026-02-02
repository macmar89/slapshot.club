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
  labelKey: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

export const dashboardConfig = {
  sidebarNav: [
    {
      labelKey: 'overview',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      labelKey: 'matches',
      href: '/dashboard/matches',
      icon: Calendar,
    },
    {
      labelKey: 'leaderboard',
      href: '/dashboard/leaderboard',
      icon: Trophy,
    },
    {
      labelKey: 'leagues',
      href: '/dashboard/leagues',
      icon: Users,
    },
    {
      labelKey: 'rules',
      href: '/dashboard/rules',
      icon: FileText,
    },
    {
      labelKey: 'profile',
      href: '/account',
      icon: User,
    },
  ] as DashboardItem[],
}
