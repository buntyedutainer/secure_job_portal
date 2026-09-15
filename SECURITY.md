# Security Measures — Secure Job/Internship Portal

This document summarizes the security practices implemented in this project.

## Authentication & Authorization
- **Password hashing**: All passwords are hashed with bcrypt (`flask-bcrypt`) before storage. Plain-text passwords are never stored or logged.
- **JWT-based authentication**: Login issues a signed JWT (`flask-jwt-extended`), used to authenticate all subsequent requests to protected endpoints.
- **Role-based access control**: Three roles (student, recruiter, admin) with endpoints restricted by role — e.g., only admins can access `/admin/*` routes.
- **Ownership checks**: Recruiters can only edit, delete, or view applicants for postings they personally created — verified server-side against the authenticated user's ID, never trusted from client input.
- **Self-registration as admin blocked**: The registration schema only permits `student` or `recruiter` roles; admin accounts must be provisioned separately.

## Input Validation
- All registration input is validated with `marshmallow` schemas: required fields, valid email format, minimum password length (8 characters), and role restricted to an allowed set.
- Malformed or invalid requests receive a clear `400 Bad Request` response rather than crashing or silently succeeding with bad data.

## Brute-Force Protection
- **Rate limiting** (`flask-limiter`): Login and registration are capped at 5 requests per minute per IP address, in addition to a general app-wide limit.
- **Account lockout**: After 5 consecutive failed login attempts, an account is temporarily locked for 15 minutes, even if the correct password is subsequently provided.

## Secrets Management
- The JWT signing secret is a cryptographically random 256-bit key, generated with Python's `secrets` module and stored in a `.env` file.
- `.env` is excluded from version control via `.gitignore` and has never been committed to the repository.

## Secure HTTP Headers
- `flask-talisman` adds standard protective headers to every response, including Content-Security-Policy, X-Content-Type-Options, X-Frame-Options, and Strict-Transport-Security (once deployed over HTTPS).
- A restrictive Content-Security-Policy limits script and style sources to the application's own origin, mitigating cross-site scripting (XSS) risk.

## SQL Injection
- All database access goes through the SQLAlchemy ORM (`User.query`, `db.session`, etc.). No raw, string-interpolated SQL queries are used anywhere in the application's request-handling code, which prevents SQL injection by construction.

## Logging
- Security-relevant events (failed logins, account lockouts, successful logins) are recorded with timestamps in `security.log`.
- Logs deliberately never record the password attempted, only the associated email and outcome, to avoid exposing sensitive data even in log files.

## CORS
- Cross-Origin Resource Sharing (`flask-cors`) is configured to allow the frontend to communicate with the backend during development.

## Account Status Enforcement
- Disabled accounts (`is_active = False`, set by an admin) are blocked at login with a clear `403` response, checked before password verification.

## Known Limitations / Future Work
- The JWT token is currently held in frontend memory (React state) rather than an httpOnly cookie; migrating to httpOnly cookies with CSRF protection would further reduce XSS-based token theft risk.
- No automated security scanning (e.g., OWASP ZAP) has been run against this application yet.
