import React from 'react'
import { FORMATTING_ACTIONS } from '../lib/format'
import { FormattingAction } from '../types'

interface ToolbarProps {
  /** Callback when a formatting action is clicked */
  onFormat: (action: FormattingAction, textContent: string, selectionStart: number, selectionEnd: number) => void
  /** Current editor content */
  editorContent: string
  /** Current selection start position */
  selectionStart: number
  /** Current selection end position */
  selectionEnd: number
  /** Whether toolbar is disabled */
  disabled?: boolean
}

/**
 * Toolbar Component
 * Displays formatting action buttons for markdown editing
 * Integrates with Editor for text formatting
 */
const Toolbar: React.FC<ToolbarProps> = ({
  onFormat,
  editorContent,
  selectionStart,
  selectionEnd,
  disabled = false,
}) => {
  /**
   * Handle formatting button click
   */
  const handleFormat = (action: FormattingAction) => {
    onFormat(action, editorContent, selectionStart, selectionEnd)
  }

  /**
   * Check if a button should be disabled based on requirements
   */
  const isButtonDisabled = (action: FormattingAction): boolean => {
    if (disabled) return true
    if (action.requiresSelection && selectionStart === selectionEnd) {
      return true
    }
    return false
  }

  /**
   * Get button icon component based on icon name
   */
  const getIcon = (iconName: string): React.ReactNode => {
    // Simple icon mapping - can be replaced with actual icon library
    const iconMap: Record<string, string> = {
      bold: '⊕B',
      italic: '⊕I',
      strikethrough: '⊕S',
      code: '⊕<>',
      heading1: '⊕H1',
      heading2: '⊕H2',
      heading3: '⊕H3',
      list: '⊕•',
      listOrdered: '⊕1.',
      checkSquare: '⊕☑',
      quote: '⊕"',
      codeBlock: '⊕{}',
      link: '⊕🔗',
      image: '⊕🖼',
      table: '⊕#',
      minus: '⊕—',
    }
    return iconMap[iconName] || iconName
  }

  return (
    <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-white/50 p-2.5 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/50">
      {/* Button group 1: Text formatting */}
      <div className="flex gap-1 border-r border-gray-300 pr-2 dark:border-gray-700">
        {FORMATTING_ACTIONS.slice(0, 4).map((action) => (
          <button
            key={action.id}
            onClick={() => handleFormat(action)}
            disabled={isButtonDisabled(action)}
            className="flex h-7 w-7 items-center justify-center rounded bg-gray-100 text-xs font-semibold text-gray-600 transition-all hover:bg-gray-200 hover:text-gray-900 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 dark:disabled:bg-gray-900 dark:disabled:text-gray-600"
            title={action.label}
            aria-label={action.label}
          >
            {getIcon(action.icon)}
          </button>
        ))}
      </div>

      {/* Button group 2: Headings */}
      <div className="flex gap-1 border-r border-gray-300 pr-2 dark:border-gray-700">
        {FORMATTING_ACTIONS.slice(4, 7).map((action) => (
          <button
            key={action.id}
            onClick={() => handleFormat(action)}
            disabled={isButtonDisabled(action)}
            className="flex h-7 w-7 items-center justify-center rounded bg-gray-100 text-xs font-semibold text-gray-600 transition-all hover:bg-gray-200 hover:text-gray-900 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 dark:disabled:bg-gray-900 dark:disabled:text-gray-600"
            title={action.label}
            aria-label={action.label}
          >
            {getIcon(action.icon)}
          </button>
        ))}
      </div>

      {/* Button group 3: Lists and quotes */}
      <div className="flex gap-1 border-r border-gray-300 pr-2 dark:border-gray-700">
        {FORMATTING_ACTIONS.slice(7, 11).map((action) => (
          <button
            key={action.id}
            onClick={() => handleFormat(action)}
            disabled={isButtonDisabled(action)}
            className="flex h-7 w-7 items-center justify-center rounded bg-gray-100 text-xs font-semibold text-gray-600 transition-all hover:bg-gray-200 hover:text-gray-900 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 dark:disabled:bg-gray-900 dark:disabled:text-gray-600"
            title={action.label}
            aria-label={action.label}
          >
            {getIcon(action.icon)}
          </button>
        ))}
      </div>

      {/* Button group 4: Blocks and inserts */}
      <div className="flex gap-1 dark:border-gray-700">
        {FORMATTING_ACTIONS.slice(11).map((action) => (
          <button
            key={action.id}
            onClick={() => handleFormat(action)}
            disabled={isButtonDisabled(action)}
            className="flex h-7 w-7 items-center justify-center rounded bg-gray-100 text-xs font-semibold text-gray-600 transition-all hover:bg-gray-200 hover:text-gray-900 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 dark:disabled:bg-gray-900 dark:disabled:text-gray-600"
            title={action.label}
            aria-label={action.label}
          >
            {getIcon(action.icon)}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Toolbar
