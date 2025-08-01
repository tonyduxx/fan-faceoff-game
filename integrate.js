#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎮 Fan Faceoff Integration Helper');
console.log('================================\n');

// Get the target directory from command line or use current
const targetDir = process.argv[2] || process.cwd();

console.log(`Target directory: ${targetDir}\n`);

// Files to copy
const filesToCopy = [
  { src: 'server.js', dest: 'fan-faceoff-server.js' },
  { src: 'package.json', dest: 'fan-faceoff-package.json' },
  { src: 'public', dest: 'fan-faceoff-public' }
];

// Integration code to add to main server
const integrationCode = `
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
`;

// SQL for database tables
const sqlTables = `
-- Fan Faceoff Database Tables
-- Run these in your Supabase SQL editor

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

-- Optional: Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_pulls_email_date ON user_pulls(email, date);
CREATE INDEX IF NOT EXISTS idx_user_picks_created_at ON user_picks(created_at DESC);
`;

function copyFile(src, dest) {
  try {
    const srcPath = path.join(__dirname, src);
    const destPath = path.join(targetDir, dest);
    
    if (fs.existsSync(srcPath)) {
      if (fs.lstatSync(srcPath).isDirectory()) {
        // Copy directory
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath, { recursive: true });
        }
        copyDirectory(srcPath, destPath);
      } else {
        // Copy file
        fs.copyFileSync(srcPath, destPath);
      }
      console.log(`✅ Copied ${src} → ${dest}`);
    } else {
      console.log(`❌ Source file not found: ${src}`);
    }
  } catch (error) {
    console.log(`❌ Error copying ${src}: ${error.message}`);
  }
}

function copyDirectory(src, dest) {
  const items = fs.readdirSync(src);
  
  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (fs.lstatSync(srcPath).isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function createIntegrationFiles() {
  try {
    // Create integration code file
    const integrationPath = path.join(targetDir, 'fan-faceoff-integration.js');
    fs.writeFileSync(integrationPath, integrationCode);
    console.log('✅ Created fan-faceoff-integration.js');
    
    // Create SQL file
    const sqlPath = path.join(targetDir, 'fan-faceoff-tables.sql');
    fs.writeFileSync(sqlPath, sqlTables);
    console.log('✅ Created fan-faceoff-tables.sql');
    
    // Create README for integration
    const readmeContent = `# Fan Faceoff Integration

## Quick Setup

1. **Install dependencies:**
   \`\`\`bash
   npm install express axios cors
   \`\`\`

2. **Add to your main server.js:**
   \`\`\`javascript
   // Copy contents from fan-faceoff-integration.js
   \`\`\`

3. **Run database setup:**
   - Open fan-faceoff-tables.sql in your Supabase SQL editor
   - Execute the SQL commands

4. **Update Supabase credentials:**
   - Edit fan-faceoff-server.js
   - Replace with your existing Supabase URL and key

5. **Access the game:**
   - http://localhost:3000/fan-faceoff (or your port)

## Files Added

- \`fan-faceoff-server.js\` - Main server logic
- \`fan-faceoff-public/\` - Frontend files
- \`fan-faceoff-integration.js\` - Code to add to your main server
- \`fan-faceoff-tables.sql\` - Database setup
- \`fan-faceoff-package.json\` - Dependencies list

## Environment Variables

Add to your .env file:
\`\`\`env
SUPABASE_URL=your-existing-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-existing-supabase-key
\`\`\`
`;
    
    const readmePath = path.join(targetDir, 'FAN_FACEOFF_SETUP.md');
    fs.writeFileSync(readmePath, readmeContent);
    console.log('✅ Created FAN_FACEOFF_SETUP.md');
    
  } catch (error) {
    console.log(`❌ Error creating integration files: ${error.message}`);
  }
}

// Main execution
console.log('📁 Copying files...\n');

for (const file of filesToCopy) {
  copyFile(file.src, file.dest);
}

console.log('\n📝 Creating integration files...\n');
createIntegrationFiles();

console.log('\n🎉 Integration files ready!');
console.log('\n📋 Next steps:');
console.log('1. Install dependencies: npm install express axios cors');
console.log('2. Add integration code to your main server.js');
console.log('3. Run fan-faceoff-tables.sql in your Supabase SQL editor');
console.log('4. Update Supabase credentials in fan-faceoff-server.js');
console.log('5. Restart your server');
console.log('\n📖 See FAN_FACEOFF_SETUP.md for detailed instructions'); 