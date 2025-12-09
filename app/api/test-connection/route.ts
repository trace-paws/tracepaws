import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Test API endpoint to verify all integrations work
export async function GET(request: NextRequest) {
  const results = {
    timestamp: new Date().toISOString(),
    tests: {} as Record<string, any>
  }

  try {
    // Test 1: Supabase Database Connection
    console.log('Testing Supabase connection...')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: orgs, error: dbError } = await supabase
      .from('organizations')
      .select('id, name, subscription_plan')
      .limit(3)

    results.tests.database = {
      status: dbError ? 'error' : 'success',
      error: dbError?.message,
      data: orgs?.length ? `Found ${orgs.length} organizations` : 'No data',
      organizations: orgs?.map(o => ({ name: o.name, plan: o.subscription_plan }))
    }

    // Test 2: Environment Variables Check
    results.tests.environment = {
      status: 'success',
      variables: {
        supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabase_anon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        supabase_service: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        r2_access_key: !!process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        r2_secret: !!process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
        r2_bucket: !!process.env.CLOUDFLARE_R2_BUCKET_NAME,
        stripe_prices_configured: !!(
          process.env.STRIPE_STARTER_MONTHLY_PRICE_ID &&
          process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID &&
          process.env.STRIPE_PRO_MONTHLY_PRICE_ID
        )
      }
    }

    // Test 3: Live Pet Data
    console.log('Testing live pet data...')
    const { data: pets, error: petsError } = await supabase
      .from('pets')
      .select('tracking_id, name, status, owner_full_name')
      .limit(5)

    results.tests.live_data = {
      status: petsError ? 'error' : 'success',
      error: petsError?.message,
      data: pets?.length ? `Found ${pets.length} pets` : 'No pets',
      sample_pets: pets?.map(p => ({ 
        tracking_id: p.tracking_id, 
        name: p.name, 
        status: p.status 
      }))
    }

    // Test 4: Stripe Price IDs
    results.tests.stripe_pricing = {
      status: 'configured',
      starter: {
        monthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID || 'missing',
        annual: process.env.STRIPE_STARTER_ANNUAL_PRICE_ID || 'missing',
        overage: process.env.STRIPE_STARTER_OVERAGE_PRICE_ID || 'missing'
      },
      growth: {
        monthly: process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID || 'missing',
        annual: process.env.STRIPE_GROWTH_ANNUAL_PRICE_ID || 'missing',
        overage: process.env.STRIPE_GROWTH_OVERAGE_PRICE_ID || 'missing'
      },
      pro: {
        monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'missing',
        annual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || 'missing'
      }
    }

    // Test 5: Cloudflare R2 Configuration
    results.tests.storage = {
      status: 'configured',
      bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      public_url: process.env.CLOUDFLARE_R2_PUBLIC_URL,
      credentials_present: !!(
        process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
        process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Integration tests completed',
      ...results
    })

  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      ...results
    }, { status: 500 })
  }
}