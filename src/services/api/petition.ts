export async function submitPetition(data: {
  name: string
  email: string
  bank_code: string
  bank_name: string
}): Promise<void> {
  const response = await fetch('/api/petition', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to submit petition')
  }

  return response.json()
} 