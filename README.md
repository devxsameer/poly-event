# PolyEvent

**Multilingual Event Platform** — Host global events where language is never a barrier. Built for the [Lingo.dev](https://lingo.dev) hackathon.

![PolyEvent](https://img.shields.io/badge/Built_with-Lingo.dev-purple?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square)

## ✨ Features

- **🌍 Automatic Translation** — Event details and comments are translated automatically using [Lingo.dev](https://lingo.dev) AI. No manual localization required.
- **💬 Native-Language Discussions** — Write comments in your own language. Others read them in theirs — while the original text is always preserved.
- **🚀 Server-First Architecture** — Built with Next.js 16 and Supabase for speed, reliability, and scalability.
- **🌐 Multi-Locale Support** — Supports English, Spanish, French, and Hindi out of the box (easily extensible).
- **🔐 Secure Authentication** — GitHub OAuth and magic link email authentication via Supabase.

## 🛠️ Tech Stack

| Layer        | Technology                                  |
| ------------ | ------------------------------------------- |
| Frontend     | Next.js 16, React 19, TypeScript            |
| Styling      | Tailwind CSS v4, shadcn/ui                  |
| Backend      | Supabase (PostgreSQL, Auth, Edge Functions) |
| Localization | [Lingo.dev](https://lingo.dev) SDK + CLI    |
| Deployment   | Vercel                                      |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [locale]/          # Locale-prefixed routes
│   │   ├── events/        # Event listing & detail pages
│   │   ├── (protected)/   # Auth-protected routes
│   │   └── (auth)/        # Authentication pages
├── components/            # React components
│   ├── ui/               # shadcn/ui primitives
│   ├── navbar/           # Navigation components
│   ├── events/           # Event-related components
│   └── comments/         # Comment components
├── features/             # Business logic modules
│   ├── events/           # Event CRUD, queries, translation
│   ├── comments/         # Comment CRUD, queries, translation
│   ├── auth/             # Authentication actions
│   ├── i18n/             # Locale config & dictionary loading
│   └── translation/      # Translation guard utilities
├── lib/
│   ├── lingo/            # Lingo.dev SDK configuration
│   └── supabase/         # Supabase client setup
└── i18n/                 # Locale JSON files (en, es, fr, hi)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Supabase account
- Lingo.dev API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/poly-event.git
   cd poly-event
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Fill in:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   LINGODOTDEV_API_KEY=your_lingo_api_key
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

### Updating Translations

To update translations after modifying `i18n/en.json`:

```bash
npx lingo.dev run
```

This will automatically translate new/changed keys to all target locales (es, fr, hi).

## 🌐 Localization with Lingo.dev

This project uses Lingo.dev in two ways:

### 1. Static UI Translations (CLI)

The `i18n/` folder contains static translations for the UI:

- `en.json` — Source locale (English)
- `es.json` — Spanish (auto-generated)
- `fr.json` — French (auto-generated)
- `hi.json` — Hindi (auto-generated)

Configure in `i18n.json`:

```json
{
  "version": "1.11",
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "hi"]
  },
  "buckets": {
    "json": {
      "include": ["i18n/[locale].json"]
    }
  }
}
```

### 2. Dynamic Content Translation (SDK)

User-generated content (events, comments) is translated on-demand using the Lingo.dev SDK:

```typescript
import { localizeText, localizeObject } from "@/lib/lingo";

// Translate a single comment
const translated = await localizeText(comment.content, {
  sourceLocale: "en",
  targetLocale: "es",
});

// Translate event title + description
const translated = await localizeObject(
  { title: event.title, description: event.description },
  { sourceLocale: "en", targetLocale: "es" },
);
```

## 📝 License

MIT License — feel free to use this project as a starting point for your own multilingual apps!

---

Built with ❤️ for the [Lingo.dev Hackathon](https://lingo.dev)
