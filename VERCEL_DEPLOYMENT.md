# Vercel Deployment Guide for AI-DocuMind Assistant

This guide will help you deploy the AI-DocuMind Assistant on Vercel with 3D animations and modern UI.

## Prerequisites

- A Vercel account (free tier works)
- Git repository connected to Vercel

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from project root:
```bash
vercel
```

### Option 2: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect the configuration
5. Click "Deploy"

## Configuration

The project includes a `vercel.json` file with the following configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "frontend/build"
      }
    },
    {
      "src": "backend/main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/main.py"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/build/$1"
    }
  ]
}
```

## Environment Variables

Set these in your Vercel project settings:

- `REACT_APP_API_URL`: Set to `/api` for production (already configured)

## Build Commands

### Frontend
The frontend is automatically built during deployment. The build command is:
```bash
cd frontend && npm install && npm run build
```

### Backend
The backend is deployed as serverless functions. Make sure your `backend/requirements.txt` is up to date.

## Post-Deployment

After deployment:

1. Your frontend will be available at `https://your-project.vercel.app`
2. The API will be available at `https://your-project.vercel.app/api`
3. The 3D animations and glassmorphism UI will be fully functional

## Features Deployed

- ✅ 3D animated background with floating particles
- ✅ Glassmorphism UI design
- ✅ Smooth animations with Framer Motion
- ✅ Toast notifications
- ✅ 3D loading spinners
- ✅ Responsive design for all devices
- ✅ RAG-powered document Q&A

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Check that all dependencies are installed:
```bash
cd frontend && npm install
```

2. Test the build locally:
```bash
cd frontend && npm run build
```

### API Connection Issues

If the frontend can't connect to the API:

1. Verify the API route in `vercel.json`
2. Check that `REACT_APP_API_URL` is set to `/api`
3. Ensure backend dependencies are in `requirements.txt`

### 3D Animation Performance

If animations are slow:

1. The animations automatically scale based on device performance
2. For low-end devices, some effects may be reduced
3. Check browser console for any WebGL errors

## Local Development

To run locally with the enhanced UI:

```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python main.py

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

The app will open at `http://localhost:3000` with full 3D animations.

## Custom Domain

To add a custom domain:

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow Vercel's DNS configuration instructions

## Monitoring

Vercel provides:
- Real-time logs in the dashboard
- Performance analytics
- Error tracking
- Function invocation metrics

## Support

For deployment issues:
- Check Vercel's [documentation](https://vercel.com/docs)
- Review deployment logs in Vercel dashboard
- Check GitHub repository issues

---

**Enjoy your deployed AI-DocuMind Assistant with stunning 3D animations! 🚀**
