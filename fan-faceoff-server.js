const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 4000;

// Supabase configuration - temporarily disabled
// const supabaseUrl = 'https://pvjwpvjitsrmyqutbbsj.supabase.co';
// const supabaseKey = 'your-actual-key-here';
// const supabase = createClient(supabaseUrl, supabaseKey);

// Temporary in-memory storage for development
const userPulls = new Map();
const userPicks = [];

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API configurations
const nbaApiConfig = {
  headers: {
    'X-RapidAPI-Key': '2736929e16msh9d688efd8c4ae2dp1d08a0jsn2461798e99f6',
    'X-RapidAPI-Host': 'allsportsapi2.p.rapidapi.com'
  }
};

const nflApiConfig = {
  headers: {
    'X-RapidAPI-Key': '2736929e16msh9d688efd8c4ae2dp1d08a0jsn2461798e99f6',
    'X-RapidAPI-Host': 'allsportsapi2.p.rapidapi.com'
  }
};

const mlbApiConfig = {
  headers: {
    'X-RapidAPI-Key': '2736929e16msh9d688efd8c4ae2dp1d08a0jsn2461798e99f6',
    'X-RapidAPI-Host': 'tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com'
  }
};

const wnbaApiConfig = {
  headers: {
    'X-RapidAPI-Key': '2736929e16msh9d688efd8c4ae2dp1d08a0jsn2461798e99f6',
    'X-RapidAPI-Host': 'allsportsapi2.p.rapidapi.com'
  }
};

// Helper function to get today's date
function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Fetch NBA players
async function fetchNBAPlayers() {
  try {
    // Try RapidAPI first
    const response = await axios.get('https://allsportsapi2.p.rapidapi.com/api/basketball/tournament/138/season/42914/best-players/per-game/regularSeason', nbaApiConfig);
    if (response.data && response.data.result) {
      return response.data.result.map(player => player.player_name);
    }
  } catch (error) {
    console.log('RapidAPI not available for NBA, falling back to ESPN API');
  }

  // Fallback to ESPN API
  try {
    const response = await axios.get('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard');
    const games = response.data.events || [];
    const players = [];
    
    games.forEach(game => {
      if (game.competitions && game.competitions[0]) {
        const competition = game.competitions[0];
        
        // Get players from leaders
        if (competition.leaders) {
          competition.leaders.forEach(leader => {
            if (leader.leaders) {
              leader.leaders.forEach(player => {
                if (player.athlete && player.athlete.fullName && !players.includes(player.athlete.fullName)) {
                  players.push(player.athlete.fullName);
                }
              });
            }
          });
        }
        
        // Get players from competitors
        if (competition.competitors) {
          competition.competitors.forEach(competitor => {
            if (competitor.athletes) {
              competitor.athletes.forEach(athlete => {
                if (athlete.fullName && !players.includes(athlete.fullName)) {
                  players.push(athlete.fullName);
                }
              });
            }
          });
        }
      }
    });
    
    return players;
  } catch (error) {
    console.error('Error fetching NBA players:', error.message);
    return [];
  }
}

// Fetch NFL players
async function fetchNFLPlayers() {
  try {
    // Try RapidAPI first
    const response = await axios.get('https://allsportsapi2.p.rapidapi.com/api/american-football/tournament/19510/season/46788/team-events/total', nflApiConfig);
    if (response.data && response.data.result) {
      return response.data.result.map(player => player.player_name);
    }
  } catch (error) {
    console.log('RapidAPI not available for NFL, falling back to ESPN API');
  }

  // Fallback to ESPN API
  try {
    const response = await axios.get('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard');
    const games = response.data.events || [];
    const players = [];
    
    games.forEach(game => {
      if (game.competitions && game.competitions[0]) {
        const competition = game.competitions[0];
        
        // Get players from leaders
        if (competition.leaders) {
          competition.leaders.forEach(leader => {
            if (leader.leaders) {
              leader.leaders.forEach(player => {
                if (player.athlete && player.athlete.fullName && !players.includes(player.athlete.fullName)) {
                  players.push(player.athlete.fullName);
                }
              });
            }
          });
        }
        
        // Get players from competitors
        if (competition.competitors) {
          competition.competitors.forEach(competitor => {
            if (competitor.athletes) {
              competitor.athletes.forEach(athlete => {
                if (athlete.fullName && !players.includes(athlete.fullName)) {
                  players.push(athlete.fullName);
                }
              });
            }
          });
        }
      }
    });
    
    return players;
  } catch (error) {
    console.error('Error fetching NFL players:', error.message);
    return [];
  }
}

// Fetch MLB players
async function fetchMLBPlayers() {
  try {
    const response = await axios.get('https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard');
    const games = response.data.events || [];
    const players = [];
    
    games.forEach(game => {
      if (game.competitions && game.competitions[0]) {
        const competition = game.competitions[0];
        
        // Get players from leaders
        if (competition.leaders) {
          competition.leaders.forEach(leader => {
            if (leader.leaders) {
              leader.leaders.forEach(player => {
                if (player.athlete && player.athlete.fullName && !players.includes(player.athlete.fullName)) {
                  players.push(player.athlete.fullName);
                }
              });
            }
          });
        }
        
        // Get players from competitors
        if (competition.competitors) {
          competition.competitors.forEach(competitor => {
            if (competitor.athletes) {
              competitor.athletes.forEach(athlete => {
                if (athlete.fullName && !players.includes(athlete.fullName)) {
                  players.push(athlete.fullName);
                }
              });
            }
          });
        }
      }
    });
    
    return players;
  } catch (error) {
    console.error('Error fetching MLB players:', error.message);
    return [];
  }
}

// Fetch WNBA players
async function fetchWNBAPlayers() {
  try {
    const response = await axios.get('https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard');
    const games = response.data.events || [];
    const players = [];
    
    games.forEach(game => {
      if (game.competitions && game.competitions[0]) {
        const competition = game.competitions[0];
        
        // Get players from competitors leaders (WNBA structure is different)
        if (competition.competitors) {
          competition.competitors.forEach(competitor => {
            if (competitor.leaders) {
              competitor.leaders.forEach(leader => {
                if (leader.leaders) {
                  leader.leaders.forEach(player => {
                    if (player.athlete && player.athlete.fullName && !players.includes(player.athlete.fullName)) {
                      players.push(player.athlete.fullName);
                    }
                  });
                }
              });
            }
          });
        }
      }
    });
    
    return players;
  } catch (error) {
    console.error('Error fetching WNBA players:', error.message);
    return [];
  }
}

// Fetch live games with date filtering
async function fetchLiveGames(sport) {
  try {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD format

    switch (sport.toUpperCase()) {
      case 'MLB':
        const response = await axios.get('https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard');
        const mlbGames = response.data.events || [];
        // Filter for today's games only
        return mlbGames.filter(game => {
          const gameDate = new Date(game.date).toISOString().split('T')[0];
          return gameDate === todayString;
        });
      
      case 'NBA':
        try {
          // Try RapidAPI first
          const nbaResponse = await axios.get('https://allsportsapi2.p.rapidapi.com/api/basketball/matches/12/4/2022', nbaApiConfig);
          if (nbaResponse.data && nbaResponse.data.result) {
            return nbaResponse.data.result.filter(game => {
              const gameDate = new Date(game.event_date).toISOString().split('T')[0];
              return gameDate === todayString;
            });
          }
        } catch (error) {
          console.log('RapidAPI not available for NBA, falling back to ESPN API');
        }
        
        // Fallback to ESPN API
        const espnResponse = await axios.get('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard');
        const nbaGames = espnResponse.data.events || [];
        return nbaGames.filter(game => {
          const gameDate = new Date(game.date).toISOString().split('T')[0];
          return gameDate === todayString;
        });
      
      case 'NFL':
        try {
          // Try RapidAPI first
          const nflResponse = await axios.get('https://allsportsapi2.p.rapidapi.com/api/american-football/matches/11/9/2021', nflApiConfig);
          if (nflResponse.data && nflResponse.data.result) {
            return nflResponse.data.result.filter(game => {
              const gameDate = new Date(game.event_date).toISOString().split('T')[0];
              return gameDate === todayString;
            });
          }
        } catch (error) {
          console.log('RapidAPI not available for NFL, falling back to ESPN API');
        }
        
        // Fallback to ESPN API
        const espnResponseNFL = await axios.get('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard');
        const nflGames = espnResponseNFL.data.events || [];
        return nflGames.filter(game => {
          const gameDate = new Date(game.date).toISOString().split('T')[0];
          return gameDate === todayString;
        });
      
      case 'WNBA':
        const wnbaResponse = await axios.get('https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard');
        const wnbaGames = wnbaResponse.data.events || [];
        return wnbaGames.filter(game => {
          const gameDate = new Date(game.date).toISOString().split('T')[0];
          return gameDate === todayString;
        });
      
      default:
        return [];
    }
  } catch (error) {
    console.error(`Error fetching ${sport} live games:`, error.message);
    return [];
  }
}

// API endpoints
app.get('/api/today-players', async (req, res) => {
  const sport = req.query.sport || 'NBA';
  let players = [];

  switch (sport.toUpperCase()) {
    case 'NBA':
      players = await fetchNBAPlayers();
      break;
    case 'NFL':
      players = await fetchNFLPlayers();
      break;
    case 'MLB':
      players = await fetchMLBPlayers();
      break;
    case 'WNBA':
      players = await fetchWNBAPlayers();
      break;
    default:
      players = [];
  }

  res.json({ players });
});

app.get('/api/live-games', async (req, res) => {
  const sport = req.query.sport || 'NBA';
  const games = await fetchLiveGames(sport);
  res.json({ games });
});

app.get('/api/player-stats', async (req, res) => {
  const { sport, player } = req.query;
  // Placeholder for player stats
  res.json({ stats: 'Player stats coming soon!' });
});

app.get('/api/team-schedule', async (req, res) => {
  const { sport, team } = req.query;
  // Placeholder for team schedule
  res.json({ schedule: 'Team schedule coming soon!' });
});

// New endpoint for today's date
app.get('/api/today-date', (req, res) => {
  const today = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  const formattedDate = today.toLocaleDateString('en-US', options);
  res.json({ date: formattedDate, isoDate: today.toISOString().split('T')[0] });
});

// New endpoint to check user's remaining pulls
app.get('/api/user-pulls', async (req, res) => {
  const { email } = req.query;
  const today = getTodayDate();
  
  try {
    // In-memory fallback for development
    const pullsUsed = userPulls.get(email) || 0;
    const remainingPulls = Math.max(0, 3 - pullsUsed);
    
    res.json({ 
      pullsUsed, 
      remainingPulls, 
      canPull: remainingPulls > 0 
    });
  } catch (error) {
    console.error('Error checking user pulls:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// New endpoint to record a pull
app.post('/api/record-pull', async (req, res) => {
  const { email } = req.body;
  const today = getTodayDate();
  
  try {
    // In-memory fallback for development
    const currentPulls = userPulls.get(email) || 0;
    
    if (currentPulls >= 3) {
      return res.status(400).json({ error: 'No pulls remaining for today' });
    }

    // Update or insert pull record
    userPulls.set(email, currentPulls + 1);

    res.json({ 
      success: true, 
      pullsUsed: currentPulls + 1, 
      remainingPulls: Math.max(0, 3 - (currentPulls + 1))
    });
  } catch (error) {
    console.error('Error recording pull:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// New endpoint to save user pick
app.post('/api/save-pick', async (req, res) => {
  const { username, email, sport, challenge, selectedPlayer } = req.body;
  
  if (!username || !email || !sport || !challenge || !selectedPlayer) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    // In-memory fallback for development
    userPicks.push({
      username,
      email,
      sport,
      challenge,
      selected_player: selectedPlayer,
      created_at: new Date().toISOString()
    });

    res.json({ success: true, message: 'Pick saved successfully!' });
  } catch (error) {
    console.error('Error saving pick:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// New endpoint to get leaderboard from database
app.get('/api/leaderboard', async (req, res) => {
  try {
    // In-memory fallback for development
    res.json({ leaderboard: userPicks || [] });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
}); 