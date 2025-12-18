'use client'

import { useState, useMemo } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface GitignoreTemplate {
  id: string
  name: string
  category: string
  content: string
}

const gitignoreTemplates: GitignoreTemplate[] = [
  {
    id: 'node',
    name: 'Node.js',
    category: 'Language',
    content: `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Build outputs
dist/
build/
*.tsbuildinfo

# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
`,
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Language',
    content: `# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# Virtual environments
venv/
env/
ENV/
.venv

# IDEs
.vscode/
.idea/
*.swp
*.swo

# Distribution / packaging
dist/
build/
*.egg-info/

# Jupyter Notebook
.ipynb_checkpoints

# pyenv
.python-version

# Environment variables
.env
.env.local
`,
  },
  {
    id: 'java',
    name: 'Java',
    category: 'Language',
    content: `# Compiled class files
*.class

# Log files
*.log

# Package Files
*.jar
*.war
*.nar
*.ear
*.zip
*.tar.gz
*.rar

# Maven
target/
pom.xml.tag
pom.xml.releaseBackup
pom.xml.versionsBackup
pom.xml.next
release.properties
dependency-reduced-pom.xml
buildNumber.properties
.mvn/timing.properties
.mvn/wrapper/maven-wrapper.jar

# Gradle
.gradle
build/
!gradle/wrapper/gradle-wrapper.jar
!**/src/main/**/build/
!**/src/test/**/build/

# IDE
.idea/
*.iml
*.iws
*.ipr
.vscode/
.classpath
.project
.settings/
`,
  },
  {
    id: 'go',
    name: 'Go',
    category: 'Language',
    content: `# Binaries
*.exe
*.exe~
*.dll
*.so
*.dylib

# Test binary
*.test

# Output of the go coverage tool
*.out

# Dependency directories
vendor/

# Go workspace file
go.work

# IDE
.idea/
.vscode/
*.swp
*.swo
`,
  },
  {
    id: 'rust',
    name: 'Rust',
    category: 'Language',
    content: `# Compiled files
target/
Cargo.lock

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
`,
  },
  {
    id: 'php',
    name: 'PHP',
    category: 'Language',
    content: `# Dependencies
vendor/
composer.lock

# IDE
.idea/
.vscode/
*.swp
*.swo

# Logs
*.log

# Environment
.env
.env.local

# OS
.DS_Store
Thumbs.db
`,
  },
  {
    id: 'ruby',
    name: 'Ruby',
    category: 'Language',
    content: `# Dependencies
vendor/bundle/
.bundle/

# Logs
*.log

# Environment
.env
.env.local

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
`,
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'Framework',
    content: `# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
`,
  },
  {
    id: 'react',
    name: 'React',
    category: 'Framework',
    content: `# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
`,
  },
  {
    id: 'vue',
    name: 'Vue.js',
    category: 'Framework',
    content: `# Dependencies
node_modules/
dist/

# IDE
.idea/
.vscode/
*.swp
*.swo

# Environment
.env
.env.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
Thumbs.db
`,
  },
  {
    id: 'angular',
    name: 'Angular',
    category: 'Framework',
    content: `# Dependencies
node_modules/

# Build outputs
dist/
tmp/
out-tsc/

# IDE
.idea/
.vscode/
*.swp
*.swo

# Environment
.env
.env.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
Thumbs.db
`,
  },
  {
    id: 'django',
    name: 'Django',
    category: 'Framework',
    content: `# Python
*.py[cod]
__pycache__/
*.so
.Python
env/
venv/
ENV/
.venv

# Django
*.log
local_settings.py
db.sqlite3
db.sqlite3-journal
/media
/staticfiles

# IDE
.idea/
.vscode/
*.swp
*.swo

# Environment
.env
.env.local

# OS
.DS_Store
Thumbs.db
`,
  },
  {
    id: 'rails',
    name: 'Rails',
    category: 'Framework',
    content: `# Dependencies
/vendor/bundle
.bundle/

# Logs
*.log
tmp/
log/

# Database
*.sqlite3
*.sqlite3-journal
db/*.sqlite3

# Environment
.env
.env.local

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
`,
  },
  {
    id: 'vscode',
    name: 'Visual Studio Code',
    category: 'IDE',
    content: `# VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
*.code-workspace

# Local History
.history/

# Built Visual Studio Code Extensions
*.vsix
`,
  },
  {
    id: 'intellij',
    name: 'IntelliJ IDEA',
    category: 'IDE',
    content: `# IntelliJ IDEA
.idea/
*.iml
*.iws
*.ipr
out/

# User-specific stuff
.idea/**/workspace.xml
.idea/**/tasks.xml
.idea/**/usage.statistics.xml
.idea/**/dictionaries
.idea/**/shelf
`,
  },
  {
    id: 'eclipse',
    name: 'Eclipse',
    category: 'IDE',
    content: `# Eclipse
.classpath
.project
.settings/
bin/
tmp/
*.tmp
*.bak
*.swp
*~.nib
local.properties
.loadpath
.recommenders

# External tool builders
.externalToolBuilders/

# Locally stored "Eclipse launch configurations"
*.launch

# PyDev specific
.pydevproject

# CDT-specific
.cproject

# CDT- autotools
.autotools

# Java annotation processor
.factorypath

# PDT-specific
.buildpath

# sbteclipse plugin
.target

# Tern plugin
.tern-project

# TeXlipse plugin
.texlipse

# STS (Spring Tool Suite)
.springBeans

# Code Recommenders
.recommenders/
`,
  },
  {
    id: 'macos',
    name: 'macOS',
    category: 'OS',
    content: `# General
.DS_Store
.AppleDouble
.LSOverride

# Thumbnails
._*

# Files that might appear in the root of a volume
.DocumentRevisions-V100
.fseventsd
.Spotlight-V100
.TemporaryItems
.Trashes
.VolumeIcon.icns
.com.apple.timemachine.donotpresent

# Directories potentially created on remote AFP share
.AppleDB
.AppleDesktop
Network Trash Folder
Temporary Items
.apdisk
`,
  },
  {
    id: 'windows',
    name: 'Windows',
    category: 'OS',
    content: `# Windows thumbnail cache files
Thumbs.db
Thumbs.db:encryptable
ehthumbs.db
ehthumbs_vista.db

# Dump file
*.stackdump

# Folder config file
[Dd]esktop.ini

# Recycle Bin used on file shares
$RECYCLE.BIN/

# Windows Installer files
*.cab
*.msi
*.msix
*.msm
*.msp

# Windows shortcuts
*.lnk
`,
  },
  {
    id: 'linux',
    name: 'Linux',
    category: 'OS',
    content: `# Linux
*~

# temporary files which can be created if a process still has a handle open of a deleted file
.fuse_hidden*

# KDE directory preferences
.directory

# Linux trash folder
.Trash-*

# .nfs files are created when an open file is removed but is still being accessed
.nfs*
`,
  },
]

export default function GitignoreGenerator() {
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set())
  const [customRules, setCustomRules] = useState('')

  const generatedContent = useMemo(() => {
    const parts: string[] = []

    // Add selected templates
    selectedTemplates.forEach((templateId) => {
      const template = gitignoreTemplates.find((t) => t.id === templateId)
      if (template) {
        parts.push(`# ${template.name}`)
        parts.push(template.content.trim())
        parts.push('')
      }
    })

    // Add custom rules
    if (customRules.trim()) {
      parts.push('# Custom rules')
      parts.push(customRules.trim())
    }

    return parts.join('\n').trim() || '# Generated .gitignore file\n# Select templates above to generate content'
  }, [selectedTemplates, customRules])

  const toggleTemplate = (templateId: string) => {
    const newSelected = new Set(selectedTemplates)
    if (newSelected.has(templateId)) {
      newSelected.delete(templateId)
    } else {
      newSelected.add(templateId)
    }
    setSelectedTemplates(newSelected)
  }

  const categories = Array.from(new Set(gitignoreTemplates.map((t) => t.category))).sort()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">Select Templates</h2>
        <div className="space-y-4">
          {categories.map((category) => {
            const templates = gitignoreTemplates.filter((t) => t.category === category)
            return (
              <div key={category} className="space-y-2">
                <h3 className="text-sm font-medium text-zinc-400">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => toggleTemplate(template.id)}
                      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                        selectedTemplates.has(template.id)
                          ? 'border-zinc-500 bg-zinc-800 text-zinc-100'
                          : 'border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900 hover:text-zinc-300'
                      }`}
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <label htmlFor="custom-rules" className="mb-2 block text-sm font-medium text-zinc-300">
          Custom Rules (optional)
        </label>
        <textarea
          id="custom-rules"
          value={customRules}
          onChange={(e) => setCustomRules(e.target.value)}
          placeholder="# Add your custom .gitignore rules here&#10;# One rule per line"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          rows={6}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="output" className="block text-sm font-medium text-zinc-300">
            Generated .gitignore
          </label>
          <CopyButton text={generatedContent} />
        </div>
        <textarea
          id="output"
          readOnly
          value={generatedContent}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          rows={20}
        />
      </div>
    </div>
  )
}

