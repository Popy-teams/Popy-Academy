# Dataset Card — `ds-popy-contents` (v0)

## 1. Description du Dataset
* **Nom du dataset :** `ds-popy-contents`
* **Version :** `v0` (novembre 2026)
* **Finalité :** Banque d'exercices, leçons et remédiations POPY Academy (Base B du RAG) ancrés sur les compétences officielles.
* **Volume v0 :** 15 contenus pédagogiques
  - **CM1 Mathématiques (Fractions & Décimaux) :** 12 contenus (partage, vocabulaire, unité, décomposition, demi-droite graduée, comparaison, addition, conversion décimale, problèmes).
  - **CE2 Français (Étude de la langue) :** 3 contenus (verbe et négation, accord sujet-verbe pluriel, accord adjectif dans le GN).

## 2. Structure & Attributs
Chaque enregistrement respecte strictement le contrat [ai/schemas/popy_content.json](../../schemas/popy_content.json) :
- `id` : identifiant normalisé.
- `official_competency_ids` : identifiant de la compétence institutionnelle rattachée (ex: `comp_c3_maths_frac_sens`).
- `objective_popy` : formulation de l'objectif pour l'enfant.
- `difficulty` : `easy`, `standard` ou `remediation`.
- `modality` : `visual`, `text`, `interactive`.
- `exercise` : consigne d'activité.
- `hints` : indices progressifs sans spoiler.
- `correction` & `explanation` : solution et feedback bienveillant.
- `adaptations` : tags d'accessibilité (`exemple_visuel`, `consigne_courte`, `decoupage_etapes`).
- `validation_status` : `REVIEWED` (garanti par l'équipe pédagogique).
- `language` : `fr`.

## 3. Conformité & Éthique
- Textes 100 % originaux et adaptés à l'âge des enfants.
- Zéro donnée personnelle.

