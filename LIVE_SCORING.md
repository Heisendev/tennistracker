# Live Tennis Match Scoring System

Complete database structure and REST API for managing real-time tennis match scoring, from point-by-point tracking to full match statistics.

## 📊 Database Schema Overview

### Core Tables

#### 1. **live_match_sessions**
Tracks active or completed match sessions
```sql
- id: Primary key
- match_id: Reference to matchs table
- status: 'scheduled' | 'in-progress' | 'suspended' | 'completed'
- current_set: Current set number (1-5)
- current_server: 'A' | 'B'
- match_start_time: ISO timestamp
- match_end_time: ISO timestamp
```

#### 2. **live_sets**
Tracks scores for each set in a match
```sql
- id: Primary key
- session_id: Reference to live_match_sessions
- set_number: Set #1, #2, #3, etc.
- games_a, games_b: Game count for each player
- is_tiebreak: Boolean (true if in tiebreak)
- tiebreak_points_a, tiebreak_points_b: Points in tiebreak (if applicable)
- set_winner: 'A' | 'B' | NULL
- completed_at: ISO timestamp when set ends
```

#### 3. **live_games**
Tracks scores for each game within a set
```sql
- id: Primary key
- set_id: Reference to live_sets
- game_number: Game number within set
- points_a, points_b: Current points (0, 15, 30, 40, or raw count in tiebreak)
- game_winner: 'A' | 'B' | NULL
- server: 'A' | 'B' (who is serving)
- completed_at: ISO timestamp
```

#### 4. **live_points**
Individual point-by-point history
```sql
- id: Primary key
- game_id: Reference to live_games
- point_number: Sequential point number in game
- winner: 'A' | 'B'
- serve_type: 'first' | 'second' | 'N/A'
- serve_result: 'ace' | 'won' | 'error' | 'double-fault' | 'N/A'
- rally_type: 'service-winner' | 'baseline' | 'net-play' | 'N/A'
- winner_shot: e.g., 'forehand', 'backhand', 'volley'
- notes: Additional notes/comments
```

#### 5. **live_match_events**
Timeline of significant match events
```sql
- id: Primary key
- session_id: Reference to live_match_sessions
- event_type: 'match-start' | 'set-start' | 'game-start' | 'point-won' | 'game-won' | 'set-won' | 'match-end' | 'suspension' | 'resumption' | 'medical-timeout' | 'court-breakdown'
- set_number: Set where event occurred
- game_number: Game where event occurred
- player: 'A' | 'B' (player involved, if applicable)
- details: Additional details
```

#### 6. **live_match_stats**
Real-time match statistics per set
```sql
- id: Primary key
- session_id: Reference to live_match_sessions
- set_number: Which set
- player: 'A' | 'B'
- aces: Ace count
- double_faults: Double fault count
- first_serve_count: Total first serves attempted
- first_serve_won: First serve points won
- second_serve_won: Second serve points won
- winners: Clean winners hit
- unforced_errors: Unforced errors
- break_points_won: Break points converted
- break_points_faced: Break points against
- total_points_won: Total points won in set
- serves_total: Total serves in set
```

## 🔌 REST API Endpoints

### Live Match Sessions

#### Create a new live session
```http
POST /api/live-scoring/sessions
Content-Type: application/json

{
  "match_id": 1
}

Response (201):
{
  "id": 5,
  "match_id": 1,
  "status": "scheduled",
  "current_set": 1,
  "message": "Live session created"
}
```

#### Get all live sessions
```http
GET /api/live-scoring/sessions?status=in-progress

Response (200):
[
  {
    "id": 5,
    "match_id": 1,
    "status": "in-progress",
    "current_set": 1,
    "current_server": "A",
    "tournament": "Wimbledon",
    "round": "Final",
    "playerA": {
      "id": 1,
      "firstname": "Carlos",
      "lastname": "Alcaraz",
      "country": "ES"
    },
    "playerB": {
      "id": 3,
      "firstname": "Novak",
      "lastname": "Djokovic",
      "country": "RS"
    }
  }
]
```

#### Get detailed session with current score
```http
GET /api/live-scoring/sessions/5

Response (200):
{
  "id": 5,
  "match_id": 1,
  "status": "in-progress",
  "current_set": 1,
  "current_server": "A",
  "playerA": { ... },
  "playerB": { ... },
  "sets": [
    {
      "set_number": 1,
      "games_a": 3,
      "games_b": 2,
      "is_tiebreak": false,
      "set_winner": null
    }
  ],
  "currentGame": {
    "points_a": 30,
    "points_b": 15,
    "game_number": 6,
    "server": "A"
  }
}
```

#### Update session status
```http
PATCH /api/live-scoring/sessions/5/status
Content-Type: application/json

{
  "status": "in-progress"
}

Response (200):
{
  "message": "Session status updated to in-progress"
}
```

### Record Points

#### Record a point in current game
```http
POST /api/live-scoring/sessions/5/point
Content-Type: application/json

{
  "winner": "A",
  "serve_type": "first",
  "serve_result": "ace",
  "rally_type": "service-winner",
  "winner_shot": "serve",
  "notes": "Strong first serve down the T"
}

Response (200):
{
  "message": "Point recorded",
  "game": {
    "points_a": 15,
    "points_b": 0
  },
  "gameWon": false
}
```

## 📋 Tennis Scoring Rules Embedded

The system automatically handles:

- **Point counting**: 0 → 15 → 30 → 40 → Game
- **Deuce logic**: 40-40 triggers deuce (handled via points counter)
- **Game winning**: First to 4 points with 2+ lead
- **Set winning**: First to 6 games with 2+ lead, or tiebreak at 6-6
- **Tiebreak**: First to 7 points with 2+ lead at 6-6
- **Server alternation**: Automatic between games
- **Match format**: Best of 3 sets (configurable to BO5)

## 🔄 Workflow Example

### Starting a Match
```javascript
// 1. Create session
POST /api/live-scoring/sessions
{ "match_id": 1 }

// 2. Update status to in-progress
PATCH /api/live-scoring/sessions/5/status
{ "status": "in-progress" }
```

### Recording a Match
```javascript
// Point 1: Player A wins first point off ace
POST /api/live-scoring/sessions/5/point
{ 
  "winner": "A", 
  "serve_type": "first",
  "serve_result": "ace" 
}

// Point 2: Player B wins point
POST /api/live-scoring/sessions/5/point
{ 
  "winner": "B", 
  "serve_type": "first"
}

// ... continue for entire match
```

### Ending a Match
```javascript
// 1. Record final point
POST /api/live-scoring/sessions/5/point
{ "winner": "A" }

// 2. Update session status
PATCH /api/live-scoring/sessions/5/status
{ "status": "completed" }
```

## 🔍 Querying Match Data

### Get match timeline
```sql
SELECT event_type, set_number, game_number, player, created_at
FROM live_match_events
WHERE session_id = 5
ORDER BY created_at;
```

### Get point-by-point breakdown
```sql
SELECT 
  p.point_number, 
  p.winner, 
  p.serve_type, 
  p.serve_result,
  g.game_number,
  ls.set_number
FROM live_points p
JOIN live_games g ON g.id = p.game_id
JOIN live_sets ls ON ls.id = g.set_id
WHERE ls.session_id = 5
ORDER BY ls.set_number, g.game_number, p.point_number;
```

### Get player statistics for a set
```sql
SELECT 
  player,
  aces,
  double_faults,
  ROUND(100.0 * first_serve_won / NULLIF(first_serve_count, 0), 1) as first_serve_pct,
  ROUND(100.0 * second_serve_won / NULLIF(first_serve_count - (first_serve_count - second_serve_won), 0), 1) as second_serve_pct,
  winners,
  unforced_errors,
  total_points_won
FROM live_match_stats
WHERE session_id = 5 AND set_number = 1;
```

## 🛠️ Best Practices

1. **Begin with session creation** before match starts
2. **Use serve_type and serve_result** for serve ace tracking
3. **Update status** to mark match progress
4. **Record all points** immediately for real-time accuracy
5. **Use detailed notes** for unusual situations (overrule, rain delay, etc.)
6. **Query currentGame** to show live score display
7. **Use event timeline** for match summary

## ⚠️ Notes

- Times are stored as ISO strings (UTC)
- Player references use 'A' and 'B' for efficiency
- Server alternates after each game (not within game)
- Index coverage includes common queries for performance
- Supports BO3 by default (modify current_set max to 5 for BO5)

