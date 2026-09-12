const fs = require('fs');
const path = require('path');

const photosDir = path.join(process.cwd(), 'photos');
const outputFile = path.join(process.cwd(), 'gallery-data.json');

if (!fs.existsSync(photosDir)) {
  console.error('Error: photos directory does not exist!');
  process.exit(1);
}

const files = fs.readdirSync(photosDir);
const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.heic', '.avif'];

const photos = files
  .filter(file => validExtensions.includes(path.extname(file).toLowerCase()))
  .map(file => {
    const filePath = path.join(photosDir, file);
    const stats = fs.statSync(filePath);
    return {
      filename: file,
      src: `./photos/${file}`, // Explicit relative path
      date: stats.birthtimeMs || stats.mtimeMs
    };
  })
  .sort((a, b) => b.date - a.date);

fs.writeFileSync(outputFile, JSON.stringify(photos, null, 2));
console.log(`Successfully indexed ${photos.length} photos.`);
