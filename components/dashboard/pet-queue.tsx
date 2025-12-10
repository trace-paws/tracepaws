'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Pet interface matching live database schema
interface Pet {
  id: string
  tracking_id: string
  name: string
  pet_type: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other'
  breed?: string
  owner_first_name: string
  owner_last_name: string
  owner_full_name: string
  owner_email: string
  owner_phone?: string
  service_type: 'private' | 'individual' | 'communal'
  status: 'received' | 'prepared' | 'in_chamber' | 'cremated' | 'packaged' | 'ready' | 'completed'
  created_at: string
  created_by_name?: string
}

interface PetQueueProps {
  pets: Pet[]
  onPetClick?: (pet: Pet) => void
  onNextStepClick?: (pet: Pet) => void
  loading?: boolean
}

// Get emoji for pet type
function getPetEmoji(petType: string): string {
  const emojis = {
    dog: '🐕',
    cat: '🐱', 
    bird: '🐦',
    rabbit: '🐰',
    other: '🐾'
  }
  return emojis[petType as keyof typeof emojis] || '🐾'
}

// Get status configuration with colors and labels
function getStatusConfig(status: string) {
  const configs = {
    received: { 
      icon: '⏳', 
      label: 'Received', 
      className: 'bg-blue-100 text-blue-700 border-blue-200',
      bgColor: 'bg-blue-50'
    },
    prepared: { 
      icon: '🔄', 
      label: 'In Progress', 
      className: 'bg-orange-100 text-orange-700 border-orange-200',
      bgColor: 'bg-orange-50'
    },
    in_chamber: { 
      icon: '🔥', 
      label: 'In Chamber', 
      className: 'bg-red-100 text-red-700 border-red-200',
      bgColor: 'bg-red-50'
    },
    cremated: { 
      icon: '✨', 
      label: 'Cremated', 
      className: 'bg-purple-100 text-purple-700 border-purple-200',
      bgColor: 'bg-purple-50'
    },
    packaged: { 
      icon: '📦', 
      label: 'Packaged', 
      className: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      bgColor: 'bg-indigo-50'
    },
    ready: { 
      icon: '✅', 
      label: 'Ready', 
      className: 'bg-green-100 text-green-700 border-green-200',
      bgColor: 'bg-green-50'
    },
    completed: { 
      icon: '✓', 
      label: 'Completed', 
      className: 'bg-gray-100 text-gray-700 border-gray-200',
      bgColor: 'bg-gray-50'
    }
  }
  return configs[status as keyof typeof configs] || configs.received
}

// Format time ago
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Just now'
  if (diffInHours === 1) return '1 hour ago'
  if (diffInHours < 24) return `${diffInHours} hours ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return '1 day ago'
  return `${diffInDays} days ago`
}

// Individual pet card component for queue
function PetQueueCard({ pet, onPetClick, onNextStepClick }: {
  pet: Pet
  onPetClick?: (pet: Pet) => void
  onNextStepClick?: (pet: Pet) => void
}) {
  const statusConfig = getStatusConfig(pet.status)
  const timeSinceCreated = formatTimeAgo(pet.created_at)

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md hover:border-[#0f766e]/50 active:scale-[0.98]"
      onClick={() => onPetClick?.(pet)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Pet Avatar - W1 wireframe style */}
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0",
            pet.pet_type === 'dog' && "bg-blue-100 text-blue-600",
            pet.pet_type === 'cat' && "bg-purple-100 text-purple-600",
            pet.pet_type === 'bird' && "bg-orange-100 text-orange-600",
            pet.pet_type === 'rabbit' && "bg-green-100 text-green-600"
          )}>
            {getPetEmoji(pet.pet_type)}
          </div>

          <div className="flex-1 min-w-0">
            {/* Pet Details - W1 wireframe layout */}
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-base truncate">{pet.name}</h3>
              <div className="text-xs font-mono text-gray-500 shrink-0">
                {pet.tracking_id}
              </div>
            </div>
            
            <p className="text-sm text-gray-600">
              {pet.breed || pet.pet_type} • {pet.service_type}
            </p>
            <p className="text-sm text-gray-600">
              Owner: {pet.owner_full_name}
            </p>
            
            {/* Status Badge - W1 wireframe */}
            <div className="flex items-center justify-between mt-2">
              <div className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                statusConfig.className
              )}>
                {statusConfig.icon} {statusConfig.label}
              </div>
              <span className="text-xs text-gray-500">
                {timeSinceCreated}
              </span>
            </div>
          </div>

          {/* Next Step Button */}
          {pet.status !== 'completed' && onNextStepClick && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                onNextStepClick(pet)
              }}
              className="shrink-0"
            >
              Next Step →
            </Button>
          )}
        </div>

        {/* Timestamp Details - W1 wireframe bottom section */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Received: {new Date(pet.created_at).toLocaleDateString()} at {new Date(pet.created_at).toLocaleTimeString()}
            {pet.created_by_name && ` by ${pet.created_by_name}`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Main pet queue component
export function PetQueue({ pets, onPetClick, onNextStepClick, loading }: PetQueueProps) {
  // Filter today's pets
  const today = new Date().toDateString()
  const todaysPets = pets.filter(pet => 
    new Date(pet.created_at).toDateString() === today
  )

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Queue</CardTitle>
          <CardDescription>Loading pets...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Today's Queue</CardTitle>
            <CardDescription>
              {todaysPets.length} pet{todaysPets.length !== 1 ? 's' : ''} currently in your care
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            View all →
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {todaysPets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-3">🐾</div>
            <h4 className="font-semibold mb-2">No pets today</h4>
            <p className="text-sm text-gray-400 mb-4">
              No new intakes yet today
            </p>
            <Button className="bg-[#0f766e] hover:bg-[#0d665c]">
              + New Intake
            </Button>
          </div>
        ) : (
          <>
            {todaysPets.slice(0, 5).map((pet) => (
              <PetQueueCard 
                key={pet.id}
                pet={pet}
                onPetClick={onPetClick}
                onNextStepClick={onNextStepClick}
              />
            ))}
            
            {todaysPets.length > 5 && (
              <Button variant="outline" className="w-full">
                See all {todaysPets.length} pets today
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}