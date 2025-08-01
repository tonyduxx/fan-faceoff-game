
// ===== FAN FACEOFF INTEGRATION =====
// Add these lines to your main server.js or app.js

// Serve Fan Faceoff static files
app.use('/fan-faceoff', express.static(path.join(__dirname, 'fan-faceoff-public')));

// Fan Faceoff API routes
const fanFaceoffRoutes = require('./fan-faceoff-server');
app.use('/fan-faceoff/api', fanFaceoffRoutes);

// Optional: Add a redirect from /games to /fan-faceoff
app.get('/games', (req, res) => {
  res.redirect('/fan-faceoff');
});

// ===== END FAN FACEOFF INTEGRATION =====
