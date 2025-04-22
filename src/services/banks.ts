import { supabase } from "@/lib/supabase";

export interface Organization {
  id: string;
  organization_name: string;
  name: string;
  email: string | null;
  type: string;
  title: string;
}

export async function getOrganizations(): Promise<Organization[]> {
  const { data } = await supabase
    .from('organizations')
    .select('*')
    .order('organization_name')

  return data || []
}

export interface AdminOrganization extends Organization {
  type: string; // This will be truncated for display
}

export async function getOrganizationsForAdmin(): Promise<AdminOrganization[]> {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*') // Use * to match the working query
      .order('organization_name')

    if (error) throw error

    // Process data for admin display
    return (data || []).map(org => ({
      ...org,
      type: org.type.length > 6 ? `${org.type.slice(0, 6)}...` : org.type
    }))
  } catch (error) {
    console.error('Error fetching organizations:', error)
    return []
  }
} 