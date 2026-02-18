import os
import PyPDF2
import docx
from typing import List


class DocumentProcessor:
    """Process documents and extract text"""
    
    def extract_text(self, file_path: str) -> str:
        """Extract text from PDF, DOCX, or TXT files"""
        
        file_ext = os.path.splitext(file_path)[1].lower()
        
        if file_ext == ".pdf":
            return self._extract_from_pdf(file_path)
        elif file_ext == ".docx":
            return self._extract_from_docx(file_path)
        elif file_ext == ".txt":
            return self._extract_from_txt(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_ext}")
    
    def _extract_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF"""
        
        text = ""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            raise ValueError(f"Error reading PDF: {str(e)}")
        
        return text.strip()
    
    def _extract_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX"""
        
        try:
            doc = docx.Document(file_path)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        except Exception as e:
            raise ValueError(f"Error reading DOCX: {str(e)}")
        
        return text.strip()
    
    def _extract_from_txt(self, file_path: str) -> str:
        """Extract text from TXT"""
        
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                text = file.read()
        except UnicodeDecodeError:
            # Try with different encoding
            try:
                with open(file_path, 'r', encoding='latin-1') as file:
                    text = file.read()
            except Exception as e:
                raise ValueError(f"Error reading TXT: {str(e)}")
        except Exception as e:
            raise ValueError(f"Error reading TXT: {str(e)}")
        
        return text.strip()
    
    def chunk_text(
        self,
        text: str,
        chunk_size: int = 500,
        overlap: int = 50
    ) -> List[str]:
        """Split text into overlapping chunks"""
        
        if not text:
            return []
        
        # Split by sentences (simple approach)
        sentences = text.replace('\n', ' ').split('. ')
        
        chunks = []
        current_chunk = ""
        
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
            
            # Add period back if it's not the last sentence
            if not sentence.endswith('.'):
                sentence += '.'
            
            # Check if adding this sentence would exceed chunk_size
            if len(current_chunk) + len(sentence) + 1 <= chunk_size:
                current_chunk += " " + sentence if current_chunk else sentence
            else:
                # Save current chunk and start new one
                if current_chunk:
                    chunks.append(current_chunk.strip())
                
                # Start new chunk with overlap
                if overlap > 0 and current_chunk:
                    # Take last 'overlap' characters from current chunk
                    overlap_text = current_chunk[-overlap:]
                    current_chunk = overlap_text + " " + sentence
                else:
                    current_chunk = sentence
        
        # Add the last chunk
        if current_chunk:
            chunks.append(current_chunk.strip())
        
        return chunks
