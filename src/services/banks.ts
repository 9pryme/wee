export interface Bank {
  code: string;
  name: string;
  isTest?: boolean;
}

export async function getBanks(): Promise<Bank[]> {
  try {
    const response = await fetch('/api/banks')

    if (!response.ok) {
      throw new Error('Failed to fetch banks')
    }

    const data = await response.json()
    
    const testBanks: Bank[] = [
      {
        code: 'TEST1',
        name: 'Test Bank 1',
        isTest: true
      },
      {
        code: 'TEST2',
        name: 'Test Bank 2',
        isTest: true
      }
    ]

    return [...testBanks, ...(data.banks || [])]
  } catch (error) {
    console.error('Error fetching banks:', error)
    return []
  }
} 