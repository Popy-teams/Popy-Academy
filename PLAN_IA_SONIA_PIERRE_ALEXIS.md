# Plan IA & Données — Sonia & Pierre-Alexis  
**Popy Academy · octobre 2026 → juin 2027**

> **Version :** 2.1 — 2026-10-06  
> **Statut :** document vivant — sera révisé pour croiser le travail des **7 collaborateurs**.  
> **Public :** Sonia (NLP/RAG) · Pierre-Alexis (vision/TS/comportement/big data) · lead produit.  
> **Références :** `PEDAGOGICAL_AI_PLAN.md` · `BACKEND_SPECIFICATIONS.md` · `APP_COMPLETION_ROADMAP.md` · `BACKEND_IMPLEMENTATION_TRACKER.md`

---

## Comment utiliser ce document

1. Chaque tâche a un **ID**, un **owner**, des **entrées**, des **sorties**, un **critère d’acceptation**, une **estimation**, des **dépendances**.
2. Le travail est découpé en **sprints de 2 semaines**.
3. Cocher dans `AI_DATA_TRACKER.md` (à créer au kickoff) : `[ ]` → `[-]` → `[x]` / `[!]`.
4. Toute modification d’architecture passe par une **ADR** (`docs/adr/AI-XXX.md`).
5. Quand les 5 autres collaborateurs sont nommés : remplir **§19 Mapping 7 collabs**.  
6. **Travaux croisés / sync avec les autres :** lire et suivre [`PLAN_COORDINATION_7.md`](PLAN_COORDINATION_7.md) (livrables X01–X15, gates, cadence transverse).

---

## 0. État des lieux — ce qui existe DÉJÀ (ne pas refaire)

> **À lire en premier.** Vous partez d’un repo applicatif avancé côté produit/UI/API, mais **presque vide côté moteur IA/RAG réel**. Ne recréez pas le front ni l’auth.

### 0.1 Décisions produit déjà figées

| Décision | Statut | Où |
|----------|--------|-----|
| Ordinateur d’abord, robot **optionnel** | Fait | App, onboarding, abonnements |
| Programmes = référentiel / RAG, pas fine-tune « mémorisation BO » | Fait (cadrage) | `PEDAGOGICAL_AI_PLAN.md` |
| LLM = reformulation dans les limites du référentiel | Fait (cadrage) | idem |
| Stack app : React + Vite + PWA + IndexedDB | Fait | `src/` |
| Stack API : Fastify + Prisma + PostgreSQL + Vitest | Fait | `backend/` |
| Auth email/password + MFA TOTP + JWT | Fait | `backend/src/routes/auth.ts` |
| Abonnements Ordinateur / Famille / École | Fait | `/subscriptions/*` |
| Plan IA/RAG phases P0–P7 | Fait (doc) | `PEDAGOGICAL_AI_PLAN.md` |

### 0.2 Backend déjà en place (réutilisable)

| Élément | État | Fichiers / endpoints | Pour vous |
|---------|------|----------------------|-----------|
| Health + Docker Compose (web/api/postgres) | OK | `docker-compose.yml` | Environnement local |
| Prisma : users, children, competencies, learning_contents, activities, evidence, sync, audit, robots… | OK | `backend/prisma/schema.prisma` | **Étendre** (chunks RAG, events), ne pas jeter |
| Seed démo anonymisée | OK | `backend/prisma/seed.ts` | Comptes `*.demo@example.invalid` |
| CRUD métiers (children, contents, activities, consents…) | MVP | `backend/src/routes/*` | Brancher retrieval dessus |
| Sync offline `POST /sync` | OK | `backend/src/routes/sync.ts` | Indépendant du RAG |
| RBAC + audit + rate limit | OK | `backend/src/lib/rbac.ts` | Respecter pour contexte enfant |
| WebSocket temps réel | MVP | `/realtime/ws` | Optionnel pour notifs |
| RGPD export / delete | MVP | `/exports`, `/privacy` | Aligné privacy features |
| MFA obligatoire TEACHER/ADMIN | OK | hook dans `app.ts` | — |
| Billing démo / Stripe-ready | OK | `/subscriptions/billing/*` | Hors scope IA |
| Tests backend | 21 verts | `backend/tests/` | Ajouter tests pedagogy |
| **`POST /pedagogy/ask`** | **Absent** | — | **À créer (cœur de votre job)** |
| **Tables `official_chunks` / RAG** | **Absent** | — | **À créer** |
| **`behavior_events` / feature store** | **Absent** | — | **À créer** |
| **Client LLM / LoRA / vision** | **Absent** | — | **À créer** |
| **Dossier `ai/`** | **Absent** | — | **À créer (Sprint 0)** |

### 0.3 Frontend déjà en place (réutilisable)

| Élément | État | Notes pour vous |
|---------|------|-----------------|
| Interfaces Enfant / Parent / Enseignant / AESH / Admin | UI riche | Beaucoup encore **local / démo**, pas tout branché API |
| Chat « Parler à Popy » | UI | **Pas** branché sur un vrai moteur grounded |
| Banque `src/data/curriculum.ts` | Placeholders | Compétences génériques + packs auto-générés — **pas** un import BO réel |
| `importOfficialReferential()` | Hook prêt | Vous pouvez vous en servir comme pont d’import |
| IndexedDB + file sync + hybrid-sync | OK | Offline ; IA réseau = fallback message |
| AccountCenter auth API | OK | Parents / adultes |
| Abonnement UI + computer-first banners | OK | Robot jamais obligatoire |
| SessionBootstrap (health + sync) | OK | Au démarrage app |
| Tests front | ~41 verts | — |

### 0.4 Données : ce qu’on a vs ce qu’on n’a pas

| On a | On n’a pas (votre chantier) |
|------|------------------------------|
| Schéma compétences / learning_contents en Prisma | Chunks officiels sourcés BO/Éduscol |
| Seed démo + packs front générés | 200+ contenus POPY validés ancrés |
| Spec open data française identifiée (cadrage) | Pipeline ETL d’ingestion production |
| Profils enfants / XP / activités (modèle) | Feature store comportement + séries temporelles |
| — | Datasets train, gold eval, cards modèles |
| — | Vision / NLP modèles entraînés |

### 0.5 Documents déjà écrits (ne pas dupliquer : enrichir)

| Doc | Rôle |
|------|------|
| `PEDAGOGICAL_AI_PLAN.md` | Architecture RAG produit (phases P0–P7) |
| `PLAN_IA_SONIA_PIERRE_ALEXIS.md` (ce fichier) | Plan opérationnel binôme → juin 2027 |
| `BACKEND_SPECIFICATIONS.md` §9 IA | Contraintes éthiques backend |
| `BACKEND_IMPLEMENTATION_TRACKER.md` | Suivi API déjà livrée |
| `APP_COMPLETION_ROADMAP.md` | Roadmap app globale |
| `docs/BACKEND_HARDENING.md` | Préprod (hors focus immédiat IA) |

### 0.6 Conséquence pour vos sprints

- **Sprint 0–1** = s’ancrer dans le repo existant + contrats, **pas** réécrire l’app.
- Votre « greenfield » réel = package **`ai/`**, **retrieval**, **`/pedagogy/*`**, **events/features**, **train/eval**.
- Réutiliser Prisma/API/front ; proposer des migrations et endpoints, en lien avec le collab backend dès qu’il est nommé.
- Remplacer progressivement `src/data/curriculum.ts` par du référentiel **sourcé**, sans casser l’UI (adapter / API + cache).

### 0.7 Comptes démo locaux (pour tester l’app existante)

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Parent | `parent.demo@example.invalid` | `DemoPassw0rd!` |
| Enseignant | `enseignant.demo@example.invalid` | `DemoPassw0rd!` |
| AESH | `aesh.demo@example.invalid` | `DemoPassw0rd!` |
| Admin | `admin.demo@example.invalid` | `DemoPassw0rd!` |

```bash
docker compose up -d
# API http://localhost:5001/health — Front http://localhost:8443
cd backend && pnpm test
pnpm test   # à la racine = front
```

---

## 1. Mission du binôme

Livrer le **cerveau pédagogique et perceptif** de POPY Academy :

- un moteur qui **répond sans inventer le programme** ;
- des pipelines de données propres, éthiques, mesurables ;
- des modèles NLP / comportement / vision **optionnels**, versionnés, évalués ;
- une expérience **100 % utilisable sur ordinateur** (robot = complément).

### Répartition nominative

| Domaine | Owner principal | Backup |
|---------|-----------------|--------|
| RAG référentiel officiel | **Sonia** | Pierre-Alexis |
| RAG contenus POPY + dialogue | **Sonia** | Pierre-Alexis |
| Intent / rewrite / remédiation texte | **Sonia** | — |
| Fine-tuning LLM / LoRA | **Sonia** | Pierre-Alexis (infra train) |
| Événements app / feature store | **Pierre-Alexis** | Sonia |
| Séries temporelles progression | **Pierre-Alexis** | — |
| Comportement / engagement | **Pierre-Alexis** | Sonia (labels texte) |
| Vision (opt-in, non biométrique ID) | **Pierre-Alexis** | — |
| Gouvernance datasets / cards | **Les deux** | — |
| Éthique / AIPD IA | **Les deux** + lead | — |
| Intégration API moteur | **Les deux** + backend | — |

### Ce que vous ne faites pas (sauf demande écrite)

- Pixels UI React, Tailwind, onboarding graphique  
- Auth JWT / abonnements Stripe  
- Rédaction brute de 200 exercices (collab pédagogie) — vous spécifiez le **schéma** et validez l’**ancrage**  
- Conception mécanique robot / firmware bas niveau  
- Choix hébergeur prod / DNS  

---

## 2. Principes durs (non négociables)

### 2.1 Architecture de vérité

```
Question
  → garde-fous (rôle, âge, consentement, intent)
  → retrieval référentiel officiel
  → retrieval contenus POPY
  → contexte enfant MINIMISÉ (si autorisé)
  → LLM / modèles = reformulation + perception
  → réponse + sources[] + grounded true|false
```

Si retrieval officiel vide sur intent `programme` → **refus standard**, jamais d’invention.

### 2.2 Entraînement

| Autorisé | Interdit |
|----------|----------|
| Fine-tune / LoRA sur Q-A POPY validées | Entraîner pour mémoriser le BO dans les poids |
| Classifieurs sur événements app anonymisés | Scraping web libre comme vérité scolaire |
| Rewrite consignes validées humainement | Stocker images/audio bruts « au cas où » |
| Modèles comportement sur features agrégées | Reconnaissance faciale identitaire |
| Synthétique labellisé « non institutionnel » | Diagnostic médical / psy automatique |

### 2.3 Phrase jury (à connaître)

> POPY n’entraîne pas son IA sur Internet pour inventer le programme. Le moteur s’appuie sur un référentiel contrôlé (programmes officiels) et des contenus validés. L’IA reformule et accompagne dans ces limites. Les modèles additionnels (comportement, vision) sont optionnels, consentis, et ne bloquent jamais l’usage sur ordinateur.

---

## 3. Stack technique imposée / recommandée

| Couche | Choix v1 | Notes |
|--------|----------|-------|
| Langage services IA | Python 3.11+ | Package `ai/` ou repo `popy-ai` (décision ADR-AI-001) |
| API exposition | Fastify existant (Node) appelle services Python **ou** routes TS d’abord | Sprint 0 tranche |
| Données | PostgreSQL + Prisma (déjà) | Chunks RAG en tables dédiées |
| Recherche v1 | Postgres `tsvector` / BM25 | Obligatoire avant embeddings |
| Recherche v2 | pgvector + embeddings | Seulement si recall insuffisant |
| LLM inference | API Mistral ou OpenAI **derrière interface** | Flag off en CI |
| Train NLP | PyTorch + PEFT/LoRA | GPU lab / Colab / machine école |
| Feature store v1 | Tables Postgres + exports Parquet | Pas de Kafka au début |
| Tracking expériences | MLflow **ou** dossier `experiments/` versionné | ADR-AI-002 |
| Versioning data | DVC **ou** releases Git LFS + cards | ADR-AI-003 |
| Eval | Scripts pytest + grilles Excel/Notion humaines | CI sur eval auto |
| Notebooks | `notebooks/` exploratoires → code promu en `src/` | Interdit de shipper la prod depuis un notebook seul |

**Décision sprint 0 (obligatoire, écrite) :** monorepo `PopyAcademy/ai/` vs repo séparé. Défaut recommandé : `ai/` dans le monorepo pour simplifier jusqu’à mars 2027.

---

## 4. Contrats de données (à figer avant tout modèle)

### 4.1 Chunk référentiel officiel

```json
{
  "id": "chunk_cm1_maths_fractions_01",
  "cycle": "3",
  "levels": ["CM1", "CM2"],
  "subject": "Mathématiques",
  "domain": "Nombres et calculs",
  "topic": "Fractions",
  "text": "…extrait structuré…",
  "source_type": "BO",
  "source_ref": "BO n°16 du 17 avril 2025",
  "source_url": "https://…",
  "version": "2025-04",
  "license": "Licence Ouverte / droit de citation pédagogique",
  "embedding_id": null
}
```

### 4.2 Contenu POPY ancré

```json
{
  "id": "content_frac_visuel_01",
  "official_competency_ids": ["comp_cm1_maths_frac_01"],
  "objective_popy": "Comprendre une fraction comme part d’un tout avec support visuel",
  "difficulty": "easy|standard|remediation",
  "modality": ["visual", "text", "audio?"],
  "exercise": "…",
  "hints": ["…"],
  "correction": "…",
  "explanation": "…",
  "adaptations": ["consigne_courte", "exemple_visuel"],
  "validation_status": "DRAFT|REVIEWED|INSTITUTIONAL",
  "validated_by": null,
  "language": "fr"
}
```

### 4.3 Contexte enfant minimisé (prompt)

```json
{
  "child_alias": "enfant_12a",
  "level": "CE2",
  "competency_id": "comp_…",
  "mastery_pct": 65,
  "known_difficulty_tags": ["consignes"],
  "effective_adaptation_tags": ["exemple_visuel"],
  "last_session_minutes": 12
}
```

Interdit dans le prompt : nom réel, école, diagnostic médical, carnet privé, messages famille.

### 4.4 Événement comportement

```json
{
  "event_id": "uuid",
  "ts": "ISO-8601",
  "device": "web|robot",
  "session_id": "uuid",
  "child_id_hash": "hmac…",
  "type": "activity_start|activity_success|activity_fail|hint_used|abandon|pause|resume",
  "payload": { "content_id": "…", "duration_ms": 12000, "attempt": 2 }
}
```

### 4.5 Réponse moteur `GroundedAnswer`

```json
{
  "answer_text": "…",
  "grounded": true,
  "intent": "programme",
  "sources": [
    { "chunk_id": "…", "source_ref": "BO …", "score": 0.82 }
  ],
  "content_ids": ["content_…"],
  "safety": { "refused": false, "reason": null },
  "model": { "llm": "none|mistral-…", "prompt_version": "pedagogy_v1" }
}
```

---

## 5. Calendrier global

| Période | Phase | Résultat attendu |
|---------|-------|------------------|
| 6 oct – 2 nov 2026 | Sprint 0–1 | Contrats, repo `ai/`, ADR, tracker |
| 3 nov – 14 déc 2026 | Sprint 2–4 | RAG stub + datasets v0 + events |
| 15 déc – 4 jan 2027 | Buffer / freeze noël | Doc + eval v0 |
| 5 jan – 29 mars 2027 | Sprint 5–10 | LLM grounded + behavior v1 + train lab |
| 30 mars – 31 mai 2027 | Sprint 11–14 | Intégration produit + train v2 + vision opt |
| 1–30 juin 2027 | Sprint 15 + soutenance | Freeze démo, dossier, métriques |

---

## 6. Découpage sprint par sprint

Légende estimation : **S** = Sonia, **PA** = Pierre-Alexis, **J/H** = jours-homme approximatifs.

---

### SPRINT 0 — 6→19 oct 2026 — Kickoff & socle

**Objectif :** être capables de travailler sans ambiguïté.

| ID | Owner | Tâche détaillée | Entrées | Sorties | Acceptation | Est. |
|----|-------|-----------------|---------|---------|-------------|------|
| S0-1 | S+PA | Kickoff 2h : lire ce plan + `PEDAGOGICAL_AI_PLAN.md` | Docs | Compte-rendu décisions | CR signé lead | 0.5 j |
| S0-2 | S+PA | ADR-AI-001 : emplacement code (`ai/` monorepo) | — | `docs/adr/AI-001.md` | Merge | 0.5 j |
| S0-3 | S+PA | Créer arborescence `ai/` (voir §8) | ADR | Dossiers + README | `pnpm`/`pytest` smoke | 1 j |
| S0-4 | S | Rédiger contrats §4.1–4.3 + 4.5 en JSON Schema | — | `ai/schemas/*.json` | Validés lead | 1.5 j |
| S0-5 | PA | Rédiger contrat §4.4 events + dictionnaire `type` | — | `ai/schemas/behavior_event.json` | Validé backend | 1 j |
| S0-6 | S+PA | Créer `AI_DATA_TRACKER.md` avec toutes les cases | Ce doc | Tracker | Lien roadmap | 0.5 j |
| S0-7 | S+PA | Figer métriques cibles (§14) avec lead | — | Section métriques gelée v1 | Validation écrite | 0.5 j |
| S0-8 | PA | Lister outils GPU/CPU disponibles (école/perso) | — | `ai/docs/infra_lab.md` | 1 page | 0.5 j |

**Revue de sprint :** démo = arborescence + 1 JSON Schema validé + tracker créé.

---

### SPRINT 1 — 20 oct→2 nov 2026 — Intent & garde-fous

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| S1-1 | S | Enum intents + règles de routing (table décision) | `ai/docs/intents.md` | 6 intents + exemples | 1 j |
| S1-2 | S | Pseudo-code orchestrateur (sans LLM) | `ai/src/orchestrator/flow.md` | Diagramme mermaid | 1 j |
| S1-3 | S | Message de refus standard (FR/EN/ES plus tard) | `ai/prompts/refuse_fr.txt` | Texte validé product | 0.5 j |
| S1-4 | S | 30 questions gold (10 programme, 10 aide, 10 piège) | `ai/eval/gold_v0.jsonl` | Review croisé PA | 2 j |
| S1-5 | PA | Spec pipeline ingest events (batch fichier d’abord) | `ai/docs/ingest_behavior.md` | Aligné §4.4 | 1 j |
| S1-6 | PA | Générateur synthétique d’événements (fake sessions) | `ai/tools/synth_sessions.py` | 1000 sessions | 2 j |
| S1-7 | PA | Draft AIPD vision (finalités / interdits) | `ai/docs/aipd_vision_draft.md` | Relu lead | 1.5 j |
| S1-8 | S+PA | Atelier 1h avec collab pédagogie (si dispo) : 5 compétences priorisées | CR | Liste CM1 maths + CE2 fr | 0.5 j |

**Revue :** lecture à voix haute d’un refus + 3 questions gold.

---

### SPRINT 2 — 3→16 nov 2026 — Ingestion référentiel

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| S2-1 | S | Choisir sources v1 (Éduscol maths cycle 2+3 + data.gouv si utile) | `ai/docs/sources_v1.md` | URLs + licences | 1 j |
| S2-2 | S | Script parse/structuration manuelle assistée → chunks JSONL | `ai/etl/official_to_chunks.py` | ≥ 80 chunks maths | 3 j |
| S2-3 | S | Table Prisma / SQL `official_chunks` (avec backend) | Migration | CRUD basique | 1 j (+backend) |
| S2-4 | S | Recherche full-text `search_official(q, level, subject)` | Module Python ou TS | Requête « fractions CM1 » top3 pertinents | 2 j |
| S2-5 | S | Tests unitaires retrieval | `ai/tests/test_retrieve_official.py` | 10 asserts | 1 j |
| S2-6 | PA | Tables `behavior_events` + job load synthétique | Migration + script | 10k events en base | 2 j |
| S2-7 | PA | Agrégats quotidiens (durée, fails, hints) | Vue SQL ou script | 1 dashboard CSV | 1.5 j |
| S2-8 | PA | Doc rétention events (90 j brut / 365 j agrégat — à valider) | Doc | Validé lead | 0.5 j |

**Revue :** live search « fractions » + graphique sessions synthétiques.

---

### SPRINT 3 — 17→30 nov 2026 — Contenus POPY ancrés + RAG stub API

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| S3-1 | S | Schéma contenu §4.2 en base (lien competency) | Migration / seed | 15 contenus seed | 2 j |
| S3-2 | S | `retrieve_contents(competency_id, tags)` | Service | Variante visuelle priorisée si tag | 1.5 j |
| S3-3 | S | Stub `POST /pedagogy/ask` (templates, grounded) | Endpoint | Tests Postman/Vitest | 2.5 j |
| S3-4 | S | Si 0 hit → `grounded:false` + refuse | Code | Test dédié | 0.5 j |
| S3-5 | S | Étendre gold à 50 items + script score stub | `eval/run_stub.py` | Rapport markdown | 1.5 j |
| S3-6 | PA | Feature engineering v0 : `engagement_score`, `abandon_rate` | Table `behavior_features` | Calcul reproductible | 2 j |
| S3-7 | PA | API interne `GET /children/:id/learning-context` (contrat) | Spec OpenAPI | Minimisation respectée | 1 j (+backend) |
| S3-8 | PA | Brancher features → hint pour retrieve contents (règle if/else) | Doc + code | Exemple Lina fractions | 1.5 j |

**Jalon fin nov :** RAG stub démo interne **sans LLM**.

---

### SPRINT 4 — 1→14 déc 2026 — Qualité, cards, freeze Noël

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| S4-1 | S | Dataset card `ds-rag-official` v0 | `ai/datasets/ds-rag-official/CARD.md` | Template complet | 1 j |
| S4-2 | S | Dataset card `ds-qa-grounded` v0 | idem | ≥50 items | 1 j |
| S4-3 | S | Prompt system v1 verrouillé | `ai/prompts/pedagogy_v1.md` | Review éthique | 1 j |
| S4-4 | S | Rapport anti-hallucination v0 | `ai/eval/reports/2026-12-stub.md` | Publié | 1 j |
| S4-5 | PA | Dataset card `ds-behavior` v0 | CARD | Synthétique documenté | 1 j |
| S4-6 | PA | Baseline TS : moyenne mobile maîtrise compétence | Notebook + fonction | RMSE baseline notée | 2 j |
| S4-7 | PA | Matrice risques vision/comportement | Doc | Top 10 risques | 1 j |
| S4-8 | S+PA | Présentation 20 min à l’équipe (état + besoins collabs) | Slides | Feedback intégré | 1 j |

**Freeze 15 déc–4 jan :** maintenance minimale, lecture papers / veille, pas de breaking change.

---

### SPRINT 5 — 5→18 jan 2027 — LLM derrière interface

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| S5-1 | S | Interface `LlmClient` (complete / complete_json) | Code | Mock en tests | 1 j |
| S5-2 | S | Adapter réel (Mistral **ou** OpenAI) + secrets env | Code | Flag `PEDAGOGY_LLM_ENABLED` | 1.5 j |
| S5-3 | S | Build prompt = system + SOURCES + CONTEXTE + QUESTION | Module | Aucun programme hors SOURCES | 2 j |
| S5-4 | S | Post-check : si intent programme et sources vides → refuse même si LLM parle | Guard | Test | 1 j |
| S5-5 | S | Logging : model id, prompt_version, chunk_ids (pas PII) | Audit | Conforme | 1 j |
| S5-6 | PA | Exporter learning_context réel depuis DB démo | Endpoint | Payload §4.3 | 1.5 j |
| S5-7 | PA | Définir labels comportement v1 (`engaged`, `struggling`, `needs_break`) | Doc annotation | Guide 2 pages | 1 j |
| S5-8 | PA | Annoter 200 sessions synthétiques | Fichier labels | Accord inter-annotateur noté | 2 j |

**Revue :** même question avec stub vs LLM ; sources identiques.

---

### SPRINT 6 — 19 jan→1 fév 2027 — Intent model + rewrite

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| S6-1 | S | Dataset intents (≥300 phrases) | `ds-intent` | Card | 2 j |
| S6-2 | S | Classifieur intent (mini LM ou logreg+embeddings) | Modèle v1 | F1 macro ≥ 0.75 | 3 j |
| S6-3 | S | Pipeline rewrite consigne (LLM contraint + validation) | Service | 30 exemples validés pédagogie | 2 j |
| S6-4 | S | Intégration front : contrat réponse pour chat (avec collab front) | Spec UI sources | Maquette OK | 1 j |
| S6-5 | PA | Classifier comportement v1 (sklearn/pytorch léger) | Modèle | F1 ≥ 0.70 sur holdout | 3 j |
| S6-6 | PA | Service `predict_behavior(session_features)` | API | Latence < 100ms CPU | 1.5 j |
| S6-7 | PA | Règle : `needs_break` → suggestion pause (pas diagnostic) | Mapping | Textes validés | 1 j |

**Jalon fin jan :** `POST /pedagogy/ask` grounded + sources affichables.

---

### SPRINT 7 — 2→15 fév 2027 — Remédiation & premier train NLP lab

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| S7-1 | S | Taxonomie erreurs (calcul, consigne, transfert…) | Doc | ≥ 8 types | 1 j |
| S7-2 | S | Dataset `ds-remediation` (≥100 paires) | JSONL + card | Review humain 20% | 2.5 j |
| S7-3 | S | Prep fine-tune : format chat JSONL, split 80/10/10 | `ai/train/nlp/` | Scripts | 1.5 j |
| S7-4 | S | **Lab LoRA #1** sur `ds-qa-grounded` + `ds-rewrite` (petit modèle) | Checkpoint lab | Card modèle + métriques vs baseline RAG-only | 3 j |
| S7-5 | S | Décision go/no-go adapter en préprod | ADR-AI-010 | Écrit | 0.5 j |
| S7-6 | PA | Features TS avancées (tendance 7j, volatilité réussite) | Code | Doc | 2 j |
| S7-7 | PA | Modèle forecast maîtrise (baseline → ARIMA/Prophet/simple NN) | Expérience | RMSE < baseline | 3 j |
| S7-8 | PA | Branchement forecast → planning enseignant (spec) | Spec API | Validé product | 1 j |

---

### SPRINT 8 — 16 fév→1 mars 2027 — Embeddings v2 si besoin + eval humaine

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| S8-1 | S | Mesurer recall@5 full-text sur 50 queries | Rapport | Chiffre | 1 j |
| S8-2 | S | Si recall < 0.7 : embeddings + pgvector | Migration + index | Recall ≥ 0.8 | 3 j |
| S8-3 | S | Grille eval humaine (clarté, exactitude, ton, ancrage) | `ai/eval/human_grid.md` | Utilisée | 1 j |
| S8-4 | S | Campagne eval 30 réponses (Sonia + 1 enseignant si dispo) | Rapport | Score moyen noté | 2 j |
| S8-5 | PA | Durcir privacy : hash child_id, purge job | Scripts | Test purge | 2 j |
| S8-6 | PA | Simulation charge 100 events/s (local) | Rapport | Pas de perte | 1.5 j |
| S8-7 | PA | Spec vision v1 **non identitaire** (ex. présence zone, geste UI) | Spec | AIPD update | 2 j |

---

### SPRINT 9 — 2→15 mars 2027 — Intégration app PC

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| S9-1 | S | Pairing collab front : brancher chat « Parler à Popy » | PR front+api | Démo enfant | 3 j |
| S9-2 | S | Affichage sources sous la réponse | UI | Visible mobile | 1 j |
| S9-3 | S | Mode offline : pas d’IA réseau, message clair + packs locaux | Comportement | Test offline | 1.5 j |
| S9-4 | S | Aide aux devoirs : intent `aide` + content retrieve | Flux | 5 scénarios E2E | 2 j |
| S9-5 | PA | Émettre behavior_events depuis front (avec collab front) | SDK léger `track()` | Events en base | 2.5 j |
| S9-6 | PA | Dashboard interne métriques engagement (CSV/Metabase/simple page) | Outil | 5 KPI | 2 j |
| S9-7 | PA | Alerte soft enseignant « beaucoup d’abandons cette semaine » | Spec + prototype | Pas de diagnostic | 1.5 j |

**Jalon fin mars :** NLP flaggable en « prod démo » + behavior pipeline v1.

---

### SPRINT 10 — 16→29 mars 2027 — Durcissement & dette

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| S10-1 | S | Gold eval → 150 items | Dataset | CI | 2 j |
| S10-2 | S | Red team : jailbreak « ignore les sources » | Rapport | Guards tiennent | 2 j |
| S10-3 | S | Documentation API pedagogy complète | OpenAPI | Relue backend | 1 j |
| S10-4 | PA | Behavior model v1 → calibration seuils | Config | Precision/recall tradeoff choisi | 2 j |
| S10-5 | PA | Notebooks → modules production | Refactor | 0 logique critique hors src | 2 j |
| S10-6 | S+PA | Revue dette technique IA (liste priorisée) | Backlog | Top 10 | 1 j |

---

### SPRINT 11 — 30 mars→12 avr 2027 — Train NLP v2 + contents scale

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| S11-1 | S | Monter `ds-qa-grounded` à ≥300 (avec pédagogie) | Dataset | Card | 3 j |
| S11-2 | S | LoRA #2 / adapter amélioré | Checkpoint | Bat baseline LoRA#1 | 3 j |
| S11-3 | S | Eval auto + humaine comparative | Rapport | Décision déploiement | 2 j |
| S11-4 | PA | `ds-behavior` enrichi (plus de patterns) | Dataset | Card | 2 j |
| S11-5 | PA | Behavior model v2 train | Checkpoint | F1 > v1 | 3 j |
| S11-6 | PA | Prototype vision offline (dataset public ou synthétique **non facial ID**) | Proto | Démo lab | 3 j |

---

### SPRINT 12 — 13→26 avr 2027 — Vision opt-in & robot parity

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| S12-1 | PA | Définir flag `VISION_ENABLED` default false | Config | PC inchangé si off | 1 j |
| S12-2 | PA | Pipeline méta-événements vision (pas média brut) | API | Conforme spec robot | 2 j |
| S12-3 | PA | Tests : app complète avec vision off | Checklist | 100% parcours OK | 1 j |
| S12-4 | S | Même endpoint pedagogy pour client « robot » (header device) | API | Parité réponses | 1.5 j |
| S12-5 | S | Contexte conversationnel court (mémoire session bornée) | Module | Max N tours, purge | 2 j |
| S12-6 | S | Multilingue FR prioritaire ; EN/ES reformulation si temps | Support | FR parfait | 2 j |
| S12-7 | S+PA | Atelier sécurité modèles (prompt injection, data leak) | CR | Actions | 1 j |

---

### SPRINT 13 — 27 avr→10 mai 2027 — Forecast & enseignant

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| S13-1 | PA | API forecast maîtrise 2 semaines | Endpoint | Doc erreur | 2.5 j |
| S13-2 | PA | Intégration spec rapports enseignant | Spec UI data | Validé | 1.5 j |
| S13-3 | S | Mode enseignant : prévisualiser réponse IA avant envoi | Flux | Flag teacher | 2.5 j |
| S13-4 | S | Export « pourquoi cette réponse » (sources + content) | JSON | Transparent | 1.5 j |
| S13-5 | S | Coverage référentiel : maths+français CP–CM2 chunkés | Rapport couverture | Trous listés | 3 j |
| S13-6 | PA | Stress rétention / GDPR delete impact features | Test | OK | 1.5 j |

---

### SPRINT 14 — 11→31 mai 2027 — Freeze modèles démo

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| S14-1 | S | Freeze prompt_version + model ids démo | `MODEL_FREEZE.md` | Tags git | 1 j |
| S14-2 | S | Pack démo 12 scénarios scriptés (questions/réponses) | Script démo | Répétable | 2 j |
| S14-3 | PA | Freeze behavior/vision flags pour démo | Config | Documenté | 1 j |
| S14-4 | PA | Vidéo / notes : PC only vs PC+robot | Doc | 1 page | 1 j |
| S14-5 | S+PA | Rapport métriques finals vs cibles §14 | PDF/MD | Écarts expliqués | 2 j |
| S14-6 | S+PA | Répétition soutenance technique 30 min | CR | Feedback | 1 j |
| S14-7 | S+PA | Buffer bugs critiques uniquement | — | Liste fermée | 3 j |

---

### SPRINT 15 — juin 2027 — Livraison & dossier

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| S15-1 | S+PA | Dossier IA complet (archi, datasets, train, éthique, limites) | `docs/DOSSIER_IA_JUIN2027.md` | Relu lead | 4 j |
| S15-2 | S | Chapitre NLP + RAG + entraînement | Inclus dossier | — | 2 j |
| S15-3 | PA | Chapitre big data, TS, comportement, vision | Inclus dossier | — | 2 j |
| S15-4 | S+PA | Liste « post-juin » (scale, multi-académies, GPU prod) | Roadmap | Priorisée | 1 j |
| S15-5 | S+PA | Soutenance / démo finale | — | Checklist scénarios verts | 2 j |
| S15-6 | S+PA | Handover : comment relancer eval, train, flags | `ai/README.md` final | Un tiers peut rejouer | 1 j |

---

## 7. Programme d’entraînement (détail opérationnel)

### 7.1 Phases training

| Phase | Quand | Quoi | Qui | GPU |
|-------|-------|------|-----|-----|
| T0 | Nov–déc 2026 | Pas de fine-tune ; collect only | S+PA | Non |
| T1 Lab | Fév 2027 | LoRA #1 petit modèle instruct FR | Sonia | Oui lab |
| T2 Lab | Avr 2027 | LoRA #2 + behavior v2 | S + PA | Oui |
| T3 Freeze | Mai 2027 | Gel checkpoints démo | S+PA | Non |
| T4 Prod scale | Post-juin | Hors scope juin | — | — |

### 7.2 Recette LoRA NLP (Sonia) — checklist à suivre à chaque run

1. Vérifier cards datasets à jour + split figé (seed).  
2. Baseline : RAG stub + LLM API sans adapter (métriques).  
3. Lancer train (documenter : modèle base, rank LoRA, lr, epochs, batch, max_len).  
4. Eval automatique `gold` (grounding, refus, BLEU/COMET optionnel, exactitude sources).  
5. Eval humaine ≥ 20 items (grille).  
6. Comparer à baseline ; **n’accepter** que si grounding ≥ baseline et utilité ↑.  
7. Enregistrer card modèle : `ai/models/<name>/CARD.md`.  
8. Déployer derrière flag ; rollback = désactiver flag.

### 7.3 Recette classifieur comportement (Pierre-Alexis)

1. Features figées + schéma version `features_vX`.  
2. Split temporel (pas de fuite futur→passé).  
3. Metrics : precision/recall par classe ; coût faux positif `needs_break`.  
4. Seuils calibrés sur validation.  
5. Test : désactiver modèle → app fonctionne.  
6. Card modèle + matrice de confusion dans le rapport.

### 7.4 Hyperparamètres — plages de départ (à ajuster, pas dogme)

| Modèle | Plage départ |
|--------|----------------|
| LoRA rank | 8–16 |
| LoRA alpha | 16–32 |
| LR | 1e-4 – 2e-4 |
| Epochs | 1–3 (early stop) |
| Max seq | 2048 (ou limité par GPU) |
| Classif behavior | Logistic / LightGBM / petit MLP d’abord |

---

## 8. Arborescence cible du code IA

```
ai/
  README.md
  pyproject.toml
  schemas/
  prompts/
  etl/
  src/
    retrieve/
    orchestrator/
    llm/
    intent/
    behavior/
    vision/
    forecast/
  train/
    nlp/
    behavior/
  datasets/
    ds-rag-official/
    ds-qa-grounded/
    ds-rewrite/
    ds-remediation/
    ds-intent/
    ds-behavior/
  models/
  eval/
    gold/
    reports/
  notebooks/
  docs/
    adr/
    cards_templates/
```

---

## 9. Definition of Done par type de livrable

### Endpoint
- [ ] Spec OpenAPI  
- [ ] Tests auto  
- [ ] Logs sans PII  
- [ ] Flag / config  
- [ ] Doc « comment tester en local »  

### Dataset
- [ ] CARD.md (origine, licence, volume, splits, risques)  
- [ ] Schéma validé  
- [ ] Script de rebuild  
- [ ] Version taguée  

### Modèle
- [ ] CARD.md (data, métriques, intended use, out-of-scope)  
- [ ] Baseline comparée  
- [ ] Flag déploiement  
- [ ] Procédure rollback  

### Expérience train
- [ ] Commande exacte reproductible  
- [ ] Seeds  
- [ ] Artefacts listés  
- [ ] Conclusion go/no-go  

---

## 10. Rituals & reporting (pour que tu puisses manager)

### Hebdomadaire (30–45 min) Sonia ↔ Pierre-Alexis
- Avancement IDs du sprint  
- Bloqueurs (surtout dépendances autres collabs)  
- Risques éthique / data  
- Démo 5 min si possible  

### Bi-hebdomadaire avec toi (lead)
- Burndown sprint  
- Besoins envers les 5 autres  
- Décisions ADR en attente  

### Mensuel éthique
- Revue AIPD  
- Incidents prompts / fuites  
- Nouveaux types de données  

### Format statut (à t’envoyer chaque vendredi)

```
Sprint: …
Done: Sx-y, …
In progress: …
Blocked: … (attente: collab X)
Demo: oui/non — lien
Risks: …
Next week: …
```

---

## 11. Matrice RACI (extrait)

| Activité | Sonia | PA | Lead | Backend | Front | Pédagogie |
|----------|-------|----|------|---------|-------|-----------|
| Contrats schemas | A/R | C | C | C | I | C |
| Chunks officiels | R | C | A | C | I | C |
| Contenus exercices | C | I | A | I | I | R |
| Endpoint ask | R | C | A | R | C | I |
| Events tracking | C | R | A | C | R | I |
| LoRA NLP | R | C | A | I | I | C |
| Behavior model | C | R | A | C | I | I |
| Vision | I | R | A | C | I | I |
| Dossier juin | R | R | A | C | C | C |

R = Responsible, A = Accountable, C = Consulted, I = Informed

---

## 12. Dépendances critiques (à surveiller)

| Si ceci glisse… | Impact | Mitigation |
|-----------------|--------|------------|
| Backend indispo | Pas d’API | Stub local FastAPI dans `ai/` |
| Pédagogie sans contenus | RAG contenus vide | Contenu synthétique labellisé DRAFT |
| Front en retard | Pas de démo chat | Client CLI `ai/tools/ask_cli.py` |
| Pas de GPU | Pas de LoRA | Rester RAG + LLM API ; LoRA reporté |
| Robot absent | Vision terrain impossible | PC first ; vision lab only |

---

## 13. Risques détaillés & contremesures

| ID | Risque | Proba | Impact | Contremesure | Owner |
|----|--------|-------|--------|--------------|-------|
| R1 | Hallucination programme | H | H | Retrieval obligatoire + tests piège | S |
| R2 | Contenu insuffisant | H | M | Prioriser maths/fr ; DRAFT synthétique | S+pédagogie |
| R3 | Scope vision trop large | M | H | Interdits écrits ; flag off | PA |
| R4 | PII dans prompts | M | H | Schema minimisé + review logs | S+PA |
| R5 | Sur-promesse fine-tune | M | M | Go/no-go ADR ; baseline RAG | S |
| R6 | Désalignement 7 collabs | H | H | §19 + sync bi-hebdo | Lead |
| R7 | Dette notebooks | M | M | Sprint 10 refactor | PA |

---

## 14. Métriques cibles (v1 — à figer en Sprint 0)

| Métrique | Cible mars 2027 | Cible juin 2027 |
|----------|-----------------|-----------------|
| % réponses `programme` avec source valide | ≥ 90 % | ≥ 95 % |
| % refus corrects hors référentiel | ≥ 85 % | ≥ 90 % |
| Note humaine utilité (1–5) | ≥ 3.5 | ≥ 4.0 |
| Latence p95 `/pedagogy/ask` (sans cold start) | < 4 s | < 3 s |
| F1 intent | ≥ 0.75 | ≥ 0.80 |
| F1 behavior (macro) | ≥ 0.70 | ≥ 0.75 |
| Parcours enfant PC sans vision/robot | 100 % | 100 % |
| Incidents PII logs | 0 | 0 |

---

## 15. Scénarios de démo obligatoires (juin 2027)

1. Enfant sur PC : « Qu’est-ce que je dois savoir sur les fractions en CM1 ? » → sources BO.  
2. Question piège hors programme → refus poli.  
3. Proposition d’exercice adapté (visuel) selon profil.  
4. Aide après erreur (remédiation).  
5. Mode offline : message clair, activité locale.  
6. Enseignant prévisualise une réponse.  
7. (Option) Robot reprend la même compétence.  
8. (Option) Vision off : rien ne casse.

Chacun a un **script** dans `ai/eval/demo_scripts/`.

---

## 16. Livrables documentaires finaux (checklist)

- [ ] `DOSSIER_IA_JUIN2027.md`  
- [ ] ADR AI-001…AI-010+  
- [ ] Cards datasets (toutes)  
- [ ] Cards modèles déployés  
- [ ] Rapports eval (stub, LLM, LoRA, behavior)  
- [ ] AIPD vision + note éthique NLP  
- [ ] OpenAPI pedagogy / signals  
- [ ] `MODEL_FREEZE.md`  
- [ ] Handover README  

---

## 17. Onboarding 48h (pour Sonia & Pierre-Alexis)

**Jour 1**
- Cloner repo, lire ce plan §§1–4  
- Lire `PEDAGOGICAL_AI_PLAN.md`  
- Installer toolchain Python  
- Poser 10 questions au lead  

**Jour 2**
- Valider ADR-AI-001  
- Créer tracker  
- Produire 1 schema JSON chacun  
- Planifier Sprint 1 dans l’outil de tâches (GitHub Projects / Notion)

---

## 18. Ce que TU leur dis concrètement (brief manager)

> Vous êtes responsables du moteur IA/data jusqu’à juin 2027.  
> Vous ne codez pas toute l’app : vous livrez retrieval, orchestration, modèles, datasets, eval, éthique.  
> L’IA ne doit jamais inventer le programme.  
> L’entraînement fine-tune est autorisé seulement sur données POPY validées, après RAG solide.  
> Le PC doit marcher sans robot ni vision.  
> Vous avancez en sprints de 2 semaines, avec IDs cochés, démo à chaque revue, statut vendredi.  
> Ce plan sera mis à jour dès que les 5 autres collaborateurs sont mappés.

---

## 19. Mapping 7 collaborateurs (À COMPLÉTER)

| # | Nom | Domaine | Points de contact avec Sonia/PA | Statut |
|---|-----|---------|----------------------------------|--------|
| 1 | Sonia | NLP / RAG | — | Assigné |
| 2 | Pierre-Alexis | Vision / TS / comportement | — | Assigné |
| 3 | **Erwan** | Hardware | Parité device, signaux — `PLAN_HARDWARE_ERWAN_THEO.md` | Assigné |
| 4 | **Théo** | Firmware / IoT | Agent, events meta | Assigné |
| 5 | **Mériem** | Cloud / infra | Déploiement préprod, secrets LLM env — `PLAN_CLOUD_CYBER_MERIEM_FABIO.md` | Assigné |
| 6 | **Fabio** | Cybersécurité | Logs prompts, isolation clés — `PLAN_CLOUD_CYBER_MERIEM_FABIO.md` | Assigné |
| 7 | **Yacine** | RGPD / privacy | AIPD, consentements, bases légales IA — `PLAN_RGPD_YACINE.md` | Assigné |

*Dès que les noms sont connus : dupliquer les lignes de dépendances dans chaque sprint (colonne « Attente collab »).*

---

## 20. Historique

| Version | Date | Changement |
|---------|------|------------|
| 1.0 | 2026-10-06 | Plan initial synthétique |
| 2.0 | 2026-10-06 | Version détaillée : sprints, contrats, training, RACI, métriques, DoD, brief manager |
| 2.1 | 2026-10-06 | **§0 État des lieux** : existant repo / API / front / docs vs à créer |

---

**Prochaine action lead :** kickoff 2h avec Sonia & Pierre-Alexis + création de `AI_DATA_TRACKER.md` à partir des IDs de ce document.
