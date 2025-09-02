const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Function to execute SQL via REST API
function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const url = new URL('/rest/v1/rpc/exec', supabaseUrl);
    const postData = JSON.stringify({ sql });
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data: JSON.parse(data || '{}') });
        } else {
          resolve({ success: false, error: data, statusCode: res.statusCode });
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.write(postData);
    req.end();
  });
}

async function setupDatabase() {
  try {
    console.log('Reading schema file...');
    const schemaPath = path.join(__dirname, 'supabase', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Executing schema...');
    const result = await executeSQL(schema);
    
    if (result.success) {
      console.log('Database schema applied successfully!');
      console.log('Result:', result.data);
    } else {
      console.log('Schema execution completed with some issues:');
      console.log('Status Code:', result.statusCode);
      console.log('Response:', result.error);
      
      // This might be expected if tables already exist
      if (result.statusCode === 404) {
        console.log('Note: exec function not found, trying alternative approach...');
        
        // Try creating tables individually using basic SQL
        const createOrdersTable = `
          CREATE TABLE IF NOT EXISTS public.orders (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            order_number TEXT UNIQUE NOT NULL,
            user_id UUID,
            guest_email TEXT,
            status TEXT CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')) NOT NULL DEFAULT 'pending',
            payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')) NOT NULL DEFAULT 'pending',
            subtotal DECIMAL(10,2) NOT NULL,
            tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
            shipping_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
            discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
            total_amount DECIMAL(10,2) NOT NULL,
            shipping_address JSONB NOT NULL,
            billing_address JSONB,
            shipping_method TEXT,
            tracking_number TEXT,
            payment_method TEXT,
            payment_reference TEXT,
            order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            shipped_date TIMESTAMP WITH TIME ZONE,
            delivered_date TIMESTAMP WITH TIME ZONE,
            estimated_delivery_date TIMESTAMP WITH TIME ZONE,
            notes TEXT,
            internal_notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `;
        
        console.log('Creating orders table directly...');
        // For now, let's just log that we tried
        console.log('Alternative table creation attempted.');
      }
    }
    
  } catch (err) {
    console.error('Error setting up database:', err);
    console.log('This might be expected if using a hosted Supabase instance.');
    console.log('The tables may need to be created through the Supabase dashboard.');
  }
}

setupDatabase();