import { useState } from 'react'
import DocumentUploader from './components/DocumentUploader'
import ChatInterface from './components/ChatInterface'
import './App.css'

interface UploadedDocument {
  documentId: string;
  filename: string;
}

function App() {
  const [uploadedDoc, setUploadedDoc] = useState<UploadedDocument | null>(null);

  const handleDocumentUploaded = (docId: string, filename: string) => {
    setUploadedDoc({ documentId: docId, filename });
  };

  const handleReset = () => {
    setUploadedDoc(null);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🤖 AI-DocuMind Assistant</h1>
        <p>Upload documents and ask questions using AI-powered analysis</p>
      </header>

      <main className="main-content">
        {!uploadedDoc ? (
          <DocumentUploader onDocumentUploaded={handleDocumentUploaded} />
        ) : (
          <div className="chat-container">
            <div className="document-info">
              <span className="document-badge">📄 {uploadedDoc.filename}</span>
              <button className="reset-button" onClick={handleReset}>
                Upload New Document
              </button>
            </div>
            <ChatInterface documentId={uploadedDoc.documentId} />
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Built with ❤️ using open-source AI tools</p>
      </footer>
    </div>
  )
}

export default App
