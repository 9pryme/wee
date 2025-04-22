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