import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkAdmin() {
  try {
    const { data, error } = await supabase.auth.admin.listUsers()
    
    if (error) throw error
    console.log('Users:', data.users)
  } catch (error) {
    console.error('Error checking admin:', error)
  }
}

checkAdmin() 