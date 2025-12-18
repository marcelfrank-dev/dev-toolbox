'use client'

import { useState, useCallback } from 'react'
import { CopyButton } from '@/components/CopyButton'

type GenerationType = 'paragraphs' | 'sentences' | 'words'

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde',
  'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque',
  'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
  'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta',
  'explicabo', 'nemo', 'ipsam', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit',
  'fugit', 'consequuntur', 'magni', 'dolores', 'eos', 'ratione', 'sequi',
  'nesciunt', 'neque', 'porro', 'quisquam', 'nihil', 'numquam', 'eius', 'modi',
]

const LOREM_START = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'

export default function LoremGenerator() {
  const [output, setOutput] = useState('')
  const [type, setType] = useState<GenerationType>('paragraphs')
  const [count, setCount] = useState(3)
  const [startWithLorem, setStartWithLorem] = useState(true)

  const getRandomWord = useCallback(() => {
    return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]
  }, [])

  const generateSentence = useCallback(() => {
    const wordCount = 8 + Math.floor(Math.random() * 12) // 8-20 words
    const words: string[] = []
    for (let i = 0; i < wordCount; i++) {
      words.push(getRandomWord())
    }
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
    return words.join(' ') + '.'
  }, [getRandomWord])

  const generateParagraph = useCallback(() => {
    const sentenceCount = 4 + Math.floor(Math.random() * 4) // 4-8 sentences
    const sentences: string[] = []
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence())
    }
    return sentences.join(' ')
  }, [generateSentence])

  const generate = useCallback(() => {
    let result = ''

    if (type === 'words') {
      const words: string[] = []
      for (let i = 0; i < count; i++) {
        words.push(getRandomWord())
      }
      result = words.join(' ')
    } else if (type === 'sentences') {
      const sentences: string[] = []
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence())
      }
      result = sentences.join(' ')
    } else {
      const paragraphs: string[] = []
      for (let i = 0; i < count; i++) {
        paragraphs.push(generateParagraph())
      }
      result = paragraphs.join('\n\n')
    }

    if (startWithLorem && result.length > 0) {
      if (type === 'words') {
        const loremWords = 'Lorem ipsum dolor sit amet'.split(' ')
        const resultWords = result.split(' ')
        for (let i = 0; i < Math.min(loremWords.length, resultWords.length); i++) {
          resultWords[i] = loremWords[i]
        }
        result = resultWords.join(' ')
      } else {
        // Replace first sentence with classic Lorem ipsum
        const firstPeriod = result.indexOf('.')
        if (firstPeriod > -1) {
          result = LOREM_START + result.slice(firstPeriod + 1)
        }
      }
    }

    setOutput(result)
  }, [type, count, startWithLorem, getRandomWord, generateSentence, generateParagraph])

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as GenerationType)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Count</label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none"
          />
        </div>
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-sm text-zinc-300">Start with &quot;Lorem ipsum...&quot;</span>
          </label>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex gap-2">
        <button
          onClick={generate}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
        >
          Generate
        </button>
        {output && <CopyButton text={output} />}
      </div>

      {/* Output */}
      {output && (
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Generated Text</label>
          <textarea
            value={output}
            readOnly
            className="h-64 w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-300 focus:outline-none"
          />
        </div>
      )}
    </div>
  )
}

