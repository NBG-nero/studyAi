# StudyAI 📗

Upload any course document and get instant flashcards, quizzes & past questions powered by Claude AI.

## Deploy to Vercel (free, 2 minutes)

1. **Push to GitHub**
   - Create a new repo at github.com
   - Upload all these files to it

2. **Deploy on Vercel**
   - Go to vercel.com → New Project
   - Import your GitHub repo
   - In "Environment Variables" add:
     ```
     ANTHROPIC_API_KEY = sk-ant-xxxxxxxx  ← your key from console.anthropic.com
     ```
   - Click Deploy

3. **Done** — share the `.vercel.app` link with anyone!

## Add to Android Home Screen
- Open the app URL in Chrome on Android
- Tap the 3-dot menu → "Add to Home Screen"
- It installs like a native app

## Local Development
```bash
npm install
cp .env.example .env.local
# edit .env.local and add your key
npm run dev
```
