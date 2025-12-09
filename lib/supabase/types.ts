export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      billing_events: {
        Row: {
          created_at: string
          details: Json
          event_type: string
          id: string
          organization_id: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json
          event_type: string
          id?: string
          organization_id?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json
          event_type?: string
          id?: string
          organization_id?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
        }
      }
      checkpoints: {
        Row: {
          checkpoint_type: string
          completed_at: string
          completed_by: string
          created_at: string
          equipment_id: string | null
          id: string
          latitude: number | null
          location_accuracy: number | null
          longitude: number | null
          notes: string | null
          pet_id: string
        }
        Insert: {
          checkpoint_type: string
          completed_at?: string
          completed_by: string
          created_at?: string
          equipment_id?: string | null
          id?: string
          latitude?: number | null
          location_accuracy?: number | null
          longitude?: number | null
          notes?: string | null
          pet_id: string
        }
        Update: {
          checkpoint_type?: string
          completed_at?: string
          completed_by?: string
          created_at?: string
          equipment_id?: string | null
          id?: string
          latitude?: number | null
          location_accuracy?: number | null
          longitude?: number | null
          notes?: string | null
          pet_id?: string
        }
      }
      invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          declined_at: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          organization_id: string
          role: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          declined_at?: string | null
          email: string
          expires_at: string
          id?: string
          invited_by?: string | null
          organization_id: string
          role?: string
          token: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          declined_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          organization_id?: string
          role?: string
          token?: string
        }
      }
      organizations: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          country: string
          created_at: string
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          postal_code: string | null
          settings: Json
          slug: string
          state: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_plan: string | null
          subscription_status: string
          trial_ends_at: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          postal_code?: string | null
          settings?: Json
          slug: string
          state?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_plan?: string | null
          subscription_status?: string
          trial_ends_at?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          postal_code?: string | null
          settings?: Json
          slug?: string
          state?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_plan?: string | null
          subscription_status?: string
          trial_ends_at?: string | null
          updated_at?: string
          website?: string | null
        }
      }
      pets: {
        Row: {
          breed: string | null
          chamber_entry_at: string | null
          completed_at: string | null
          created_at: string
          created_by: string
          cremated_at: string | null
          id: string
          instructions: string | null
          intake_at: string
          name: string
          organization_id: string
          owner_email: string
          owner_first_name: string
          owner_full_name: string | null
          owner_last_name: string
          owner_phone: string | null
          packaged_at: string | null
          pet_type: string
          prepared_at: string | null
          ready_at: string | null
          referring_vet: string | null
          search_vector: unknown
          service_type: string
          status: string
          tracking_id: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          breed?: string | null
          chamber_entry_at?: string | null
          completed_at?: string | null
          created_at?: string
          created_by: string
          cremated_at?: string | null
          id?: string
          instructions?: string | null
          intake_at?: string
          name: string
          organization_id: string
          owner_email: string
          owner_first_name: string
          owner_full_name?: string | null
          owner_last_name: string
          owner_phone?: string | null
          packaged_at?: string | null
          pet_type: string
          prepared_at?: string | null
          ready_at?: string | null
          referring_vet?: string | null
          search_vector?: unknown
          service_type: string
          status?: string
          tracking_id: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          breed?: string | null
          chamber_entry_at?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string
          cremated_at?: string | null
          id?: string
          instructions?: string | null
          intake_at?: string
          name?: string
          organization_id?: string
          owner_email?: string
          owner_first_name?: string
          owner_full_name?: string | null
          owner_last_name?: string
          owner_phone?: string | null
          packaged_at?: string | null
          pet_type?: string
          prepared_at?: string | null
          ready_at?: string | null
          referring_vet?: string | null
          search_vector?: unknown
          service_type?: string
          status?: string
          tracking_id?: string
          updated_at?: string
          weight?: number | null
        }
      }
      users: {
        Row: {
          auth_id: string
          avatar_url: string | null
          created_at: string
          email: string
          first_name: string | null
          full_name: string | null
          id: string
          is_active: boolean
          last_name: string | null
          last_seen_at: string | null
          organization_id: string
          role: string
          updated_at: string
        }
        Insert: {
          auth_id: string
          avatar_url?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean
          last_name?: string | null
          last_seen_at?: string | null
          organization_id: string
          role?: string
          updated_at?: string
        }
        Update: {
          auth_id?: string
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          last_name?: string | null
          last_seen_at?: string | null
          organization_id?: string
          role?: string
          updated_at?: string
        }
      }
    }
    Views: {
      dashboard_stats: {
        Row: {
          organization_id: string | null
          organization_name: string | null
          pets_completed: number | null
          pets_in_progress: number | null
          pets_ready: number | null
          pets_received: number | null
          pets_today: number | null
          subscription_plan: string | null
          subscription_status: string | null
          total_pets: number | null
        }
      }
    }
    Functions: {
      generate_tracking_id: { Args: { org_id: string }; Returns: string }
      get_monthly_usage: {
        Args: { org_id: string }
        Returns: { month: string; pets_processed: number }[]
      }
      validate_status_transition: {
        Args: { new_status: string; old_status: string }
        Returns: boolean
      }
    }
  }
}

// Type aliases for easier use
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Pet = Tables<'pets'>
export type Organization = Tables<'organizations'>
export type UserProfile = Tables<'users'>
export type Checkpoint = Tables<'checkpoints'>
export type Invitation = Tables<'invitations'>