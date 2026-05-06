# PHANTASM — Testing Checklist

**Tester:** Syed Ahsan Ali  
**Date:** May 2026

| ID | Test | How to Test | Expected | Result |
|---|---|---|---|---|
| T01 | Blue app serves on port 80 | `curl http://YOUR_IP` | Response contains `BLUE — v1.0` | Pass |
| T02 | Green app accessible directly | `curl http://YOUR_IP:3002/health` | `{"status":"healthy"}` | Pass |
| T03 | Traffic split API accepts POST | `curl -X POST http://YOUR_IP:3003/split -H 'Content-Type: application/json' -d '{"blue":50,"green":50}'` | `{"success":true}` | Pass |
| T04 | Nginx routes 50/50 | Send 20 requests to port 80, count per version | ~10 blue, ~10 green | Pass |
| T05 | Dashboard WebSocket live | Kill a container, watch dashboard | Dot turns red within 15s | Pass |
| T06 | Full rollback | Shift to 100% green then back to 100% blue | Blue app serves immediately | Pass |
| T07 | CI/CD triggers on push | Push any commit to main | GitHub Actions starts within 60s | Pass |
| T08 | Pipeline builds image | Check Docker Hub after pipeline | Updated Last pushed timestamp | Pass |
| T09 | Pipeline deploys to EC2 | Check `docker ps` after pipeline | Container shows recent uptime | Pass |
| T10 | Container auto-restart | `docker stop blue-app` | Container restarts within 10s | Pass |
