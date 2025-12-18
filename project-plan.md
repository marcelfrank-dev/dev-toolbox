# Dev Toolbox — One-Page Collection of Tiny Developer Tools (Vercel)

You are an AI Coding Agent with access to GitHub via MCP.  
Your job: create a new GitHub repository, initialize the project architecture, and generate GitHub Issues (with labels + milestones) for features and for the setup tasks the owner must do manually.

## 0) High-level goal

Build a **single-page website** that contains **many small developer tools** as a collection.  
All tools should run **fully client-side** (no DB, no server required) and be deployable to **Vercel** with zero infra cost.

Monetization later via **ads** (e.g., Google AdSense), but the initial build must be ad-ready (layout slots, privacy pages, consent handling).

## 1) Constraints & non-goals

### Constraints
- No database.
- No paid infrastructure.
- Host on Vercel.
- Keep tools client-side by default.
- Must be fast (Core Web Vitals) and SEO-friendly (tool-specific metadata even though it’s a one-page collection).

### Non-goals (for initial MVP)
- User accounts / logins
- Saving user data on backend
- Paid subscriptions
- Heavy analytics stack (use minimal privacy-friendly option or Vercel analytics later)

## 2) Tech stack (decide & implement)
- Framework: **Next.js (App Router)** + **TypeScript**
- Styling: **Tailwind CSS**
- UI primitives: minimal custom components (avoid heavy UI libs)
- State: React hooks only
- Code quality: ESLint + Prettier
- Testing:
  - Unit: Vitest
  - E2E smoke: Playwright (optional but recommended)
- Deployment: Vercel (no special server config)
- No external services required for MVP.

## 3) Core UX requirements

### One-page collection
- Home page lists tools as **cards** (title, short description, tags).
- Search / filter at top:
  - search by name & description
  - filter by category (e.g., JSON, Text, Encoding, Web)
- Clicking a tool opens the tool UI via:
  - **Modal** OR **Expandable panel** (choose one pattern; keep it consistent)
- Deep link support:
  - Use URL hash or query param `?tool=json-formatter` to open a tool directly.
- Each tool should have:
  - input area(s)
  - output area(s)
  - copy-to-clipboard buttons
  - clear/reset
  - basic validation + helpful errors
- Accessibility:
  - keyboard navigable
  - proper labels
  - focus management if modal is used

### SEO even with one page
- Render a list of tools in HTML (not lazy-only).
- Tool deep-links should update:
  - `<title>`
  - meta description
  - OpenGraph tags (best effort within one-page constraint)
- Include:
  - sitemap
  - robots.txt
  - canonical URL
- Add structured data for a “SoftwareApplication” or “WebApplication” page (lightweight).

### Performance
- Avoid large dependencies.
- Use dynamic import only where needed.
- Target Lighthouse 90+ on mobile for performance & SEO.

## 4) Initial tool set (MVP)
Implement these tools first (keep each tool isolated + reusable):
1. JSON Formatter & Validator
2. Base64 Encode / Decode
3. URL Encode / Decode
4. Case Converter (camel / pascal / snake / kebab)
5. JWT Decoder (decode header/payload; no verification)
6. Timestamp Converter (unix <-> human; timezone selection optional)

All tools must run client-side without external APIs.

## 5) Repository structure

Create a clear structure:
- `app/`
  - `page.tsx` (the one-page collection)
  - `layout.tsx` (global metadata)
  - `robots.ts`
  - `sitemap.ts`
- `components/`
  - `ToolCard.tsx`
  - `ToolModal.tsx` (or `ToolPanel.tsx`)
  - `SearchBar.tsx`
  - `CategoryFilter.tsx`
  - `CopyButton.tsx`
- `tools/` (core)
  - `registry.ts` (tool definitions list)
  - `types.ts`
  - `json/`
  - `base64/`
  - `url/`
  - `case/`
  - `jwt/`
  - `timestamp/`
- `lib/`
  - `clipboard.ts`
  - `urlState.ts` (deep linking + open/close tool state)
  - `seo.ts` (helpers for per-tool metadata)
- `content/`
  - `privacy.md`
  - `imprint.md` (for DE/EU; simple template)
- `public/`
  - icons, og image placeholder
- `docs/`
  - `CONTRIBUTING.md`
  - `ARCHITECTURE.md`
  - `TOOL_GUIDE.md` (how to add a new tool)
  - `DEPLOYMENT.md`

## 6) Code conventions

- Tools must be defined in `tools/registry.ts` with:
  - `id` (kebab-case)
  - `name`
  - `description`
  - `category`
  - `keywords[]`
  - `component` (React component)
- Each tool component must:
  - be pure client-side (`'use client'`)
  - not import other tool components
  - provide `ToolResult` style output + error states
- Add a consistent UI layout across tools (same input/output components if possible).

## 7) Security & privacy requirements
- No user input is sent to any server.
- Add a small note in footer: “All tools run locally in your browser.”
- Prepare for ads:
  - Create privacy policy page
  - Cookie consent placeholder (feature flag)
- Avoid collecting PII.

## 8) GitHub actions (CI)
Add a workflow:
- install
- lint
- typecheck
- unit tests
- (optional) Playwright smoke tests

## 9) Deliverables from you (the AI Coding Agent)

### A) Create repo
- Create a new GitHub repo named: `dev-toolbox`
- Add MIT license
- Add README with:
  - what it does
  - how to run locally
  - how to add a tool
  - deployment notes

### B) Implement architecture + MVP
- Scaffold Next.js app with TypeScript + Tailwind
- Implement the core UX + 6 tools
- Add SEO basics (robots, sitemap, metadata)
- Add privacy/imprint pages
- Ensure it deploys cleanly on Vercel

### C) Create GitHub Issues
Create issues with labels, milestones, and checklists. See section 10.

---

## 10) GitHub Issues to create (with labels + milestones)

### Labels to create
- `type:feature`
- `type:chore`
- `type:docs`
- `type:bug`
- `priority:high`
- `priority:medium`
- `priority:low`
- `area:tools`
- `area:seo`
- `area:ui`
- `area:infra`
- `area:monetization`
- `good first issue`

### Milestones
- `MVP`
- `SEO & Growth`
- `Monetization Prep`
- `Tool Expansion`

### Issues (create all of these)

#### MVP
1. **Scaffold Next.js + Tailwind + TypeScript**
   - Labels: `type:chore`, `priority:high`, `area:infra`
   - Milestone: `MVP`
   - Checklist:
     - Next.js App Router initialized
     - Tailwind configured
     - ESLint + Prettier configured
     - Basic layout + global styles

2. **Implement Tool Registry + One-page Tool Grid**
   - Labels: `type:feature`, `priority:high`, `area:ui`
   - Milestone: `MVP`
   - Checklist:
     - `tools/registry.ts` created
     - Tool cards rendered from registry
     - Categories/tags displayed

3. **Search + Category Filter**
   - Labels: `type:feature`, `priority:high`, `area:ui`
   - Milestone: `MVP`
   - Checklist:
     - Search by name/description/keywords
     - Category filter dropdown / chips
     - Empty state

4. **Tool Display Pattern (Modal or Panel) + Deep Links**
   - Labels: `type:feature`, `priority:high`, `area:ui`
   - Milestone: `MVP`
   - Checklist:
     - Consistent tool container UI
     - URL param or hash opens tool
     - Back/forward browser navigation works
     - Accessible focus handling (if modal)

5. **Tool: JSON Formatter & Validator**
   - Labels: `type:feature`, `priority:high`, `area:tools`
   - Milestone: `MVP`
   - Checklist:
     - Format with indentation options
     - Validate + friendly error
     - Copy output

6. **Tool: Base64 Encode / Decode**
   - Labels: `type:feature`, `priority:high`, `area:tools`
   - Milestone: `MVP`

7. **Tool: URL Encode / Decode**
   - Labels: `type:feature`, `priority:high`, `area:tools`
   - Milestone: `MVP`

8. **Tool: Case Converter**
   - Labels: `type:feature`, `priority:high`, `area:tools`
   - Milestone: `MVP`

9. **Tool: JWT Decoder**
   - Labels: `type:feature`, `priority:medium`, `area:tools`
   - Milestone: `MVP`
   - Checklist:
     - Decode header/payload
     - Explain “no signature verification”

10. **Tool: Timestamp Converter**
   - Labels: `type:feature`, `priority:medium`, `area:tools`
   - Milestone: `MVP`

11. **Shared UI: Copy-to-Clipboard + Toast**
   - Labels: `type:feature`, `priority:medium`, `area:ui`
   - Milestone: `MVP`

12. **Add Footer: Local-only + Links**
   - Labels: `type:feature`, `priority:low`, `area:ui`
   - Milestone: `MVP`

#### SEO & Growth
13. **SEO: sitemap.ts + robots.ts + canonical**
   - Labels: `type:feature`, `priority:high`, `area:seo`
   - Milestone: `SEO & Growth`

14. **SEO: Per-tool metadata for deep links**
   - Labels: `type:feature`, `priority:medium`, `area:seo`
   - Milestone: `SEO & Growth`

15. **Add OG image + favicon set**
   - Labels: `type:chore`, `priority:low`, `area:seo`
   - Milestone: `SEO & Growth`

16. **Add lightweight structured data**
   - Labels: `type:feature`, `priority:low`, `area:seo`
   - Milestone: `SEO & Growth`

#### Monetization Prep
17. **Privacy Policy + Imprint pages**
   - Labels: `type:docs`, `priority:high`, `area:monetization`
   - Milestone: `Monetization Prep`

18. **Cookie Consent placeholder (feature-flagged)**
   - Labels: `type:feature`, `priority:medium`, `area:monetization`
   - Milestone: `Monetization Prep`

19. **Ad slots layout placeholders (no ads yet)**
   - Labels: `type:feature`, `priority:low`, `area:monetization`
   - Milestone: `Monetization Prep`

#### Infra / Quality
20. **CI: GitHub Actions (lint/typecheck/test)**
   - Labels: `type:chore`, `priority:medium`, `area:infra`
   - Milestone: `MVP`

21. **Docs: ARCHITECTURE + TOOL_GUIDE**
   - Labels: `type:docs`, `priority:medium`, `area:docs`
   - Milestone: `MVP`

22. **Add basic unit tests for utility functions**
   - Labels: `type:feature`, `priority:low`, `area:infra`, `good first issue`
   - Milestone: `MVP`

#### Tool Expansion (create as backlog)
23. **Add Tool: SHA256 / Hash Generator**
   - Labels: `type:feature`, `priority:low`, `area:tools`
   - Milestone: `Tool Expansion`

24. **Add Tool: UUID Generator**
   - Labels: `type:feature`, `priority:low`, `area:tools`
   - Milestone: `Tool Expansion`

25. **Add Tool: JSON <-> YAML Converter**
   - Labels: `type:feature`, `priority:low`, `area:tools`
   - Milestone: `Tool Expansion`

---

## 11) Issues to create: “Setup tasks the owner must do manually”
Create issues that describe what the repo owner must do outside of code.

26. **Owner Setup: Create Vercel project + link GitHub repo**
- Labels: `type:chore`, `priority:high`, `area:infra`
- Milestone: `MVP`
- Checklist:
  - Import repo in Vercel
  - Set framework preset to Next.js
  - Verify build & deploy
  - Add production domain later (optional)

27. **Owner Setup: Configure custom domain + HTTPS**
- Labels: `type:chore`, `priority:medium`, `area:infra`
- Milestone: `SEO & Growth`
- Checklist:
  - Buy or use existing domain
  - Add domain in Vercel
  - Verify DNS records
  - Ensure canonical points to custom domain

28. **Owner Setup: Register with Google Search Console**
- Labels: `type:chore`, `priority:medium`, `area:seo`
- Milestone: `SEO & Growth`
- Checklist:
  - Verify domain
  - Submit sitemap URL
  - Monitor indexing

29. **Owner Setup: Decide analytics approach**
- Labels: `type:chore`, `priority:low`, `area:seo`
- Milestone: `SEO & Growth`
- Checklist:
  - Choose Vercel Analytics or a privacy-friendly option
  - Ensure privacy policy matches

30. **Owner Setup: AdSense readiness checklist (later)**
- Labels: `type:chore`, `priority:low`, `area:monetization`
- Milestone: `Monetization Prep`
- Checklist:
  - Ensure Privacy Policy + Imprint are accurate for region
  - Ensure cookie consent is enabled if required
  - Apply for AdSense
  - Add AdSense script + verify ads.txt needs

---

## 12) README requirements (must include)
- Project description + screenshots placeholder
- Local dev:
  - `pnpm install`
  - `pnpm dev`
- Tool authoring guide:
  - add entry in `tools/registry.ts`
  - create folder in `tools/<id>/`
- Deployment:
  - Vercel steps
- Privacy note: “Runs locally in your browser”

## 13) Definition of Done (MVP)
- `pnpm lint`, `pnpm typecheck`, `pnpm test` succeed
- Deployed on Vercel successfully
- One-page collection works with deep links
- 6 tools implemented
- Privacy + imprint pages exist
- Sitemap + robots generated

---

## 14) Notes / choices you must make as the agent (do not ask unless blocked)
- Choose modal or panel UI (prefer modal for focus, or panel for simplicity)
- Use query param `?tool=` (recommended) for deep links
- Keep dependencies minimal

END.