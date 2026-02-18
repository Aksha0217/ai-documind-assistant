import { useState } from 'react'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0]
    setFile(uploadedFile)
  }

  const analyzeDocument = () => {
    if (!file) {
      alert('Please upload a document first')
      return
    }
    
    setLoading(true)
    // Placeholder for AI analysis functionality
    setTimeout(() => {
      setSummary(`Analysis of ${file.name}:\n\nThis is a placeholder summary. In a production environment, this would use NLP to analyze the document content and generate key insights.`)
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🤖 AI-DocuMind Assistant</h1>
        <p>AI-powered document analysis and summarization</p>
      </header>
      
      <main className="App-main">
        <div className="upload-section">
          <h2>Upload Document</h2>
          <input
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            onChange={handleFileUpload}
            className="file-input"
          />
          {file && <p className="file-name">Selected: {file.name}</p>}
        </div>

        <button
          onClick={analyzeDocument}
          disabled={!file || loading}
          className="analyze-button"
        >
          {loading ? 'Analyzing...' : 'Analyze Document'}
        </button>

        {summary && (
          <div className="summary-section">
            <h2>Summary</h2>
            <pre className="summary-text">{summary}</pre>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
