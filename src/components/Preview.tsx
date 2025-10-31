import React, { useMemo } from 'react'
import { markdownToHtml } from '../lib/markdown'

interface PreviewProps {
  /** Markdown content to render */
  content: string
  /** CSS class name for container */
  className?: string
  /** Scroll position (optional) */
  scrollPosition?: number
  /** Callback when component mounts (to restore scroll position) */
  onMount?: (element: HTMLDivElement | null) => void
}

/**
 * Markdown Preview Component
 * Renders markdown content as HTML with GitHub styling
 * Memoized to prevent unnecessary re-renders
 */
const Preview = React.forwardRef<HTMLDivElement, PreviewProps>(
  ({ content, className, scrollPosition, onMount }, ref) => {
    // Memoize HTML rendering to prevent re-renders
    const htmlContent = useMemo(() => {
      if (!content) {
        return '<p class="text-gray-400">Preview will appear here...</p>'
      }
      return markdownToHtml(content)
    }, [content])

    // Restore scroll position when component mounts or scrollPosition prop changes
    React.useEffect(() => {
      const previewElement = ref && 'current' in ref ? ref.current : null
      if (previewElement && scrollPosition !== undefined) {
        previewElement.scrollTop = scrollPosition
      }
    }, [ref, scrollPosition])

    // Call onMount callback
    React.useEffect(() => {
      const previewElement = ref && 'current' in ref ? ref.current : null
      onMount?.(previewElement)
    }, [ref, onMount])

    return (
      <div
        ref={ref}
        className={`markdown-preview overflow-y-auto bg-white p-4 dark:bg-gray-950 ${className || ''}`}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    )
  }
)

Preview.displayName = 'Preview'

export default Preview
