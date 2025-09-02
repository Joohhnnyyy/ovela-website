-- Supabase Database Schema for E-commerce Platform
-- This schema supports orders, inventory, user management, and order history

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User addresses table
CREATE TABLE public.user_addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('shipping', 'billing')) NOT NULL DEFAULT 'shipping',
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product categories table
CREATE TABLE public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES public.categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  sku TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  brand TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  weight DECIMAL(8,2),
  dimensions JSONB, -- {"length": 10, "width": 5, "height": 3}
  images JSONB DEFAULT '[]'::jsonb, -- Array of image URLs
  tags TEXT[],
  meta_title TEXT,
  meta_description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product variants table (for size, color, etc.)
CREATE TABLE public.product_variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL, -- e.g., "Large - Black"
  attributes JSONB NOT NULL, -- {"size": "L", "color": "Black"}
  price_adjustment DECIMAL(10,2) DEFAULT 0,
  weight_adjustment DECIMAL(8,2) DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory table
CREATE TABLE public.inventory (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER NOT NULL DEFAULT 0, -- For pending orders
  reorder_level INTEGER DEFAULT 10,
  max_stock_level INTEGER,
  location TEXT DEFAULT 'main_warehouse',
  last_restocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT inventory_product_variant_unique UNIQUE (product_id, variant_id, location),
  CONSTRAINT inventory_check CHECK (
    (product_id IS NOT NULL AND variant_id IS NULL) OR 
    (product_id IS NULL AND variant_id IS NOT NULL)
  )
);

-- Orders table
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  guest_email TEXT,
  status TEXT CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')) NOT NULL DEFAULT 'pending',
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')) NOT NULL DEFAULT 'pending',
  
  -- Pricing
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  shipping_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- Tax breakdown for Indian GST
  cgst_amount DECIMAL(10,2) DEFAULT 0,
  sgst_amount DECIMAL(10,2) DEFAULT 0,
  igst_amount DECIMAL(10,2) DEFAULT 0,
  
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT orders_user_or_guest CHECK (
    (user_id IS NOT NULL AND guest_email IS NULL) OR 
    (user_id IS NULL AND guest_email IS NOT NULL)
  )
);

-- Order items table
CREATE TABLE public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  variant_id UUID REFERENCES public.product_variants(id),
  
  -- Product details at time of order (for historical accuracy)
  product_name TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  variant_name TEXT,
  variant_sku TEXT,
  variant_attributes JSONB, -- {"size": "L", "color": "Black"}
  
  -- Pricing
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_price DECIMAL(10,2) NOT NULL,
  
  -- Additional data
  product_image_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shopping cart table (for persistent carts)
CREATE TABLE public.cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  guest_id TEXT, -- For guest users
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT cart_user_or_guest CHECK (
    (user_id IS NOT NULL AND guest_id IS NULL) OR 
    (user_id IS NULL AND guest_id IS NOT NULL)
  ),
  CONSTRAINT cart_unique_item UNIQUE (user_id, guest_id, product_id, variant_id)
);

-- Inventory movements table (for tracking stock changes)
CREATE TABLE public.inventory_movements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  inventory_id UUID REFERENCES public.inventory(id) ON DELETE CASCADE NOT NULL,
  movement_type TEXT CHECK (movement_type IN ('in', 'out', 'adjustment', 'reserved', 'released')) NOT NULL,
  quantity INTEGER NOT NULL,
  reference_type TEXT, -- 'order', 'restock', 'adjustment', etc.
  reference_id UUID, -- order_id, restock_id, etc.
  reason TEXT,
  performed_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupons/Discounts table
CREATE TABLE public.coupons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('percentage', 'fixed_amount', 'free_shipping')) NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  minimum_order_amount DECIMAL(10,2),
  maximum_discount_amount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  user_usage_limit INTEGER DEFAULT 1,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupon usage tracking
CREATE TABLE public.coupon_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  coupon_id UUID REFERENCES public.coupons(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  discount_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_active ON public.products(is_active);
CREATE INDEX idx_products_featured ON public.products(is_featured);
CREATE INDEX idx_product_variants_product ON public.product_variants(product_id);
CREATE INDEX idx_inventory_product ON public.inventory(product_id);
CREATE INDEX idx_inventory_variant ON public.inventory(variant_id);
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_date ON public.orders(order_date);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_order_items_product ON public.order_items(product_id);
CREATE INDEX idx_cart_items_user ON public.cart_items(user_id);
CREATE INDEX idx_cart_items_guest ON public.cart_items(guest_id);
CREATE INDEX idx_inventory_movements_inventory ON public.inventory_movements(inventory_id);
CREATE INDEX idx_inventory_movements_reference ON public.inventory_movements(reference_type, reference_id);

-- Create functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_addresses_updated_at BEFORE UPDATE ON public.user_addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON public.inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON public.order_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON public.coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    order_num TEXT;
    counter INTEGER;
BEGIN
    -- Get current date in YYYYMMDD format
    order_num := 'OV' || TO_CHAR(NOW(), 'YYYYMMDD');
    
    -- Get count of orders today
    SELECT COUNT(*) + 1 INTO counter
    FROM public.orders
    WHERE order_number LIKE order_num || '%';
    
    -- Append counter with leading zeros
    order_num := order_num || LPAD(counter::TEXT, 4, '0');
    
    RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically set order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set order number
CREATE TRIGGER set_order_number_trigger
    BEFORE INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_number();

-- Function to update inventory on order
CREATE OR REPLACE FUNCTION update_inventory_on_order()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Reserve inventory when order item is created
        UPDATE public.inventory 
        SET reserved_quantity = reserved_quantity + NEW.quantity
        WHERE (product_id = NEW.product_id AND variant_id IS NULL AND NEW.variant_id IS NULL)
           OR (variant_id = NEW.variant_id AND NEW.variant_id IS NOT NULL);
        
        -- Log inventory movement
        INSERT INTO public.inventory_movements (inventory_id, movement_type, quantity, reference_type, reference_id, reason)
        SELECT i.id, 'reserved', NEW.quantity, 'order', NEW.order_id, 'Order item reserved'
        FROM public.inventory i
        WHERE (i.product_id = NEW.product_id AND i.variant_id IS NULL AND NEW.variant_id IS NULL)
           OR (i.variant_id = NEW.variant_id AND NEW.variant_id IS NOT NULL);
        
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update inventory on order
CREATE TRIGGER update_inventory_on_order_trigger
    AFTER INSERT ON public.order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_on_order();

-- Function to handle order status changes
CREATE OR REPLACE FUNCTION handle_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- When order is shipped, convert reserved to actual out
    IF OLD.status != 'shipped' AND NEW.status = 'shipped' THEN
        UPDATE public.inventory 
        SET quantity = quantity - oi.quantity,
            reserved_quantity = reserved_quantity - oi.quantity
        FROM public.order_items oi
        WHERE oi.order_id = NEW.id
          AND ((inventory.product_id = oi.product_id AND inventory.variant_id IS NULL AND oi.variant_id IS NULL)
               OR (inventory.variant_id = oi.variant_id AND oi.variant_id IS NOT NULL));
        
        -- Log inventory movements
        INSERT INTO public.inventory_movements (inventory_id, movement_type, quantity, reference_type, reference_id, reason)
        SELECT i.id, 'out', oi.quantity, 'order', NEW.id, 'Order shipped'
        FROM public.inventory i
        JOIN public.order_items oi ON oi.order_id = NEW.id
        WHERE (i.product_id = oi.product_id AND i.variant_id IS NULL AND oi.variant_id IS NULL)
           OR (i.variant_id = oi.variant_id AND oi.variant_id IS NOT NULL);
        
        INSERT INTO public.inventory_movements (inventory_id, movement_type, quantity, reference_type, reference_id, reason)
        SELECT i.id, 'released', -oi.quantity, 'order', NEW.id, 'Reserved quantity released'
        FROM public.inventory i
        JOIN public.order_items oi ON oi.order_id = NEW.id
        WHERE (i.product_id = oi.product_id AND i.variant_id IS NULL AND oi.variant_id IS NULL)
           OR (i.variant_id = oi.variant_id AND oi.variant_id IS NOT NULL);
    END IF;
    
    -- When order is cancelled, release reserved inventory
    IF OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
        UPDATE public.inventory 
        SET reserved_quantity = reserved_quantity - oi.quantity
        FROM public.order_items oi
        WHERE oi.order_id = NEW.id
          AND ((inventory.product_id = oi.product_id AND inventory.variant_id IS NULL AND oi.variant_id IS NULL)
               OR (inventory.variant_id = oi.variant_id AND oi.variant_id IS NOT NULL));
        
        -- Log inventory movement
        INSERT INTO public.inventory_movements (inventory_id, movement_type, quantity, reference_type, reference_id, reason)
        SELECT i.id, 'released', oi.quantity, 'order', NEW.id, 'Order cancelled - reserved quantity released'
        FROM public.inventory i
        JOIN public.order_items oi ON oi.order_id = NEW.id
        WHERE (i.product_id = oi.product_id AND i.variant_id IS NULL AND oi.variant_id IS NULL)
           OR (i.variant_id = oi.variant_id AND oi.variant_id IS NOT NULL);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for order status changes
CREATE TRIGGER handle_order_status_change_trigger
    AFTER UPDATE OF status ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION handle_order_status_change();

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Users can only see their own addresses
CREATE POLICY "Users can view own addresses" ON public.user_addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own addresses" ON public.user_addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own addresses" ON public.user_addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own addresses" ON public.user_addresses FOR DELETE USING (auth.uid() = user_id);

-- Users can only see their own orders
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only see their own cart items
CREATE POLICY "Users can view own cart" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cart items" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart items" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cart items" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

-- Public read access for products, categories, etc.
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view product variants" ON public.product_variants FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view inventory" ON public.inventory FOR SELECT USING (true);
CREATE POLICY "Anyone can view active coupons" ON public.coupons FOR SELECT USING (is_active = true);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, display_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'display_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample categories
INSERT INTO public.categories (name, slug, description) VALUES
('Clothing', 'clothing', 'All clothing items'),
('Hoodies', 'hoodies', 'Comfortable hoodies and sweatshirts'),
('Jackets', 'jackets', 'Stylish jackets and outerwear'),
('Sets', 'sets', 'Coordinated clothing sets'),
('Accessories', 'accessories', 'Fashion accessories'),
('Bags', 'bags', 'Bags and backpacks'),
('Sneakers', 'sneakers', 'Footwear and sneakers');

-- Insert sample products (matching your existing data)
INSERT INTO public.products (name, slug, sku, category_id, base_price, description, images) 
SELECT 
    'Premium Hoodie',
    'premium-hoodie',
    'HOODIE-001',
    c.id,
    1899.00,
    'Comfortable premium hoodie made from high-quality materials',
    '["https://example.com/hoodie1.jpg"]'::jsonb
FROM public.categories c WHERE c.slug = 'hoodies';

INSERT INTO public.products (name, slug, sku, category_id, base_price, description, images)
SELECT 
    'Leather Jacket',
    'leather-jacket',
    'JACKET-001',
    c.id,
    2909.00,
    'Premium leather jacket with modern design',
    '["https://example.com/jacket1.jpg"]'::jsonb
FROM public.categories c WHERE c.slug = 'jackets';

INSERT INTO public.products (name, slug, sku, category_id, base_price, description, images)
SELECT 
    'Tracksuit Set',
    'tracksuit-set',
    'SET-001',
    c.id,
    2489.00,
    'Complete tracksuit set for comfort and style',
    '["https://example.com/set1.jpg"]'::jsonb
FROM public.categories c WHERE c.slug = 'sets';

-- Insert sample inventory
INSERT INTO public.inventory (product_id, quantity, reorder_level)
SELECT id, 100, 10 FROM public.products;

COMMIT;