import os
from typing import List, Tuple, Optional
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
import PyPDF2
import docx
import json

from document_processor import DocumentProcessor


class RAGEngine:
    """Retrieval-Augmented Generation engine for document Q&A"""
    
    def __init__(self):
        # Initialize embedding model (using free sentence-transformers)
        print("Loading embedding model...")
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Initialize ChromaDB for vector storage
        print("Initializing vector database...")
        self.client = chromadb.Client(Settings(
            chroma_db_impl="duckdb+parquet",
            persist_directory="./chroma_db"
        ))
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name="documents",
            metadata={"hnsw:space": "cosine"}
        )
        
        # Initialize document processor
        self.doc_processor = DocumentProcessor()
        
        # Store document metadata
        self.metadata_file = "document_metadata.json"
        self.metadata = self._load_metadata()
        
        print("RAG Engine initialized successfully")
    
    def _load_metadata(self) -> dict:
        """Load document metadata from file"""
        if os.path.exists(self.metadata_file):
            with open(self.metadata_file, 'r') as f:
                return json.load(f)
        return {}
    
    def _save_metadata(self):
        """Save document metadata to file"""
        with open(self.metadata_file, 'w') as f:
            json.dump(self.metadata, f, indent=2)
    
    def process_document(self, file_path: str, doc_id: str, filename: str):
        """Process a document and add it to the vector database"""
        
        # Extract text from document
        text = self.doc_processor.extract_text(file_path)
        
        if not text or len(text.strip()) == 0:
            raise ValueError("No text could be extracted from the document")
        
        # Split text into chunks
        chunks = self.doc_processor.chunk_text(text, chunk_size=500, overlap=50)
        
        if not chunks:
            raise ValueError("Document could not be split into chunks")
        
        # Generate embeddings for chunks
        embeddings = self.embedding_model.encode(chunks).tolist()
        
        # Create IDs for chunks
        chunk_ids = [f"{doc_id}_chunk_{i}" for i in range(len(chunks))]
        
        # Create metadata for each chunk
        metadatas = [
            {
                "document_id": doc_id,
                "filename": filename,
                "chunk_index": i,
                "total_chunks": len(chunks)
            }
            for i in range(len(chunks))
        ]
        
        # Add to ChromaDB
        self.collection.add(
            ids=chunk_ids,
            embeddings=embeddings,
            documents=chunks,
            metadatas=metadatas
        )
        
        # Store document metadata
        self.metadata[doc_id] = {
            "filename": filename,
            "file_path": file_path,
            "num_chunks": len(chunks),
            "text_length": len(text)
        }
        self._save_metadata()
        
        print(f"Processed document '{filename}': {len(chunks)} chunks created")
    
    def answer_question(
        self,
        question: str,
        document_id: Optional[str] = None,
        top_k: int = 3
    ) -> Tuple[str, List[str]]:
        """Answer a question using RAG"""
        
        # Generate embedding for the question
        question_embedding = self.embedding_model.encode([question]).tolist()
        
        # Prepare filter if document_id is specified
        where_filter = None
        if document_id:
            where_filter = {"document_id": document_id}
        
        # Query ChromaDB for relevant chunks
        results = self.collection.query(
            query_embeddings=question_embedding,
            n_results=top_k,
            where=where_filter
        )
        
        if not results['documents'] or len(results['documents'][0]) == 0:
            return "I don't have any information to answer this question. Please upload a document first.", []
        
        # Get relevant text chunks
        relevant_chunks = results['documents'][0]
        sources = [
            f"{meta['filename']} (chunk {meta['chunk_index'] + 1}/{meta['total_chunks']})"
            for meta in results['metadatas'][0]
        ]
        
        # Create context from relevant chunks
        context = "\n\n".join(relevant_chunks)
        
        # Generate answer using the context
        answer = self._generate_answer(question, context)
        
        return answer, sources
    
    def _generate_answer(self, question: str, context: str) -> str:
        """Generate an answer based on context (simple extraction-based approach)"""
        
        # For a fully free solution, we use a simple extraction-based approach
        # This can be enhanced with a free local LLM like GPT4All or Llama.cpp
        
        # Simple approach: return the most relevant context with a prefix
        answer = f"Based on the document content:\n\n{context}\n\nTo answer your question '{question}', the relevant information is provided above."
        
        # If the context is too long, truncate it
        max_length = 1000
        if len(answer) > max_length:
            answer = answer[:max_length] + "..."
        
        return answer
    
    def list_documents(self) -> List[dict]:
        """List all processed documents"""
        
        documents = []
        for doc_id, meta in self.metadata.items():
            documents.append({
                "document_id": doc_id,
                "filename": meta["filename"],
                "num_chunks": meta["num_chunks"],
                "text_length": meta["text_length"]
            })
        
        return documents
    
    def delete_document(self, document_id: str):
        """Delete a document from the vector database"""
        
        if document_id not in self.metadata:
            raise ValueError(f"Document {document_id} not found")
        
        # Get all chunk IDs for this document
        results = self.collection.get(
            where={"document_id": document_id}
        )
        
        if results['ids']:
            # Delete from ChromaDB
            self.collection.delete(ids=results['ids'])
        
        # Remove from metadata
        del self.metadata[document_id]
        self._save_metadata()
        
        print(f"Deleted document {document_id}")
