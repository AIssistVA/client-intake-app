const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const nodemailer = require('nodemailer');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 4000;

// File upload setup
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname);
  },
});
const upload = multer({ storage });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function buildAdminEmail(data, files) {
  return {
    from: process.env.SMTP_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `New Client Intake Submission: ${data.name || ''}`,
    html: `
      <h2>New Client Intake Submission</h2>
      <ul>
        <li><b>Name:</b> ${data.name}</li>
        <li><b>Email:</b> ${data.email}</li>
        <li><b>Phone:</b> ${data.phone}</li>
        <li><b>Company:</b> ${data.company}</li>
        <li><b>Industry:</b> ${data.industry}</li>
        <li><b>Requirements:</b> ${data.requirements}</li>
        <li><b>Timeline:</b> ${data.timeline}</li>
        <li><b>Budget:</b> ${data.budget}</li>
      </ul>
      <b>Files:</b>
      <ul>
        ${files.map(f => `<li><a href="${process.env.BASE_URL || 'http://localhost:4000'}/uploads/${f.filename}">${f.originalname}</a></li>`).join('')}
      </ul>
    `,
  };
}

function buildClientEmail(data) {
  return {
    from: process.env.SMTP_FROM,
    to: data.email,
    subject: 'Thank you for your submission',
    html: `
      <h2>Thank you, ${data.name || 'Client'}!</h2>
      <p>We have received your intake form and will contact you soon.</p>
      <p><b>Summary:</b></p>
      <ul>
        <li><b>Name:</b> ${data.name}</li>
        <li><b>Email:</b> ${data.email}</li>
        <li><b>Phone:</b> ${data.phone}</li>
        <li><b>Company:</b> ${data.company}</li>
        <li><b>Industry:</b> ${data.industry}</li>
        <li><b>Requirements:</b> ${data.requirements}</li>
        <li><b>Timeline:</b> ${data.timeline}</li>
        <li><b>Budget:</b> ${data.budget}</li>
      </ul>
      <p>If you have any questions, reply to this email.</p>
    `,
  };
}

// SQLite setup
const dbPath = path.join(__dirname, 'intake.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT,
    company TEXT,
    industry TEXT,
    requirements TEXT,
    timeline TEXT,
    budget TEXT,
    files TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

app.post('/submit', upload.array('files'), async (req, res) => {
  const data = req.body;
  const files = req.files || [];
  try {
    await transporter.sendMail(buildAdminEmail(data, files));
    // Save to DB
    db.run(
      `INSERT INTO submissions (name, email, phone, company, industry, requirements, timeline, budget, files) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.email,
        data.phone,
        data.company,
        data.industry,
        data.requirements,
        data.timeline,
        data.budget,
        JSON.stringify(files.map(f => ({
          filename: f.filename,
          originalname: f.originalname,
          url: `${process.env.BASE_URL || 'http://localhost:4000'}/uploads/${f.filename}`
        })))
      ],
      async function (err) {
        if (err) {
          console.error('DB error:', err);
          return res.status(500).json({ success: false, error: 'Database error' });
        }
        // Send client confirmation email
        try {
          await transporter.sendMail(buildClientEmail(data));
        } catch (e) {
          console.error('Client email send error:', e);
        }
        res.json({ success: true, data, files });
      }
    );
  } catch (e) {
    console.error('Admin email send error:', e);
    res.status(500).json({ success: false, error: 'Email error' });
  }
});

// Admin login endpoint
app.post('/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});
// Auth middleware
function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.split(' ')[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
// Get all submissions
app.get('/admin/submissions', requireAdmin, (req, res) => {
  db.all('SELECT * FROM submissions ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

// Serve React build as static files
const clientPath = process.env.CLIENT_BUILD_PATH || path.join(__dirname, '../client-build');
app.use(express.static(clientPath));

// Serve index.html for any non-API routes
app.get('/', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});