# 🧠 AI-DocuMind Assistant

An AI-powered full-stack web application for intelligent document analysis using Retrieval-Augmented Generation (RAG). Upload documents (PDF, DOCX, TXT), analyze them, and ask questions based on their content - all using 100% free and open-source tools.

## ✨ Features

- 📄 **Multi-format Support**: Upload and process PDF, DOCX, and TXT documents
- 🤖 **RAG-Powered Q&A**: Ask questions and get answers based on document content
- 💾 **Vector Database**: Uses ChromaDB for efficient similarity search
- 🔍 **Smart Chunking**: Automatic text chunking with overlapping for better context
- 🎨 **Modern UI**: Clean, responsive React interface with real-time chat
- 🔒 **Privacy-First**: All data stays on your server
- 💯 **100% Free**: No paid APIs or services required

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **ChromaDB**: Vector database for embeddings
- **Sentence Transformers**: Free embedding model (all-MiniLM-L6-v2)
- **PyPDF2**: PDF text extraction
- **python-docx**: DOCX processing

### Frontend
- **React**: UI library
- **Axios**: HTTP client
- **Modern CSS**: Responsive design with gradients

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Aksha0217/ai-documind-assistant.git
cd ai-documind-assistant
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

## 🎯 Running the Application

### Start Backend Server

```bash
cd backend

# Activate virtual environment if not already active
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Start the server
python main.py
```

The backend API will be available at `http://localhost:8000`

### Start Frontend Server

In a new terminal:

```bash
cd frontend

# Start the development server
npm start
```

The frontend will be available at `http://localhost:3000`

## 📖 Usage

1. **Upload a Document**
   - Click "Choose File" button
   - Select a PDF, DOCX, or TXT file
   - Wait for processing (embeddings are generated)

2. **Ask Questions**
   - Type your question in the chat input
   - Press "Ask" or hit Enter
   - Receive AI-generated answers based on document content

3. **Manage Documents**
   - View all uploaded documents in the sidebar
   - Select a specific document to query
   - Delete documents when no longer needed

## 🔧 API Endpoints

- `GET /` - Health check
- `POST /upload` - Upload and process a document
- `POST /ask` - Ask a question about documents
- `GET /documents` - List all uploaded documents
- `DELETE /documents/{document_id}` - Delete a document

## 🏗️ Architecture

The application uses Retrieval-Augmented Generation (RAG):

1. **Document Processing**
   - Extract text from uploaded documents
   - Split text into overlapping chunks
   - Generate embeddings using Sentence Transformers
   - Store embeddings in ChromaDB vector database

2. **Question Answering**
   - Generate embedding for user question
   - Retrieve most relevant text chunks using similarity search
   - Generate answer based on retrieved context

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the MIT License.

## 🙏 Acknowledgments

- **Sentence Transformers** for free embedding models
- **ChromaDB** for vector database
- **FastAPI** for the excellent Python web framework
- **React** for the UI library

## 📬 Contact

For questions or feedback, please open an issue on GitHub.

---

Built with ❤️ using 100% free and open-source tools
