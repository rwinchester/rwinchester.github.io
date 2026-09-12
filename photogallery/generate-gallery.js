const fs = require('fs');
const path = require('path');

const photosDir = path.join(__dirname, 'photos');
const outputFile = path.join(__dirname, 'gallery-data.json');

// Supported image extensions
const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];

if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir);
}

const files = fs.readdirSync(photosDir);

const photos = files
  .filter(file => validExtensions.includes(path.extname(file).toLowerCase()))
  .map(file => {
    const filePath = path.join(photosDir, file);
    const stats = fs.statSync(filePath);
    return {
      filename: file,
      src: `photos/${encodeURIComponent(file)}`,
      // Uses the file creation/modification time for sorting
      date: stats.birthtimeMs || stats.mtimeMs
    };
  })
  // Sort by date (newest first). Swap `b.date - a.date` to `a.date - b.date` for oldest first.
  .sort((a, b) => b.date - a.date);

fs.writeFileSync(outputFile, JSON.stringify(photos, null, 2));
console.log(`Successfully indexed ${photos.length} photos.`);
