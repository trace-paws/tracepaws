'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth/auth-provider'

// Navigation section structure from W2 wireframe
interface NavigationSection {
  title: string
  items: NavigationItem[]
}

interface NavigationItem {
  label: string
  href: string
  icon: string
  badge?: number
  requiresRole?: ('owner' | 'admin' | 'staff')[]
}

interface SidebarProps {
  badgeCounts?: {
    pets?: number
    ready?: number
    reports?: number
  }
}

export function Sidebar({ badgeCounts }: SidebarProps) {
  const { profile, organization, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const navigationSections: NavigationSection[] = [
    {
      title: "Main",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: "🏠" },
        { label: "All Pets", href: "/pets", icon: "🐾", badge: badgeCounts?.pets },
        { label: "Today's Queue", href: "/pets?filter=today", icon: "📋" },
        { label: "Ready for Pickup", href: "/ready", icon: "✅", badge: badgeCounts?.ready },
        { label: "Completed", href: "/pets?filter=completed", icon: "📦" }
      ]
    },
    {
      title: "Analytics", 
      items: [
        { label: "Reports", href: "/reports", icon: "📊", badge: badgeCounts?.reports },
        { label: "Analytics", href: "/analytics", icon: "📈" }
      ]
    },
    {
      title: "Management",
      items: [
        { label: "Team", href: "/settings/team", icon: "👥" },
        { label: "Organization", href: "/settings/organization", icon: "🏢" },
        { label: "Billing", href: "/settings/billing", icon: "💳", requiresRole: ['owner'] }
      ]
    }
  ]

  // Get user initials for avatar
  const userInitials = profile ? 
    `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() :
    profile?.email?.[0]?.toUpperCase() || 'U'

  return (
    <div className="w-72 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header - W2 wireframe */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-[#0f766e] rounded-xl flex items-center justify-center text-white text-lg">
            🐾
          </div>
          <span className="text-xl font-bold text-gray-900">TracePaws</span>
        </div>
        <p className="text-sm text-gray-600 truncate">
          {organization?.name || 'Loading...'}
        </p>
        <div className="text-xs text-gray-500 mt-1">
          {organization?.subscription_plan} plan • {organization?.subscription_status}
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-4">
        {navigationSections.map((section) => (
          <div key={section.title} className="mb-8">
            <h3 className="px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <nav className="space-y-1 px-3">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                const hasPermission = !item.requiresRole || 
                                    item.requiresRole.includes(profile?.role || 'staff')
                
                if (!hasPermission) return null

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-[#0f766e]/10 text-[#0f766e] border-r-2 border-[#0f766e]" 
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && item.badge > 0 && (
                      <div className={cn(
                        "h-5 px-2 text-xs rounded-full flex items-center justify-center",
                        isActive ? "bg-[#0f766e] text-white" : "bg-gray-200 text-gray-700"
                      )}>
                        {item.badge > 99 ? '99+' : item.badge}
                      </div>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* User Section - W2 wireframe */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
          <div className="w-10 h-10 bg-[#0f766e] rounded-full flex items-center justify-center text-white text-sm font-medium">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {profile?.full_name || profile?.email || 'User'}
            </p>
            <p className="text-xs text-gray-500">
              {profile?.role} • Online
            </p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await signOut()
                router.push('/login')
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="text-sm">🚪</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}