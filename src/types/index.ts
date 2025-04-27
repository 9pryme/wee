export interface UTMLink {
  id: string
  volunteer_name: string
  utm_source: string
  utm_medium: string
  utm_campaign: string
  full_url: string
  tracking_url: string
  tracking_id: string
  click_count: number
  conversion_count: number
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  organization_name: string
  organizationemail: string
  type: string
  created_at: string
  updated_at: string
}

export interface PetitionSubmission {
  id: string
  petitioner_name: string
  petitioner_email: string
  organization_id: string
  organization_name: string
  created_at: string
  updated_at: string
}

declare global {
  interface Window {
    va?: (event: "beforeSend" | "event" | "pageview", properties?: unknown) => void
  }
} 