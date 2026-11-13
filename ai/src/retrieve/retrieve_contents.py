#!/usr/bin/env python3
"""
Module de sélection de contenus pédagogiques POPY (Base B du RAG).
Sélectionne les exercices et activités ancrés sur une compétence officielle,
avec priorisation adaptative selon le profil de l'enfant (tags visuels, consignes courtes, remédiation).

Auteur : Sonia (NLP / RAG / Données) - Popy Academy
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any, Dict, List, Optional

DEFAULT_CONTENTS_PATH = Path("ai/datasets/ds-popy-contents/contents_v0.jsonl")


class ContentRetriever:
    """Service de sélection et de personnalisation des exercices POPY."""

    def __init__(self, dataset_path: Path = DEFAULT_CONTENTS_PATH):
        self.dataset_path = dataset_path
        self.contents: List[Dict[str, Any]] = []
        self._load_contents()

    def _load_contents(self) -> None:
        if not self.dataset_path.exists():
            raise FileNotFoundError(f"Dataset de contenus introuvable : {self.dataset_path}")

        self.contents = []
        with open(self.dataset_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    self.contents.append(json.loads(line))

    def retrieve(
        self,
        competency_ids: List[str],
        adaptation_tags: Optional[List[str]] = None,
        difficulty: Optional[str] = None,
        top_k: int = 2,
    ) -> List[Dict[str, Any]]:
        """
        Sélectionne les exercices POPY reliés aux compétences cibles.

        Args:
            competency_ids: Liste des identifiants de compétences (ex: ['comp_c3_maths_frac_sens']).
            adaptation_tags: Tags de besoins de l'enfant (ex: ['exemple_visuel', 'consigne_courte']).
            difficulty: Niveau de difficulté souhaité ('easy', 'standard', 'remediation').
            top_k: Nombre maximal d'exercices à renvoyer.

        Returns:
            Liste des contenus triés par pertinence adaptative.
        """
        if not competency_ids:
            return []

        adaptation_tags = adaptation_tags or []
        candidates = []

        for item in self.contents:
            # 1. Vérifier si l'exercice couvre l'une des compétences recherchées
            item_comp_ids = item.get("official_competency_ids", [])
            shared_comps = set(competency_ids).intersection(set(item_comp_ids))
            if not shared_comps:
                continue

            # 2. Score de personnalisation
            score = 1.0  # Base pour correspondance de compétence

            # Bonus si l'adaptation correspond aux besoins de l'enfant
            item_adaptations = item.get("adaptations", [])
            for tag in adaptation_tags:
                if tag in item_adaptations:
                    score += 1.5  # Forte priorité si support adapté (ex: visuel)

            # Bonus si la difficulté demandée correspond
            if difficulty and item.get("difficulty") == difficulty:
                score += 1.0

            candidates.append((score, item))

        # Tri décroissant selon le score d'adaptation
        candidates.sort(key=lambda x: x[0], reverse=True)
        return [c[1] for c in candidates[:top_k]]


def retrieve_contents(
    competency_ids: List[str],
    adaptation_tags: Optional[List[str]] = None,
    difficulty: Optional[str] = None,
    top_k: int = 2,
    dataset_path: Path = DEFAULT_CONTENTS_PATH,
) -> List[Dict[str, Any]]:
    """Fonction utilitaire principale pour requêter les exercices POPY."""
    retriever = ContentRetriever(dataset_path=dataset_path)
    return retriever.retrieve(
        competency_ids=competency_ids,
        adaptation_tags=adaptation_tags,
        difficulty=difficulty,
        top_k=top_k,
    )


def main():
    parser = argparse.ArgumentParser(description="Recherche d'exercices POPY ancrés")
    parser.add_argument("competency_id", type=str, help="ID de compétence officielle (ex: comp_c3_maths_frac_sens)")
    parser.add_argument("--tags", "-t", nargs="*", default=[], help="Tags d'adaptation (ex: exemple_visuel)")
    parser.add_argument("--difficulty", "-d", choices=["easy", "standard", "remediation"], help="Difficulté")
    parser.add_argument("--top-k", "-k", type=int, default=2, help="Nombre d'exercices")
    args = parser.parse_args()

    results = retrieve_contents(
        competency_ids=[args.competency_id],
        adaptation_tags=args.tags,
        difficulty=args.difficulty,
        top_k=args.top_k,
    )

    print(f"\n🎯 Recherche d'exercices pour la compétence : {args.competency_id}")
    print(f"🏷️  Adaptations demandées : {args.tags}")
    print(f"📊 Exercices trouvés : {len(results)}\n" + "-" * 60)

    for i, content in enumerate(results, 1):
        print(f"[{i}] {content['id']} ({content['difficulty']})")
        print(f"    Objectif : {content['objective_popy']}")
        print(f"    Exercice : {content['exercise']}")
        print(f"    Adaptations : {content['adaptations']}\n")


if __name__ == "__main__":
    main()

