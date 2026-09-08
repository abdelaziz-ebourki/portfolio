# Portfolio

![Java](https://img.shields.io/badge/Java-25-orange?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.x-6DB33F?logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)

A full-stack portfolio application that showcases selected GitHub projects, kept in sync automatically through GitHub webhooks.

## Overview

Portfolio content is **synced, not curated**. Any GitHub repository becomes portfolio-eligible by containing a `.portfolio.json` file at its root — a manifest describing the project (name, description, stack, features, cover, ...).

- **API** (`api/`) — Spring Boot REST service receiving webhooks and serving project data
- **UI** (`ui/`) — React single-page application rendering the synced portfolio
- **Database** — PostgreSQL storing project records

## How It Works

```mermaid
flowchart LR
    subgraph GitHub
        R[Project repo<br/>.portfolio.json]
    end
    R -- "push to main" --> W[api/ webhook receiver<br/>HMAC signature verification]
    W -- fetch .portfolio.json<br/>+ cover --> G[GitHub REST API]
    W -- upsert --> DB[(PostgreSQL)]
    DB <-- REST --> UI[ui/ React]
```

1. You push to `main` on a project repo containing `.portfolio.json`
2. GitHub fires a `push` webhook at the API
3. The API verifies the request signature (HMAC) and fetches `.portfolio.json` plus preview assets via the GitHub REST API
4. The project record is upserted into PostgreSQL
5. The UI serves the latest data on next load

### Previews

Hybrid approach:

- **Cover** — one screenshot committed to the project repo, referenced by path in `.portfolio.json` (`cover`, nullable); shown as the card hero image, click opens a zoom viewer
- **Live demo** *(optional)* — a `demo_url` opened as an external link, never embedded (most sites block iframing). Demos should be self-sufficient: backends mocked (e.g. MSW in the project's own repo) so links stay alive with no servers to run

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Backend    | Java 25, Spring Boot 4              |
| Frontend   | React 19, TypeScript                |
| Database   | PostgreSQL 16                       |
| Integration| GitHub Webhooks                     |

## Planned Structure

```
portfolio/
├── api/    # Spring Boot backend
├── ui/     # React frontend
```

### Prerequisites

- JDK 25
- Node.js 20+
- Docker & Docker Compose

## Roadmap

- [ ] Define the `.portfolio.json` manifest schema
- [ ] Scaffold `api/` (Spring Boot 4 + PostgreSQL + Flyway)
- [ ] Scaffold `ui/` (Vite + React + TypeScript)
- [ ] Webhook receiver with HMAC signature verification
- [ ] Fetch `.portfolio.json` & cover via GitHub Contents API
- [ ] Project upsert logic
- [ ] Project list/detail UI with previews
- [ ] Docker Compose for local development
- [ ] CI pipeline
