# Security Policy — MK Pizza & Ice Bar POS

## Security architecture
- HTTPS/TLS only in production; redirect HTTP to HTTPS at the reverse proxy.
- Server-side RBAC and least-privilege permissions. Never trust client/app controls.
- Passwords must be stored as strong salted hashes (Argon2id/bcrypt); never plaintext.
- JWT access tokens should be short-lived; rotate/revoke sessions on logout or compromise.
- Strong, unique `JWT_SECRET` supplied only through environment secrets.
- Helmet/security headers, strict CORS allow-list, request-size limits and rate limiting.
- Login throttling/temporary lockout to slow credential attacks.
- Input validation and output encoding on every API boundary; parameterized SQL only.
- CSRF protection where cookie authentication is used.
- Generic authentication/authorization errors to avoid account enumeration.
- Audit logs for logins, permission failures, refunds, discounts, voids, stock changes, purchases, expenses and configuration changes.
- No secrets, passwords, tokens, customer payment data or sensitive personal data in logs.
- Database account has only the permissions required by the application.
- Automated encrypted backups plus restore testing.
- Network firewall should expose only required ports; database must never be public.
- Admin interfaces should be protected by MFA when deployed with an identity provider or compatible gateway.
- Dependency updates and automated vulnerability scanning should run in CI.

## Abuse resistance
The system should rate-limit login, public ordering, password reset and expensive report endpoints. Public order endpoints should use idempotency keys to prevent duplicate orders. Server-side authorization, transaction boundaries and inventory locks prevent forged requests from bypassing workflow controls.

## Production deception/detection
Do not rely on fake vulnerabilities or destructive traps. Instead, use safe detection: structured security events, anomaly alerts, failed-login thresholds, unusual bulk operations, repeated authorization failures and suspicious API activity. These can be forwarded to a SIEM/log service without exposing operational secrets.

## Deployment checklist
1. Set `JWT_SECRET` from a secret manager.
2. Use PostgreSQL/MySQL over a private network.
3. Put the API behind HTTPS and a reverse proxy/WAF.
4. Configure an explicit `CORS_ORIGINS` allow-list.
5. Enable backups and test restoration.
6. Change all demo credentials and create named staff accounts.
7. Enable MFA for administrators where available.
8. Review audit logs regularly.
9. Keep Node.js and dependencies patched.
10. Never expose the database port to the internet.
