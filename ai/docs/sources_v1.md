# Sources Officielles v1 — Référentiel Pédagogique POPY

> **Statut :** Validé pour la Phase 2 (Ingestion & RAG Prototype)  
> **Auteur :** Sonia (NLP / RAG / Données)  
> **Licence globale :** Licence Ouverte / Open Licence version 2.0 (Etalab) — République Française

---

## 1. Pourquoi ce document ?

Le principe directeur non négociable de POPY Academy stipule :
> *POPY n'entraîne pas son IA sur Internet pour inventer le programme. Son moteur s'appuie sur un référentiel contrôlé issu des programmes officiels et des contenus validés.*

Pour que notre système RAG ne souffre d'aucune ambiguïté juridique ou pédagogique, chaque information ingérée doit :
1. Provenir d'une source institutionnelle vérifiable (Ministère de l'Éducation Nationale et de la Jeunesse — MENJ / Éduscol) ;
2. Respecter une licence de réutilisation libre (*Licence Ouverte v2.0*) ;
3. Être explicitement référencée par une URL pérenne et un millésime officiel (`source_ref`, `version`).

---

## 2. Périmètre ciblé pour le Prototype (v1)

Pour garantir une ingestion rigoureuse et facilement évaluable sans saturer la base de données, la Phase 2 se concentre sur **deux sources de vérité institutionnelles** :

### Source A — Cœur du prototype : Mathématiques Cycle 3 (Niveau CM1)
* **Discipline :** Mathématiques
* **Cycle & Niveau :** Cycle 3 (CM1 — classe de consolidation)
* **Domaine prioritaire :** **Nombres et calculs**
* **Sous-thématique clé :** **Fractions simples et nombres décimaux**
* **Document de référence :** *Programme d'enseignement du cycle de consolidation (cycle 3) — Mathématiques*.
* **Référence officielle :** Bulletin Officiel n° 16 du 17 avril 2025 (portant la mention **« NOUVEAU »** sur le portail Éduscol).
* **Version :** `2025-04`
* **URL institutionnelle :** [https://eduscol.education.gouv.fr/4356/enseigner-au-cycle-3](https://eduscol.education.gouv.fr/4356/enseigner-au-cycle-3)
* **Attendu institutionnel visé :**
  - Utiliser et représenter les fractions simples (demis, tiers, quarts, dixièmes, centièmes).
  - Partager une grandeur ou une collection en parts égales.
  - Établir le lien entre fractions décimales et nombres décimaux (écriture à virgule).

---

### Source B — Niveau de contraste : Français Cycle 2 (Niveau CE2)
* **Discipline :** Français (Étude de la langue)
* **Cycle & Niveau :** Cycle 2 (CE2 — fin de cycle des apprentissages fondamentaux)
* **Domaine prioritaire :** **Étude de la langue (Grammaire, Orthographe, Vocabulaire)**
* **Sous-thématique clé :** **Identification du verbe, de son sujet, et accords dans le groupe nominal**
* **Document de référence :** *Programme d'enseignement du cycle des apprentissages fondamentaux (cycle 2)* & *Repères de progression CE2*.
* **Référence officielle :** Bulletin Officiel n° 31 du 30 juillet 2020 (NOR : MENE2018712A).
* **URL institutionnelle :** [https://eduscol.education.gouv.fr/4355/enseigner-au-cycle-2](https://eduscol.education.gouv.fr/4355/enseigner-au-cycle-2)
* **Attendu institutionnel visé :**
  - Identifier le verbe conjugué dans une phrase simple et fournir son infinitif.
  - Maîtriser les accords en nombre dans le groupe nominal (déterminant + nom + adjectif).

---

## 3. Cadre Juridique & Licence

Toutes les données extraites sont publiées par l'État français sous la **Licence Ouverte v2.0 (Etalab)** :
- **Autorisation :** Reproduction, distribution, adaptation, extraction et exploitation commerciale ou non commerciale.
- **Obligation :** Mention de la paternité de la source dans chaque réponse pédagogique :
  - `source_ref` : *Ministère de l'Éducation Nationale — BO n°31 du 30 juillet 2020*.
  - Présence dans le contrat [official_chunk.json](../schemas/official_chunk.json) de la mention légale.

---

## 4. Règles de structuration pour le script ETL (`official_to_chunks.py`)

Chaque fragment issu de ces textes devra obligatoirement renseigner les champs suivants :
1. `id` : convention normalisée, ex. `chunk_cm1_maths_fractions_01`, `chunk_ce2_fr_verbe_01`.
2. `cycle` : `"2"` ou `"3"`.
3. `levels` : `["CM1"]` ou `["CE2"]`.
4. `subject` : `"Mathématiques"` ou `"Français"`.
5. `domain` : `"Nombres et calculs"` ou `"Étude de la langue"`.
6. `topic` : `"Fractions"`, `"Nombres décimaux"`, `"Le verbe"`, etc.
7. `text` : Texte exact institutionnel (attendus de progression, formulés avec clarté).
8. `source_type` : `"BO"`.
9. `source_ref` : `"BO n°31 du 30 juillet 2020"`.
10. `source_url` : URL institutionnelle pérenne Éduscol.
11. `version` : `"2020-07"`.
12. `license` : `"Licence Ouverte v2.0 (Etalab)"`.

---

## 5. Pourquoi un pipeline ETL ? Existe-t-il une API Éduscol ?

* **Pas d'API REST directe sur Éduscol :** Éduscol est un portail éditorial CMS du Ministère de l'Éducation Nationale. Il ne propose pas d'API REST publique structurée renvoyant les programmes sous forme d'arbre JSON ou de compétences directement requêtables.
* **Format des publications de l'État :** Les programmes officiels sont publiés sous forme d'arrêtés au Bulletin Officiel (BO), de décrets au Journal Officiel et de guides pédagogiques en PDF / HTML.
* **Rôle central de notre module `ai/etl/` :**
  C'est précisément la raison pour laquelle nous construisons notre script ETL (`official_to_chunks.py`). Il fait le pont entre les documents textuels ministériels et notre moteur de recherche : il ingère les textes institutionnels, les découpe sémantiquement selon nos critères pédagogiques et alimente la base de données PostgreSQL de POPY.
  C'est ensuite **POPY qui expose sa propre API interne** (`GET /curriculum/tree`, `GET /curriculum/search`, `POST /pedagogy/ask`).

---

## 6. Gestion des mises à jour des programmes (Stratégie de Versioning)

Le Ministère fait évoluer les programmes périodiquement (ex. ajustements 2018, 2020, ou réformes 2024/2025). Pour gérer cette temporalité sans casser le système :

1. **Traçabilité stricte par chunk (`version` et `source_ref`) :**
   Chaque enregistrement en base porte un champ `version` (ex. `"2020-07"`) et une référence de texte (`source_ref`).
2. **Gestion du cycle de vie (Actif vs Archivé) :**
   Lorsqu'un arrêté ministériel remplace un texte précédent :
   - Les anciens chunks ne sont pas supprimés : ils sont marqués comme archivés (`is_active: false` ou date de fin de validité).
   - Les nouveaux chunks sont insérés avec leur nouveau millésime et marqués actifs (`is_active: true`).
3. **Filtre par défaut dans le RAG :**
   Le moteur RAG interroge par défaut uniquement les chunks ayant le statut actif pour l'année scolaire en cours.
4. **Auditabilité et reproductibilité :**
   Si un litige pédagogique ou une question d'évaluation survient, la réponse de POPY conserve la référence exacte de la version utilisée au moment de la génération (grâce au tableau `sources` du schéma `grounded_answer.json`).

---

## 7. Procédure de Veille & Détection des Mises à Jour (Comment sait-on quand mettre à jour ?)

Pour ne pas dépendre d'une vérification manuelle aléatoire, la détection des changements de programmes s'articule autour de trois piliers opérationnels :

### 7.1 Veille automatisée (Alerting technique & Détection de la pastille « NOUVEAU »)
* **Détection du marqueur sémantique « NOUVEAU » sur Éduscol :**  
  Le portail Éduscol appose explicitement la mention textuelle et le badge **`NOUVEAU`** dans son tableau récapitulatif dès qu'une discipline fait l'objet d'un nouvel arrêté (ex: *« Mathématiques (BO n° 16 du 17 avril 2025) - NOUVEAU »*).
  Notre script de surveillance analyse le DOM HTML du tableau :
  - Dès qu'une cellule contient le marqueur `NOUVEAU`, il extrait la discipline, le numéro/date de BO entre parenthèses, et l'URL du document PDF joint.
  - Cela permet un ciblage fin par matière plutôt qu'une alerte brute indifférenciée.
* **GitHub Action programmée (Web Watcher) :**  
  Un workflow CI/CD hebdomadaire (`.github/workflows/curriculum_watcher.yml`) sonde les URLs institutionnelles d'Éduscol (ex: `https://eduscol.education.gouv.fr/4356/enseigner-au-cycle-3`) et vérifie la présence de nouvelles occurrences de ce marqueur. En cas de changement, une issue GitHub est automatiquement ouverte avec le label `curriculum-update`.
* **Flux RSS ministériel :**  
  Le Bulletin Officiel (BO) est publié chaque jeudi. Un filtre automatique sur les mots-clés clés (*"programmes d'enseignement"*, *"cycle 2"*, *"cycle 3"*, *"école élémentaire"*) permet de capter immédiatement les arrêtés publiés sous la direction générale de l'enseignement scolaire (DGESCO).

### 7.2 Calendrier institutionnel (Le cycle de l'Éducation Nationale)
En France, les réformes de programmes ne surviennent pas sans préavis en milieu d'année scolaire :
* **Printemps (mars - mai) :** Publication des projets d'ajustements par le Conseil Supérieur des Programmes (CSP).
* **Été (juin - juillet) :** Parution de l'arrêté ministériel définitif au Bulletin Officiel.
* **Rentrée (septembre) :** Entrée en vigueur dans les classes.
* **Rituel d'équipe POPY :** Chaque mois de **juillet/août**, une revue de rentrée scolaire est inscrite dans la roadmap pour ingérer les nouveaux textes avant le 1er septembre.

### 7.3 Remontées terrain (Espace Enseignant POPY)
* Les professeurs des écoles utilisant POPY Academy dans leur classe disposent d'un bouton de feedback dans leur interface : *« Signaler un changement de programme ou une divergence institutionnelle »*.
* Ce signalement remonte directement au responsable pédagogique et à l'équipe IA avec le `chunk_id` concerné pour examen immédiat.



