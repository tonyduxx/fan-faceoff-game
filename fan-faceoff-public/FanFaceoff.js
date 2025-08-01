const { useEffect, useState } = React;

const challengesBySport = {
  NBA: ['Most Points', 'Most Assists', 'Most Rebounds', 'Most Steals'],
  NFL: ['Most Passing Yards', 'Most Touchdowns', 'Most Tackles', 'Most Sacks'],
  MLB: ['Most Hits', 'Most Home Runs', 'Most RBIs', 'Most Strikeouts'],
  WNBA: ['Most Points', 'Most Assists', 'Most Rebounds', 'Most Blocks'],
};

// Sound effects using Web Audio API
const createSound = (frequency, duration, type = 'sine') => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

const playLeverSound = () => {
  // Mechanical lever pull sound
  createSound(200, 0.1, 'sawtooth');
  setTimeout(() => createSound(150, 0.1, 'sawtooth'), 100);
  setTimeout(() => createSound(100, 0.2, 'sawtooth'), 200);
};

const playSpinningSound = () => {
  // Continuous spinning sound
  const spinInterval = setInterval(() => {
    createSound(300 + Math.random() * 200, 0.05, 'square');
  }, 100);
  
  return spinInterval;
};

const playWinSound = () => {
  // Victory sound when player is selected
  createSound(523, 0.2, 'sine'); // C
  setTimeout(() => createSound(659, 0.2, 'sine'), 200); // E
  setTimeout(() => createSound(784, 0.2, 'sine'), 400); // G
  setTimeout(() => createSound(1047, 0.4, 'sine'), 600); // C (high)
  setTimeout(() => createSound(784, 0.2, 'sine'), 1000); // G
  setTimeout(() => createSound(659, 0.2, 'sine'), 1200); // E
  setTimeout(() => createSound(523, 0.4, 'sine'), 1400); // C
};

const playCoinSound = () => {
  // Coin drop sound
  createSound(800, 0.1, 'triangle');
  setTimeout(() => createSound(600, 0.1, 'triangle'), 100);
  setTimeout(() => createSound(400, 0.2, 'triangle'), 200);
};

function FanFaceoff() {
  const [sport, setSport] = useState('NBA');
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [challenge, setChallenge] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [todayDate, setTodayDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasGames, setHasGames] = useState(true);
  const [gameStatus, setGameStatus] = useState('');
  const [sportAvailability, setSportAvailability] = useState({
    NBA: true,
    NFL: true,
    MLB: true,
    WNBA: true
  });
  const [isSpinning, setIsSpinning] = useState(false);
  const [slotResult, setSlotResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [remainingPulls, setRemainingPulls] = useState(3);
  const [pullsUsed, setPullsUsed] = useState(0);
  const [canPull, setCanPull] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const pickChallenge = () => {
      const today = new Date().toISOString().split('T')[0];
      const hash = today + sport;
      const options = challengesBySport[sport];
      const index = [...hash].reduce((sum, char) => sum + char.charCodeAt(0), 0) % options.length;
      setChallenge(options[index]);
    };

    pickChallenge();
    fetchTodayDate();
    checkAllSportsAvailability();
    fetchPlayers();
    checkGameStatus();
    loadLeaderboard();
  }, [sport]);

  const fetchTodayDate = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/today-date');
      const data = await res.json();
      setTodayDate(data.date);
    } catch (err) {
      console.error('Failed to load date:', err);
      const today = new Date();
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      setTodayDate(today.toLocaleDateString('en-US', options));
    }
  };

  const checkAllSportsAvailability = async () => {
    const sports = ['NBA', 'NFL', 'MLB', 'WNBA'];
    const availability = {};
    
    for (const sportName of sports) {
      try {
        const res = await fetch(`http://localhost:4000/api/live-games?sport=${sportName}`);
        const data = await res.json();
        const games = data.games || [];
        availability[sportName] = games.length > 0;
      } catch (err) {
        console.error(`Failed to check ${sportName} availability:`, err);
        availability[sportName] = false;
      }
    }
    
    setSportAvailability(availability);
    
    if (!availability[sport]) {
      const availableSport = Object.keys(availability).find(s => availability[s]);
      if (availableSport) {
        setSport(availableSport);
      }
    }
  };

  const checkGameStatus = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/live-games?sport=${sport}`);
      const data = await res.json();
      const games = data.games || [];
      
      if (games.length === 0) {
        setHasGames(false);
        const currentMonth = new Date().getMonth() + 1;
        if (sport === 'NBA' && (currentMonth < 10 || currentMonth > 6)) {
          setGameStatus('NBA season is currently off-season (October-June)');
        } else if (sport === 'NFL' && (currentMonth < 9 || currentMonth > 2)) {
          setGameStatus('NFL season is currently off-season (September-February)');
        } else if (sport === 'WNBA' && (currentMonth < 5 || currentMonth > 10)) {
          setGameStatus('WNBA season is currently off-season (May-October)');
        } else {
          setGameStatus('No games scheduled for today');
        }
      } else {
        setHasGames(true);
        setGameStatus('');
      }
    } catch (err) {
      console.error('Failed to check game status:', err);
      setHasGames(false);
      setGameStatus('Unable to check game status');
    }
  };

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/today-players?sport=${sport}`);
      const data = await res.json();
      setPlayers(data.players || []);
    } catch (err) {
      console.error('Failed to load players:', err);
      setError('Failed to load players. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/leaderboard');
      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
      // Fallback to localStorage
      const saved = localStorage.getItem('fanFaceoffLeaderboard');
      if (saved) {
        try {
          setLeaderboard(JSON.parse(saved));
        } catch {
          setLeaderboard([]);
        }
      }
    }
  };

  const checkUserPulls = async (userEmail) => {
    if (!userEmail) return;
    
    try {
      const res = await fetch(`http://localhost:4000/api/user-pulls?email=${encodeURIComponent(userEmail)}`);
      const data = await res.json();
      setPullsUsed(data.pullsUsed || 0);
      setRemainingPulls(data.remainingPulls || 3);
      setCanPull(data.canPull !== false);
    } catch (err) {
      console.error('Failed to check user pulls:', err);
      // Fallback to default values if database is not available
      setCanPull(true);
      setRemainingPulls(3);
      setPullsUsed(0);
    }
  };

  const pullLever = async () => {
    if (players.length === 0 || isSpinning || !canPull || !email) {
      if (!email) {
        setError('Please enter your email first!');
        return;
      }
      if (!canPull) {
        setError('You have no pulls remaining for today!');
        return;
      }
      return;
    }
    
    // Play lever pull sound
    if (soundEnabled) {
      playLeverSound();
    }
    
    setIsSpinning(true);
    setShowResult(false);
    setSlotResult(null);
    setError('');
    
    // Record the pull first
    try {
      const res = await fetch('http://localhost:4000/api/record-pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      if (data.success !== false) { // Allow both success: true and undefined
        setPullsUsed(data.pullsUsed || pullsUsed + 1);
        setRemainingPulls(data.remainingPulls || Math.max(0, 3 - (pullsUsed + 1)));
        setCanPull((data.remainingPulls || Math.max(0, 3 - (pullsUsed + 1))) > 0);
      } else {
        setError(data.error || 'Failed to record pull');
        setIsSpinning(false);
        return;
      }
    } catch (err) {
      console.error('Failed to record pull:', err);
      // Continue with the pull even if database fails
      setPullsUsed(pullsUsed + 1);
      setRemainingPulls(Math.max(0, 3 - (pullsUsed + 1)));
      setCanPull(Math.max(0, 3 - (pullsUsed + 1)) > 0);
    }
    
    // Start spinning sound
    let spinSoundInterval;
    if (soundEnabled) {
      spinSoundInterval = playSpinningSound();
    }
    
    // Simulate slot machine spinning with random names
    const spinDuration = 3000; // 3 seconds
    const spinInterval = 150; // Update every 150ms (slower for better effect)
    
    let spinCount = 0;
    const maxSpins = spinDuration / spinInterval;
    
    // Create a list of random names for spinning effect (not just from today's players)
    const spinningNames = [
      'LeBron James', 'Stephen Curry', 'Kevin Durant', 'Giannis Antetokounmpo',
      'Patrick Mahomes', 'Derrick Henry', 'Aaron Donald', 'Travis Kelce',
      'Shohei Ohtani', 'Aaron Judge', 'Mookie Betts', 'Ronald Acuña Jr.',
      'A\'ja Wilson', 'Breanna Stewart', 'Sabrina Ionescu', 'Candace Parker',
      'Luka Dončić', 'Joel Embiid', 'Nikola Jokić', 'Jayson Tatum',
      'Josh Allen', 'Christian McCaffrey', 'Tyreek Hill', 'Jalen Hurts',
      'Freddie Freeman', 'Juan Soto', 'Yordan Alvarez', 'Kyle Tucker',
      'Kelsey Plum', 'Chelsea Gray', 'Jackie Young', 'Arike Ogunbowale'
    ];
    
    const spin = setInterval(() => {
      // Show random names during spinning (not just from today's players)
      const randomName = spinningNames[Math.floor(Math.random() * spinningNames.length)];
      setSlotResult(randomName);
      spinCount++;
      
      if (spinCount >= maxSpins) {
        clearInterval(spin);
        
        // Stop spinning sound
        if (spinSoundInterval) {
          clearInterval(spinSoundInterval);
        }
        
        setIsSpinning(false);
        
        // Select the final player from today's actual players
        const finalPlayer = players[Math.floor(Math.random() * players.length)];
        setSelectedPlayer(finalPlayer);
        setSlotResult(finalPlayer);
        setShowResult(true);
        
        // Play win sound
        if (soundEnabled) {
          playWinSound();
          setTimeout(() => playCoinSound(), 1600); // Play coin sound after win sound
        }
        
        // Hide result after 3 seconds
        setTimeout(() => setShowResult(false), 3000);
      }
    }, spinInterval);
  };

  const submitPick = async () => {
    if (!username) {
      setError('Please enter your name.');
      return;
    }
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    if (!selectedPlayer) {
      setError('Please pull the lever to select a player!');
      return;
    }
    
    setError('');
    
    try {
      const res = await fetch('http://localhost:4000/api/save-pick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          sport,
          challenge,
          selectedPlayer
        })
      });
      
      const data = await res.json();
      if (data.success) {
        // Reload leaderboard
        await loadLeaderboard();
        
        // Clear form
        setSelectedPlayer(null);
        setSlotResult(null);
        
        // Show success message
        setError('');
        alert('🎉 Your pick has been saved successfully!');
      } else {
        setError(data.error || 'Failed to save pick');
      }
    } catch (err) {
      console.error('Failed to save pick:', err);
      setError('Failed to save pick. Please try again.');
    }
  };

  // Check user pulls when email changes
  useEffect(() => {
    if (email) {
      checkUserPulls(email);
    }
  }, [email]);

  const uniqueLeaderboard = Array.from(
    new Map(leaderboard.map(entry => [entry.username, entry])).values()
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      padding: '2rem',
      fontFamily: '"Arial", sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        border: '3px solid #ffd700',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
          padding: '2rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            fontSize: '2rem',
            color: '#fff',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            🏆
          </div>
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            fontSize: '2rem',
            color: '#fff',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            🏆
          </div>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            color: '#fff',
            textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
            margin: '0 0 0.5rem 0',
            fontFamily: '"Impact", "Arial Black", sans-serif'
          }}>
            🔥 FAN FACEOFF 🔥
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#fff',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            margin: '0',
            fontWeight: '500'
          }}>
            {todayDate}
          </p>
        </div>

        <div style={{ padding: '2rem' }}>
          {/* Sound Toggle */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '1rem',
            position: 'relative'
          }}>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              style={{
                background: soundEnabled ? 'linear-gradient(45deg, #4caf50, #45a049)' : 'linear-gradient(45deg, #f44336, #d32f2f)',
                color: '#fff',
                border: 'none',
                borderRadius: '25px',
                padding: '8px 16px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease'
              }}
            >
              {soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF'}
            </button>
          </div>

          {error && (
            <div style={{ 
              color: '#d32f2f', 
              marginBottom: '1rem', 
              fontWeight: 'bold',
              textAlign: 'center',
              padding: '1rem',
              background: '#ffebee',
              borderRadius: '10px',
              border: '2px solid #f44336'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Player Name Input */}
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <label style={{ 
              fontWeight: 'bold', 
              fontSize: '1.2rem',
              color: '#333',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              🎮 Your Name
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ 
                width: '100%', 
                maxWidth: '300px',
                padding: '15px', 
                marginBottom: '1rem', 
                borderRadius: '15px', 
                border: '3px solid #ddd',
                fontSize: '1.1rem',
                textAlign: 'center',
                fontWeight: 'bold'
              }}
              placeholder="Enter your name"
            />
          </div>

          {/* Email Input */}
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <label style={{ 
              fontWeight: 'bold', 
              fontSize: '1.2rem',
              color: '#333',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              📧 Your Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                width: '100%', 
                maxWidth: '300px',
                padding: '15px', 
                marginBottom: '1rem', 
                borderRadius: '15px', 
                border: '3px solid #ddd',
                fontSize: '1.1rem',
                textAlign: 'center',
                fontWeight: 'bold'
              }}
              placeholder="Enter your email"
            />
          </div>

          {/* Pulls Counter */}
          {email && (
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '2rem',
              padding: '1rem',
              background: 'linear-gradient(45deg, #4caf50, #45a049)',
              borderRadius: '15px',
              color: '#fff',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem' }}>
                🎰 Pulls Remaining Today
              </h3>
              <p style={{ 
                margin: '0', 
                fontSize: '2rem', 
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}>
                {remainingPulls} / 3
              </p>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
                Used: {pullsUsed} | Remaining: {remainingPulls}
              </p>
            </div>
          )}

          {/* Sport Selection */}
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <label style={{ 
              fontWeight: 'bold', 
              fontSize: '1.2rem',
              color: '#333',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              🏈 Choose Your Sport
            </label>
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              style={{ 
                width: '100%', 
                maxWidth: '300px',
                padding: '15px', 
                marginBottom: '1rem', 
                borderRadius: '15px', 
                border: '3px solid #ddd',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              <option value="NBA" disabled={!sportAvailability.NBA}>
                🏀 NBA {!sportAvailability.NBA ? '(No Games)' : ''}
              </option>
              <option value="NFL" disabled={!sportAvailability.NFL}>
                🏈 NFL {!sportAvailability.NFL ? '(No Games)' : ''}
              </option>
              <option value="MLB" disabled={!sportAvailability.MLB}>
                ⚾ MLB {!sportAvailability.MLB ? '(No Games)' : ''}
              </option>
              <option value="WNBA" disabled={!sportAvailability.WNBA}>
                🏀 WNBA {!sportAvailability.WNBA ? '(No Games)' : ''}
              </option>
            </select>
          </div>

          {/* Challenge Display */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '2rem',
            padding: '1rem',
            background: 'linear-gradient(45deg, #2196f3, #21cbf3)',
            borderRadius: '15px',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem' }}>
              🎯 Today's Challenge
            </h3>
            <p style={{ 
              margin: '0', 
              fontSize: '1.5rem', 
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              {challenge}
            </p>
          </div>

          {/* Slot Machine */}
          {loading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem', 
              color: '#666',
              fontSize: '1.2rem'
            }}>
              🎰 Loading players...
            </div>
          ) : !hasGames ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem', 
              color: '#666',
              background: '#f5f5f5',
              borderRadius: '15px',
              marginBottom: '2rem'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎰</div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                No Games Today
              </div>
              <div style={{ fontSize: '1rem' }}>{gameStatus}</div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h3 style={{ 
                fontWeight: 'bold', 
                fontSize: '1.5rem',
                color: '#333',
                marginBottom: '1rem'
              }}>
                🎰 PULL THE LEVER! 🎰
              </h3>
              
              {/* Slot Machine Display */}
              <div style={{
                background: 'linear-gradient(45deg, #8b4513, #a0522d)',
                border: '5px solid #654321',
                borderRadius: '20px',
                padding: '2rem',
                marginBottom: '1rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                position: 'relative'
              }}>
                <div style={{
                  background: '#000',
                  border: '3px solid #gold',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  marginBottom: '1rem',
                  minHeight: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {slotResult ? (
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: '#ffd700',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                      animation: isSpinning ? 'blink 0.1s infinite' : 'none'
                    }}>
                      {slotResult}
                    </div>
                  ) : (
                    <div style={{
                      fontSize: '1.5rem',
                      color: '#666',
                      fontStyle: 'italic'
                    }}>
                      Pull the lever to spin!
                    </div>
                  )}
                </div>
                
                {/* Lever */}
                <button
                  onClick={pullLever}
                  disabled={isSpinning || players.length === 0 || !canPull || !email}
                  style={{
                    background: (isSpinning || !canPull || !email) ? '#666' : 'linear-gradient(45deg, #ff4444, #cc0000)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '15px 30px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    cursor: (isSpinning || !canPull || !email) ? 'not-allowed' : 'pointer',
                    boxShadow: (isSpinning || !canPull || !email) ? 'none' : '0 5px 15px rgba(255, 68, 68, 0.4)',
                    transform: (isSpinning || !canPull || !email) ? 'scale(0.95)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    border: '3px solid #cc0000'
                  }}
                >
                  {!email ? '📧 Enter Email First!' : 
                   !canPull ? '❌ No Pulls Left!' :
                   isSpinning ? '🎰 SPINNING... 🎰' : '🎰 PULL LEVER! 🎰'}
                </button>
              </div>

              {showResult && selectedPlayer && (
                <div style={{
                  background: 'linear-gradient(45deg, #4caf50, #45a049)',
                  color: '#fff',
                  padding: '1rem',
                  borderRadius: '15px',
                  marginBottom: '1rem',
                  animation: 'bounce 0.5s ease',
                  boxShadow: '0 5px 15px rgba(76, 175, 80, 0.4)'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    You got: {selectedPlayer}!
                  </div>
                </div>
              )}

              {players.length > 0 && (
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: '#666', 
                  fontStyle: 'italic'
                }}>
                  {players.length} players available from today's {sport} games
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <button
              onClick={submitPick}
              disabled={loading || !hasGames || !selectedPlayer || !username || !email}
              style={{ 
                width: '100%', 
                maxWidth: '400px',
                padding: '20px', 
                backgroundColor: (loading || !hasGames || !selectedPlayer || !username || !email) ? '#ccc' : 'linear-gradient(45deg, #ff6b35, #f7931e)', 
                color: '#fff', 
                fontWeight: 'bold', 
                border: 'none', 
                borderRadius: '15px', 
                fontSize: '1.3rem', 
                cursor: (loading || !hasGames || !selectedPlayer || !username || !email) ? 'not-allowed' : 'pointer',
                boxShadow: (loading || !hasGames || !selectedPlayer || !username || !email) ? 'none' : '0 8px 25px rgba(255, 107, 53, 0.4)',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Loading...' : 
               !hasGames ? 'No Games Available' : 
               !username ? 'Enter Your Name!' :
               !email ? 'Enter Your Email!' :
               !selectedPlayer ? 'Pull the Lever First!' : '🚀 SUBMIT PICK! 🚀'}
            </button>
          </div>

          {/* Leaderboard */}
          {uniqueLeaderboard.length > 0 && (
            <div style={{ 
              background: 'linear-gradient(45deg, #2c3e50, #34495e)',
              borderRadius: '15px',
              padding: '1.5rem',
              color: '#fff'
            }}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                marginBottom: '1rem',
                textAlign: 'center',
                color: '#ffd700'
              }}>
                🏆 LEADERBOARD 🏆
              </h3>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {uniqueLeaderboard.map((entry, i) => (
                  <div key={i} style={{ 
                    padding: '1rem', 
                    borderBottom: '1px solid #34495e', 
                    display: 'flex', 
                    flexDirection: 'column',
                    background: i === 0 ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                    borderRadius: i === 0 ? '10px' : '0',
                    border: i === 0 ? '2px solid #ffd700' : 'none'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{ 
                        fontSize: '1.5rem', 
                        marginRight: '0.5rem',
                        color: i === 0 ? '#ffd700' : '#fff'
                      }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                      </span>
                      <span style={{ 
                        fontWeight: 'bold',
                        color: i === 0 ? '#ffd700' : '#fff'
                      }}>
                        {entry.username}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#bdc3c7' }}>
                      Chose <strong>{entry.selected_player || entry.pick}</strong> for <em>{entry.sport}</em> ({entry.challenge})
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#95a5a6' }}>
                      {new Date(entry.created_at || entry.time).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
} 