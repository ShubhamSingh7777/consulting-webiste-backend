# Sharma & Associates — Admin Panel
## NestJS + PostgreSQL Backend

---

## Project Structure

```
sharma-admin/
├── src/
│   ├── auth/
│   │   ├── entities/admin-account.entity.ts   # Admin user DB table
│   │   ├── dto/auth.dto.ts                     # Login, update, change-password DTOs
│   │   ├── guards/jwt-auth.guard.ts            # JWT guard for protected routes
│   │   ├── strategies/jwt.strategy.ts          # Passport JWT strategy
│   │   ├── auth.service.ts                     # Business logic (login, seed, account mgmt)
│   │   ├── auth.controller.ts                  # REST endpoints
│   │   └── auth.module.ts
│   ├── candidates/
│   │   ├── entities/candidate.entity.ts        # Candidate + resume DB table
│   │   ├── dto/candidate.dto.ts
│   │   ├── candidates.service.ts               # CRUD + file handling
│   │   ├── candidates.controller.ts            # REST endpoints (public upload + admin)
│   │   └── candidates.module.ts
│   ├── users/
│   │   ├── entities/user.entity.ts             # Leads/inquiries DB table
│   │   ├── dto/user.dto.ts
│   │   ├── users.service.ts
│   │   ├── users.controller.ts
│   │   └── users.module.ts
│   ├── app.module.ts                           # Root module
│   └── main.ts                                 # Entry point
├── public/
│   └── index.html                              # Admin Panel UI (served at /admin)
├── uploads/
│   └── resumes/                                # Auto-created on first run
├── .env.example
├── package.json
├── nest-cli.json
└── tsconfig.json
```

---

## Setup & Run

### 1. Install PostgreSQL & create database
```sql
CREATE DATABASE sharma_admin;
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env with your DB credentials
```

### 4. Run in development
```bash
npm run start:dev
```

### 5. Access
| URL | Purpose |
|-----|---------|
| `http://localhost:3001/admin` | Admin Panel UI |
| `http://localhost:3001/api/docs` | Swagger API Docs |
| `http://localhost:3001/api` | REST API Base |

**Default login:**
- Email: `admin@sharmaassociates.in`
- Password: `Admin@2024`
> ⚠️ Change immediately after first login!

---

## API Endpoints

### Auth (Section 1 — Account)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/login` | Public | Login → returns JWT |
| GET | `/api/auth/account` | Admin | Get current account |
| PATCH | `/api/auth/account` | Admin | Update name/email |
| PATCH | `/api/auth/change-password` | Admin | Change password |

### Candidates (Section 2)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/candidates/upload` | **Public** | Upload resume from website form |
| GET | `/api/candidates` | Admin | List with pagination/filters |
| GET | `/api/candidates/stats` | Admin | Dashboard stats |
| GET | `/api/candidates/:id` | Admin | Get single candidate |
| GET | `/api/candidates/:id/resume` | Admin | Download resume file |
| PATCH | `/api/candidates/:id/status` | Admin | Update status + notes |
| DELETE | `/api/candidates/:id` | Admin | Delete candidate + file |

### Users / Leads (Section 3)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/users` | **Public** | Submit contact form from website |
| GET | `/api/users` | Admin | List leads with pagination/filters |
| GET | `/api/users/stats` | Admin | Dashboard stats |
| GET | `/api/users/:id` | Admin | Get single lead |
| PATCH | `/api/users/:id/status` | Admin | Update status/notes/assignment |
| DELETE | `/api/users/:id` | Admin | Delete lead |

---

## Integrating with Your Website

### Resume Upload Form (Candidate page)
```html
<form action="http://localhost:3001/api/candidates/upload" method="POST" enctype="multipart/form-data">
  <input name="name" required/>
  <input name="email" type="email" required/>
  <input name="phone"/>
  <input name="jobTitle" placeholder="Position applying for"/>
  <input name="experience" placeholder="Years of experience"/>
  <input name="skills"/>
  <input name="resume" type="file" accept=".pdf,.doc,.docx" required/>
  <button type="submit">Submit Application</button>
</form>
```

### Contact Form (All pages → Users table)
```javascript
await fetch('http://localhost:3001/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@company.com',
    phone: '+91 98765 43210',
    company: 'ABC Corp',
    serviceInterest: 'recruitment', // recruitment|legal|social_media|website_design|business_consulting|paid_ads|other
    message: 'I need help with...',
    source: 'recruitment-page',   // tracks which page they came from
  })
});
```

---

## Admin Panel Features

### Dashboard
- Live stats: total candidates, new candidates, total leads, new leads
- Recent 5 candidates + recent 5 leads

### Candidates (Section 2)
- Paginated table (12 per page)
- Search by name, email, skills, position
- Filter by status
- Click any row → modal with full details
- Update status: New → Reviewing → Shortlisted → Rejected → Hired
- Download resume directly
- Add admin notes
- Delete candidate (removes DB record + file from disk)

### Users / Leads (Section 3)
- Paginated table (12 per page)
- Search by name, email, company
- Filter by status + service type
- Click any row → modal with full message
- Update status: New → Contacted → Qualified → Proposal → Closed Won/Lost
- Assign to team member
- Add notes

### Account (Section 1)
- Update name + email
- Change password (requires current password)
- API info panel

---

## Candidate Status Flow
```
New → Reviewing → Shortlisted → Hired
                ↘ Rejected
```

## Lead Status Flow
```
New → Contacted → Qualified → Proposal → Closed Won
                                       ↘ Closed Lost
```

---

## Production Checklist
- [ ] Set `NODE_ENV=production` in .env
- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Change default admin password
- [ ] Set `DB_PASSWORD` to secure value
- [ ] Disable Swagger in production (already handled)
- [ ] Set up PostgreSQL backups
- [ ] Configure `uploads/` directory with proper permissions
- [ ] Put behind nginx reverse proxy with SSL
