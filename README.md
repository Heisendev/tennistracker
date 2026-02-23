![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Node.js](https://img.shields.io/badge/Node-18%2B-green)
![License](https://img.shields.io/badge/License-MIT-green)

# 🎾 TennisTracker

A comprehensive web application for tracking tennis matches, players, and live match statistics. Built with React, TypeScript, Vite, Express.js, and SQLite.

**[Live Demo](https://your-vercel-domain.vercel.app)** • **[API](https://your-backend-url.com)** • **[Deployment Guide](./DEPLOYMENT.md)**

## ✨ Features

### 👥 Player Management
- Create and manage tennis player profiles
- Track player information (firstname, lastname, country, hand, backhand type)
- Browse all players in the system
- Country selection with flag support (239+ countries)

### 🏆 Match Management
- Create detailed match records with:
  - Tournament name and round
  - Playing surface (Clay, Hard, Grass)
  - Match date
  - Player seeding information
  - Toss winner
- View match details with player information
- Track match history
- Match summary display with player headers

### 🔴 Live Match Scoring
- **Real-time score tracking** with point-by-point recording
- **Automatic game/set scoring logic**:
  - Standard scoring (0, 15, 30, 40, deuce, advantage)
  - Game win detection (first to 4 with 2-point lead)
  - Set win detection with tiebreak support
  - Tiebreak scoring (first to 7 with 2-point lead)
- **Server management**: Automatic server alternation per game
- **Detailed match statistics** tracked in real-time:
  - Aces
  - Double faults
  - First serve percentage
  - Winners and unforced errors
  - Break points won/faced
  - Total points won
- **Match event timeline** capturing all significant match events
- **Session management** (scheduled, in-progress, suspended, completed)

### 📊 Match Statistics
- Real-time statistics display during live matches
- Per-set breakdown of player performance
- Comprehensive stats including:
  - Serve performance (first/second serve wins)
  - Shot analysis (winners vs errors)
  - Break point opportunities
  - Points won distribution

### 🌍 Localization
- Multi-language support (English & French)
- Automatic browser language detection
- Language preference persistence
- Language switcher in header
- Easy to add additional languages

### 🎨 User Experience
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions (Framer Motion)
- Accessible form components
- Type-safe React components (TypeScript)
- Intuitive match tracking interface

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** | UI library & component framework |
| **TypeScript 5.9** | Type-safe JavaScript development |
| **Vite 7** | Fast build tool & dev server |
| **Tailwind CSS** | Utility-first CSS styling |
| **React Router 7** | Client-side routing |
| **TanStack Query** | Server state management & caching |
| **React Hook Form** | Lightweight form management |
| **i18next** | Internationalization (i18n) |
| **Framer Motion** | Animation library |
| **Lucide React** | Icon library |
| **PostCSS** | CSS preprocessing |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Express.js 5** | Web framework |
| **SQLite (better-sqlite3)** | Lightweight relational database |
| **Node.js 18+** | JavaScript runtime |
| **CORS** | Cross-origin resource sharing |
| **dotenv** | Environment variable management |
| **Nodemon** | Development auto-reload |

### Infrastructure & Deployment
| Platform | Purpose |
|----------|---------|
| **Vercel** | Frontend hosting & deployment |
| **Render.com** | Backend hosting (recommended) |
| **GitHub** | Version control & CI/CD |

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher (or yarn/pnpm)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tennistracker
   ```

2. **Install dependencies**
   ```bash
   # Frontend dependencies
   npm install
   
   # Backend dependencies
   cd server
   npm install
   ```

3. **Initialize the database**
   ```bash
   # Still in server directory
   npm run init-db
   ```

### Running Locally

**Terminal 1 - Backend (from `server/` directory)**
```bash
npm run dev
# Server runs on http://localhost:3003
```

**Terminal 2 - Frontend (from root directory)**
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser to start using the app!

## 🔌 API Reference

### Base URL
- **Development**: `http://localhost:3003`
- **Production**: Your Render/Railway backend URL

### Players Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/players` | Get all players |
| `POST` | `/players` | Create a new player |
| `GET` | `/players/:id` | Get player by ID |

### Matches Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/matches` | Get all matches |
| `POST` | `/matches` | Create a new match |
| `GET` | `/matches/:id` | Get match by ID |

### Live Scoring Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/live-scoring/sessions` | Get all live sessions |
| `POST` | `/live-scoring/sessions` | Create a live session |
| `GET` | `/live-scoring/sessions/:matchId` | Get session details |
| `POST` | `/live-scoring/sessions/:sessionId/point` | Record a point |
| `GET` | `/live-scoring/sessions/:sessionId/points` | Get all points in session |
| `PATCH` | `/live-scoring/sessions/:sessionId/status` | Update session status |

### Health Check
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/health` | Check API health status |

For detailed live scoring API documentation, see [LIVE_SCORING.md](./LIVE_SCORING.md)

## 📁 Project Structure

```
tennistracker/
├── 📂 src/                           # Frontend source code
│   ├── 📂 components/               # React components
│   │   ├── 📂 ui/                  # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Tabs.tsx
│   │   │   └── Countryselector/
│   │   ├── Header.tsx
│   │   ├── LanguageSelector.tsx
│   │   ├── MatchHeader.tsx
│   │   ├── MatchStats.tsx
│   │   ├── MatchSummary.tsx
│   │   ├── PlayerHeader.tsx
│   │   └── SectionCard.tsx
│   │
│   ├── 📂 pages/                    # Page components
│   │   ├── Home.tsx
│   │   ├── 📂 matches/
│   │   │   ├── Match.tsx
│   │   │   ├── Matches.tsx
│   │   │   └── CreateMatch.tsx
│   │   └── 📂 players/
│   │       ├── Players.tsx
│   │       └── CreatePlayer.tsx
│   │
│   ├── 📂 hooks/                    # Custom React hooks
│   │   ├── useLiveMatch.ts
│   │   ├── useMatches.ts
│   │   └── usePlayers.ts
│   │
│   ├── 📂 services/                 # API service layer
│   │   ├── liveMatch.api.ts
│   │   ├── matches.api.ts
│   │   └── players.api.ts
│   │
│   ├── 📂 providers/                # Providers & context
│   │   ├── AppProviders.tsx
│   │   └── query-client.ts
│   │
│   ├── 📂 locales/                  # Translations
│   │   ├── en.json
│   │   └── fr.json
│   │
│   ├── 📂 assets/                   # Static assets
│   ├── types.ts                     # TypeScript type definitions
│   ├── i18n.ts                      # i18n configuration
│   ├── main.tsx                     # Application entry point
│   └── index.css                    # Global styles
│
├── 📂 server/                        # Backend source code
│   ├── 📂 routes/                   # API route handlers
│   │   ├── players.js
│   │   ├── matches.js
│   │   └── live-scoring.js
│   ├── db.js                        # Database connection & init
│   ├── init-db.js                   # Database schema & seeding
│   ├── server.js                    # Express server setup
│   └── package.json
│
├── 📂 database/                      # SQLite database (auto-created)
├── 📂 public/                        # Static public assets
│
├── 📑 Configuration files
│   ├── .env.example                 # Environment variables template
│   ├── vite.config.ts              # Vite configuration
│   ├── tsconfig.json               # TypeScript configuration
│   ├── tailwind.config.ts          # Tailwind CSS configuration
│   ├── postcss.config.ts           # PostCSS configuration
│   └── eslint.config.js            # ESLint configuration
│
├── 📑 Documentation
│   ├── README.md                    # This file
│   ├── DEPLOYMENT.md                # Detailed deployment guide
│   ├── QUICK_DEPLOY.md             # Quick deployment checklist
│   ├── LOCALIZATION.md             # i18n setup guide
│   ├── LIVE_SCORING.md             # Live scoring API reference
│   └── LICENSE
│
└── package.json                     # Frontend dependencies
```

## 📝 Available Scripts

### Frontend (Root Directory)
```bash
npm run dev         # Start development server (http://localhost:5173)
npm run build       # Build for production
npm run lint        # Run ESLint code linting
npm run preview     # Preview production build locally
```

### Backend (server/ Directory)
```bash
npm run dev         # Start with nodemon (auto-reload)
npm run start       # Start production server
npm run init-db     # Initialize SQLite database with schema & seed data
```

## 🗄️ Database Schema

### Core Tables

**Players**
- Player profiles with name, country, playing hand, backhand type, ranking

**Matches**
- Match records with tournament info, surface type, date, participants, scores

### Live Scoring Tables

**live_match_sessions**
- Active/ongoing match sessions with status (scheduled, in-progress, suspended, completed)

**live_sets**
- Set-level scoring (games won, tiebreak status, set winner)

**live_games**
- Game-level scoring (points, server, game winner)

**live_points**
- Point-by-point tracking with serve details, shot type, result

**live_match_events**
- Timeline of significant match events (game won, set won, etc.)

**live_match_stats**
- Real-time player statistics per set (aces, faults, winners, errors, break points, etc.)

For complete schema details, see the database initialization in [server/db.js](./server/db.js)

## 🎯 Key Features In Detail

### Intelligent Player Selection
- When creating a match, selecting Player A automatically filters the Player B dropdown
- Prevents duplicate player selection in the same match
- Supports 239+ countries with flag icons
- Player ranking and playing style information

### Live Scoring Intelligence
The app implements tennis scoring rules automatically:
- **Valid game scores**: 0, 15, 30, 40, deuce, advantage
- **Game win**: First to 4 points with 2+ point lead
- **Set win**: First to 6 games with 2+ game lead
- **Tiebreak**: Triggered at 6-6, first to 7 with 2+ point lead
- **Server alternation**: Switches after each game

### Real-Time Statistics
Every point is tracked with:
- Serve performance (first/second serve, aces, faults)
- Shot analysis (winners vs unforced errors)
- Break point opportunities and conversions
- Complete per-set player statistics

### Multi-Language Support (i18n)
- English and French built-in
- Automatic browser language detection
- Manual language switcher in header
- Easy to add new languages (see LOCALIZATION.md)

## 🚀 Deployment

### Production Deployment
The application is designed for production with deployment on:

**Frontend**: Vercel (automatic deployment on git push)
- Zero-config deployment
- Environment variables for API URL
- Automatic HTTPS and CDN

**Backend**: Render.com, Railway, or Fly.io
- Provided render.yaml configuration
- SQLite database persistence
- Automatic database initialization

For detailed deployment steps, see:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Quick deployment checklist

### Environment Variables
Create `.env` files in root (frontend) and `server/` directories:

**Frontend** (.env)
```
VITE_API_URL=https://your-backend-url.com
```

**Backend** (server/.env)
```
PORT=3003
NODE_ENV=production
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

## 📖 Usage Guide

### Creating Your First Match

1. **Create Players** (if needed)
   - Go to "Players" → "Add Player"
   - Fill in player details (name, country, playing style)
   - Save

2. **Create a Match**
   - Go to "Matches" → "Create Match"
   - Select two players
   - Enter tournament info and surface type
   - Set match date
   - Create

3. **Track Live Match**
   - Open the match details
   - MatchSummary shows current score (0-0, Set 1, Game 1)
   - Use control buttons to record points:
     - **Serve**: Record aces, faults, double faults
     - **Winner**: Record who won the point
     - **Error**: Record unforced errors
   - Statistics update in real-time
   - App automatically handles game/set progression

4. **View Statistics**
   - Live statistics display per set
   - See detailed breakdown of aces, faults, winners, etc.
   - Match event timeline shows all significant events

### Language Switching
- Click the **EN/FR** button in the header
- Language preference is saved automatically
- All content switches to selected language

## 🛠️ Development

### Project Architecture

**Frontend** (React + TypeScript)
- Component-based UI with type safety
- Custom hooks for business logic (useLiveMatch, useMatches, usePlayers)
- API service layer for clean separation
- TanStack Query for server state management

**Backend** (Express + SQLite)
- RESTful API endpoints
- Database auto-initialization
- CORS configuration for frontend
- Health check endpoint for monitoring

**Key Design Patterns**
- Separation of concerns (components, hooks, services)
- Type-safe APIs with TypeScript
- Database transactions for data consistency
- Automatic player filtering to prevent duplicates

### Code Style
- **Linting**: ESLint with React & TypeScript rules
- **TypeScript**: Strict mode enabled
- **Format**: Consistent with Prettier-compatible ESLint config

### Running Tests
```bash
# Run tests once
npm run test

# Watch mode (auto-rerun on changes)
npm run test:watch

# Coverage report
npm run test:coverage

# Visual test runner UI
npm run test:ui
```

**Test Framework**: Vitest 4 with React Testing Library  
**Coverage**: 90+ test cases for APIs, hooks, and utilities  
**Read**: [TESTING.md](./TESTING.md) for comprehensive testing guide

## 🤝 Contributing

Contributions are welcome! To contribute:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes
4. **Commit** with clear messages (`git commit -m 'Add amazing feature'`)
5. **Push** to your branch (`git push origin feature/amazing-feature`)
6. **Create** a Pull Request

### Development Guidelines
- Write clean, TypeScript-first code
- Add type definitions for new features
- Test changes locally before submitting PR
- Update documentation as needed
- Follow existing code style

## 🐛 Known Issues & Future Improvements

### Current Limitations
- SQLite database is single-file (not ideal for very large-scale deployment)
- Real-time features use polling (not WebSockets)
- No authentication/authorization yet

### Planned Features
- User authentication & personal match history
- WebSocket support for real-time updates
- Match replay/statistics export (PDF)
- Player comparison analytics
- Mobile app (React Native)
- PostgreSQL migration option

## 📚 Documentation

- [TESTING.md](./TESTING.md) - Unit testing guide with Vitest
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment guide
- [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Quick deployment checklist
- [LOCALIZATION.md](./LOCALIZATION.md) - i18n setup and translation guide
- [LIVE_SCORING.md](./LIVE_SCORING.md) - Live scoring API reference

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙋 Support

- **Issues**: [GitHub Issues](../../issues)
- **Discussions**: [GitHub Discussions](../../discussions)
- **Email**: Contact project maintainer

---

**Made with ❤️ for tennis enthusiasts** 🎾
