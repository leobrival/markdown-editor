# Quickstart: Markdown Editor MVP

**Date**: 2025-10-31
**Feature**: [Markdown Editor](spec.md)

This quickstart provides setup instructions and basic usage scenarios for the Markdown Editor MVP.

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

## Setup Instructions

### 1. Initialize Project

```bash
# Create React app with TypeScript
npx create-react-app markdown-editor --template typescript

cd markdown-editor
```

### 2. Install Dependencies

```bash
# Install Shadcn UI
npm install -D shadcn-ui @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-popover

# Install markdown libraries
npm install marked remark remark-react remark-gfm

# Install GitHub markdown styling
npm install github-markdown-css

# Install syntax highlighting (optional but recommended)
npm install highlight.js

# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom @playwright/test
```

### 3. Configure Shadcn Components

```bash
# Initialize Shadcn UI in your project
npx shadcn-ui@latest init

# Add required components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add dropdown-menu
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

### Development

```bash
npm start
```

The editor will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Output will be in `build/` directory, ready for deployment.

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests with Playwright
npm run test:e2e
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

### Deploy to Vercel (Recommended for Next.js)

```bash
npm install -g vercel
vercel
```

### Deploy to GitHub Pages

```bash
npm run build
npm install -g gh-pages
```

### Deploy to Netlify

```bash
# Connect GitHub repo to Netlify
# Configure build command: npm run build
# Configure publish directory: build/
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
