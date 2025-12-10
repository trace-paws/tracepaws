// Stripe client for live billing integration (acct_1NaxY4DQ3Ykl2Fjy)

// Live Stripe product configuration
export const STRIPE_PRODUCTS = {
  starter: {
    product_id: 'prod_TYTjyKpd9xPHgX',
    monthly_price_id: 'price_1SbMluDQ3Ykl2FjylJKbpC3D',  // $79.00
    annual_price_id: 'price_1SbMluDQ3Ykl2FjyC6jExKaO',   // $790.00 (17% discount)
    overage_price_id: 'price_1SbONrDQ3Ykl2FjyB0ajwB3e', // $1.50/pet over 75
    pets_included: 75,
    overage_rate: 1.50
  },
  growth: {
    product_id: 'prod_TYTpiymmn0BbBd', 
    monthly_price_id: 'price_1SbMrZDQ3Ykl2FjyxlJeDcwh',  // $179.00
    annual_price_id: 'price_1SbMrZDQ3Ykl2Fjy2w1EKIPo',   // $1,790.00 (17% discount)
    overage_price_id: 'price_1SbOOCDQ3Ykl2FjyOyJshDFD', // $1.00/pet over 250
    pets_included: 250,
    overage_rate: 1.00
  },
  pro: {
    product_id: 'prod_TYTuLPdN83hb8W',
    monthly_price_id: 'price_1SbMwfDQ3Ykl2Fjydt1g7f4w',  // $349.00
    annual_price_id: 'price_1SbMwfDQ3Ykl2FjyllDFeutb',   // $3,490.00 (17% discount)
    pets_included: -1, // Unlimited
    overage_rate: 0
  }
} as const

export interface CheckoutSessionOptions {
  organizationId: string
  priceId: string
  successUrl?: string
  cancelUrl?: string
}

export interface BillingInfo {
  subscription: {
    id: string
    status: string
    plan: string
    current_period_end: string
    cancel_at_period_end: boolean
  } | null
  usage: {
    pets_processed: number
    limit: number
    overage_pets: number
    overage_charges: number
    utilization_percent: number
  }
  payment_method: {
    brand: string
    last4: string
    exp_month: number
    exp_year: number
  } | null
}

export class StripeClient {
  // Create checkout session for subscription
  static async createCheckoutSession(options: CheckoutSessionOptions): Promise<{ url: string }> {
    const response = await fetch('/api/billing/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        organization_id: options.organizationId,
        price_id: options.priceId,
        success_url: options.successUrl || `${window.location.origin}/settings/billing?success=true`,
        cancel_url: options.cancelUrl || `${window.location.origin}/settings/billing`
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create checkout session')
    }

    const { checkout_url } = await response.json()
    return { url: checkout_url }
  }

  // Get comprehensive billing information
  static async getBillingInfo(organizationId: string): Promise<BillingInfo> {
    const response = await fetch(`/api/billing/info?organizationId=${organizationId}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to load billing information')
    }

    const { data } = await response.json()
    return data
  }

  // Create customer portal session for self-service
  static async createPortalSession(organizationId: string): Promise<{ url: string }> {
    const response = await fetch('/api/billing/portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organization_id: organizationId })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create portal session')
    }

    const { portal_url } = await response.json()
    return { url: portal_url }
  }

  // Track usage for overage billing
  static async trackPetUsage(organizationId: string, petId: string): Promise<void> {
    const response = await fetch('/api/billing/track-usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        organization_id: organizationId,
        pet_id: petId
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to track usage')
    }
  }

  // Get plan information
  static getPlanInfo(planTier: string) {
    return STRIPE_PRODUCTS[planTier as keyof typeof STRIPE_PRODUCTS] || STRIPE_PRODUCTS.starter
  }

  // Calculate upgrade recommendations
  static getUpgradeRecommendation(currentPlan: string, monthlyUsage: number): {
    shouldUpgrade: boolean
    recommendedPlan: string | null
    monthlySavings: number
    reason: string
  } {
    const current = this.getPlanInfo(currentPlan)
    
    // Check if consistently over limit
    if (current.pets_included !== -1 && monthlyUsage > current.pets_included * 1.2) {
      const nextTier = currentPlan === 'starter' ? 'growth' : 'pro'
      const next = this.getPlanInfo(nextTier)
      
      const currentCost = this.calculateMonthlyCost(currentPlan, monthlyUsage)
      const upgradeCost = this.calculateMonthlyCost(nextTier, monthlyUsage)
      
      if (upgradeCost < currentCost) {
        return {
          shouldUpgrade: true,
          recommendedPlan: nextTier,
          monthlySavings: currentCost - upgradeCost,
          reason: `Save money with ${nextTier} plan due to overage costs`
        }
      }
    }

    return {
      shouldUpgrade: false,
      recommendedPlan: null,
      monthlySavings: 0,
      reason: 'Current plan is optimal for your usage'
    }
  }

  // Calculate monthly cost including overages
  private static calculateMonthlyCost(plan: string, usage: number): number {
    const planInfo = this.getPlanInfo(plan)
    const baseCost = plan === 'starter' ? 79 : plan === 'growth' ? 179 : 349
    
    if (planInfo.pets_included === -1) return baseCost // Unlimited
    
    const overage = Math.max(0, usage - planInfo.pets_included)
    return baseCost + (overage * planInfo.overage_rate)
  }
}