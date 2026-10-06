# Popy Academy

Application pédagogique React (PWA) + API Fastify / Prisma / PostgreSQL.

## Démarrage

```bash
docker compose up --build
```

- Front : http://localhost:8443  
- API : http://localhost:5001/health  

## Backend

Voir `BACKEND_IMPLEMENTATION_TRACKER.md`, `BACKEND_SPECIFICATIONS.md`,
`docs/BACKEND_HARDENING.md`.

Comptes démo (seed) :

| Rôle | E-mail | Mot de passe |
|------|--------|--------------|
| Parent | parent.demo@example.invalid | DemoPassw0rd! |
| Enseignant | enseignant.demo@example.invalid | DemoPassw0rd! |
| AESH | aesh.demo@example.invalid | DemoPassw0rd! |
| Admin | admin.demo@example.invalid | DemoPassw0rd! |

Abonnements : **Ordinateur** (gratuit, sans robot) · **Famille** · **École**.  
Paiement local en mode `BILLING_MODE=demo` ; Stripe en prod.

```bash
cd backend && pnpm install && pnpm test
```

Préprod :

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Front

```bash
pnpm install && pnpm test && pnpm dev
```
