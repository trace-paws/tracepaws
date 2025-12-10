import { createClient } from '@/lib/supabase/client'

// Type definitions based on live database schema (yplmrwismtztyomrvzvj)
export interface Pet {
  id: string
  organization_id: string
  tracking_id: string
  name: string
  pet_type: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other'
  breed?: string
  weight?: number
  owner_first_name: string
  owner_last_name: string
  owner_full_name: string
  owner_email: string
  owner_phone?: string
  service_type: 'private' | 'individual' | 'communal'
  instructions?: string
  referring_vet?: string
  status: 'received' | 'prepared' | 'in_chamber' | 'cremated' | 'packaged' | 'ready' | 'completed'
  created_by: string
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  subscription_plan: 'starter' | 'growth' | 'pro' | null
  subscription_status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  trial_ends_at: string | null
}

export interface DashboardStats {
  awaiting: number
  in_progress: number
  ready: number
  today_intake: number
}

export class DatabaseClient {
  private static supabase = createClient()

  // Dashboard operations using live database views
  static async getDashboardStats(organizationId: string): Promise<DashboardStats> {
    const { data, error } = await this.supabase
      .from('dashboard_stats')
      .select('*')
      .eq('organization_id', organizationId)
      .single()

    if (error) {
      throw new Error(`Failed to load dashboard stats: ${error.message}`)
    }

    return {
      awaiting: data?.pets_received || 0,
      in_progress: data?.pets_in_progress || 0,
      ready: data?.pets_ready || 0,
      today_intake: data?.pets_today || 0
    }
  }

  // Pet operations with optimized queries
  static async getPetsList(organizationId: string, filters?: {
    status?: string
    search?: string
    limit?: number
  }): Promise<Pet[]> {
    let query = this.supabase
      .from('pets')
      .select(`
        *,
        created_by_user:users!pets_created_by_fkey(full_name)
      `)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.search) {
      query = query.textSearch('search_vector', filters.search)
    }

    query = query.limit(filters?.limit || 50)

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to load pets: ${error.message}`)
    }

    return data || []
  }

  // Create new pet with automatic tracking ID
  static async createPet(petData: Omit<Pet, 'id' | 'tracking_id' | 'created_at' | 'updated_at' | 'owner_full_name'>): Promise<Pet> {
    const { data, error } = await this.supabase
      .from('pets')
      .insert(petData)
      .select('*')
      .single()

    if (error) {
      throw new Error(`Failed to create pet: ${error.message}`)
    }

    return data
  }

  // Update pet status with workflow validation
  static async updatePetStatus(petId: string, newStatus: string, notes?: string): Promise<Pet> {
    const { data, error } = await this.supabase
      .from('pets')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', petId)
      .select('*')
      .single()

    if (error) {
      throw new Error(`Failed to update pet status: ${error.message}`)
    }

    return data
  }

  // Get organization details
  static async getOrganization(organizationId: string): Promise<Organization> {
    const { data, error } = await this.supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .single()

    if (error) {
      throw new Error(`Failed to load organization: ${error.message}`)
    }

    return data
  }

  // Get monthly usage for billing
  static async getMonthlyUsage(organizationId: string): Promise<{
    pets_processed: number
    pets_limit: number
    overage_pets: number
    overage_charges: number
    utilization_percent: number
  }> {
    const { data, error } = await this.supabase
      .rpc('get_monthly_usage', { org_id: organizationId })

    if (error) {
      throw new Error(`Failed to get usage data: ${error.message}`)
    }

    // Calculate usage metrics
    const usage = data?.[0] || { pets_processed: 0 }
    const { data: org } = await this.supabase
      .from('organizations')
      .select('subscription_plan')
      .eq('id', organizationId)
      .single()

    const planLimits = this.getPlanLimits(org?.subscription_plan || 'starter')
    const overagePets = Math.max(0, usage.pets_processed - planLimits.pets_included)
    const overageCharges = overagePets * planLimits.overage_rate
    
    return {
      pets_processed: usage.pets_processed,
      pets_limit: planLimits.pets_included,
      overage_pets: overagePets,
      overage_charges: overageCharges,
      utilization_percent: planLimits.pets_included > 0 ? 
        Math.round((usage.pets_processed / planLimits.pets_included) * 100) : 0
    }
  }

  // Get public pet data for tracking pages (no auth required)
  static async getPublicPetData(trackingId: string): Promise<any> {
    const { data, error } = await this.supabase
      .rpc('get_public_pet_data', { p_tracking_id: trackingId })

    if (error) {
      throw new Error(`Failed to load tracking data: ${error.message}`)
    }

    return data
  }

  // Helper: Get plan limits (matches live Stripe configuration)
  private static getPlanLimits(plan: string) {
    const limits = {
      starter: { pets_included: 75, overage_rate: 1.50 },
      growth: { pets_included: 250, overage_rate: 1.00 },
      pro: { pets_included: -1, overage_rate: 0 } // Unlimited
    }
    return limits[plan as keyof typeof limits] || limits.starter
  }
}