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
      all_data_ssl: {
        Row: {
          consignee: string | null
          consignee_location: string | null
          consignment_number: number
          consignor: string | null
          consignor_location: string | null
          created_at: string | null
          date: string | null
          delivery_charge: number | null
          freight: number | null
          id: string
          nature_of_goods: string | null
          no_of_articles: string | null
          notes: string | null
          rate: string | null
          truck_number: string | null
          weight: number | null
        }
        Insert: {
          consignee?: string | null
          consignee_location?: string | null
          consignment_number: number
          consignor?: string | null
          consignor_location?: string | null
          created_at?: string | null
          date?: string | null
          delivery_charge?: number | null
          freight?: number | null
          id?: string
          nature_of_goods?: string | null
          no_of_articles?: string | null
          notes?: string | null
          rate?: string | null
          truck_number?: string | null
          weight?: number | null
        }
        Update: {
          consignee?: string | null
          consignee_location?: string | null
          consignment_number?: number
          consignor?: string | null
          consignor_location?: string | null
          created_at?: string | null
          date?: string | null
          delivery_charge?: number | null
          freight?: number | null
          id?: string
          nature_of_goods?: string | null
          no_of_articles?: string | null
          notes?: string | null
          rate?: string | null
          truck_number?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      ledger_alloy_steel_industries: {
        Row: {
          created_at: string
          customer: string | null
          date: string | null
          id: number
          material: string | null
          quantity: number | null
          saleprice: number | null
          supplier: string | null
          totalvalue: number | null
          type: string | null
          unitprice: number | null
        }
        Insert: {
          created_at?: string
          customer?: string | null
          date?: string | null
          id?: number
          material?: string | null
          quantity?: number | null
          saleprice?: number | null
          supplier?: string | null
          totalvalue?: number | null
          type?: string | null
          unitprice?: number | null
        }
        Update: {
          created_at?: string
          customer?: string | null
          date?: string | null
          id?: number
          material?: string | null
          quantity?: number | null
          saleprice?: number | null
          supplier?: string | null
          totalvalue?: number | null
          type?: string | null
          unitprice?: number | null
        }
        Relationships: []
      }
      legend_data_ssl: {
        Row: {
          consginee_location: string | null
          consginor: string | null
          consginor_location: string | null
          consignee: string | null
          created_at: string
          id: number
          nature_of_goods: string | null
          truck_number: string | null
        }
        Insert: {
          consginee_location?: string | null
          consginor?: string | null
          consginor_location?: string | null
          consignee?: string | null
          created_at?: string
          id?: number
          nature_of_goods?: string | null
          truck_number?: string | null
        }
        Update: {
          consginee_location?: string | null
          consginor?: string | null
          consginor_location?: string | null
          consignee?: string | null
          created_at?: string
          id?: number
          nature_of_goods?: string | null
          truck_number?: string | null
        }
        Relationships: []
      }
      materials_alloy_steel_industries: {
        Row: {
          category: string | null
          created_at: string
          default_price: number | null
          description: string | null
          id: string
          name: string | null
          specifications: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          default_price?: number | null
          description?: string | null
          id?: string
          name?: string | null
          specifications?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          default_price?: number | null
          description?: string | null
          id?: string
          name?: string | null
          specifications?: string | null
        }
        Relationships: []
      }
      stats_alloy_steel_industries: {
        Row: {
          avg_purchase_price: number | null
          avg_sale_price: number | null
          category: string | null
          created_at: string
          current_stock_qty: number | null
          id: number
          is_active: boolean | null
          is_slow_moving: boolean | null
          last_purchase_date: string | null
          last_sale_date: string | null
          last_updated: string | null
          material: string | null
          most_recent_buy_price: number | null
          most_recent_sale_price: number | null
          net_profit: number | null
          notes: string | null
          profit_per_unit: number | null
          tags: string | null
          total_orders: number | null
          total_purchases_qty: number | null
          total_purchases_value: number | null
          total_sales_qty: number | null
          total_sales_value: number | null
        }
        Insert: {
          avg_purchase_price?: number | null
          avg_sale_price?: number | null
          category?: string | null
          created_at?: string
          current_stock_qty?: number | null
          id?: number
          is_active?: boolean | null
          is_slow_moving?: boolean | null
          last_purchase_date?: string | null
          last_sale_date?: string | null
          last_updated?: string | null
          material?: string | null
          most_recent_buy_price?: number | null
          most_recent_sale_price?: number | null
          net_profit?: number | null
          notes?: string | null
          profit_per_unit?: number | null
          tags?: string | null
          total_orders?: number | null
          total_purchases_qty?: number | null
          total_purchases_value?: number | null
          total_sales_qty?: number | null
          total_sales_value?: number | null
        }
        Update: {
          avg_purchase_price?: number | null
          avg_sale_price?: number | null
          category?: string | null
          created_at?: string
          current_stock_qty?: number | null
          id?: number
          is_active?: boolean | null
          is_slow_moving?: boolean | null
          last_purchase_date?: string | null
          last_sale_date?: string | null
          last_updated?: string | null
          material?: string | null
          most_recent_buy_price?: number | null
          most_recent_sale_price?: number | null
          net_profit?: number | null
          notes?: string | null
          profit_per_unit?: number | null
          tags?: string | null
          total_orders?: number | null
          total_purchases_qty?: number | null
          total_purchases_value?: number | null
          total_sales_qty?: number | null
          total_sales_value?: number | null
        }
        Relationships: []
      }
      stock_list_alloy_steel_industries: {
        Row: {
          average_unit_price: number | null
          created_at: string
          id: number
          material: string | null
          quantity: number | null
          status: string | null
          total_value: number | null
        }
        Insert: {
          average_unit_price?: number | null
          created_at?: string
          id?: number
          material?: string | null
          quantity?: number | null
          status?: string | null
          total_value?: number | null
        }
        Update: {
          average_unit_price?: number | null
          created_at?: string
          id?: number
          material?: string | null
          quantity?: number | null
          status?: string | null
          total_value?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      access_level: "read-only" | "read-write"
      user_role: "admin" | "manager" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      access_level: ["read-only", "read-write"],
      user_role: ["admin", "manager", "viewer"],
    },
  },
} as const
