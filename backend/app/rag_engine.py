from typing import List, Tuple, Dict
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
import uuid
from datetime import datetime

class RAGEngine:
    """Retrieval-Augmented Generation engine using ChromaDB"""
    
    def __init__(self):
        # Initialize ChromaDB
        self.client = chromadb.Client(Settings(
            chroma_db_impl="duckdb+parquet",
            persist_directory="./chroma_db"
        ))
        
        # Create or get collection
        self.collection = self.client.get_or_create_collection(
            name="documents",
            metadata={"description": "Document embeddings for RAG"}
        )
        
        # Initialize embedding model (open-source)
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Store document metadata
        self.documents = {}
    
    def add_document(self, text: str, filename: str) -> str:
        """Add a document to the vector database"""
        # Generate unique document ID
        doc_id = str(uuid.uuid4())
        
        # Split text into chunks for better retrieval
        chunks = self._chunk_text(text)
        
        # Generate embeddings
        embeddings = self.embedding_model.encode(chunks).tolist()
        
        # Create IDs for each chunk
        chunk_ids = [f"{doc_id}_chunk_{i}" for i in range(len(chunks))]
        
        # Add to ChromaDB
        self.collection.add(
            embeddings=embeddings,
            documents=chunks,
            ids=chunk_ids,
            metadatas=[{"document_id": doc_id, "filename": filename, "chunk_index": i} 
                      for i in range(len(chunks))]
        )
        
        # Store document metadata
        self.documents[doc_id] = {
            "filename": filename,
            "num_chunks": len(chunks),
            "created_at": datetime.now().isoformat()
        }
        
        return doc_id
    
    def answer_question(self, question: str, document_id: str) -> Tuple[str, List[str]]:
        """Answer a question based on the document content"""
        # Generate question embedding
        question_embedding = self.embedding_model.encode([question]).tolist()
        
        # Query ChromaDB for relevant chunks
        results = self.collection.query(
            query_embeddings=question_embedding,
            n_results=3,
            where={"document_id": document_id}
        )
        
        if not results['documents'][0]:
            return "No relevant information found in the document.", []
        
        # Get relevant text chunks
        relevant_chunks = results['documents'][0]
        sources = [f"Chunk {i+1}" for i in range(len(relevant_chunks))]
        
        # Generate answer using simple extractive method
        # Note: For a full LLM integration, you would use Ollama or similar
        answer = self._generate_answer(question, relevant_chunks)
        
        return answer, sources
    
    def _generate_answer(self, question: str, context_chunks: List[str]) -> str:
        """Generate an answer from context chunks"""
        # Simple extractive approach - in production, use Ollama/LLM
        context = "\n\n".join(context_chunks)
        
        # For now, return the most relevant context with a prefix
        answer = f"Based on the document content:\n\n{context[:500]}..."
        
        # Add a note about the limitation
        if len(context) > 500:
            answer += "\n\n[Note: Answer truncated. Full context available in retrieved chunks.]"
        
        return answer
    
    def _chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
        """Split text into overlapping chunks"""
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size - overlap):
            chunk = " ".join(words[i:i + chunk_size])
            if chunk:
                chunks.append(chunk)
        
        return chunks if chunks else [text]
    
    def list_documents(self) -> List[Dict]:
        """List all documents in the system"""
        return [
            {
                "document_id": doc_id,
                **metadata
            }
            for doc_id, metadata in self.documents.items()
        ]
    
    def delete_document(self, document_id: str):
        """Delete a document and its embeddings"""
        # Get all chunk IDs for this document
        results = self.collection.get(
            where={"document_id": document_id}
        )
        
        if results['ids']:
            self.collection.delete(ids=results['ids'])
        
        # Remove from metadata
        if document_id in self.documents:
            del self.documents[document_id]
