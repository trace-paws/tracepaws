'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

// Navigation items matching W1 wireframe
interface NavItem {
  id: string
  label: string
  icon: string
  href: string
  badge?: number
  activePattern?: string
}

interface MobileNavProps {
  badgeCounts?: {
    pets?: number
    ready?: number
    notifications?: number
  }
}

export function MobileNavigation({ badgeCounts }: MobileNavProps) {
  const pathname = usePathname()
  
  const navItems: NavItem[] = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: '🏠', 
      href: '/dashboard',
      activePattern: '/dashboard'
    },
    { 
      id: 'pets', 
      label: 'Pets', 
      icon: '🐾', 
      href: '/pets', 
      badge: badgeCounts?.pets,
      activePattern: '/pets'
    },
    { 
      id: 'new', 
      label: 'New', 
      icon: '➕', 
      href: '/pets/new'
    },
    { 
      id: 'ready', 
      label: 'Ready', 
      icon: '✅', 
      href: '/ready', 
      badge: badgeCounts?.ready,
      activePattern: '/ready'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: '⚙️', 
      href: '/settings',
      activePattern: '/settings'
    }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
                          (item.activePattern && pathname.startsWith(item.activePattern))
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 relative min-w-[60px]",
                isActive 
                  ? "bg-[#0f766e]/10 text-[#0f766e]" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              )}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
              
              {/* Badge for counts - W1 wireframe */}
              {item.badge && item.badge > 0 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {item.badge > 99 ? '99+' : item.badge}
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

// Quick actions floating button for primary actions
export function QuickActionButton() {
  return (
    <div className="fixed bottom-20 right-4 z-40">
      <Link href="/pets/new">
        <div className="w-14 h-14 bg-[#0f766e] hover:bg-[#0d665c] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95">
          <span className="text-xl">➕</span>
        </div>
      </Link>
    </div>
  )
}