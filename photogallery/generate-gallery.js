const fs = require('fs');
const path = require('path');

const photosDir = path.join(process.cwd(), 'photos');
const outputFile = path.join(process.cwd(), 'gallery-data.json');

console.log(`Checking path: ${photosDir}`);

if (!fs.existsSync(photosDir)) {
  console.error('Error: photos directory does not exist!');
  process.exit(1);
}

const files = fs.readdirSync(photosDir);
console.log(`Files found in photos folder:`, files);

const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.heic', '.avif'];

const photos = files
  .filter(file => {
    const ext = path.extname(file).toLowerCase();
    const isMatch = validExtensions.includes(ext);
    if (!isMatch) console.log(`Skipping non-image file: ${file}`);
    return isMatch;
  })
  .map(file => {
    const filePath = path.join(photosDir, file);
    const stats = fs.statSync(filePath);
    return {
      filename: file,
      src: `photos/${encodeURIComponent(file)}`,
      date: stats.birthtimeMs || stats.mtimeMs
    };
  })
  .sort((a, b) => b.date - a.date);

console.log(`Writing ${photos.length} photos to ${outputFile}`);
fs.writeFileSync(outputFile, JSON.stringify(photos, null, 2));

// Verify the file was physically written
if (fs.existsSync(outputFile)) {
  console.log('SUCCESS: gallery-data.json successfully created!');
} else {
  console.error('ERROR: Failed to write gallery-data.json to disk.');
  process.exit(1);
}
