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

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <ContactModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <ContactModal isOpen={isOpen} onClose={closeModal} />
    </ContactModalContext.Provider>
  )
}
