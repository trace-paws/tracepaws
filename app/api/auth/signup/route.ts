import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { userId, email, firstName, lastName, businessName, slug } = await request.json()

    // Validate required fields
    if (!userId || !email || !firstName || !lastName || !businessName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create Supabase server client with service role for admin operations
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role for admin operations
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          }
        }
      }
    )

    // Create organization record
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: businessName,
        slug: slug || businessName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        email: email,
        subscription_status: 'trialing',
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days trial
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
      return NextResponse.json(
        { error: 'Failed to create organization: ' + orgError.message },
        { status: 500 }
      )
    }

    // Create user profile linked to organization
    const { error: userError } = await supabase
      .from('users')
      .insert({
        auth_id: userId,
        organization_id: orgData.id,
        email: email,
        first_name: firstName,
        last_name: lastName,
        role: 'owner',
        is_active: true
      })

    if (userError) {
      console.error('User profile creation error:', userError)
      
      // Clean up organization if user creation failed
      await supabase
        .from('organizations')
        .delete()
        .eq('id', orgData.id)

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
          user_id: userId,
          email: email,
          business_name: businessName,
          signup_method: 'email'
        }
      })

    return NextResponse.json({
      success: true,
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