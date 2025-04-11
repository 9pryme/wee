import { supabase } from '@/lib/supabase'

interface PetitionSubmission {
  name: string
  email: string
  bank_code: string
  bank_name: string
}

export async function submitPetition(data: PetitionSubmission) {
  const { error } = await supabase
    .from('petition_submissions')
    .insert([data])

  if (error) throw error
  return true
} 