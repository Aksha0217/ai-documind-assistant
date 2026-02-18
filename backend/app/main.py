from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import shutil
from pathlib import Path

from app.document_processor import DocumentProcessor
from app.rag_engine import RAGEngine

app = FastAPI(title="AI-DocuMind Assistant", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
UPLOAD_DIR = Path("uploaded_docs")
UPLOAD_DIR.mkdir(exist_ok=True)

document_processor = DocumentProcessor()
rag_engine = RAGEngine()

class QuestionRequest(BaseModel):
    question: str
    document_id: str

class QuestionResponse(BaseModel):
    answer: str
    sources: List[str]

@app.get("/")
async def root():
    return {
        "message": "Welcome to AI-DocuMind Assistant API",
        "version": "1.0.0",
        "endpoints": {
            "upload": "/upload",
            "ask": "/ask",
            "documents": "/documents"
        }
    }

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload and process a document (PDF, DOCX, or TXT)"""
    try:
        # Validate file type
        allowed_extensions = [".pdf", ".docx", ".txt"]
        file_extension = Path(file.filename).suffix.lower()
        
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"File type not supported. Allowed types: {', '.join(allowed_extensions)}"
            )
        
        # Save uploaded file
        file_path = UPLOAD_DIR / file.filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Process document
        text_content = document_processor.process_document(str(file_path))
        
        # Add to RAG engine
        doc_id = rag_engine.add_document(text_content, file.filename)
        
        return {
            "status": "success",
            "message": "Document uploaded and processed successfully",
            "document_id": doc_id,
            "filename": file.filename,
            "content_length": len(text_content)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")

@app.post("/ask", response_model=QuestionResponse)
async def ask_question(request: QuestionRequest):
    """Ask a question about the uploaded document"""
    try:
        answer, sources = rag_engine.answer_question(request.question, request.document_id)
        
        return QuestionResponse(
            answer=answer,
            sources=sources
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error answering question: {str(e)}")

@app.get("/documents")
async def list_documents():
    """List all uploaded documents"""
    try:
        documents = rag_engine.list_documents()
        return {
            "status": "success",
            "documents": documents
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing documents: {str(e)}")

@app.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    """Delete a document from the system"""
    try:
        rag_engine.delete_document(document_id)
        return {
            "status": "success",
            "message": f"Document {document_id} deleted successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting document: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
