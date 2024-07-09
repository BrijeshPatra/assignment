const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const app = express();

// Firebase Admin initialization
const serviceAccount = require('./intership-assignment-41f53-firebase-adminsdk-tzxz2-5d9274cde8.json'); 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// POST route to handle form submission
app.post('/submit', (req, res) => {
  const data = req.body;

  // Validation: Check if all fields are filled
  if (!data.name || !data.email || !data.message) {
    return res.status(400).send("Please fill out all fields");
  }

  // Access Firestore database
  const db = admin.firestore();
  const collectionReference = db.collection('formEntries');

  // Add data to Firestore
  collectionReference.add(data)
    .then(() => {
      res.send('Form data added to the Firestore database');
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
      res.status(500).send('Error adding document to Firestore');
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app; // Exporting the app for testing purposes
