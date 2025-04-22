export interface PetitionSubmission {
  name: string
  email: string
  organization_id: string  // Changed from bank_code
  organization_name: string  // Changed from bank_name
}

export { submitPetition } from './api/petition'