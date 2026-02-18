# Troubleshooting Guide

## Security Updates

### Recent Security Fixes (February 2026)

**FastAPI & python-multipart vulnerabilities fixed:**
- Updated `fastapi` from 0.109.0 to >=0.109.1 (fixes ReDoS vulnerability)
- Updated `python-multipart` from 0.0.6 to >=0.0.22 (fixes multiple vulnerabilities)

If you installed before these fixes, please update:
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install --upgrade -r requirements.txt
```

## Common Issues and Solutions

### Issue: "Failed to resolve 'huggingface.co'" or Model Download Errors

**Problem**: The sentence-transformers library needs to download the embedding model from HuggingFace on first run, but cannot reach the internet.

**Solutions**:

1. **Pre-download the model** (recommended):
   ```bash
   python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"
   ```
   Run this command before starting the server to download the model (~80MB).

2. **Use a different model** that you already have downloaded:
   Edit `backend/rag_engine.py` and change the model name in this line:
   ```python
   self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
   ```
   to any model you have locally.

3. **Check internet connectivity**:
   - Ensure your firewall isn't blocking huggingface.co
   - Try accessing https://huggingface.co in your browser
   - Check if you need proxy settings

### Issue: NumPy Compatibility Error

**Problem**: `AttributeError: np.float_ was removed in the NumPy 2.0 release`

**Solution**: The requirements.txt already includes `numpy<2.0` to prevent this. If you still encounter it:
```bash
pip install "numpy<2.0" --force-reinstall
```

### Issue: Port Already in Use

**Problem**: `Error: [Errno 98] Address already in use`

**Solution**: 
1. Check if another process is using port 8000:
   ```bash
   lsof -i :8000
   ```
2. Kill the process or change the port in `backend/main.py`:
   ```python
   uvicorn.run(app, host="0.0.0.0", port=8001)  # Use different port
   ```

### Issue: Frontend Cannot Connect to Backend

**Problem**: API calls failing with CORS or connection errors

**Solution**:
1. Ensure backend is running on port 8000
2. Check the API_URL in frontend - it should match your backend URL
3. For production, update `REACT_APP_API_URL` environment variable

### Issue: Document Upload Fails

**Problem**: Files not uploading or processing errors

**Solutions**:
1. **Check file format**: Only PDF, DOCX, and TXT are supported
2. **Check file size**: Large files may take longer to process
3. **Check logs**: Look at backend console for detailed error messages
4. **Check permissions**: Ensure the `uploads/` directory is writable

### Issue: Vector Database Errors

**Problem**: ChromaDB errors or persistence issues

**Solution**:
1. Delete the `backend/chroma_db/` directory to reset:
   ```bash
   rm -rf backend/chroma_db
   rm backend/document_metadata.json
   ```
2. Restart the backend server

## Performance Tips

1. **Faster Processing**: The first document upload may be slower due to model initialization
2. **Memory Usage**: Each document is chunked into ~500 character pieces. Very large documents may use significant memory
3. **Better Answers**: Use specific questions that can be answered from the document content
4. **Model Selection**: all-MiniLM-L6-v2 is fast and lightweight. For better quality, you can use larger models like 'all-mpnet-base-v2'

## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload - changes will be reflected automatically
2. **API Testing**: Use tools like curl or Postman to test API endpoints directly:
   ```bash
   curl http://localhost:8000/
   curl http://localhost:8000/documents
   ```
3. **Debug Mode**: Add debug prints in Python code for troubleshooting

## Getting Help

If you encounter issues not covered here:
1. Check the GitHub Issues page
2. Enable debug logging in the backend
3. Check browser console for frontend errors
4. Review the API documentation in README.md
