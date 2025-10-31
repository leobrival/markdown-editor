import React, { useMemo, useEffect, useState } from 'react'
import { markdownToHtml } from '../lib/markdown'
import { renderMermaidDiagram, extractMermaidDiagrams, initializeMermaid } from '../lib/mermaid'

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
    const [mermaidSvgs, setMermaidSvgs] = useState<Record<string, string>>({})

    // Initialize Mermaid on mount
    useEffect(() => {
      initializeMermaid()
    }, [])

    // Render Mermaid diagrams
    useEffect(() => {
      const renderDiagrams = async () => {
        const diagrams = extractMermaidDiagrams(content)
        const svgs: Record<string, string> = {}

        for (let i = 0; i < diagrams.length; i++) {
          try {
            const svg = await renderMermaidDiagram(diagrams[i], `mermaid-${i}`)
            svgs[`mermaid-${i}`] = svg
          } catch (error) {
            console.error(`Failed to render Mermaid diagram ${i}:`, error)
            svgs[`mermaid-${i}`] = `<div class="p-3 rounded bg-red-50 border border-red-200 text-red-600 text-sm dark:bg-red-400/10 dark:border-red-700 dark:text-red-200">Failed to render diagram</div>`
          }
        }

        setMermaidSvgs(svgs)
      }

      if (content) {
        renderDiagrams()
      } else {
        setMermaidSvgs({})
      }
    }, [content])

    // Memoize HTML rendering to prevent re-renders
    const htmlContent = useMemo(() => {
      if (!content) {
        return '<p class="text-gray-400">Preview will appear here...</p>'
      }

      let html = markdownToHtml(content)

      // Replace Mermaid code blocks with rendered SVGs
      let diagramIndex = 0
      html = html.replace(/```mermaid\n[\s\S]*?```<\/pre>/g, () => {
        const svgKey = `mermaid-${diagramIndex}`
        const svg = mermaidSvgs[svgKey] || '<p>Rendering diagram...</p>'
        diagramIndex++
        return `<div class="my-4 flex justify-center overflow-x-auto rounded bg-gray-50 p-4 dark:bg-gray-800">${svg}</div>`
      })

      return html
    }, [content, mermaidSvgs])

    // Restore scroll position when component mounts or scrollPosition prop changes
    useEffect(() => {
      const previewElement = ref && 'current' in ref ? ref.current : null
      if (previewElement && scrollPosition !== undefined) {
        previewElement.scrollTop = scrollPosition
      }
    }, [ref, scrollPosition])

    // Call onMount callback
    useEffect(() => {
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
