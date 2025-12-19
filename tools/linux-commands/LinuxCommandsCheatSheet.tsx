'use client'

const LINUX_COMMANDS = [
  {
    category: 'File Operations',
    commands: [
      { cmd: 'ls', desc: 'List directory contents' },
      { cmd: 'cd', desc: 'Change directory' },
      { cmd: 'pwd', desc: 'Print working directory' },
      { cmd: 'cp', desc: 'Copy files/directories' },
      { cmd: 'mv', desc: 'Move/rename files' },
      { cmd: 'rm', desc: 'Remove files' },
      { cmd: 'mkdir', desc: 'Create directory' },
      { cmd: 'rmdir', desc: 'Remove directory' },
    ],
  },
  {
    category: 'File Viewing',
    commands: [
      { cmd: 'cat', desc: 'Display file contents' },
      { cmd: 'less', desc: 'View file page by page' },
      { cmd: 'head', desc: 'Show first lines' },
      { cmd: 'tail', desc: 'Show last lines' },
      { cmd: 'grep', desc: 'Search text in files' },
    ],
  },
  {
    category: 'Permissions',
    commands: [
      { cmd: 'chmod', desc: 'Change file permissions' },
      { cmd: 'chown', desc: 'Change file owner' },
      { cmd: 'sudo', desc: 'Execute as superuser' },
    ],
  },
  {
    category: 'Process Management',
    commands: [
      { cmd: 'ps', desc: 'List processes' },
      { cmd: 'top', desc: 'Display running processes' },
      { cmd: 'kill', desc: 'Terminate process' },
      { cmd: 'jobs', desc: 'List background jobs' },
    ],
  },
  {
    category: 'Network',
    commands: [
      { cmd: 'ping', desc: 'Test network connectivity' },
      { cmd: 'curl', desc: 'Transfer data from server' },
      { cmd: 'wget', desc: 'Download files' },
      { cmd: 'ssh', desc: 'Remote login' },
    ],
  },
  {
    category: 'System Info',
    commands: [
      { cmd: 'uname', desc: 'System information' },
      { cmd: 'df', desc: 'Disk space usage' },
      { cmd: 'du', desc: 'Directory space usage' },
      { cmd: 'free', desc: 'Memory usage' },
    ],
  },
]

export default function LinuxCommandsCheatSheet() {
  return (
    <div className="flex flex-col gap-6">
      {LINUX_COMMANDS.map((section) => (
        <div key={section.category} className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-zinc-200">{section.category}</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="p-3 text-left text-sm font-medium text-zinc-300">Command</th>
                  <th className="p-3 text-left text-sm font-medium text-zinc-300">Description</th>
                </tr>
              </thead>
              <tbody>
                {section.commands.map((cmd, i) => (
                  <tr key={i} className="border-b border-zinc-800/50">
                    <td className="p-3">
                      <code className="rounded bg-emerald-600/20 px-2 py-1 font-mono text-sm text-emerald-400">
                        {cmd.cmd}
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

