/**
 * Markdown Editor Type Definitions
 * All TypeScript interfaces and types for the application
 */

/**
 * Document
 * Represents the markdown file being edited
 */
export interface Document {
  /** Raw markdown text content (max 1MB) */
  content: string
  /** Name of the document (e.g., "my-note.md") */
  filename: string
  /** Timestamp when document was created */
  createdAt: Date
  /** Timestamp when document was last modified */
  modifiedAt: Date
  /** Whether document has unsaved changes */
  isDirty: boolean
}

/**
 * EditorState
 * Represents the current state of the editor UI and user interaction
 */
export interface EditorState {
  /** Reference to Document being edited */
  documentId: string
  /** Current cursor position in the text (character index) */
  cursorPosition: number
  /** Start of text selection (character index, or -1 if no selection) */
  selectionStart: number
  /** End of text selection (character index, or -1 if no selection) */
  selectionEnd: number
  /** Vertical scroll position in editor pane (pixels) */
  scrollPositionEditor: number
  /** Vertical scroll position in preview pane (pixels) */
  scrollPositionPreview: number
  /** Timestamp of last content update */
  lastUpdateTime: Date
}

/**
 * FormattingAction
 * Represents a toolbar action that formats selected text
 */
export interface FormattingAction {
  /** Unique identifier (e.g., "bold", "italic", "header-1") */
  id: string
  /** Human-readable button label (e.g., "Bold") */
  label: string
  /** Icon identifier for Shadcn button */
  icon: string
  /** Pattern to apply (e.g., "**" for bold) */
  markdownPattern: string
  /** Whether pattern wraps selection or prefixes */
  wrapsSelection: boolean
  /** Whether action requires selected text */
  requiresSelection: boolean
  /** Text to insert if no selection (e.g., "# " for header) */
  insertOnEmpty: string
}

/**
 * MarkdownPreview
 * Represents the rendered HTML output of markdown content
 */
export interface MarkdownPreview {
  /** Original markdown content (hash/reference) */
  sourceContent: string
  /** Rendered HTML output */
  htmlOutput: string
  /** When this preview was generated */
  renderedAt: Date
  /** Time taken to render in milliseconds */
  renderTime: number
}

/**
 * EditorConfig
 * Configuration for the editor application
 */
export interface EditorConfig {
  /** Whether to auto-save to localStorage */
  autoSave: boolean
  /** Auto-save interval in milliseconds */
  autoSaveInterval: number
  /** Maximum undo/redo history size */
  maxHistorySize: number
  /** Preview update debounce in milliseconds */
  previewDebounce: number
  /** Maximum document size in bytes (default 1MB) */
  maxDocumentSize: number
}

/**
 * FileOperationResult
 * Result of file operations (download/upload)
 */
export interface FileOperationResult {
  /** Whether operation was successful */
  success: boolean
  /** Error message if failed */
  error?: string
  /** File content if operation was download/upload */
  content?: string
  /** Filename if available */
  filename?: string
}
