const express = require('express');
const cors = require('cors');
const app = express();
const _PORT = 3001;

app.use(cors());
app.use(express.json());

// CONNECT TO DB
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/crud_db", { useNewUrlParser: true, useUnifiedTopology: true });

/* MODELS */
// IMPORT USER MODEL
const UserModel = require('./models/Users');

// GET Users
app.get("/users", async (req, res) => {
    const users = await UserModel.find();
    res.json(users);
});

// POST User
app.post("/createUser", async (req, res) => {
    const newUser = new UserModel(req.body);
    await newUser.save();
    res.json(req.body);
});

// PUT User (update user by ID)
app.put("/users/:_id", async (req, res) => {
    const { id } = req.params;
    const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedUser);
});

// DELETE User (delete user by ID)
app.delete("/users/:_id", async (req, res) => {
    const { id } = req.params;
    await UserModel.findByIdAndDelete(id);
    res.json({ message: 'User deleted' });
});

app.listen(_PORT, () => {
    console.log("listening on port", _PORT);
});
