from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import shutil
from typing import List, Optional
import uuid

from rag_engine import RAGEngine

app = FastAPI(title="AI-DocuMind Assistant API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG engine
rag_engine = RAGEngine()

# Ensure upload directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


class QuestionRequest(BaseModel):
    question: str
    document_id: Optional[str] = None


class QuestionResponse(BaseModel):
    answer: str
    sources: List[str]


@app.get("/")
async def root():
    return {"message": "AI-DocuMind Assistant API is running"}


@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload and process a document (PDF, DOCX, or TXT)"""
    
    # Validate file type
    allowed_extensions = [".pdf", ".docx", ".txt"]
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"File type not supported. Allowed types: {', '.join(allowed_extensions)}"
        )
    
    # Generate unique document ID
    doc_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{doc_id}{file_ext}")
    
    # Save uploaded file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Process document with RAG engine
        rag_engine.process_document(file_path, doc_id, file.filename)
        
        return {
            "document_id": doc_id,
            "filename": file.filename,
            "message": "Document uploaded and processed successfully"
        }
    except Exception as e:
        # Clean up file if processing fails
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")


@app.post("/ask", response_model=QuestionResponse)
async def ask_question(request: QuestionRequest):
    """Ask a question about uploaded documents"""
    
    try:
        answer, sources = rag_engine.answer_question(
            request.question,
            document_id=request.document_id
        )
        
        return QuestionResponse(answer=answer, sources=sources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error answering question: {str(e)}")


@app.get("/documents")
async def list_documents():
    """List all uploaded documents"""
    
    try:
        documents = rag_engine.list_documents()
        return {"documents": documents}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing documents: {str(e)}")


@app.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    """Delete a document"""
    
    try:
        rag_engine.delete_document(document_id)
        
        # Clean up file
        for file in os.listdir(UPLOAD_DIR):
            if file.startswith(document_id):
                os.remove(os.path.join(UPLOAD_DIR, file))
                break
        
        return {"message": "Document deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting document: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
