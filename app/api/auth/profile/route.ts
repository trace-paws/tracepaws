import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Use admin client to bypass RLS for user profile lookup
    const adminSupabase = await createAdminClient()

    // Get user profile
    const { data: userProfile, error: profileError } = await adminSupabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single()

    if (profileError || !userProfile) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Get organization
    const { data: organization, error: orgError } = await adminSupabase
      .from('organizations')
      .select('*')
      .eq('id', userProfile.organization_id)
      .single()

    if (orgError || !organization) {
      console.error('Organization fetch error:', orgError)
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        profile: userProfile,
        organization: organization
      }
    })

  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}