const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Check if Cloudinary is configured
const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                      process.env.CLOUDINARY_API_KEY && 
                      process.env.CLOUDINARY_API_SECRET;

let upload;

if (useCloudinary) {
  // Use Cloudinary for production
  const cloudinary = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'hr-website',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    }
  });

  upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }
  });

  console.log('✅ Using Cloudinary for image storage');
} else {
  // Use local storage for development
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = 'public/uploads';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

  upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    }
  });

  console.log('⚠️  Using local storage (development mode)');
}

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Data files - use persistent volume if available
const DATA_DIR = process.env.DATA_DIR || '.';
const DATA_FILE = path.join(DATA_DIR, 'data.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ posters: [] }));
}

// Initialize settings file if it doesn't exist
if (!fs.existsSync(SETTINGS_FILE)) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify({ 
    language: 'en',
    titleFont: 'Segoe UI',
    descriptionFont: 'Segoe UI'
  }));
}

// Get all posters
app.get('/api/posters', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data.posters);
});

// Upload banner
app.post('/api/upload', (req, res) => {
  upload.single('banner')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err.message);
      return res.status(400).json({ error: err.message });
    }
    
    console.log('Upload request received');
    console.log('File:', req.file);
    
    if (req.file) {
      // For Cloudinary, use the full URL; for local, use filename
      const fileUrl = useCloudinary ? req.file.path : req.file.filename;
      console.log('File uploaded successfully:', fileUrl);
      res.json({ filename: fileUrl });
    } else {
      console.log('No file in request');
      res.status(400).json({ error: 'No file uploaded' });
    }
  });
});

// Add poster
app.post('/api/posters', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const newPoster = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  data.posters.push(newPoster);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json(newPoster);
});

// Update poster
app.put('/api/posters/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const index = data.posters.findIndex(p => p.id == req.params.id);
  if (index !== -1) {
    data.posters[index] = { ...data.posters[index], ...req.body };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json(data.posters[index]);
  } else {
    res.status(404).json({ error: 'Poster not found' });
  }
});

// Delete poster
app.delete('/api/posters/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  data.posters = data.posters.filter(p => p.id != req.params.id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

// Get settings
app.get('/api/settings', (req, res) => {
  const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE));
  res.json(settings);
});

// Update settings
app.put('/api/settings', (req, res) => {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(req.body, null, 2));
  res.json({ success: true });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // Credentials from environment or defaults
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'adminsmey';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '@@@@wrongpassword168';
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

// For Vercel serverless
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // For local development
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
