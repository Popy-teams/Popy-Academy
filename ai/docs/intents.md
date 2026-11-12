# Table de décision des intentions (Intents) & Garde-fous RAG

Ce document spécifie les 6 intentions majeures gérées par l'orchestrateur POPY et la politique de déclenchement des refus standards.

| Intent | Description | Retrieval Officiel | Retrieval POPY | Comportement si 0 hit officiel |
|---|---|---|---|---|
| **`programme`** | Question sur les attendus, notions scolaires, définitions institutionnelles. | **Obligatoire** | Optionnel | **Refus standard immédiat** (`NO_OFFICIAL_SOURCE` ou `OUT_OF_CURRICULUM`). Interdiction d'inférer. |
| **`exercice`** | Demande d'un problème, calcul, ou activité d'entraînement. | Optionnel (compétence) | **Obligatoire** | Sélection de contenu validé en base. |
| **`aide`** | L'enfant bute sur une question et sollicite un indice ou une reformulation. | Non | Optionnel (indices) | Guidage socratique / étapes (pas de réponse directe brute : `AIDE_DEVOIRS_NO_DIRECT_ANSWER`). |
| **`remediation`** | Analyse d'une erreur récurrente et proposition d'un parcours adapté. | Optionnel | **Obligatoire** | Variantes visuelles / courtes selon le profil. |
| **`bilan`** | Synthèse des progrès de l'enfant pour lui-même ou l'adulte. | Non | Non | Données agrégées uniquement (pas de diagnostic psy/médical). |
| **`chitchat` / `hors_scope`** | Salutations, bavardage ou questions hors contexte scolaire. | Non | Non | Recadrage bienveillant vers l'apprentissage (`SAFETY_PII_OR_INAPPROPRIATE`). |

---

## Garde-fous de Sécurité & Non-Hallucination

1. **Règle d'ancrage strict (`grounded: true`) :**
   Une réponse `programme` ne peut être marquée `grounded: true` que si au moins un fragment officiel (`chunk_id`) valide est retourné par le retrieval avec un score minimal.
2. **Filtrage par niveau :**
   Une question d'un enfant en CM1 portant sur le théorème de Pythagore (Cycle 4) doit déclencher `OUT_OF_CURRICULUM` même si la source officielle existe en base pour la 4ème/3ème.
3. **Protection de l'enfance & RGPD :**
   Aucune conservation de données nominatives dans le prompt ou les logs. Toute tentative d'obtenir des données privées déclenche `SAFETY_PII_OR_INAPPROPRIATE`.

