# Fan Faceoff Integration

## Quick Setup

1. **Install dependencies:**
   ```bash
   npm install express axios cors
   ```

2. **Add to your main server.js:**
   ```javascript
   // Copy contents from fan-faceoff-integration.js
   ```

3. **Run database setup:**
   - Open fan-faceoff-tables.sql in your Supabase SQL editor
   - Execute the SQL commands

4. **Update Supabase credentials:**
   - Edit fan-faceoff-server.js
   - Replace with your existing Supabase URL and key

5. **Access the game:**
   - http://localhost:3000/fan-faceoff (or your port)

## Files Added

- `fan-faceoff-server.js` - Main server logic
- `fan-faceoff-public/` - Frontend files
- `fan-faceoff-integration.js` - Code to add to your main server
- `fan-faceoff-tables.sql` - Database setup
- `fan-faceoff-package.json` - Dependencies list

## Environment Variables

Add to your .env file:
```env
SUPABASE_URL=your-existing-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-existing-supabase-key
```
