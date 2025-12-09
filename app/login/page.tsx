import { login, signup } from './actions'

// Clean Geometric Design Implementation - Bold teal background with prominent white card
export default function LoginPage({ searchParams }: { searchParams: { error?: string; message?: string } }) {
  return (
    <>
      <style jsx global>{`
        body {
          background: #0f766e !important;
          margin: 0;
          padding: 0;
        }
      `}</style>
      
      <div style={{
        minHeight: '100vh',
        background: '#0f766e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
      }}>
        
        {/* Geometric background elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '100px',
          height: '100px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '20px',
          transform: 'rotate(45deg)'
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          width: '80px',
          height: '80px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '50%'
        }} />

        <div style={{
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 32px 80px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          padding: '48px',
          width: '100%',
          maxWidth: '420px',
          position: 'relative',
          zIndex: 10
        }}>
          
          {/* Error/Success Messages */}
          {searchParams.error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '20px', marginRight: '12px' }}>⚠️</span>
              <p style={{ color: '#dc2626', fontSize: '14px' }}>
                {decodeURIComponent(searchParams.error)}
              </p>
            </div>
          )}
          
          {searchParams.message && (
            <div style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '20px', marginRight: '12px' }}>ℹ️</span>
              <p style={{ color: '#2563eb', fontSize: '14px' }}>
                {decodeURIComponent(searchParams.message)}
              </p>
            </div>
          )}

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #0f766e 0%, #0d665c 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '28px',
              color: 'white',
              boxShadow: '0 8px 24px rgba(15, 118, 110, 0.4)',
              position: 'relative'
            }}>
              🐾
              <div style={{
                position: 'absolute',
                inset: '-2px',
                background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
                borderRadius: '18px',
                zIndex: -1,
                opacity: 0.3,
                filter: 'blur(4px)'
              }} />
            </div>
            
            <h1 style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '8px',
              letterSpacing: '-0.02em'
            }}>
              TracePaws
            </h1>
            
            <p style={{
              fontSize: '16px',
              color: '#64748b',
              fontWeight: 500
            }}>
              Staff Portal
            </p>
          </div>

          {/* Form */}
          <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{
                fontWeight: 600,
                color: '#1e293b',
                fontSize: '14px'
              }} htmlFor="email">
                Email Address
              </label>
              <input
                style={{
                  height: '52px',
                  padding: '0 16px',
                  border: '2px solid #f1f5f9',
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  background: '#fafafa'
                }}
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                required
                onFocus={(e) => {
                  e.target.style.borderColor = '#0f766e';
                  e.target.style.background = 'white';
                  e.target.style.boxShadow = '0 0 0 3px rgba(15, 118, 110, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#f1f5f9';
                  e.target.style.background = '#fafafa';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{
                fontWeight: 600,
                color: '#1e293b',
                fontSize: '14px'
              }} htmlFor="password">
                Password
              </label>
              <input
                style={{
                  height: '52px',
                  padding: '0 16px',
                  border: '2px solid #f1f5f9',
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  background: '#fafafa'
                }}
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                required
                onFocus={(e) => {
                  e.target.style.borderColor = '#0f766e';
                  e.target.style.background = 'white';
                  e.target.style.boxShadow = '0 0 0 3px rgba(15, 118, 110, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#f1f5f9';
                  e.target.style.background = '#fafafa';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <button
              formAction={login}
              style={{
                height: '52px',
                background: '#0f766e',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(15, 118, 110, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#0d665c';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#0f766e';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Sign In
            </button>

            <button
              formAction={signup}
              style={{
                height: '48px',
                background: 'transparent',
                color: '#64748b',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginTop: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#0f766e';
                e.target.style.color = '#0f766e';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.color = '#64748b';
              }}
            >
              Create Account
            </button>
          </form>

          {/* Forgot Password Link */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <a href="#forgot" style={{
              color: '#0f766e',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500
            }}>
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </>
  )
}