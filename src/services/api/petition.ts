interface PetitionSubmitResponse {
  success: boolean
  error?: string
}

export async function submitPetition(data: {
  name: string
  email: string
  organization_id: string
  organization_name: string
}): Promise<PetitionSubmitResponse> {
  const response = await fetch('/api/petition', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Failed to submit petition')
  }

  return result
} 