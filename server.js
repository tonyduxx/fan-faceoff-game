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

// Fetch NBA players from today's games only
async function fetchNBAPlayers() {
  try {
    // Get today's games first
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    const response = await axios.get('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard');
    const games = response.data.events || [];
    const players = [];
    
    // Only process today's regular season games
    games.forEach(game => {
      const gameDate = new Date(game.date).toISOString().split('T')[0];
      const isRegularSeason = game.season && game.season.type === 2;
      
      if (gameDate === todayString && isRegularSeason && game.competitions && game.competitions[0]) {
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
    
    console.log(`NBA: Found ${players.length} players from today's games`);
    return players; // Return empty array if no games today
  } catch (error) {
    console.error('Error fetching NBA players:', error.message);
    return [];
  }
}

// Fetch NFL players from today's games only
async function fetchNFLPlayers() {
  try {
    // Get today's games first
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    const response = await axios.get('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard');
    const games = response.data.events || [];
    const players = [];
    
    // Only process today's regular season games
    games.forEach(game => {
      const gameDate = new Date(game.date).toISOString().split('T')[0];
      const isRegularSeason = game.season && game.season.type === 2;
      
      if (gameDate === todayString && isRegularSeason && game.competitions && game.competitions[0]) {
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
    
    console.log(`NFL: Found ${players.length} players from today's games`);
    return players; // Return empty array if no games today
  } catch (error) {
    console.error('Error fetching NFL players:', error.message);
    return [];
  }
}

// Fetch MLB players from today's games only
async function fetchMLBPlayers() {
  try {
    // Get today's games first
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    const response = await axios.get('https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard');
    const games = response.data.events || [];
    const players = [];
    
    // Only process today's regular season games
    games.forEach(game => {
      const gameDate = new Date(game.date).toISOString().split('T')[0];
      const isRegularSeason = game.season && game.season.type === 2;
      
      if (gameDate === todayString && isRegularSeason && game.competitions && game.competitions[0]) {
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
    
    console.log(`MLB: Found ${players.length} players from today's games`);
    return players; // Return empty array if no games today
  } catch (error) {
    console.error('Error fetching MLB players:', error.message);
    return [];
  }
}

// Fetch WNBA players from today's games only
async function fetchWNBAPlayers() {
  try {
    // Get today's games first
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    const response = await axios.get('https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard');
    const games = response.data.events || [];
    const players = [];
    
    // Only process today's regular season games
    games.forEach(game => {
      const gameDate = new Date(game.date).toISOString().split('T')[0];
      const isRegularSeason = game.season && game.season.type === 2;
      
      if (gameDate === todayString && isRegularSeason && game.competitions && game.competitions[0]) {
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
    
    console.log(`WNBA: Found ${players.length} players from today's games`);
    return players; // Return empty array if no games today
  } catch (error) {
    console.error('Error fetching WNBA players:', error.message);
    return [];
  }
}

// Fetch live games with improved date filtering and season type filtering
async function fetchLiveGames(sport) {
  try {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD format

    switch (sport.toUpperCase()) {
      case 'MLB':
        const response = await axios.get('https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard');
        const mlbGames = response.data.events || [];
        // Filter for today's games only and regular season only
        const todayMlbGames = mlbGames.filter(game => {
          const gameDate = new Date(game.date).toISOString().split('T')[0];
          const isRegularSeason = game.season && game.season.type === 2; // 2 = regular season
          return gameDate === todayString && isRegularSeason;
        });
        
        console.log(`MLB: Found ${todayMlbGames.length} regular season games today out of ${mlbGames.length} total games`);
        return todayMlbGames;
      
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
        
        // Filter for today's games only and regular season only - NBA is out of season
        const todayNbaGames = nbaGames.filter(game => {
          const gameDate = new Date(game.date).toISOString().split('T')[0];
          const isRegularSeason = game.season && game.season.type === 2; // 2 = regular season
          return gameDate === todayString && isRegularSeason;
        });
        
        console.log(`NBA: Found ${todayNbaGames.length} regular season games today out of ${nbaGames.length} total games`);
        return todayNbaGames; // Return empty array for NBA since it's out of season
      
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
        
        // Filter for today's games only and regular season only (no preseason)
        const todayNflGames = nflGames.filter(game => {
          const gameDate = new Date(game.date).toISOString().split('T')[0];
          const isRegularSeason = game.season && game.season.type === 2; // 2 = regular season
          return gameDate === todayString && isRegularSeason;
        });
        
        console.log(`NFL: Found ${todayNflGames.length} regular season games today out of ${nflGames.length} total games`);
        return todayNflGames;
      
      case 'WNBA':
        const wnbaResponse = await axios.get('https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard');
        const wnbaGames = wnbaResponse.data.events || [];
        
        // Filter for today's games only and regular season only
        const todayWnbaGames = wnbaGames.filter(game => {
          const gameDate = new Date(game.date).toISOString().split('T')[0];
          const isRegularSeason = game.season && game.season.type === 2; // 2 = regular season
          return gameDate === todayString && isRegularSeason;
        });
        
        console.log(`WNBA: Found ${todayWnbaGames.length} regular season games today out of ${wnbaGames.length} total games`);
        return todayWnbaGames;
      
      default:
        return [];
    }
  } catch (error) {
    console.error(`Error fetching ${sport} live games:`, error.message);
    return [];
  }
}

// Position-specific players for each challenge
const positionPlayers = {
  NBA: {
    'Most Points': ['LeBron James', 'Stephen Curry', 'Kevin Durant', 'Giannis Antetokounmpo', 'Luka Dončić', 'Joel Embiid', 'Damian Lillard', 'Devin Booker', 'Jayson Tatum', 'Donovan Mitchell'],
    'Most Assists': ['Stephen Curry', 'Chris Paul', 'Trae Young', 'Luka Dončić', 'James Harden', 'Tyrese Haliburton', 'De\'Aaron Fox', 'Ja Morant', 'LaMelo Ball', 'Darius Garland'],
    'Most Rebounds': ['Giannis Antetokounmpo', 'Joel Embiid', 'Nikola Jokić', 'Rudy Gobert', 'Domantas Sabonis', 'Bam Adebayo', 'Jarrett Allen', 'Clint Capela', 'Evan Mobley', 'Walker Kessler'],
    'Most Steals': ['De\'Aaron Fox', 'Chris Paul', 'Jimmy Butler', 'Kawhi Leonard', 'Marcus Smart', 'Fred VanVleet', 'Tyrese Haliburton', 'Donovan Mitchell', 'Alex Caruso', 'Herbert Jones']
  },
  NFL: {
    'Most Passing Yards': ['Patrick Mahomes', 'Josh Allen', 'Justin Herbert', 'Joe Burrow', 'Dak Prescott', 'Aaron Rodgers', 'Tom Brady', 'Lamar Jackson', 'Jalen Hurts', 'Geno Smith'],
    'Most Rushing Yards': ['Derrick Henry', 'Nick Chubb', 'Josh Jacobs', 'Saquon Barkley', 'Christian McCaffrey', 'Dalvin Cook', 'Alvin Kamara', 'Jonathan Taylor', 'Austin Ekeler', 'Tony Pollard'],
    'Most Receiving Yards': ['Justin Jefferson', 'Tyreek Hill', 'Davante Adams', 'Stefon Diggs', 'A.J. Brown', 'CeeDee Lamb', 'Ja\'Marr Chase', 'DeAndre Hopkins', 'Mike Evans', 'Keenan Allen'],
    'Most Touchdowns': ['Patrick Mahomes', 'Josh Allen', 'Justin Herbert', 'Joe Burrow', 'Dak Prescott', 'Aaron Rodgers', 'Tom Brady', 'Lamar Jackson', 'Jalen Hurts', 'Geno Smith']
  },
  MLB: {
    'Most Hits': ['Ronald Acuña Jr.', 'Mookie Betts', 'Freddie Freeman', 'Jose Altuve', 'Xander Bogaerts', 'Trea Turner', 'Jose Ramirez', 'Yordan Alvarez', 'Luis Arraez', 'Bo Bichette'],
    'Most Home Runs': ['Aaron Judge', 'Shohei Ohtani', 'Yordan Alvarez', 'Kyle Schwarber', 'Pete Alonso', 'Matt Olson', 'Vladimir Guerrero Jr.', 'Rafael Devers', 'Mookie Betts', 'Ronald Acuña Jr.'],
    'Most RBIs': ['Aaron Judge', 'Shohei Ohtani', 'Yordan Alvarez', 'Pete Alonso', 'Matt Olson', 'Vladimir Guerrero Jr.', 'Rafael Devers', 'Kyle Schwarber', 'Mookie Betts', 'Ronald Acuña Jr.'],
    'Most Strikeouts': ['Shohei Ohtani', 'Gerrit Cole', 'Jacob deGrom', 'Max Scherzer', 'Corbin Burnes', 'Shane McClanahan', 'Dylan Cease', 'Spencer Strider', 'Sandy Alcantara', 'Zac Gallen']
  },
  WNBA: {
    'Most Points': ['A\'ja Wilson', 'Breanna Stewart', 'Candace Parker', 'Diana Taurasi', 'Arike Ogunbowale', 'Kelsey Plum', 'Jackie Young', 'DeWanna Bonner', 'Chelsea Gray', 'Natasha Cloud'],
    'Most Assists': ['Sabrina Ionescu', 'Courtney Vandersloot', 'Chelsea Gray', 'Natasha Cloud', 'Crystal Dangerfield', 'Marina Mabrey', 'Diana Taurasi', 'Arike Ogunbowale', 'Kelsey Plum', 'Jackie Young'],
    'Most Rebounds': ['A\'ja Wilson', 'Breanna Stewart', 'Candace Parker', 'Jonquel Jones', 'Sylvia Fowles', 'Tina Thompson', 'Tamika Catchings', 'Lauren Jackson', 'DeWanna Bonner', 'Chelsea Gray'],
    'Most Blocks': ['A\'ja Wilson', 'Breanna Stewart', 'Candace Parker', 'Jonquel Jones', 'Sylvia Fowles', 'Tina Thompson', 'Tamika Catchings', 'Lauren Jackson', 'DeWanna Bonner', 'Chelsea Gray']
  }
};

// API endpoints
app.get('/api/today-players', async (req, res) => {
  const sport = req.query.sport || 'NBA';
  const challenge = req.query.challenge || '';
  
  let players = [];

  // Always fetch players from today's actual games
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

  // If no players found from today's games, return empty array
  if (players.length === 0) {
    console.log(`No players found for ${sport} today - no games scheduled`);
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