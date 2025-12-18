# Dev Toolbox 🧰

A collection of free, fast developer tools that run entirely in your browser. No data ever leaves your machine.

**Live Demo:** [dev-toolbox.vercel.app](https://dev-toolbox.vercel.app)

## Features

- 🔒 **Privacy First** - All tools run client-side. No data is sent to any server.
- ⚡ **Fast** - Instant results with no network latency.
- 🎨 **Modern UI** - Clean, dark-themed interface built with Tailwind CSS.
- 🔗 **Deep Links** - Share direct links to any tool.
- ♿ **Accessible** - Keyboard navigable with proper focus management.

## Available Tools

| Tool | Description |
|------|-------------|
| **JSON Formatter** | Format, validate, and beautify JSON data |
| **Base64 Encode/Decode** | Encode text to Base64 or decode Base64 strings |
| **URL Encode/Decode** | Encode or decode URL components |
| **Case Converter** | Convert between camelCase, PascalCase, snake_case, kebab-case |
| **JWT Decoder** | Decode and inspect JSON Web Tokens |
| **Timestamp Converter** | Convert between Unix timestamps and human dates |

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or yarn/pnpm)

### Installation

```bash
# Clone the repository
git clone https://github.com/marcelfrank-dev/dev-toolbox.git
cd dev-toolbox

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run unit tests |

## Adding a New Tool

1. Create a new folder in `tools/` (e.g., `tools/my-tool/`)

2. Create the tool component:

```tsx
// tools/my-tool/MyTool.tsx
'use client'

export default function MyTool() {
  return (
    <div>
      {/* Your tool UI */}
    </div>
  )
}
```

3. Register the tool in `tools/registry.ts`:

```ts
const MyTool = dynamic(() => import('./my-tool/MyTool'), { ssr: false })

export const tools: Tool[] = [
  // ... existing tools
  {
    id: 'my-tool',
    name: 'My Tool',
    description: 'Description of what the tool does',
    category: 'Text', // or JSON, Encoding, Web, Security
    keywords: ['keyword1', 'keyword2'],
    component: MyTool,
  },
]
```

4. That's it! The tool will automatically appear in the grid.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Testing:** Vitest + React Testing Library
- **Linting:** ESLint + Prettier

## Deployment

This project is designed to be deployed on [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel auto-detects Next.js and deploys

No environment variables are required for basic functionality.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ for developers
