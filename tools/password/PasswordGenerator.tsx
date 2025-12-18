'use client'

import { useState, useCallback } from 'react'
import { CopyButton } from '@/components/CopyButton'

export default function PasswordGenerator() {
  const [passwords, setPasswords] = useState<string[]>([])
  const [length, setLength] = useState(16)
  const [count, setCount] = useState(1)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)

  const generatePassword = useCallback(() => {
    let chars = ''
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    const ambiguous = 'Il1O0'

    if (includeUppercase) chars += uppercase
    if (includeLowercase) chars += lowercase
    if (includeNumbers) chars += numbers
    if (includeSymbols) chars += symbols

    if (excludeAmbiguous) {
      chars = chars
        .split('')
        .filter((c) => !ambiguous.includes(c))
        .join('')
    }

    if (!chars) {
      setPasswords(['Please select at least one character type'])
      return
    }

    const newPasswords: string[] = []
    for (let i = 0; i < count; i++) {
      let password = ''
      const array = new Uint32Array(length)
      crypto.getRandomValues(array)
      for (let j = 0; j < length; j++) {
        password += chars[array[j] % chars.length]
      }
      newPasswords.push(password)
    }
    setPasswords(newPasswords)
  }, [length, count, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeAmbiguous])

  const getStrength = (pwd: string): { label: string; color: string; percent: number } => {
    let score = 0
    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    if (pwd.length >= 16) score++
    if (/[a-z]/.test(pwd)) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^a-zA-Z0-9]/.test(pwd)) score++

    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', percent: 25 }
    if (score <= 4) return { label: 'Fair', color: 'bg-yellow-500', percent: 50 }
    if (score <= 5) return { label: 'Good', color: 'bg-blue-500', percent: 75 }
    return { label: 'Strong', color: 'bg-emerald-500', percent: 100 }
  }

  const allPasswordsText = passwords.join('\n')

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Length: {length}</label>
          <input
            type="range"
            min={4}
            max={64}
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Count</label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Character Options */}
      <div className="flex flex-wrap gap-4">
        {[
          { label: 'Uppercase (A-Z)', checked: includeUppercase, onChange: setIncludeUppercase },
          { label: 'Lowercase (a-z)', checked: includeLowercase, onChange: setIncludeLowercase },
          { label: 'Numbers (0-9)', checked: includeNumbers, onChange: setIncludeNumbers },
          { label: 'Symbols (!@#$...)', checked: includeSymbols, onChange: setIncludeSymbols },
          { label: 'Exclude Ambiguous (Il1O0)', checked: excludeAmbiguous, onChange: setExcludeAmbiguous },
        ].map(({ label, checked, onChange }) => (
          <label key={label} className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => onChange(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-sm text-zinc-300">{label}</span>
          </label>
        ))}
      </div>

      {/* Generate Button */}
      <div className="flex gap-2">
        <button
          onClick={generatePassword}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
        >
          Generate Password{count > 1 ? 's' : ''}
        </button>
        {passwords.length > 0 && <CopyButton text={allPasswordsText} label={`Copy All (${passwords.length})`} />}
      </div>

      {/* Results */}
      {passwords.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-400">Generated Passwords</label>
          <div className="max-h-80 overflow-auto rounded-lg border border-zinc-700 bg-zinc-900/50">
            {passwords.map((pwd, index) => {
              const strength = getStrength(pwd)
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b border-zinc-800 px-4 py-3 last:border-b-0"
                >
                  <code className="flex-1 font-mono text-sm text-emerald-400 break-all">{pwd}</code>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-20 h-2 bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strength.color} transition-all`}
                        style={{ width: `${strength.percent}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-500 w-12">{strength.label}</span>
                    <CopyButton text={pwd} label="" className="!px-2" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

