export interface Bank {
  code: string;
  name: string;
}

export async function getBanks(): Promise<Bank[]> {
  try {
    const response = await fetch('/api/banks')

    if (!response.ok) {
      throw new Error('Failed to fetch banks')
    }

    const data = await response.json()
    return data.banks || []
  } catch (error) {
    console.error('Error fetching banks:', error)
    return []
  }
} 