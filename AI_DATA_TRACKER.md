# Suivi IA & Données — Popy Academy (AI & Data Tracker)

> **Document de suivi opérationnel** — Aligné sur `PLAN_IA_SONIA_PIERRE_ALEXIS.md` et `RoadmapDatesAnonymePopy.pdf`.  
> **Légende :** `[ ]` À faire · `[-]` En cours · `[x]` Livré & Validé · `[!]` Bloqué

---

## Synthèse Roadmap Accélérée

| Phase | Dates | Thème | Statut |
|---|---|---|---|
| **Phase 1** | Ven 6 nov. – Ven 13 nov. | **Fondations et Contrats** | **[x] Livré** |
| **Phase 2** | Ven 13 nov. – Ven 20 nov. | Matière première & Infra | [ ] À venir |
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

## Prochaine étape : Phase 2 (Semaine 2 : 13 nov. – 20 nov.)
- [ ] Extraire et découper les programmes Éduscol (Maths CM1 / Fractions) en JSONL (`ai/etl/official_to_chunks.py`).
- [ ] Créer les tables PostgreSQL Prisma (`official_chunks`).
- [ ] Initialiser la recherche textuelle (`tsvector`) dans PostgreSQL.

