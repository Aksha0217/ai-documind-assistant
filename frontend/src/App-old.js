import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadDocuments = async () => {
    try {
      const response = await axios.get(`${API_URL}/documents`);
      setDocuments(response.data.documents);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadProgress('Uploading...');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadProgress(`${file.name} uploaded successfully!`);
      await loadDocuments();
      
      // Select the newly uploaded document
      setSelectedDocument(response.data.document_id);
      
      setTimeout(() => setUploadProgress(''), 3000);
    } catch (error) {
      setUploadProgress(`Error: ${error.response?.data?.detail || error.message}`);
      setTimeout(() => setUploadProgress(''), 5000);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userQuestion = question;
    setQuestion('');
    
    // Add user message to chat
    setChatHistory(prev => [...prev, {
      type: 'question',
      text: userQuestion,
      timestamp: new Date().toLocaleTimeString()
    }]);

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/ask`, {
        question: userQuestion,
        document_id: selectedDocument
      });

      // Add answer to chat
      setChatHistory(prev => [...prev, {
        type: 'answer',
        text: response.data.answer,
        sources: response.data.sources,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } catch (error) {
      setChatHistory(prev => [...prev, {
        type: 'error',
        text: `Error: ${error.response?.data?.detail || error.message}`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/documents/${docId}`);
      await loadDocuments();
      
      if (selectedDocument === docId) {
        setSelectedDocument(null);
        setChatHistory([]);
      }
    } catch (error) {
      alert(`Error deleting document: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🧠 AI-DocuMind Assistant</h1>
        <p>Upload documents and ask questions using AI-powered RAG</p>
      </header>

      <div className="container">
        <div className="sidebar">
          <div className="upload-section">
            <h2>Upload Document</h2>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.docx,.txt"
              disabled={isLoading}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="upload-button"
            >
              📤 Choose File (PDF, DOCX, TXT)
            </button>
            {uploadProgress && (
              <div className="upload-progress">{uploadProgress}</div>
            )}
          </div>

          <div className="documents-section">
            <h2>Documents ({documents.length})</h2>
            <div className="documents-list">
              {documents.length === 0 ? (
                <p className="no-documents">No documents uploaded yet</p>
              ) : (
                documents.map(doc => (
                  <div
                    key={doc.document_id}
                    className={`document-item ${selectedDocument === doc.document_id ? 'selected' : ''}`}
                  >
                    <div
                      className="document-info"
                      onClick={() => setSelectedDocument(doc.document_id)}
                    >
                      <div className="document-name">📄 {doc.filename}</div>
                      <div className="document-meta">
                        {doc.num_chunks} chunks · {Math.round(doc.text_length / 1000)}k chars
                      </div>
                    </div>
                    <button
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDocument(doc.document_id);
                      }}
                      title="Delete document"
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="chat-container">
            <div className="chat-header">
              <h2>
                💬 Chat
                {selectedDocument && documents.length > 0 && (
                  <span className="selected-doc">
                    {' '}· {documents.find(d => d.document_id === selectedDocument)?.filename || 'All documents'}
                  </span>
                )}
              </h2>
            </div>

            <div className="chat-messages">
              {chatHistory.length === 0 ? (
                <div className="welcome-message">
                  <h3>Welcome to AI-DocuMind Assistant! 👋</h3>
                  <p>Upload a document to get started, then ask questions about its content.</p>
                  <ul>
                    <li>📄 Supports PDF, DOCX, and TXT files</li>
                    <li>🤖 Uses RAG (Retrieval-Augmented Generation)</li>
                    <li>💯 100% free and open-source</li>
                    <li>🔒 Your data stays on your server</li>
                  </ul>
                </div>
              ) : (
                chatHistory.map((message, index) => (
                  <div key={index} className={`message ${message.type}`}>
                    <div className="message-header">
                      <span className="message-icon">
                        {message.type === 'question' ? '👤' : message.type === 'error' ? '⚠️' : '🤖'}
                      </span>
                      <span className="message-time">{message.timestamp}</span>
                    </div>
                    <div className="message-content">
                      {message.text}
                    </div>
                    {message.sources && message.sources.length > 0 && (
                      <div className="message-sources">
                        <strong>Sources:</strong>
                        <ul>
                          {message.sources.map((source, i) => (
                            <li key={i}>{source}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              )}
              {isLoading && (
                <div className="message answer loading">
                  <div className="message-header">
                    <span className="message-icon">🤖</span>
                    <span className="message-time">Thinking...</span>
                  </div>
                  <div className="message-content">
                    <div className="loading-dots">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleAskQuestion} className="chat-input-form">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={documents.length === 0 ? "Upload a document first..." : "Ask a question about your document..."}
                disabled={isLoading || documents.length === 0}
                className="chat-input"
              />
              <button
                type="submit"
                disabled={isLoading || !question.trim() || documents.length === 0}
                className="send-button"
              >
                📨 Ask
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
