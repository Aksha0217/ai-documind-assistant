# Contributing to AI-DocuMind Assistant

Thank you for your interest in contributing to AI-DocuMind Assistant! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/ai-documind-assistant.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit your changes: `git commit -am 'Add some feature'`
7. Push to the branch: `git push origin feature/your-feature-name`
8. Submit a pull request

## Development Setup

Follow the instructions in README.md to set up your development environment.

## Code Style

### Python (Backend)
- Follow PEP 8 style guidelines
- Use type hints where appropriate
- Add docstrings to functions and classes
- Keep functions focused and small

### TypeScript/React (Frontend)
- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Add comments for complex logic

## Testing

Before submitting a PR:

1. Run backend tests:
   ```bash
   cd backend
   source venv/bin/activate
   python test_backend.py
   ```

2. Test the frontend builds successfully:
   ```bash
   cd frontend
   npm run build
   ```

3. Run the end-to-end test:
   ```bash
   ./test_e2e.sh
   ```

## Pull Request Guidelines

- Provide a clear description of the changes
- Link to any relevant issues
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed

## Reporting Issues

When reporting issues, please include:

- Clear description of the problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (OS, Python version, Node version)
- Screenshots if applicable

## Feature Requests

We welcome feature requests! Please:

- Check if the feature has already been requested
- Provide a clear use case
- Explain why this feature would be useful
- Consider contributing the feature yourself

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to open an issue for any questions about contributing.
