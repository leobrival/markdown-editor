import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Markdown Editor</h1>
          <p className="mt-1 text-sm text-gray-500">Real-time preview with GitHub-style rendering</p>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Placeholder for editor component */}
          <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500">Markdown Editor will be implemented here</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
