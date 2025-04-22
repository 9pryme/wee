import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

// Create Supabase client with service role key for admin access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const organizations = [
  {
    type: 'bank',
    title: 'Access Bank',
    name: 'Access Bank',
    email: 'contact@accessbank.com',
    organization_name: 'Access Bank Plc'
  },
  {
    type: 'bank',
    title: 'Zenith Bank',
    name: 'Zenith Bank',
    email: 'contact@zenithbank.com',
    organization_name: 'Zenith Bank Plc'
  },
  {
    type: 'bank',
    title: 'United Bank for Africa',
    name: 'United Bank for Africa',
    email: 'contact@ubagroup.com',
    organization_name: 'United Bank for Africa'
  },
  {
    type: 'bank',
    title: 'Guaranty Trust Bank',
    name: 'Guaranty Trust Bank',
    email: 'contact@gtbank.com',
    organization_name: 'Guaranty Trust Bank'
  },
  {
    type: 'bank',
    title: 'First City Monument Bank',
    name: 'First City Monument Bank',
    email: 'contact@fcmb.com',
    organization_name: 'First City Monument Bank'
  }
]

async function setupOrganizations() {
  console.log('Setting up organizations...')
  
  for (const org of organizations) {
    const { error } = await supabase
      .from('organizations')
      .upsert(org)
    
    if (error) {
      console.error(`Error inserting ${org.name}:`, error)
    } else {
      console.log(`Successfully upserted ${org.name}`)
    }
  }
}

setupOrganizations()
  .then(() => {
    console.log('Setup complete')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Setup failed:', error)
    process.exit(1)
  }) 