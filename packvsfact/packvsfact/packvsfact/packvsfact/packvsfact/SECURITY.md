# PACKVSFACT Security Policy & Defense-in-Depth Architecture

## Security Principles
1. **Zero External API Secrets in Frontend**: All credentials, tokens, and database secrets remain strictly on the self-hosted backend.
2. **Authentication & Password Protection**: Passwords are hashed using salt + SHA-256 / bcrypt cryptographic algorithms. JWT tokens are signed with HS256 and expire automatically.
3. **Role-Based Access Control (RBAC)**: Enforces permissions for `USER`, `ADMIN`, `REVIEWER`, and `LAB_VERIFIER`.
4. **File Upload Security**: Uploaded OCR images are validated for extension (.png, .jpg, .jpeg, .webp), size limited (<10MB), renamed with UUID hashes, and stored outside web execution directories.
5. **Input Validation & Injection Defense**: SQLAlchemy ORM parametrized queries protect against SQL injection. Pydantic models validate request payloads against XSS and buffer overflow vulnerabilities.
6. **Audit Logging**: Sensitive operations, verification state changes, and admin access are logged in `audit_logs`.
