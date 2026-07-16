'use client'

import { createContext, useContext, useState } from 'react'
import ContactModal from './ContactModal'

const ContactModalContext = createContext()

export function useContactModal() {
  const context = useContext(ContactModalContext)
  if (!context) {
    throw new Error('useContactModal must be used within ContactModalProvider')
  }
  return context
}

export default function ContactModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  // Plan the visitor clicked "Start Your Project" from (null = generic CTA,
  // the modal then asks them to pick one).
  const [preselectedPlan, setPreselectedPlan] = useState(null)

  const openModal = (options) => {
    setPreselectedPlan(options?.plan ?? null)
    setIsOpen(true)
  }
  const closeModal = () => setIsOpen(false)

  return (
    <ContactModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <ContactModal isOpen={isOpen} onClose={closeModal} preselectedPlan={preselectedPlan} />
    </ContactModalContext.Provider>
  )
}
