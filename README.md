# CivicForge 🏛️

CivicForge is a unified, collaborative platform designed to bridge the gap between citizens, government bodies, universities, and industries. It empowers citizens to report civic challenges and enables cross-sector collaboration to develop, fund, and implement solutions.

![CivicForge Concept](https://img.shields.io/badge/Status-Active_Development-success) ![License](https://img.shields.io/badge/License-MIT-blue)

## 🌟 Key Features

* **Citizen Portal:** Submit, track, and upload evidence for civic challenges (potholes, infrastructure, policy issues).
* **AI-Powered Insights:** Automatically categorizes, prioritizes, and estimates the impact of incoming challenges using AI microservices.
* **Government Dashboard:** Advanced triage boards, real-time analytics, bulk operations, and organization routing.
* **Partner Ecosystem:** Universities and Industry organizations can browse verified civic challenges, express interest, and form project teams to solve them.
* **Real-time Metrics:** Live homepage tracking of total platform impact and submission volumes.

## 🏗️ Architecture & Tech Stack

CivicForge is a modern microservices-oriented application built with:

### Frontend
* **Framework:** Next.js 14 (App Router) & React
* **Styling:** Tailwind CSS + Shadcn UI
* **State Management:** React Query (TanStack)
* **Theming:** Full Light/Dark mode support

### Backend
* **Core:** Java 21 + Spring Boot 3
* **Security:** Spring Security with JWT Authentication
* **Data Access:** Spring Data JPA / Hibernate
* **Caching:** Redis (Spring Cache)
* **Async Processing:** Spring `@Async` for bulk operations and audit logging

### AI Microservice
* **Core:** Python 3 + FastAPI
* **Role:** Analyzes incoming challenges for smart-routing and prioritization.

### Infrastructure
* **Databases:** PostgreSQL (Relational Data), Redis (Caching & Sessions)
* **Orchestration:** Docker & Docker Compose

---

## 🚀 Getting Started (Local Development)

The easiest way to run CivicForge locally is using Docker. Our `docker-compose.prod.yml` orchestrates the entire stack (Frontend, Backend, Postgres, Redis, and AI Service).

### Prerequisites
* [Docker](https://www.docker.com/products/docker-desktop/) & Docker Compose installed
* Git

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/civicforge.git
   cd civicforge
   ```

2. **Boot the entire stack:**
   ```bash
   cd infrastructure
   docker compose -f docker-compose.prod.yml up -d --build
   ```

3. **Access the application:**
   * **Frontend Application:** [http://localhost:3000](http://localhost:3000)
   * **Backend API & Swagger Docs:** `http://localhost:8080/swagger-ui.html`

4. **Tear down:**
   ```bash
   docker compose -f docker-compose.prod.yml down -v
   ```

---

## 📁 Repository Structure

```
civicforge/
├── frontend/             # Next.js web application
├── backend/              # Spring Boot REST API
├── ai-service/           # Python FastAPI AI worker
├── infrastructure/       # Docker Compose and deployment configs
└── README.md
```

## 🔐 Default Roles & Authentication

The platform supports multiple distinct user types:
* `CITIZEN` - Standard users who report problems.
* `GOVERNMENT_MANAGER` - System admins who review, classify, and route problems.
* `UNIVERSITY_ADMIN` / `INDUSTRY_ADMIN` - Institutional partners looking for projects to adopt.

## 🤝 Contributing
Contributions are welcome! Please ensure that you run local tests and adhere to the established check-style formatting for both Java and TypeScript before submitting a pull request.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Team Codex

This project was built with ❤️ by **Team Codex**.

* **Lead Backend Developer:** Baba Ganesh Upputella
* **Backend Architect:** Rajesh Gorsa
* **Frontend Architects:** Nalukurthi Chandu, Goli Balaram
* **Research & Documentation Team:** Shaik Fathima Zoya, R. Mallika

### 🛠️ Tools & Technologies Credits
* **Google Antigravity** *(Coding)*
* **ChatGPT** *(Research & Orchestration)*
* TypeScript, Java 21, Python, Docker, Shell, JavaScript, PostgreSQL, Redis Cache, MinIO