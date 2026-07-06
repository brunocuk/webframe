
export const metadata = {
  title: 'Privacy Policy - Webframe',
  description: 'Privacy policy and data protection for Webframe web design services.',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white">

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Privacy <span className="italic font-light bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Policy</span>
          </h1>

          <p className="text-gray-600 mb-12">
            Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Webframe ("we", "our" or "Webframe") respects your privacy and is committed to protecting your personal data.
                This privacy policy explains how we collect, use, and protect your data when you use our website and services.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">2. Contact Information</h2>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> hello@web-frame.eu</p>
                <p className="text-gray-700 mb-2"><strong>Service Area:</strong> Netherlands, Denmark, Ireland, United Kingdom</p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">3. Data We Collect</h2>

              <h3 className="text-xl font-bold mb-3 text-gray-900">3.1 Data You Provide</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We collect personal data that you voluntarily provide when:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>You fill out a contact form</li>
                <li>You schedule a call or consultation</li>
                <li>You subscribe to our newsletter</li>
                <li>You communicate with us via email</li>
              </ul>

              <p className="text-gray-700 leading-relaxed mb-4">
                This data may include:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Company name</li>
                <li>Details about your project or enquiry</li>
              </ul>

              <h3 className="text-xl font-bold mb-3 text-gray-900">3.2 Automatically Collected Data</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you visit our website, we automatically collect certain technical data:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent</li>
                <li>Referral sources</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">4. How We Use Your Data</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use your personal data for the following purposes:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Responding to your enquiries and providing requested information</li>
                <li>Organising consultations and meetings</li>
                <li>Delivering our web design and development services</li>
                <li>Sending newsletters (only if you have consented)</li>
                <li>Improving our website and services</li>
                <li>Analysing site usage via Google Analytics</li>
                <li>Fulfilling legal obligations</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">5. Legal Basis for Processing</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We process your personal data based on:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li><strong>Consent:</strong> When you have given consent for a specific purpose (e.g., newsletter)</li>
                <li><strong>Contract:</strong> When processing is necessary to fulfil a contract</li>
                <li><strong>Legitimate interest:</strong> To improve our services and website</li>
                <li><strong>Legal obligation:</strong> When required to meet legal requirements</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">6. Data Sharing</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell, rent, or share your personal data with third parties, except in the following cases:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li><strong>Service providers:</strong> We use trusted third parties for hosting, analytics (Google Analytics),
                and email services. These providers may only access your data as necessary to provide services.</li>
                <li><strong>Legal requirements:</strong> We may disclose data if required by law or legal proceedings.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">7. Cookies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our website uses cookies for:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Ensuring website functionality</li>
                <li>Traffic analysis (Google Analytics)</li>
                <li>Remembering your preferences</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                You can control and delete cookies through your browser settings. Please note
                that disabling cookies may affect website functionality.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">8. Data Security</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement appropriate technical and organisational measures to protect your personal data:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>SSL encryption for all communications</li>
                <li>Secure hosting servers</li>
                <li>Regular security checks</li>
                <li>Limited access to data by authorised personnel only</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">9. Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Under GDPR, you have the following rights:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li><strong>Right of access:</strong> You can request a copy of your personal data</li>
                <li><strong>Right to rectification:</strong> You can request correction of inaccurate data</li>
                <li><strong>Right to erasure:</strong> You can request deletion of your data</li>
                <li><strong>Right to restrict processing:</strong> You can limit how we use your data</li>
                <li><strong>Right to portability:</strong> You can receive your data in a structured format</li>
                <li><strong>Right to object:</strong> You can object to processing of your data</li>
                <li><strong>Right to withdraw consent:</strong> You can withdraw consent at any time</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                To exercise these rights, contact us at: hello@web-frame.eu
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">10. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We retain your personal data only for as long as necessary for the purposes stated in this
                policy or as required by law. Generally:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Enquiry data: 2 years after last contact</li>
                <li>Client data: 7 years after project completion (accounting requirements)</li>
                <li>Newsletter subscriptions: Until you unsubscribe</li>
                <li>Analytics data: 26 months (Google Analytics default)</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">11. Links to Other Websites</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our website may contain links to external websites. We are not responsible for
                the privacy policies or content of those sites. We recommend reading the privacy policy
                of each website you visit.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">12. Policy Changes</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to modify this privacy policy. All changes will be posted
                on this page with the date of last update. We recommend checking this
                page periodically to stay informed about our data protection practices.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">13. Contact</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions about this privacy policy or a complaint regarding data protection,
                contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> hello@web-frame.eu</p>
                <p className="text-gray-700 mt-4">
                  You also have the right to lodge a complaint with your local data protection authority
                  if you believe your data processing violates GDPR.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

    </main>
  )
}
