'use client'

import { useState, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface HtmlEntity {
  name: string
  numeric: string
  hex: string
  char: string
  description: string
  category: string
}

// Comprehensive HTML entities list
const htmlEntities: HtmlEntity[] = [
  // Common symbols
  { name: '&nbsp;', numeric: '&#160;', hex: '&#xA0;', char: ' ', description: 'Non-breaking space', category: 'Spacing' },
  { name: '&quot;', numeric: '&#34;', hex: '&#x22;', char: '"', description: 'Quotation mark', category: 'Punctuation' },
  { name: '&amp;', numeric: '&#38;', hex: '&#x26;', char: '&', description: 'Ampersand', category: 'Symbols' },
  { name: '&apos;', numeric: '&#39;', hex: '&#x27;', char: "'", description: 'Apostrophe', category: 'Punctuation' },
  { name: '&lt;', numeric: '&#60;', hex: '&#x3C;', char: '<', description: 'Less than', category: 'Symbols' },
  { name: '&gt;', numeric: '&#62;', hex: '&#x3E;', char: '>', description: 'Greater than', category: 'Symbols' },

  // Currency
  { name: '&cent;', numeric: '&#162;', hex: '&#xA2;', char: '¢', description: 'Cent sign', category: 'Currency' },
  { name: '&pound;', numeric: '&#163;', hex: '&#xA3;', char: '£', description: 'Pound sign', category: 'Currency' },
  { name: '&yen;', numeric: '&#165;', hex: '&#xA5;', char: '¥', description: 'Yen sign', category: 'Currency' },
  { name: '&euro;', numeric: '&#8364;', hex: '&#x20AC;', char: '€', description: 'Euro sign', category: 'Currency' },
  { name: '&dollar;', numeric: '&#36;', hex: '&#x24;', char: '$', description: 'Dollar sign', category: 'Currency' },

  // Math symbols
  { name: '&times;', numeric: '&#215;', hex: '&#xD7;', char: '×', description: 'Multiplication sign', category: 'Math' },
  { name: '&divide;', numeric: '&#247;', hex: '&#xF7;', char: '÷', description: 'Division sign', category: 'Math' },
  { name: '&plusmn;', numeric: '&#177;', hex: '&#xB1;', char: '±', description: 'Plus-minus sign', category: 'Math' },
  { name: '&minus;', numeric: '&#8722;', hex: '&#x2212;', char: '−', description: 'Minus sign', category: 'Math' },
  { name: '&equals;', numeric: '&#61;', hex: '&#x3D;', char: '=', description: 'Equals sign', category: 'Math' },
  { name: '&ne;', numeric: '&#8800;', hex: '&#x2260;', char: '≠', description: 'Not equal to', category: 'Math' },
  { name: '&le;', numeric: '&#8804;', hex: '&#x2264;', char: '≤', description: 'Less than or equal to', category: 'Math' },
  { name: '&ge;', numeric: '&#8805;', hex: '&#x2265;', char: '≥', description: 'Greater than or equal to', category: 'Math' },
  { name: '&infin;', numeric: '&#8734;', hex: '&#x221E;', char: '∞', description: 'Infinity', category: 'Math' },
  { name: '&sum;', numeric: '&#8721;', hex: '&#x2211;', char: '∑', description: 'N-ary summation', category: 'Math' },
  { name: '&prod;', numeric: '&#8719;', hex: '&#x220F;', char: '∏', description: 'N-ary product', category: 'Math' },
  { name: '&radic;', numeric: '&#8730;', hex: '&#x221A;', char: '√', description: 'Square root', category: 'Math' },
  { name: '&pi;', numeric: '&#960;', hex: '&#x3C0;', char: 'π', description: 'Greek small letter pi', category: 'Math' },
  { name: '&alpha;', numeric: '&#945;', hex: '&#x3B1;', char: 'α', description: 'Greek small letter alpha', category: 'Greek' },
  { name: '&beta;', numeric: '&#946;', hex: '&#x3B2;', char: 'β', description: 'Greek small letter beta', category: 'Greek' },
  { name: '&gamma;', numeric: '&#947;', hex: '&#x3B3;', char: 'γ', description: 'Greek small letter gamma', category: 'Greek' },
  { name: '&delta;', numeric: '&#948;', hex: '&#x3B4;', char: 'δ', description: 'Greek small letter delta', category: 'Greek' },
  { name: '&theta;', numeric: '&#952;', hex: '&#x3B8;', char: 'θ', description: 'Greek small letter theta', category: 'Greek' },
  { name: '&lambda;', numeric: '&#955;', hex: '&#x3BB;', char: 'λ', description: 'Greek small letter lambda', category: 'Greek' },
  { name: '&mu;', numeric: '&#956;', hex: '&#x3BC;', char: 'μ', description: 'Greek small letter mu', category: 'Greek' },
  { name: '&sigma;', numeric: '&#963;', hex: '&#x3C3;', char: 'σ', description: 'Greek small letter sigma', category: 'Greek' },
  { name: '&omega;', numeric: '&#969;', hex: '&#x3C9;', char: 'ω', description: 'Greek small letter omega', category: 'Greek' },

  // Arrows
  { name: '&larr;', numeric: '&#8592;', hex: '&#x2190;', char: '←', description: 'Leftwards arrow', category: 'Arrows' },
  { name: '&rarr;', numeric: '&#8594;', hex: '&#x2192;', char: '→', description: 'Rightwards arrow', category: 'Arrows' },
  { name: '&uarr;', numeric: '&#8593;', hex: '&#x2191;', char: '↑', description: 'Upwards arrow', category: 'Arrows' },
  { name: '&darr;', numeric: '&#8595;', hex: '&#x2193;', char: '↓', description: 'Downwards arrow', category: 'Arrows' },
  { name: '&harr;', numeric: '&#8596;', hex: '&#x2194;', char: '↔', description: 'Left right arrow', category: 'Arrows' },
  { name: '&lArr;', numeric: '&#8656;', hex: '&#x21D0;', char: '⇐', description: 'Leftwards double arrow', category: 'Arrows' },
  { name: '&rArr;', numeric: '&#8658;', hex: '&#x21D2;', char: '⇒', description: 'Rightwards double arrow', category: 'Arrows' },
  { name: '&uArr;', numeric: '&#8657;', hex: '&#x21D1;', char: '⇑', description: 'Upwards double arrow', category: 'Arrows' },
  { name: '&dArr;', numeric: '&#8659;', hex: '&#x21D3;', char: '⇓', description: 'Downwards double arrow', category: 'Arrows' },

  // Shapes
  { name: '&copy;', numeric: '&#169;', hex: '&#xA9;', char: '©', description: 'Copyright sign', category: 'Symbols' },
  { name: '&reg;', numeric: '&#174;', hex: '&#xAE;', char: '®', description: 'Registered sign', category: 'Symbols' },
  { name: '&trade;', numeric: '&#8482;', hex: '&#x2122;', char: '™', description: 'Trade mark sign', category: 'Symbols' },
  { name: '&deg;', numeric: '&#176;', hex: '&#xB0;', char: '°', description: 'Degree sign', category: 'Symbols' },
  { name: '&permil;', numeric: '&#8240;', hex: '&#x2030;', char: '‰', description: 'Per mille sign', category: 'Symbols' },
  { name: '&prime;', numeric: '&#8242;', hex: '&#x2032;', char: '′', description: 'Prime', category: 'Symbols' },
  { name: '&Prime;', numeric: '&#8243;', hex: '&#x2033;', char: '″', description: 'Double prime', category: 'Symbols' },
  { name: '&sect;', numeric: '&#167;', hex: '&#xA7;', char: '§', description: 'Section sign', category: 'Symbols' },
  { name: '&para;', numeric: '&#182;', hex: '&#xB6;', char: '¶', description: 'Pilcrow sign', category: 'Symbols' },
  { name: '&middot;', numeric: '&#183;', hex: '&#xB7;', char: '·', description: 'Middle dot', category: 'Symbols' },
  { name: '&bull;', numeric: '&#8226;', hex: '&#x2022;', char: '•', description: 'Bullet', category: 'Symbols' },
  { name: '&hellip;', numeric: '&#8230;', hex: '&#x2026;', char: '…', description: 'Horizontal ellipsis', category: 'Punctuation' },

  // Accented characters
  { name: '&Aacute;', numeric: '&#193;', hex: '&#xC1;', char: 'Á', description: 'Latin capital A with acute', category: 'Latin' },
  { name: '&aacute;', numeric: '&#225;', hex: '&#xE1;', char: 'á', description: 'Latin small a with acute', category: 'Latin' },
  { name: '&Agrave;', numeric: '&#192;', hex: '&#xC0;', char: 'À', description: 'Latin capital A with grave', category: 'Latin' },
  { name: '&agrave;', numeric: '&#224;', hex: '&#xE0;', char: 'à', description: 'Latin small a with grave', category: 'Latin' },
  { name: '&Acirc;', numeric: '&#194;', hex: '&#xC2;', char: 'Â', description: 'Latin capital A with circumflex', category: 'Latin' },
  { name: '&acirc;', numeric: '&#226;', hex: '&#xE2;', char: 'â', description: 'Latin small a with circumflex', category: 'Latin' },
  { name: '&Atilde;', numeric: '&#195;', hex: '&#xC3;', char: 'Ã', description: 'Latin capital A with tilde', category: 'Latin' },
  { name: '&atilde;', numeric: '&#227;', hex: '&#xE3;', char: 'ã', description: 'Latin small a with tilde', category: 'Latin' },
  { name: '&Auml;', numeric: '&#196;', hex: '&#xC4;', char: 'Ä', description: 'Latin capital A with diaeresis', category: 'Latin' },
  { name: '&auml;', numeric: '&#228;', hex: '&#xE4;', char: 'ä', description: 'Latin small a with diaeresis', category: 'Latin' },
  { name: '&Aring;', numeric: '&#197;', hex: '&#xC5;', char: 'Å', description: 'Latin capital A with ring above', category: 'Latin' },
  { name: '&aring;', numeric: '&#229;', hex: '&#xE5;', char: 'å', description: 'Latin small a with ring above', category: 'Latin' },
  { name: '&Eacute;', numeric: '&#201;', hex: '&#xC9;', char: 'É', description: 'Latin capital E with acute', category: 'Latin' },
  { name: '&eacute;', numeric: '&#233;', hex: '&#xE9;', char: 'é', description: 'Latin small e with acute', category: 'Latin' },
  { name: '&Egrave;', numeric: '&#200;', hex: '&#xC8;', char: 'È', description: 'Latin capital E with grave', category: 'Latin' },
  { name: '&egrave;', numeric: '&#232;', hex: '&#xE8;', char: 'è', description: 'Latin small e with grave', category: 'Latin' },
  { name: '&Ecirc;', numeric: '&#202;', hex: '&#xCA;', char: 'Ê', description: 'Latin capital E with circumflex', category: 'Latin' },
  { name: '&ecirc;', numeric: '&#234;', hex: '&#xEA;', char: 'ê', description: 'Latin small e with circumflex', category: 'Latin' },
  { name: '&Euml;', numeric: '&#203;', hex: '&#xCB;', char: 'Ë', description: 'Latin capital E with diaeresis', category: 'Latin' },
  { name: '&euml;', numeric: '&#235;', hex: '&#xEB;', char: 'ë', description: 'Latin small e with diaeresis', category: 'Latin' },
  { name: '&Iacute;', numeric: '&#205;', hex: '&#xCD;', char: 'Í', description: 'Latin capital I with acute', category: 'Latin' },
  { name: '&iacute;', numeric: '&#237;', hex: '&#xED;', char: 'í', description: 'Latin small i with acute', category: 'Latin' },
  { name: '&Igrave;', numeric: '&#204;', hex: '&#xCC;', char: 'Ì', description: 'Latin capital I with grave', category: 'Latin' },
  { name: '&igrave;', numeric: '&#236;', hex: '&#xEC;', char: 'ì', description: 'Latin small i with grave', category: 'Latin' },
  { name: '&Icirc;', numeric: '&#206;', hex: '&#xCE;', char: 'Î', description: 'Latin capital I with circumflex', category: 'Latin' },
  { name: '&icirc;', numeric: '&#238;', hex: '&#xEE;', char: 'î', description: 'Latin small i with circumflex', category: 'Latin' },
  { name: '&Iuml;', numeric: '&#207;', hex: '&#xCF;', char: 'Ï', description: 'Latin capital I with diaeresis', category: 'Latin' },
  { name: '&iuml;', numeric: '&#239;', hex: '&#xEF;', char: 'ï', description: 'Latin small i with diaeresis', category: 'Latin' },
  { name: '&Oacute;', numeric: '&#211;', hex: '&#xD3;', char: 'Ó', description: 'Latin capital O with acute', category: 'Latin' },
  { name: '&oacute;', numeric: '&#243;', hex: '&#xF3;', char: 'ó', description: 'Latin small o with acute', category: 'Latin' },
  { name: '&Ograve;', numeric: '&#210;', hex: '&#xD2;', char: 'Ò', description: 'Latin capital O with grave', category: 'Latin' },
  { name: '&ograve;', numeric: '&#242;', hex: '&#xF2;', char: 'ò', description: 'Latin small o with grave', category: 'Latin' },
  { name: '&Ocirc;', numeric: '&#212;', hex: '&#xD4;', char: 'Ô', description: 'Latin capital O with circumflex', category: 'Latin' },
  { name: '&ocirc;', numeric: '&#244;', hex: '&#xF4;', char: 'ô', description: 'Latin small o with circumflex', category: 'Latin' },
  { name: '&Otilde;', numeric: '&#213;', hex: '&#xD5;', char: 'Õ', description: 'Latin capital O with tilde', category: 'Latin' },
  { name: '&otilde;', numeric: '&#245;', hex: '&#xF5;', char: 'õ', description: 'Latin small o with tilde', category: 'Latin' },
  { name: '&Ouml;', numeric: '&#214;', hex: '&#xD6;', char: 'Ö', description: 'Latin capital O with diaeresis', category: 'Latin' },
  { name: '&ouml;', numeric: '&#246;', hex: '&#xF6;', char: 'ö', description: 'Latin small o with diaeresis', category: 'Latin' },
  { name: '&Uacute;', numeric: '&#218;', hex: '&#xDA;', char: 'Ú', description: 'Latin capital U with acute', category: 'Latin' },
  { name: '&uacute;', numeric: '&#250;', hex: '&#xFA;', char: 'ú', description: 'Latin small u with acute', category: 'Latin' },
  { name: '&Ugrave;', numeric: '&#217;', hex: '&#xD9;', char: 'Ù', description: 'Latin capital U with grave', category: 'Latin' },
  { name: '&ugrave;', numeric: '&#249;', hex: '&#xF9;', char: 'ù', description: 'Latin small u with grave', category: 'Latin' },
  { name: '&Ucirc;', numeric: '&#219;', hex: '&#xDB;', char: 'Û', description: 'Latin capital U with circumflex', category: 'Latin' },
  { name: '&ucirc;', numeric: '&#251;', hex: '&#xFB;', char: 'û', description: 'Latin small u with circumflex', category: 'Latin' },
  { name: '&Uuml;', numeric: '&#220;', hex: '&#xDC;', char: 'Ü', description: 'Latin capital U with diaeresis', category: 'Latin' },
  { name: '&uuml;', numeric: '&#252;', hex: '&#xFC;', char: 'ü', description: 'Latin small u with diaeresis', category: 'Latin' },
  { name: '&Ntilde;', numeric: '&#209;', hex: '&#xD1;', char: 'Ñ', description: 'Latin capital N with tilde', category: 'Latin' },
  { name: '&ntilde;', numeric: '&#241;', hex: '&#xF1;', char: 'ñ', description: 'Latin small n with tilde', category: 'Latin' },
  { name: '&Ccedil;', numeric: '&#199;', hex: '&#xC7;', char: 'Ç', description: 'Latin capital C with cedilla', category: 'Latin' },
  { name: '&ccedil;', numeric: '&#231;', hex: '&#xE7;', char: 'ç', description: 'Latin small c with cedilla', category: 'Latin' },
]

const categories = [...new Set(htmlEntities.map((e) => e.category))]

export default function HtmlEntitiesReference() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [copyFormat, setCopyFormat] = useState<'name' | 'numeric' | 'hex' | 'char'>('name')

  const filteredEntities = useMemo(() => {
    let filtered = htmlEntities

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((e) => e.category === selectedCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query) ||
          e.char.toLowerCase().includes(query) ||
          e.numeric.includes(query) ||
          e.hex.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [searchQuery, selectedCategory])

  const handleCopy = (entity: HtmlEntity) => {
    let text = ''
    switch (copyFormat) {
      case 'name':
        text = entity.name
        break
      case 'numeric':
        text = entity.numeric
        break
      case 'hex':
        text = entity.hex
        break
      case 'char':
        text = entity.char
        break
    }
    return text
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-zinc-300 mb-2">
            Search
          </label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, character, or description..."
            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-zinc-300 mb-2">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="copyFormat" className="block text-sm font-medium text-zinc-300 mb-2">
              Copy Format
            </label>
            <select
              id="copyFormat"
              value={copyFormat}
              onChange={(e) => setCopyFormat(e.target.value as typeof copyFormat)}
              className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            >
              <option value="name">Entity Name</option>
              <option value="numeric">Numeric Code</option>
              <option value="hex">Hex Code</option>
              <option value="char">Character</option>
            </select>
          </div>
        </div>
      </div>

      <div className="text-sm text-zinc-400">
        Showing {filteredEntities.length} of {htmlEntities.length} entities
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="text-left p-3 text-sm font-semibold text-zinc-300">Character</th>
              <th className="text-left p-3 text-sm font-semibold text-zinc-300">Entity Name</th>
              <th className="text-left p-3 text-sm font-semibold text-zinc-300">Numeric</th>
              <th className="text-left p-3 text-sm font-semibold text-zinc-300">Hex</th>
              <th className="text-left p-3 text-sm font-semibold text-zinc-300">Description</th>
              <th className="text-left p-3 text-sm font-semibold text-zinc-300">Category</th>
              <th className="text-left p-3 text-sm font-semibold text-zinc-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntities.map((entity, idx) => (
              <tr key={idx} className="border-b border-zinc-800 hover:bg-zinc-900/50">
                <td className="p-3 text-zinc-100 text-lg font-mono">{entity.char}</td>
                <td className="p-3 text-zinc-300 font-mono text-sm">{entity.name}</td>
                <td className="p-3 text-zinc-400 font-mono text-sm">{entity.numeric}</td>
                <td className="p-3 text-zinc-400 font-mono text-sm">{entity.hex}</td>
                <td className="p-3 text-zinc-400">{entity.description}</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded">
                    {entity.category}
                  </span>
                </td>
                <td className="p-3">
                  <CopyButton text={handleCopy(entity)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

