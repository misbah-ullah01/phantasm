# PHANTASM

> Deploy without a trace

Blue Green zero-downtime deployment visualizer. Two app versions run simultaneously on AWS EC2. A real-time WebSocket Dashboard lets you shift live traffic between them.

Push Code → GitHub Actions builds and deploys → zero downtime.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Design](#architecture--design)
3. [Team Structure & Responsibilities](#team-structure--responsibilities)
4. [Technology Stack](#tech-stack)

---

## Project Overview

---

## Team

| Member         | Role                              |
| -------------- | --------------------------------- |
| Misbah Ullah   | Project Lead & Backend Engineer   |
| Huzaifa Saleh  | DevOps Engineer & CI/CD Architect |
| Abdul Rauf     | Infrastructure & Cloud Engineer   |
| Syed Ahsan Ali | Frontend Engineer & QA Lead       |

## Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                               INTERNET                               │
└──────────────────────────────────┬───────────────────────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │    Nginx Reverse Proxy   │
                    │      (port 80)           │
                    │   Weighted Upstream      │
                    └──────────────────────────┘
                         │                 │
                    100% ▼ or varies       ▼ 0% or varies
            ┌──────────────────────┐  ┌──────────────────────┐
            │   Blue App (v1.0)    │  │  Green App (v2.0)    │
            │   port 3001          │  │  port 3002           │
            │   Node.js + Express  │  │  Node.js + Express   │
            └──────────────────────┘  └──────────────────────┘
                    ▲                          ▲
                    │                          │
            ┌───────┴──────────────────────────┴────────┐
            │                                           │
            ▼                                           ▼
    ┌──────────────────┐              ┌──────────────────────┐
    │  /health         │              │  /metrics            │
    │  /metrics        │              │  /health             │
    │  Request Counts  │              │  Request Counts      │
    └──────────────────┘              └──────────────────────┘
            │                                      │
            └──────────────────┬───────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Traffic Controller   │
                    │ API (port 3003)      │
                    │ - GET /split         │
                    │ - POST /split        │
                    │ Rewrites Nginx config│
                    └──────────────────────┘
                               │
                               ▼
                    ┌───────────────────────┐
                    │  Dashboard (port 3000)│
                    │  WebSocket Server     │
                    │  Real-time Monitoring │
                    │  Traffic Slider UI    │
                    │  Event Logging        │
                    └───────────────────────┘
```

---

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+
- AWS account (for cloud deployment)

### Local Run

```bash
git clone https://github.com/misbah-ullah01/phantasm.git
cd phantasm
cd .env.example .env    # fill in your Docker Hub username
docker compose up --build
```

## Open:

- App: http://localhost
- Dashboard: http://localhost:3000
- Controller API: http://localhost:3000/split

### Cloud URL

```
http://YOUR_EC2_ELASTIC_IP
```

---

## Tech Stack

| Layer          | Technology              |
| -------------- | ----------------------- |
| App (x2)       | Node.js + Express       |
| Traffic Router | Nginx weighted upstream |
| Orchestration  | Docker Compose          |
| CI/CD          | GitHub Actions          |
| Registry       | Docker Hub              |
| Cloud          | AWS EC2 (Ubuntu 22.04)  |
| Dashboard      | Node.js + Socket.io     |
| IaC            | Terraform               |
