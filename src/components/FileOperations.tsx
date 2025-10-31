import React, { useRef, useState } from 'react'
import { downloadMarkdown, uploadMarkdown, validateFile } from '../lib/file'

interface FileOperationsProps {
  /** Current editor content */
  content: string
  /** Current filename */
  filename: string
  /** Callback when content is loaded from file */
  onFileLoaded: (content: string, filename: string) => void
  /** Callback to clear document */
  onClear?: () => void
}

/**
 * File Operations Component
 * Handles download and upload of markdown files
 * Provides user feedback for file operations
 */
const FileOperations: React.FC<FileOperationsProps> = ({
  content,
  filename,
  onFileLoaded,
  onClear,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'loading' | null
    message: string
  }>({ type: null, message: '' })

  /**
   * Handle download button click
   */
  const handleDownload = () => {
    setStatus({ type: 'loading', message: 'Downloading...' })

    const result = downloadMarkdown(content, filename)

    if (result.success) {
      setStatus({
        type: 'success',
        message: `Downloaded: ${result.filename}`,
      })
      // Clear status after 3 seconds
      setTimeout(() => setStatus({ type: null, message: '' }), 3000)
    } else {
      setStatus({
        type: 'error',
        message: result.error || 'Failed to download file',
      })
    }
  }

  /**
   * Handle upload button click
   */
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  /**
   * Handle file selection
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      setStatus({
        type: 'error',
        message: validation.error || 'Invalid file',
      })
      return
    }

    setStatus({ type: 'loading', message: 'Uploading...' })

    // Upload and read file
    const result = await uploadMarkdown(file)

    if (result.success) {
      onFileLoaded(result.content || '', result.filename || 'document.md')
      setStatus({
        type: 'success',
        message: `Loaded: ${result.filename}`,
      })
      // Clear status after 3 seconds
      setTimeout(() => setStatus({ type: null, message: '' }), 3000)
    } else {
      setStatus({
        type: 'error',
        message: result.error || 'Failed to upload file',
      })
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  /**
   * Handle clear button click
   */
  const handleClear = () => {
    if (content.trim() === '') {
      setStatus({
        type: 'error',
        message: 'Document is already empty',
      })
      setTimeout(() => setStatus({ type: null, message: '' }), 2000)
      return
    }

    if (onClear) {
      onClear()
      setStatus({
        type: 'success',
        message: 'Document cleared',
      })
      setTimeout(() => setStatus({ type: null, message: '' }), 2000)
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={!content.trim()}
        className="flex h-8 items-center gap-1.5 rounded-md bg-gray-100 px-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 hover:text-gray-900 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:disabled:bg-gray-900 dark:disabled:text-gray-600"
        title="Download markdown file (Ctrl+Shift+S)"
        aria-label="Download markdown file"
      >
        <span>↓</span>
        <span>Download</span>
      </button>

      {/* Upload Button */}
      <button
        onClick={handleUploadClick}
        className="flex h-8 items-center gap-1.5 rounded-md bg-gray-100 px-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
        title="Upload markdown file (Ctrl+Shift+O)"
        aria-label="Upload markdown file"
      >
        <span>↑</span>
        <span>Upload</span>
      </button>

      {/* Clear Button */}
      <button
        onClick={handleClear}
        disabled={!content.trim()}
        className="flex h-8 items-center gap-1.5 rounded-md bg-gray-100 px-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 hover:text-gray-900 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:disabled:bg-gray-900 dark:disabled:text-gray-600"
        title="Clear document"
        aria-label="Clear document"
      >
        <span>⌫</span>
        <span>Clear</span>
      </button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.txt,text/plain,text/markdown"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />

      {/* Status message */}
      {status.type && (
        <div
          className={`ml-2 text-sm font-medium ${
            status.type === 'success'
              ? 'text-green-600 dark:text-green-400'
              : status.type === 'error'
                ? 'text-red-600 dark:text-red-400'
                : 'text-blue-600 dark:text-blue-400'
          }`}
        >
          {status.message}
        </div>
      )}
    </div>
  )
}

export default FileOperations
