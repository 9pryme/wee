import { supabase } from "@/lib/supabase";

export interface Organization {
  id: string;
  organization_name: string;
  name: string;
  email: string | null;
  type: string;
  title: string;
  organizationemail: string;
}

export async function getOrganizations(): Promise<Organization[]> {
  const { data } = await supabase
    .from('organizations')
    .select('*')
    .order('organization_name')

  return data || []
}

export type AdminOrganization = Organization;

export async function getOrganizationsForAdmin(): Promise<AdminOrganization[]> {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .order('organization_name')

  if (error) {
    console.error('Error fetching organizations:', error)
    throw error
  }

  return data || []
} 