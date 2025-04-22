export interface PetitionSubmission {
  name: string
  email: string
  bank_code: string
  bank_name: string
}

export { submitPetition } from './api/petition' 