/**
 * Text Formatting Utilities
 * Provides formatting functions for toolbar actions
 */

/**
 * Represents the result of a formatting operation
 */
interface FormatResult {
  /** The formatted text/content */
  formattedText: string
  /** New cursor position after formatting */
  cursorPosition: number
  /** Selection start after formatting */
  selectionStart: number
  /** Selection end after formatting */
  selectionEnd: number
}

/**
 * Wrap selected text with markdown syntax
 * @param text - The full text content
 * @param selectionStart - Start of selection
 * @param selectionEnd - End of selection
 * @param before - Syntax to add before selection
 * @param after - Syntax to add after selection (defaults to before if not specified)
 * @returns Formatted result with updated positions
 */
export const wrapSelection = (
  text: string,
  selectionStart: number,
  selectionEnd: number,
  before: string,
  after?: string
): FormatResult => {
  const afterSyntax = after || before
  const selectedText = text.substring(selectionStart, selectionEnd)
  const beforeText = text.substring(0, selectionStart)
  const afterText = text.substring(selectionEnd)

  const formattedText = beforeText + before + selectedText + afterSyntax + afterText

  return {
    formattedText,
    cursorPosition: selectionStart + before.length + selectedText.length + afterSyntax.length,
    selectionStart: selectionStart + before.length,
    selectionEnd: selectionStart + before.length + selectedText.length,
  }
}

/**
 * Insert text at cursor position
 * @param text - The full text content
 * @param cursorPosition - Position where to insert
 * @param insertText - Text to insert
 * @returns Formatted result with updated positions
 */
export const insertAtCursor = (
  text: string,
  cursorPosition: number,
  insertText: string
): FormatResult => {
  const beforeText = text.substring(0, cursorPosition)
  const afterText = text.substring(cursorPosition)
  const formattedText = beforeText + insertText + afterText

  return {
    formattedText,
    cursorPosition: cursorPosition + insertText.length,
    selectionStart: cursorPosition,
    selectionEnd: cursorPosition + insertText.length,
  }
}

/**
 * Add prefix to current line
 * @param text - The full text content
 * @param cursorPosition - Current cursor position
 * @param prefix - Prefix to add to line start
 * @returns Formatted result with updated positions
 */
export const prefixLine = (
  text: string,
  cursorPosition: number,
  prefix: string
): FormatResult => {
  // Find the start of the current line
  let lineStart = cursorPosition
  while (lineStart > 0 && text[lineStart - 1] !== '\n') {
    lineStart--
  }

  // Check if line already has the prefix
  const lineEnd = text.indexOf('\n', cursorPosition)
  const actualLineEnd = lineEnd === -1 ? text.length : lineEnd
  const currentLine = text.substring(lineStart, actualLineEnd)
  const hasPrefix = currentLine.startsWith(prefix)

  let formattedText: string
  let newCursorPosition: number

  if (hasPrefix) {
    // Remove prefix
    formattedText = text.substring(0, lineStart) + currentLine.substring(prefix.length) + text.substring(actualLineEnd)
    newCursorPosition = Math.max(lineStart, cursorPosition - prefix.length)
  } else {
    // Add prefix
    formattedText = text.substring(0, lineStart) + prefix + currentLine + text.substring(actualLineEnd)
    newCursorPosition = cursorPosition + prefix.length
  }

  return {
    formattedText,
    cursorPosition: newCursorPosition,
    selectionStart: newCursorPosition,
    selectionEnd: newCursorPosition,
  }
}

/**
 * Format text as bold
 * @param text - The full text content
 * @param selectionStart - Start of selection
 * @param selectionEnd - End of selection
 * @returns Formatted result
 */
export const formatBold = (
  text: string,
  selectionStart: number,
  selectionEnd: number
): FormatResult => {
  if (selectionStart === selectionEnd) {
    // No selection - insert placeholder
    return insertAtCursor(text, selectionStart, '**bold text**')
  }
  return wrapSelection(text, selectionStart, selectionEnd, '**')
}

/**
 * Format text as italic
 * @param text - The full text content
 * @param selectionStart - Start of selection
 * @param selectionEnd - End of selection
 * @returns Formatted result
 */
export const formatItalic = (
  text: string,
  selectionStart: number,
  selectionEnd: number
): FormatResult => {
  if (selectionStart === selectionEnd) {
    // No selection - insert placeholder
    return insertAtCursor(text, selectionStart, '*italic text*')
  }
  return wrapSelection(text, selectionStart, selectionEnd, '*')
}

/**
 * Format text as strikethrough
 * @param text - The full text content
 * @param selectionStart - Start of selection
 * @param selectionEnd - End of selection
 * @returns Formatted result
 */
export const formatStrikethrough = (
  text: string,
  selectionStart: number,
  selectionEnd: number
): FormatResult => {
  if (selectionStart === selectionEnd) {
    return insertAtCursor(text, selectionStart, '~~strikethrough~~')
  }
  return wrapSelection(text, selectionStart, selectionEnd, '~~')
}

/**
 * Format text as inline code
 * @param text - The full text content
 * @param selectionStart - Start of selection
 * @param selectionEnd - End of selection
 * @returns Formatted result
 */
export const formatInlineCode = (
  text: string,
  selectionStart: number,
  selectionEnd: number
): FormatResult => {
  if (selectionStart === selectionEnd) {
    return insertAtCursor(text, selectionStart, '`code`')
  }
  return wrapSelection(text, selectionStart, selectionEnd, '`')
}

/**
 * Format text as code block
 * @param text - The full text content
 * @param cursorPosition - Current cursor position
 * @returns Formatted result
 */
export const formatCodeBlock = (
  text: string,
  cursorPosition: number
): FormatResult => {
  const codeBlockTemplate = '```\ncode\n```'
  return insertAtCursor(text, cursorPosition, codeBlockTemplate)
}

/**
 * Format as heading
 * @param text - The full text content
 * @param cursorPosition - Current cursor position
 * @param level - Heading level (1-6, default 1)
 * @returns Formatted result
 */
export const formatHeading = (
  text: string,
  cursorPosition: number,
  level: number = 1
): FormatResult => {
  const prefix = '#'.repeat(Math.min(Math.max(level, 1), 6)) + ' '
  return prefixLine(text, cursorPosition, prefix)
}

/**
 * Format as unordered list item
 * @param text - The full text content
 * @param cursorPosition - Current cursor position
 * @returns Formatted result
 */
export const formatBulletList = (
  text: string,
  cursorPosition: number
): FormatResult => {
  return prefixLine(text, cursorPosition, '- ')
}

/**
 * Format as ordered list item
 * @param text - The full text content
 * @param cursorPosition - Current cursor position
 * @returns Formatted result
 */
export const formatOrderedList = (
  text: string,
  cursorPosition: number
): FormatResult => {
  return prefixLine(text, cursorPosition, '1. ')
}

/**
 * Format as task list item
 * @param text - The full text content
 * @param cursorPosition - Current cursor position
 * @returns Formatted result
 */
export const formatTaskList = (
  text: string,
  cursorPosition: number
): FormatResult => {
  return prefixLine(text, cursorPosition, '- [ ] ')
}

/**
 * Format as blockquote
 * @param text - The full text content
 * @param cursorPosition - Current cursor position
 * @returns Formatted result
 */
export const formatBlockquote = (
  text: string,
  cursorPosition: number
): FormatResult => {
  return prefixLine(text, cursorPosition, '> ')
}

/**
 * Format as link
 * @param text - The full text content
 * @param selectionStart - Start of selection
 * @param selectionEnd - End of selection
 * @returns Formatted result
 */
export const formatLink = (
  text: string,
  selectionStart: number,
  selectionEnd: number
): FormatResult => {
  if (selectionStart === selectionEnd) {
    return insertAtCursor(text, selectionStart, '[link text](https://example.com)')
  }
  return wrapSelection(text, selectionStart, selectionEnd, '[', '](https://example.com)')
}

/**
 * Format as image
 * @param text - The full text content
 * @param selectionStart - Start of selection
 * @param selectionEnd - End of selection
 * @returns Formatted result
 */
export const formatImage = (
  text: string,
  selectionStart: number,
  selectionEnd: number
): FormatResult => {
  if (selectionStart === selectionEnd) {
    return insertAtCursor(text, selectionStart, '![alt text](https://example.com/image.png)')
  }
  return wrapSelection(text, selectionStart, selectionEnd, '![', '](https://example.com/image.png)')
}

/**
 * Insert horizontal rule
 * @param text - The full text content
 * @param cursorPosition - Current cursor position
 * @returns Formatted result
 */
export const insertHorizontalRule = (
  text: string,
  cursorPosition: number
): FormatResult => {
  return insertAtCursor(text, cursorPosition, '\n---\n')
}

/**
 * Insert table template
 * @param text - The full text content
 * @param cursorPosition - Current cursor position
 * @returns Formatted result
 */
export const insertTable = (
  text: string,
  cursorPosition: number
): FormatResult => {
  const tableTemplate = '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |'
  return insertAtCursor(text, cursorPosition, tableTemplate)
}

/**
 * Get text selection from editor
 * @param textarea - The textarea element
 * @returns Object with selected text and positions
 */
export const getSelection = (
  textarea: HTMLTextAreaElement
): {
  selectedText: string
  selectionStart: number
  selectionEnd: number
} => {
  const selectionStart = textarea.selectionStart || 0
  const selectionEnd = textarea.selectionEnd || 0
  const selectedText = textarea.value.substring(selectionStart, selectionEnd)

  return {
    selectedText,
    selectionStart,
    selectionEnd,
  }
}

/**
 * Set cursor position in textarea
 * @param textarea - The textarea element
 * @param cursorPosition - Position to set cursor to
 */
export const setCursorPosition = (
  textarea: HTMLTextAreaElement,
  cursorPosition: number
): void => {
  textarea.selectionStart = cursorPosition
  textarea.selectionEnd = cursorPosition
  textarea.focus()
}

/**
 * Set selection in textarea
 * @param textarea - The textarea element
 * @param selectionStart - Start position
 * @param selectionEnd - End position
 */
export const setSelection = (
  textarea: HTMLTextAreaElement,
  selectionStart: number,
  selectionEnd: number
): void => {
  textarea.selectionStart = selectionStart
  textarea.selectionEnd = selectionEnd
  textarea.focus()
}

/**
 * Get current line text
 * @param text - The full text content
 * @param cursorPosition - Current cursor position
 * @returns Current line text
 */
export const getCurrentLine = (
  text: string,
  cursorPosition: number
): string => {
  let lineStart = cursorPosition
  while (lineStart > 0 && text[lineStart - 1] !== '\n') {
    lineStart--
  }

  let lineEnd = text.indexOf('\n', cursorPosition)
  if (lineEnd === -1) {
    lineEnd = text.length
  }

  return text.substring(lineStart, lineEnd)
}

/**
 * Get current word around cursor
 * @param text - The full text content
 * @param cursorPosition - Current cursor position
 * @returns Object with word and its positions
 */
export const getCurrentWord = (
  text: string,
  cursorPosition: number
): {
  word: string
  start: number
  end: number
} => {
  let wordStart = cursorPosition
  let wordEnd = cursorPosition

  // Find word start
  while (wordStart > 0 && /\w/.test(text[wordStart - 1])) {
    wordStart--
  }

  // Find word end
  while (wordEnd < text.length && /\w/.test(text[wordEnd])) {
    wordEnd++
  }

  const word = text.substring(wordStart, wordEnd)

  return {
    word,
    start: wordStart,
    end: wordEnd,
  }
}
