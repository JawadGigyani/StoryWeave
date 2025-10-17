# StoryWeave 🎭🎵

**AI-Powered Personalized Wellness Storytelling Platform**

StoryWeave is an innovative mental wellness platform that generates personalized therapeutic stories with AI-narrated audio and custom background music. Built for HackVortex Codestorm 5, this application combines cutting-edge AI technologies to create immersive, multi-sensory wellness experiences tailored to individual needs.

[![Demo Video](https://img.shields.io/badge/Demo-YouTube-red?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=LpqPBd-gfik)

## 🌟 Overview

StoryWeave transforms mental wellness support by:

- **Personalized Story Generation**: Using Google Gemini AI to create therapeutic narratives based on user topics
- **Lifelike Narration**: ElevenLabs Text-to-Speech for natural, soothing voice narration
- **Custom Background Music**: AI-generated instrumental music that matches the story's emotional tone
- **Professional Audio Mixing**: FFmpeg-powered seamless integration of speech and music
- **Accessible Design**: Clean, calming interface suitable for all ages and abilities

### Key Features

✨ **Personalized Content** - Stories tailored to specific wellness needs (stress relief, motivation, sleep, etc.)  
🎙️ **High-Quality Audio** - Professional narration with lifelike voice synthesis  
🎵 **Custom Music** - AI-generated instrumental soundtracks for each story  
📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile  
⚡ **Fast Generation** - Complete story with audio in 20-50 seconds  
🔒 **Secure** - Environment-based API key management

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 15.5.5** (App Router with Turbopack)
- **React 19.1.0**
- **TypeScript 5.x**
- **Tailwind CSS 4**
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend

- **Python 3.11.9**
- **FastAPI** - High-performance async API
- **Google Gemini AI** (gemini-2.5-pro) - Story generation
- **ElevenLabs** - Text-to-Speech & Music Generation
- **LangChain & LangGraph** - AI workflow orchestration
- **FFmpeg** - Audio processing and mixing

### Infrastructure

- **Docker** - Containerization
- **DigitalOcean** - Cloud hosting
- **Git** - Version control

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python 3.11.9** - [Download](https://www.python.org/downloads/)
- **FFmpeg** - Audio processing library
- **Git** - Version control

### Installing FFmpeg

#### Windows:

**Option 1: Using Chocolatey (Recommended)**

```bash
choco install ffmpeg
```

**Option 2: Manual Installation**

1. Download FFmpeg from [ffmpeg.org/download.html](https://ffmpeg.org/download.html)
2. Choose "Windows builds from gyan.dev" or "Windows builds by BtbN"
3. Download the **"ffmpeg-release-essentials.zip"** file
4. Extract the ZIP file to a location (e.g., `C:\ffmpeg`)
5. Add FFmpeg to System PATH:
   - Open **System Properties** (Win + Pause/Break or Right-click "This PC" → Properties)
   - Click **Advanced system settings**
   - Click **Environment Variables**
   - Under **System Variables**, find and select **Path**, then click **Edit**
   - Click **New** and add the path to FFmpeg's `bin` folder (e.g., `C:\ffmpeg\bin`)
   - Click **OK** on all windows
   - **Restart your terminal** for changes to take effect

**Verify Installation:**

```bash
# Open a NEW terminal window and run:
ffmpeg -version
ffprobe -version
```

#### macOS:

```bash
# Using Homebrew (Recommended)
brew install ffmpeg

# Verify installation
ffmpeg -version
```

#### Linux (Ubuntu/Debian):

```bash
sudo apt update
sudo apt install ffmpeg

# Verify installation
ffmpeg -version
```

**⚠️ Important:** After installing FFmpeg, make sure to **restart your terminal** or IDE for the PATH changes to take effect.

---

## 🚀 Local Setup Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/JawadGigyani/StoryWeave.git
cd StoryWeave
```

---

### Step 2: Frontend Setup

#### 2.1 Navigate to Frontend Directory

```bash
cd frontend
```

#### 2.2 Install Node Dependencies

```bash
npm install
```

or using yarn:

```bash
yarn install
```

#### 2.3 Create Frontend Environment File

Create a `.env.local` file in the `frontend` directory:

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Environment Variables Explained:**

- `NEXT_PUBLIC_API_URL` - Backend API URL (use `http://localhost:8000` for local development)

#### 2.4 Start Frontend Development Server

```bash
npm run dev
```

The frontend will be available at: **http://localhost:3000**

---

### Step 3: Backend Setup

#### 3.1 Navigate to Backend Directory

Open a new terminal window and navigate to the backend directory:

```bash
cd backend
```

#### 3.2 Create Python Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment

# Windows:
venv\Scripts\Activate

# macOS/Linux:
source venv/bin/activate
```

#### 3.3 Install Python Dependencies

```bash
pip install -r requirements.txt
```

**Dependencies installed:**

- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `langchain` & `langchain-google-genai` - Google Gemini AI integration
- `langgraph` - Workflow orchestration
- `elevenlabs` - Text-to-Speech and Music Generation
- `python-dotenv` - Environment variable management
- `requests` - HTTP library

#### 3.4 Create Backend Environment File

Create a `.env` file in the `backend` directory:

```bash
# backend/.env

# Google Gemini AI API Key
GOOGLE_API_KEY=your_google_gemini_api_key_here

# ElevenLabs API Key
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Frontend Origin (for CORS)
FRONTEND_ORIGIN=http://localhost:3000

# Server Port (optional, defaults to 8000)
PORT=8000
```

---

### Step 4: API Keys Setup

You'll need to obtain API keys from Google and ElevenLabs:

#### 4.1 Google Gemini AI API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/api-keys)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the API key
5. Add it to your `backend/.env` file as `GOOGLE_API_KEY`

**Documentation:** [Google AI for Developers](https://ai.google.dev/)

#### 4.2 ElevenLabs API Key

1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Sign up or log in
3. Navigate to your **[Developers Page - API Keys](https://elevenlabs.io/app/developers/api-keys)**
4. Copy your **API Key**
5. Add it to your `backend/.env` file as `ELEVENLABS_API_KEY`

**Free Tier:** ElevenLabs offers a free tier with monthly character limits for Text-to-Speech and Music Generation.

**Documentation:** [ElevenLabs API Docs](https://elevenlabs.io/docs)

---

### Step 5: Start the Backend Server

With the virtual environment activated and environment variables set:

```bash
# From the backend directory
python main.py
```

or using uvicorn directly:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The backend API will be available at: **http://localhost:8000**

**API Documentation:** http://localhost:8000/docs (FastAPI Swagger UI)

---

## 🎯 Running the Application

Once both frontend and backend are running:

1. **Open your browser** and navigate to: **http://localhost:3000**
2. **Enter a wellness topic** (e.g., "Managing exam stress", "Confidence building", "Peaceful sleep")
3. **Select story length** (Short, Medium, or Long)
4. **Click "Generate Story"**
5. **Wait 1-2 minutes** for the AI to generate your personalized story with audio
6. **Read or listen** to your custom wellness story with background music!

---

## 📁 Project Structure

```
StoryWeave/
├── frontend/                  # Next.js 15 Frontend
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   │   ├── layout.tsx    # Root layout
│   │   │   ├── page.tsx      # Home page
│   │   │   └── globals.css   # Global styles
│   │   ├── components/       # React Components
│   │   │   ├── StoryForm.tsx         # Story input form
│   │   │   ├── StoryDisplay.tsx      # Story text display
│   │   │   ├── AudioPlayer.tsx       # Audio playback
│   │   │   ├── LoadingSpinner.tsx    # Loading state
│   │   │   └── ErrorMessage.tsx      # Error display
│   │   ├── hooks/
│   │   │   └── useStoryGeneration.ts # Story generation hook
│   │   ├── types/
│   │   │   └── story.ts              # TypeScript types
│   │   └── config/
│   │       └── constants.ts          # Configuration
│   ├── package.json          # Node dependencies
│   ├── tsconfig.json         # TypeScript config
│   ├── next.config.ts        # Next.js config
│   └── .env.local            # Frontend environment variables
│
├── backend/                   # FastAPI Backend
│   ├── main.py               # Main application & LangGraph workflow
│   ├── requirements.txt      # Python dependencies
│   ├── Dockerfile            # Docker configuration
│   ├── Procfile              # Production server config
│   ├── runtime.txt           # Python version
│   ├── .env                  # Backend environment variables
│   └── outputs/              # Generated audio files
│
└── README.md                 # This file
```

---

## 🔧 Configuration

### Frontend Environment Variables

File: `frontend/.env.local`

| Variable              | Description     | Default                 |
| --------------------- | --------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

### Backend Environment Variables

File: `backend/.env`

| Variable             | Description              | Required              |
| -------------------- | ------------------------ | --------------------- |
| `GOOGLE_API_KEY`     | Google Gemini AI API key | ✅ Yes                |
| `ELEVENLABS_API_KEY` | ElevenLabs API key       | ✅ Yes                |
| `FRONTEND_ORIGIN`    | Frontend URL for CORS    | ⚠️ Recommended        |
| `PORT`               | Server port              | ❌ No (default: 8000) |

---

## 🎬 How It Works

StoryWeave uses a sophisticated 6-step AI workflow orchestrated by LangGraph:

```
1. Story Generation (Gemini AI)
   ↓
2. Music Prompt Creation (Gemini AI)
   ↓
3. Text-to-Speech Synthesis (ElevenLabs)
   ↓
4. Audio Duration Calculation (FFprobe)
   ↓
5. Background Music Generation (ElevenLabs)
   ↓
6. Audio Mixing (FFmpeg)
```

### Workflow Details:

1. **Story Generation**: Google Gemini AI creates a personalized therapeutic story based on user input
2. **Music Prompt**: AI analyzes the story's emotional tone and generates a music description
3. **Speech Synthesis**: ElevenLabs converts the story text into natural-sounding speech
4. **Duration Check**: FFprobe calculates the exact speech duration
5. **Music Creation**: ElevenLabs generates instrumental music matching the story length
6. **Audio Mixing**: FFmpeg blends speech and music (15% music volume) into final output

---

## 🎥 Demo Video

Watch **StoryWeave** in action:

## [![StoryWeave Demo](https://img.youtube.com/vi/LpqPBd-gfik/maxresdefault.jpg)](https://www.youtube.com/watch?v=LpqPBd-gfik)

## 👥 Team

**Team Story Weave** - Built for HackVortex Codestorm 5

- **Muhammad Jawad** - AI Engineer (LangGraph orchestration, Gemini AI integration)
- **Hamad Khan** - AI Engineer (ElevenLabs APIs, audio optimization)
- **Ali Ahmad** - Full-Stack Developer (Next.js frontend, FastAPI backend)
- **Muhammad Ilyas** - Full-Stack Developer (Docker, deployment, infrastructure)

---

## 📄 License

This project was created for HackVortex Codestorm 5 hackathon.

---

## 🤝 Contributing

This project was built for a hackathon, but we welcome feedback and suggestions! Feel free to:

- Report bugs
- Suggest features
- Share your experience
