'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-provider'
import { ProtectedRoute } from '@/lib/auth/protected-route'
import { DatabaseClient } from '@/lib/api/database-client'
import { StatsGrid } from '@/components/dashboard/stats-grid'
import { PetQueue } from '@/components/dashboard/pet-queue'
import { MobileNavigation, QuickActionButton } from '@/components/dashboard/navigation/mobile-nav'
import { Sidebar } from '@/components/dashboard/navigation/sidebar'
import { ErrorBoundary } from '@/components/error-boundary'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Dashboard stats interface
interface DashboardStats {
  awaiting: number
  in_progress: number
  ready: number
  today_intake: number
}

// Pet interface for queue display
interface Pet {
  id: string
  tracking_id: string
  name: string
  pet_type: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other'
  breed?: string
  owner_full_name: string
  service_type: string
  status: string
  created_at: string
  created_by_name?: string
}

function DashboardContent() {
  const { profile, organization } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    awaiting: 0,
    in_progress: 0,
    ready: 0,
    today_intake: 0
  })
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load dashboard data
  useEffect(() => {
    async function loadDashboardData() {
      if (!organization?.id) return

      try {
        setLoading(true)
        setError(null)

        // Get dashboard stats using our database client
        const statsData = await DatabaseClient.getDashboardStats(organization.id)
        setStats(statsData)

        // Get recent pets for queue display
        const petsData = await DatabaseClient.getPetsList(organization.id, {
          limit: 20
        })
        setPets(petsData)

      } catch (err) {
        console.error('Dashboard data loading error:', err)
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [organization?.id])

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  // Handle stat card clicks for filtering
  const handleStatClick = (filter: string) => {
    router.push(`/pets?filter=${filter}`)
  }

  // Handle pet actions
  const handlePetClick = (pet: Pet) => {
    router.push(`/pets/${pet.id}`)
  }

  const handleNextStepClick = (pet: Pet) => {
    router.push(`/pets/${pet.id}/checkpoint`)
  }

  // Calculate badge counts for navigation
  const badgeCounts = {
    pets: pets.filter(p => p.status !== 'completed').length,
    ready: stats.ready
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Dashboard Error</CardTitle>
            <CardDescription>
              Unable to load dashboard data: {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Layout - W2 wireframe */}
      <div className="hidden lg:flex h-screen bg-gray-50">
        <Sidebar badgeCounts={badgeCounts} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Desktop Header */}
          <div className="bg-white border-b border-gray-200 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {getGreeting()}, {profile?.first_name || 'there'}! ☀️
                </h1>
                <p className="text-gray-600 mt-1">
                  {organization?.name} • {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Live</span>
                </div>
                <Button className="bg-[#0f766e] hover:bg-[#0d665c]">
                  + New Intake
                </Button>
              </div>
            </div>
          </div>

          {/* Desktop Main Content */}
          <main className="flex-1 overflow-y-auto p-8">
            {/* Stats Row - W2 wireframe top cards */}
            <div className="mb-8">
              <StatsGrid 
                stats={stats} 
                onStatClick={handleStatClick}
                loading={loading}
              />
            </div>

            {/* Content Grid - W2 wireframe two-column layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Today's Queue - W2 left panel */}
              <div className="xl:col-span-2">
                <PetQueue 
                  pets={pets}
                  onPetClick={handlePetClick}
                  onNextStepClick={handleNextStepClick}
                  loading={loading}
                />
              </div>

              {/* Quick Actions Panel */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full justify-start bg-[#0f766e] hover:bg-[#0d665c]"
                      onClick={() => router.push('/pets/new')}
                    >
                      <span className="mr-3">📝</span>
                      New Pet Intake
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => router.push('/ready')}
                    >
                      <span className="mr-3">✅</span>
                      Ready for Pickup ({stats.ready})
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => router.push('/reports')}
                    >
                      <span className="mr-3">📊</span>
                      View Reports
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Layout - W1 wireframe */}
      <div className="lg:hidden min-h-screen bg-gray-50 pb-20">
        {/* Mobile Header - W1 wireframe top section */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {getGreeting()}, {profile?.first_name || 'there'}! ☀️
                </h1>
                <p className="text-sm text-gray-600">
                  {organization?.name}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-600">Live</span>
                </div>
                <div className="w-8 h-8 bg-[#0f766e] rounded-full flex items-center justify-center text-white text-sm">
                  {profile?.first_name?.[0] || 'U'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Stats Grid - W1 wireframe cards */}
        <div className="px-4 py-6">
          <StatsGrid 
            stats={stats} 
            onStatClick={handleStatClick}
            loading={loading}
          />
        </div>

        {/* Mobile Pet Queue - W1 wireframe list */}
        <div className="px-4">
          <PetQueue 
            pets={pets}
            onPetClick={handlePetClick}
            onNextStepClick={handleNextStepClick}
            loading={loading}
          />
        </div>

        {/* Mobile Navigation - W1 wireframe bottom */}
        <MobileNavigation badgeCounts={badgeCounts} />
        
        {/* Quick Action Button */}
        <QuickActionButton />
      </div>
    </>
  )
}

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <ProtectedRoute requiredRole={['owner', 'admin', 'staff']}>
        <DashboardContent />
      </ProtectedRoute>
    </ErrorBoundary>
  )
}