-- Minimal schema for orders functionality
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID,
  guest_email TEXT,
  status TEXT CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')) NOT NULL DEFAULT 'pending',
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')) NOT NULL DEFAULT 'pending',
  
  -- Pricing
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  shipping_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- Shipping information
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  shipping_method TEXT,
  tracking_number TEXT,
  
  -- Payment information
  payment_method TEXT,
  payment_reference TEXT,
  
  -- Dates
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  shipped_date TIMESTAMP WITH TIME ZONE,
  delivered_date TIMESTAMP WITH TIME ZONE,
  estimated_delivery_date TIMESTAMP WITH TIME ZONE,
  
  -- Additional data
  notes TEXT,
  internal_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT NOT NULL, -- Using TEXT for now since we don't have products table
  
  -- Product details at time of order
  product_name TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  variant_name TEXT,
  variant_sku TEXT,
  size TEXT,
  color TEXT,
  
  -- Pricing
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_price DECIMAL(10,2) NOT NULL,
  
  -- Additional data
  product_image_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some sample data for testing
INSERT INTO public.orders (
  order_number,
  guest_email,
  status,
  payment_status,
  subtotal,
  total_amount,
  shipping_address,
  payment_method,
  estimated_delivery_date
) VALUES (
  'ORD-' || EXTRACT(EPOCH FROM NOW())::TEXT,
  'test@example.com',
  'processing',
  'paid',
  2999.00,
  2999.00,
  '{"firstName": "John", "lastName": "Doe", "address": "123 Main St", "city": "Mumbai", "state": "Maharashtra", "zipCode": "400001", "country": "India"}',
  'credit_card',
  NOW() + INTERVAL '7 days'
) ON CONFLICT (order_number) DO NOTHING;

-- Get the order ID for the sample order
DO $$
DECLARE
    sample_order_id UUID;
BEGIN
    SELECT id INTO sample_order_id FROM public.orders WHERE guest_email = 'test@example.com' LIMIT 1;
    
    IF sample_order_id IS NOT NULL THEN
        INSERT INTO public.order_items (
            order_id,
            product_id,
            product_name,
            product_sku,
            size,
            color,
            unit_price,
            quantity,
            total_price,
            product_image_url
        ) VALUES (
            sample_order_id,
            'b27-uptown-black',
            'B27 Uptown Black',
            'B27-UPT-BLK',
            '42',
            'Black',
            2999.00,
            1,
            2999.00,
            '/products/sneakers/b27-uptown-black/main.jpg'
        ) ON CONFLICT DO NOTHING;
    END IF;
END $$;