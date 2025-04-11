import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

// Add console.log to debug environment variables
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Service Key exists:', !!process.env.SUPABASE_SERVICE_KEY)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface BankData {
  code: string
  name: string
}

async function syncBanks() {
  try {
    // Fetch banks from API
    const response = await fetch('https://smeplug.ng/api/v1/transfer/banks', {
      headers: {
        'Authorization': `Bearer ${process.env.SMEPLUG_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) throw new Error('Failed to fetch banks')
    
    const data = await response.json()
    const banks = data.banks.map((bank: BankData) => ({
      code: bank.code,
      name: bank.name
    }))

    // Upsert banks to Supabase
    const { error } = await supabase
      .from('banks')
      .upsert(banks, { 
        onConflict: 'code',
        ignoreDuplicates: false 
      })

    if (error) throw error
    console.log('Successfully synced banks')

  } catch (error) {
    console.error('Error syncing banks:', error)
  }
}

syncBanks() 