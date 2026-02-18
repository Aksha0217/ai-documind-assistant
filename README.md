# 🧠 AI-DocuMind Assistant

An AI-powered full-stack web application for intelligent document analysis using Retrieval-Augmented Generation (RAG). Upload documents (PDF, DOCX, TXT), analyze them, and ask questions based on their content - featuring stunning 3D animations and modern glassmorphism UI design. Built with 100% free and open-source tools.

## ✨ Features

### Core Functionality
- 📄 **Multi-format Support**: Upload and process PDF, DOCX, and TXT documents
- 🤖 **RAG-Powered Q&A**: Ask questions and get answers based on document content
- 💾 **Vector Database**: Uses ChromaDB for efficient similarity search
- 🔍 **Smart Chunking**: Automatic text chunking with overlapping for better context
- 🔒 **Privacy-First**: All data stays on your server
- 💯 **100% Free**: No paid APIs or services required

### 🎨 NEW: Modern 3D UI
- ✨ **3D Animated Background**: Floating particles and 3D objects powered by Three.js
- 🪟 **Glassmorphism Design**: Frosted glass effects with backdrop blur
- 🎭 **Smooth Animations**: Framer Motion for buttery smooth transitions
- 📱 **Fully Responsive**: Works beautifully on all devices
- 🎯 **Interactive Elements**: Hover effects and micro-interactions
- 🔔 **Toast Notifications**: Real-time feedback with react-hot-toast
- 🌀 **3D Loading Spinners**: Elegant loading states

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **ChromaDB**: Vector database for embeddings
- **Sentence Transformers**: Free embedding model (all-MiniLM-L6-v2)
- **PyPDF2**: PDF text extraction
- **python-docx**: DOCX processing

### Frontend
- **React 18**: UI library
- **Three.js**: 3D graphics and animations
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers for React Three Fiber
- **Framer Motion**: Animation library
- **React Hot Toast**: Toast notifications
- **Axios**: HTTP client
- **Modern CSS**: Glassmorphism and responsive design

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

## 🚢 Deployment

### Vercel Deployment (Recommended)

The application is fully configured for Vercel deployment with the included `vercel.json`:

1. **Fork or clone** this repository
2. **Connect to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your repository
   - Vercel auto-detects configuration
3. **Deploy**: Click "Deploy" and you're done!

The app includes:
- ✅ Serverless backend functions
- ✅ Optimized frontend build
- ✅ Automatic API routing
- ✅ Production-ready configuration

For detailed instructions, see [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

### Build for Production

```bash
# Build frontend
cd frontend
npm run build

# The build folder is ready to be deployed
# Serve with any static hosting service
```

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
