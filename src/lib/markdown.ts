/**
 * Markdown Rendering Utility
 * Converts markdown to HTML with GitHub Flavored Markdown support
 */

import { marked } from 'marked'
import hljs from 'highlight.js'

/**
 * Escape HTML special characters to prevent XSS
 * @param text - Text to escape
 * @returns Escaped text
 */
const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (char) => map[char])
}

/**
 * Initialize marked with custom settings for GitHub Flavored Markdown
 */
const initializeMarked = () => {
  // Configure marked with custom renderer for syntax highlighting
  marked.use({
    breaks: true,
    gfm: true,
    renderer: {
      codespan(token: any) {
        return `<code class="hljs-inline">${escapeHtml(token.text)}</code>`
      },
      code(token: any) {
        const language = token.lang || 'plaintext'
        let highlighted = token.text

        try {
          if (hljs.getLanguage(language)) {
            highlighted = hljs.highlight(token.text, { language }).value
          } else {
            highlighted = hljs.highlightAuto(token.text).value
          }
        } catch (err) {
          console.error('Highlight error:', err)
        }

        return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`
      },
    },
  })
}

// Initialize on module load
initializeMarked()

/**
 * Convert markdown string to HTML
 * @param markdown - Raw markdown text
 * @returns Rendered HTML string
 */
export const markdownToHtml = (markdown: string): string => {
  try {
    if (!markdown || typeof markdown !== 'string') {
      return '<p></p>'
    }

    const html = marked(markdown) as string

    // Ensure HTML is valid and wrapped properly
    return html || '<p></p>'
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Markdown rendering error:', error)
    return `<div class="markdown-error" style="color: #cb2431; padding: 16px; background-color: #fdeef0; border-radius: 6px; border-left: 4px solid #cb2431;">
      <strong>Error rendering markdown:</strong>
      <p style="margin-top: 8px; font-family: monospace; font-size: 12px;">${escapeHtml(errorMessage)}</p>
    </div>`
  }
}

/**
 * Validate markdown content
 * @param markdown - Markdown text to validate
 * @returns Object with validity and error message if any
 */
export const validateMarkdown = (markdown: string): { valid: boolean; error?: string } => {
  if (!markdown) {
    return { valid: true } // Empty is valid
  }

  if (typeof markdown !== 'string') {
    return { valid: false, error: 'Content must be a string' }
  }

  const size = new Blob([markdown]).size
  const maxSize = 1024 * 1024 // 1MB

  if (size > maxSize) {
    return { valid: false, error: `Content exceeds maximum size of ${maxSize / 1024 / 1024}MB` }
  }

  return { valid: true }
}

/**
 * Extract plain text from markdown
 * Useful for character/word counts
 * @param markdown - Markdown text
 * @returns Plain text content
 */
export const extractPlainText = (markdown: string): string => {
  if (!markdown) return ''

  // Remove markdown syntax
  let text = markdown
    // Remove links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '')
    // Remove headers
    .replace(/^#+\s+/gm, '')
    // Remove bold/italic
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}$/gm, '')
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')

  return text.trim()
}

/**
 * Get character and word counts from markdown
 * @param markdown - Markdown text
 * @returns Object with character and word counts
 */
export const getMarkdownStats = (markdown: string): { characters: number; words: number } => {
  const plainText = extractPlainText(markdown)

  const characters = plainText.length
  const words = plainText.split(/\s+/).filter((word) => word.length > 0).length

  return { characters, words }
}

/**
 * Check if markdown has been modified
 * @param original - Original markdown
 * @param current - Current markdown
 * @returns Boolean indicating if content has changed
 */
export const isMarkdownModified = (original: string, current: string): boolean => {
  return original !== current
}

/**
 * Get markdown syntax example
 * Useful for tooltips and help text
 */
export const getMarkdownSyntaxExamples = () => {
  return {
    heading1: '# Heading 1',
    heading2: '## Heading 2',
    heading3: '### Heading 3',
    bold: '**bold text**',
    italic: '*italic text*',
    link: '[link text](https://example.com)',
    unorderedList: '- List item',
    orderedList: '1. List item',
    codeBlock: '```\ncode\n```',
    inlineCode: '`code`',
    blockquote: '> Blockquote',
    horizontalLine: '---',
    table: '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |',
    checkbox: '- [ ] Unchecked task',
    strikethrough: '~~strikethrough~~',
  }
}
