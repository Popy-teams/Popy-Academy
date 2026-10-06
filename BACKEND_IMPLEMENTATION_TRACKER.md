# Backend réel — Suivi d’implémentation A→Z

> Source de vérité pour le backend. Mettre à jour **après** chaque phase
> validée (code + tests verts). Spec : `BACKEND_SPECIFICATIONS.md`.

## Légende

- `[x]` terminé et vérifié
- `[-]` partiellement réalisé
- `[ ]` à faire
- `[!]` dépend d’un facteur externe (robot physique, audit terrain, préprod)

## Stack figée

- Fastify + TypeScript + Prisma + PostgreSQL + Vitest
- Auth : email + mot de passe (argon2) + MFA TOTP
- Sessions : JWT access + refresh rotatif

---

## Phase 0 — Fondations repo

- [x] Tracker créé et lié à la roadmap
- [x] Scaffold `backend/` (package.json, tsconfig, Vitest)
- [x] Docker Compose : `postgres` + `api` + `web`
- [x] `.env.example` (DATABASE_URL, JWT, APP_ORIGIN)
- [x] Remplacement du stub `server.mjs`
- [x] `GET /health` + test

## Phase 1 — Schéma Prisma

- [x] Enums rôles / statuts
- [x] Entités métier (users → audit_logs)
- [x] Tables auth (sessions, mfa_secrets, refresh_tokens)
- [x] Migration versionnée
- [x] Seed démo anonymisée
- [x] Tests schéma / contraintes

## Phase 2 — Auth réelle

- [x] Register / login email+password
- [x] Refresh token rotation
- [x] MFA TOTP (enrollement + verify)
- [x] Middleware auth
- [x] Tests auth

## Phase 3 — Autorisations

- [x] Matrice RBAC par rôle
- [x] Audit logs accès sensibles
- [x] Rate limiting
- [x] Tests refus hors périmètre

## Phase 4 — APIs métier

- [x] `/profiles`, `/children`, `/classes`, `/assignments`
- [x] `/contents`, `/activities`, `/competencies`
- [x] `/accommodations`, `/observations`
- [x] `/messages`, `/notifications`, `/consents`
- [x] `/robots`, `/exports`, `/privacy`
- [x] Idempotency `operation_id`
- [x] Tests intégration (happy path + refus)

## Phase 5 — Sync hors ligne

- [x] `POST /sync` → synced | rejected | conflict
- [x] Merge progressions / restrictif consentements
- [x] Front `hybrid-sync` branché sur vraie API
- [x] Tests conflits

## Phase 6 — Temps réel

- [x] WebSocket messages / notifs / robot / progressions
- [x] Non-bloquant pour activités en cache
- [x] Tests diffusion

## Phase 7 — RGPD

- [x] Export structuré
- [x] Rectification / effacement
- [x] Conservation configurée
- [x] Tests export + delete

## Phase 8 — Robot

- [x] Appairage authentifié
- [x] État / commandes / urgence / révocation
- [x] Pas de média brut inutile
- [x] Tests pairing + urgence

## Phase 9 — Migration front

- [x] Adaptateur hybride IndexedDB
- [x] File sync → backend
- [x] Auth UI adultes (remplace PIN simulé serveur)
- [x] Policies actives côté client API
- [x] Tests sync/offline ciblés

## Phase 10 — Durcissement

- [x] Doc secrets / backups
- [x] `pnpm test` backend
- [x] Roadmap mise à jour (plus de backend fictif)

---

## Journal

| Date | Phase | Note |
|------|-------|------|
| 2026-10-05 | 0–10 | Implémentation initiale du backend réel |
| 2026-10-06 | + | Abonnements + computer-first (robot optionnel) |
| 2026-10-06 | + | Billing démo/Stripe, MFA roles, CI, SessionBootstrap |
