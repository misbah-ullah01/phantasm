const express = require('express');
const fs = require('fs');
const { execSync } = require('child_process');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

// The shared nginx-conf Docker volume is mounted at /etc/nginx/conf.d/
const NGINX_CONF_PATH = '/etc/nginx/conf.d/default.conf';

let currentSplit = { blue: 100, green: 0 };

function generateNginxConfig(blueWeight, greenWeight) {
  // Nginx weight cannot be 0 — use minimum of 1
  const bw = Math.max(blueWeight, 1);
  const gw = Math.max(greenWeight, 1);
  return `upstream app_backend {
  server blue-app:3001 weight=${bw};
  server green-app:3002 weight=${gw};
}

server {
  listen 80;

  location / {
    proxy_pass http://app_backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_connect_timeout 5s;
    proxy_read_timeout 10s;
  }

  location /health {
    return 200 'nginx ok';
    add_header Content-Type text/plain;
  }

  location /nginx-status {
    stub_status on;
    access_log off;
  }
}
`;
}

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'traffic-controller' });
});

app.get('/split', (req, res) => {
  res.json(currentSplit);
});

app.post('/split', (req, res) => {
  const { blue, green } = req.body;

  if (typeof blue !== 'number' || typeof green !== 'number') {
    return res.status(400).json({ error: 'blue and green must be numbers' });
  }
  if (Math.round(blue + green) !== 100) {
    return res.status(400).json({ error: 'blue + green must equal 100' });
  }
  if (blue < 0 || green < 0) {
    return res.status(400).json({ error: 'values cannot be negative' });
  }

  const config = generateNginxConfig(blue, green);

  try {
    fs.writeFileSync(NGINX_CONF_PATH, config, 'utf8');
    execSync('nginx -s reload', { stdio: 'pipe' });
    currentSplit = { blue, green };
    console.log(`[CONTROLLER] Traffic split updated: blue=${blue}% green=${green}%`);
    res.json({ success: true, split: currentSplit });
  } catch (err) {
    console.error('[CONTROLLER] Nginx reload failed:', err.message);
    res.status(500).json({ error: 'Nginx reload failed', detail: err.message });
  }
});

app.listen(3003, () => {
  console.log('[CONTROLLER] Traffic controller running on port 3003');
});