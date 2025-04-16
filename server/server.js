const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const Task = require('../models/Task');

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

app.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    io.emit('taskCreated', task); // Broadcast to all clients
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.send(tasks);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('TaskFlowAI Server Running!');
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});