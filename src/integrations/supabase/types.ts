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
      broadcasts: {
        Row: {
          content: string
          created_at: string
          expires_at: string | null
          id: string
          sender_id: string
          target_group: string | null
          title: string
          type: string
        }
        Insert: {
          content: string
          created_at?: string
          expires_at?: string | null
          id?: string
          sender_id: string
          target_group?: string | null
          title: string
          type: string
        }
        Update: {
          content?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          sender_id?: string
          target_group?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      community_groups: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          last_activity: string | null
          location_lat: number | null
          location_lng: number | null
          location_name: string | null
          member_count: number
          name: string
          total_orders: number | null
          total_savings: number | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          last_activity?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_name?: string | null
          member_count?: number
          name: string
          total_orders?: number | null
          total_savings?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          last_activity?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_name?: string | null
          member_count?: number
          name?: string
          total_orders?: number | null
          total_savings?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "community_groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      community_suggestions: {
        Row: {
          created_at: string | null
          id: string
          is_matched: boolean | null
          potential_savings: number | null
          similarity_score: number
          suggested_user_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_matched?: boolean | null
          potential_savings?: number | null
          similarity_score: number
          suggested_user_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_matched?: boolean | null
          potential_savings?: number | null
          similarity_score?: number
          suggested_user_id?: string
          user_id?: string
        }
        Relationships: []
      }
      delivery_instructions: {
        Row: {
          created_at: string | null
          id: string
          instructions: string
          location_notes: string | null
          order_group_id: string | null
          order_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          instructions: string
          location_notes?: string | null
          order_group_id?: string | null
          order_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          instructions?: string
          location_notes?: string | null
          order_group_id?: string | null
          order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_instructions_order_group_id_fkey"
            columns: ["order_group_id"]
            isOneToOne: false
            referencedRelation: "group_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_instructions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      group_orders: {
        Row: {
          created_at: string | null
          created_by: string
          group_id: string
          id: string
          max_participants: number | null
          min_participants: number
          order_deadline: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          group_id: string
          id?: string
          max_participants?: number | null
          min_participants?: number
          order_deadline?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          group_id?: string
          id?: string
          max_participants?: number | null
          min_participants?: number
          order_deadline?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_orders_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          id: string
          last_updated: string | null
          low_threshold: number
          meal_id: string
          quantity: number
          vendor_id: string
        }
        Insert: {
          id?: string
          last_updated?: string | null
          low_threshold?: number
          meal_id: string
          quantity: number
          vendor_id: string
        }
        Update: {
          id?: string
          last_updated?: string | null
          low_threshold?: number
          meal_id?: string
          quantity?: number
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_preservation_guides: {
        Row: {
          audio_url: string | null
          created_at: string | null
          freshness_duration: number
          id: string
          meal_id: string
          preservation_instructions: Json
          reheating_instructions: Json
          updated_at: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          freshness_duration: number
          id?: string
          meal_id: string
          preservation_instructions: Json
          reheating_instructions: Json
          updated_at?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          freshness_duration?: number
          id?: string
          meal_id?: string
          preservation_instructions?: Json
          reheating_instructions?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_preservation_guides_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: true
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_ratings: {
        Row: {
          created_at: string
          id: string
          meal_id: string
          rating: number
          review: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          meal_id: string
          rating: number
          review?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          meal_id?: string
          rating?: number
          review?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_ratings_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_templates: {
        Row: {
          base_price: number
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          vendor_id: string
        }
        Insert: {
          base_price: number
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          vendor_id: string
        }
        Update: {
          base_price?: number
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_templates_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          bulk_quantity: number
          created_at: string
          cuisine_type: string | null
          description: string | null
          dietary_info: Json | null
          id: string
          image_url: string | null
          is_available: boolean
          name: string
          preparation_time: number | null
          price_bulk: number
          price_single: number
          reheating_instructions: string | null
          storage_instructions: string | null
          vendor_id: string
        }
        Insert: {
          bulk_quantity: number
          created_at?: string
          cuisine_type?: string | null
          description?: string | null
          dietary_info?: Json | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          name: string
          preparation_time?: number | null
          price_bulk: number
          price_single: number
          reheating_instructions?: string | null
          storage_instructions?: string | null
          vendor_id: string
        }
        Update: {
          bulk_quantity?: number
          created_at?: string
          cuisine_type?: string | null
          description?: string | null
          dietary_info?: Json | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          name?: string
          preparation_time?: number | null
          price_bulk?: number
          price_single?: number
          reheating_instructions?: string | null
          storage_instructions?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meals_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          created_at: string
          group_id: string | null
          id: string
          message: string
          read: boolean
          recipient_id: string | null
          sender_id: string
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          group_id?: string | null
          id?: string
          message: string
          read?: boolean
          recipient_id?: string | null
          sender_id: string
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          group_id?: string | null
          id?: string
          message?: string
          read?: boolean
          recipient_id?: string | null
          sender_id?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean
          related_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean
          related_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          meal_id: string
          order_id: string
          price_per_item: number
          quantity: number
          special_instructions: string | null
          total_price: number
        }
        Insert: {
          id?: string
          meal_id: string
          order_id: string
          price_per_item: number
          quantity: number
          special_instructions?: string | null
          total_price: number
        }
        Update: {
          id?: string
          meal_id?: string
          order_id?: string
          price_per_item?: number
          quantity?: number
          special_instructions?: string | null
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          delivery_address: string
          delivery_date: string
          group_order_id: string | null
          id: string
          payment_method: string | null
          payment_status: string
          status: string
          total_amount: number
          user_id: string
        }
        Insert: {
          created_at?: string
          delivery_address: string
          delivery_date: string
          group_order_id?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string
          status?: string
          total_amount: number
          user_id: string
        }
        Update: {
          created_at?: string
          delivery_address?: string
          delivery_date?: string
          group_order_id?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string
          status?: string
          total_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      presence: {
        Row: {
          id: string
          last_seen: string
          location_data: Json | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          last_seen?: string
          location_data?: Json | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          last_seen?: string
          location_data?: Json | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          email: string
          id: string
          join_date: string | null
          name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          email: string
          id: string
          join_date?: string | null
          name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          email?: string
          id?: string
          join_date?: string | null
          name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      suspicious_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          details: Json | null
          id: string
          reference_id: string
          reviewed: boolean | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          details?: Json | null
          id?: string
          reference_id: string
          reviewed?: boolean | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          reference_id?: string
          reviewed?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      transaction_logs: {
        Row: {
          amount: number | null
          created_at: string | null
          details: Json | null
          id: string
          reference_id: string
          transaction_type: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          details?: Json | null
          id?: string
          reference_id: string
          transaction_type: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          details?: Json | null
          id?: string
          reference_id?: string
          transaction_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          cuisine_preferences: string[] | null
          dietary_restrictions: string[] | null
          favorite_meal_ids: string[] | null
          id: string
          price_sensitivity: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          cuisine_preferences?: string[] | null
          dietary_restrictions?: string[] | null
          favorite_meal_ids?: string[] | null
          id?: string
          price_sensitivity?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          cuisine_preferences?: string[] | null
          dietary_restrictions?: string[] | null
          favorite_meal_ids?: string[] | null
          id?: string
          price_sensitivity?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_recommendations: {
        Row: {
          created_at: string | null
          id: string
          meal_id: string
          score: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          meal_id: string
          score?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          meal_id?: string
          score?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_recommendations_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          created_at: string
          dietary_preferences: Json | null
          email: string
          full_name: string
          id: string
          is_vendor: boolean
          phone_number: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          dietary_preferences?: Json | null
          email: string
          full_name: string
          id?: string
          is_vendor?: boolean
          phone_number?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          dietary_preferences?: Json | null
          email?: string
          full_name?: string
          id?: string
          is_vendor?: boolean
          phone_number?: string | null
        }
        Relationships: []
      }
      vendor_earnings: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          order_id: string
          vendor_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          order_id: string
          vendor_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          order_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_earnings_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_earnings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_ratings: {
        Row: {
          created_at: string
          id: string
          rating: number
          review: string | null
          user_id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          rating: number
          review?: string | null
          user_id: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          rating?: number
          review?: string | null
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_ratings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          avg_rating: number | null
          business_address: string
          business_description: string | null
          business_name: string
          created_at: string
          id: string
          is_verified: boolean
          logo_url: string | null
          user_id: string
        }
        Insert: {
          avg_rating?: number | null
          business_address: string
          business_description?: string | null
          business_name: string
          created_at?: string
          id?: string
          is_verified?: boolean
          logo_url?: string | null
          user_id: string
        }
        Update: {
          avg_rating?: number | null
          business_address?: string
          business_description?: string | null
          business_name?: string
          created_at?: string
          id?: string
          is_verified?: boolean
          logo_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
