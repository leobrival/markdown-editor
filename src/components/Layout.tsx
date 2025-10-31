import React, { useRef, useState, useCallback } from 'react'
import Editor from './Editor'
import Preview from './Preview'
import { Document, EditorState } from '../types'

interface LayoutProps {
  /** Current document content */
  document: Document
  /** Editor state including cursor position */
  editorState: EditorState
  /** Callback when content changes */
  onContentChange: (content: string) => void
  /** Callback when editor state changes */
  onEditorStateChange: (updates: Partial<EditorState>) => void
  /** Callback when filename changes */
  onFilenameChange: (filename: string) => void
  /** Preview update debounce interval (ms) */
  previewDebounce?: number
}

/**
 * Layout Component
 * Manages the split-view layout of Editor and Preview panes
 * Handles state synchronization and preview updating
 */
const Layout: React.FC<LayoutProps> = ({
  document,
  editorState,
  onContentChange,
  onEditorStateChange,
  onFilenameChange,
  previewDebounce = 500,
}) => {
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isPreviewUpdating, setIsPreviewUpdating] = useState(false)

  /**
   * Handle editor content change with debounced preview update
   */
  const handleContentChange = useCallback(
    (content: string) => {
      onContentChange(content)

      // Debounce preview update
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current)
      }

      setIsPreviewUpdating(true)
      previewTimeoutRef.current = setTimeout(() => {
        setIsPreviewUpdating(false)
      }, previewDebounce)
    },
    [onContentChange, previewDebounce]
  )

  /**
   * Handle cursor position changes
   */
  const handleCursorChange = useCallback(
    (position: number, selectionStart: number, selectionEnd: number) => {
      onEditorStateChange({
        cursorPosition: position,
        selectionStart,
        selectionEnd,
      })
    },
    [onEditorStateChange]
  )

  /**
   * Handle editor scroll
   */
  const handleEditorScroll = useCallback(() => {
    if (editorRef.current) {
      onEditorStateChange({
        scrollPositionEditor: editorRef.current.scrollTop,
      })
    }
  }, [onEditorStateChange])

  /**
   * Handle preview scroll
   */
  const handlePreviewScroll = useCallback(() => {
    if (previewRef.current) {
      onEditorStateChange({
        scrollPositionPreview: previewRef.current.scrollTop,
      })
    }
  }, [onEditorStateChange])

  /**
   * Restore scroll positions when they change
   */
  React.useEffect(() => {
    if (editorRef.current) {
      editorRef.current.scrollTop = editorState.scrollPositionEditor
    }
  }, [editorState.scrollPositionEditor])

  /**
   * Cleanup timeout on unmount
   */
  React.useEffect(() => {
    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Editor Pane */}
      <div className="flex flex-1 flex-col border-r border-gray-200 dark:border-gray-800">
        {/* Editor Header */}
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-800 dark:bg-gray-900">
          <input
            type="text"
            value={document.filename}
            onChange={(e) => onFilenameChange(e.target.value)}
            className="w-full border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="document.md"
            title="Edit filename"
          />
        </div>

        {/* Editor Container */}
        <div
          className="flex-1 overflow-hidden"
          onScroll={handleEditorScroll}
          role="region"
          aria-label="Editor input"
        >
          <Editor
            ref={editorRef}
            value={document.content}
            onChange={handleContentChange}
            onCursorChange={handleCursorChange}
            placeholder="Enter your markdown here..."
            autoFocus={true}
          />
        </div>

        {/* Editor Status Bar */}
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-1 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          <span>{document.content.length} characters</span>
          <span className="ml-4">
            {document.content.split(/\s+/).filter((w) => w.length > 0).length} words
          </span>
        </div>
      </div>

      {/* Preview Pane */}
      <div className="flex flex-1 flex-col">
        {/* Preview Header */}
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 dark:text-white">Preview</h3>
            {isPreviewUpdating && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Updating...
              </span>
            )}
          </div>
        </div>

        {/* Preview Container */}
        <div
          ref={previewRef}
          className="flex-1 overflow-y-auto"
          onScroll={handlePreviewScroll}
          role="region"
          aria-label="Markdown preview output"
        >
          <Preview content={document.content} />
        </div>
      </div>
    </div>
  )
}

export default Layout
