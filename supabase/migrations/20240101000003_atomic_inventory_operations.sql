-- Create atomic inventory operations to prevent race conditions

-- Function to atomically reserve stock
CREATE OR REPLACE FUNCTION reserve_stock_atomic(
  items_data JSONB,
  order_id TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  item JSONB;
  inventory_record RECORD;
  available_qty INTEGER;
BEGIN
  -- Start transaction
  BEGIN
    -- Process each item
    FOR item IN SELECT * FROM jsonb_array_elements(items_data)
    LOOP
      -- Get current inventory with row lock
      SELECT * INTO inventory_record
      FROM inventory
      WHERE product_id = (item->>'product_id')::UUID
        AND (variant_id = (item->>'variant_id')::UUID OR (variant_id IS NULL AND item->>'variant_id' IS NULL))
      FOR UPDATE;
      
      IF NOT FOUND THEN
        RAISE EXCEPTION 'Inventory not found for product_id: %', item->>'product_id';
      END IF;
      
      -- Calculate available quantity
      available_qty := inventory_record.quantity - inventory_record.reserved_quantity;
      
      -- Check if enough stock is available
      IF available_qty < (item->>'quantity')::INTEGER THEN
        RAISE EXCEPTION 'Insufficient stock. Available: %, Requested: %', available_qty, (item->>'quantity')::INTEGER;
      END IF;
      
      -- Update reserved quantity
      UPDATE inventory
      SET 
        reserved_quantity = reserved_quantity + (item->>'quantity')::INTEGER,
        updated_at = NOW()
      WHERE id = inventory_record.id;
      
      -- Record movement
      INSERT INTO inventory_movements (
        inventory_id,
        movement_type,
        quantity,
        reference_type,
        reference_id,
        reason,
        created_at
      ) VALUES (
        inventory_record.id,
        'reserved',
        (item->>'quantity')::INTEGER,
        'order',
        order_id,
        'Stock reserved for order',
        NOW()
      );
    END LOOP;
    
    RETURN TRUE;
  EXCEPTION
    WHEN OTHERS THEN
      -- Transaction will be rolled back automatically
      RAISE;
  END;
END;
$$;

-- Function to atomically fulfill order
CREATE OR REPLACE FUNCTION fulfill_order_atomic(
  items_data JSONB,
  order_id TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  item JSONB;
  inventory_record RECORD;
  new_quantity INTEGER;
  new_reserved_quantity INTEGER;
BEGIN
  -- Start transaction
  BEGIN
    -- Process each item
    FOR item IN SELECT * FROM jsonb_array_elements(items_data)
    LOOP
      -- Get current inventory with row lock
      SELECT * INTO inventory_record
      FROM inventory
      WHERE product_id = (item->>'product_id')::UUID
        AND (variant_id = (item->>'variant_id')::UUID OR (variant_id IS NULL AND item->>'variant_id' IS NULL))
      FOR UPDATE;
      
      IF NOT FOUND THEN
        RAISE EXCEPTION 'Inventory not found for product_id: %', item->>'product_id';
      END IF;
      
      -- Calculate new quantities
      new_quantity := inventory_record.quantity - (item->>'quantity')::INTEGER;
      new_reserved_quantity := GREATEST(0, inventory_record.reserved_quantity - (item->>'quantity')::INTEGER);
      
      -- Check if we have enough stock
      IF new_quantity < 0 THEN
        RAISE EXCEPTION 'Insufficient stock for fulfillment. Current: %, Requested: %', inventory_record.quantity, (item->>'quantity')::INTEGER;
      END IF;
      
      -- Update quantities
      UPDATE inventory
      SET 
        quantity = new_quantity,
        reserved_quantity = new_reserved_quantity,
        updated_at = NOW()
      WHERE id = inventory_record.id;
      
      -- Record movement
      INSERT INTO inventory_movements (
        inventory_id,
        movement_type,
        quantity,
        reference_type,
        reference_id,
        reason,
        created_at
      ) VALUES (
        inventory_record.id,
        'out',
        (item->>'quantity')::INTEGER,
        'order',
        order_id,
        'Stock sold - order fulfilled',
        NOW()
      );
    END LOOP;
    
    RETURN TRUE;
  EXCEPTION
    WHEN OTHERS THEN
      -- Transaction will be rolled back automatically
      RAISE;
  END;
END;
$$;

-- Function to atomically release reserved stock
CREATE OR REPLACE FUNCTION release_reserved_stock_atomic(
  items_data JSONB,
  order_id TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  item JSONB;
  inventory_record RECORD;
  new_reserved_quantity INTEGER;
BEGIN
  -- Start transaction
  BEGIN
    -- Process each item
    FOR item IN SELECT * FROM jsonb_array_elements(items_data)
    LOOP
      -- Get current inventory with row lock
      SELECT * INTO inventory_record
      FROM inventory
      WHERE product_id = (item->>'product_id')::UUID
        AND (variant_id = (item->>'variant_id')::UUID OR (variant_id IS NULL AND item->>'variant_id' IS NULL))
      FOR UPDATE;
      
      IF NOT FOUND THEN
        RAISE EXCEPTION 'Inventory not found for product_id: %', item->>'product_id';
      END IF;
      
      -- Calculate new reserved quantity
      new_reserved_quantity := GREATEST(0, inventory_record.reserved_quantity - (item->>'quantity')::INTEGER);
      
      -- Update reserved quantity
      UPDATE inventory
      SET 
        reserved_quantity = new_reserved_quantity,
        updated_at = NOW()
      WHERE id = inventory_record.id;
      
      -- Record movement
      INSERT INTO inventory_movements (
        inventory_id,
        movement_type,
        quantity,
        reference_type,
        reference_id,
        reason,
        created_at
      ) VALUES (
        inventory_record.id,
        'released',
        (item->>'quantity')::INTEGER,
        'order',
        order_id,
        'Stock released from cancelled order',
        NOW()
      );
    END LOOP;
    
    RETURN TRUE;
  EXCEPTION
    WHEN OTHERS THEN
      -- Transaction will be rolled back automatically
      RAISE;
  END;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION reserve_stock_atomic(JSONB, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION fulfill_order_atomic(JSONB, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION release_reserved_stock_atomic(JSONB, TEXT) TO authenticated;