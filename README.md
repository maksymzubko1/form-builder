# 📝 Form Builder AI

Production-grade, full-stack web application for creating, publishing, and analyzing forms with an AI-powered assistant and a modern drag-and-drop Puck Editor.

---

## ✨ Features

- **Authentication & Authorization**
  - Email/password registration, email confirmation, login, password reset 
  - Protected admin panel, profile, and session management

- **Form Management**
  - Create, edit, copy, publish/unpublish, delete forms
  - Modern drag-and-drop Puck Editor with preview mode
  - AI Assistant to generate or refactor form fields, UX suggestions, labels, and validation

- **Submissions & Analytics**
  - View, filter, delete, and export form submissions (CSV)
  - Visual analytics dashboard (charts, top responses, conversion, custom insights)
  - Admin-only and public form statistics

- **Email Notifications**
  - Dynamic templates (SendGrid integration)
  - Notifications for new submissions, registration confirmation, password resets

- **Public Form Sharing**
  - Unique shareable URLs for public form filling
  - Success ("Thank you") screens, mobile-friendly
  - Progress saving and resume

- **Best Practices**
  - Centralized type-safe routes/constants, Zod validation, ESLint/Prettier
  - Shadcn/ui components, responsive layouts, strong TypeScript typing
  - Production-ready Docker, .env configuration, Prisma migrations

- **AI Integration**
  - OpenAI (or Claude) backend for prompt-based field generation, editing, and UX tips
  - Context-aware chat (remembers dialogue), safe patch format for field updates

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ App Router, React, TypeScript, Shadcn/UI, TailwindCSS
- **Form Editor**: Puck Editor (https://puckeditor.com) (custom integration)
- **AI**: OpenAI GPT-4 or Claude (API key via .env)
- **Backend**: Next.js API routes, PostgreSQL, Prisma ORM
- **Email**: SendGrid (Dynamic Templates)
- **Auth**: NextAuth.js (credentials, custom providers)
- **Containerization**: Docker, docker-compose
- **CI/CD**: Ready for deployment anywhere (Vercel, Docker, etc.)

## 📦 Getting Started

1. **Clone the repo:**
```bash 

git clone https://github.com/maksymzubko1/form-builder.git
cd form-builder-ai
```

2. **Install dependencies:**
```bash 

npm install
```

3. **Configure environment:**
- Copy .env.example to .env and fill in:


    DATABASE_URL=postgresql://...
    NEXTAUTH_SECRET=...
    SENDGRID_API_KEY=...
    OPENAI_API_KEY=...
    NEXTAUTH_URL=https://your-domain.com
    See .env.example for all required variables.


4. Database migration:
```bash

npx prisma migrate deploy
```

5. Run locally:
```bash

npm run dev

# (Optional) Start with Docker:
# docker-compose up --build
```

## 🧑‍💻 Development

- All main code is in /src:
  - /app: Next.js app structure (public, admin, API routes)
  - /components: Shared, UI, form, and AI components
  - /lib: Utility functions, hooks, helpers
  - /constants: Type-safe routes, API paths, enums
  - /types: Centralized TypeScript types/interfaces
  - /prisma: Prisma schema & migrations

- Code style:
  - Run ```npm run lint``` and ```npm run format``` before pushing.
  ESLint + Prettier + TypeScript strict everywhere.

## 🤖 AI Assistant (How it works)

- Activate AI panel in the form editor (admin only)
- Choose fields (or whole form) to give context
- Ask in English (or use fast-commands):
- “Add a required phone field”, “Suggest better labels”, “Refactor for school students”, etc.
- AI returns actions (add, update, delete) and suggestions in strict JSON format
- Safe patching — only allowed fields are modified, full undo supported
- All chat history is session-scoped (can be stored in DB)

## 🛡️ Security

- JWT session tokens, server-side validation
- Strong password requirements, account protection
- All API routes strictly typed, input/output Zod-validated

## 🚀 Deployment

- Ready for Vercel, Docker, or any Node/Next-compatible host 
- Use environment variables for all keys and secrets
- For production: enable HTTPS, set proper CORS, and secure your email/AI providers

## ☑ TODO
1. [ ] Validate all fields requirements before publish (Puck editor)
2. [ ] Revalidate all TS in project


## 💡 Credits & Links
- Puck Editor (https://puckeditor.com)
- OpenAI (https://platform.openai.com/)
- SendGrid (https://sendgrid.com/)
- shadcn/ui (https://ui.shadcn.com/)