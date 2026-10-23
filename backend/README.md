# Supportive Cognitive Engagement & Memory Platform — Backend Service

A calm, accessible, and secure Spring Boot REST API for the **Cognitive Gaming & Memory Assistance Platform**. Designed for older adults including people living with dementia, their caregivers, and family members.

It provides structured reminiscence (memories, stories, photos, audio lullabies), calm cognitive activities (Dual N-Back, Stroop inhibition, facial association, reaction speed, memory match, virtual garden), routine reminders, qualitative observations, caregiver-approved consent records, and explainable rule-based difficulty adjustments.

---

## 🛠 Tech Stack & Prerequisites

| Component | Minimum Version | Verified In Environment |
| :--- | :--- | :--- |
| **Java (JDK)** | 17+ (LTS) | Java 25 / Java 17 LTS |
| **Spring Boot** | 3.4.1 | Spring Boot 3.4.1 |
| **Build Tool** | Apache Maven 3.9+ | `./mvnw` (Maven Wrapper included) |
| **Database** | MySQL 8.0+ / 9.0+ | MySQL 9.6 Community Server |
| **Documentation** | OpenAPI 3 / Swagger UI | Springdoc OpenAPI 2.8.3 |
| **Security** | Spring Security + JWT | JJWT 0.12.6, BCrypt |
| **MIME Validation** | Apache Tika | Tika Core 2.9.2 |

---

## 🚀 Quickstart & Local Setup

### 1. Database Setup

Ensure MySQL is running on port 3306 and create the database:
```sql
CREATE DATABASE IF NOT EXISTS cognitive_platform;
```

*(Alternatively, run `docker compose up -d` using the included [docker-compose.yml](file:///Users/rohanughade/Desktop/Ideathon%20Project/backend/docker-compose.yml)).*

### 2. Environment Variables

Copy the example environment configuration:
```bash
cp .env.example .env
```

Default connection parameters (or customize in `.env`):
- `DB_HOST=localhost`
- `DB_PORT=3306`
- `DB_NAME=cognitive_platform`
- `DB_USER=root`
- `DB_PASSWORD=`
- `PORT=8080`
- `JWT_SECRET=c3VwZXJzZWNyZXRqd3RrZXlmaXJzdGNvZ25pdGl2ZXBsYXRmb3JtMjAyNmZvcm1lbW9yeQ==`
- `CORS_ORIGINS=http://localhost:5173,http://localhost:3000`

### 3. Run Flyway Migrations & Start Application

Using the included Maven wrapper:
```bash
cd backend
./mvnw spring-boot:run
```

Flyway will automatically execute:
- `V1__init_schema.sql`: Creates all 12 tables, foreign keys with `ON DELETE CASCADE`, and indexes.
- `V2__seed_demo_data.sql`: Seeds demo caregiver, player profile, games catalog, sample memories, and session engagement records.

Tomcat will start on `http://localhost:8080`.

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Primary Caregiver** | `caregiver@example.com` | `Caregiver123!` |
| **Player Profile (Managed)** | Margaret (ID: `1`) | *No password required; accessed through caregiver token* |

---

## 📖 Interactive API Documentation (Swagger UI)

With the backend running, visit:
- **Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI 3 JSON:** [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

---

## 🧪 Running Automated Tests

Run the full test suite (Unit tests + MockMvc Integration tests + H2 in-memory DB):
```bash
cd backend
./mvnw test
```

### Test Coverage Highlights
- **`CrossCaregiverAuthorizationIntegrationTest`:** Rigorously verifies that Caregiver B cannot access Caregiver A's player profile, memories, media, garden, reminders, observations, sessions, or dashboard summary (returns `403 Forbidden`).
- **`AdaptiveDifficultyServiceTest`:** Verifies rule-based, explainable difficulty adjustments (respects `MANUAL` mode, gathers initial baselines, suggests gentle steps up or down, and uses supportive non-clinical language).
- **`FileStorageServiceTest`:** Verifies MIME type detection via Apache Tika magic bytes, size limits (5MB image / 10MB audio), and rejection of invalid executables.
- **`AuthControllerIntegrationTest`:** Tests registration, JWT token generation, duplicate email rejection (409), and login authentication.

---

## 🌐 Running the React Frontend against this Backend

1. Navigate to the frontend directory:
   ```bash
   cd capstone
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173`.
   - The frontend's [`src/services/api.ts`](file:///Users/rohanughade/Desktop/Ideathon%20Project/capstone/src/services/api.ts) connects directly to `http://localhost:8080/api`.
   - All drill session results, tactical radar countermeasures, user settings, and telemetry are synchronized with MySQL.

---

## 📋 REST API Summary

All endpoints are rooted under `/api` and return standard JSON.

### Authentication & Profiles
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new caregiver account |
| `POST` | `/api/auth/login` | Public | Login and receive JWT access token |
| `GET` | `/api/profiles` | Caregiver | List player profiles managed by caregiver |
| `POST` | `/api/profiles` | Caregiver | Create new player profile |
| `GET` | `/api/profiles/{id}` | Owner | Get profile details and accessibility settings |
| `PUT` | `/api/profiles/{id}` | Owner | Update profile preferred name, language, text size |
| `DELETE` | `/api/profiles/{id}` | Owner | Cascade delete profile, memories, files, and sessions |

### Memories & Media
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/profiles/{id}/memories` | Owner | List memory items (photos, stories, places, audio) |
| `POST` | `/api/profiles/{id}/memories` | Owner | Upload memory with optional photo/audio file (multipart) |
| `PUT` | `/api/memories/{id}` | Owner | Update memory title, description, or transcript |
| `DELETE` | `/api/memories/{id}` | Owner | Delete memory item and remove media file from disk |
| `PUT` | `/api/profiles/{id}/memories/reorder` | Owner | Update display sort order |
| `GET` | `/api/media/{memoryId}` | Owner | Authorized streaming of private photos / audio |

### Games, Sessions & Adaptive Difficulty
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/games` | Public | Get games catalog |
| `POST` | `/api/games/sessions` | Public / Caregiver | Log engagement activity session |
| `PATCH` | `/api/games/sessions/{id}` | Public / Caregiver | Mark session completed (idempotent) |
| `GET` | `/api/profiles/{id}/sessions` | Owner | Filtered session history (gameKey, dates, paging) |
| `GET` | `/api/profiles/{id}/difficulty-suggestion` | Owner | Rule-based, explainable difficulty suggestion |
| `GET` | `/api/profiles/{id}/summary` | Owner | Activity history summary and completion counts |

### Virtual Garden, Reminders, Observations & Consent
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/profiles/{id}/garden` | Owner | Get calm virtual garden layout |
| `PUT` | `/api/profiles/{id}/garden` | Owner | Update plants and garden items |
| `GET` | `/api/profiles/{id}/reminders` | Owner | List scheduled reminders |
| `POST` | `/api/profiles/{id}/reminders` | Owner | Schedule new daily routine reminder |
| `PUT` | `/api/reminders/{id}` | Owner | Update or mark reminder completed |
| `DELETE` | `/api/reminders/{id}` | Owner | Delete reminder |
| `GET` | `/api/profiles/{id}/observations` | Owner | List qualitative mood / support observations |
| `POST` | `/api/profiles/{id}/observations` | Owner | Add non-clinical observation note |
| `GET` | `/api/profiles/{id}/consents` | Owner | View caregiver-recorded consent records |
| `POST` | `/api/profiles/{id}/consents` | Owner | Record consent |

### Frontend Companion Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` / `PUT` | `/api/telemetry` | Public | Read / update focus telemetry buffer |
| `GET` | `/api/pillars` | Public | List 4 cognitive training pillars |
| `GET` | `/api/radar/agents` | Public | Get active tactical radar distraction agents |
| `POST` | `/api/radar/neutralise/{id}` | Public | Deploy shield and counter distraction agent |
| `POST` | `/api/radar/reset` | Public | Reset radar agents |
| `GET` | `/api/simulator/stages` | Public | Get simulator training stages |
| `GET` | `/api/testimonials` | Public | Get cohort testimonials |
| `GET` / `PUT` | `/api/settings` | Public | Read / save accessibility preferences |

---

## 🔒 Production Deployment Recommendations

When deploying this backend to production:
1. **HTTPS / TLS:** Terminate TLS via reverse proxy (Nginx, AWS ALB, Cloudflare) with HTTP/2 enabled.
2. **External Media Storage:** Swap `LocalDiskFileStorageService` with an AWS S3 or Google Cloud Storage implementation implementing the clean `FileStorageService` interface.
3. **Secrets Management:** Inject `JWT_SECRET`, database passwords, and credentials through environment variables or AWS Secrets Manager / HashiCorp Vault.
4. **Distributed Rate Limiting:** Replace the in-memory token-bucket filter with Redis-backed rate limiting (e.g. Bucket4j + Redis) when scaling across multiple container instances.
5. **Database:** Use managed MySQL (AWS RDS or Google Cloud SQL) with automatic backups, connection pooling (HikariCP), and replica reads if needed.
