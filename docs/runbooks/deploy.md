# Runbook — Déploiement

> **Statut : différé** jusqu’au choix d’hébergeur UE (plan cloud J1 / C3-2).  
> Pas de GitOps (ArgoCD / Flux) tant que l’infra reste Docker Compose.

## Périmètre actuel

| Couche | État |
|--------|------|
| CI tests (front + back) | [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) |
| Compose local | [`docker-compose.yml`](../../docker-compose.yml) |
| Compose prod (brouillon) | [`docker-compose.prod.yml`](../../docker-compose.prod.yml) |
| CD préprod auto | **Pas encore** — à ajouter après VPS / compte org UE |
| GitOps | **Hors scope MVP** |

## Quand l’hébergeur sera figé

1. Créer l’environment GitHub `preprod` + secrets (`SSH_HOST`, `SSH_KEY`, registry si besoin).
2. Ajouter `.github/workflows/deploy-preprod.yml` : build → push images → `docker compose -f docker-compose.prod.yml pull && up -d`.
3. Documenter ici : prérequis machine, DNS/TLS, migrations Prisma, smoke tests, rollback.
4. Test restore backup (principe plan cloud #7) avant toute « prod démo ».

## Règles dures

- Aucun secret dans git (CI via GitHub Secrets uniquement).
- Seed / comptes démo jamais en production (`RUN_SEED=false`).
- En cas de doute sécu → bloquer le déploiement.
