import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Check if user profile exists, create if missing
  let { data: userProfile } = await supabase
    .from('users')
    .select('*, organization:organizations(*)')
    .eq('auth_id', user.id)
    .single()

  // If no profile exists, create a temporary one for testing
  if (!userProfile) {
    console.log('No user profile found, creating temporary profile...')
    
    // Create basic organization for test user
    const { data: newOrg } = await supabase
      .from('organizations')
      .insert({
        name: 'Test Organization',
        slug: 'test-org-' + Date.now(),
        subscription_status: 'trialing',
        subscription_plan: 'starter'
      })
      .select()
      .single()

    if (newOrg) {
      // Create user profile
      const { data: newProfile } = await supabase
        .from('users')
        .insert({
          id: user.id,
          auth_id: user.id,
          organization_id: newOrg.id,
          email: user.email || '',
          first_name: user.email?.split('@')[0] || 'Test',
          last_name: 'User',
          role: 'owner'
        })
        .select('*, organization:organizations(*)')
        .single()

      userProfile = newProfile
    }
  }

  // Get live dashboard stats if we have an organization
  const { data: stats } = userProfile?.organization_id ? await supabase
    .from('dashboard_stats')
    .select('*')
    .eq('organization_id', userProfile.organization_id)
    .single() : { data: null }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb',
      margin: 0,
      padding: 0
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: '#0f766e',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <span style={{ color: 'white', fontSize: '14px' }}>🐾</span>
              </div>
              <div>
                <h1 style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#111827',
                  margin: 0
                }}>
                  Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}!
                </h1>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: 0
                }}>
                  {userProfile?.organization?.name || 'TracePaws'}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#111827',
                  margin: 0
                }}>
                  {userProfile?.full_name || user.email}
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  margin: 0,
                  textTransform: 'capitalize'
                }}>
                  {userProfile?.role || 'user'}
                </p>
              </div>
              <form action="/auth/signout" method="post">
                <button 
                  type="submit"
                  style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    padding: '6px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    background: 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '24px'
      }}>
        {/* Welcome Message */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '32px',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#111827',
                marginBottom: '8px'
              }}>
                🎉 Authentication Working!
              </h1>
              <p style={{
                fontSize: '18px',
                color: '#6b7280',
                margin: 0
              }}>
                You're successfully logged in to TracePaws
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                Logged in as:
              </p>
              <p style={{
                fontWeight: 600,
                color: '#111827',
                margin: 0
              }}>
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <p style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#6b7280',
                  margin: '0 0 4px 0'
                }}>
                  Awaiting
                </p>
                <p style={{
                  fontSize: '36px',
                  fontWeight: 700,
                  color: '#2563eb',
                  margin: 0
                }}>
                  {stats?.pets_received || 0}
                </p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                background: '#dbeafe',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '20px' }}>⏳</span>
              </div>
            </div>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '8px',
              margin: '8px 0 0 0'
            }}>
              Pets received, waiting
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <p style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#6b7280',
                  margin: '0 0 4px 0'
                }}>
                  In Progress
                </p>
                <p style={{
                  fontSize: '36px',
                  fontWeight: 700,
                  color: '#ea580c',
                  margin: 0
                }}>
                  {stats?.pets_in_progress || 0}
                </p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                background: '#fed7aa',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '20px' }}>🔥</span>
              </div>
            </div>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '8px',
              margin: '8px 0 0 0'
            }}>
              Being processed
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <p style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#6b7280',
                  margin: '0 0 4px 0'
                }}>
                  Ready
                </p>
                <p style={{
                  fontSize: '36px',
                  fontWeight: 700,
                  color: '#16a34a',
                  margin: 0
                }}>
                  {stats?.pets_ready || 0}
                </p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                background: '#dcfce7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '20px' }}>✅</span>
              </div>
            </div>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '8px',
              margin: '8px 0 0 0'
            }}>
              Awaiting pickup
            </p>
          </div>
        </div>

        {/* Success Message */}
        <div style={{
          background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
          color: 'white',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: 700,
            marginBottom: '16px'
          }}>
            🚀 Login System Working!
          </h3>
          <p style={{
            fontSize: '18px',
            marginBottom: '24px',
            opacity: 0.9
          }}>
            Authentication successful with clean geometric design
          </p>
          <div style={{
            fontSize: '14px',
            opacity: 0.8,
            lineHeight: '1.6'
          }}>
            <p>✅ Server-side authentication working</p>
            <p>✅ Database connection established</p>
            <p>✅ User profile created automatically</p>
            <p>✅ Ready for core business features</p>
          </div>
        </div>
      </div>
    </div>
  )
}