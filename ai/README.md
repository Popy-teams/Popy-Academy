# Moteur IA & Données — Popy Academy

Ce dossier regroupe le cerveau pédagogique et perceptif de POPY Academy.

## Principe directeur non négociable
> **POPY n’entraîne pas son IA sur Internet pour inventer le programme.**  
> Le moteur s'appuie sur un référentiel contrôlé issu des programmes officiels (BO / Éduscol) et des contenus validés. L'IA reformule et accompagne dans ces limites. Les modèles additionnels (comportement, vision) sont optionnels, consentis, et ne bloquent jamais l'usage sur ordinateur.

## Arborescence du module `ai/`

```
ai/
├── README.md               # Ce document
├── pyproject.toml          # Dépendances Python (3.11+)
├── schemas/                # Contrats JSON Schema figés
│   ├── behavior_event.json          # Contrat v1.2 télémétrie front/robot
│   ├── official_chunk.json          # Extrait programme BO / Éduscol
│   ├── popy_content.json            # Exercice/contenu pédagogique ancré
│   ├── child_learning_context.json  # Profil enfant minimisé (zéro PII)
│   ├── pedagogy_query.json          # Payload requête POST /pedagogy/ask
│   └── grounded_answer.json         # Réponse sourcée + grounded true|false
├── prompts/                # Gabarits de prompts et messages de refus
│   ├── refuse_fr.txt                # Refus standard FR (anti-hallucination)
│   └── ...
├── eval/                   # Évaluation et jeux de test
│   ├── gold/                        # Gold datasets (ex: gold_v0.jsonl)
│   └── reports/                     # Rapports d'évaluation
├── etl/                    # Ingestion et découpage des référentiels officiels
├── src/                    # Code applicatif (retrieval, orchestrateur, LLM client)
├── datasets/               # Datasets versionnés avec CARD.md
├── models/                 # Checkpoints et cartes de modèles
├── train/                  # Scripts d'entraînement (LoRA, classifieurs)
└── docs/                   # ADRs et spécifications
```

## Contrats de données (`schemas/`)
Tous les échanges entre le front-end, l'API et le moteur IA respectent strictement les schémas JSON validés :
1. **`behavior_event.json`** : Traçabilité des actions d'apprentissage (v1.2).
2. **`official_chunk.json`** : Morceau de programme officiel avec référence BO.
3. **`popy_content.json`** : Contenu pédagogique validé.
4. **`child_learning_context.json`** : Données de progression anonymisées (pas de nom, pas de diagnostic).
5. **`pedagogy_query.json`** / **`grounded_answer.json`** : Entrée / sortie du service pédagogique.

