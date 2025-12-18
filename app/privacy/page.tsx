import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Dev Toolbox',
  description: 'Privacy policy for Dev Toolbox - we respect your privacy and do not collect any data.',
}

export default function PrivacyPage() {
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
        <h1>Privacy Policy</h1>
        <p className="lead">Last updated: December 2024</p>

        <h2>Overview</h2>
        <p>
          Dev Toolbox is committed to protecting your privacy. This policy explains how we
          handle information when you use our service.
        </p>

        <h2>Data Collection</h2>
        <p>
          <strong>We do not collect any personal data.</strong>
        </p>
        <p>
          All tools on this website run entirely in your browser. No data you enter is ever
          sent to our servers or any third-party service.
        </p>

        <h3>What we don&apos;t collect:</h3>
        <ul>
          <li>No personal information</li>
          <li>No usage data</li>
          <li>No cookies (except essential technical ones)</li>
          <li>No analytics (unless explicitly stated)</li>
          <li>No input/output data from tools</li>
        </ul>

        <h2>Local Processing</h2>
        <p>All processing happens locally on your device:</p>
        <ul>
          <li>JSON formatting and validation</li>
          <li>Base64 encoding/decoding</li>
          <li>URL encoding/decoding</li>
          <li>Case conversion</li>
          <li>JWT decoding</li>
          <li>Timestamp conversion</li>
        </ul>
        <p>Your data never leaves your browser.</p>

        <h2>Third-Party Services</h2>
        <h3>Hosting</h3>
        <p>
          This website is hosted on Vercel. Vercel may collect basic server logs (IP
          addresses, request timestamps) for security and operational purposes. See{' '}
          <a
            href="https://vercel.com/legal/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vercel&apos;s Privacy Policy
          </a>
          .
        </p>

        <h3>Future Advertising</h3>
        <p>We may introduce advertising in the future. If we do:</p>
        <ul>
          <li>This privacy policy will be updated</li>
          <li>A cookie consent banner will be displayed</li>
          <li>You will have the option to opt out of personalized ads</li>
        </ul>

        <h2>Contact</h2>
        <p>
          If you have questions about this privacy policy, please open an issue on our{' '}
          <a
            href="https://github.com/marcelfrank-dev/dev-toolbox"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub repository
          </a>
          .
        </p>

        <h2>Changes</h2>
        <p>
          We may update this policy from time to time. Changes will be posted on this page
          with an updated revision date.
        </p>
      </article>
    </div>
  )
}

