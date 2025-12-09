import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function DashboardPage() {
  // Server-side authentication check
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (error || !user) {
    redirect('/login')
  }

  // Get user profile from your live database
  const { data: userProfile } = await supabase
    .from('users')
    .select('*, organization:organizations(*)')
    .eq('auth_id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header with user info */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to TracePaws! 🎉
              </h1>
              <p className="text-lg text-gray-600">
                Authentication working with server actions
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Logged in as:</p>
              <p className="font-semibold text-gray-900">{user.email}</p>
              {userProfile && (
                <p className="text-sm text-gray-600">
                  {userProfile.organization.name} • {userProfile.role}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Authentication Success Status */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Authentication Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">✅</span>
                <h3 className="text-lg font-semibold text-green-800">Server Auth</h3>
              </div>
              <p className="text-green-700">
                Server-side authentication working
                <br />
                <span className="text-sm text-green-600">Using @supabase/ssr</span>
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🔐</span>
                <h3 className="text-lg font-semibold text-blue-800">Session</h3>
              </div>
              <p className="text-blue-700">
                User session active
                <br />
                <span className="text-sm text-blue-600">Protected route working</span>
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🏢</span>
                <h3 className="text-lg font-semibold text-purple-800">Database</h3>
              </div>
              <p className="text-purple-700">
                User profile loaded
                <br />
                <span className="text-sm text-purple-600">Organization context ready</span>
              </p>
            </div>
          </div>
        </div>

        {/* User Information */}
        {userProfile && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">User Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Personal Details</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {userProfile.full_name || 'Not set'}</div>
                  <div><strong>Email:</strong> {userProfile.email}</div>
                  <div><strong>Role:</strong> <span className="capitalize">{userProfile.role}</span></div>
                  <div><strong>Status:</strong> {userProfile.is_active ? 'Active' : 'Inactive'}</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Organization</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {userProfile.organization.name}</div>
                  <div><strong>Plan:</strong> <span className="capitalize">{userProfile.organization.subscription_plan}</span></div>
                  <div><strong>Status:</strong> <span className="capitalize">{userProfile.organization.subscription_status}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">🎉 Authentication Working!</h3>
          <p className="text-lg mb-6">
            Server-side authentication successfully implemented with official Supabase patterns
          </p>
          <div className="space-y-2 text-teal-100 text-sm">
            <p>✅ @supabase/ssr package working</p>
            <p>✅ Server actions for authentication</p>
            <p>✅ Protected routes functional</p>
            <p>✅ Live database integration</p>
            <p>✅ Organization context loaded</p>
          </div>
          
          {/* Sign out form */}
          <form action="/auth/signout" method="post" className="mt-6">
            <button 
              type="submit"
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}