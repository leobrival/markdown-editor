/**
 * Mermaid Diagram Utilities
 * Handles rendering and validation of Mermaid diagrams
 */

import mermaid from 'mermaid'

/**
 * Initialize Mermaid with custom configuration
 */
export const initializeMermaid = () => {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
    logLevel: 'error',
  })
}

/**
 * Check if content contains Mermaid code blocks
 */
export const containsMermaidDiagrams = (markdown: string): boolean => {
  return /```mermaid\n[\s\S]*?```/.test(markdown)
}

/**
 * Extract Mermaid diagrams from markdown
 */
export const extractMermaidDiagrams = (markdown: string): string[] => {
  const mermaidRegex = /```mermaid\n([\s\S]*?)```/g
  const diagrams: string[] = []
  let match

  while ((match = mermaidRegex.exec(markdown)) !== null) {
    diagrams.push(match[1].trim())
  }

  return diagrams
}

/**
 * Validate Mermaid diagram syntax
 */
export const validateMermaidDiagram = async (diagram: string): Promise<{ valid: boolean; error?: string }> => {
  try {
    // Try to parse the diagram
    await mermaid.parse(diagram)
    return { valid: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid Mermaid diagram syntax'
    return { valid: false, error: errorMessage }
  }
}

/**
 * Render a Mermaid diagram to SVG
 */
export const renderMermaidDiagram = async (diagram: string, elementId: string): Promise<string> => {
  try {
    const { svg } = await mermaid.render(elementId, diagram)
    return svg
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to render diagram'
    throw new Error(`Mermaid render error: ${errorMessage}`)
  }
}

/**
 * Common Mermaid diagram templates
 */
export const MERMAID_TEMPLATES = {
  flowchart: `graph TD
    A[Start] --> B[Process]
    B --> C{Decision}
    C -->|Yes| D[End]
    C -->|No| B`,

  sequence: `sequenceDiagram
    participant User
    participant API
    User->>API: Request
    API->>API: Process
    API-->>User: Response`,

  gantt: `gantt
    title Project Timeline
    section Planning
    Design :des1, 2024-01-01, 30d
    section Development
    Frontend :dev1, 2024-02-01, 45d
    Backend :dev2, 2024-02-01, 60d`,

  pie: `pie title Browser Usage
    "Chrome" : 45
    "Firefox" : 30
    "Safari" : 20
    "Other" : 5`,

  classDiagram: `classDiagram
    class Animal {
      name String
      move()
    }
    class Dog {
      bark()
    }
    Animal <|-- Dog`,

  stateDiagram: `stateDiagram-v2
    [*] --> Idle
    Idle --> Active: Start
    Active --> Idle: Stop
    Active --> [*]: Exit`,
}

/**
 * Get Mermaid template suggestions
 */
export const getMermaidSuggestions = (): string[] => {
  return Object.keys(MERMAID_TEMPLATES)
}

/**
 * Get a Mermaid template by name
 */
export const getMermaidTemplate = (name: string): string | null => {
  return MERMAID_TEMPLATES[name as keyof typeof MERMAID_TEMPLATES] || null
}
