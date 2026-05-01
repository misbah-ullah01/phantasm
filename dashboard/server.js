const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const BLUE_URL = process.env.BLUE_URL || 'http://localhost:3001';
const GREEN_URL = process.env.GREEN_URL || 'http://localhost:3002';
const CONTROLLER_URL = process.env.CONTROLLER_URL || 'http://localhost:3003';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// TODO: polling logic and socket handlers — WIP
server.listen(3000, () => {
  console.log('[DASHBOARD] Running on port 3000');
});
