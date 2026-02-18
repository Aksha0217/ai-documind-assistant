from pathlib import Path
from typing import Optional
import pypdf
from docx import Document

class DocumentProcessor:
    """Process different document types and extract text content"""
    
    def process_document(self, file_path: str) -> str:
        """Process a document and return its text content"""
        path = Path(file_path)
        extension = path.suffix.lower()
        
        if extension == ".pdf":
            return self._process_pdf(file_path)
        elif extension == ".docx":
            return self._process_docx(file_path)
        elif extension == ".txt":
            return self._process_txt(file_path)
        else:
            raise ValueError(f"Unsupported file type: {extension}")
    
    def _process_pdf(self, file_path: str) -> str:
        """Extract text from PDF file"""
        text = []
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = pypdf.PdfReader(file)
                for page in pdf_reader.pages:
                    text.append(page.extract_text())
            return "\n".join(text)
        except Exception as e:
            raise Exception(f"Error processing PDF: {str(e)}")
    
    def _process_docx(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            doc = Document(file_path)
            text = []
            for paragraph in doc.paragraphs:
                text.append(paragraph.text)
            return "\n".join(text)
        except Exception as e:
            raise Exception(f"Error processing DOCX: {str(e)}")
    
    def _process_txt(self, file_path: str) -> str:
        """Extract text from TXT file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        except Exception as e:
            raise Exception(f"Error processing TXT: {str(e)}")
