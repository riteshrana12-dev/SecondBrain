
<div align="center">

# 🧠 Second Brain

### *Your personal AI-powered knowledge base*

> Save anything. Find everything. Ask your brain.

<!-- 🖼️ ADD YOUR HERO SCREENSHOT HERE -->
<!-- Replace the line below with your actual screenshot -->
<!-- ![Second Brain Dashboard](./docs/images/dashboard.png) -->
> 📸 **[Add your dashboard screenshot here]** — Recommended size: 1280x720px

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://your-app.vercel.app)
[![Backend](https://img.shields.io/badge/⚙️_Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://secondbrain-backend.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## ✨ What is Second Brain?

**Second Brain** is a full-stack AI-powered personal knowledge management app. Think of it as your external memory — save YouTube videos, tweets, documents, PDFs, links, and notes in one place. Then **ask your AI** questions about everything you've saved.

Instead of bookmarking things and forgetting them, Second Brain lets you:

- 📥 **Save** any content — YouTube, tweets, PDFs, links, posts
- 🔍 **Search semantically** — find "videos about neural networks" even if you saved it as "3Blue1Brown deep learning"
- 🤖 **Ask your AI** — "What do I know about system design?" and get an answer synthesized from your own saved content
- 🔗 **Share your brain** — generate a public link so others can browse your knowledge base
- 📄 **Upload PDFs** — your notes, research papers, textbooks — all searchable

---

## 🖼️ Screenshots

<!-- 🖼️ ADD YOUR SCREENSHOTS HERE -->
<!-- Recommended: Add 3-4 screenshots showing different features -->
<!-- Example structure: -->

| Feature | Screenshot |
|---------|-----------|
| 🏠 Dashboard | `📸 [Add dashboard.png here]` |
| 🤖 AI Chat | `📸 [Add chat.png here]` |
| ➕ Add Content | `📸 [Add modal.png here]` |
| 🔗 Shared Brain | `📸 [Add shared.png here]` |

> **How to add screenshots:**
> 1. Create a `docs/images/` folder in your repo root
> 2. Add your screenshots there
> 3. Replace the placeholder text above with: `![Description](./docs/images/filename.png)`

---

## 🚀 Features

### Core
- ✅ **Authentication** — Secure signup/signin with HTTP-only cookies + JWT
- ✅ **5 Content Types** — YouTube, Tweet, Document, Link, Post
- ✅ **PDF Upload** — Upload PDFs to Supabase Storage, text extracted automatically
- ✅ **CRUD** — Add, edit, delete, and filter all your content

### AI Features
- ✅ **Semantic Search** — Vector embeddings via Jina AI + MongoDB Atlas `$vectorSearch`
- ✅ **RAG Chat** — Ask questions about your saved content, powered by Groq LLaMA3
- ✅ **Auto-embedding** — Every piece of content is embedded in the background after saving
- ✅ **PDF Text Extraction** — PDFs are parsed and embedded for full-text semantic search

### Sharing
- ✅ **Share Brain** — Generate a public read-only link to your entire knowledge base
- ✅ **Shared View** — Visitors can filter and search your brain without an account

### UX
- ✅ **Fully Responsive** — Mobile, tablet, desktop
- ✅ **Skeleton Loading** — Smooth loading states instead of blank screens
- ✅ **Error Boundaries** — App never fully crashes
- ✅ **Re-index Button** — Re-embed content that failed indexing

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** + **Vite** | UI framework + build tool |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client with interceptors |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** + **Express** | REST API server |
| **TypeScript** | Type safety |
| **Mongoose** | MongoDB ODM |
| **JWT** + **bcrypt** | Authentication |
| **Multer** | File upload handling |
| **Zod** | Request validation |
| **pdf-parse** | PDF text extraction |

### AI & Storage
| Technology | Purpose |
|-----------|---------|
| **Jina AI** `jina-embeddings-v3` | Text → vector embeddings (1024 dims) |
| **MongoDB Atlas** `$vectorSearch` | Vector similarity search |
| **Groq** `llama-3.1-8b-instant` | LLM for RAG chat responses |
| **Supabase Storage** | PDF and file storage |
| **YouTube Transcript API** | Auto-fetch YouTube transcripts |
| **Cheerio** + **Axios** | Web scraping for links |

### Infrastructure
| Service | Purpose |
|---------|---------|
| **MongoDB Atlas** | Primary database |
| **Render** | Backend hosting |
| **Vercel** | Frontend hosting |
| **Supabase** | File storage |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│                    React + Vite (Vercel)                     │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS + Cookie Auth
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS REST API                           │
│                      (Render)                                │
│                                                             │
│  /auth    /content    /search    /chat    /brain            │
└──────┬──────────┬──────────┬────────┬──────────────────────┘
       │          │          │        │
       ▼          ▼          ▼        ▼
┌──────────┐ ┌────────┐ ┌───────┐ ┌──────────────────┐
│ MongoDB  │ │Supabase│ │ Jina  │ │   Groq LLaMA3    │
│  Atlas   │ │Storage │ │  AI   │ │   RAG Engine     │
│(Database)│ │(Files) │ │(Embed)│ │  (Chat Answer)   │
└──────────┘ └────────┘ └───────┘ └──────────────────┘
```

### RAG Flow (How AI Chat Works)

```
User asks: "What do I know about system design?"
                    │
                    ▼
        Embed question → 1024 numbers
                    │
                    ▼
        $vectorSearch in MongoDB Atlas
        → Find top 5 semantically similar docs
                    │
                    ▼
        Build prompt:
        "Based on these docs from user's brain:
         [Doc 1]... [Doc 2]... [Doc 3]...
         Answer: What do I know about system design?"
                    │
                    ▼
        Groq LLaMA3 generates answer
                    │
                    ▼
        Return { answer, sources[] }
```

---

## 📁 Project Structure

```
SecondBrain/
│
├── 📂 backend/
│   ├── 📂 src/
│   │   ├── 📂 config/
│   │   │   ├── db.ts                    # MongoDB connection
│   │   │   └── supabase.ts              # Supabase client
│   │   │
│   │   ├── 📂 controllers/
│   │   │   ├── auth.controller.ts       # Signup, signin, signout
│   │   │   ├── content.controller.ts    # CRUD for content
│   │   │   ├── search.controller.ts     # Vector search
│   │   │   ├── chat.controller.ts       # RAG chat
│   │   │   ├── share.controller.ts      # Share brain link
│   │   │   └── tags.controller.ts       # Tag management
│   │   │
│   │   ├── 📂 middleware/
│   │   │   ├── auth.middleware.ts       # JWT cookie verification
│   │   │   └── upload.middleware.ts     # Multer file upload
│   │   │
│   │   ├── 📂 models/
│   │   │   ├── user.model.ts            # User schema
│   │   │   ├── content.model.ts         # Content schema (+ embedding[])
│   │   │   ├── tag.model.ts             # Tag schema
│   │   │   └── shareLink.model.ts       # Share link schema
│   │   │
│   │   ├── 📂 routes/
│   │   │   ├── auth.route.ts
│   │   │   ├── content.route.ts
│   │   │   ├── search.route.ts
│   │   │   ├── chat.route.ts
│   │   │   ├── share.route.ts
│   │   │   └── tags.route.ts
│   │   │
│   │   ├── 📂 services/
│   │   │   ├── embeddingService.ts      # Jina AI + content fetching
│   │   │   ├── chatService.ts           # RAG pipeline + Groq
│   │   │   └── fileService.ts           # Supabase upload + PDF parse
│   │   │
│   │   ├── 📂 utils/
│   │   │   ├── tags.ts                  # resolveTagIds helper
│   │   │   └── hash.ts                  # Share link hash generator
│   │   │
│   │   ├── 📂 types/
│   │   │   └── express.d.ts             # Express request augmentation
│   │   │
│   │   ├── app.ts                       # Express app setup
│   │   └── server.ts                    # Entry point + keep-alive
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 api/
│   │   │   └── axios.ts                 # Axios instance + interceptors
│   │   │
│   │   ├── 📂 components/
│   │   │   └── 📂 ui/
│   │   │       ├── Button.tsx
│   │   │       ├── Card.tsx             # Content card (all 5 types)
│   │   │       ├── ChatPanel.tsx        # RAG chat panel
│   │   │       ├── ErrorBoundary.tsx    # Error boundary wrapper
│   │   │       ├── Input.tsx
│   │   │       ├── Modal.tsx            # Add/Edit content form
│   │   │       ├── SearchBar.tsx
│   │   │       ├── Sidebar.tsx          # Filter nav + signout
│   │   │       ├── SidebarItems.tsx
│   │   │       └── SkeletonCard.tsx     # Loading skeleton
│   │   │
│   │   ├── 📂 hooks/
│   │   │   ├── useAuth.ts               # Auth logic hook
│   │   │   └── useContent.ts            # Content CRUD hook
│   │   │
│   │   ├── 📂 icons/
│   │   │   ├── PlusIcon.tsx
│   │   │   └── ShareIcon.tsx
│   │   │
│   │   ├── 📂 pages/
│   │   │   ├── Home.tsx                 # Main dashboard
│   │   │   ├── SignIn.tsx
│   │   │   ├── SignUp.tsx
│   │   │   └── SharedBrain.tsx          # Public read-only view
│   │   │
│   │   ├── 📂 types/
│   │   │   └── index.tsx                # Shared TypeScript interfaces
│   │   │
│   │   ├── App.tsx                      # Routes + ErrorBoundary
│   │   └── main.tsx                     # React entry point
│   │
│   ├── .env.production
│   ├── package.json
│   ├── tailwind.config.ts
│   └── vite.config.ts
│
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Jina AI API key — [jina.ai](https://jina.ai) (free)
- Groq API key — [console.groq.com](https://console.groq.com) (free)
- Supabase account — [supabase.com](https://supabase.com) (free)

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/SecondBrain.git
cd SecondBrain
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_strong_secret_key
NODE_ENV=development
JINA_API_KEY=your_jina_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

```bash
npm run dev
```

### 4. MongoDB Atlas — Vector Search Index

In Atlas → your cluster → **Atlas Search** → **Create Index** → **Atlas Vector Search** → JSON Editor:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 1024,
      "similarity": "cosine"
    },
    {
      "type": "filter",
      "path": "userId"
    }
  ]
}
```

Index name: `vector_index` | Database: `test` | Collection: `contents`

---

## 🌐 Deployment

| Service | Platform | URL |
|---------|---------|-----|
| Frontend | Vercel | `https://your-app.vercel.app` |
| Backend | Render | `https://secondbrain-backend.onrender.com` |
| Database | MongoDB Atlas | Cloud |
| Storage | Supabase | Cloud |

### Backend (Render)
- Root Directory: `backend`
- Build Command: `npm install --include=dev && npm run build`
- Start Command: `node dist/server.js`

### Frontend (Vercel)
- Root Directory: `frontend`
- Framework: `Vite`
- Add env var: `VITE_API_URL=https://secondbrain-backend.onrender.com/api/v1`

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| `POST` | `/api/v1/auth/signup` | ❌ | Register new user |
| `POST` | `/api/v1/auth/signin` | ❌ | Login + set cookie |
| `POST` | `/api/v1/auth/signout` | ✅ | Logout + clear cookie |
| `POST` | `/api/v1/content/add` | ✅ | Add content (supports file upload) |
| `GET` | `/api/v1/content/get` | ✅ | Get all user content |
| `PUT` | `/api/v1/content/:id` | ✅ | Update content |
| `DELETE` | `/api/v1/content/:id` | ✅ | Delete content + file |
| `POST` | `/api/v1/content/reembed/:id` | ✅ | Re-index failed content |
| `GET` | `/api/v1/search?query=` | ✅ | Semantic vector search |
| `POST` | `/api/v1/chat` | ✅ | RAG chat with your brain |
| `POST` | `/api/v1/brain/share` | ✅ | Generate share link |
| `GET` | `/api/v1/brain/:hash` | ❌ | View shared brain |

---

## 🧠 How Embeddings Work

Every time you save content, this happens in the background:

```
Content saved
     │
     ▼
fetchContent() — based on type:
  youtube  → fetch transcript via youtube-transcript
  link     → scrape page text via cheerio
  document → extract PDF text via pdf-parse
  post     → use notes directly
     │
     ▼
buildEmbedInput(title + notes + extractedText)
     │
     ▼
Jina AI → 1024 dimensional vector
     │
     ▼
Saved to MongoDB as embedding: [0.031, -0.142, ...]
isEmbedded: true
```

When you search or chat, your query goes through the same embedding process and MongoDB Atlas finds the most similar vectors using cosine similarity.

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#7164c0` (purple) |
| Primary Light | `#a78bfa` (purple-300) |
| Text | `#1f2937` (gray-800) |
| Muted | `#95989c` (gray-500) |
| Background | `#f3f4f6` (gray-100) |
| Border | `#e5e7eb` (gray-200) |
| Font | System UI / Inter |
| Border Radius | `0.75rem` (rounded-xl) |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch — `git checkout -b feat/amazing-feature`
3. Commit your changes — `git commit -m "feat: add amazing feature"`
4. Push to branch — `git push origin feat/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use this project for learning or building on top of it.

---

<div align="center">

Built with 💜 by **Ritesh Rana**

⭐ **Star this repo if you found it useful!**

</div>
