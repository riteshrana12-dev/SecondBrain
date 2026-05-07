# <div align="center">SECOND BRAIN</div>

<div align="center">
  <img src="./assets/banner.gif" alt="SecondBrain Banner" width="100%" />
</div>

<div align="center">

AI-Powered Knowledge Management Platform with Semantic Search and Retrieval-Augmented Generation

Frontend Deployment: [https://second-brain-drab-two.vercel.app](https://second-brain-drab-two.vercel.app)

Backend Deployment: Render

</div>

## Preview Assets

Place all project screenshots, GIFs, or demo recordings inside:

```text
/assets
```

Recommended structure:

```text
assets/
├── banner.gif
├── dashboard.png
├── chat-interface.png
├── semantic-search.png
└── demo.mp4
```

You can display images inside the README using:

```md
<img src="./assets/dashboard.png" alt="Dashboard" width="100%" />
```

## Project Overview

SecondBrain is a full-stack AI-powered personal knowledge management platform designed to help users organize, retrieve, and interact with information intelligently.

The platform supports storing notes, PDFs, web links, and YouTube transcripts while enabling semantic search and contextual AI conversations through a Retrieval-Augmented Generation (RAG) pipeline.

Users can upload knowledge sources, generate embeddings, perform vector-based retrieval, and interact with their personal knowledge base using natural language.

## Core Features

### AI-Powered Semantic Search

* Vector embeddings for intelligent retrieval
* MongoDB Atlas Vector Search integration
* Context-aware semantic matching
* Fast AI-assisted search experience

### Retrieval-Augmented Generation (RAG)

* Context grounding using stored user knowledge
* AI-generated responses with retrieved context
* Embedding-based retrieval pipeline
* Prompt orchestration with Groq LLM

### Knowledge Management

* Store notes and documents
* Save web links and YouTube content
* Upload PDF files
* Organize content using tags

### Authentication & Security

* JWT-based authentication
* Protected API routes
* Secure cookie handling
* User-specific content isolation

### File Processing

* PDF text extraction
* Web page scraping
* YouTube transcript extraction
* Async embedding generation

### Sharing System

* Public brain sharing
* Shareable links
* Shared knowledge access

## Tech Stack

### Frontend

* React.js
* TypeScript
* Vite
* TailwindCSS
* Axios
* React Router DOM

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB Atlas
* Mongoose
* JWT Authentication
* Multer

### AI & Search

* Retrieval-Augmented Generation (RAG)
* MongoDB Atlas Vector Search
* Vector Embeddings
* Groq API
* Llama 3.1 Model

### Storage & Processing

* Supabase Storage
* pdf-parse
* Cheerio
* YouTube Transcript API

## System Architecture

```text
Frontend (React + TypeScript)
        │
        ▼
REST API Layer (Express + Node.js)
        │
        ▼
MongoDB Atlas Database
        │
        ├── User Data
        ├── Content
        ├── Tags
        ├── Embeddings
        └── Shared Links
        │
        ▼
AI Pipeline
        │
        ├── Embedding Generation
        ├── Vector Search
        ├── Context Retrieval
        └── LLM Response Generation
        │
        ▼
Groq Llama 3.1
```

## RAG Workflow

```text
User Query
   │
   ▼
Generate Query Embedding
   │
   ▼
MongoDB Vector Search
   │
   ▼
Retrieve Relevant Knowledge
   │
   ▼
Prompt Construction
   │
   ▼
Groq LLM Invocation
   │
   ▼
Context-Aware AI Response
```

## Complete Project Structure

```text
SecondBrain/
│
├── assets/
│
├── backend/
│   │
│   ├── .env
│   ├── .env.example
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.json
│   │
│   ├── dist/
│   │   ├── app.js
│   │   ├── server.js
│   │   │
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── supabase.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── chat.controller.js
│   │   │   ├── content.controller.js
│   │   │   ├── search.controller.js
│   │   │   ├── share.controller.js
│   │   │   └── tags.controller.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── upload.middleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── content.model.js
│   │   │   ├── shareLink.model.js
│   │   │   ├── tag.model.js
│   │   │   └── user.model.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.route.js
│   │   │   ├── chat.route.js
│   │   │   ├── content.route.js
│   │   │   ├── search.route.js
│   │   │   ├── share.route.js
│   │   │   └── tags.route.js
│   │   │
│   │   ├── services/
│   │   │   ├── chatService.js
│   │   │   ├── embeddingService.js
│   │   │   └── fileService.js
│   │   │
│   │   └── utils/
│   │       ├── hash.js
│   │       └── tags.js
│   │
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       │
│       ├── config/
│       │   ├── db.ts
│       │   └── supabase.ts
│       │
│       ├── controllers/
│       │   ├── auth.controller.ts
│       │   ├── chat.controller.ts
│       │   ├── content.controller.ts
│       │   ├── search.controller.ts
│       │   ├── share.controller.ts
│       │   └── tags.controller.ts
│       │
│       ├── middleware/
│       │   ├── auth.middleware.ts
│       │   └── upload.middleware.ts
│       │
│       ├── models/
│       │   ├── content.model.ts
│       │   ├── shareLink.model.ts
│       │   ├── tag.model.ts
│       │   └── user.model.ts
│       │
│       ├── routes/
│       │   ├── auth.route.ts
│       │   ├── chat.route.ts
│       │   ├── content.route.ts
│       │   ├── search.route.ts
│       │   ├── share.route.ts
│       │   └── tags.route.ts
│       │
│       ├── services/
│       │   ├── chatService.ts
│       │   ├── embeddingService.ts
│       │   └── fileService.ts
│       │
│       ├── types/
│       │   ├── pdf-parse.d.ts
│       │   └── express/
│       │
│       └── utils/
│           ├── hash.ts
│           └── tags.ts
│
├── frontend/
│   │
│   ├── .env
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── tailwind.config.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vercel.json
│   ├── vite.config.ts
│   │
│   ├── dist/
│   │   ├── index.html
│   │   └── assets/
│   │       ├── index-BCjtRX-z.js
│   │       └── index-qkXpGUva.css
│   │
│   ├── public/
│   │
│   └── src/
│       ├── App.tsx
│       ├── index.css
│       ├── main.tsx
│       │
│       ├── api/
│       │   └── axios.ts
│       │
│       ├── components/
│       │   ├── ChatPanel.tsx
│       │   ├── Errorboundary.tsx
│       │   └── ui/
│       │
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   └── useContent.ts
│       │
│       ├── icons/
│       │   ├── PlusIcon.tsx
│       │   └── ShareIcon.tsx
│       │
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── SharedBrain.tsx
│       │   ├── SignIn.tsx
│       │   └── SignUp.tsx
│       │
│       └── types/
│           └── index.tsx
│
└── README.md
```

## API Routes

### Authentication Routes

```text
/api/v1/auth
```

### Content Routes

```text
/api/v1/content
```

### Search Routes

```text
/api/v1/search
```

### Chat Routes

```text
/api/v1/chat
```

### Share Routes

```text
/api/v1/share
```

### Tags Routes

```text
/api/v1/tags
```

## Environment Variables

### Backend `.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api/v1
```

## Local Development Setup

### Clone Repository

```bash
git clone <your-repository-url>
cd SecondBrain
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Deployment

### Frontend

Platform: Vercel

Live URL:

```text
https://second-brain-drab-two.vercel.app
```

### Backend

Platform: Render

## Key Engineering Highlights

* Retrieval-Augmented Generation (RAG) implementation
* MongoDB Atlas Vector Search integration
* LLM orchestration with Groq API
* Semantic search pipeline
* PDF and web content extraction
* Asynchronous embedding generation
* Modular scalable backend architecture
* Secure JWT authentication system
* Full-stack TypeScript development

## AI Orchestration Flow

Main orchestration logic is implemented inside:

```text
backend/src/services/chatService.ts
```

Responsibilities include:

* Query embedding generation
* Vector retrieval
* Context injection
* Prompt construction
* Groq LLM invocation
* Response formatting

## Future Improvements

* Streaming AI responses
* Hybrid retrieval search
* OCR document processing
* Real-time collaboration
* Browser extension integration
* Conversation memory
* Team workspaces
* Mobile application support

## License

This project is licensed for educational and personal development purposes.
