'use client'

const SHORTCUTS = [
  {
    category: 'General',
    shortcuts: [
      { keys: 'Ctrl+C', desc: 'Copy' },
      { keys: 'Ctrl+V', desc: 'Paste' },
      { keys: 'Ctrl+X', desc: 'Cut' },
      { keys: 'Ctrl+Z', desc: 'Undo' },
      { keys: 'Ctrl+Y', desc: 'Redo' },
      { keys: 'Ctrl+A', desc: 'Select all' },
      { keys: 'Ctrl+F', desc: 'Find' },
      { keys: 'Ctrl+S', desc: 'Save' },
    ],
  },
  {
    category: 'VS Code / IDE',
    shortcuts: [
      { keys: 'Ctrl+/', desc: 'Toggle comment' },
      { keys: 'Ctrl+D', desc: 'Select next occurrence' },
      { keys: 'Ctrl+Shift+P', desc: 'Command palette' },
      { keys: 'Ctrl+B', desc: 'Toggle sidebar' },
      { keys: 'Ctrl+`', desc: 'Toggle terminal' },
      { keys: 'F2', desc: 'Rename symbol' },
      { keys: 'Ctrl+Shift+F', desc: 'Search in files' },
      { keys: 'Alt+Up/Down', desc: 'Move line' },
    ],
  },
  {
    category: 'Browser',
    shortcuts: [
      { keys: 'Ctrl+T', desc: 'New tab' },
      { keys: 'Ctrl+W', desc: 'Close tab' },
      { keys: 'Ctrl+Shift+T', desc: 'Reopen closed tab' },
      { keys: 'Ctrl+R', desc: 'Reload' },
      { keys: 'Ctrl+Shift+R', desc: 'Hard reload' },
      { keys: 'F12', desc: 'Developer tools' },
      { keys: 'Ctrl+L', desc: 'Focus address bar' },
    ],
  },
  {
    category: 'Terminal',
    shortcuts: [
      { keys: 'Ctrl+C', desc: 'Interrupt process' },
      { keys: 'Ctrl+D', desc: 'Exit/EOF' },
      { keys: 'Ctrl+L', desc: 'Clear screen' },
      { keys: 'Ctrl+R', desc: 'Search history' },
      { keys: 'Ctrl+A', desc: 'Start of line' },
      { keys: 'Ctrl+E', desc: 'End of line' },
      { keys: 'Ctrl+U', desc: 'Clear to start' },
      { keys: 'Ctrl+K', desc: 'Clear to end' },
    ],
  },
]

export default function KeyboardShortcuts() {
  return (
    <div className="flex flex-col gap-6">
      {SHORTCUTS.map((section) => (
        <div key={section.category} className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-zinc-200">{section.category}</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="p-3 text-left text-sm font-medium text-zinc-300">Shortcut</th>
                  <th className="p-3 text-left text-sm font-medium text-zinc-300">Description</th>
                </tr>
              </thead>
              <tbody>
                {section.shortcuts.map((shortcut, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="p-3">
                      <code className="rounded bg-emerald-600/20 px-2 py-1 font-mono text-sm text-emerald-400">
                        {shortcut.keys}
                      </code>
                    </td>
                    <td className="p-3 text-sm text-zinc-300">{shortcut.desc}</td>
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

