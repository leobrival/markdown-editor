# Data Model: Markdown Editor MVP

**Date**: 2025-10-31
**Feature**: [Markdown Editor](spec.md)

## Entities

### Document

Represents the markdown content being edited and its metadata.

**Fields**:
- `content: string` - The raw markdown text (max 1MB)
- `filename: string` - Name of the document (e.g., "my-note.md")
- `createdAt: Date` - Timestamp when document was created
- `modifiedAt: Date` - Timestamp when document was last modified
- `isDirty: boolean` - Whether document has unsaved changes

**Validation Rules**:
- `content` must be valid UTF-8 text
- `content` length must not exceed 1MB (1,048,576 bytes)
- `filename` must not be empty and should end with .md extension
- Dates must be valid ISO 8601 timestamps

**Relationships**:
- One Document can be edited in one EditorState at a time

### EditorState

Represents the current state of the editor UI and user interaction.

**Fields**:
- `documentId: string` - Reference to Document being edited
- `cursorPosition: number` - Current cursor position in the text (character index)
- `selectionStart: number` - Start of text selection (character index, or -1 if no selection)
- `selectionEnd: number` - End of text selection (character index, or -1 if no selection)
- `scrollPositionEditor: number` - Vertical scroll position in editor pane (pixels)
- `scrollPositionPreview: number` - Vertical scroll position in preview pane (pixels)
- `lastUpdateTime: Date` - Timestamp of last content update

**Validation Rules**:
- `cursorPosition` must be between 0 and length of document content
- `selectionStart` must be less than or equal to `selectionEnd`
- Both positions must be within valid document bounds or -1 if no selection
- Scroll positions must be non-negative numbers

**Relationships**:
- EditorState references exactly one Document
- EditorState is transient (stored in memory only, not persisted)

### FormattingAction

Represents a toolbar action that formats selected text.

**Fields**:
- `id: string` - Unique identifier (e.g., "bold", "italic", "header-1")
- `label: string` - Human-readable button label (e.g., "Bold")
- `icon: string` - Icon identifier for Shadcn button
- `markdownPattern: string` - Pattern to apply (e.g., "**" for bold)
- `wrapsSelection: boolean` - Whether pattern wraps selection or prefixes
- `requiresSelection: boolean` - Whether action requires selected text
- `insertOnEmpty: string` - Text to insert if no selection (e.g., "# " for header)

**Validation Rules**:
- `id` must be unique and only contain alphanumeric and hyphens
- `label` and `icon` must not be empty
- `markdownPattern` must not be empty

**Relationships**:
- Multiple FormattingActions available in Toolbar
- FormattingAction applies to EditorState

### MarkdownPreview

Represents the rendered HTML output of markdown content.

**Fields**:
- `sourceContent: string` - Original markdown content (hash/reference)
- `htmlOutput: string` - Rendered HTML
- `renderedAt: Date` - When this preview was generated
- `renderTime: number` - Time taken to render in milliseconds

**Validation Rules**:
- `htmlOutput` must be valid HTML
- `renderTime` must be a non-negative number
- Must match current document content (cache validation)

**Relationships**:
- Generated from Document.content
- Displayed in Preview component
- Invalidated when Document.content changes

## State Transitions

### Document Lifecycle

```
[New Document]
    ↓
[Editing] ←→ [Saving]
    ↓
[Saved]
    ↓
[Loaded from File]
    ↓
[Editing]
```

### Editor State Flow

```
User Types → [Update EditorState.cursorPosition]
           → [Update Document.content]
           → [Mark Document.isDirty = true]
           → [Invalidate MarkdownPreview cache]
           → [Re-render Preview component]
           ↓
User Selects Text → [Update EditorState.selectionStart/End]
           ↓
User Clicks Toolbar → [Apply FormattingAction]
                   → [Update Document.content with markdown]
                   → [Mark Document.isDirty = true]
                   → [Invalidate MarkdownPreview cache]
                   → [Re-render Preview]
           ↓
User Downloads → [Export Document as file]
              → [Document.isDirty remains true]
           ↓
User Uploads → [Load new Document]
            → [Update EditorState]
            → [Document.isDirty = false]
            → [Update MarkdownPreview]
```

## Constraints & Rules

- **Single Document**: Only one document can be edited at a time in the current session
- **No Persistence**: Content only exists in browser memory during session (not persisted between sessions without explicit save)
- **Real-time Sync**: EditorState and MarkdownPreview must stay synchronized with Document.content
- **Performance**: MarkdownPreview cache invalidation and re-rendering must complete within 500ms for smooth UX
- **Storage Limit**: Document.content cannot exceed 1MB in size
- **Character Encoding**: All text must be valid UTF-8

## Type Definitions (TypeScript)

```typescript
interface Document {
  content: string;           // Raw markdown (max 1MB)
  filename: string;          // Document name
  createdAt: Date;
  modifiedAt: Date;
  isDirty: boolean;
}

interface EditorState {
  documentId: string;
  cursorPosition: number;    // 0 to content.length
  selectionStart: number;    // -1 if no selection
  selectionEnd: number;      // -1 if no selection
  scrollPositionEditor: number;
  scrollPositionPreview: number;
  lastUpdateTime: Date;
}

interface FormattingAction {
  id: string;
  label: string;
  icon: string;
  markdownPattern: string;
  wrapsSelection: boolean;
  requiresSelection: boolean;
  insertOnEmpty: string;
}

interface MarkdownPreview {
  sourceContent: string;
  htmlOutput: string;
  renderedAt: Date;
  renderTime: number;
}
```
