const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// SQLite DB setup
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

db.run(`CREATE TABLE IF NOT EXISTS residents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  flat TEXT NOT NULL,
  phone TEXT,
  email TEXT
)`);

// POST endpoint to add a resident
app.post('/api/residents', (req, res) => {
  const { name, flat, phone, email } = req.body;
  if (!name || !flat) {
    return res.status(400).json({ error: 'Name and flat are required.' });
  }
  const stmt = db.prepare('INSERT INTO residents (name, flat, phone, email) VALUES (?, ?, ?, ?)');
  stmt.run(name, flat, phone || '', email || '', function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to add resident.' });
    }
    res.status(201).json({ id: this.lastID, name, flat, phone, email });
  });
  stmt.finalize();
});

// GET endpoint to fetch all residents
app.get('/api/residents', (req, res) => {
  db.all('SELECT * FROM residents', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch residents.' });
    }
    res.json(rows);
  });
});

// DELETE endpoint to remove a resident by id
app.delete('/api/residents/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM residents WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete resident.' });
    }
    res.json({ success: true });
  });
});

// Create events table if not exists
// id, name, date, location, description

db.run(`CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT,
  description TEXT
)`);

// POST endpoint to add an event
app.post('/api/events', (req, res) => {
  const { name, date, location, description } = req.body;
  if (!name || !date) {
    return res.status(400).json({ error: 'Name and date are required.' });
  }
  const stmt = db.prepare('INSERT INTO events (name, date, location, description) VALUES (?, ?, ?, ?)');
  stmt.run(name, date, location || '', description || '', function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to add event.' });
    }
    res.status(201).json({ id: this.lastID, name, date, location, description });
  });
  stmt.finalize();
});

// GET endpoint to fetch all events
app.get('/api/events', (req, res) => {
  db.all('SELECT * FROM events', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch events.' });
    }
    res.json(rows);
  });
});

// DELETE endpoint to remove an event by id
app.delete('/api/events/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM events WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete event.' });
    }
    res.json({ success: true });
  });
});

// Create bills table if not exists
// id, resident, amount, dueDate, status

db.run(`CREATE TABLE IF NOT EXISTS bills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  resident TEXT NOT NULL,
  amount REAL NOT NULL,
  dueDate TEXT NOT NULL,
  status TEXT NOT NULL
)`);

// POST endpoint to add a bill
app.post('/api/bills', (req, res) => {
  const { resident, amount, dueDate, status } = req.body;
  if (!resident || !amount || !dueDate || !status) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const stmt = db.prepare('INSERT INTO bills (resident, amount, dueDate, status) VALUES (?, ?, ?, ?)');
  stmt.run(resident, amount, dueDate, status, function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to add bill.' });
    }
    res.status(201).json({ id: this.lastID, resident, amount, dueDate, status });
  });
  stmt.finalize();
});

// GET endpoint to fetch all bills
app.get('/api/bills', (req, res) => {
  db.all('SELECT * FROM bills', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch bills.' });
    }
    res.json(rows);
  });
});

// DELETE endpoint to remove a bill by id
app.delete('/api/bills/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM bills WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete bill.' });
    }
    res.json({ success: true });
  });
});

// Create complaints table if not exists
// id, resident, subject, date, status

db.run(`CREATE TABLE IF NOT EXISTS complaints (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  resident TEXT NOT NULL,
  subject TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL
)`);

// POST endpoint to add a complaint
app.post('/api/complaints', (req, res) => {
  const { resident, subject, date, status } = req.body;
  if (!resident || !subject || !date || !status) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const stmt = db.prepare('INSERT INTO complaints (resident, subject, date, status) VALUES (?, ?, ?, ?)');
  stmt.run(resident, subject, date, status, function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to add complaint.' });
    }
    res.status(201).json({ id: this.lastID, resident, subject, date, status });
  });
  stmt.finalize();
});

// GET endpoint to fetch all complaints
app.get('/api/complaints', (req, res) => {
  db.all('SELECT * FROM complaints', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch complaints.' });
    }
    res.json(rows);
  });
});

// DELETE endpoint to remove a complaint by id
app.delete('/api/complaints/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM complaints WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete complaint.' });
    }
    res.json({ success: true });
  });
});

// Create maintenance table if not exists
// id, title, description, date, status

db.run(`CREATE TABLE IF NOT EXISTS maintenance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL
)`);

// POST endpoint to add a maintenance task
app.post('/api/maintenance', (req, res) => {
  const { title, description, date, status } = req.body;
  if (!title || !description || !date || !status) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const stmt = db.prepare('INSERT INTO maintenance (title, description, date, status) VALUES (?, ?, ?, ?)');
  stmt.run(title, description, date, status, function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to add maintenance task.' });
    }
    res.status(201).json({ id: this.lastID, title, description, date, status });
  });
  stmt.finalize();
});

// GET endpoint to fetch all maintenance tasks
app.get('/api/maintenance', (req, res) => {
  db.all('SELECT * FROM maintenance', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch maintenance tasks.' });
    }
    res.json(rows);
  });
});

// DELETE endpoint to remove a maintenance task by id
app.delete('/api/maintenance/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM maintenance WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ success: false, error: 'Failed to delete maintenance task.' });
    }
    res.json({ success: true });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
}); 