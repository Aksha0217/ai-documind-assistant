# 📸 AI-DocuMind Assistant - Usage Guide

This guide demonstrates how to use the AI-DocuMind Assistant application with step-by-step instructions and examples.

## Getting Started

### Step 1: Start the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   python main.py
   ```
   You should see:
   ```
   Loading embedding model...
   Initializing vector database...
   RAG Engine initialized successfully
   INFO:     Uvicorn running on http://0.0.0.0:8000
   ```

2. **Start the Frontend Server** (in a new terminal)
   ```bash
   cd frontend
   npm start
   ```
   The browser will automatically open to `http://localhost:3000`

### Step 2: Upload Your First Document

The application welcomes you with a clean interface:
- **Left Sidebar**: Upload section and document list
- **Main Area**: Chat interface for asking questions

**To upload a document:**
1. Click the **"Choose File (PDF, DOCX, TXT)"** button
2. Select a document from your computer
3. Wait for the upload and processing to complete (a few seconds)
4. The document will appear in the "Documents" list

**Example documents you can try:**
- Research papers (PDF)
- Meeting notes (DOCX)
- Code documentation (TXT)
- The included `test_document.txt` file

### Step 3: Ask Questions

Once a document is uploaded:
1. The document is automatically selected (highlighted in blue)
2. Type your question in the chat input at the bottom
3. Click **"Ask"** or press Enter
4. The AI will analyze the document and provide an answer with sources

**Example Questions for test_document.txt:**
- "What is AI-DocuMind Assistant?"
- "What file formats are supported?"
- "How does the RAG system work?"
- "What are the key features?"
- "What technology is used in the backend?"

### Step 4: View Answers and Sources

Each answer includes:
- **Answer Text**: The relevant information from your document
- **Sources**: Which chunks of the document were used
- **Timestamp**: When the question was asked

The chat interface shows:
- 👤 Your questions (in blue)
- 🤖 AI answers (in gray)
- ⚠️ Error messages (in red, if any)

### Step 5: Manage Multiple Documents

**Upload Multiple Documents:**
- Upload as many documents as you need
- Each document is processed independently
- Click on a document in the sidebar to select it

**Ask Questions Across Documents:**
- Select a specific document to query just that document
- Or leave "All documents" selected to search across all uploaded files

**Delete Documents:**
- Click the 🗑️ icon next to any document
- Confirm the deletion
- The document and its data will be removed

## Usage Tips

### 💡 Best Practices

1. **Ask Specific Questions**
   - ✅ Good: "What are the system requirements?"
   - ❌ Less effective: "Tell me about this"

2. **Break Down Complex Queries**
   - Instead of: "Explain everything about the technology stack, features, and benefits"
   - Try: Ask three separate questions

3. **Use Natural Language**
   - Questions can be conversational
   - "How does it work?" is just as good as "Explain the working mechanism"

4. **Check Sources**
   - Review which chunks were used
   - Helps verify the accuracy of answers

### 📁 Supported File Types

| Format | Extension | Notes |
|--------|-----------|-------|
| PDF | `.pdf` | Most common format |
| Word Document | `.docx` | Office documents |
| Plain Text | `.txt` | Simple text files |

### 🚀 Performance

- **First Upload**: May take 10-30 seconds due to model initialization
- **Subsequent Uploads**: Usually 2-5 seconds
- **Questions**: Answered in 1-2 seconds
- **Document Size**: Works well with documents up to several MB

### 🔒 Privacy & Security

- All processing happens locally on your server
- Documents are stored in the `backend/uploads/` directory
- No data is sent to external services (except for one-time model download)
- Vector embeddings are stored in `backend/chroma_db/`

## Example Workflow

### Scenario: Analyzing a Research Paper

1. **Upload**: Upload your research paper PDF
2. **Overview**: Ask "What is the main topic of this paper?"
3. **Methodology**: Ask "What methodology was used?"
4. **Results**: Ask "What were the key findings?"
5. **Conclusion**: Ask "What are the limitations mentioned?"

### Scenario: Reviewing Meeting Notes

1. **Upload**: Upload meeting notes (DOCX or TXT)
2. **Action Items**: Ask "What are the action items?"
3. **Decisions**: Ask "What decisions were made?"
4. **Next Steps**: Ask "What are the next steps?"

### Scenario: Understanding Code Documentation

1. **Upload**: Upload API documentation or README
2. **Setup**: Ask "How do I install this?"
3. **Usage**: Ask "How do I use the main features?"
4. **Troubleshooting**: Ask "What are common issues?"

## Keyboard Shortcuts

- **Enter**: Send question (when in input field)
- **Escape**: Clear input field (focus must be in input)

## Limitations

1. **Context Window**: Each chunk is ~500 characters, so very detailed answers may be split
2. **Answer Quality**: Uses context extraction, not generative AI (can be enhanced with local LLM)
3. **File Size**: Very large files (>10MB) may take longer to process
4. **Languages**: Works best with English text, but supports other languages

## Troubleshooting

If you encounter issues:
1. Check the `TROUBLESHOOTING.md` file
2. Review backend console logs for errors
3. Check browser console (F12) for frontend errors
4. Ensure both backend and frontend are running

## Advanced Usage

### Custom Model Selection

Edit `backend/rag_engine.py` to use a different embedding model:
```python
self.embedding_model = SentenceTransformer('all-mpnet-base-v2')  # Higher quality
```

### Adjust Chunk Size

Edit `backend/rag_engine.py` to change chunking:
```python
chunks = self.doc_processor.chunk_text(text, chunk_size=1000, overlap=100)
```

### Change Number of Retrieved Chunks

Edit `backend/rag_engine.py` in the `answer_question` method:
```python
results = self.collection.query(
    query_embeddings=question_embedding,
    n_results=5,  # Retrieve more chunks for more context
    where=where_filter
)
```

## Next Steps

- Integrate a local LLM (GPT4All, Llama.cpp) for better answer generation
- Add support for more file formats (PPTX, HTML, Markdown)
- Implement document summarization
- Add chat history persistence
- Enable multi-language support

---

**Enjoy using AI-DocuMind Assistant! 🚀**

For issues or questions, please open an issue on GitHub.
