# Contributing to AI-DocuMind Assistant

Thank you for your interest in contributing to AI-DocuMind Assistant! This document provides guidelines for contributing to the project.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (OS, Python version, Node version)
- Error messages or logs

### Suggesting Features

Feature requests are welcome! Please:
- Check if the feature has already been requested
- Clearly describe the feature and its benefits
- Provide examples of how it would work
- Consider implementation complexity

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
   ```bash
   git commit -m "Add feature: description"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request**

## Development Setup

### Backend Development

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend Development

```bash
cd frontend
npm install
npm start
```

## Code Style

### Python (Backend)
- Follow PEP 8 style guide
- Use type hints where appropriate
- Add docstrings to functions and classes
- Keep functions focused and small

### JavaScript (Frontend)
- Use ES6+ features
- Follow React best practices
- Use meaningful variable names
- Add comments for complex logic

## Testing

Before submitting a PR:
1. Test your changes manually
2. Ensure existing features still work
3. Test with different document types
4. Check browser console for errors
5. Verify API responses

## Documentation

When adding features:
- Update README.md if needed
- Add comments to complex code
- Update USAGE_GUIDE.md for user-facing features
- Document new API endpoints

## Pull Request Process

1. Ensure code follows style guidelines
2. Update documentation
3. Test thoroughly
4. Provide clear PR description
5. Link related issues

## Areas for Contribution

### Easy Issues (Good First Issues)
- UI improvements
- Documentation updates
- Bug fixes
- Error message improvements

### Medium Complexity
- New file format support
- UI features (dark mode, themes)
- Performance optimizations
- Additional API endpoints

### Advanced
- Local LLM integration
- Advanced RAG techniques
- Multi-user authentication
- Advanced search features

## Questions?

Open a discussion on GitHub if you have questions about contributing.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

Thank you for contributing to AI-DocuMind Assistant! 🎉
