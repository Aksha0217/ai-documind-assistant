#!/bin/bash

# End-to-end test script for AI-DocuMind Assistant

set -e

echo "========================================="
echo "AI-DocuMind Assistant E2E Test"
echo "========================================="
echo ""

# Check if backend is running
echo "Checking backend status..."
BACKEND_RESPONSE=$(curl -s http://localhost:8000/ || echo "ERROR")

if [[ $BACKEND_RESPONSE == *"Welcome to AI-DocuMind Assistant"* ]]; then
    echo "✓ Backend is running"
else
    echo "❌ Backend is not running. Please start it first."
    exit 1
fi

# Test 1: Upload a document
echo ""
echo "Test 1: Uploading document..."
UPLOAD_RESPONSE=$(curl -s -X POST http://localhost:8000/upload \
    -F "file=@sample_documents/sample.txt")

if [[ $UPLOAD_RESPONSE == *"success"* ]]; then
    echo "✓ Document uploaded successfully"
    DOCUMENT_ID=$(echo $UPLOAD_RESPONSE | grep -o '"document_id":"[^"]*"' | cut -d'"' -f4)
    echo "  Document ID: $DOCUMENT_ID"
else
    echo "❌ Document upload failed"
    echo "  Response: $UPLOAD_RESPONSE"
    exit 1
fi

# Test 2: Ask a question
echo ""
echo "Test 2: Asking a question..."
QUESTION="What is artificial intelligence?"
ASK_RESPONSE=$(curl -s -X POST http://localhost:8000/ask \
    -H "Content-Type: application/json" \
    -d "{\"question\": \"$QUESTION\", \"document_id\": \"$DOCUMENT_ID\"}")

if [[ $ASK_RESPONSE == *"answer"* ]]; then
    echo "✓ Question answered successfully"
    echo "  Question: $QUESTION"
    echo "  Answer preview: $(echo $ASK_RESPONSE | grep -o '"answer":"[^"]*"' | cut -d'"' -f4 | head -c 100)..."
else
    echo "❌ Question answering failed"
    echo "  Response: $ASK_RESPONSE"
    exit 1
fi

# Test 3: List documents
echo ""
echo "Test 3: Listing documents..."
LIST_RESPONSE=$(curl -s http://localhost:8000/documents)

if [[ $LIST_RESPONSE == *"documents"* ]]; then
    echo "✓ Documents listed successfully"
    DOC_COUNT=$(echo $LIST_RESPONSE | grep -o '"filename"' | wc -l)
    echo "  Number of documents: $DOC_COUNT"
else
    echo "❌ Listing documents failed"
    echo "  Response: $LIST_RESPONSE"
    exit 1
fi

# Test 4: Delete document
echo ""
echo "Test 4: Deleting document..."
DELETE_RESPONSE=$(curl -s -X DELETE http://localhost:8000/documents/$DOCUMENT_ID)

if [[ $DELETE_RESPONSE == *"success"* ]]; then
    echo "✓ Document deleted successfully"
else
    echo "❌ Document deletion failed"
    echo "  Response: $DELETE_RESPONSE"
    exit 1
fi

echo ""
echo "========================================="
echo "All Tests Passed! ✓"
echo "========================================="
echo ""
echo "The AI-DocuMind Assistant is working correctly!"
