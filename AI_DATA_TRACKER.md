# Suivi IA & Données — Popy Academy (AI & Data Tracker)

> **Document de suivi opérationnel** — Aligné sur `PLAN_IA_SONIA_PIERRE_ALEXIS.md` et `RoadmapDatesAnonymePopy.pdf`.  
> **Légende :** `[ ]` À faire · `[-]` En cours · `[x]` Livré & Validé · `[!]` Bloqué

---

## Synthèse Roadmap Accélérée

| Phase | Dates | Thème | Statut |
|---|---|---|---|
| **Phase 1** | Ven 6 nov. – Ven 13 nov. | **Fondations et Contrats** | **[x] Livré** |
| **Phase 2** | Ven 13 nov. – Ven 20 nov. | Matière première & Infra | **[x] Livré** |
| **Phase 3** | Ven 20 nov. – Ven 27 nov. | Moteur de recherche « à vide » (Stub) | [ ] À venir |
| **Phase 4** | Ven 27 nov. – Ven 4 déc. | Injection de l'Intelligence (LLM) | [ ] À venir |
| **Phase 5** | Ven 4 déc. – Ven 11 déc. | Intégration Finale (Chat & Events) | [ ] À venir |

---

## Phase 1 : Fondations et Contrats (Semaine 1 : 6 nov. – 13 nov.)

### Livrables communs & NLP / RAG / Données (Sonia)
- [x] **Arborescence `ai/`** conforme au §8 du plan (`schemas/`, `prompts/`, `eval/`, `src/`, `datasets/`, `models/`, `etl/`).
- [x] **Figer les schémas JSON** dans `ai/schemas/` :
  - [x] `behavior_event.json` (v1.2 — événement comportemental et télémétrie RAG).
  - [x] `official_chunk.json` (contrat extrait BO / Éduscol).
  - [x] `popy_content.json` (contrat contenu & exercices ancrés).
  - [x] `child_learning_context.json` (contexte enfant minimisé, zéro PII).
  - [x] `pedagogy_query.json` (payload requête `POST /pedagogy/ask`).
  - [x] `grounded_answer.json` (réponse moteur sourcée `grounded: true/false`).
- [x] **Refus standards anti-hallucination** :
  - [x] `ai/prompts/refuse_fr.txt` (modèles de refus pour hors programme, absence de source, aide sans triche, sécurité, jailbreak).
  - [x] `ai/docs/intents.md` (table de décision des intentions et règles de routage).
- [x] **Jeu de test Gold Dataset** :
  - [x] `ai/eval/gold_v0.jsonl` (40 questions annotées couvrant le programme CM1 maths / fractions, CE2 français, aide aux devoirs et pièges hors-programme).

---

## Phase 2 : Matière Première et Infra (Semaine 2 : 13 nov. – 20 nov.)
- [x] **Sources v1 cadrées** : [ai/docs/sources_v1.md](ai/docs/sources_v1.md) (Éduscol BO n°31, URLs vérifiées, licence Etalab, stratégie versioning et procédure de veille).
- [x] **Pipeline ETL d'extraction & découpage** : [ai/etl/official_to_chunks.py](ai/etl/official_to_chunks.py) (script avec validation automatique de schéma).
- [x] **Dataset officiel v0 produit** : [ai/datasets/ds-rag-official/chunks_v0.jsonl](ai/datasets/ds-rag-official/chunks_v0.jsonl) (20 chunks structurés CM1 fractions/décimaux + CE2) et sa [CARD.md](ai/datasets/ds-rag-official/CARD.md).
- [x] **Moteur de recherche textuelle v1** : [ai/src/retrieve/search_official.py](ai/src/retrieve/search_official.py) (scoring pondéré, stemmer français, filtrage strict par niveau et discipline).
- [x] **Tests unitaires de retrieval (10/10 assertions passées)** : [ai/tests/test_retrieve_official.py](ai/tests/test_retrieve_official.py) (validation des hits CM1/CE2, filtrage par niveau et blocage anti-hallucination à 0 hit).
- [x] **Création des modèles Prisma & tables PostgreSQL** : `official_chunks` et `behavior_events` dans [backend/prisma/schema.prisma](backend/prisma/schema.prisma).
- [x] **Migration SQL avec index plein-texte `tsvector`** : [backend/prisma/migrations/20261113123000_ai_official_chunks_and_behavior_events/migration.sql](backend/prisma/migrations/20261113123000_ai_official_chunks_and_behavior_events/migration.sql) (indexation GIN en français).
- [x] **Génération du seed SQL d'insertion** : [ai/etl/generate_sql_seed.py](ai/etl/generate_sql_seed.py) -> [backend/prisma/seed_official_chunks.sql](backend/prisma/seed_official_chunks.sql) (20 chunks prêts à être injectés dans PostgreSQL).

---

## Prochaine étape : Phase 3 (Semaine 3 : 20 nov. – 27 nov.)
- [ ] Relier les exercices POPY aux compétences officielles.
- [ ] Ouvrir l'API POST `/pedagogy/ask` avec un bouchon statique (Stub).
- [ ] Valider la récupération (RAG stub) locale sans LLM.

