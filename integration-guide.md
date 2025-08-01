# 🔄 Integration Guide: Adding Fan Faceoff to Existing Project

## Option 1: Add as New Route (Node.js/Express Project)

### Step 1: Copy Files to Your Existing Project

```bash
# Copy these files to your existing project:
cp server.js /path/to/your/existing/project/fan-faceoff-server.js
cp -r public /path/to/your/existing/project/fan-faceoff-public
cp package.json /path/to/your/existing/project/fan-faceoff-package.json
```

### Step 2: Add Routes to Your Main Server

Add this to your existing `server.js` or `app.js`:

```javascript
// Fan Faceoff Routes
app.use('/fan-faceoff', express.static('fan-faceoff-public'));
app.use('/fan-faceoff/api', require('./fan-faceoff-server'));

// Or mount the entire fan-faceoff server
const fanFaceoffApp = require('./fan-faceoff-server');
app.use('/fan-faceoff', fanFaceoffApp);
```

### Step 3: Update Database Tables

Run these SQL commands in your existing Supabase project:

```sql
-- Add Fan Faceoff tables to your existing database
CREATE TABLE IF NOT EXISTS user_pulls (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  pulls_used INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(email, date)
);

CREATE TABLE IF NOT EXISTS user_picks (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  sport VARCHAR(10) NOT NULL,
  challenge VARCHAR(100) NOT NULL,
  selected_player VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Step 4: Update Environment Variables

Add to your existing `.env` file:

```env
# Fan Faceoff Configuration
FAN_FACEOFF_ENABLED=true
SUPABASE_URL=your-existing-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-existing-supabase-key
```

### Step 5: Access the Game

Your Fan Faceoff game will be available at:
```
https://your-existing-site.com/fan-faceoff
```

## Option 2: Standalone Integration (Separate Deployment)

### Step 1: Update Supabase Configuration

Edit `server.js` to use your existing Supabase credentials:

```javascript
// Replace these with your existing Supabase details
const supabaseUrl = 'https://your-existing-project.supabase.co';
const supabaseKey = 'your-existing-service-role-key';
```

### Step 2: Deploy Separately

Deploy this as a separate service that connects to your existing Supabase database.

### Step 3: Cross-Domain Integration

Add CORS configuration to allow your main site to communicate:

```javascript
app.use(cors({
  origin: ['https://your-main-site.com', 'http://localhost:3000'],
  credentials: true
}));
```

## Option 3: Embed as iFrame

### Step 1: Deploy Fan Faceoff Separately

Deploy this game to a subdomain like `games.your-site.com`

### Step 2: Embed in Your Main Site

Add this to your existing website:

```html
<iframe 
  src="https://games.your-site.com" 
  width="100%" 
  height="800px" 
  frameborder="0"
  style="border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
</iframe>
```

## Option 4: Full Integration (Replace/Enhance Existing)

### Step 1: Merge Features

Combine the best features from both projects:

```javascript
// In your main server.js
const fanFaceoffRoutes = require('./fan-faceoff-routes');
app.use('/api/fan-faceoff', fanFaceoffRoutes);

// Add navigation to your existing site
app.get('/games/fan-faceoff', (req, res) => {
  res.sendFile(path.join(__dirname, 'fan-faceoff-public', 'index.html'));
});
```

### Step 2: Shared Authentication

Use your existing user authentication:

```javascript
// Modify fan-faceoff to use your existing auth
app.get('/api/user-pulls', authenticateUser, async (req, res) => {
  const userEmail = req.user.email; // From your existing auth
  // ... rest of the logic
});
```

## 🔧 Quick Integration Commands

### For Option 1 (Recommended):

```bash
# 1. Copy files to your existing project
cp -r fan-faceoff-game/* /path/to/your/existing/project/fan-faceoff/

# 2. Install dependencies in your existing project
cd /path/to/your/existing/project
npm install express axios cors

# 3. Add routes to your main server.js
echo "
// Fan Faceoff Integration
app.use('/fan-faceoff', express.static('./fan-faceoff/public'));
app.use('/fan-faceoff/api', require('./fan-faceoff/server'));
" >> server.js

# 4. Restart your server
npm restart
```

### For Option 2 (Standalone):

```bash
# 1. Update Supabase credentials
sed -i '' 's/your-supabase-url/https:\/\/your-existing-project.supabase.co/g' server.js
sed -i '' 's/your-supabase-key/your-actual-key/g' server.js

# 2. Deploy to your preferred platform
# (Heroku, Railway, Render, etc.)
```

## 🎯 Recommended Approach

**For most cases, I recommend Option 1** because:
- ✅ Uses your existing infrastructure
- ✅ Shares your existing database
- ✅ Single deployment to manage
- ✅ Consistent user experience
- ✅ Easier maintenance

## 🚀 Next Steps

1. **Choose your integration approach**
2. **Update Supabase credentials** to use your existing project
3. **Test locally** first
4. **Deploy to your existing platform**
5. **Add navigation** to your main site

Which approach would you like to use? I can help you implement any of these options! 