'use client'
import { OrganizationForm } from "@/components/admin/OrganizationForm"

export default function NewOrganization() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h1 className="text-xl font-bold">Create New Organization</h1>
        <OrganizationForm mode="create" />
      </div>
    </div>
  )
}