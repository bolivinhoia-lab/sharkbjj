import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface Database {
  public: {
    Tables: {
      academies: {
        Row: {
          id: string
          name: string
          address: string | null
          phone: string | null
          email: string | null
          website: string | null
          logo_url: string | null
          primary_color: string
          secondary_color: string
          timezone: string
          settings: any
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['academies']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['academies']['Insert']>
      }
      user_profiles: {
        Row: {
          id: string
          academy_id: string | null
          email: string
          full_name: string
          avatar_url: string | null
          phone: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          date_of_birth: string | null
          user_type: 'student' | 'instructor' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>
      }
      students: {
        Row: {
          id: string
          user_id: string
          academy_id: string
          student_number: string
          qr_code: string
          belt_level: 'white' | 'blue' | 'purple' | 'brown' | 'black'
          stripe_count: number
          promotion_date: string
          next_promotion_eligible_date: string | null
          total_classes: number
          classes_this_month: number
          last_attendance: string | null
          current_streak: number
          longest_streak: number
          xp_points: number
          level: number
          total_techniques_learned: number
          favorite_technique: string | null
          join_date: string
          status: 'active' | 'inactive' | 'suspended' | 'graduated'
          payment_status: 'current' | 'overdue' | 'suspended'
          last_payment_date: string | null
          monthly_fee: number
          notification_preferences: any
          privacy_settings: any
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['students']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['students']['Insert']>
      }
      instructors: {
        Row: {
          id: string
          user_id: string
          academy_id: string
          instructor_code: string
          belt_level: 'purple' | 'brown' | 'black'
          years_teaching: number
          certifications: string[]
          specializations: string[]
          can_promote_students: boolean
          can_manage_payments: boolean
          can_manage_competitions: boolean
          max_promotion_level: string
          teaching_schedule: any
          hourly_rate: number | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['instructors']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['instructors']['Insert']>
      }
      attendance: {
        Row: {
          id: string
          student_id: string
          instructor_id: string | null
          academy_id: string
          check_in_time: string
          check_out_time: string | null
          class_type: string
          class_duration: number | null
          scanned_by: string | null
          scan_location: string | null
          notes: string | null
          techniques_practiced: string[]
          sparring_rounds: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['attendance']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['attendance']['Insert']>
      }
      student_achievements: {
        Row: {
          id: string
          student_id: string
          achievement_id: string
          earned_date: string
          progress_data: any | null
        }
        Insert: Omit<Database['public']['Tables']['student_achievements']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['student_achievements']['Insert']>
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          requirements: any
          xp_reward: number
          badge_icon: string | null
          badge_color: string
          rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
          is_hidden: boolean
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['achievements']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['achievements']['Insert']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}