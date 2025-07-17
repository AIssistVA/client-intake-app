# Client Intake Web Application

## Features
- Modern, branded landing page
- Multi-step client intake form with file upload
- Email notifications (admin + client)
- Admin dashboard (login, view/export submissions)
- Mobile responsive, enterprise UI
- Data stored in SQLite

## Deployment (Docker)

### 1. Configure Environment Variables
Edit `server/.env` with your SMTP and admin settings:
```
SMTP_HOST=...
SMTP_PORT=...
SMTP_SECURE=false
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM="Intake App <no-reply@example.com>"
ADMIN_EMAIL=admin@example.com
BASE_URL=http://localhost:4000
ADMIN_PASSWORD=changeme123
JWT_SECRET=supersecretjwtkey
```

### 2. Build and Run with Docker Compose
```
docker-compose build
docker-compose up -d
```

- The app will be available at [http://localhost:4000](http://localhost:4000)
- Admin dashboard: [http://localhost:4000/admin](http://localhost:4000/admin)
- SQLite DB is persisted in `server/intake.db`

### 3. Stopping the App
```
docker-compose down
```

---

For production, set secure SMTP and strong admin credentials.
