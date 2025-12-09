import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl text-white">🐾</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TracePaws</h1>
          <p className="text-lg text-gray-600">Chain of Custody Made Simple</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form className="space-y-6">
            <h2 className="text-xl font-bold text-center text-gray-900 mb-6">
              Staff Authentication
            </h2>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                className="w-full h-14 px-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full h-14 px-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                autoComplete="current-password"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                formAction={login}
                className="w-full h-14 bg-teal-600 text-white text-lg font-semibold rounded-xl hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200"
              >
                Log In
              </button>
              
              <button
                formAction={signup}
                className="w-full h-14 bg-gray-100 text-gray-700 text-lg font-semibold rounded-xl hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
              >
                Create Test Account
              </button>
            </div>
          </form>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl">
            <h3 className="font-semibold text-blue-800 mb-2">Testing Instructions</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div><strong>Option 1:</strong> Create new test account with "Create Test Account"</div>
              <div><strong>Option 2:</strong> Use any email + password (will create if doesn't exist)</div>
              <div><strong>Testing:</strong> Try "test@tracepaws.com" + "testpassword123"</div>
            </div>
          </div>
        </div>

        {/* Database Info */}
        <div className="mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl">
          <h3 className="font-semibold text-gray-800 mb-2">Database Status</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div>✅ Live database users: 6 profiles created</div>
            <div>✅ Organizations: Thompson Pet, Peaceful Paws, Gentle Goodbye</div>
            <div>🔄 Auth users: Will be created when you sign up</div>
          </div>
        </div>
      </div>
    </div>
  )
}