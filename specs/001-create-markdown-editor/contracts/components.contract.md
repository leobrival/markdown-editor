# Component Contracts: Markdown Editor MVP

**Date**: 2025-10-31
**Feature**: [Markdown Editor](../spec.md)

Component contracts define the interface and behavior for each major UI component.

## Editor Component

**Purpose**: Text input area for markdown content

**Props**:
```typescript
interface EditorProps {
  value: string;                           // Current markdown content
  onChange: (content: string) => void;     // Called when user types
  onCursorChange: (pos: number) => void;   // Called when cursor moves
  onSelect: (start: number, end: number) => void; // Called on text selection
  placeholder?: string;                    // Placeholder text
  readOnly?: boolean;                      // If true, content cannot be edited
  maxLength?: number;                      // Max characters (1MB default)
}
```

**Behavior**:
- Renders as a textarea or contenteditable div with monospace font
- Updates value on user input with onChange callback
- Tracks cursor position with onCursorChange
- Provides getSelectedText() method to toolbar
- Supports standard keyboard shortcuts (Ctrl/Cmd+Z for undo, etc.)
- Scrolls content as user types

**HTML Structure**:
```html
<div class="editor-container">
  <textarea
    class="editor-input"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
  />
</div>
```

---

## Preview Component

**Purpose**: Renders markdown content as HTML

**Props**:
```typescript
interface PreviewProps {
  markdown: string;         // Markdown content to render
  className?: string;       // Additional CSS classes
  loading?: boolean;        // Show loading state during render
}
```

**Behavior**:
- Converts markdown to HTML using markdown library
- Applies GitHub CSS styling for HTML output
- Renders code blocks with syntax highlighting
- Sanitizes HTML for security
- Provides smooth scroll-sync with editor (optional)
- Re-renders when markdown prop changes
- Caches previous render result for performance

**HTML Structure**:
```html
<div class="preview-container">
  <div class="markdown-body">
    {/* Rendered HTML from markdown */}
  </div>
</div>
```

---

## Toolbar Component

**Purpose**: Provides formatting buttons for markdown syntax

**Props**:
```typescript
interface ToolbarProps {
  onFormat: (action: FormattingAction, selectedText: string) => void;
  disabled?: boolean;                     // Disable all buttons if true
  actions?: FormattingAction[];           // Custom formatting actions
}
```

**Behavior**:
- Displays row of formatting buttons (Built with Shadcn Button components)
- Each button represents a markdown formatting action
- Passes selected text from editor to onFormat callback
- Shows tooltip on button hover
- Button styling follows Shadcn design patterns
- Groups related buttons (e.g., headers) visually

**Default Actions**:
- Bold (**text**)
- Italic (*text*)
- Header (# Text)
- Bullet List (- Item)
- Link ([text](url))
- Code Block (```code```)
- Table (| Col1 | Col2 |)
- Checkbox (- [ ] Task)

**HTML Structure**:
```html
<div class="toolbar-container">
  <div class="toolbar-group">
    <Button icon="bold" onClick={() => onFormat(boldAction)} />
    <Button icon="italic" onClick={() => onFormat(italicAction)} />
    {/* More buttons */}
  </div>
</div>
```

---

## FileOperations Component

**Purpose**: Handle file download and upload

**Props**:
```typescript
interface FileOperationsProps {
  content: string;                          // Content to download
  filename: string;                         // Default filename for download
  onFileLoaded: (content: string, filename: string) => void; // Called after upload
  onError?: (error: string) => void;        // Error handling
}
```

**Behavior**:
- Provides "Download" button that saves markdown as .md file
- Provides "Upload" button that allows selecting file
- Validates file format (must be text/plain or .md)
- Reads file content using File API
- Shows error message if upload fails
- Uses browser's native download mechanism

**HTML Structure**:
```html
<div class="file-operations-container">
  <Button onClick={downloadFile}>Download</Button>
  <input
    type="file"
    accept=".md,text/plain"
    onChange={handleFileUpload}
    hidden
  />
  <Button onClick={uploadFile}>Upload</Button>
</div>
```

---

## Layout Component

**Purpose**: Main split-view layout (Editor + Preview)

**Props**:
```typescript
interface LayoutProps {
  children: React.ReactNode[];  // Editor and Preview components
  splitRatio?: number;          // Width ratio (0.5 = 50/50)
  resizable?: boolean;          // Allow user to resize panels
}
```

**Behavior**:
- Displays editor and preview side-by-side
- Responsive on mobile (stack vertically)
- Optional resizable divider between panels
- Maintains scroll position on resize
- Uses CSS Grid or Flexbox for layout

**HTML Structure**:
```html
<div class="layout-container">
  <div class="editor-panel">
    {/* Editor component */}
  </div>
  <div class="resizable-divider" />
  <div class="preview-panel">
    {/* Preview component */}
  </div>
</div>
```

---

## Component Integration Flow

```
App
├── Layout
│   ├── Editor
│   │   └── Toolbar
│   │       └── onFormat() → updateMarkdownContent()
│   └── Preview
│       └── renders: htmlFromMarkdown(editorContent)
└── FileOperations
    ├── Download → exportAsMarkdownFile(content)
    └── Upload → importFromMarkdownFile() → updateEditor()
```

## Styling Approach

- **Tailwind CSS**: Base utility classes for spacing, sizing, layout
- **Shadcn Components**: Pre-built styled buttons, inputs, etc.
- **GitHub Markdown CSS**: Layered on preview pane for accurate rendering
- **CSS Modules**: Component-specific styles (optional for complex components)

## Performance Considerations

- **Editor**: Debounce onChange callback (100ms) to avoid excessive re-renders
- **Preview**: Memoize rendered HTML, only re-render when markdown changes
- **Toolbar**: Buttons are small, no performance concern
- **Layout**: Use CSS Grid for layout (GPU-accelerated), not JavaScript positioning
