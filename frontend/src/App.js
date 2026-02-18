import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Background3D from './Background3D';
import AnimatedCard from './AnimatedCard';
import LoadingSpinner from './LoadingSpinner';
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
      // Don't show toast on initial load if backend is not ready
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadProgress('Uploading...');
    setIsLoading(true);

    const loadingToast = toast.loading('Uploading document...');

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadProgress(`${file.name} uploaded successfully!`);
      await loadDocuments();
      
      setSelectedDocument(response.data.document_id);
      
      toast.success('Document uploaded successfully!', { id: loadingToast });
      setTimeout(() => setUploadProgress(''), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message;
      setUploadProgress(`Error: ${errorMsg}`);
      toast.error(`Upload failed: ${errorMsg}`, { id: loadingToast });
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

      setChatHistory(prev => [...prev, {
        type: 'answer',
        text: response.data.answer,
        sources: response.data.sources,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message;
      setChatHistory(prev => [...prev, {
        type: 'error',
        text: `Error: ${errorMsg}`,
        timestamp: new Date().toLocaleTimeString()
      }]);
      toast.error(`Failed to get answer: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    const loadingToast = toast.loading('Deleting document...');

    try {
      await axios.delete(`${API_URL}/documents/${docId}`);
      await loadDocuments();
      
      if (selectedDocument === docId) {
        setSelectedDocument(null);
        setChatHistory([]);
      }
      
      toast.success('Document deleted successfully!', { id: loadingToast });
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message;
      toast.error(`Failed to delete: ${errorMsg}`, { id: loadingToast });
    }
  };

  return (
    <>
      <Background3D />
      <Toaster position="top-right" />
      
      <div className="App">
        <motion.header 
          className="App-header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
          >
            <h1 className="animated-title">
              <span className="emoji-3d">🧠</span> AI-DocuMind Assistant
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Upload documents and ask questions using AI-powered RAG
          </motion.p>
        </motion.header>

        <div className="container">
          <motion.div 
            className="sidebar"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <AnimatedCard className="upload-section" delay={0.4}>
              <h2>📤 Upload Document</h2>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.docx,.txt"
                disabled={isLoading}
                style={{ display: 'none' }}
              />
              <motion.button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="upload-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Choose File (PDF, DOCX, TXT)
              </motion.button>
              {uploadProgress && (
                <motion.div 
                  className="upload-progress"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {uploadProgress}
                </motion.div>
              )}
            </AnimatedCard>

            <AnimatedCard className="documents-section" delay={0.5}>
              <h2>📚 Documents ({documents.length})</h2>
              <div className="documents-list">
                <AnimatePresence>
                  {documents.length === 0 ? (
                    <motion.p 
                      className="no-documents"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      No documents uploaded yet
                    </motion.p>
                  ) : (
                    documents.map((doc, index) => (
                      <motion.div
                        key={doc.document_id}
                        className={`document-item ${selectedDocument === doc.document_id ? 'selected' : ''}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 5, scale: 1.02 }}
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
                        <motion.button
                          className="delete-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDocument(doc.document_id);
                          }}
                          title="Delete document"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          🗑️
                        </motion.button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </AnimatedCard>
          </motion.div>

          <motion.div 
            className="main-content"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AnimatedCard className="chat-container" delay={0.6}>
              <div className="chat-header">
                <h2>
                  💬 Chat
                  {selectedDocument && documents.length > 0 && (
                    <motion.span 
                      className="selected-doc"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {' '}· {documents.find(d => d.document_id === selectedDocument)?.filename || 'All documents'}
                    </motion.span>
                  )}
                </h2>
              </div>

              <div className="chat-messages">
                <AnimatePresence>
                  {chatHistory.length === 0 ? (
                    <motion.div 
                      className="welcome-message"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.h3
                        animate={{ 
                          y: [0, -10, 0],
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        Welcome to AI-DocuMind Assistant! 👋
                      </motion.h3>
                      <p>Upload a document to get started, then ask questions about its content.</p>
                      <ul>
                        <motion.li whileHover={{ x: 10 }}>📄 Supports PDF, DOCX, and TXT files</motion.li>
                        <motion.li whileHover={{ x: 10 }}>🤖 Uses RAG (Retrieval-Augmented Generation)</motion.li>
                        <motion.li whileHover={{ x: 10 }}>💯 100% free and open-source</motion.li>
                        <motion.li whileHover={{ x: 10 }}>🔒 Your data stays on your server</motion.li>
                      </ul>
                    </motion.div>
                  ) : (
                    chatHistory.map((message, index) => (
                      <motion.div
                        key={index}
                        className={`message ${message.type}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
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
                                <motion.li 
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                >
                                  {source}
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
                {isLoading && <LoadingSpinner />}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleAskQuestion} className="chat-input-form">
                <motion.input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={documents.length === 0 ? "Upload a document first..." : "Ask a question about your document..."}
                  disabled={isLoading || documents.length === 0}
                  className="chat-input"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button
                  type="submit"
                  disabled={isLoading || !question.trim() || documents.length === 0}
                  className="send-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📨 Ask
                </motion.button>
              </form>
            </AnimatedCard>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default App;
