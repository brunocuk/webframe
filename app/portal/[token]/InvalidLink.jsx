export default function InvalidLink() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="font-mono text-xs font-semibold tracking-wider text-primary mb-3">
          // client portal
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          This link isn&apos;t valid.
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          The portal link may have been copied incompletely. Try{' '}
          <a href="/portal" className="text-primary font-semibold">
            logging in with your email
          </a>
          , check the link in your onboarding email, or write to{' '}
          <a href="mailto:hello@web-frame.eu" className="text-primary font-semibold">
            hello@web-frame.eu
          </a>{' '}
          and we&apos;ll sort it out.
        </p>
      </div>
    </main>
  )
}
