import { login } from './actions'

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
              Staff Login
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

            {/* Login Button */}
            <button
              formAction={login}
              className="w-full h-14 bg-teal-600 text-white text-lg font-semibold rounded-xl hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200"
            >
              Log In
            </button>
          </form>

          {/* Test Users Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl">
            <h3 className="font-semibold text-blue-800 mb-2">Test Users (Live Database)</h3>
            <div className="space-y-1 text-sm text-blue-700">
              <div>• mike@thompsonpets.com (Owner)</div>
              <div>• sarah@thompsonpets.com (Admin)</div>
              <div>• jennifer@peacefulpaws.com (Owner)</div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Secure login</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Live database</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Server actions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}