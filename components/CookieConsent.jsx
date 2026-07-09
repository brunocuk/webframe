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
          {/* Banner — compact corner card, never blocks the page */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-6 sm:max-w-sm z-[100]"
          >
            <div>
              {!showSettings ? (
                // Main Banner
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-5">
                  <h3 className="text-base font-bold text-gray-900 mb-1.5">
                    We Use Cookies
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    We use cookies to analyse traffic and improve your experience.{' '}
                    <Link href="/cookies-policy" className="text-primary hover:underline font-medium">
                      Learn more
                    </Link>
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleAcceptAll}
                      className="px-4 py-2 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
                    >
                      Accept All
                    </button>
                    <button
                      onClick={handleRejectAll}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
                    >
                      Reject All
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="px-2 py-2 text-gray-500 hover:text-gray-800 font-medium text-sm transition-colors"
                    >
                      Customise
                    </button>
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
