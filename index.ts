// Imports
import express from 'express';
import dotenv from 'dotenv';

// Const
const cors = require('cors');
const app = express();
const port = process.env.PORT;

// Config
app.use(cors());
dotenv.config();
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Bonjour!');
});

app.listen(port, () => {
  console.log(`Le serveur écoute sur le port ${port}`);
});
