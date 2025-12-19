'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface StrengthResult {
  score: number
  strength: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong'
  feedback: string[]
  color: string
}

function checkPasswordStrength(password: string): StrengthResult {
  if (!password) {
    return {
      score: 0,
      strength: 'Very Weak',
      feedback: ['Enter a password to check its strength'],
      color: 'text-red-400',
    }
  }

  let score = 0
  const feedback: string[] = []

  // Length checks
  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('Use at least 8 characters')
  }
  if (password.length >= 12) {
    score += 1
  }
  if (password.length >= 16) {
    score += 1
  }

  // Character variety checks
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Add lowercase letters')
  }
  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Add uppercase letters')
  }
  if (/[0-9]/.test(password)) {
    score += 1
  } else {
    feedback.push('Add numbers')
  }
  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1
  } else {
    feedback.push('Add special characters')
  }

  // Common patterns
  if (/(.)\1{2,}/.test(password)) {
    score -= 1
    feedback.push('Avoid repeating characters')
  }
  if (/123|abc|qwe|password/i.test(password)) {
    score -= 1
    feedback.push('Avoid common patterns')
  }

  score = Math.max(0, Math.min(10, score))

  let strength: StrengthResult['strength']
  let color: string

  if (score <= 2) {
    strength = 'Very Weak'
    color = 'text-red-400'
  } else if (score <= 4) {
    strength = 'Weak'
    color = 'text-orange-400'
  } else if (score <= 6) {
    strength = 'Fair'
    color = 'text-yellow-400'
  } else if (score <= 8) {
    strength = 'Good'
    color = 'text-blue-400'
  } else if (score <= 9) {
    strength = 'Strong'
    color = 'text-emerald-400'
  } else {
    strength = 'Very Strong'
    color = 'text-green-400'
  }

  if (score >= 8 && feedback.length === 0) {
    feedback.push('Excellent password!')
  }

  return { score, strength, feedback, color }
}

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState('')
  const result = checkPasswordStrength(password)

  const clear = () => setPassword('')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password-input" className="text-sm font-medium text-zinc-300">
            Password
          </label>
          <button
            onClick={clear}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          >
            Clear
          </button>
        </div>
        <input
          id="password-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password to check"
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 font-mono text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
        />
      </div>

      {password && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className={`text-lg font-semibold ${result.color}`}>{result.strength}</span>
            <span className="text-sm text-zinc-400">Score: {result.score}/10</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full transition-all"
              style={{
                width: `${(result.score / 10) * 100}%`,
                backgroundColor:
                  result.score <= 2
                    ? '#ef4444'
                    : result.score <= 4
                      ? '#f97316'
                      : result.score <= 6
                        ? '#eab308'
                        : result.score <= 8
                          ? '#3b82f6'
                          : result.score <= 9
                            ? '#10b981'
                            : '#22c55e',
              }}
            />
          </div>
          {result.feedback.length > 0 && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
              <ul className="list-inside list-disc space-y-1 text-sm text-zinc-400">
                {result.feedback.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
