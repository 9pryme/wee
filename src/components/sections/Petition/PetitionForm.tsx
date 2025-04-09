"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/common/Button/Button"

const banks = [
  { value: "access", label: "Access Bank" },
  { value: "gtb", label: "GTBank" },
  { value: "first", label: "First Bank" },
  // Add more banks as needed
]

export function PetitionForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bank: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    
    // Add basic validation
    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.bank) newErrors.bank = "Bank selection is required"
    
    setErrors(newErrors)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[500px] mx-auto bg-[#F8EFE2] p-8 rounded-lg"
    >
      <div className="mb-8">
        <h2 className="text-4xl md:text-5xl font-['Oswald'] font-bold text-black uppercase mb-4">
          YOU WILL BE THE <span className="text-[#FF4D93]">5,000TH</span> PERSON
        </h2>
        <h3 className="text-xl text-black/80 font-montserrat">
          Enter your details to send the above email to your bank
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Your Name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
        />

        <Input
          label="Your Email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />

        <Select
          label="Your Bank"
          options={banks}
          value={formData.bank}
          onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
          error={errors.bank}
        />

        <Button
          variant="primary"
          size="lg"
          bgColor="bg-[#ED323D]"
          className="w-full text-white text-xl"
        >
          Tell your banks to fund women now
        </Button>
      </form>
    </motion.div>
  )
}