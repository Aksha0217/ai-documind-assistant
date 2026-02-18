# ai-documind-assistant

AI-DocuMind Assistant is an AI-powered document analysis application that reads, understands, and summarizes uploaded documents automatically. It leverages Natural Language Processing (NLP) to extract key insights and generate concise summaries, helping users quickly analyze large volumes of text efficiently.

## Features

- 📄 Document upload support (PDF, TXT, DOC, DOCX)
- 🤖 AI-powered document analysis
- 📝 Automatic summarization and key insights extraction
- 🎨 Modern, responsive UI built with React

## Tech Stack

- **Frontend**: React 19
- **Build Tool**: Vite
- **Styling**: CSS3
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Aksha0217/ai-documind-assistant.git
cd ai-documind-assistant
```

2. Install dependencies:
```bash
npm install
```

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build the application for production:
```bash
npm run build
```

The production-ready files will be generated in the `build/` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

## Deployment

### Vercel Deployment

This project is configured for deployment on Vercel. The `vercel.json` file specifies:
- Build command: `npm run build`
- Output directory: `build`
- Dev command: `npm run dev`

To deploy:
1. Push your code to GitHub
2. Import the project in Vercel
3. Vercel will automatically detect the configuration and deploy

Alternatively, use the Vercel CLI:
```bash
vercel
```

## Project Structure

```
ai-documind-assistant/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── vercel.json          # Vercel deployment configuration
└── package.json         # Project dependencies and scripts
```

## Configuration

### Build Output Directory

The build output directory is configured in two places:

1. **vite.config.js**: Sets the output directory to `build`
```javascript
build: {
  outDir: 'build',
}
```

2. **vercel.json**: Tells Vercel where to find the built files
```json
{
  "outputDirectory": "build"
}
```

## License

ISC
