'use client'

const VIM_COMMANDS = [
  {
    category: 'Movement',
    commands: [
      { key: 'h, j, k, l', desc: 'Left, Down, Up, Right' },
      { key: 'w, b', desc: 'Next/Previous word' },
      { key: '0, $', desc: 'Start/End of line' },
      { key: 'gg, G', desc: 'Top/Bottom of file' },
      { key: '^', desc: 'Start of line (non-blank)' },
    ],
  },
  {
    category: 'Editing',
    commands: [
      { key: 'i, a', desc: 'Insert before/after cursor' },
      { key: 'I, A', desc: 'Insert at start/end of line' },
      { key: 'o, O', desc: 'New line below/above' },
      { key: 'x, X', desc: 'Delete char under/before cursor' },
      { key: 'dd', desc: 'Delete line' },
      { key: 'yy', desc: 'Yank (copy) line' },
      { key: 'p, P', desc: 'Paste after/before' },
    ],
  },
  {
    category: 'Search & Replace',
    commands: [
      { key: '/pattern', desc: 'Search forward' },
      { key: '?pattern', desc: 'Search backward' },
      { key: 'n, N', desc: 'Next/Previous match' },
      { key: ':%s/old/new/g', desc: 'Replace all' },
      { key: ':s/old/new/g', desc: 'Replace in line' },
    ],
  },
  {
    category: 'Visual Mode',
    commands: [
      { key: 'v', desc: 'Character-wise visual' },
      { key: 'V', desc: 'Line-wise visual' },
      { key: 'Ctrl+v', desc: 'Block visual' },
    ],
  },
  {
    category: 'File Operations',
    commands: [
      { key: ':w', desc: 'Write (save)' },
      { key: ':q', desc: 'Quit' },
      { key: ':wq, :x', desc: 'Write and quit' },
      { key: ':q!', desc: 'Quit without saving' },
      { key: ':e file', desc: 'Edit file' },
    ],
  },
]

export default function VimCheatSheet() {
  return (
    <div className="flex flex-col gap-6">
      {VIM_COMMANDS.map((section) => (
        <div key={section.category} className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-zinc-200">{section.category}</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="p-3 text-left text-sm font-medium text-zinc-300">Key</th>
                  <th className="p-3 text-left text-sm font-medium text-zinc-300">Description</th>
                </tr>
              </thead>
              <tbody>
                {section.commands.map((cmd, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="p-3">
                      <code className="rounded bg-emerald-600/20 px-2 py-1 font-mono text-sm text-emerald-400">
                        {cmd.key}
                      </code>
                    </td>
                    <td className="p-3 text-sm text-zinc-300">{cmd.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}

