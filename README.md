# PHANTASM
![CI/CD](https://github.com/misbah-ullah01/phantasm/actions/workflows/deploy.yml/badge.svg)

[![CI/CD](https://github.com/misbah-ullah01/phantasm/actions/workflows/deploy.yml/badge.svg)](https://github.com/misbah-ullah01/phantasm/actions/workflows/deploy.yml)

> Deploy without a trace

Blue Green zero-downtime deployment visualizer. Two app versions run simultaneously on AWS EC2. A real-time WebSocket Dashboard lets you shift live traffic between them.

Push Code → GitHub Actions builds and deploys → zero downtime.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Design](#architecture--design)
3. [Team Structure & Responsibilities](#team-structure--responsibilities)
4. [Technology Stack](#technology-stack)

---

## Project Overview

### What is PHANTASM?

PHANTASM is a semester-long DevOps project for SE202L (Development Operations Lab) that demonstrates **blue-green deployment** - a strategy for achieving zero-downtime application updates.

### Key Features

- **Two Simultaneous Versions**: Blue (v1.0) and Green (v2.0) run at the same time.
- **Live Traffic Control**: WebSocket dashboard lets you shift traffic between versions in real-time
- **Zero Downtime**: Users never experience downtime during deployments
- **Instant Rollback**: Switch back to the previous version in seconds
- **Automated CI/CD**: GitHub Actions automatically build adn deploys on every push
- **Cloud Infrastructure**: Deployed on AWS EC2 with Terraform automation
- **Real-Time Monitoring**: Dashboard shows health status, request counts and system uptime

### Project Goal

Build a complete system that:

1. Hosts two app versions simultaneously using Docker Compose
2. Routes traffic between them via Nginx weighted upstream
3. Displays the deployment process on a real-time WebSocket dashboard
4. Automatically builds and deploys via GitHub Actions CI/CD pipeline
5. Demonstrates professional DevOps practices: IaC, containerization, orchestration, and automation

---

## Architecture & Design

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

## Team Structure & Responsibilities

| Member             | Role                              | Primary Responsibilities                                             | Files Owned                                                      |
| ------------------ | --------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Misbah Ullah**   | Project Lead & Backend Engineer   | Repository setup, app development, code review, issue management     | `app/v1/`, `app/v2/`, `controller/`, `README.md`, `.env.example` |
| **Huzaifa Saleh**  | DevOps Engineer & CI/CD Architect | CI/CD pipeline, Docker Hub setup, GitHub Secrets configuration       | `.github/workflows/deploy.yml`, Docker Hub configuration         |
| **Abdul Rauf**     | Infrastructure & Cloud Engineer   | Infrastructure-as-Code, Docker Compose, Nginx configuration, AWS EC2 | `docker-compose.yml`, `nginx/nginx.conf`, `terraform/`           |
| **Syed Ahsan Ali** | Frontend Engineer & QA Lead       | Dashboard development, testing, quality assurance, project report    | `dashboard/`, testing documentation, project report              |

---

## Technology Stack

### Application Layer

| Component       | Technology         | Version   | Purpose                         |
| --------------- | ------------------ | --------- | ------------------------------- |
| Blue App        | Node.js + Express  | 18-alpine | Production version v1.0         |
| Green App       | Node.js + Express  | 18-alpine | New version v2.0 with search    |
| Language        | JavaScript (plain) | ES5/ES6   | No TypeScript, no transpilation |
| Package Manager | npm                | 9+        | Dependency management           |

### Infrastructure Layer

| Component     | Technology     | Version          | Purpose                               |
| ------------- | -------------- | ---------------- | ------------------------------------- |
| Reverse Proxy | Nginx          | 1.25-alpine      | Route traffic, weighted upstream      |
| Orchestration | Docker Compose | 3.8              | Local and cloud container management  |
| Registry      | Docker Hub     | -                | Store and distribute images           |
| Cloud         | AWS EC2        | Ubuntu 22.04 LTS | Run containers in production          |
| IaC           | Terraform      | 5.0+             | Optional: provision EC2 automatically |

### CI/CD Layer

| Component | Technology     | Version | Purpose                    |
| --------- | -------------- | ------- | -------------------------- |
| VCS       | GitHub         | -       | Repository hosting         |
| Pipeline  | GitHub Actions | -       | Automated build and deploy |
| Build     | Docker Build   | -       | Create container images    |

### Dashboard Layer

| Component | Technology          | Version   | Purpose                               |
| --------- | ------------------- | --------- | ------------------------------------- |
| Backend   | Node.js + Express   | 18-alpine | WebSocket server                      |
| WebSocket | Socket.io           | 4.x       | Real-time bidirectional communication |
| Frontend  | Vanilla HTML/CSS/JS | -         | No framework (lightweight)            |

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
