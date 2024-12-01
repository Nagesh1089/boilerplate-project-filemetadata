var express = require('express');
var cors = require('cors');
var multer = require('multer');
require('dotenv').config();

var app = express();

// Enable CORS
app.use(cors());

// Static file serving
app.use('/public', express.static(process.cwd() + '/public'));

// Set up multer storage and limits
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');  // Save uploaded files to the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Rename the file with a timestamp
  }
});

var upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }  // Limit file size to 1MB
});

// Handle file upload (POST request)
app.post('/upload', upload.single('upfile'), function (req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Respond with file details
  res.json({
    fileName: req.file.filename,
    fileType: req.file.mimetype,
    fileSize: req.file.size
  });
});

// Route to serve the main page
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port);
});
