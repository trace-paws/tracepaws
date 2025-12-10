import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function GET(_request: NextRequest) {
  try {
    // Get authenticated user (respect cookies/session)
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Service-role client to bypass RLS for profile + org fetch
    const adminSupabase = await createAdminClient()

    const { data: userProfile, error: profileError } = await adminSupabase
      .from('users')
      .select(
        `
          id,
          auth_id,
          organization_id,
          email,
          first_name,
          last_name,
          full_name,
          role,
          avatar_url,
          is_active,
          last_seen_at,
          created_at,
          updated_at
        `
      )
      .eq('auth_id', user.id)
      .single()

    if (profileError || !userProfile) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Short-circuit deactivated accounts
    if (!userProfile.is_active) {
      return NextResponse.json({ error: 'Account deactivated' }, { status: 403 })
    }

    const { data: organization, error: orgError } = await adminSupabase
      .from('organizations')
      .select(
        `
          id,
          name,
          slug,
          subscription_plan,
          subscription_status,
          stripe_customer_id,
          stripe_subscription_id,
          trial_ends_at,
          created_at,
          updated_at
        `
      )
      .eq('id', userProfile.organization_id)
      .single()

    if (orgError || !organization) {
      console.error('Organization fetch error:', orgError)
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    // Update last_seen_at with service role to avoid RLS friction
    await adminSupabase
      .from('users')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('id', userProfile.id)

    return NextResponse.json({
      success: true,
      data: {
        profile: userProfile,
        organization,
      },
    })
  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
