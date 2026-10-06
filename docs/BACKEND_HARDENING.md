# Durcissement préproduction — Popy Academy API

## Secrets

- Générer des secrets JWT distincts (≥ 32 caractères) pour access et refresh.
- Stocker via gestionnaire de secrets (pas dans git).
- Rotation : régénérer `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`, redémarrer l’API ;
  les sessions existantes sont invalidées (comportement attendu).
- `pairing_secret` robot : régénérer via révocation + nouvel enregistrement.

## Backups PostgreSQL

```bash
docker compose exec postgres pg_dump -U popy popy_academy | gzip > backup-$(date +%F).sql.gz
```

- Fréquence recommandée : quotidienne en préprod / production.
- Conserver chiffré, région UE.
- Tester une restauration avant mise en production.

## Checklist préprod

- [ ] `.env` production sans secrets de développement
- [ ] TLS terminé devant l’API
- [ ] `APP_ORIGIN` restreint au front réel
- [ ] Migrations Prisma appliquées
- [ ] Seed **désactivé** en production (`RUN_SEED=false`)
- [ ] Rate limit actif
- [ ] MFA activée pour comptes admin / enseignants (`MFA_REQUIRED_ROLES`)
- [ ] `BILLING_MODE=stripe` + clés Stripe
- [ ] Sauvegardes planifiées
- [ ] `pnpm test` vert dans `backend/`
- [ ] Monitoring `/health`
- [ ] CI GitHub Actions verte

## CI

Workflow : `.github/workflows/ci.yml`

```bash
cd backend && pnpm install && pnpm prisma migrate deploy && pnpm test
pnpm test   # front
```

## Abonnements

| Code | Prix | Robot |
|------|------|-------|
| ordinateur | 0 € | jamais requis |
| famille | 12,99 € | optionnel |
| ecole | 99 € | optionnel |

Paiement démo : `POST /subscriptions/billing/checkout` puis `/confirm`.  
Production : `BILLING_MODE=stripe`.

## PIN parental

Le PIN parental reste **côté client uniquement** (IndexedDB). Il ne remplace
pas l’authentification serveur des adultes (email + mot de passe + MFA).
