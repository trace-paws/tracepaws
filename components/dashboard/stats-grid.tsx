'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Dashboard stats interface matching live database schema
interface DashboardStats {
  awaiting: number      // Pets with status 'received'
  in_progress: number   // Pets with status 'prepared', 'in_chamber', 'cremated', 'packaged'  
  ready: number         // Pets with status 'ready'
  today_intake: number  // Pets created today
}

interface StatsCardProps {
  title: string
  value: number
  icon: string
  variant: 'blue' | 'orange' | 'green' | 'purple'
  description: string
  change?: string
  onClick?: () => void
}

// Individual stat card component (W1/W2 wireframe implementation)
function StatsCard({ 
  title, 
  value, 
  icon, 
  variant, 
  description, 
  change, 
  onClick 
}: StatsCardProps) {
  const variantStyles = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200", 
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200"
  }

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
        onClick && "active:scale-[0.98]"
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        {/* Header - W1 wireframe layout */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            {title}
          </div>
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center text-xl border-2",
            variantStyles[variant]
          )}>
            {icon}
          </div>
        </div>

        {/* Value - large number from wireframes */}
        <div className={cn(
          "text-4xl font-bold mb-2",
          variant === 'blue' && "text-blue-600",
          variant === 'orange' && "text-orange-600",
          variant === 'green' && "text-green-600", 
          variant === 'purple' && "text-purple-600"
        )}>
          {value.toLocaleString()}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-2">{description}</p>

        {/* Change indicator */}
        {change && (
          <p className={cn(
            "text-xs font-medium",
            change.startsWith('+') ? "text-green-600" : "text-red-600"
          )}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// Main stats grid component
interface StatsGridProps {
  stats: DashboardStats
  onStatClick?: (filter: string) => void
  loading?: boolean
}

export function StatsGrid({ stats, onStatClick, loading }: StatsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      id: 'awaiting',
      title: 'Awaiting',
      value: stats.awaiting || 0,
      icon: '⏳',
      variant: 'blue' as const,
      description: 'Pets received, waiting',
      change: stats.awaiting > 0 ? `${stats.awaiting} waiting` : 'No pets waiting',
      action: () => onStatClick?.('received')
    },
    {
      id: 'progress', 
      title: 'In Progress',
      value: stats.in_progress || 0,
      icon: '🔥',
      variant: 'orange' as const,
      description: 'Being processed',
      change: stats.in_progress > 0 ? 'Active workflows' : 'No active workflows',
      action: () => onStatClick?.('"prepared","in_chamber","cremated","packaged"')
    },
    {
      id: 'ready',
      title: 'Ready', 
      value: stats.ready || 0,
      icon: '✅',
      variant: 'green' as const,
      description: 'Awaiting pickup',
      change: stats.ready > 0 ? 'Ready for families' : 'None ready',
      action: () => onStatClick?.('ready')
    },
    {
      id: 'today',
      title: 'Today',
      value: stats.today_intake || 0,
      icon: '📈',
      variant: 'purple' as const, 
      description: 'New intakes',
      change: stats.today_intake > 0 ? 'Active day' : 'Quiet day',
      action: () => onStatClick?.('today')
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <StatsCard 
          key={stat.id} 
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          variant={stat.variant}
          description={stat.description}
          change={stat.change}
          onClick={stat.action}
        />
      ))}
    </div>
  )
}