'use client'

import { useEffect, useState } from 'react'

interface TestResults {
  success: boolean
  tests: {
    database?: any
    environment?: any  
    live_data?: any
    stripe_pricing?: any
    storage?: any
  }
  error?: string
}

export default function TestIntegrationsPage() {
  const [results, setResults] = useState<TestResults | null>(null)
  const [loading, setLoading] = useState(false)

  const runTests = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-connection')
      const data = await response.json()
      setResults(data)
    } catch (error) {
      setResults({
        success: false,
        tests: {},
        error: 'Failed to connect to test API'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200'
      case 'configured': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🧪 TracePaws Integration Tests
          </h1>
          <p className="text-gray-600">
            Verifying connections to all live systems
          </p>
          <button
            onClick={runTests}
            disabled={loading}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '🔄 Testing...' : '🧪 Run Tests'}
          </button>
        </div>

        {results && (
          <div className="grid gap-6">
            {/* Overall Status */}
            <div className={`p-6 rounded-xl border-2 ${results.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <h2 className="text-xl font-bold mb-2">
                {results.success ? '✅ All Systems Operational' : '❌ Issues Detected'}
              </h2>
              <p className="text-sm text-gray-600">
                {results.success 
                  ? 'All integrations working correctly. Ready for development!'
                  : results.error || 'Some systems need attention before development.'}
              </p>
            </div>

            {/* Database Test */}
            {results.tests.database && (
              <div className={`p-6 rounded-xl border ${getStatusColor(results.tests.database.status)}`}>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="mr-2">🗄️</span>
                  Database Connection (Supabase)
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Status:</strong> {results.tests.database.status}</p>
                  <p><strong>Data:</strong> {results.tests.database.data}</p>
                  {results.tests.database.organizations && (
                    <div>
                      <strong>Live Organizations:</strong>
                      <ul className="mt-2 ml-4">
                        {results.tests.database.organizations.map((org: any, i: number) => (
                          <li key={i}>• {org.name} ({org.plan} plan)</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {results.tests.database.error && (
                    <p><strong>Error:</strong> {results.tests.database.error}</p>
                  )}
                </div>
              </div>
            )}

            {/* Live Pet Data */}
            {results.tests.live_data && (
              <div className={`p-6 rounded-xl border ${getStatusColor(results.tests.live_data.status)}`}>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="mr-2">🐾</span>
                  Live Pet Data
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Status:</strong> {results.tests.live_data.status}</p>
                  <p><strong>Data:</strong> {results.tests.live_data.data}</p>
                  {results.tests.live_data.sample_pets && (
                    <div>
                      <strong>Sample Pets:</strong>
                      <ul className="mt-2 ml-4">
                        {results.tests.live_data.sample_pets.map((pet: any, i: number) => (
                          <li key={i}>• {pet.name} ({pet.tracking_id}) - {pet.status}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stripe Configuration */}
            {results.tests.stripe_pricing && (
              <div className={`p-6 rounded-xl border ${getStatusColor(results.tests.stripe_pricing.status)}`}>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="mr-2">💳</span>
                  Stripe Pricing Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Starter Plan</h4>
                    <ul className="space-y-1">
                      <li>Monthly: {results.tests.stripe_pricing.starter.monthly}</li>
                      <li>Annual: {results.tests.stripe_pricing.starter.annual}</li>
                      <li>Overage: {results.tests.stripe_pricing.starter.overage}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Growth Plan</h4>
                    <ul className="space-y-1">
                      <li>Monthly: {results.tests.stripe_pricing.growth.monthly}</li>
                      <li>Annual: {results.tests.stripe_pricing.growth.annual}</li>
                      <li>Overage: {results.tests.stripe_pricing.growth.overage}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Pro Plan</h4>
                    <ul className="space-y-1">
                      <li>Monthly: {results.tests.stripe_pricing.pro.monthly}</li>
                      <li>Annual: {results.tests.stripe_pricing.pro.annual}</li>
                      <li>Unlimited pets (no overage)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Storage Configuration */}
            {results.tests.storage && (
              <div className={`p-6 rounded-xl border ${getStatusColor(results.tests.storage.status)}`}>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="mr-2">📸</span>
                  Photo Storage (Cloudflare R2)
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Bucket:</strong> {results.tests.storage.bucket}</p>
                  <p><strong>Endpoint:</strong> {results.tests.storage.endpoint}</p>
                  <p><strong>Public URL:</strong> {results.tests.storage.public_url}</p>
                  <p><strong>Credentials:</strong> {results.tests.storage.credentials_present ? '✅ Present' : '❌ Missing'}</p>
                </div>
              </div>
            )}

            {/* Environment Variables Status */}
            {results.tests.environment && (
              <div className={`p-6 rounded-xl border ${getStatusColor(results.tests.environment.status)}`}>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="mr-2">🔧</span>
                  Environment Variables
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {Object.entries(results.tests.environment.variables).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className={value ? 'text-green-600' : 'text-red-600'}>
                        {value ? '✅' : '❌'}
                      </span>
                      <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ready for Development */}
        {results?.success && (
          <div className="mt-8 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">🚀 Ready for Development!</h3>
            <p className="text-lg mb-4">
              All systems are connected and working perfectly
            </p>
            <p className="text-teal-100">
              Time to build the features following your 15 comprehensive specifications
            </p>
          </div>
        )}
      </div>
    </div>
  )
}