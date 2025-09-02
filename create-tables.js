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

// Function to execute SQL via direct query
function executeQuery(sql) {
  return new Promise((resolve, reject) => {
    const url = new URL(supabaseUrl);
    const postData = sql;
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
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
        console.log('Response status:', res.statusCode);
        console.log('Response headers:', res.headers);
        console.log('Response body:', data);
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data: data });
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

async function createTables() {
  try {
    console.log('Reading minimal schema file...');
    const schemaPath = path.join(__dirname, 'minimal-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Executing minimal schema...');
    const result = await executeQuery(schema);
    
    if (result.success) {
      console.log('✅ Tables created successfully!');
      console.log('Result:', result.data);
    } else {
      console.log('❌ Failed to create tables:');
      console.log('Status Code:', result.statusCode);
      console.log('Error:', result.error);
      
      // Try alternative approach - create tables one by one
      console.log('\n🔄 Trying alternative approach...');
      console.log('Please manually run the SQL in minimal-schema.sql in your Supabase dashboard.');
      console.log('Go to: https://supabase.com/dashboard/project/amuxdfehshnzqwbsedhb/sql');
    }
    
  } catch (err) {
    console.error('❌ Error creating tables:', err);
    console.log('\n📝 Manual setup required:');
    console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/amuxdfehshnzqwbsedhb/sql');
    console.log('2. Copy and paste the contents of minimal-schema.sql');
    console.log('3. Click "Run" to execute the SQL');
  }
}

createTables();