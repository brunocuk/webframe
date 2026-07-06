
export const metadata = {
  title: 'Cookie Policy - Webframe',
  description: 'Information about the use of cookies on the Webframe website.',
}

export default function CookiesPolicyPage() {
  return (
    <main className="bg-white">

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Cookie <span className="italic font-light bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Policy</span>
          </h1>

          <p className="text-gray-600 mb-12">
            Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">1. What Are Cookies?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cookies are small text files that are stored on your device (computer,
                tablet, mobile) when you visit a website. They allow the website to recognise your device
                and remember certain information about your visit.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cookies do not harm your device and do not contain viruses. They help us improve website functionality
                and provide you with a better user experience.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">2. How We Use Cookies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Webframe uses cookies for the following purposes:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Ensuring basic website functionality</li>
                <li>Analysing website usage and improving services</li>
                <li>Remembering your settings and preferences</li>
                <li>Understanding how visitors use our website</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">3. Types of Cookies We Use</h2>

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-3 text-gray-900">3.1 Strictly Necessary Cookies</h3>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-4">
                  <p className="text-gray-700 mb-2"><strong>Purpose:</strong> Enable basic website functionality</p>
                  <p className="text-gray-700 mb-2"><strong>Duration:</strong> Session (deleted after closing browser)</p>
                  <p className="text-gray-700 mb-2"><strong>Example:</strong> Navigation cookies, form memory</p>
                  <p className="text-gray-700"><strong>Can be disabled:</strong> No - required for website operation</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-3 text-gray-900">3.2 Analytics Cookies (Google Analytics)</h3>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-4">
                  <p className="text-gray-700 mb-2"><strong>Purpose:</strong> Track website usage and analyse traffic</p>
                  <p className="text-gray-700 mb-2"><strong>Duration:</strong> Up to 2 years</p>
                  <p className="text-gray-700 mb-2"><strong>Provider:</strong> Google LLC</p>
                  <p className="text-gray-700 mb-4"><strong>Data:</strong> Visit count, duration, pages visited, demographic data</p>
                  <p className="text-gray-700 mb-2"><strong>Can be disabled:</strong> Yes</p>
                  <p className="text-gray-700 text-sm">
                    More about Google Analytics cookies:
                    <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener" className="text-primary hover:underline ml-1">
                      Google Cookies Policy
                    </a>
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> Google Analytics cookies anonymise your IP address and do not
                    collect personal data that directly identifies you.
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-3 text-gray-900">3.3 Functional Cookies</h3>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-4">
                  <p className="text-gray-700 mb-2"><strong>Purpose:</strong> Remember your settings (e.g., dark mode)</p>
                  <p className="text-gray-700 mb-2"><strong>Duration:</strong> Up to 1 year</p>
                  <p className="text-gray-700 mb-2"><strong>Example:</strong> Language, display theme</p>
                  <p className="text-gray-700"><strong>Can be disabled:</strong> Yes</p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">4. Detailed Cookie List</h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-3 text-left font-bold text-gray-900">Cookie Name</th>
                      <th className="border border-gray-300 p-3 text-left font-bold text-gray-900">Type</th>
                      <th className="border border-gray-300 p-3 text-left font-bold text-gray-900">Duration</th>
                      <th className="border border-gray-300 p-3 text-left font-bold text-gray-900">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-3 text-gray-700">_ga</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Analytics</td>
                      <td className="border border-gray-300 p-3 text-gray-700">2 years</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Distinguish users (Google Analytics)</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3 text-gray-700">_gid</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Analytics</td>
                      <td className="border border-gray-300 p-3 text-gray-700">24 hours</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Distinguish users (Google Analytics)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 text-gray-700">_gat</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Analytics</td>
                      <td className="border border-gray-300 p-3 text-gray-700">1 minute</td>
                      <td className="border border-gray-300 p-3 text-gray-700">Throttle request rate</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">5. Your Consent</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you first visit our website, you will see a cookie notice (cookie banner).
                You can choose:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li><strong>Accept all:</strong> You consent to all types of cookies</li>
                <li><strong>Customise:</strong> You choose which types of cookies to allow</li>
                <li><strong>Reject all:</strong> Only strictly necessary cookies are used</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                You can change your consent at any time through your browser settings or our
                Cookie Consent Manager (if implemented).
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">6. How to Control and Delete Cookies</h2>

              <h3 className="text-xl font-bold mb-3 text-gray-900">6.1 Browser Settings</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Most browsers automatically accept cookies, but you can control them through settings:
              </p>

              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="font-bold text-gray-900 mb-2">Google Chrome:</p>
                  <p className="text-gray-700 text-sm">Settings → Privacy and security → Cookies and other site data</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="font-bold text-gray-900 mb-2">Mozilla Firefox:</p>
                  <p className="text-gray-700 text-sm">Settings → Privacy & Security → Cookies and Site Data</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="font-bold text-gray-900 mb-2">Safari:</p>
                  <p className="text-gray-700 text-sm">Preferences → Privacy → Manage Website Data</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="font-bold text-gray-900 mb-2">Microsoft Edge:</p>
                  <p className="text-gray-700 text-sm">Settings → Cookies and site permissions → Manage and delete cookies and site data</p>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3 text-gray-900">6.2 Opt-out of Google Analytics</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You can disable Google Analytics by installing:
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline ml-1"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>
              </p>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <p className="text-sm text-amber-900">
                  <strong>Note:</strong> Disabling cookies may affect website functionality.
                  Some features may not work correctly.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">7. Third-Party Cookies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use third-party services that may set their own cookies:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>
                  <strong>Google Analytics:</strong> For website usage analysis
                  <br />
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" className="text-primary hover:underline text-sm">
                    Google Privacy Policy
                  </a>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not control cookies set by third parties. We recommend reading their
                privacy policies.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">8. Policy Updates</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update this Cookie Policy from time to time to reflect changes in technology,
                legislation, or our business practices. All changes will be published on this page with
                the date of last update.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">9. Additional Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For more information about data protection, please read our:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>
                  <a href="/privacy-policy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms-of-service" className="text-primary hover:underline">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">10. Contact</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions about our use of cookies, contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> hello@web-frame.eu</p>
              </div>
            </section>
          </div>
        </div>
      </div>

    </main>
  )
}
