import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import * as crypto from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

async function createAdmin() {
  const email = 'admin@weewantmore.ng'
  const password = 'WEEWANTMORE2025'
  const hashedPassword = hashPassword(password)

  try {
    const { error } = await supabase
      .from('admins')
      .insert({
        email,
        password: hashedPassword
      })
      .single()

    if (error) throw error
    console.log('Admin created successfully:', { email })
  } catch (error) {
    console.error('Error creating admin:', error)
  }
}

createAdmin() 