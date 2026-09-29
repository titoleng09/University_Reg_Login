const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

const PersonModel = require('./person_schema.js');
const dbconnect = require('./dbconnect.js');

// LOGIN API
app.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const person = await PersonModel.findOne({
      emailid: email,
      pass: password,
      role
    });

    if (!person) {
      return res.status(400).send('Invalid user');
    }

    const token = jwt.sign({ email, role }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).send('Server error');
  }
});

app.listen(5002, () => {
  console.log('Authentication Service Server is running on PORT NO: 5002');
});