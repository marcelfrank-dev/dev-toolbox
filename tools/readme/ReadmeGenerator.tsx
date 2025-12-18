'use client'

import { useState, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface ReadmeTemplate {
  id: string
  name: string
  description: string
  template: (data: ReadmeData) => string
}

interface ReadmeData {
  projectName: string
  description: string
  author: string
  license: string
  includeInstallation: boolean
  includeUsage: boolean
  includeContributing: boolean
  includeLicense: boolean
  includeBadges: boolean
  githubUsername?: string
  repositoryUrl?: string
}

const templates: ReadmeTemplate[] = [
  {
    id: 'project',
    name: 'Project',
    description: 'General project template',
    template: (data) => {
      let content = `# ${data.projectName}\n\n`
      
      if (data.description) {
        content += `${data.description}\n\n`
      }

      if (data.includeBadges && data.githubUsername && data.repositoryUrl) {
        content += `![GitHub](https://img.shields.io/github/license/${data.githubUsername}/${data.repositoryUrl.split('/').pop()})\n`
        content += `![GitHub stars](https://img.shields.io/github/stars/${data.githubUsername}/${data.repositoryUrl.split('/').pop()})\n\n`
      }

      if (data.includeInstallation) {
        content += `## Installation\n\n`
        content += `\`\`\`bash\nnpm install\n# or\nyarn install\n# or\npnpm install\n\`\`\`\n\n`
      }

      if (data.includeUsage) {
        content += `## Usage\n\n`
        content += `\`\`\`bash\nnpm start\n# or\nyarn start\n# or\npnpm start\n\`\`\`\n\n`
      }

      if (data.includeContributing) {
        content += `## Contributing\n\n`
        content += `Contributions are welcome! Please feel free to submit a Pull Request.\n\n`
      }

      if (data.includeLicense && data.license) {
        content += `## License\n\n`
        content += `This project is licensed under the ${data.license} License.\n\n`
      }

      return content
    },
  },
  {
    id: 'library',
    name: 'Library',
    description: 'JavaScript/TypeScript library template',
    template: (data) => {
      let content = `# ${data.projectName}\n\n`
      
      if (data.description) {
        content += `${data.description}\n\n`
      }

      if (data.includeBadges && data.githubUsername && data.repositoryUrl) {
        const repoName = data.repositoryUrl.split('/').pop()
        content += `![npm version](https://img.shields.io/npm/v/${repoName})\n`
        content += `![npm downloads](https://img.shields.io/npm/dm/${repoName})\n`
        content += `![GitHub](https://img.shields.io/github/license/${data.githubUsername}/${repoName})\n\n`
      }

      content += `## Installation\n\n`
      content += `\`\`\`bash\nnpm install ${data.projectName.toLowerCase()}\n# or\nyarn add ${data.projectName.toLowerCase()}\n# or\npnpm add ${data.projectName.toLowerCase()}\n\`\`\`\n\n`

      if (data.includeUsage) {
        content += `## Usage\n\n`
        content += `\`\`\`javascript\nimport { ${data.projectName} } from '${data.projectName.toLowerCase()}'\n\n// Your usage example here\n\`\`\`\n\n`
      }

      content += `## API\n\n`
      content += `### Methods\n\n`
      content += `| Method | Description | Parameters |\n`
      content += `|--------|-------------|------------|\n`
      content += `| \`method()\` | Description | \`param\` |\n\n`

      if (data.includeContributing) {
        content += `## Contributing\n\n`
        content += `1. Fork the repository\n`
        content += `2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)\n`
        content += `3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)\n`
        content += `4. Push to the branch (\`git push origin feature/amazing-feature\`)\n`
        content += `5. Open a Pull Request\n\n`
      }

      if (data.includeLicense && data.license) {
        content += `## License\n\n`
        content += `This project is licensed under the ${data.license} License - see the LICENSE file for details.\n\n`
      }

      return content
    },
  },
  {
    id: 'api',
    name: 'API',
    description: 'API documentation template',
    template: (data) => {
      let content = `# ${data.projectName} API\n\n`
      
      if (data.description) {
        content += `${data.description}\n\n`
      }

      if (data.includeBadges && data.repositoryUrl) {
        content += `![API Status](https://img.shields.io/badge/API-Online-green)\n\n`
      }

      content += `## Base URL\n\n`
      content += `\`\`\`\nhttps://api.example.com/v1\n\`\`\`\n\n`

      content += `## Authentication\n\n`
      content += `All API requests require authentication using an API key.\n\n`
      content += `\`\`\`\nAuthorization: Bearer YOUR_API_KEY\n\`\`\`\n\n`

      content += `## Endpoints\n\n`
      content += `### GET /endpoint\n\n`
      content += `Get information about a resource.\n\n`
      content += `**Request:**\n\n`
      content += `\`\`\`bash\ncurl -X GET https://api.example.com/v1/endpoint \\\n`
      content += `  -H "Authorization: Bearer YOUR_API_KEY"\n\`\`\`\n\n`
      content += `**Response:**\n\n`
      content += `\`\`\`json\n{\n  "status": "success",\n  "data": {}\n}\n\`\`\`\n\n`

      if (data.includeContributing) {
        content += `## Contributing\n\n`
        content += `Contributions are welcome! Please read our contributing guidelines first.\n\n`
      }

      if (data.includeLicense && data.license) {
        content += `## License\n\n`
        content += `This API is licensed under the ${data.license} License.\n\n`
      }

      return content
    },
  },
]

export default function ReadmeGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState('project')
  const [data, setData] = useState<ReadmeData>({
    projectName: 'My Project',
    description: 'A brief description of your project',
    author: '',
    license: 'MIT',
    includeInstallation: true,
    includeUsage: true,
    includeContributing: true,
    includeLicense: true,
    includeBadges: true,
    githubUsername: '',
    repositoryUrl: '',
  })

  const generatedContent = useMemo(() => {
    const template = templates.find((t) => t.id === selectedTemplate)
    if (!template) return ''
    return template.template(data)
  }, [selectedTemplate, data])

  const updateData = (updates: Partial<ReadmeData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="template" className="mb-2 block text-sm font-medium text-zinc-300">
          Template
        </label>
        <div className="flex gap-2">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                selectedTemplate === template.id
                  ? 'border-zinc-500 bg-zinc-800 text-zinc-100'
                  : 'border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900 hover:text-zinc-300'
              }`}
            >
              {template.name}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-zinc-500">
          {templates.find((t) => t.id === selectedTemplate)?.description}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="project-name" className="mb-2 block text-sm font-medium text-zinc-300">
            Project Name
          </label>
          <input
            id="project-name"
            type="text"
            value={data.projectName}
            onChange={(e) => updateData({ projectName: e.target.value })}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>

        <div>
          <label htmlFor="author" className="mb-2 block text-sm font-medium text-zinc-300">
            Author
          </label>
          <input
            id="author"
            type="text"
            value={data.author}
            onChange={(e) => updateData({ author: e.target.value })}
            placeholder="Your name"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>

        <div>
          <label htmlFor="license" className="mb-2 block text-sm font-medium text-zinc-300">
            License
          </label>
          <select
            id="license"
            value={data.license}
            onChange={(e) => updateData({ license: e.target.value })}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          >
            <option value="MIT">MIT</option>
            <option value="Apache-2.0">Apache 2.0</option>
            <option value="GPL-3.0">GPL 3.0</option>
            <option value="BSD-3-Clause">BSD 3-Clause</option>
            <option value="ISC">ISC</option>
            <option value="Unlicense">Unlicense</option>
          </select>
        </div>

        <div>
          <label htmlFor="github-username" className="mb-2 block text-sm font-medium text-zinc-300">
            GitHub Username
          </label>
          <input
            id="github-username"
            type="text"
            value={data.githubUsername}
            onChange={(e) => updateData({ githubUsername: e.target.value })}
            placeholder="username"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="mb-2 block text-sm font-medium text-zinc-300">
            Description
          </label>
          <textarea
            id="description"
            value={data.description}
            onChange={(e) => updateData({ description: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="repository-url" className="mb-2 block text-sm font-medium text-zinc-300">
            Repository URL (optional)
          </label>
          <input
            id="repository-url"
            type="text"
            value={data.repositoryUrl}
            onChange={(e) => updateData({ repositoryUrl: e.target.value })}
            placeholder="https://github.com/username/repo"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-zinc-300">Sections</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.includeInstallation}
              onChange={(e) => updateData({ includeInstallation: e.target.checked })}
              className="rounded border-zinc-700 bg-zinc-900/50 text-zinc-500 focus:ring-zinc-500/20"
            />
            <span className="text-sm text-zinc-400">Installation</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.includeUsage}
              onChange={(e) => updateData({ includeUsage: e.target.checked })}
              className="rounded border-zinc-700 bg-zinc-900/50 text-zinc-500 focus:ring-zinc-500/20"
            />
            <span className="text-sm text-zinc-400">Usage</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.includeContributing}
              onChange={(e) => updateData({ includeContributing: e.target.checked })}
              className="rounded border-zinc-700 bg-zinc-900/50 text-zinc-500 focus:ring-zinc-500/20"
            />
            <span className="text-sm text-zinc-400">Contributing</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.includeLicense}
              onChange={(e) => updateData({ includeLicense: e.target.checked })}
              className="rounded border-zinc-700 bg-zinc-900/50 text-zinc-500 focus:ring-zinc-500/20"
            />
            <span className="text-sm text-zinc-400">License</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.includeBadges}
              onChange={(e) => updateData({ includeBadges: e.target.checked })}
              className="rounded border-zinc-700 bg-zinc-900/50 text-zinc-500 focus:ring-zinc-500/20"
            />
            <span className="text-sm text-zinc-400">Badges</span>
          </label>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="output" className="block text-sm font-medium text-zinc-300">
            Generated README.md
          </label>
          <CopyButton text={generatedContent} />
        </div>
        <textarea
          id="output"
          readOnly
          value={generatedContent}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          rows={25}
        />
      </div>
    </div>
  )
}

