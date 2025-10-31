# Quickstart: Markdown Editor MVP

**Date**: 2025-10-31
**Feature**: [Markdown Editor](spec.md)

This quickstart provides setup instructions and basic usage scenarios for the Markdown Editor MVP.

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Git and GitHub account (for deployment to GitHub Pages)

## Setup Instructions

### 1. Initialize Vite Project with React + TypeScript

```bash
# Create Vite project with React and TypeScript
npm create vite@latest markdown-editor -- --template react-ts

cd markdown-editor
```

### 2. Install Vite Dependencies

```bash
# Install dependencies
npm install

# Install development dependencies for building
npm install -D @vitejs/plugin-react
```

### 3. Configure Vite for GitHub Pages Deployment

Edit `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // For GitHub Pages deployment, set base to your repository name
  // If deploying to https://github.com/username/markdown-editor
  // set base to '/markdown-editor/'
  // For project sites (not user/org pages)
  base: process.env.GITHUB_PAGES ? '/markdown-editor/' : '/',
})
```

### 4. Install and Configure Shadcn/ui with Vite

```bash
# Install Shadcn UI CLI
npx shadcn-ui@latest init -d

# Follow the prompts:
# - Would you like to use TypeScript? Yes
# - Which style would you prefer? Default
# - Which color would you prefer as the base color? Slate
# - Where is your global CSS file? src/index.css
# - Would you like us to create a components/ui folder? Yes
# - Would you like to use CSS variables for colors? Yes

# Add required Shadcn components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add dropdown-menu
```

### 5. Install Project Dependencies

```bash
# Install markdown libraries
npm install remark remark-react remark-gfm marked markdown-it

# Install GitHub markdown styling
npm install github-markdown-css

# Install syntax highlighting
npm install highlight.js

# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom @playwright/test

# Install router for SPA navigation
npm install react-router-dom
```

### 4. Project Structure

Create the following directory structure:

```
src/
├── components/
│   ├── Editor.tsx
│   ├── Preview.tsx
│   ├── Toolbar.tsx
│   ├── FileOperations.tsx
│   ├── Layout.tsx
│   └── common/
├── lib/
│   ├── markdown.ts
│   ├── format.ts
│   ├── file.ts
│   └── styles.ts
├── types/
│   └── index.ts
├── styles/
│   ├── globals.css
│   └── markdown-preview.css
├── App.tsx
└── index.tsx
```

## Running the Application

### Development with Vite

```bash
npm run dev
```

The editor will be available at `http://localhost:5173` (default Vite port)

### Build for Production

```bash
npm run build
```

Output will be in `dist/` directory, optimized and minified for production.

### Preview Production Build Locally

```bash
npm run preview
```

Preview the production build locally at `http://localhost:4173`

### Run Tests

```bash
# Unit tests with Vitest
npm run test

# E2E tests with Playwright
npm run test:e2e
```

### Configure Package.json Scripts

Make sure your `package.json` has these scripts configured:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:e2e": "playwright test"
  }
}
```

## Basic Usage Scenarios

### Scenario 1: Write and Preview Markdown

**User Goal**: Write a markdown document and see real-time preview

**Steps**:
1. Open the application
2. Type in the editor panel (left side):
   ```markdown
   # Welcome to Markdown Editor

   This is a **bold** text and this is *italic*.

   ## Features

   - Real-time preview
   - GitHub-style rendering
   - Download/upload support
   ```
3. View the rendered output in the preview panel (right side)
4. See GitHub-style formatting with proper typography

**Expected Result**:
- Preview updates within 500ms of typing
- All markdown syntax renders correctly
- Styling matches GitHub's default markdown appearance

### Scenario 2: Format Text Using Toolbar

**User Goal**: Use formatting buttons instead of typing markdown syntax

**Steps**:
1. Select text in the editor: "This is bold"
2. Click the **Bold** button in the toolbar
3. The text now appears as: `**This is bold**`
4. Preview shows the text as bold

**Expected Result**:
- Selected text is wrapped with appropriate markdown syntax
- Preview updates automatically
- Text appears formatted in preview

### Scenario 3: Create Headers

**User Goal**: Insert headers at different levels

**Steps**:
1. Click at the beginning of a line
2. Click the "Header" button in toolbar
3. Select desired level (H1, H2, H3, etc.)
4. Type header text

**Expected Result**:
- `# ` is inserted at line start
- Preview shows proper heading styling
- Different header levels render with appropriate sizes

### Scenario 4: Create Unordered List

**User Goal**: Create a bulleted list

**Steps**:
1. Click at the beginning of a new line
2. Click the "Bullet List" button
3. Type first item: "Item 1"
4. Press Enter and type "Item 2"
5. The toolbar auto-inserts `- ` for new lines

**Expected Result**:
- `- ` is inserted for each line
- Preview shows proper bullet list styling
- List items are indented appropriately

### Scenario 5: Create Code Block

**User Goal**: Include code with syntax highlighting

**Steps**:
1. Select multiple lines of code
2. Click the "Code Block" button
3. The text is wrapped with triple backticks: ` ```code``` `
4. You can optionally add language identifier: ` ```javascript ```

**Expected Result**:
- Code is rendered in monospace font
- Syntax highlighting applied (if language specified)
- Proper indentation preserved
- Background color differentiates code from regular text

### Scenario 6: Create Table

**User Goal**: Insert a markdown table

**Steps**:
1. Click the "Table" button in toolbar
2. A basic table template is inserted:
   ```
   | Header 1 | Header 2 |
   |----------|----------|
   | Cell 1   | Cell 2   |
   ```
3. Edit cells as needed
4. Preview shows formatted table

**Expected Result**:
- Table renders with proper borders
- Headers are bold
- Cells are properly aligned

### Scenario 7: Create Links

**User Goal**: Insert a hyperlink

**Steps**:
1. Select link text: "Click here"
2. Click the "Link" button
3. A prompt appears asking for URL
4. Enter: `https://github.com`
5. Result: `[Click here](https://github.com)`

**Expected Result**:
- Link text is formatted in blue and underlined
- Hovering shows the URL
- Link is clickable in preview

### Scenario 8: Add Checkboxes/Tasks

**User Goal**: Create a task list

**Steps**:
1. Click the "Checkbox" button
2. Type task: `Buy groceries`
3. Markdown created: `- [ ] Buy groceries`
4. Click checkbox in preview to toggle (if supported)

**Expected Result**:
- Unchecked boxes display as `☐`
- Checked boxes display as `☑`
- Preview shows proper task list styling
- Matches GitHub's task list appearance

### Scenario 9: Download Markdown

**User Goal**: Save work to computer

**Steps**:
1. Write markdown content in editor
2. Click "Download" button
3. A browser file save dialog appears
4. Default filename is "document.md" (editable)
5. Choose save location and confirm

**Expected Result**:
- File is downloaded with .md extension
- File contains all editor content
- File can be opened in any text editor

### Scenario 10: Upload Markdown

**User Goal**: Load a previously saved file

**Steps**:
1. Click "Upload" button
2. File dialog appears
3. Select a .md file from computer
4. Click "Open"

**Expected Result**:
- Editor content is replaced with file content
- Preview updates to show new content
- Filename is displayed (if available)
- No data loss (previous content is replaced)

## Configuration

### Markdown Rendering Options

Edit `src/lib/markdown.ts` to customize:

```typescript
// Use GitHub Flavored Markdown
import { marked } from 'marked';
import { gfmHeadingId } from "marked-gfm-heading-id";

marked.use(gfmHeadingId());

// Add syntax highlighting
import hljs from 'highlight.js';

marked.setOptions({
  highlight: (code, lang) => {
    if (hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  }
});
```

### Styling Customization

Edit `src/styles/markdown-preview.css`:

```css
/* Customize GitHub markdown appearance */
.markdown-body {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3 {
  /* Your custom header styles */
  margin-top: 24px;
  margin-bottom: 16px;
}
```

## Troubleshooting

### Preview not updating

- Check that onChange callback is properly connected
- Verify markdown library is imported correctly
- Check browser console for errors

### Formatting buttons not working

- Ensure editor getSelectedText() method is implemented
- Check that onFormat callback is properly passed
- Verify Shadcn button components are installed

### File upload not working

- Check browser console for File API errors
- Verify file type is .md or text/plain
- Check localStorage permissions (if using session storage)

### GitHub styling not applied

- Verify github-markdown-css is imported in styles
- Check that .markdown-body class is applied to preview div
- Clear browser cache and reload

## Performance Tips

1. **Large Documents**: For documents > 500KB, consider:
   - Implementing lazy rendering (virtualized scrolling)
   - Debouncing preview updates
   - Using Web Workers for markdown processing

2. **Smooth Scrolling**:
   - Use CSS transform for scrolling (GPU-accelerated)
   - Enable smooth scroll behavior

3. **Memory Management**:
   - Limit undo/redo history size
   - Clean up event listeners on unmount
   - Use React.memo for Preview component

## Deployment

### Deploy to GitHub Pages (Recommended)

This project is configured to deploy to GitHub Pages for easy hosting directly from your GitHub repository.

#### Option 1: Manual Deployment with gh-pages

```bash
# Install gh-pages deployment tool
npm install -D gh-pages

# Build the project
npm run build

# Deploy to GitHub Pages (creates/updates gh-pages branch)
npx gh-pages -d dist
```

#### Option 2: Automated Deployment with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

#### Configure GitHub Pages Settings

1. Go to your repository Settings
2. Navigate to "Pages" (left sidebar)
3. Under "Build and deployment":
   - Select "Deploy from a branch" OR "GitHub Actions"
   - If using gh-pages: Select `gh-pages` branch and `/ (root)` folder
   - If using GitHub Actions: Workflow will handle it automatically
4. Click "Save"

#### Access Your Deployed Site

Your application will be available at:
- `https://username.github.io/markdown-editor/` (if deploying to project repository)
- `https://username.github.io/` (if deploying to user/org repository named `username.github.io`)

Update `vite.config.ts` `base` option accordingly:

```typescript
// For project site
base: '/markdown-editor/',

// For user/org site
base: '/',
```

### Alternative Deployments

#### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### Deploy to Netlify

```bash
# Connect GitHub repo to Netlify
# Configure build command: npm run build
# Configure publish directory: dist/
```

## Next Steps

After implementing the MVP:

1. **Add undo/redo functionality** for better UX
2. **Implement auto-save** to localStorage
3. **Add markdown table of contents** generation
4. **Support keyboard shortcuts** for formatting
5. **Add dark mode** toggle
6. **Implement collaborative editing** (if needed)
7. **Add export to PDF/HTML** formats
