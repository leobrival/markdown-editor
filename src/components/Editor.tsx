import React, { useRef, useEffect } from 'react'

interface EditorProps {
  /** Current markdown content */
  value: string
  /** Callback when content changes */
  onChange: (content: string) => void
  /** Callback when cursor position changes */
  onCursorChange?: (position: number, selectionStart: number, selectionEnd: number) => void
  /** Placeholder text */
  placeholder?: string
  /** Whether the editor is disabled */
  disabled?: boolean
  /** Auto-focus on mount */
  autoFocus?: boolean
}

/**
 * Markdown Editor Component
 * Textarea-based editor for markdown content with cursor tracking
 * Integrates with formatting utilities for toolbar actions
 */
const Editor = React.forwardRef<HTMLTextAreaElement, EditorProps>(
  (
    { value, onChange, onCursorChange, placeholder, disabled = false, autoFocus = true },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const syncedRef = ref || textareaRef

    // Track cursor position changes
    const handleSelect = () => {
      const textarea = (syncedRef as React.RefObject<HTMLTextAreaElement>).current
      if (textarea && onCursorChange) {
        onCursorChange(
          textarea.selectionStart,
          textarea.selectionStart,
          textarea.selectionEnd
        )
      }
    }

    // Track click position changes
    const handleClick = () => {
      const textarea = (syncedRef as React.RefObject<HTMLTextAreaElement>).current
      if (textarea && onCursorChange) {
        onCursorChange(
          textarea.selectionStart,
          textarea.selectionStart,
          textarea.selectionEnd
        )
      }
    }

    // Handle keyboard shortcuts for formatting
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const textarea = (syncedRef as React.RefObject<HTMLTextAreaElement>).current
      if (!textarea) return

      // Tab handling - insert 2 spaces instead of changing focus
      if (e.key === 'Tab') {
        e.preventDefault()
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const newValue = value.substring(0, start) + '  ' + value.substring(end)
        onChange(newValue)

        // Move cursor after the inserted spaces
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2
        }, 0)
      }

      // Common keyboard shortcuts (available for future use with custom events)
      // Ctrl/Cmd+B = Bold, Ctrl/Cmd+I = Italic, Ctrl/Cmd+D = Strikethrough
      // Ctrl/Cmd+K = Link, Ctrl/Cmd+Shift+I = Image
      // These would be handled by parent component with custom event listeners
    }

    // Handle text change
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value)
    }

    // Auto-focus on mount
    useEffect(() => {
      const textarea = (syncedRef as React.RefObject<HTMLTextAreaElement>).current
      if (autoFocus && textarea) {
        textarea.focus()
      }
    }, [autoFocus, syncedRef])

    // Sync ref if using external ref
    useEffect(() => {
      if (ref && ref !== textareaRef) {
        if (typeof ref === 'function') {
          ref(textareaRef.current)
        } else {
          ref.current = textareaRef.current
        }
      }
    }, [ref])

    return (
      <div className="flex h-full flex-col overflow-hidden">
        {/* Editor textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onSelect={handleSelect}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Enter your markdown here...'}
          disabled={disabled}
          className="flex-1 resize-none border-none bg-white p-4 font-mono text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-600"
          spellCheck="false"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          wrap="soft"
        />
      </div>
    )
  }
)

Editor.displayName = 'Editor'

export default Editor
