from typing import List, Tuple, Dict
import chromadb
import uuid
from datetime import datetime
import hashlib
import re

class SimpleTextEmbedding:
    """Simple text embedding function that doesn't require external models"""
    
    def __call__(self, input: List[str]) -> List[List[float]]:
        """Generate simple embeddings from text"""
        embeddings = []
        for text in input:
            # Create a simple embedding based on word frequencies and hash
            words = re.findall(r'\w+', text.lower())
            # Create a fixed-size vector (384 dimensions to match typical models)
            vector = [0.0] * 384
            
            for i, word in enumerate(words[:384]):
                # Use hash to generate consistent values for words
                hash_val = int(hashlib.md5(word.encode()).hexdigest(), 16)
                vector[i % 384] += (hash_val % 100) / 100.0
            
            # Normalize
            magnitude = sum(x**2 for x in vector) ** 0.5
            if magnitude > 0:
                vector = [x / magnitude for x in vector]
            
            embeddings.append(vector)
        
        return embeddings

class RAGEngine:
    """Retrieval-Augmented Generation engine using ChromaDB"""
    
    def __init__(self):
        # Initialize ChromaDB with persistent client
        self.client = chromadb.PersistentClient(path="./chroma_db")
        
        # Use custom embedding function that doesn't need internet
        embedding_fn = SimpleTextEmbedding()
        
        # Create or get collection
        self.collection = self.client.get_or_create_collection(
            name="documents",
            embedding_function=embedding_fn,
            metadata={"description": "Document embeddings for RAG"}
        )
        
        # Store document metadata
        self.documents = {}
    
    def add_document(self, text: str, filename: str) -> str:
        """Add a document to the vector database"""
        # Generate unique document ID
        doc_id = str(uuid.uuid4())
        
        # Split text into chunks for better retrieval
        chunks = self._chunk_text(text)
        
        # Create IDs for each chunk
        chunk_ids = [f"{doc_id}_chunk_{i}" for i in range(len(chunks))]
        
        # Add to ChromaDB (it will automatically generate embeddings)
        self.collection.add(
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
        # Query ChromaDB for relevant chunks
        results = self.collection.query(
            query_texts=[question],
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
