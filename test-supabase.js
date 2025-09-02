const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Test Supabase connection and tables
async function testSupabase() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Missing Supabase environment variables');
      console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
      console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
      return;
    }
    
    console.log('✅ Environment variables found');
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test connection by checking orders table
    console.log('🔍 Testing orders table...');
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, order_number')
      .limit(1);
    
    if (ordersError) {
      console.error('❌ Orders table error:', ordersError.message);
    } else {
      console.log('✅ Orders table accessible, found', orders.length, 'records');
    }
    
    // Test order_items table
    console.log('🔍 Testing order_items table...');
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('id, product_name')
      .limit(1);
    
    if (itemsError) {
      console.error('❌ Order items table error:', itemsError.message);
    } else {
      console.log('✅ Order items table accessible, found', orderItems.length, 'records');
    }
    
    // Test creating a simple order
    console.log('🔍 Testing order creation...');
    const testOrder = {
      order_number: `TEST-${Date.now()}`,
      guest_email: 'test@example.com',
      status: 'pending',
      payment_status: 'pending',
      subtotal: 100,
      total_amount: 100,
      shipping_address: {
        firstName: 'Test',
        lastName: 'User',
        address: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'India'
      },
      payment_method: 'test'
    };
    
    const { data: createdOrder, error: createError } = await supabase
      .from('orders')
      .insert(testOrder)
      .select()
      .single();
    
    if (createError) {
      console.error('❌ Order creation failed:', createError.message);
    } else {
      console.log('✅ Test order created successfully:', createdOrder.id);
      
      // Clean up test order
      await supabase.from('orders').delete().eq('id', createdOrder.id);
      console.log('🧹 Test order cleaned up');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSupabase();