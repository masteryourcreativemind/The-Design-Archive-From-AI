const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const cheerio = require('cheerio');
const sass = require('sass');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Route to serve the main builder page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API route to save site context (title and description)
app.post('/api/context', (req, res) => {
  const { title, description } = req.body;
  const context = { title, description };
  fs.writeFileSync(path.join(__dirname, 'site-context.json'), JSON.stringify(context, null, 2));
  res.json({ message: 'Context saved successfully' });
});

// API route to upload design blocks (HTML, CSS, SCSS)
app.post('/api/upload-block', upload.single('block'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const ext = path.extname(filePath).toLowerCase();
    let blockContent = '';

    if (ext === '.html') {
      blockContent = fs.readFileSync(filePath, 'utf-8');
    } else if (ext === '.scss') {
      // Compile SCSS to CSS using sass
      const result = sass.compile(filePath);
      blockContent = `<style>\n${result.css}\n</style>`;
    } else if (ext === '.css') {
      const css = fs.readFileSync(filePath, 'utf-8');
      blockContent = `<style>\n${css}\n</style>`;
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Please upload HTML, CSS, or SCSS files.' });
    }

    // Save processed block into public/blocks directory
    const blockName = path.basename(filePath, ext);
    const blocksDir = path.join(__dirname, 'public', 'blocks');
    if (!fs.existsSync(blocksDir)) {
      fs.mkdirSync(blocksDir, { recursive: true });
    }
    const blockFilePath = path.join(blocksDir, `${blockName}.html`);
    fs.writeFileSync(blockFilePath, blockContent);

    res.json({ message: 'Block uploaded and processed', block: `${blockName}.html` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while processing the block.' });
  }
})
// API route to retrieve themes from themes.json
app.get('/api/themes', (req, res) => {
  const themesPath = path.join(__dirname, 'public', 'themes.json');
  try {
    const themesData = fs.readFileSync(themesPath, 'utf-8');
    res.setHeader('Content-Type', 'application/json');
    res.send(themesData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to load themes' });
  }
});

// API route to store SEO score/keywords
app.post('/api/seo-score', (req, res) => {
  const { keywords } = req.body;
  const seoFilePath = path.join(__dirname, 'seo-score.json');
  try {
    let data = [];
    if (fs.existsSync(seoFilePath)) {
      const content = fs.readFileSync(seoFilePath, 'utf-8');
      data = JSON.parse(content || '[]');
    }
    data.push({ timestamp: Date.now(), keywords });
    fs.writeFileSync(seoFilePath, JSON.stringify(data, null, 2));
    res.json({ message: 'SEO keywords saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to save SEO keywords' });
  }
});
;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
