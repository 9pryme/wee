"use client"

import { Fragment } from "react"
import { Dialog as HeadlessDialog, Transition } from "@headlessui/react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function Dialog({ isOpen, onClose, children, className }: DialogProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <HeadlessDialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <HeadlessDialog.Panel 
                className={cn(
                  "w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all",
                  className
                )}
              >
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </button>
                {children}
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  )
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mb-4 text-center sm:text-left", className)}
      {...props}
    />
  )
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <HeadlessDialog.Title
      as="h3"
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
}

export function DialogContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-4", className)}
      {...props}
    />
  )
} 