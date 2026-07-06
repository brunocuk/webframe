
export const metadata = {
  title: 'Terms of Service - Webframe',
  description: 'Terms of service and general terms for Webframe web design and development services.',
}

export default function TermsOfServicePage() {
  return (
    <main className="bg-white">
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Terms of <span className="italic font-light bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Service</span>
          </h1>

          <p className="text-gray-600 mb-12">
            Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">1. General</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms of Service ("Terms") govern your use of the Webframe website
                and web design and development services provided by Webframe
                ("we", "our" or "Webframe"). By accessing and using our website and services,
                you accept these Terms in full.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">2. Service Provider Information</h2>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <p className="text-gray-700 mb-2"><strong>Service Provider:</strong> Webframe</p>
                <p className="text-gray-700 mb-2"><strong>Email:</strong> hello@web-frame.eu</p>
                <p className="text-gray-700 mb-2"><strong>Service Area:</strong> Netherlands, Denmark, Ireland, United Kingdom</p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">3. Description of Services</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Webframe provides the following services:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Custom website design and development</li>
                <li>Custom adaptations based on your requirements</li>
                <li>SEO optimisation</li>
                <li>Contact form integration</li>
                <li>Website deployment and hosting setup</li>
                <li>30 days free technical support after launch</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                Detailed service descriptions and pricing are available on our website in the Pricing section.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">4. Ordering and Payment</h2>

              <h3 className="text-xl font-bold mb-3 text-gray-900">4.1 Ordering</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                The process begins by booking a free consultation call or sending an enquiry
                via the contact form. After consultation, we will provide you with a proposal with project details.
              </p>

              <h3 className="text-xl font-bold mb-3 text-gray-900">4.2 Payment Options</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We offer two payment models:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li><strong>Pay Upfront:</strong> One-time payment with optional monthly maintenance fee</li>
                <li><strong>Monthly Plan:</strong> Subscription model with 12-month minimum commitment</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                For upfront payments:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li><strong>Deposit:</strong> 50% of total price paid before work begins</li>
                <li><strong>Final payment:</strong> 50% paid after project completion and before launch</li>
                <li><strong>Payment methods:</strong> Bank transfer, credit card</li>
              </ul>

              <h3 className="text-xl font-bold mb-3 text-gray-900">4.3 Refund Policy</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We offer a 100% refund of the deposit if you cancel within the first 14 days of the project,
                provided we have not started development. Once development has begun,
                the deposit is non-refundable, but you can request up to 2 rounds of revisions.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">5. Delivery Timeline</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The standard delivery timeline is 7 working days from receipt of all required materials
                (text, images, logo) and design approval. This timeline may vary depending on:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Project complexity</li>
                <li>Speed of material delivery from the client</li>
                <li>Number of revisions</li>
                <li>External factors (third-party service availability)</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">6. Client Responsibilities</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The client is responsible for:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Providing all required materials (text, images, logo) on time</li>
                <li>Ensuring they have rights to all materials provided</li>
                <li>Providing timely feedback and approvals</li>
                <li>Securing a domain (or allowing us to secure it on your behalf)</li>
                <li>Payment within agreed timelines</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">7. Ownership and Rights</h2>

              <h3 className="text-xl font-bold mb-3 text-gray-900">7.1 What You Receive</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                After final payment, you receive:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li><strong>Your website:</strong> Complete custom website with your content and customisations</li>
                <li><strong>All files:</strong> All files needed to host and run your website</li>
                <li><strong>Usage rights:</strong> Unlimited right to use your website for your business</li>
                <li><strong>Modification rights:</strong> You can modify your site or hire another developer</li>
                <li><strong>Hosting rights:</strong> Host wherever you want, no additional fees to Webframe</li>
                <li><strong>No vendor lock-in:</strong> You are not tied to us for maintenance or modifications</li>
              </ul>

              <h3 className="text-xl font-bold mb-3 text-gray-900">7.2 Licence Restrictions</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You do not receive:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li><strong>Resale rights:</strong> You cannot sell the code or design to other clients</li>
                <li><strong>Distribution rights:</strong> You cannot distribute the design as your own product</li>
                <li><strong>Multiple use:</strong> The licence is valid for one website/project</li>
              </ul>

              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 mb-6">
                <p className="text-sm text-blue-900 mb-2">
                  <strong>Simple explanation:</strong>
                </p>
                <p className="text-sm text-blue-900">
                  Think of it like buying a house built to our design. The house is yours - you can
                  use it, renovate it, sell it. But you cannot take our architectural plan and
                  build the same houses for other people. The same applies to websites.
                </p>
              </div>

              <h3 className="text-xl font-bold mb-3 text-gray-900">7.3 Our Rights</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Use your project in our portfolio (with your permission)</li>
                <li>Reuse design patterns and code structures for other clients</li>
                <li>Retain a "Built by Webframe" link in the footer (can be removed by agreement)</li>
              </ul>

              <h3 className="text-xl font-bold mb-3 text-gray-900">7.4 Open Source Components</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your website may contain open source libraries (Next.js, React, Tailwind CSS, etc.)
                which have their own licences. These licences remain in effect and do not affect your ability
                to use the website.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">8. Revisions and Changes</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The project price includes:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li><strong>2 rounds of revisions</strong> during development</li>
                <li><strong>Minor changes</strong> (text, images, colours) within 30 days after launch</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                Additional revisions or major changes are charged at an hourly rate.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">9. Technical Support</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                After website launch, we provide:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li><strong>30 days free support</strong> - bug fixes, minor changes</li>
                <li><strong>Optional monthly maintenance</strong> - by arrangement</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                Technical support does not include:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Adding new functionality</li>
                <li>Website redesign</li>
                <li>Issues caused by external services</li>
                <li>Issues caused by your code modifications</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">10. Hosting and Domain</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Hosting and domain are not included in our standard packages. You can:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Secure your own hosting and domain</li>
                <li>Request that we secure hosting/domain on your behalf (additional cost)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                We recommend hosting services and provide setup assistance.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">11. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Webframe is not liable for:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Data loss caused by external factors (hosting downtime, hacking)</li>
                <li>Loss of revenue or business opportunities</li>
                <li>Problems with third-party services you use</li>
                <li>Copyright infringement of materials you provided</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our maximum liability is limited to the amount you paid us for the project.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">12. Confidentiality</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All information exchanged during the project is considered confidential and we will not
                share it with third parties without your permission, except where required by law.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">13. Contract Termination</h2>

              <h3 className="text-xl font-bold mb-3 text-gray-900">13.1 Termination by Client</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You can terminate the contract at any time. However:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>The deposit is non-refundable if work has begun</li>
                <li>We will invoice for work completed up to that point</li>
                <li>Source code is only delivered after final payment</li>
              </ul>

              <h3 className="text-xl font-bold mb-3 text-gray-900">13.2 Termination by Us</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may terminate the contract if:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>You fail to pay within agreed timelines</li>
                <li>You fail to provide required materials for more than 60 days</li>
                <li>You breach these Terms</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">14. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to modify these Terms. All changes take effect immediately upon
                publication on this page. For existing projects, the Terms in effect at the time of
                contract signing apply.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">15. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms are governed by European Union law and applicable local laws.
                Any disputes will be resolved through arbitration or competent courts in the relevant jurisdiction.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">16. Contact</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For questions about these Terms, contact us:
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
