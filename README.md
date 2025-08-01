# 🏆 Fan Faceoff Game

A thrilling sports prediction game where users pull a slot machine lever to automatically select players from today's NBA, NFL, MLB, and WNBA games!

## 🎮 Features

- **Slot Machine Player Selection**: Pull the lever to randomly select players
- **Real-time Sports Data**: Fetches today's players from ESPN API
- **Multiple Sports**: NBA, NFL, MLB, and WNBA support
- **Sound Effects**: Immersive slot machine sounds
- **Daily Pull Limits**: 3 pulls per day per user
- **Leaderboard**: Track all user picks
- **Responsive Design**: Works on desktop and mobile

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd fan-faceoff-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:4000
   ```

## 🌐 Deployment Options

### Option 1: Heroku (Recommended - Free Tier)

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew install heroku/brew/heroku
   
   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku app**
   ```bash
   heroku create your-fan-faceoff-app
   ```

4. **Set environment variables**
   ```bash
   heroku config:set SUPABASE_URL=your-supabase-url
   heroku config:set SUPABASE_SERVICE_ROLE_KEY=your-supabase-key
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

6. **Open your app**
   ```bash
   heroku open
   ```

### Option 2: Railway (Free Tier)

1. **Go to [Railway.app](https://railway.app)**
2. **Connect your GitHub repository**
3. **Set environment variables in Railway dashboard**
4. **Deploy automatically**

### Option 3: Render (Free Tier)

1. **Go to [Render.com](https://render.com)**
2. **Create new Web Service**
3. **Connect your GitHub repository**
4. **Set environment variables**
5. **Deploy**

### Option 4: Vercel (Free Tier)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts**

### Option 5: DigitalOcean App Platform

1. **Go to [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)**
2. **Connect your GitHub repository**
3. **Configure environment variables**
4. **Deploy**

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=4000

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# RapidAPI Keys (optional)
RAPIDAPI_KEY=your-rapidapi-key-here

# Environment
NODE_ENV=production
```

## 📊 Database Setup (Supabase)

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Create the required tables**:

```sql
-- Table for user pulls (daily limits)
CREATE TABLE user_pulls (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  pulls_used INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(email, date)
);

-- Table for user picks
CREATE TABLE user_picks (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  sport VARCHAR(10) NOT NULL,
  challenge VARCHAR(100) NOT NULL,
  selected_player VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

3. **Get your API keys** from the Supabase dashboard
4. **Update your environment variables** with the real keys

## 🎯 API Endpoints

- `GET /api/today-players?sport=NBA` - Get today's players for a sport
- `GET /api/live-games?sport=NBA` - Get today's games for a sport
- `GET /api/today-date` - Get current formatted date
- `GET /api/user-pulls?email=user@example.com` - Check user's remaining pulls
- `POST /api/record-pull` - Record a slot machine pull
- `POST /api/save-pick` - Save a user's pick
- `GET /api/leaderboard` - Get the leaderboard

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React (CDN), HTML5, CSS3
- **Database**: Supabase (PostgreSQL)
- **APIs**: ESPN API, RapidAPI (optional)
- **Audio**: Web Audio API
- **Deployment**: Heroku/Railway/Render/Vercel

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🎵 Sound Features

- **Lever Pull**: Mechanical sawtooth sound
- **Spinning**: Continuous electronic noise
- **Win**: Musical victory melody
- **Coin Drop**: Triangle wave coin sound
- **Toggle**: On/off sound control

## 🔒 Security Features

- **Input Validation**: Email format validation
- **Rate Limiting**: Daily pull limits
- **CORS**: Cross-origin resource sharing enabled
- **Environment Variables**: Secure API key storage

## 📈 Performance

- **Caching**: In-memory fallback for database
- **Error Handling**: Graceful API failures
- **Loading States**: User feedback during operations
- **Responsive**: Mobile-optimized design

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   pkill -f "node server.js"
   ```

2. **Supabase connection failed**
   - Check your API keys
   - Verify table structure
   - Check network connectivity

3. **No players showing**
   - Check if there are games today
   - Verify ESPN API is accessible
   - Check browser console for errors

### Debug Mode

Enable debug logging:
```bash
NODE_ENV=development npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

---

**Made with ❤️ for sports fans everywhere!** 