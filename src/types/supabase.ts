export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          display_name: string | null
          first_name: string | null
          last_name: string | null
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_addresses: {
        Row: {
          id: string
          user_id: string
          type: string
          first_name: string
          last_name: string
          company: string | null
          address_line_1: string
          address_line_2: string | null
          city: string
          state: string
          postal_code: string
          country: string
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type?: string
          first_name: string
          last_name: string
          company?: string | null
          address_line_1: string
          address_line_2?: string | null
          city: string
          state: string
          postal_code: string
          country?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          first_name?: string
          last_name?: string
          company?: string | null
          address_line_1?: string
          address_line_2?: string | null
          city?: string
          state?: string
          postal_code?: string
          country?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          parent_id: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          short_description: string | null
          sku: string
          category_id: string | null
          brand: string | null
          base_price: number
          sale_price: number | null
          cost_price: number | null
          weight: number | null
          dimensions: Json | null
          images: Json
          tags: string[] | null
          meta_title: string | null
          meta_description: string | null
          is_active: boolean
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          short_description?: string | null
          sku: string
          category_id?: string | null
          brand?: string | null
          base_price: number
          sale_price?: number | null
          cost_price?: number | null
          weight?: number | null
          dimensions?: Json | null
          images?: Json
          tags?: string[] | null
          meta_title?: string | null
          meta_description?: string | null
          is_active?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          sku?: string
          category_id?: string | null
          brand?: string | null
          base_price?: number
          sale_price?: number | null
          cost_price?: number | null
          weight?: number | null
          dimensions?: Json | null
          images?: Json
          tags?: string[] | null
          meta_title?: string | null
          meta_description?: string | null
          is_active?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          sku: string
          name: string
          attributes: Json
          price_adjustment: number
          weight_adjustment: number
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          sku: string
          name: string
          attributes: Json
          price_adjustment?: number
          weight_adjustment?: number
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          sku?: string
          name?: string
          attributes?: Json
          price_adjustment?: number
          weight_adjustment?: number
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      inventory: {
        Row: {
          id: string
          product_id: string | null
          variant_id: string | null
          quantity: number
          reserved_quantity: number
          reorder_level: number | null
          max_stock_level: number | null
          location: string
          last_restocked_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id?: string | null
          variant_id?: string | null
          quantity?: number
          reserved_quantity?: number
          reorder_level?: number | null
          max_stock_level?: number | null
          location?: string
          last_restocked_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string | null
          variant_id?: string | null
          quantity?: number
          reserved_quantity?: number
          reorder_level?: number | null
          max_stock_level?: number | null
          location?: string
          last_restocked_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          guest_email: string | null
          status: string
          payment_status: string
          subtotal: number
          tax_amount: number
          shipping_amount: number
          discount_amount: number
          total_amount: number
          cgst_amount: number | null
          sgst_amount: number | null
          igst_amount: number | null
          shipping_address: Json
          billing_address: Json | null
          shipping_method: string | null
          tracking_number: string | null
          payment_method: string | null
          payment_reference: string | null
          order_date: string
          shipped_date: string | null
          delivered_date: string | null
          estimated_delivery_date: string | null
          notes: string | null
          internal_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          user_id?: string | null
          guest_email?: string | null
          status?: string
          payment_status?: string
          subtotal: number
          tax_amount?: number
          shipping_amount?: number
          discount_amount?: number
          total_amount: number
          cgst_amount?: number | null
          sgst_amount?: number | null
          igst_amount?: number | null
          shipping_address: Json
          billing_address?: Json | null
          shipping_method?: string | null
          tracking_number?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          order_date?: string
          shipped_date?: string | null
          delivered_date?: string | null
          estimated_delivery_date?: string | null
          notes?: string | null
          internal_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string | null
          guest_email?: string | null
          status?: string
          payment_status?: string
          subtotal?: number
          tax_amount?: number
          shipping_amount?: number
          discount_amount?: number
          total_amount?: number
          cgst_amount?: number | null
          sgst_amount?: number | null
          igst_amount?: number | null
          shipping_address?: Json
          billing_address?: Json | null
          shipping_method?: string | null
          tracking_number?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          order_date?: string
          shipped_date?: string | null
          delivered_date?: string | null
          estimated_delivery_date?: string | null
          notes?: string | null
          internal_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          variant_id: string | null
          product_name: string
          product_sku: string
          variant_name: string | null
          variant_sku: string | null
          variant_attributes: Json | null
          unit_price: number
          quantity: number
          total_price: number
          product_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          variant_id?: string | null
          product_name: string
          product_sku: string
          variant_name?: string | null
          variant_sku?: string | null
          variant_attributes?: Json | null
          unit_price: number
          quantity: number
          total_price: number
          product_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          variant_id?: string | null
          product_name?: string
          product_sku?: string
          variant_name?: string | null
          variant_sku?: string | null
          variant_attributes?: Json | null
          unit_price?: number
          quantity?: number
          total_price?: number
          product_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          }
        ]
      }
      cart_items: {
        Row: {
          id: string
          user_id: string | null
          guest_id: string | null
          product_id: string
          variant_id: string | null
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          guest_id?: string | null
          product_id: string
          variant_id?: string | null
          quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          guest_id?: string | null
          product_id?: string
          variant_id?: string | null
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          }
        ]
      }
      inventory_movements: {
        Row: {
          id: string
          inventory_id: string
          movement_type: string
          quantity: number
          reference_type: string | null
          reference_id: string | null
          reason: string | null
          performed_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          inventory_id: string
          movement_type: string
          quantity: number
          reference_type?: string | null
          reference_id?: string | null
          reason?: string | null
          performed_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          inventory_id?: string
          movement_type?: string
          quantity?: number
          reference_type?: string | null
          reference_id?: string | null
          reason?: string | null
          performed_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      coupons: {
        Row: {
          id: string
          code: string
          name: string
          description: string | null
          type: string
          value: number
          minimum_order_amount: number | null
          maximum_discount_amount: number | null
          usage_limit: number | null
          used_count: number
          user_usage_limit: number
          valid_from: string
          valid_until: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          description?: string | null
          type: string
          value: number
          minimum_order_amount?: number | null
          maximum_discount_amount?: number | null
          usage_limit?: number | null
          used_count?: number
          user_usage_limit?: number
          valid_from?: string
          valid_until?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          description?: string | null
          type?: string
          value?: number
          minimum_order_amount?: number | null
          maximum_discount_amount?: number | null
          usage_limit?: number | null
          used_count?: number
          user_usage_limit?: number
          valid_from?: string
          valid_until?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      coupon_usage: {
        Row: {
          id: string
          coupon_id: string
          user_id: string | null
          order_id: string
          discount_amount: number
          created_at: string
        }
        Insert: {
          id?: string
          coupon_id: string
          user_id?: string | null
          order_id: string
          discount_amount: number
          created_at?: string
        }
        Update: {
          id?: string
          coupon_id?: string
          user_id?: string | null
          order_id?: string
          discount_amount?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_usage_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_usage_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}