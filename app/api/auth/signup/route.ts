import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, organizationName } = await request.json()

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !organizationName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Create admin client for user creation
    const supabase = await createAdminClient()

    // Create user account with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email.toLowerCase().trim(),
      password: password,
      email_confirm: true, // Auto-confirm email for now
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        organization_name: organizationName
      }
    })

    if (authError) {
      console.error('Auth user creation error:', authError)
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'User creation failed' },
        { status: 500 }
      )
    }

    // Create organization record
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: organizationName,
        slug: organizationName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        email: email.toLowerCase().trim(),
        subscription_status: 'trialing',
        subscription_plan: 'starter',
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      })
      .select('*')
      .single()

    if (orgError) {
      console.error('Organization creation error:', orgError)
      // Clean up auth user if organization creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: 'Organization creation failed' },
        { status: 500 }
      )
    }

    // Create user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        auth_id: authData.user.id,
        organization_id: organization.id,
        email: email.toLowerCase().trim(),
        first_name: firstName,
        last_name: lastName,
        role: 'owner' // First user becomes owner
      })
      .select('*')
      .single()

    if (profileError) {
      console.error('User profile creation error:', profileError)
      // Clean up auth user and organization if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      await supabase.from('organizations').delete().eq('id', organization.id)
      return NextResponse.json(
        { error: 'User profile creation failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      data: {
        user: authData.user,
        organization: organization,
        profile: userProfile
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}