import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Get user profile and organization
  const { data: userProfile } = await supabase
    .from('users')
    .select('*, organization:organizations(*)')
    .eq('auth_id', user.id)
    .single()

  // Get live dashboard stats
  const { data: stats } = await supabase
    .from('dashboard_stats')
    .select('*')
    .eq('organization_id', userProfile?.organization_id)
    .single()

  // Get today's pets for queue
  const { data: todaysPets } = await supabase
    .from('pets')
    .select(`
      id, tracking_id, name, pet_type, breed, 
      owner_full_name, status, service_type, created_at,
      created_by_user:users!pets_created_by_fkey(full_name)
    `)
    .eq('organization_id', userProfile?.organization_id)
    .gte('created_at', new Date().toISOString().split('T')[0])
    .order('created_at', { ascending: false })
    .limit(10)

  const getPetEmoji = (petType: string) => {
    const emojis = { dog: '🐕', cat: '🐱', bird: '🐦', rabbit: '🐰', other: '🐾' }
    return emojis[petType as keyof typeof emojis] || '🐾'
  }

  const getStatusColor = (status: string) => {
    const colors = {
      received: 'bg-blue-100 text-blue-700',
      prepared: 'bg-orange-100 text-orange-700', 
      in_chamber: 'bg-red-100 text-red-700',
      cremated: 'bg-purple-100 text-purple-700',
      packaged: 'bg-indigo-100 text-indigo-700',
      ready: 'bg-green-100 text-green-700',
      completed: 'bg-gray-100 text-gray-700'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - W1/W2 Wireframe */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm">🐾</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}!
                </h1>
                <p className="text-sm text-gray-600">{userProfile?.organization?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userProfile?.full_name}</p>
                <p className="text-xs text-gray-500 capitalize">{userProfile?.role}</p>
              </div>
              <form action="/auth/signout" method="post">
                <button 
                  type="submit"
                  className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded border"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Grid - W1/W2 Wireframe Implementation */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Awaiting</p>
                <p className="text-3xl font-bold text-blue-600">{stats?.pets_received || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl">⏳</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Pets received, waiting</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-orange-600">{stats?.pets_in_progress || 0}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🔥</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Being processed</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ready</p>
                <p className="text-3xl font-bold text-green-600">{stats?.pets_ready || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Awaiting pickup</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-3xl font-bold text-purple-600">{stats?.pets_today || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl">📈</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">New intakes</p>
          </div>
        </div>

        {/* Today's Queue - W1/W2 Wireframe */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Today's Queue</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">{todaysPets?.length || 0} pets today</span>
                <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                  + New Intake
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {todaysPets && todaysPets.length > 0 ? (
              <div className="space-y-4">
                {todaysPets.map((pet) => (
                  <div key={pet.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                          {getPetEmoji(pet.pet_type)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">{pet.name}</h3>
                            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {pet.tracking_id}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {pet.breed && `${pet.breed} • `}{pet.pet_type} • {pet.service_type}
                          </p>
                          <p className="text-sm text-gray-600">
                            Owner: {pet.owner_full_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Created: {new Date(pet.created_at).toLocaleTimeString()} by {pet.created_by_user?.full_name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(pet.status)}`}>
                          {pet.status.replace('_', ' ')}
                        </span>
                        <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                          Next Step →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-gray-400">🐾</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pets today yet</h3>
                <p className="text-gray-600 mb-4">No new intakes have been registered today.</p>
                <button className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors">
                  + Register First Pet
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow text-left">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl">📝</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">New Pet Intake</h3>
                <p className="text-sm text-gray-600">Register a new pet</p>
              </div>
            </div>
          </button>

          <button className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow text-left">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl">📷</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Document Checkpoint</h3>
                <p className="text-sm text-gray-600">Add photos and notes</p>
              </div>
            </div>
          </button>

          <button className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow text-left">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View Reports</h3>
                <p className="text-sm text-gray-600">Analytics and insights</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}