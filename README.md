# Secure Full-Stack Job/Internship Portal

A full-stack web application where students can browse and apply to internship/job postings, recruiters can post and manage listings, and admins can moderate the platform — built with a strong focus on backend security.

**Live demo:** https://secure-job-portal-xi.vercel.app
**API:** https://secure-job-portal-1tcm.onrender.com

> Note: the backend runs on Render's free tier, which uses temporary storage — the database resets periodically and the server may take ~30 seconds to wake up after inactivity. This is a hosting limitation, not an application bug.

## Features

- **Authentication** — JWT-based login/registration with bcrypt password hashing
- **Role-based access** — Student, Recruiter, and Admin roles with distinct permissions and dashboards
- **Student flow** — Browse postings, view details, apply, and track application status
- **Recruiter flow** — Create, edit, delete job postings; view and manage applicants
- **Admin flow** — Approve/reject postings, enable/disable user accounts
- **Security hardening** — Input validation, rate limiting, account lockout after failed logins, secure HTTP headers, environment-based secrets management, and security event logging (see [`SECURITY.md`](./SECURITY.md) for full details)
- **Automated tests** — Backend covered with `pytest`

## Tech Stack

**Frontend:** React (Vite), React Router, Tailwind CSS, Axios
**Backend:** Python, Flask, SQLAlchemy, Flask-JWT-Extended, Flask-Bcrypt, Flask-Limiter, Flask-Talisman, Marshmallow
**Database:** SQLite
**Deployment:** Vercel (frontend), Render (backend)

## Project Structure

```
secure_job_portal/
├── backend/          # Flask API
│   ├── app.py        # Routes, auth, security middleware
│   ├── models.py     # SQLAlchemy models (User, Posting, Application)
│   ├── test_app.py   # pytest test suite
│   └── requirements.txt
├── frontend/         # React application
│   └── src/
│       ├── pages/    # Route-level components
│       └── context/  # AuthContext (JWT/role state)
├── SECURITY.md        # Full security documentation
└── README.md
```

## Running Locally

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
# Create a .env file with: JWT_SECRET_KEY=<your-random-secret>
python app.py
```
API runs at `http://localhost:5000`

### Frontend
```bash
cd frontend
npm install
# Create a .env file with: VITE_API_URL=http://localhost:5000
npm run dev
```
App runs at `http://localhost:5173`

### Running Tests
```bash
cd backend
pytest
```

## User Roles

| Role | Can do |
|---|---|
| Student | Browse postings, apply, track application status |
| Recruiter | Post/edit/delete jobs, view applicants for their own postings |
| Admin | Approve/reject any posting, enable/disable any user account |

## Security

This project treats security as a first-class concern, not an afterthought. See [`SECURITY.md`](./SECURITY.md) for the full breakdown of authentication, authorization, input validation, rate limiting, account lockout, secrets management, secure headers, and logging implemented throughout.

## Author

Built by Bunty as a hands-on portfolio project while transitioning into a full-stack/security-conscious development role.
