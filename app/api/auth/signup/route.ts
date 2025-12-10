import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, businessName } = await request.json()

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !businessName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Create user account with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email.toLowerCase().trim(),
      password: password,
      email_confirm: true, // Auto-confirm email for now
      user_metadata: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        business_name: businessName.trim()
      }
    })

    if (authError) {
      console.error('Auth creation error:', authError)
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      )
    }

    // Create organization record
    const slug = businessName.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: businessName.trim(),
        slug: slug,
        email: email.toLowerCase().trim(),
        subscription_status: 'trialing',
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        settings: {
          checkpoints: [
            { code: 'intake', label: 'Received', required: true, photo_required: true, min_photos: 1 },
            { code: 'prepared', label: 'Prepared for Cremation', required: true, photo_required: true, min_photos: 1 },
            { code: 'entering_chamber', label: 'Entering Chamber', required: true, photo_required: true, min_photos: 2 },
            { code: 'cremated', label: 'Cremation Complete', required: true, photo_required: true, min_photos: 1 },
            { code: 'packaged', label: 'Packaged', required: true, photo_required: true, min_photos: 1 },
            { code: 'ready', label: 'Ready for Pickup', required: true, photo_required: false },
            { code: 'completed', label: 'Picked Up / Delivered', required: false, photo_required: false }
          ],
          service_types: [
            { code: 'private', label: 'Private Cremation', enabled: true },
            { code: 'individual', label: 'Individual Cremation', enabled: true },
            { code: 'communal', label: 'Communal Cremation', enabled: true }
          ],
          notifications: {
            email_intake: true,
            email_complete: true,
            email_ready: true,
            sms_intake: true,
            sms_ready: true
          }
        }
      })
      .select()
      .single()

    if (orgError) {
      console.error('Organization creation error:', orgError)
      // Clean up the user if org creation failed
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: 'Failed to create organization: ' + orgError.message },
        { status: 500 }
      )
    }

    // Create user profile linked to organization
    const { error: userError } = await supabase
      .from('users')
      .insert({
        auth_id: authData.user.id,
        organization_id: orgData.id,
        email: email.toLowerCase().trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        role: 'owner',
        is_active: true
      })

    if (userError) {
      console.error('User profile creation error:', userError)
      // Clean up both user and organization if profile creation failed
      await supabase.auth.admin.deleteUser(authData.user.id)
      await supabase.from('organizations').delete().eq('id', orgData.id)
      
      return NextResponse.json(
        { error: 'Failed to create user profile: ' + userError.message },
        { status: 500 }
      )
    }

    // Log the signup event
    await supabase
      .from('system_logs')
      .insert({
        event_type: 'user_signup',
        organization_id: orgData.id,
        details: {
          user_id: authData.user.id,
          email: email,
          business_name: businessName,
          signup_method: 'email'
        }
      })

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email
      },
      organization: {
        id: orgData.id,
        name: orgData.name,
        slug: orgData.slug
      }
    })

  } catch (error) {
    console.error('Signup API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}