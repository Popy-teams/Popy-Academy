# Dataset Card — `ds-rag-official` (v0)

## 1. Description du Dataset
* **Nom du dataset :** `ds-rag-official`
* **Version :** `v0` (novembre 2026)
* **Finalité :** Référentiel de vérité pédagogique pour le moteur RAG de POPY Academy. Chaque fragment (chunk) correspond à un attendu institutionnel précis issu des programmes scolaires français.
* **Volume v0 :** 20 chunks structurés
  - **Cycle 3 (CM1 - Mathématiques) :** 12 chunks (Fractions simples, numérateur/dénominateur, équivalence à 1, décomposition, droite graduée, fractions décimales, passage à la virgule).
  - **Cycle 2 (CE2 - Français) :** 5 chunks (Verbe, sujet, accords sujet-verbe, groupe nominal, adjectifs).
  - **Cycle 2 (CE2 - Mathématiques) :** 3 chunks (Numération 10 000, addition posée avec retenue, parité).

## 2. Origine & Licence
* **Origine des données :** 
  - **Mathématiques Cycle 3 :** Bulletin Officiel n° 16 du 17 avril 2025 (Programme révisé avec pastille **NOUVEAU** sur Éduscol).
  - **Français & Maths Cycle 2 :** Bulletin Officiel n° 31 du 30 juillet 2020.
* **Licence juridique :** Licence Ouverte v2.0 (Etalab) / Citation pédagogique.
* **Conformité RGPD :** Aucune donnée personnelle (zéro PII), textes réglementaires publics uniquement.

## 3. Schéma de Données
Chaque ligne du fichier `chunks_v0.jsonl` respecte strictement le contrat [ai/schemas/official_chunk.json](../../schemas/official_chunk.json).

Champs clés :
- `id` : identifiant unique normalisé (ex: `chunk_cm1_maths_fractions_01`).
- `cycle` : `"2"` ou `"3"`.
- `levels` : `["CM1"]` ou `["CE2"]`.
- `subject` : `"Mathématiques"` ou `"Français"`.
- `domain` : `"Nombres et calculs"` ou `"Étude de la langue"`.
- `topic` : thématique précise.
- `competency_ids` : identifiants de compétences rattachées.
- `text` : attendu officiel textuel.
- `source_type` : `"BO"`.
- `source_ref` : arrêté officiel.
- `source_url` : URL officielle Éduscol.
- `version` : `"2020-07"`.

## 4. Rebuild & Reproductibilité
Pour régénérer ce dataset depuis les textes sources validés :
```bash
python3 ai/etl/official_to_chunks.py --output ai/datasets/ds-rag-official/chunks_v0.jsonl
```

