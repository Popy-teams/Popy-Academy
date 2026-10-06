# Workflow Git — Popy Academy

## CI

Workflow : [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)

| Job | Contenu |
|-----|---------|
| `frontend` | `pnpm install --frozen-lockfile` + `pnpm test` |
| `backend` | Postgres 16 + `prisma migrate deploy` + `pnpm test` |

Déclenché sur `push` / `pull_request` vers `main`.

PR de validation : [#1](https://github.com/Popy-teams/Popy-Academy/pull/1) — **frontend + backend verts**.

## Protection de `main`

**Bloquée techniquement** tant que le dépôt reste **privé** sur le plan **GitHub Free** de l’org `Popy-teams` :

> *Upgrade to GitHub Pro or make this repository public to enable this feature.*

### Convention d’équipe (en attendant)

1. Pas de push direct sur `main` — uniquement via PR.
2. Merger seulement si les checks `frontend` et `backend` sont verts.
3. Au moins un regard croisé (review) quand possible.

### Déblocage (au choix)

- Passer le dépôt en **public**, ou
- Upgrader l’org / un compte vers un plan avec branch protection,

puis activer la ruleset / branch protection :

- PR obligatoire
- Status checks requis : `frontend`, `backend`
- Pas de force-push

## CD / GitOps

Voir [`runbooks/deploy.md`](runbooks/deploy.md) — CD préprod différé ; pas de GitOps MVP.
