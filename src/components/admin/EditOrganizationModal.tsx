"use client"
import { useState, useEffect } from "react"
import { OrganizationForm } from "./OrganizationForm"
import { supabase } from "@/lib/supabase"
import type { Organization } from "@/services/banks"
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "@/components/ui/dialog"

interface EditOrganizationModalProps {
  organizationId: string | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function EditOrganizationModal({ 
  organizationId, 
  isOpen, 
  onClose,
  onSuccess 
}: EditOrganizationModalProps) {
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadOrganization() {
      if (!organizationId) return
      
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', organizationId)
          .single()

        if (error) throw error
        setOrganization(data)
      } catch (error) {
        console.error('Error loading organization:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen) {
      loadOrganization()
    }
  }, [organizationId, isOpen])

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>Edit Organization</DialogTitle>
      </DialogHeader>
      
      <DialogContent>
        {isLoading ? (
          <div className="py-8 text-center">Loading...</div>
        ) : !organization ? (
          <div className="py-8 text-center">Organization not found</div>
        ) : (
          <OrganizationForm 
            mode="edit" 
            initialData={organization} 
            onSuccess={() => {
              onSuccess()
              onClose()
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
} 