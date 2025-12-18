'use client'

import { useState, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface ColorName {
  name: string
  hex: string
  rgb: string
  hsl: string
  category: string
}

// CSS named colors (140+ colors)
const colorNames: ColorName[] = [
  // Basic colors
  { name: 'black', hex: '#000000', rgb: 'rgb(0, 0, 0)', hsl: 'hsl(0, 0%, 0%)', category: 'Basic' },
  { name: 'white', hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', hsl: 'hsl(0, 0%, 100%)', category: 'Basic' },
  { name: 'red', hex: '#FF0000', rgb: 'rgb(255, 0, 0)', hsl: 'hsl(0, 100%, 50%)', category: 'Basic' },
  { name: 'green', hex: '#008000', rgb: 'rgb(0, 128, 0)', hsl: 'hsl(120, 100%, 25%)', category: 'Basic' },
  { name: 'blue', hex: '#0000FF', rgb: 'rgb(0, 0, 255)', hsl: 'hsl(240, 100%, 50%)', category: 'Basic' },
  { name: 'yellow', hex: '#FFFF00', rgb: 'rgb(255, 255, 0)', hsl: 'hsl(60, 100%, 50%)', category: 'Basic' },
  { name: 'cyan', hex: '#00FFFF', rgb: 'rgb(0, 255, 255)', hsl: 'hsl(180, 100%, 50%)', category: 'Basic' },
  { name: 'magenta', hex: '#FF00FF', rgb: 'rgb(255, 0, 255)', hsl: 'hsl(300, 100%, 50%)', category: 'Basic' },
  { name: 'silver', hex: '#C0C0C0', rgb: 'rgb(192, 192, 192)', hsl: 'hsl(0, 0%, 75%)', category: 'Basic' },
  { name: 'gray', hex: '#808080', rgb: 'rgb(128, 128, 128)', hsl: 'hsl(0, 0%, 50%)', category: 'Basic' },
  { name: 'maroon', hex: '#800000', rgb: 'rgb(128, 0, 0)', hsl: 'hsl(0, 100%, 25%)', category: 'Basic' },
  { name: 'olive', hex: '#808000', rgb: 'rgb(128, 128, 0)', hsl: 'hsl(60, 100%, 25%)', category: 'Basic' },
  { name: 'lime', hex: '#00FF00', rgb: 'rgb(0, 255, 0)', hsl: 'hsl(120, 100%, 50%)', category: 'Basic' },
  { name: 'aqua', hex: '#00FFFF', rgb: 'rgb(0, 255, 255)', hsl: 'hsl(180, 100%, 50%)', category: 'Basic' },
  { name: 'teal', hex: '#008080', rgb: 'rgb(0, 128, 128)', hsl: 'hsl(180, 100%, 25%)', category: 'Basic' },
  { name: 'navy', hex: '#000080', rgb: 'rgb(0, 0, 128)', hsl: 'hsl(240, 100%, 25%)', category: 'Basic' },
  { name: 'fuchsia', hex: '#FF00FF', rgb: 'rgb(255, 0, 255)', hsl: 'hsl(300, 100%, 50%)', category: 'Basic' },
  { name: 'purple', hex: '#800080', rgb: 'rgb(128, 0, 128)', hsl: 'hsl(300, 100%, 25%)', category: 'Basic' },

  // Extended colors - Reds
  { name: 'indianred', hex: '#CD5C5C', rgb: 'rgb(205, 92, 92)', hsl: 'hsl(0, 53%, 58%)', category: 'Red' },
  { name: 'lightcoral', hex: '#F08080', rgb: 'rgb(240, 128, 128)', hsl: 'hsl(0, 79%, 72%)', category: 'Red' },
  { name: 'salmon', hex: '#FA8072', rgb: 'rgb(250, 128, 114)', hsl: 'hsl(6, 93%, 71%)', category: 'Red' },
  { name: 'darksalmon', hex: '#E9967A', rgb: 'rgb(233, 150, 122)', hsl: 'hsl(15, 72%, 70%)', category: 'Red' },
  { name: 'lightsalmon', hex: '#FFA07A', rgb: 'rgb(255, 160, 122)', hsl: 'hsl(17, 100%, 74%)', category: 'Red' },
  { name: 'crimson', hex: '#DC143C', rgb: 'rgb(220, 20, 60)', hsl: 'hsl(348, 83%, 47%)', category: 'Red' },
  { name: 'firebrick', hex: '#B22222', rgb: 'rgb(178, 34, 34)', hsl: 'hsl(0, 68%, 42%)', category: 'Red' },
  { name: 'darkred', hex: '#8B0000', rgb: 'rgb(139, 0, 0)', hsl: 'hsl(0, 100%, 27%)', category: 'Red' },

  // Oranges
  { name: 'orange', hex: '#FFA500', rgb: 'rgb(255, 165, 0)', hsl: 'hsl(39, 100%, 50%)', category: 'Orange' },
  { name: 'darkorange', hex: '#FF8C00', rgb: 'rgb(255, 140, 0)', hsl: 'hsl(33, 100%, 50%)', category: 'Orange' },
  { name: 'coral', hex: '#FF7F50', rgb: 'rgb(255, 127, 80)', hsl: 'hsl(16, 100%, 66%)', category: 'Orange' },
  { name: 'tomato', hex: '#FF6347', rgb: 'rgb(255, 99, 71)', hsl: 'hsl(9, 100%, 64%)', category: 'Orange' },
  { name: 'orangered', hex: '#FF4500', rgb: 'rgb(255, 69, 0)', hsl: 'hsl(16, 100%, 50%)', category: 'Orange' },

  // Yellows
  { name: 'gold', hex: '#FFD700', rgb: 'rgb(255, 215, 0)', hsl: 'hsl(51, 100%, 50%)', category: 'Yellow' },
  { name: 'yellow', hex: '#FFFF00', rgb: 'rgb(255, 255, 0)', hsl: 'hsl(60, 100%, 50%)', category: 'Yellow' },
  { name: 'lightyellow', hex: '#FFFFE0', rgb: 'rgb(255, 255, 224)', hsl: 'hsl(60, 100%, 94%)', category: 'Yellow' },
  { name: 'lemonchiffon', hex: '#FFFACD', rgb: 'rgb(255, 250, 205)', hsl: 'hsl(54, 100%, 90%)', category: 'Yellow' },
  { name: 'lightgoldenrodyellow', hex: '#FAFAD2', rgb: 'rgb(250, 250, 210)', hsl: 'hsl(60, 80%, 90%)', category: 'Yellow' },
  { name: 'papayawhip', hex: '#FFEFD5', rgb: 'rgb(255, 239, 213)', hsl: 'hsl(37, 100%, 92%)', category: 'Yellow' },
  { name: 'moccasin', hex: '#FFE4B5', rgb: 'rgb(255, 228, 181)', hsl: 'hsl(38, 100%, 85%)', category: 'Yellow' },
  { name: 'peachpuff', hex: '#FFDAB9', rgb: 'rgb(255, 218, 185)', hsl: 'hsl(28, 100%, 86%)', category: 'Yellow' },
  { name: 'palegoldenrod', hex: '#EEE8AA', rgb: 'rgb(238, 232, 170)', hsl: 'hsl(55, 67%, 80%)', category: 'Yellow' },
  { name: 'khaki', hex: '#F0E68C', rgb: 'rgb(240, 230, 140)', hsl: 'hsl(54, 77%, 75%)', category: 'Yellow' },
  { name: 'darkkhaki', hex: '#BDB76B', rgb: 'rgb(189, 183, 107)', hsl: 'hsl(56, 38%, 58%)', category: 'Yellow' },

  // Greens
  { name: 'lawngreen', hex: '#7CFC00', rgb: 'rgb(124, 252, 0)', hsl: 'hsl(90, 100%, 49%)', category: 'Green' },
  { name: 'chartreuse', hex: '#7FFF00', rgb: 'rgb(127, 255, 0)', hsl: 'hsl(90, 100%, 50%)', category: 'Green' },
  { name: 'limegreen', hex: '#32CD32', rgb: 'rgb(50, 205, 50)', hsl: 'hsl(120, 61%, 50%)', category: 'Green' },
  { name: 'lime', hex: '#00FF00', rgb: 'rgb(0, 255, 0)', hsl: 'hsl(120, 100%, 50%)', category: 'Green' },
  { name: 'forestgreen', hex: '#228B22', rgb: 'rgb(34, 139, 34)', hsl: 'hsl(120, 61%, 34%)', category: 'Green' },
  { name: 'green', hex: '#008000', rgb: 'rgb(0, 128, 0)', hsl: 'hsl(120, 100%, 25%)', category: 'Green' },
  { name: 'darkgreen', hex: '#006400', rgb: 'rgb(0, 100, 0)', hsl: 'hsl(120, 100%, 20%)', category: 'Green' },
  { name: 'seagreen', hex: '#2E8B57', rgb: 'rgb(46, 139, 87)', hsl: 'hsl(146, 50%, 36%)', category: 'Green' },
  { name: 'mediumseagreen', hex: '#3CB371', rgb: 'rgb(60, 179, 113)', hsl: 'hsl(147, 50%, 47%)', category: 'Green' },
  { name: 'springgreen', hex: '#00FF7F', rgb: 'rgb(0, 255, 127)', hsl: 'hsl(150, 100%, 50%)', category: 'Green' },
  { name: 'mediumspringgreen', hex: '#00FA9A', rgb: 'rgb(0, 250, 154)', hsl: 'hsl(157, 100%, 49%)', category: 'Green' },
  { name: 'lightseagreen', hex: '#20B2AA', rgb: 'rgb(32, 178, 170)', hsl: 'hsl(177, 70%, 41%)', category: 'Green' },
  { name: 'mediumaquamarine', hex: '#66CDAA', rgb: 'rgb(102, 205, 170)', hsl: 'hsl(160, 51%, 60%)', category: 'Green' },
  { name: 'aquamarine', hex: '#7FFFD4', rgb: 'rgb(127, 255, 212)', hsl: 'hsl(160, 100%, 75%)', category: 'Green' },
  { name: 'darkseagreen', hex: '#8FBC8F', rgb: 'rgb(143, 188, 143)', hsl: 'hsl(120, 25%, 65%)', category: 'Green' },
  { name: 'lightgreen', hex: '#90EE90', rgb: 'rgb(144, 238, 144)', hsl: 'hsl(120, 73%, 75%)', category: 'Green' },
  { name: 'palegreen', hex: '#98FB98', rgb: 'rgb(152, 251, 152)', hsl: 'hsl(120, 93%, 79%)', category: 'Green' },

  // Blues
  { name: 'lightcyan', hex: '#E0FFFF', rgb: 'rgb(224, 255, 255)', hsl: 'hsl(180, 100%, 94%)', category: 'Blue' },
  { name: 'cyan', hex: '#00FFFF', rgb: 'rgb(0, 255, 255)', hsl: 'hsl(180, 100%, 50%)', category: 'Blue' },
  { name: 'aqua', hex: '#00FFFF', rgb: 'rgb(0, 255, 255)', hsl: 'hsl(180, 100%, 50%)', category: 'Blue' },
  { name: 'aquamarine', hex: '#7FFFD4', rgb: 'rgb(127, 255, 212)', hsl: 'hsl(160, 100%, 75%)', category: 'Blue' },
  { name: 'paleturquoise', hex: '#AFEEEE', rgb: 'rgb(175, 238, 238)', hsl: 'hsl(180, 65%, 81%)', category: 'Blue' },
  { name: 'turquoise', hex: '#40E0D0', rgb: 'rgb(64, 224, 208)', hsl: 'hsl(174, 72%, 56%)', category: 'Blue' },
  { name: 'mediumturquoise', hex: '#48D1CC', rgb: 'rgb(72, 209, 204)', hsl: 'hsl(178, 60%, 55%)', category: 'Blue' },
  { name: 'darkturquoise', hex: '#00CED1', rgb: 'rgb(0, 206, 209)', hsl: 'hsl(181, 100%, 41%)', category: 'Blue' },
  { name: 'cadetblue', hex: '#5F9EA0', rgb: 'rgb(95, 158, 160)', hsl: 'hsl(182, 25%, 50%)', category: 'Blue' },
  { name: 'steelblue', hex: '#4682B4', rgb: 'rgb(70, 130, 180)', hsl: 'hsl(207, 44%, 49%)', category: 'Blue' },
  { name: 'lightsteelblue', hex: '#B0C4DE', rgb: 'rgb(176, 196, 222)', hsl: 'hsl(214, 41%, 78%)', category: 'Blue' },
  { name: 'powderblue', hex: '#B0E0E6', rgb: 'rgb(176, 224, 230)', hsl: 'hsl(187, 52%, 80%)', category: 'Blue' },
  { name: 'lightblue', hex: '#ADD8E6', rgb: 'rgb(173, 216, 230)', hsl: 'hsl(195, 53%, 79%)', category: 'Blue' },
  { name: 'skyblue', hex: '#87CEEB', rgb: 'rgb(135, 206, 235)', hsl: 'hsl(197, 71%, 73%)', category: 'Blue' },
  { name: 'lightskyblue', hex: '#87CEFA', rgb: 'rgb(135, 206, 250)', hsl: 'hsl(203, 92%, 75%)', category: 'Blue' },
  { name: 'deepskyblue', hex: '#00BFFF', rgb: 'rgb(0, 191, 255)', hsl: 'hsl(195, 100%, 50%)', category: 'Blue' },
  { name: 'dodgerblue', hex: '#1E90FF', rgb: 'rgb(30, 144, 255)', hsl: 'hsl(210, 100%, 56%)', category: 'Blue' },
  { name: 'cornflowerblue', hex: '#6495ED', rgb: 'rgb(100, 149, 237)', hsl: 'hsl(219, 79%, 66%)', category: 'Blue' },
  { name: 'mediumslateblue', hex: '#7B68EE', rgb: 'rgb(123, 104, 238)', hsl: 'hsl(249, 80%, 67%)', category: 'Blue' },
  { name: 'royalblue', hex: '#4169E1', rgb: 'rgb(65, 105, 225)', hsl: 'hsl(225, 73%, 57%)', category: 'Blue' },
  { name: 'blue', hex: '#0000FF', rgb: 'rgb(0, 0, 255)', hsl: 'hsl(240, 100%, 50%)', category: 'Blue' },
  { name: 'mediumblue', hex: '#0000CD', rgb: 'rgb(0, 0, 205)', hsl: 'hsl(240, 100%, 40%)', category: 'Blue' },
  { name: 'darkblue', hex: '#00008B', rgb: 'rgb(0, 0, 139)', hsl: 'hsl(240, 100%, 27%)', category: 'Blue' },
  { name: 'navy', hex: '#000080', rgb: 'rgb(0, 0, 128)', hsl: 'hsl(240, 100%, 25%)', category: 'Blue' },
  { name: 'midnightblue', hex: '#191970', rgb: 'rgb(25, 25, 112)', hsl: 'hsl(240, 64%, 27%)', category: 'Blue' },

  // Purples
  { name: 'lavender', hex: '#E6E6FA', rgb: 'rgb(230, 230, 250)', hsl: 'hsl(240, 67%, 94%)', category: 'Purple' },
  { name: 'thistle', hex: '#D8BFD8', rgb: 'rgb(216, 191, 216)', hsl: 'hsl(300, 24%, 80%)', category: 'Purple' },
  { name: 'plum', hex: '#DDA0DD', rgb: 'rgb(221, 160, 221)', hsl: 'hsl(300, 47%, 75%)', category: 'Purple' },
  { name: 'violet', hex: '#EE82EE', rgb: 'rgb(238, 130, 238)', hsl: 'hsl(300, 76%, 72%)', category: 'Purple' },
  { name: 'orchid', hex: '#DA70D6', rgb: 'rgb(218, 112, 214)', hsl: 'hsl(302, 59%, 65%)', category: 'Purple' },
  { name: 'fuchsia', hex: '#FF00FF', rgb: 'rgb(255, 0, 255)', hsl: 'hsl(300, 100%, 50%)', category: 'Purple' },
  { name: 'magenta', hex: '#FF00FF', rgb: 'rgb(255, 0, 255)', hsl: 'hsl(300, 100%, 50%)', category: 'Purple' },
  { name: 'mediumorchid', hex: '#BA55D3', rgb: 'rgb(186, 85, 211)', hsl: 'hsl(280, 59%, 58%)', category: 'Purple' },
  { name: 'mediumpurple', hex: '#9370DB', rgb: 'rgb(147, 112, 219)', hsl: 'hsl(260, 60%, 65%)', category: 'Purple' },
  { name: 'blueviolet', hex: '#8A2BE2', rgb: 'rgb(138, 43, 226)', hsl: 'hsl(271, 76%, 53%)', category: 'Purple' },
  { name: 'darkviolet', hex: '#9400D3', rgb: 'rgb(148, 0, 211)', hsl: 'hsl(282, 100%, 41%)', category: 'Purple' },
  { name: 'darkorchid', hex: '#9932CC', rgb: 'rgb(153, 50, 204)', hsl: 'hsl(280, 61%, 50%)', category: 'Purple' },
  { name: 'darkmagenta', hex: '#8B008B', rgb: 'rgb(139, 0, 139)', hsl: 'hsl(300, 100%, 27%)', category: 'Purple' },
  { name: 'purple', hex: '#800080', rgb: 'rgb(128, 0, 128)', hsl: 'hsl(300, 100%, 25%)', category: 'Purple' },
  { name: 'indigo', hex: '#4B0082', rgb: 'rgb(75, 0, 130)', hsl: 'hsl(275, 100%, 25%)', category: 'Purple' },
  { name: 'slateblue', hex: '#6A5ACD', rgb: 'rgb(106, 90, 205)', hsl: 'hsl(248, 53%, 58%)', category: 'Purple' },
  { name: 'darkslateblue', hex: '#483D8B', rgb: 'rgb(72, 61, 139)', hsl: 'hsl(248, 39%, 39%)', category: 'Purple' },
  { name: 'mediumslateblue', hex: '#7B68EE', rgb: 'rgb(123, 104, 238)', hsl: 'hsl(249, 80%, 67%)', category: 'Purple' },

  // Grays
  { name: 'gainsboro', hex: '#DCDCDC', rgb: 'rgb(220, 220, 220)', hsl: 'hsl(0, 0%, 86%)', category: 'Gray' },
  { name: 'lightgray', hex: '#D3D3D3', rgb: 'rgb(211, 211, 211)', hsl: 'hsl(0, 0%, 83%)', category: 'Gray' },
  { name: 'silver', hex: '#C0C0C0', rgb: 'rgb(192, 192, 192)', hsl: 'hsl(0, 0%, 75%)', category: 'Gray' },
  { name: 'darkgray', hex: '#A9A9A9', rgb: 'rgb(169, 169, 169)', hsl: 'hsl(0, 0%, 66%)', category: 'Gray' },
  { name: 'gray', hex: '#808080', rgb: 'rgb(128, 128, 128)', hsl: 'hsl(0, 0%, 50%)', category: 'Gray' },
  { name: 'dimgray', hex: '#696969', rgb: 'rgb(105, 105, 105)', hsl: 'hsl(0, 0%, 41%)', category: 'Gray' },
  { name: 'lightslategray', hex: '#778899', rgb: 'rgb(119, 136, 153)', hsl: 'hsl(210, 14%, 53%)', category: 'Gray' },
  { name: 'slategray', hex: '#708090', rgb: 'rgb(112, 128, 144)', hsl: 'hsl(210, 13%, 50%)', category: 'Gray' },
  { name: 'darkslategray', hex: '#2F4F4F', rgb: 'rgb(47, 79, 79)', hsl: 'hsl(180, 25%, 25%)', category: 'Gray' },
  { name: 'black', hex: '#000000', rgb: 'rgb(0, 0, 0)', hsl: 'hsl(0, 0%, 0%)', category: 'Gray' },
]

const categories = [...new Set(colorNames.map((c) => c.category))]

export default function ColorNamesReference() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [copyFormat, setCopyFormat] = useState<'name' | 'hex' | 'rgb' | 'hsl'>('hex')

  const filteredColors = useMemo(() => {
    let filtered = colorNames

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((c) => c.category === selectedCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.hex.toLowerCase().includes(query) ||
          c.rgb.toLowerCase().includes(query) ||
          c.hsl.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [searchQuery, selectedCategory])

  const handleCopy = (color: ColorName) => {
    switch (copyFormat) {
      case 'name':
        return color.name
      case 'hex':
        return color.hex
      case 'rgb':
        return color.rgb
      case 'hsl':
        return color.hsl
    }
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
            placeholder="Search by name, HEX, RGB, or HSL..."
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
              <option value="name">Color Name</option>
              <option value="hex">HEX</option>
              <option value="rgb">RGB</option>
              <option value="hsl">HSL</option>
            </select>
          </div>
        </div>
      </div>

      <div className="text-sm text-zinc-400">
        Showing {filteredColors.length} of {colorNames.length} colors
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredColors.map((color, idx) => (
          <div
            key={idx}
            className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-16 h-16 rounded-lg border-2 border-zinc-700 shrink-0"
                style={{ backgroundColor: color.hex }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-zinc-100 capitalize">{color.name}</h3>
                  <CopyButton text={handleCopy(color)} />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">HEX:</span>
                    <code className="text-zinc-300">{color.hex}</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">RGB:</span>
                    <code className="text-zinc-300">{color.rgb}</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">HSL:</span>
                    <code className="text-zinc-300">{color.hsl}</code>
                  </div>
                </div>
              </div>
            </div>
            <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
              {color.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

