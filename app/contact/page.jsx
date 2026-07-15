import Image from 'next/image'
import ContactForm from '@/components/contact/ContactForm'

export const metadata = {
  title: 'Contact - Webframe | Start Your Project',
  description:
    'Tell us about your business and get a reply within 24 hours. Free 15-minute intro call, fixed quote, and your custom website live within a week.',
}

const INFO = [
  {
    label: 'Email',
    value: 'hello@web-frame.eu',
    href: 'mailto:hello@web-frame.eu',
  },
  { label: 'Response time', value: 'Within 24 hours' },
  { label: 'Serving', value: 'NL · DK · IE · UK' },
]

export default function ContactPage() {
  return (
    <main className="bg-white">
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-gray-50 via-white to-purple-50/30 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-start">
            {/* Info column */}
            <div className="md:col-span-5">
              <div className="font-mono text-xs font-semibold tracking-wider text-primary mb-4">
                // contact
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4 leading-tight">
                Tell us about
                <br />
                your project.
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-10">
                Send a message and you&apos;ll get a reply within 24 hours —
                usually with a proposed time for a free 15-minute call.
              </p>

              <dl className="space-y-4 mb-10">
                {INFO.map((item) => (
                  <div key={item.label} className="flex items-baseline gap-4">
                    <dt className="font-mono text-[11px] text-gray-500 w-28 flex-shrink-0">
                      {item.label.toLowerCase()}
                    </dt>
                    <dd className="text-sm font-semibold text-gray-900">
                      {item.href ? (
                        <a href={item.href} className="hover:text-primary transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Founder trust card */}
              <div className="inline-flex items-center gap-4 px-5 py-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <Image
                  src="/images/bruno.webp"
                  alt="Bruno Čukić, founder of Webframe"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Bruno Čukić</p>
                  <p className="text-xs text-gray-600">
                    Your message lands in my inbox — no ticket queue.
                  </p>
                </div>
              </div>
            </div>

            {/* Form column */}
            <div className="md:col-span-7">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 md:p-10">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
