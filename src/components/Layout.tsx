import React, { useRef, useState, useCallback } from 'react'
import Editor from './Editor'
import Preview from './Preview'
import Toolbar from './Toolbar'
import { Document, EditorState, FormattingAction } from '../types'
import {
  formatBold,
  formatItalic,
  formatStrikethrough,
  formatInlineCode,
  formatHeading,
  formatBulletList,
  formatOrderedList,
  formatTaskList,
  formatBlockquote,
  formatCodeBlock,
  formatLink,
  formatImage,
  insertTable,
  insertHorizontalRule,
} from '../lib/format'

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
   * Handle formatting action from toolbar
   */
  const handleFormatting = (
    action: FormattingAction,
    textContent: string,
    selectionStart: number,
    selectionEnd: number
  ) => {
    let result

    // Apply the appropriate formatting function based on action ID
    switch (action.id) {
      case 'bold':
        result = formatBold(textContent, selectionStart, selectionEnd)
        break
      case 'italic':
        result = formatItalic(textContent, selectionStart, selectionEnd)
        break
      case 'strikethrough':
        result = formatStrikethrough(textContent, selectionStart, selectionEnd)
        break
      case 'code':
        result = formatInlineCode(textContent, selectionStart, selectionEnd)
        break
      case 'heading1':
        result = formatHeading(textContent, selectionStart, 1)
        break
      case 'heading2':
        result = formatHeading(textContent, selectionStart, 2)
        break
      case 'heading3':
        result = formatHeading(textContent, selectionStart, 3)
        break
      case 'bulletList':
        result = formatBulletList(textContent, selectionStart)
        break
      case 'orderedList':
        result = formatOrderedList(textContent, selectionStart)
        break
      case 'taskList':
        result = formatTaskList(textContent, selectionStart)
        break
      case 'blockquote':
        result = formatBlockquote(textContent, selectionStart)
        break
      case 'codeBlock':
        result = formatCodeBlock(textContent, selectionStart)
        break
      case 'link':
        result = formatLink(textContent, selectionStart, selectionEnd)
        break
      case 'image':
        result = formatImage(textContent, selectionStart, selectionEnd)
        break
      case 'table':
        result = insertTable(textContent, selectionStart)
        break
      case 'horizontalRule':
        result = insertHorizontalRule(textContent, selectionStart)
        break
      default:
        return
    }

    // Update content and cursor position
    onContentChange(result.formattedText)

    // Restore cursor position after content update
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.selectionStart = result.selectionStart
        editorRef.current.selectionEnd = result.selectionEnd
        editorRef.current.focus()
      }
    }, 0)
  }

  /**
   * Restore scroll positions when they change
   */
  React.useEffect(() => {
    if (editorRef.current) {
      editorRef.current.scrollTop = editorState.scrollPositionEditor
    }
  }, [editorState.scrollPositionEditor])

  /**
   * Handle keyboard shortcuts globally
   */
  React.useEffect(() => {
    const handleKeyboardShortcuts = (e: KeyboardEvent) => {
      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform)
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey

      if (!ctrlKey) return

      // Ctrl+B = Bold
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault()
        const action = FORMATTING_ACTIONS.find((a) => a.id === 'bold')
        if (action) {
          handleFormatting(
            action,
            document.content,
            editorState.selectionStart,
            editorState.selectionEnd
          )
        }
      }
      // Ctrl+I = Italic
      else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault()
        const action = FORMATTING_ACTIONS.find((a) => a.id === 'italic')
        if (action) {
          handleFormatting(
            action,
            document.content,
            editorState.selectionStart,
            editorState.selectionEnd
          )
        }
      }
      // Ctrl+D = Strikethrough
      else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault()
        const action = FORMATTING_ACTIONS.find((a) => a.id === 'strikethrough')
        if (action) {
          handleFormatting(
            action,
            document.content,
            editorState.selectionStart,
            editorState.selectionEnd
          )
        }
      }
      // Ctrl+K = Link
      else if (e.key === 'k' || e.key === 'K') {
        e.preventDefault()
        const action = FORMATTING_ACTIONS.find((a) => a.id === 'link')
        if (action) {
          handleFormatting(
            action,
            document.content,
            editorState.selectionStart,
            editorState.selectionEnd
          )
        }
      }
      // Ctrl+Shift+I = Image
      else if ((e.key === 'i' || e.key === 'I') && e.shiftKey) {
        e.preventDefault()
        const action = FORMATTING_ACTIONS.find((a) => a.id === 'image')
        if (action) {
          handleFormatting(
            action,
            document.content,
            editorState.selectionStart,
            editorState.selectionEnd
          )
        }
      }
      // Ctrl+` = Code
      else if (e.key === '`') {
        e.preventDefault()
        const action = FORMATTING_ACTIONS.find((a) => a.id === 'code')
        if (action) {
          handleFormatting(
            action,
            document.content,
            editorState.selectionStart,
            editorState.selectionEnd
          )
        }
      }
    }

    window.addEventListener('keydown', handleKeyboardShortcuts)
    return () => window.removeEventListener('keydown', handleKeyboardShortcuts)
  }, [document.content, editorState, handleFormatting])

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
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Toolbar */}
      <Toolbar
        onFormat={handleFormatting}
        editorContent={document.content}
        selectionStart={editorState.selectionStart}
        selectionEnd={editorState.selectionEnd}
      />

      {/* Editor and Preview split view */}
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
        {/* End Preview Pane */}
      </div>
      {/* End Editor and Preview split view */}
      </div>
      {/* End Layout wrapper */}
    </div>
  )
}

export default Layout
