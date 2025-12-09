import { login, signup } from './actions'

// W9 Wireframe Implementation - Professional login page
export default function LoginPage({ searchParams }: { searchParams: { error?: string; message?: string } }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Logo Section - W9 Wireframe */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl text-white">🐾</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TracePaws</h1>
          <p className="text-lg text-gray-600">Chain of Custody Made Simple</p>
        </div>

        {/* Login Form Card - W9 Wireframe Layout */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Error/Success Messages */}
          {searchParams.error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <span className="text-red-500 text-xl mr-3">⚠️</span>
                <p className="text-red-700 text-sm">{decodeURIComponent(searchParams.error)}</p>
              </div>
            </div>
          )}
          
          {searchParams.message && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <span className="text-blue-500 text-xl mr-3">ℹ️</span>
                <p className="text-blue-700 text-sm">{decodeURIComponent(searchParams.message)}</p>
              </div>
            </div>
          )}

          <form className="space-y-6">
            <h2 className="text-xl font-bold text-center text-gray-900 mb-6">
              Welcome Back
            </h2>

            {/* Email Field - W9 Wireframe */}
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

            {/* Password Field - W9 Wireframe */}
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

            {/* Remember Me - W9 Wireframe */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-teal-600 hover:text-teal-500 font-medium">
                Forgot password?
              </a>
            </div>

            {/* Login Button - W9 Wireframe */}
            <button
              formAction={login}
              className="w-full h-14 bg-teal-600 text-white text-lg font-semibold rounded-xl hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 active:scale-[0.98]"
            >
              Log In
            </button>
          </form>

          {/* Signup Section - W9 Wireframe */}
          <div className="mt-8 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">Don't have an account?</p>
            <form>
              <button
                formAction={signup}
                className="w-full h-14 bg-gray-100 text-gray-700 text-lg font-semibold rounded-xl hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
              >
                Create Test Account
              </button>
            </form>
          </div>
        </div>

        {/* Trust Indicators - W9 Wireframe */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Secure login</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>No credit card</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>5 min setup</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}