![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Tests](https://img.shields.io/badge/Tests-Jest%20%2B%20RTL-green)
![Accessibility](https://img.shields.io/badge/Accessibility-WCAG-informational)

# TennisTracker

A modern web application for tracking tennis matches, players, and tournament statistics. Built with React, TypeScript, and Express.js.

## Features

- **Player Management**: Create and manage tennis players with country selection
- **Match Tracking**: Log tennis matches with detailed information including:
  - Tournament name and round
  - Playing surface (Clay, Hard, Grass)
  - Match date and duration
  - Player seeding
  - Match winner and toss winner
- **Live Score Tracking**: Real-time match scoring system with:
  - Point-by-point tracking
  - Game and set scoring
  - Tiebreak support
  - Server alternation management
  - Live match stats (aces, double faults, first serve %, winners, etc.)
  - Match event timeline
- **Player Statistics**: View player information and match history
- **Localization**: Multi-language support (English & French) with language switcher
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Type-Safe**: Full TypeScript support for reliability

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hook Form** - Performant form management
- **TanStack Query** - Server state management
- **Framer Motion** - Animation library
- **React DatePicker** - Date selection component
- **i18next & react-i18next** - Internationalization (i18n)

### Backend
- **Express.js** - Web framework
- **SQLite with better-sqlite3** - Database
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development
- **Node.js/npm** - Package management
- **Nodemon** - Development server auto-reload
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tennistracker
```

2. Install dependencies for both frontend and backend:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

3. Initialize the database:
```bash
cd server
npm run init-db
```

## Running the Application

### Development Mode

Terminal 1 - Start the backend server:
```bash
cd server
npm run dev
```
The server runs on `http://127.0.0.1:3003`

Terminal 2 - Start the frontend development server:
```bash
npm run dev
```
The frontend runs on `http://localhost:5173`

### API Endpoints

#### Players API
- `GET /players` - Get all players
- `POST /players` - Create a new player

#### Matches API
- `GET /matchs` - Get all matches
- `POST /matchs` - Create a new match

#### Live Scoring API
- `GET /live-scoring/sessions` - Get all live match sessions
- `POST /live-scoring/sessions` - Create a new live match session
- `GET /live-scoring/sessions/:sessionId` - Get detailed session info with current score
- `POST /live-scoring/sessions/:sessionId/point` - Record a point in the current game
- `PATCH /live-scoring/sessions/:sessionId/status` - Update session status

#### Health Check
- `GET /health` - Health check endpoint

## Project Structure

```
tennistracker/
├── src/                           # Frontend source code
│   ├── components/               # Reusable React components
│   │   ├── ui/                  # UI components (Input, CountrySelector)
│   │   ├── MatchHeader.tsx
│   │   ├── MatchStats.tsx
│   │   ├── MatchSummary.tsx
│   │   ├── PlayerHeader.tsx
│   │   ├── Header.tsx
│   │   └── LanguageSelector.tsx
│   ├── pages/                    # Page components
│   │   ├── Home.tsx
│   │   ├── Match.tsx
│   │   ├── MatchTracker.tsx
│   │   ├── Matches.tsx
│   │   └── players/
│   │       ├── Players.tsx
│   │       └── CreatePlayer.tsx
│   ├── hooks/                    # Custom React hooks
│   │   ├── usePlayers.ts
│   │   ├── useMatchs.ts
│   │   └── useLiveMatch.ts
│   ├── services/                 # API services
│   │   ├── players.api.ts
│   │   ├── matchs.api.ts
│   │   └── liveMatch.api.ts
│   ├── locales/                  # i18n translation files
│   │   ├── en.json              # English translations
│   │   └── fr.json              # French translations
│   ├── providers/                # Context providers
│   │   ├── AppProviders.tsx
│   │   └── query-client.ts
│   ├── i18n.ts                   # i18next configuration
│   ├── types.ts                  # TypeScript type definitions
│   └── main.tsx                  # Entry point
├── server/                        # Backend source code
│   ├── routes/                   # API routes
│   │   ├── players.js
│   │   ├── matchs.js
│   │   └── live-scoring.js
│   ├── db.js                     # Database connection
│   ├── init-db.js                # Database initialization
│   └── server.js                 # Express server setup
├── database/                      # SQLite database file
├── public/                        # Static assets
├── LOCALIZATION.md               # i18n setup guide
└── package.json                  # Project dependencies
```

## Available Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Backend
```bash
npm run dev      # Start development server with nodemon
npm run start    # Start production server
npm run init-db  # Initialize SQLite database
```

## Database Schema

### Core Tables

#### Players Table
- `id` - Unique identifier
- `firstname` - Player first name
- `lastname` - Player last name
- `hand` - Playing hand (Left/Right)
- `backhand` - Backhand type (One-handed/Two-handed)
- `country` - Country code (ISO 3166-1 alpha-2)
- `rank` - Player ranking
- `created_at` - Creation timestamp

#### Matchs Table
- `id` - Unique identifier
- `tournament` - Tournament name
- `round` - Round number
- `surface` - Playing surface (Clay, Hard, Grass)
- `date` - Match date
- `duration` - Match duration
- `playerA_id` - First player ID (foreign key)
- `playerB_id` - Second player ID (foreign key)
- `playerA_seed` - First player seeding
- `playerB_seed` - Second player seeding
- `winner` - Match winner (A or B)
- `tossWinner` - Toss winner (A or B)
- `created_at` - Creation timestamp

#### Match Stats Table
- `id` - Unique identifier
- `match_id` - Match ID (foreign key)
- `setNumber` - Set number
- `aces_a / aces_b` - Aces by player
- `doubleFaults_a / doubleFaults_b` - Double faults
- `firstServe_a / firstServe_b` - First serve count
- `firstServeWon_a / firstServeWon_b` - First serve won count
- `secondServeWon_a / secondServeWon_b` - Second serve won count
- `winners_a / winners_b` - Winner shots
- `unforcedErrors_a / unforcedErrors_b` - Unforced errors
- `breakPointsWon_a / breakPointsWon_b` - Break points won
- `totalPointsWon_a / totalPointsWon_b` - Total points won
- `created_at` - Creation timestamp

### Live Scoring Tables

#### Live Match Sessions Table
Tracks active/ongoing matches
- `id` - Unique identifier
- `match_id` - Match ID (foreign key, unique)
- `status` - Session status (scheduled, in-progress, suspended, completed)
- `current_set` - Current set number
- `current_server` - Current server (A or B)
- `match_start_time` - Match start timestamp
- `match_end_time` - Match end timestamp
- `created_at` / `updated_at` - Timestamps

#### Live Sets Table
Tracks score for each set
- `id` - Unique identifier
- `session_id` - Live session ID (foreign key)
- `set_number` - Set number
- `games_a / games_b` - Games won by each player
- `is_tiebreak` - Whether set is in tiebreak
- `tiebreak_points_a / tiebreak_points_b` - Tiebreak points
- `set_winner` - Set winner (A, B, or NULL)
- `completed_at` - Completion timestamp
- `created_at` - Creation timestamp

#### Live Games Table
Tracks score for each game within a set
- `id` - Unique identifier
- `set_id` - Set ID (foreign key)
- `game_number` - Game number within set
- `points_a / points_b` - Points in current game
- `game_winner` - Game winner (A, B, or NULL)
- `server` - Current server (A or B)
- `completed_at` - Completion timestamp
- `created_at` - Creation timestamp

#### Live Points Table
Individual point history
- `id` - Unique identifier
- `game_id` - Game ID (foreign key)
- `point_number` - Point number in game
- `winner` - Point winner (A or B)
- `serve_type` - Serve type (first, second, N/A)
- `serve_result` - Serve result (ace, won, error, double-fault, N/A)
- `rally_type` - Rally type (service-winner, baseline, net-play, N/A)
- `winner_shot` - Winning shot description
- `notes` - Additional notes
- `created_at` - Creation timestamp

#### Live Match Events Table
Timeline of important match events
- `id` - Unique identifier
- `session_id` - Session ID (foreign key)
- `event_type` - Event type (match-start, set-start, game-start, point-won, game-won, set-won, match-end, suspension, resumption, medical-timeout, court-breakdown)
- `set_number` - Set number (if applicable)
- `game_number` - Game number (if applicable)
- `player` - Player involved (A or B)
- `details` - Event details
- `created_at` - Creation timestamp

#### Live Match Stats Table
Real-time statistics
- `id` - Unique identifier
- `session_id` - Session ID (foreign key)
- `set_number` - Set number
- `player` - Player (A or B)
- `aces` - Aces count
- `double_faults` - Double faults count
- `first_serve_count` - First serve attempts
- `first_serve_won` - First serves won
- `second_serve_won` - Second serves won
- `winners` - Winner shots
- `unforced_errors` - Unforced errors
- `break_points_won` - Break points won
- `break_points_faced` - Break points faced
- `total_points_won` - Total points won
- `serves_total` - Total serves
- `updated_at` - Last update timestamp

## Features Highlights

### Player Selection
- When selecting Player A in a match, Player B selection is automatically filtered to prevent duplicate selections
- Support for 239+ countries with flag icons

### Match Details
- Track match surface type
- Record match duration
- Store player seeding information
- Track toss and match winners

### Live Scoring System
- Real-time point-by-point match tracking
- Automatic game and set scoring
- Tiebreak support (first to 7 with 2-point lead)
- Server alternation management
- Live statistics tracking:
  - Aces and double faults
  - First serve percentage
  - Winners and unforced errors
  - Break points analysis
- Match event timeline
- Session management (scheduled, in-progress, suspended, completed)

### Localization (i18n)
- Multi-language support (English & French)
- Automatic browser language detection
- Language preference persistence in localStorage
- Language switcher in header and home page
- For detailed i18n setup, see [LOCALIZATION.md](LOCALIZATION.md)

### Responsive UI
- Mobile-friendly design
- Accessible form components
- Smooth animations and transitions

## Getting Started with Live Scoring

1. **Create a Match**: Go to Home → Create Match and fill in match details
2. **Start Live Session**: Click "Start Live Match" on the match detail page
3. **Record Points**: Use the "Point A" and "Point B" buttons to record each point
4. **View Live Stats**: The MatchSummary component updates in real-time with:
   - Current game score
   - Current set games
   - Live player statistics
5. **Match Status**: Session automatically tracks games, sets, and tiebreaks

## Setting Up Localization

The app supports English and French out of the box. To:
- **Switch languages**: Click the language selector (EN/FR button) in header or home page
- **Add a new language**: See [LOCALIZATION.md](LOCALIZATION.md) for detailed instructions
- **Translate strings**: Edit the corresponding JSON file in `src/locales/`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
