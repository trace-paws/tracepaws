// Centralized type definitions matching live database schema (yplmrwismtztyomrvzvj)

export interface Organization {
  id: string
  name: string
  slug: string
  logo_url?: string
  address_line1?: string
  address_line2?: string
  city?: string
  state?: string
  postal_code?: string
  country: string
  phone?: string
  email?: string
  website?: string
  subscription_plan: 'starter' | 'growth' | 'pro' | null
  subscription_status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
  stripe_customer_id?: string
  stripe_subscription_id?: string
  trial_ends_at?: string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  auth_id: string
  organization_id: string
  email: string
  first_name?: string
  last_name?: string
  full_name: string
  role: 'owner' | 'admin' | 'staff'
  avatar_url?: string
  is_active: boolean
  last_seen_at?: string
  created_at: string
  updated_at: string
}

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
  intake_at: string
  prepared_at?: string
  chamber_entry_at?: string
  cremated_at?: string
  packaged_at?: string
  ready_at?: string
  completed_at?: string
  created_by: string
  created_at: string
  updated_at: string
  search_vector?: string
}

export interface Checkpoint {
  id: string
  pet_id: string
  checkpoint_type: 'intake' | 'prepared' | 'entering_chamber' | 'cremated' | 'packaged' | 'ready' | 'completed'
  notes?: string
  equipment_id?: string
  latitude?: number
  longitude?: number
  location_accuracy?: number
  completed_at: string
  completed_by: string
  created_at: string
}

export interface Photo {
  id: string
  pet_id: string
  checkpoint_id: string
  url: string
  thumbnail_url?: string
  storage_path: string
  file_size?: number
  width?: number
  height?: number
  format: 'jpeg' | 'jpg' | 'png' | 'webp'
  uploaded_by: string
  upload_ip?: string
  created_at: string
}

export interface Notification {
  id: string
  pet_id: string
  type: 'email' | 'sms'
  trigger_event: 'intake' | 'prepared' | 'cremated' | 'ready' | 'completed' | 'manual'
  recipient: string
  subject?: string
  message: string
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced'
  external_id?: string
  error_message?: string
  sent_at?: string
  delivered_at?: string
  created_at: string
}

export interface DashboardStats {
  awaiting: number      // Pets with status 'received'
  in_progress: number   // Pets with status 'prepared', 'in_chamber', 'cremated', 'packaged'  
  ready: number         // Pets with status 'ready'
  today_intake: number  // Pets created today
}

// Extended Pet interface for components that need additional data
export interface PetWithDetails extends Pet {
  created_by_name?: string
  latest_checkpoint?: {
    checkpoint_type: string
    completed_at: string
  }
}