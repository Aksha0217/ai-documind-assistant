"""Simple test script to verify backend functionality"""
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.document_processor import DocumentProcessor
from app.rag_engine import RAGEngine

def test_document_processor():
    """Test document processing"""
    print("Testing DocumentProcessor...")
    processor = DocumentProcessor()
    
    # Create a test text file
    test_file = "/tmp/test_document.txt"
    with open(test_file, 'w') as f:
        f.write("This is a test document. It contains information about artificial intelligence.")
    
    # Process the document
    content = processor.process_document(test_file)
    print(f"✓ Document processed successfully. Content length: {len(content)}")
    
    # Clean up
    os.remove(test_file)
    return content

def test_rag_engine():
    """Test RAG engine"""
    print("\nTesting RAG Engine...")
    rag = RAGEngine()
    
    # Add a document
    test_content = "Artificial intelligence is the simulation of human intelligence by machines. Machine learning is a subset of AI."
    doc_id = rag.add_document(test_content, "test.txt")
    print(f"✓ Document added with ID: {doc_id}")
    
    # Ask a question
    answer, sources = rag.answer_question("What is artificial intelligence?", doc_id)
    print(f"✓ Question answered successfully")
    print(f"  Answer: {answer[:100]}...")
    print(f"  Sources: {sources}")
    
    # List documents
    docs = rag.list_documents()
    print(f"✓ Documents listed: {len(docs)} document(s)")
    
    return doc_id

if __name__ == "__main__":
    print("=== AI-DocuMind Assistant Backend Tests ===\n")
    
    try:
        # Test document processor
        test_document_processor()
        
        # Test RAG engine
        test_rag_engine()
        
        print("\n=== All tests passed! ✓ ===")
    except Exception as e:
        print(f"\n✗ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
