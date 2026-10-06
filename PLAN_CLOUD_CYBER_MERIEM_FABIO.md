# Plan Cloud & Cybersécurité — Mériem & Fabio  
**Popy Academy · octobre 2026 → juin 2027**

> **Version :** 1.0 — 2026-10-06  
> **Statut :** document vivant — croisé avec les 7 collaborateurs.  
> **Public :** Mériem · Fabio · lead produit.  
> **Objectif non négociable :** en **juin 2027**, une **préprod / démo hébergée UE** sécurisée, supervisée, sauvegardée, avec contrôles cybersécurité et RGPD opérationnels — sans bloquer le développement local des autres binômes.  
> **Références :** `BACKEND_SPECIFICATIONS.md` §7–8–11 · `docs/BACKEND_HARDENING.md` · `BACKEND_IMPLEMENTATION_TRACKER.md` · `APP_COMPLETION_ROADMAP.md` · `PEDAGOGICAL_AI_PLAN.md` · `PLAN_IA_SONIA_PIERRE_ALEXIS.md` · `PLAN_HARDWARE_ERWAN_THEO.md` · **`robot/bom/BOM_ACHATS_POPY.md`** (budget cloud §13 inclus)

---

## Comment utiliser ce document

1. Lire d’abord **§0 État des lieux** (ne pas refaire auth/MFA/CI déjà là).  
2. Avancer en **sprints de 2 semaines** ; cocher les IDs dans `CLOUD_CYBER_TRACKER.md` (à créer au kickoff).  
3. Toute décision cloud / sécu = **ADR** `docs/adr/CC-XXX.md`.  
4. **Sécurité et conformité avant « joli dashboard »**.  
5. Mapping 7 collabs : **§16**.  
6. **Travaux croisés :** [`PLAN_COORDINATION_7.md`](PLAN_COORDINATION_7.md) — surtout X07, X08, X09, X13, G3, G5.

---

## 0. État des lieux — ce qui existe DÉJÀ

### 0.1 Décisions produit déjà figées

| Décision | Statut |
|----------|--------|
| Ordinateur d’abord, robot optionnel | Fait |
| Hébergement **européen / souverain** (spec) | Cadré — **pas encore déployé** |
| Auth email/password + MFA TOTP + JWT | Fait (API) |
| MFA obligatoire TEACHER / ADMIN | Fait |
| RGPD export / delete MVP | Fait (API) |
| Seed **off** en prod (`RUN_SEED=false`) | Documenté + compose préprod |
| Billing Stripe-ready | Code prêt — clés prod absentes |
| Pas de pub / pas de profilage commercial | Spec |

### 0.2 Déjà dans le logiciel (réutilisable)

| Élément | État | Où | Pour vous |
|---------|------|-----|-----------|
| API Fastify + Prisma + Postgres | MVP | `backend/` | Cible à durcir et déployer |
| Docker Compose dev | OK | `docker-compose.yml` | Base locale équipe |
| Compose préprod (seed off) | OK | `docker-compose.prod.yml` | Point de départ déploiement |
| CI GitHub Actions | OK | `.github/workflows/ci.yml` | À étendre (scans sécu, images) |
| Auth argon2 + JWT access/refresh | OK | `backend/src/routes/auth.ts` | Secrets à sortir de git / vault |
| RBAC | OK | `backend/src/lib/rbac.ts` | Auditer + tests négatifs |
| Rate limit | OK | API | Affiner par route / IP |
| Audit log | MVP | schéma + routes | Rétention + alerting |
| RGPD `/exports` `/privacy` | MVP | routes | Processus + délais + preuves |
| MFA TOTP | OK | auth + hook app | Monitoring échecs MFA |
| WebSocket realtime | MVP | `/realtime/ws` | TLS + auth WS en préprod |
| API robots (pair, estop, revoke) | MVP | `robots.ts` | Hardening device auth avec Théo |
| Doc durcissement | Draft | `docs/BACKEND_HARDENING.md` | **Votre checklist de travail** |
| `.env.example` | OK | `backend/.env.example` | Modèle secrets — jamais committer `.env` |

### 0.3 Ce qui N’existe PAS (votre chantier principal)

| Absent | À livrer |
|--------|----------|
| Hébergeur UE choisi + contrat / DPA | ADR-CC-001 + compte org |
| Environnements cloud (préprod, prod, demo) | Terraform/Ansible **ou** scripts documentés |
| TLS public (certificats, domaine) | HTTPS front + API |
| Secrets manager / rotation réelle | Vault / secrets hébergeur / GitHub Environments |
| Backups automatiques + test restore | Cron + runbook |
| Monitoring / alerting | Uptime, erreurs 5xx, disque, certs |
| WAF / reverse proxy durci | Caddy / Traefik / nginx |
| Threat model documenté | STRIDE / fiche risques |
| Revue dépendances (SCA) + SAST | CI |
| Journalisation centralisée + rétention | Logs JSON → stockage UE |
| AIPD / registre traitements (ops) | Avec lead / juridique |
| Pentest / audit externe (ou interne structuré) | Avant démo juin |
| Incident response playbook | Runbook + contacts |
| Hardening robot cloud (révocation, rate device) | Avec Erwan/Théo |
| Budget cloud mensuel suivi | FinOps léger |

### 0.4 Architecture cible (vue cloud)

```
                    Internet (TLS only)
                           │
                    ┌──────┴──────┐
                    │ Reverse     │  WAF / rate limit / HSTS
                    │ proxy       │
                    └──────┬──────┘
               ┌───────────┼───────────┐
               ↓           ↓           ↓
            Front SPA    API Fastify   (opt) AI worker
            (static)     + WS          (Sonia/PA)
               │           │
               │           ↓
               │      PostgreSQL (UE)
               │      backups chiffrés
               │           │
               └──── object storage UE (exports, logs, artefacts)
                           │
                    Secrets manager
                    Monitoring + alertes
```

Robot et clients → **même API** ; pas de backdoor cloud propriétaire opaque.

### 0.5 Lancer l’existant (ne pas casser)

```bash
docker compose up -d
# API :5001  Front :8443
cd backend && pnpm test
# Comptes *.demo@example.invalid / DemoPassw0rd!
```

Préprod locale :

```bash
docker compose -f docker-compose.prod.yml up -d
# Vérifier RUN_SEED=false
```

### 0.6 Documents déjà écrits (enrichir, ne pas dupliquer)

| Doc | Rôle |
|-----|------|
| `docs/BACKEND_HARDENING.md` | Checklist préprod actuelle |
| `BACKEND_SPECIFICATIONS.md` §7–8–11 | Exigences sécu / RGPD / envs |
| `BACKEND_IMPLEMENTATION_TRACKER.md` | Ce qui est déjà codé |
| Ce fichier | Plan opérationnel Mériem & Fabio → juin 2027 |

---

## 1. Mission du binôme Mériem & Fabio

Livrer d’ici **juin 2027** :

1. Une **infra cloud UE** (préprod + démo, puis prod minimale) pour l’API, le front, Postgres.  
2. Un **socle cybersécurité** : threat model, durcissement, CI sécu, secrets, TLS, logs.  
3. Un **support technique RGPD** (TTL, preuves export/delete, alignement Yacine) — le **pilotage RGPD** est porté par **Yacine** (`PLAN_RGPD_YACINE.md`).  
4. Des **runbooks** (déploiement, restore, incident) utilisables par toute l’équipe.  
5. La **preuve soutenance** : hébergement UE, MFA, backups testés, pas de secrets dans git.

### Répartition nominative

| Domaine | Owner principal | Backup |
|---------|-----------------|--------|
| Choix hébergeur UE + compte org + réseau | **Mériem** | Fabio |
| IaC / compose prod / reverse proxy / TLS | **Mériem** | Fabio |
| Environnements (demo / préprod / prod) | **Mériem** | Fabio |
| Backups Postgres + test restore | **Mériem** | Fabio |
| Monitoring / uptime / alerting | **Mériem** | Fabio |
| FinOps / budget cloud | **Mériem** | Lead |
| CI/CD déploiement (après CI tests) | **Mériem** | Fabio |
| Threat model + ADR sécu | **Fabio** | Mériem |
| Secrets, rotation, vault | **Fabio** | Mériem |
| Durcissement API (headers, CORS, rate, WS) | **Fabio** | + backend |
| SCA / SAST / dependency review | **Fabio** | Mériem |
| Audit RBAC / MFA / sessions | **Fabio** | — |
| Logs d’accès + détection anomalies | **Fabio** | Mériem |
| Support technique RGPD (purge, preuves export, TTL) | **Fabio** | **Yacine** (pilotage) |
| Incident response technique | **Fabio** | Mériem |
| Sécurité robot côté cloud (revoke, quotas) | **Fabio** | Théo |
| Pentest / checklist audit juin | **Fabio** | Mériem |
| Dossier soutenance cloud/cyber | **Les deux** | |
| **RGPD / privacy (registre, notices, AIPD, droits)** | **Yacine** — voir `PLAN_RGPD_YACINE.md` | Fabio/Mériem support tech |

### Ce que vous ne faites pas (sauf demande écrite)

- Rédaction contenus pédagogiques / RAG chunks  
- Fine-tuning modèles IA  
- Mécanique / firmware robot bas niveau  
- Refonte UI React complète  
- Réécriture de l’auth déjà livrée (vous **durcissez** et **opérez**)

---

## 2. Principes durs (non négociables)

| # | Principe |
|---|----------|
| 1 | Données et hébergement en **UE** (ou souverain FR/EU documenté). |
| 2 | **Aucun secret** dans git (`.env` local only ; CI via secrets GitHub). |
| 3 | Seed / comptes démo **jamais** en production. |
| 4 | TLS partout en préprod/prod ; HSTS. |
| 5 | MFA obligatoire comptes à privilèges (déjà code — à **vérifier en prod**). |
| 6 | Minimisation : pas de logs de contenus enfants / prompts bruts en clair longue durée. |
| 7 | Backups chiffrés + **restore testé** au moins 1×/trimestre (1× avant juin). |
| 8 | Robot compromis → **révocation cloud** immédiate (API existante à opérer). |
| 9 | IA / vision : pas d’ouverture cloud caméra sans policy + consentement. |
| 10 | En cas de doute sécu → **bloquer le déploiement**, pas « on verra après la démo ». |

### Phrase jury (à connaître)

> POPY Academy héberge ses services en Europe, avec chiffrement en transit, secrets hors dépôt, MFA sur les comptes sensibles, sauvegardes testées et procédures d’incident. La cybersécurité et le RGPD sont traités comme des livrables projet, pas comme une option de fin de parcours.

---

## 3. Stack cloud & sécu recommandée

| Couche | Choix v1 recommandé | Alternatives | ADR |
|--------|---------------------|--------------|-----|
| Hébergeur UE | **Scaleway** ou **OVHcloud** | Infomaniak, Hetzner DE/FI (documenter transfert) | CC-001 |
| Compute | VPS / Instances + Docker Compose | Kubernetes **plus tard** (éviter over-engineering avant mars) | CC-002 |
| Reverse proxy | **Caddy** (TLS auto) ou Traefik | nginx + certbot | CC-003 |
| Base | PostgreSQL managé **ou** Postgres container + volume | — | CC-004 |
| Object storage | Scaleway Object / OVH S3-compatible | Backups + exports | CC-005 |
| Secrets | GitHub Environments + secrets hébergeur | Infisical / Vault si temps | CC-006 |
| DNS / domaine | Cloudflare **proxy off** ou DNS hébergeur (privacy) | — | CC-007 |
| Monitoring | Uptime Kuma **ou** Better Stack + `/health` | Grafana stack si charge OK | CC-008 |
| SCA | `pnpm audit` + Dependabot / Renovate | Snyk free | CC-009 |
| SAST | Semgrep ou CodeQL GitHub | — | CC-010 |
| Logs | JSON stdout → fichier rotaté UE | Loki optionnel | CC-011 |

**Décision Sprint 0 obligatoire :** hébergeur (CC-001) + compose vs PaaS (CC-002).  
Défaut recommandé : **Scaleway/OVH + Docker Compose + Caddy** jusqu’à la démo juin.

---

## 4. Environnements

| Env | Données | Seed | Accès | Owner |
|-----|---------|------|-------|-------|
| **local** | Fictives | OK | Dev | Tous |
| **demo** | Anonymisées / fictives | OK contrôlé | Jury / démo | Mériem |
| **préprod** | Jeu de test sans PII réelle | **OFF** | Équipe + tests sécu | Mériem + Fabio |
| **prod** | Réelles (si ouverture) | **OFF** | Restreint | Lead + Mériem + Fabio |
| **robot lab** | Device keys lab | — | Erwan/Théo | + Fabio revoke |

Règles :

- Comptes `*.demo@example.invalid` **uniquement** local/demo.  
- Prod et préprod : mots de passe forts, MFA, pas de docs publics avec credentials.  
- Separations : bases et secrets **distincts** par env.

---

## 5. Roadmap sprints (oct. 2026 → juin 2027)

Légende IDs : `C#` = tâche Cloud (Mériem lead) · `Y#` = tâche cYber (Fabio lead) · `J#` = joint.

### Calendrier macro

| Période | Focus | Livrable clé |
|---------|-------|--------------|
| oct–nov 2026 | **CC0** Cadrage | ADR hébergeur, threat model v0, tracker |
| nov–déc 2026 | **CC1** Socle préprod | VPS + TLS + compose + secrets |
| jan 2027 | **CC2** Backups & obs | Backup auto + restore drill + monitoring |
| fév 2027 | **CC3** Durcissement | Headers, rate, SCA/SAST, logs |
| mars 2027 | **CC4** RGPD ops | Rétention, preuves export/delete, registre |
| avr 2027 | **CC5** Robot & IA cloud | Quotas device, isolation AI keys, review |
| mai 2027 | **CC6** Audit | Pentest interne / checklist, correctifs |
| juin 2027 | **CC7** Freeze démo | Runbooks, dossier soutenance, prod minimale |

---

### Sprint CC0 — Cadrage (2 sem.)

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| C0-1 | M | Comparatif Scaleway / OVH / Infomaniak (prix, DPA, régions) | Tableau | Lead choisit | 1.5 j |
| C0-2 | M | ADR-CC-001 hébergeur + région | `docs/adr/CC-001.md` | Signé | 0.5 j |
| Y0-1 | F | Threat model v0 (STRIDE app + API + robot cloud) | Doc | Revue lead | 2 j |
| Y0-2 | F | Inventaire surfaces d’attaque (routes, WS, robots, billing) | Liste | Alignée tracker backend | 1 j |
| J0-1 | M+F | Créer `CLOUD_CYBER_TRACKER.md` + arbo `docs/security/` `infra/` | Fichiers | Merge | 1 j |
| J0-2 | M+F | Relire `BACKEND_HARDENING.md` → backlog priorisé | Issues | Top 15 ordonnés | 1 j |
| C0-3 | M | Budgéter cloud dans `robot/bom/BOM_ACHATS_POPY.md` §13 + valider **700 €** Lead | BOM à jour | Validé lead | 0.5 j |

**Revue :** ADR-CC-001 signée + threat model v0.

---

### Sprint CC1 — Socle préprod (4 sem. · nov–déc)

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| C1-1 | M | Compte org hébergeur + 2FA console + accès Fabio | Accès | Les deux OK | 0.5 j |
| C1-2 | M | VPS / instance UE + firewall (22 restreint, 80/443) | Machine | SSH clé only | 1 j |
| C1-3 | M | Domaine + DNS | DNS | Résolution OK | 0.5 j |
| C1-4 | M | Caddy/Traefik + TLS Let’s Encrypt front+API | HTTPS | A+ SSLLabs basique | 2 j |
| C1-5 | M | Déploiement `docker-compose.prod.yml` adapté | Stack up | `/health` 200 | 2 j |
| C1-6 | M | `APP_ORIGIN` + CORS strict préprod | Config | Origines non `*` | 0.5 j |
| Y1-1 | F | Secrets hors machine : GitHub Env + fichiers non git | Procédure | 0 secret dans repo | 1 j |
| Y1-2 | F | Génération JWT secrets ≥32 + doc rotation | Runbook | Aligné hardening | 0.5 j |
| Y1-3 | F | Vérifier MFA TEACHER/ADMIN sur préprod | Test | Blocage sans MFA | 0.5 j |
| Y1-4 | F | Headers sécu (HSTS, CSP baseline, X-Frame, Referrer) | Config proxy/app | Checklist OK | 1 j |
| J1-1 | M+F | Runbook déploiement v0 | `docs/runbooks/deploy.md` | Relu lead | 1 j |
| C1-7 | M | Environnement **demo** séparé (ou namespace) | URL demo | Données fictives | 1 j |

**Revue :** URL HTTPS préprod utilisable par l’équipe.

---

### Sprint CC2 — Backups & observabilité (janv.)

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| C2-1 | M | Backup Postgres quotidien chiffré → object storage UE | Cron/script | Artefact J-1 présent | 2 j |
| C2-2 | M | **Restore drill** sur instance jetable | Compte-rendu | Données lisibles | 1 j |
| C2-3 | M | Monitoring `/health` + alerte down | Outil | Alerte test reçue | 1 j |
| C2-4 | M | Alerte disque / certificat TLS expiry | Alertes | Doc | 0.5 j |
| Y2-1 | F | Politique rétention backups (durée, accès) | Doc | Aligné RGPD | 0.5 j |
| Y2-2 | F | Pas de PII dans logs app (revue sampling) | Rapport | Correctifs listés | 1 j |
| J2-1 | M+F | Runbook `backup-restore.md` | Doc | Exécutable en &lt;1 h | 1 j |

---

### Sprint CC3 — Durcissement applicatif (fév.)

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| Y3-1 | F | Rate limit par route sensible (auth, billing, robots) | Config/code | Tests | 1.5 j |
| Y3-2 | F | Revue RBAC : matrix rôles × endpoints | Table | Gaps fixés ou ticketés | 2 j |
| Y3-3 | F | Auth WebSocket (token) + origine | Patch | WS sans token rejeté | 1 j |
| Y3-4 | F | Dependabot/Renovate + `pnpm audit` en CI | CI | PR auto | 1 j |
| Y3-5 | F | SAST (CodeQL ou Semgrep) sur backend | CI | Vert ou dettes listées | 1 j |
| C3-1 | M | Build images Docker non-root + tags versionnés | Dockerfiles | Scan basique OK | 1.5 j |
| C3-2 | M | Pipeline deploy manuel documenté (ou GH Actions environment) | CI/CD | Deploy préprod &lt;20 min | 2 j |
| Y3-6 | F | Checklist OWASP ASVS niveau 1 (extrait) | Doc | % couverture | 1 j |
| J3-1 | M+F | Mettre à jour `BACKEND_HARDENING.md` | Doc | Reflète la réalité préprod | 0.5 j |

---

### Sprint CC4 — Support RGPD technique (mars) — pilotage **Yacine**

> Cadre légal / registre / notices / AIPD : **Yacine** (`PLAN_RGPD_YACINE.md` sprint R3–R4).  
> Ci-dessous = **uniquement** le support infra/sécu.

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| Y4-1 | F | Appliquer durées de conservation validées par Yacine | Config/doc | Aligné registre | 1 j |
| Y4-3 | F | Preuves techniques : parcours export + delete chronométré (avec Yacine) | PV | ≤72 h cible | 1 j |
| Y4-4 | F | Inputs techniques AIPD (logs, stockage, accès) → Yacine | Note | Remis | 0.5 j |
| C4-1 | M | Stockage exports chiffré + TTL | Bucket policy | Auto-expire | 1 j |
| C4-2 | M | DPA / CGU hébergeur archivés (pour dossier Yacine) | PDF | Présents | 0.5 j |
| J4-1 | M+F+Y | Doc « privacy ops » technique ↔ procédures Yacine | Doc | — | 0.5 j |

---

### Sprint CC5 — Robot, billing, IA (avr.)

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| Y5-1 | F | Hardening `/robots/*` : rate, audit revoke, secrets pairing | Patch+doc | Tests | 2 j |
| Y5-2 | F | Revue avec Théo : OTA signée, revoke, pas de média brut cloud | CR réunion | ADR joint | 1 j |
| Y5-3 | F | Isolation clés LLM (env) + pas de log prompts enfants | Config | Revue Sonia | 1 j |
| C5-1 | M | Stripe **test** puis préparation **live** (si go lead) | Config | Webhook HTTPS | 1.5 j |
| C5-2 | M | Quotas / sizing instance si charge IA | Métriques | Budget OK | 1 j |
| J5-1 | M+F | Scénario incident « robot volé / compromis » | Runbook | Tabletop 30 min | 1 j |

---

### Sprint CC6 — Audit & correctifs (mai)

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| Y6-1 | F | Pentest interne guidé (auth, IDOR, robots, RGPD) | Rapport | Top 10 fixés ou acceptés | 3 j |
| Y6-2 | F | Ou audit externe light si budget | Rapport | — | — |
| C6-1 | M | Correctifs infra (firewall, versions, TLS) | Déploiements | Recheck | 2 j |
| J6-1 | M+F | Freeze config préprod « release-candidate » | Tag | Immutable notes | 1 j |
| Y6-3 | F | Tabletop ransomware / fuite (papier) | CR | Actions | 0.5 j |

---

### Sprint CC7 — Démo juin 2027

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| C7-1 | M | URLs stables démo + monitoring 24/7 semaine jury | Status | Uptime cible | 1 j |
| C7-2 | M | Backup J-1 démo + restore smoke | CR | OK | 0.5 j |
| Y7-1 | F | Checklist sécu jour J (MFA, seed off, secrets) | Checklist | 100 % cochée | 0.5 j |
| J7-1 | M+F | Chapitre soutenance Cloud & Cyber | Doc | Relu lead | 2 j |
| J7-2 | M+F | Handover : qui a les accès, rotation post-démo | Doc | — | 0.5 j |

---

## 6. Livrables documentaires obligatoires

| Livrable | Chemin suggéré | Owner |
|----------|----------------|-------|
| Tracker | `CLOUD_CYBER_TRACKER.md` | M+F |
| ADR hébergeur | `docs/adr/CC-001-*.md` | M |
| Threat model | `docs/security/threat-model.md` | F |
| Runbook deploy | `docs/runbooks/deploy.md` | M |
| Runbook backup | `docs/runbooks/backup-restore.md` | M |
| Runbook incident | `docs/runbooks/incident-response.md` | F |
| Hardening à jour | `docs/BACKEND_HARDENING.md` | F+M |
| Registre traitements | `docs/privacy/registre-traitements.md` | F |
| Matrice RBAC | `docs/security/rbac-matrix.md` | F |
| Dossier soutenance CC | `docs/soutenance/cloud-cyber.md` | M+F |

---

## 7. Critères « terminé pour juin 2027 »

Cocher **tout** pour valider le binôme :

- [ ] Préprod (ou demo) **HTTPS** accessible, hébergée **UE**  
- [ ] `RUN_SEED=false` sur cet environnement  
- [ ] Secrets absents du git ; rotation documentée  
- [ ] MFA effective sur comptes admin/enseignant de la préprod  
- [ ] Backup automatique + **au moins un** restore test réussi documenté  
- [ ] Monitoring `/health` avec alerte testée  
- [ ] Threat model v1 + correctifs critiques traités  
- [ ] SCA/SAST intégrés (ou dettes acceptées par écrit)  
- [ ] Parcours export / delete prouvé  
- [ ] Runbooks deploy + restore + incident  
- [ ] Scénario revoke robot cloud validé avec Théo  
- [ ] Chapitre soutenance Cloud & Cyber prêt  

Hors obligation juin (nice-to-have) : Kubernetes, SIEM complet, pentest externe payant, multi-région.

---

## 8. Dépendances vers les autres

| Besoin | Collab | Quand |
|--------|--------|-------|
| Stabilité API / migrations Prisma | Backend (si séparé) / équipe existante | Continu |
| Endpoints robots / OTA / pairing | **Théo** (+ Erwan) | CC5 |
| Clés LLM, pas de log prompts | **Sonia** / Pierre-Alexis | CC5 |
| Vision opt-in → AIPD | **Pierre-Alexis** + lead | CC4–CC5 |
| Domaine produit / budget hébergeur | Lead | CC0 |
| Stripe live go/no-go | Lead + billing | CC5 |
| Comptes démo jury | Toute l’équipe | CC7 |

---

## 9. RACI (extrait)

| Activité | Mériem | Fabio | Lead | IA | Hardware | Front |
|----------|--------|-------|------|----|----------|-------|
| Hébergeur / DNS / TLS | R | C | A | I | I | I |
| Compose / deploy | R | C | A | I | I | C |
| Backups / restore | R | C | A | I | I | I |
| Monitoring | R | C | A | I | I | I |
| Threat model | C | R | A | C | C | I |
| Secrets / MFA ops | C | R | A | I | I | I |
| SCA/SAST CI | C | R | A | I | I | C |
| Support tech export/delete / TTL (RGPD) | C | R | A | I | I | I |
| *Registre / notices / AIPD* | *voir Yacine — `PLAN_RGPD_YACINE.md` + X08/X14* | | | | | |
| Incident response | C | R | A | I | C | I |
| Robot revoke cloud | C | R | A | I | C | I |
| Dossier soutenance CC | R | R | A | I | I | I |

R = Responsible · A = Accountable · C = Consulted · I = Informed

---

## 10. Risques

| ID | Risque | Impact | Mitigation | Owner |
|----|--------|--------|------------|-------|
| RC1 | Budget cloud insuffisant | H | VPS unique préprod+demo ; ADR coût | Mériem |
| RC2 | Over-engineering K8s | M | Compose jusqu’à juin | Mériem |
| RC3 | Secrets commités | H | Pre-commit + scan CI + rotation | Fabio |
| RC4 | Préprod = prod sans cloison | H | Env séparés + secrets distincts | M+F |
| RC5 | Backup jamais testé | H | Drill obligatoire CC2 | Mériem |
| RC6 | IDOR / faille RBAC | H | Matrix + tests + pentest CC6 | Fabio |
| RC7 | Dépendance IA/robot retarde sécu | M | Socle cloud indépendant dès CC1 | M+F |
| RC8 | Hébergeur hors UE « moins cher » | H | Refus ; ADR UE only | Lead+M |
| RC9 | Incident jour J | H | Runbook + monitoring | Fabio |
| RC10 | Charge mentale double rôle | M | Répartition §1 respectée | Lead |

---

## 11. Cadence & reporting

### Hebdo binôme (30–45 min)

- Avancement tracker  
- Incidents / alertes  
- Blocages accès / budget  
- Dettes sécu

### Bi-hebdo avec lead

- Burn budget cloud  
- Risque démo juin  
- Go/no-go Stripe / prod réelle  

### Format statut vendredi

```
Sprint: CC…
Done: …
In progress: …
Blocked: … (attente: lead / Théo / Sonia)
Cloud health: OK|DEGRADED|DOWN
Security risk: low|med|high
Backup last OK: YYYY-MM-DD
Next week: …
```

---

## 12. Scénarios démo / soutenance (cloud & cyber)

1. Montrer l’URL **HTTPS** préprod/demo (cadenas, hébergeur UE).  
2. Afficher `/health` + dashboard monitoring.  
3. Prouver MFA sur compte enseignant.  
4. Montrer qu’il n’y a **pas** de `.env` secrets dans git.  
5. Exporter / supprimer un compte test (RGPD).  
6. Montrer un **backup** + extrait du CR de restore.  
7. Révoquer un robot de test → commandes refusées.  
8. Expliquer le threat model en 2 minutes.  
9. En cas de question ransomware : citer le runbook incident.

---

## 13. Brief manager (à leur lire)

> Mériem, Fabio : vous portez le **cloud UE** et la **cybersécurité** jusqu’à juin 2027.  
> L’app et l’API existent déjà en local ; votre job est de les **héberger, durcir, sauvegarder, superviser** et de rendre le RGPD **opérable**.  
> Mériem = infra, TLS, deploy, backups, monitoring, budget.  
> Fabio = threat model, secrets, durcissement, audits, incidents, sécu robot côté cloud ; **support technique** du RGPD (**Yacine** pilote le cadre légal — `PLAN_RGPD_YACINE.md`).  
> Pas de Kubernetes obligatoire. Pas de secrets dans git. Seed off en préprod/prod.  
> Vous vous synchronisez avec **Yacine** (RGPD), Théo (robots), Sonia/Pierre-Alexis (clés IA / privacy), et le lead (budget, DPA).  
> En juin : préprod HTTPS UE, backups testés, runbooks, chapitre soutenance Cloud & Cyber.

---

## 14. Onboarding 48 h

**Jour 1 — Mériem & Fabio**  
- Lire §0–2 de ce plan + `docs/BACKEND_HARDENING.md` + spec §7–8–11.  
- Lancer `docker compose up -d` ; tester login MFA enseignant.  
- Lister accès manquants (GitHub, DNS, carte bancaire org).

**Jour 2**  
- Draft ADR-CC-001 (3 hébergeurs comparés).  
- Draft threat model v0 (1 page).  
- Créer `CLOUD_CYBER_TRACKER.md` + dossiers `docs/security/`, `docs/runbooks/`, `infra/`.  
- Point lead : budget cloud + nom de domaine.

---

## 15. Budget cloud — intégré au BOM unique

**Tous les coûts (robot + cloud + cyber + IA) sont dans le même fichier :**  
[`robot/bom/BOM_ACHATS_POPY.md`](robot/bom/BOM_ACHATS_POPY.md) → **§0** (total) · **§13** (détail cloud/cyber) · **§14** (crédits LLM).

| Poste BOM | Provision |
|-----------|-----------|
| B — Cloud & cyber (9 mois + marge) | **700 €** |
| C — Crédits LLM (option) | **100 €** |
| A — Robot Performance | **2 900 €** |
| **Total projet recommandé** | **3 700 €** |

Détail mensuel indicatif (rappel) :

| Poste | € / mois |
|-------|----------|
| VPS préprod/demo | 15 – 40 € |
| Postgres managé (si choisi) | 0 – 30 € |
| Object storage backups | 1 – 5 € |
| Domaine (amorti) | ~1 € |
| Monitoring | 0 – 10 € |
| **Mensuel confort** | **≈ 30 – 80 €** |
| Pentest externe | 0 – 2 000 € (**hors** 700 €, go Lead) |

Mériem remplit le suivi mensuel **§10.2** du BOM après chaque facture.
---

## 16. Mapping 7 collaborateurs

| # | Nom | Domaine | Lien avec Mériem / Fabio |
|---|-----|---------|---------------------------|
| 1 | Sonia | NLP / RAG | Clés LLM, pas de log prompts, endpoints pedagogy |
| 2 | Pierre-Alexis | Vision / behavior | Opt-in, AIPD, pas de média brut cloud |
| 3 | Erwan | Hardware | Contraintes device ; pas de backdoor |
| 4 | Théo | Firmware / IoT | Pairing, OTA, revoke, rate robots |
| 5 | **Mériem** | Cloud / infra / ops | — |
| 6 | **Fabio** | Cybersécurité | Support technique privacy, logs, IDOR |
| 7 | **Yacine** | RGPD / privacy | Registre, AIPD, notices — `PLAN_RGPD_YACINE.md` |

---

## 17. Checklist kickoff (semaine 1)

- [ ] Lecture plan + hardening  
- [ ] Accès GitHub repo  
- [ ] ADR-CC-001 draft  
- [ ] Threat model v0 draft  
- [ ] Tracker créé  
- [ ] Budget mensuel validé lead  
- [ ] Nom de domaine décidé ou demandé  
- [ ] Canal Slack/Discord « cloud-cyber »  
- [ ] Premier point avec Théo (surface robots)  
- [ ] Premier point avec Sonia (secrets IA)

---

## 18. Historique

| Version | Date | Changement |
|---------|------|------------|
| 1.0 | 2026-10-06 | Création plan Mériem & Fabio — Cloud & cybersécurité → juin 2027 |
