# Markdown Editor MVP - Setup Guide

This guide will help you complete the setup of the Vite + React + TypeScript + Shadcn/ui project.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git (already configured)

## Installation Steps

### Step 1: Install Dependencies

```bash
npm install --legacy-peer-deps
```

**Note**: `--legacy-peer-deps` is needed because of Tailwind CSS and Radix UI dependencies.

### Step 2: Initialize Shadcn/ui

Shadcn/ui requires interactive configuration. Run this command and follow the prompts:

```bash
npx shadcn-ui@latest init -d
```

**When prompted, use these settings:**
- "Would you like to use TypeScript?" → **Yes**
- "Which style would you prefer?" → **Default**
- "Which color would you prefer as the base color?" → **Slate**
- "Where is your global CSS file?" → `src/index.css`
- "Would you like us to create a components/ui folder?" → **Yes**
- "Would you like to use CSS variables for colors?" → **Yes**

### Step 3: Add Shadcn/ui Components

After initialization, add the required components:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add dropdown-menu
```

### Step 4: Start Development Server

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run tests
npm run test

# Run e2e tests
npm run test:e2e
```

## GitHub Pages Deployment

### Option 1: Manual Deployment with gh-pages

```bash
# Install gh-pages globally or locally
npm install -D gh-pages

# Build the project
npm run build

# Deploy to GitHub Pages
npx gh-pages -d dist
```

### Option 2: Automated Deployment with GitHub Actions

The workflow file is already configured at `.github/workflows/deploy.yml`.

**To enable GitHub Pages deployment:**

1. Go to your repository Settings
2. Navigate to "Pages" (left sidebar)
3. Under "Build and deployment":
   - Select **GitHub Actions**
4. Click Save

The workflow will automatically deploy on every push to `main` or `master` branches.

### Verify Deployment

After deployment, your site will be available at:
- `https://username.github.io/markdown-editor/` (for project repositories)
- `https://username.github.io/` (for user/org repositories named `username.github.io`)

## Project Structure

```
markdown-editor/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Shadcn/ui components (auto-generated)
│   │   ├── Editor.tsx
│   │   ├── Preview.tsx
│   │   └── ...
│   ├── lib/                 # Utility functions
│   │   ├── markdown.ts
│   │   ├── format.ts
│   │   └── file.ts
│   ├── types/               # TypeScript interfaces
│   │   └── index.ts
│   ├── styles/              # CSS files
│   │   ├── globals.css
│   │   └── markdown-preview.css
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles with Tailwind
├── tests/
│   ├── unit/                # Unit tests
│   ├── integration/         # Integration tests
│   └── e2e/                 # E2E tests
├── public/                  # Static assets
├── .github/workflows/       # GitHub Actions workflows
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── package.json             # Dependencies and scripts
└── index.html               # HTML template
```

## Troubleshooting

### Dependencies Installation Issues

If you encounter issues with `npm install`:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock files
rm -rf node_modules package-lock.json

# Reinstall with legacy peer deps
npm install --legacy-peer-deps
```

### Shadcn/ui CLI Issues

If `shadcn-ui@latest init` fails:

```bash
# Try with specific version
npx shadcn-ui@0.0.4 init -d
```

### Vite Port Already in Use

If port 5173 is already in use, specify a different port:

```bash
npm run dev -- --port 3000
```

### GitHub Pages Deployment Issues

Check that:
1. `vite.config.ts` has correct `base` setting
2. `.github/workflows/deploy.yml` is in correct location
3. GitHub Pages settings point to GitHub Actions
4. Repository is public (for free tier)

## Next Steps

1. **Complete the implementation** by following the task list in `specs/001-create-markdown-editor/tasks.md`
2. **Start with Phase 2** (Foundational) to implement core utilities
3. **Move to Phase 3** (User Story 1 MVP) to build the editor component
4. **Test deployment** to ensure GitHub Pages is working

## Documentation

For detailed information about the project:
- See `specs/001-create-markdown-editor/spec.md` for feature specification
- See `specs/001-create-markdown-editor/plan.md` for implementation plan
- See `specs/001-create-markdown-editor/quickstart.md` for usage scenarios
- See `specs/001-create-markdown-editor/tasks.md` for task breakdown

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
