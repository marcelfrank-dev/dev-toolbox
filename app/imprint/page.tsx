import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Imprint | Dev Toolbox',
  description: 'Legal information and imprint for Dev Toolbox.',
}

export default function ImprintPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back to Tools
      </Link>

      <article className="prose prose-invert prose-zinc max-w-none">
        <h1>Imprint (Impressum)</h1>

        <p className="lead">
          Information according to § 5 TMG (German Telemedia Act)
        </p>

        <p>
          Marcel Frank / MF Development<br />
          Pommerbachstraße 66<br />
          56759 Kaisersesch<br />
          Germany
        </p>

        <h2>Contact</h2>
        <p>
          Email: dev-toolbox@mf-development.de<br />
          GitHub:{' '}
          <a
            href="https://github.com/marcelfrank-dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://github.com/marcelfrank-dev
          </a>
        </p>

        <h2>Responsible for Content</h2>
        <p>
          Marcel Frank / MF Development<br />
          Pommerbachstraße 66<br />
          56759 Kaisersesch<br />
          Germany
        </p>

        <h2>Liability for Content</h2>
        <p>
          As a service provider, we are responsible for our own content on these pages
          according to general laws (§ 7 para. 1 TMG). However, according to §§ 8 to 10 TMG,
          we are not obligated to monitor transmitted or stored third-party information or
          to investigate circumstances that indicate illegal activity.
        </p>
        <p>
          Obligations to remove or block the use of information according to general laws
          remain unaffected. However, liability in this regard is only possible from the
          point in time at which a concrete infringement of the law becomes known. If we
          become aware of any such infringements, we will remove this content immediately.
        </p>

        <h2>Liability for Links</h2>
        <p>
          Our offer contains links to external websites of third parties, on whose contents
          we have no influence. Therefore, we cannot assume any liability for these external
          contents. The respective provider or operator of the pages is always responsible
          for the content of the linked pages. The linked pages were checked for possible
          legal violations at the time of linking. Illegal contents were not recognizable at
          the time of linking.
        </p>

        <h2>Copyright</h2>
        <p>
          The content and works created by the site operators on these pages are subject to
          German copyright law. Duplication, processing, distribution, or any form of
          commercialization of such material beyond the scope of the copyright law requires
          the prior written consent of its respective author or creator.
        </p>
      </article>
    </div>
  )
}

