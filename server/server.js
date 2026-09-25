const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
const port = 3000;
/* @author 🆉. Sūn 2026 */
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client')));

let destinations = [];
let lists = {};

// Read CSV file
const csvPath = path.join(__dirname, 'data', 'europe-destinations.csv');
fs.createReadStream(csvPath)
  .pipe(csv({ mapHeaders: ({ header }) => header.trim().replace(/^\uFEFF/, '') }))
  .on('data', (row) => {
    if (destinations.length === 0) {
      console.log('First row of CSV:', row); // Log the first row
    }
    destinations.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed!');
  });

// Helper function to sanitize input
function sanitizeInput(input) {
  return input.replace(/[&<>"']/g, (match) => {
    const escape = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return escape[match];
  });
}

// Get all information for a given destination ID
app.get('/api/destination/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (id >= 0 && id < destinations.length) {
    res.json(destinations[id]);
  } else {
    res.status(404).json({ error: 'Destination not found...' });
  }
});
// @author github.com/2h-5
// Get geographical coordinates for a given destination ID
app.get('/api/coordinates/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (id >= 0 && id < destinations.length) {
    const { Latitude, Longitude } = destinations[id];
    res.json({ Latitude, Longitude });
  } else {
    res.status(404).json({ error: 'Destination not found...' });
  }
});

// Get all available country names
app.get('/api/countries', (req, res) => {
  const countries = [...new Set(destinations.map(dest => dest.Country))];
  res.json(countries);
});

// Search destinations (order-sensitive)
app.get('/api/search', (req, res) => {
  const { field, pattern, n } = req.query;
  const sanitizedPattern = sanitizeInput(pattern);
  const limit = n ? parseInt(n) : destinations.length;

  const matches = destinations
    .map((dest, index) => ({ ...dest, id: index }))
    .filter(dest => dest[field] && dest[field].toLowerCase().startsWith(sanitizedPattern.toLowerCase()))
    .slice(0, limit);
    /* @author 🆉. Sun */
  if (matches.length > 0) {
    res.json(matches);
  } else {
    res.status(404).json({ error: 'No matches found!' });
  }
});

// Create a new list
app.post('/api/lists', (req, res) => {
  const { name } = req.body;
  const sanitizedName = sanitizeInput(name);

  if (lists[sanitizedName]) {
    res.status(400).json({ error: 'List already exists!' });
  } else {
    lists[sanitizedName] = [];
    res.json({ message: 'List created successfully!' });
  }
});
// @author 🆉. Sūn
// Save destinations to a list
app.put('/api/lists/:name', (req, res) => {
  const { name } = req.params;
  const { destinations } = req.body;
  const sanitizedName = sanitizeInput(name);

  if (lists[sanitizedName]) {
    lists[sanitizedName] = destinations;
    res.json({ message: 'List updated successfully!' });
  } else {
    res.status(404).json({ error: 'List not found...' });
  }
});

// Get destinations in a list
app.get('/api/lists/:name', (req, res) => {
  const { name } = req.params;
  const sanitizedName = sanitizeInput(name);
  // Z. 2026
  if (lists[sanitizedName]) {
    res.json(lists[sanitizedName]);
  } else {
    res.status(404).json({ error: 'List not found...' });
  }
});

// Delete a list
app.delete('/api/lists/:name', (req, res) => {
  const { name } = req.params;
  const sanitizedName = sanitizeInput(name);

  if (lists[sanitizedName]) {
    delete lists[sanitizedName];
    res.json({ message: 'List deleted successfully!' });
  } else {
    res.status(404).json({ error: 'List not found...' });
  }
});

// Get detailed information for destinations in a list
app.get('/api/lists/:name/details', (req, res) => {
  const { name } = req.params;
  const sanitizedName = sanitizeInput(name);
  // @author 🆉. Sūn
  if (lists[sanitizedName]) {
    const details = lists[sanitizedName].map(id => {
      const dest = destinations[id];
      return {
        destination: dest.Destination,
        region: dest.Region,
        country: dest.Country,
        coordinates: { lat: dest.Latitude, lng: dest.Longitude },
        currency: dest.Currency,
        language: dest.Language
      };
    });
    res.json(details);
  } else {
    res.status(404).json({ error: 'List not found...' });
  }
});

// Get all lists
app.get('/api/lists', (req, res) => {
  res.json(Object.keys(lists));
});
// github.com/2h-5
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});