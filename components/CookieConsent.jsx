'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  
  // Cookie preferences
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    functional: false,
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent')
    
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000)
    } else {
      // Load saved preferences and apply them
      const savedPreferences = JSON.parse(consent)
      setPreferences(savedPreferences)
      applyConsent(savedPreferences)
    }
  }, [])

  const applyConsent = (prefs) => {
    // Load Google Analytics if analytics cookies are accepted
    if (prefs.analytics) {
      loadGoogleAnalytics()
    }
    
    // Add other cookie-dependent scripts here
    // if (prefs.functional) { ... }
  }

  const loadGoogleAnalytics = () => {
    // Only load if not already loaded
    if (window.gtag) return

    // Add GA script
    const script1 = document.createElement('script')
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID'
    script1.async = true
    document.head.appendChild(script1)

    // Initialize GA
    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID', {
        anonymize_ip: true
      });
    `
    document.head.appendChild(script2)
  }

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      functional: true,
    }
    
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted))
    setPreferences(allAccepted)
    applyConsent(allAccepted)
    setShowBanner(false)
  }

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      functional: false,
    }
    
    localStorage.setItem('cookie-consent', JSON.stringify(onlyNecessary))
    setPreferences(onlyNecessary)
    setShowBanner(false)
  }

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences))
    applyConsent(preferences)
    setShowBanner(false)
    setShowSettings(false)
  }

  const togglePreference = (key) => {
    if (key === 'necessary') return // Can't disable necessary cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
            onClick={() => !showSettings && handleRejectAll()}
          />

          {/* Banner */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] p-4 md:p-6"
          >
            <div className="max-w-6xl mx-auto">
              {!showSettings ? (
                // Main Banner
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V13H11V7ZM11 15H13V17H11V15Z" fill="currentColor"/>
                        </svg>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        We Use Cookies
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        We use cookies to improve your experience on our site.
                        By consenting to cookies, you allow us to analyse traffic and personalise content.
                      </p>
                      <Link href="/cookies-policy" className="text-primary hover:underline text-sm font-medium">
                        Learn more about cookies
                      </Link>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <button
                        onClick={() => setShowSettings(true)}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap"
                      >
                        Customise
                      </button>
                      <button
                        onClick={handleRejectAll}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap"
                      >
                        Reject All
                      </button>
                      <button
                        onClick={handleAcceptAll}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
                      >
                        Accept All
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Settings Panel
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 md:p-8 max-h-[80vh] overflow-y-auto">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">
                        Cookie Settings
                      </h3>
                      <button
                        onClick={() => setShowSettings(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Choose which types of cookies you want to allow on our site.
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    {/* Necessary Cookies */}
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">
                            Necessary Cookies
                          </h4>
                          <p className="text-sm text-gray-600">
                            These cookies are essential for the site to function and cannot be disabled.
                          </p>
                        </div>
                        <div className="ml-4">
                          <div className="w-12 h-6 bg-primary rounded-full flex items-center px-1 cursor-not-allowed">
                            <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Analytics Cookies */}
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">
                            Analytics Cookies
                          </h4>
                          <p className="text-sm text-gray-600">
                            Help us understand how visitors use the site (Google Analytics).
                          </p>
                        </div>
                        <div className="ml-4">
                          <button
                            onClick={() => togglePreference('analytics')}
                            className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                              preferences.analytics ? 'bg-primary' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                              preferences.analytics ? 'ml-auto' : ''
                            }`}></div>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Functional Cookies */}
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">
                            Functional Cookies
                          </h4>
                          <p className="text-sm text-gray-600">
                            Remember your settings and preferences (e.g., language, theme).
                          </p>
                        </div>
                        <div className="ml-4">
                          <button
                            onClick={() => togglePreference('functional')}
                            className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                              preferences.functional ? 'bg-primary' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                              preferences.functional ? 'ml-auto' : ''
                            }`}></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleRejectAll}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Reject All
                    </button>
                    <button
                      onClick={handleSavePreferences}
                      className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
