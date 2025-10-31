import { useState, useEffect } from 'react'
import './App.css'
import './styles/globals.css'
import './styles/markdown-preview.css'
import { Document, EditorState } from './types'
import { loadFromLocalStorage, saveToLocalStorage } from './lib/file'
import Layout from './components/Layout'
import FileOperations from './components/FileOperations'

/**
 * Main Application Component
 * Root component that manages application state and layout
 * Sets up the foundation for all user stories
 */
function App() {
  // Document state
  const [document, setDocument] = useState<Document>(() => {
    // Try to load from localStorage on initialization
    const saved = loadFromLocalStorage('markdown-editor-document')
    if (saved) {
      try {
        return JSON.parse(saved) as Document
      } catch {
        // Fallback if parsing fails
      }
    }
    // Default empty document
    return {
      content: '',
      filename: 'document.md',
      createdAt: new Date(),
      modifiedAt: new Date(),
      isDirty: false,
    }
  })

  // Editor state
  const [editorState, setEditorState] = useState<EditorState>({
    documentId: 'main',
    cursorPosition: 0,
    selectionStart: -1,
    selectionEnd: -1,
    scrollPositionEditor: 0,
    scrollPositionPreview: 0,
    lastUpdateTime: new Date(),
  })

  // Auto-save to localStorage whenever document changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (document.isDirty) {
        const documentWithTime = {
          ...document,
          modifiedAt: new Date(),
          isDirty: false,
        }
        saveToLocalStorage('markdown-editor-document', JSON.stringify(documentWithTime))
        setDocument(documentWithTime)
      }
    }, 1000) // Auto-save after 1 second of inactivity

    return () => clearTimeout(timer)
  }, [document])

  /**
   * Handle document content change
   */
  const handleContentChange = (newContent: string) => {
    setDocument((prev) => ({
      ...prev,
      content: newContent,
      isDirty: true,
    }))

    setEditorState((prev) => ({
      ...prev,
      lastUpdateTime: new Date(),
    }))
  }

  /**
   * Handle filename change
   */
  const handleFilenameChange = (newFilename: string) => {
    setDocument((prev) => ({
      ...prev,
      filename: newFilename,
      isDirty: true,
    }))
  }

  /**
   * Handle editor state change
   */
  const handleEditorStateChange = (updates: Partial<EditorState>) => {
    setEditorState((prev) => ({
      ...prev,
      ...updates,
      lastUpdateTime: new Date(),
    }))
  }

  /**
   * Reset document to empty state
   */
  const handleClearDocument = () => {
    if (window.confirm('Are you sure you want to clear the document?')) {
      const clearedDocument: Document = {
        content: '',
        filename: 'document.md',
        createdAt: new Date(),
        modifiedAt: new Date(),
        isDirty: false,
      }
      setDocument(clearedDocument)
      saveToLocalStorage('markdown-editor-document', JSON.stringify(clearedDocument))
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fafbfc] dark:bg-[#0d1117]">
      {/* Vercel-style Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-[#010409]/80">
        <div className="px-6 py-3 sm:px-8">
          {/* Title Section */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                Markdown Editor
              </h1>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                Write, preview & export markdown with Mermaid diagrams
              </p>
            </div>
            <div className="flex items-center gap-3">
              {document.isDirty && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-400/10 dark:text-amber-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                  Unsaved
                </span>
              )}
            </div>
          </div>

          {/* File Operations */}
          <div className="mt-4 flex items-center gap-2">
            <FileOperations
              content={document.content}
              filename={document.filename}
              onFileLoaded={(content, filename) => {
                setDocument({
                  content,
                  filename,
                  createdAt: new Date(),
                  modifiedAt: new Date(),
                  isDirty: false,
                })
              }}
              onClear={handleClearDocument}
            />
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Toolbar area (placeholder for User Story 2) */}
        <div
          className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
          role="toolbar"
          aria-label="Text formatting toolbar"
        >
          {/* Toolbar components will be rendered here in Phase 4 */}
          <div className="hidden px-4 py-2 sm:px-6 lg:px-8" id="toolbar-area" />
        </div>

        {/* Editor and Preview split view area - User Story 1 MVP */}
        <Layout
          document={document}
          editorState={editorState}
          onContentChange={handleContentChange}
          onEditorStateChange={handleEditorStateChange}
          onFilenameChange={handleFilenameChange}
          previewDebounce={500}
        />
      </main>

      {/* Footer / Status bar (optional for future enhancements) */}
      <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 sm:px-6 lg:px-8">
          <span id="status-bar">Ready</span>
        </div>
      </footer>

      {/* Hidden container for exported state (for debugging) */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__APP_STATE__ = ${JSON.stringify({
            documentContent: document.content.length,
            isDirty: document.isDirty,
            lastUpdate: editorState.lastUpdateTime,
          })}`,
        }}
      />
    </div>
  )
}

export default App
