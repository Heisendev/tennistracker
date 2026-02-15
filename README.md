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
- **Player Statistics**: View player information and match history
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

- `GET /health` - Health check endpoint
- `GET /players` - Get all players
- `GET /matchs` - Get all matches
- `POST /players` - Create a new player
- `POST /matchs` - Create a new match

## Project Structure

```
tennistracker/
├── src/                           # Frontend source code
│   ├── components/               # Reusable React components
│   │   ├── ui/                  # UI components (Input, CountrySelector)
│   │   ├── MatchHeader.tsx
│   │   ├── MatchStats.tsx
│   │   ├── MatchSummary.tsx
│   │   └── PlayerHeader.tsx
│   ├── pages/                    # Page components
│   │   ├── Home.tsx
│   │   ├── Match.tsx
│   │   ├── MatchTracker.tsx
│   │   └── CreatePlayer.tsx
│   ├── hooks/                    # Custom React hooks
│   │   ├── usePlayers.ts
│   │   └── useMatchs.ts
│   ├── services/                 # API services
│   │   └── matchs.api.ts
│   ├── providers/                # Context providers
│   │   ├── AppProviders.tsx
│   │   └── query-client.ts
│   ├── types.ts                  # TypeScript type definitions
│   └── main.tsx                  # Entry point
├── server/                        # Backend source code
│   ├── routes/                   # API routes
│   │   ├── players.js
│   │   └── matchs.js
│   ├── db.js                     # Database connection
│   ├── init-db.js                # Database initialization
│   └── server.js                 # Express server setup
├── database/                      # SQLite database file
├── public/                        # Static assets
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

### Players Table
- `id` - Unique identifier
- `firstname` - Player first name
- `lastname` - Player last name
- `country` - Country code (ISO 3166-1 alpha-2)
- `created_at` - Creation timestamp

### Matchs Table
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

## Features Highlights

### Player Selection
- When selecting Player A in a match, Player B selection is automatically filtered to prevent duplicate selections
- Support for 239+ countries with flag icons

### Match Details
- Track match surface type
- Record match duration
- Store player seeding information
- Track toss and match winners

### Responsive UI
- Mobile-friendly design
- Accessible form components
- Smooth animations and transitions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
