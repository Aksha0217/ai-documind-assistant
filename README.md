# 🤖 AI-DocuMind Assistant

AI-DocuMind Assistant is a full-stack AI-powered web application that allows users to upload documents (PDF, DOCX, TXT), analyze them using Retrieval-Augmented Generation (RAG), and ask questions based only on the uploaded document content.

## ✨ Features

- 📄 **Document Upload**: Support for PDF, DOCX, and TXT files
- 🤖 **AI-Powered Q&A**: Ask questions about your documents using RAG
- 🔍 **Semantic Search**: Find relevant information using vector embeddings
- 💬 **Interactive Chat Interface**: User-friendly chat-based interaction
- 🆓 **100% Free & Open-Source**: No paid APIs required

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **LangChain**: Framework for LLM applications
- **ChromaDB**: Open-source vector database
- **Custom embeddings**: Simple text-based embeddings (no external model downloads required)
- **pypdf & python-docx**: Document processing

### Frontend
- **React 18**: Modern UI framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool
- **CSS3**: Custom styling with animations

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **npm or yarn**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Aksha0217/ai-documind-assistant.git
cd ai-documind-assistant
```

### 2. Backend Setup

```bash
# Navigate to backend directory
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

# Run the backend server
python -m uvicorn app.main:app --reload
```

The backend will start at `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will start at `http://localhost:3000`

## 📖 Usage

1. **Open your browser** and navigate to `http://localhost:3000`
2. **Upload a document** (PDF, DOCX, or TXT) using the drag-and-drop interface
3. **Wait for processing** - the document will be analyzed and embedded into the vector database
4. **Ask questions** about your document in the chat interface
5. **Get AI-powered answers** based solely on your document content

## 🏗️ Project Structure

```
ai-documind-assistant/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application
│   │   ├── document_processor.py # Document parsing
│   │   └── rag_engine.py        # RAG implementation
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DocumentUploader.tsx
│   │   │   ├── DocumentUploader.css
│   │   │   ├── ChatInterface.tsx
│   │   │   └── ChatInterface.css
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

## 🔧 API Endpoints

- `GET /` - API information
- `POST /upload` - Upload a document
- `POST /ask` - Ask a question about a document
- `GET /documents` - List all uploaded documents
- `DELETE /documents/{document_id}` - Delete a document

## 🎯 How It Works

1. **Document Upload**: Users upload documents through the web interface
2. **Text Extraction**: The system extracts text from PDF, DOCX, or TXT files
3. **Chunking**: Text is split into manageable chunks with overlap
4. **Embedding**: Each chunk is converted to vector embeddings using sentence-transformers
5. **Storage**: Embeddings are stored in ChromaDB vector database
6. **Query Processing**: User questions are converted to embeddings
7. **Retrieval**: Relevant document chunks are retrieved using semantic search
8. **Answer Generation**: Answers are generated based on retrieved context

## 🔒 Security & Privacy

- All processing happens locally - no data sent to external APIs
- Documents are stored locally on your machine
- No user data collection or tracking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with open-source AI tools
- ChromaDB for vector storage
- FastAPI and React communities

## 📧 Contact

For questions or support, please open an issue on GitHub.
