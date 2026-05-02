const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const BLUE_URL = process.env.BLUE_URL || 'http://localhost:3001';
const GREEN_URL = process.env.GREEN_URL || 'http://localhost:3002';
const CONTROLLER_URL = process.env.CONTROLLER_URL || 'http://localhost:3003';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let systemState = {
  blue: { status: 'unknown', requests: 0, version: 'unknown', uptime: 0 },
  green: { status: 'unknown', requests: 0, version: 'unknown', uptime: 0 },
  split: { blue: 100, green: 0 },
  lastUpdate: new Date().toISOString()
};

async function fetchWithTimeout(url, timeoutMs = 3000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

async function pollSystemState() {
  const [blueResult, greenResult, splitResult] = await Promise.allSettled([
    fetchWithTimeout(`${BLUE_URL}/metrics`).then(r => r.json()),
    fetchWithTimeout(`${GREEN_URL}/metrics`).then(r => r.json()),
    fetchWithTimeout(`${CONTROLLER_URL}/split`).then(r => r.json())
  ]);

  systemState.blue = blueResult.status === 'fulfilled'
    ? { status: 'healthy', ...blueResult.value }
    : { status: 'unhealthy', requests: 0, version: 'unknown', uptime: 0 };

  systemState.green = greenResult.status === 'fulfilled'
    ? { status: 'healthy', ...greenResult.value }
    : { status: 'unhealthy', requests: 0, version: 'unknown', uptime: 0 };

  if (splitResult.status === 'fulfilled') {
    systemState.split = splitResult.value;
  }

  systemState.lastUpdate = new Date().toISOString();
  io.emit('state', systemState);
}

// Poll every 3 seconds
setInterval(pollSystemState, 3000);
pollSystemState();

io.on('connection', (socket) => {
  console.log('[DASHBOARD] Client connected:', socket.id);

  socket.emit('state', systemState);

  socket.on('setSplit', async ({ blue, green }) => {
    console.log(`[DASHBOARD] Set split request: blue=${blue} green=${green}`);
    try {
      const res = await fetch(`${CONTROLLER_URL}/split`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blue, green })
      });
      const data = await res.json();
      if (data.success) {
        systemState.split = { blue, green };
        io.emit('state', systemState);
        io.emit('log', `Traffic updated: Blue ${blue}% / Green ${green}%`);
      } else {
        socket.emit('log', `Error: ${data.error}`);
      }
    } catch (err) {
      socket.emit('log', `Controller error: ${err.message}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('[DASHBOARD] Client disconnected:', socket.id);
  });
});

app.get('/api/state', (req, res) => res.json(systemState));

server.listen(3000, () => {
  console.log('[DASHBOARD] Running on port 3000');
});const express = require('express');
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
