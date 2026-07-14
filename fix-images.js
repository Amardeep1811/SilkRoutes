const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach((file) => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

walk('frontend/src', (err, results) => {
  if (err) throw err;
  results.filter(f => f.endsWith('.jsx') || f.endsWith('.js')).forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    if (content.includes('src={') && !content.includes('BASE_URL')) {
        // We only want to touch files that have image rendering logic that needs BASE_URL
        // Let's just do a naive check if it contains src={...image...} or src={...url...}
        if (/src=\{[^}]*(image|img|url)[^}]*\}/i.test(content) || file.includes('Test.jsx')) {
            
            // Add import if missing
            if (!content.includes('BASE_URL')) {
                const importMatch = content.match(/import.*from.*/g);
                if (importMatch) {
                    const lastImport = importMatch[importMatch.length - 1];
                    // We need the relative path to src/redux/constants
                    // Let's just cheat and do absolute if possible, or count directories
                    // Wait, Vite supports absolute aliases? Let's just assume we can find the path or I'll just skip the script and do it manually.
                }
            }
        }
    }
  });
});
