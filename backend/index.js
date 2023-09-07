const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes.js");
const requireToken = require("./Middlewares/AuthTokenRequired.js");
const Parking = require('./models/Parking.js')
require("./db.js");

//Write file module
const fs = require('fs-extra');

// Optional: If you want to use the mongoose package with `require`
const mongoose = require("mongoose");
const User = require("./models/User.js");

// Optional: If you want to use the dotenv package with `require`
require("dotenv").config();

const port = 3000;
const app = express();

app.use(bodyParser.json());
app.use(authRoutes);

app.get('/', requireToken, (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/profile', requireToken, (req, res) => {
  console.log(req.user.idUser);
  res.send(req.user);
});

app.get('/parking', async (req, res) => {
  try {
    const parkingList = await Parking.find(); // Retrieve all users
    await fs.writeJSON('data.json', parkingList);
    res.json(parkingList);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving users' });
  }
});

app.patch('/update/:id',  async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOneAndUpdate({_id: userId}, req.body, {new: true});
    console.log(user)
    res.json({user});
  } catch (error) {
    res.status(500).json({ error: 'Error updating user info' });
  }
});