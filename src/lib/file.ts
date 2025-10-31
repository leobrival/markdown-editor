/**
 * File Operations Utility
 * Handles file download and upload operations
 */

import { FileOperationResult } from '../types'

/**
 * Download content as a markdown file
 * @param content - Markdown content to download
 * @param filename - Name of the file (default: document.md)
 */
export const downloadMarkdown = (content: string, filename: string = 'document.md'): FileOperationResult => {
  try {
    // Ensure filename ends with .md
    const safeFilename = filename.endsWith('.md') ? filename : `${filename}.md`

    // Create a Blob from the content
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })

    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob)

    // Create a temporary anchor element to trigger download
    const link = document.createElement('a')
    link.href = url
    link.download = safeFilename

    // Append to body, click, and remove
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up the URL
    URL.revokeObjectURL(url)

    return {
      success: true,
      filename: safeFilename,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      success: false,
      error: `Failed to download file: ${errorMessage}`,
    }
  }
}

/**
 * Upload and read a markdown file
 * @param file - File object from input
 * @returns Promise with file operation result
 */
export const uploadMarkdown = (file: File): Promise<FileOperationResult> => {
  return new Promise((resolve) => {
    try {
      // Validate file type
      const validTypes = ['text/plain', 'text/markdown', 'application/x-markdown']
      const isValidType = validTypes.includes(file.type) || file.name.endsWith('.md')

      if (!isValidType) {
        return resolve({
          success: false,
          error: 'Please select a valid markdown file (.md or .txt)',
        })
      }

      // Validate file size (max 1MB)
      const maxSize = 1024 * 1024 // 1MB
      if (file.size > maxSize) {
        return resolve({
          success: false,
          error: `File size exceeds maximum of ${maxSize / 1024 / 1024}MB`,
        })
      }

      // Read the file
      const reader = new FileReader()

      reader.onload = (event) => {
        try {
          const content = event.target?.result as string

          if (!content) {
            return resolve({
              success: false,
              error: 'Failed to read file content',
            })
          }

          resolve({
            success: true,
            content,
            filename: file.name,
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          resolve({
            success: false,
            error: `Error reading file: ${errorMessage}`,
          })
        }
      }

      reader.onerror = () => {
        resolve({
          success: false,
          error: 'Failed to read file',
        })
      }

      reader.readAsText(file)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      resolve({
        success: false,
        error: `Error processing file: ${errorMessage}`,
      })
    }
  })
}

/**
 * Validate file before upload
 * @param file - File object to validate
 * @returns Object with validity and error message if any
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  const validTypes = ['text/plain', 'text/markdown', 'application/x-markdown']
  const isValidType = validTypes.includes(file.type) || file.name.endsWith('.md')

  if (!isValidType) {
    return {
      valid: false,
      error: 'File must be a markdown file (.md or .txt)',
    }
  }

  const maxSize = 1024 * 1024 // 1MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${maxSize / 1024 / 1024}MB`,
    }
  }

  return { valid: true }
}

/**
 * Save content to localStorage
 * @param key - Storage key
 * @param content - Content to save
 * @returns Boolean indicating success
 */
export const saveToLocalStorage = (key: string, content: string): boolean => {
  try {
    localStorage.setItem(key, content)
    return true
  } catch (error) {
    console.error('LocalStorage save error:', error)
    return false
  }
}

/**
 * Load content from localStorage
 * @param key - Storage key
 * @returns Content or null if not found
 */
export const loadFromLocalStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.error('LocalStorage load error:', error)
    return null
  }
}

/**
 * Clear localStorage content
 * @param key - Storage key
 * @returns Boolean indicating success
 */
export const clearLocalStorage = (key: string): boolean => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error('LocalStorage clear error:', error)
    return false
  }
}

/**
 * Generate a filename with current timestamp
 * @param baseName - Base filename (default: document)
 * @returns Filename with timestamp
 */
export const generateTimestampFilename = (baseName: string = 'document'): string => {
  const now = new Date()
  const timestamp = now.toISOString().slice(0, 10) // YYYY-MM-DD
  return `${baseName}-${timestamp}.md`
}
