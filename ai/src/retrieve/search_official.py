#!/usr/bin/env python3
"""
Module de recherche textuelle locale (Retrieval) dans les fragments du programme officiel.
Conforme au principe RAG : recherche des extraits officiels pertinents avant génération.

Auteur : Sonia (NLP / RAG / Données) - Popy Academy
"""

from __future__ import annotations

import argparse
import json
import math
import re
import unicodedata
from pathlib import Path
from typing import Any, Dict, List, Optional

# Chemin par défaut du jeu de chunks officiels v0
DEFAULT_DATASET_PATH = Path("ai/datasets/ds-rag-official/chunks_v0.jsonl")

# Stopwords français basiques et mots interrogatifs pour affiner la recherche textuelle
FRENCH_STOPWORDS = {
    "le", "la", "les", "un", "une", "des", "du", "de", "d", "l",
    "et", "ou", "mais", "donc", "or", "ni", "car", "a", "à", "au", "aux",
    "en", "dans", "par", "pour", "sur", "avec", "sans", "sous",
    "ce", "cet", "cette", "ces", "mon", "ton", "son", "notre", "votre", "leur",
    "je", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles",
    "qui", "que", "quoi", "dont", "où", "est", "sont", "c", "se", "sa",
    "qu", "quel", "quelle", "quels", "quelles", "comment", "pourquoi", "combien",
    "faire", "dire", "avoir", "etre", "être"
}


def normalize_text(text: str) -> str:
    """Normalise une chaîne : minuscules, suppression des accents et ponctuation."""
    # Décomposition Unicode (sépare lettres et accents)
    nfkd = unicodedata.normalize("NFKD", text)
    no_accents = "".join(c for c in nfkd if not unicodedata.combining(c))
    # Nettoyage ponctuation et mise en minuscules
    clean = re.sub(r"[^a-zA-Z0-9\s]", " ", no_accents.lower())
    return clean


def stem_token(word: str) -> str:
    """Stemming basique en français (gestion des pluriels en -s, -x)."""
    if len(word) > 3:
        if word.endswith("s") and not word.endswith("ss"):
            return word[:-1]
        if word.endswith("x"):
            return word[:-1]
    return word


def tokenize(text: str) -> List[str]:
    """Découpe un texte en mots-clés normalisés et racisés en retirant les stopwords."""
    norm = normalize_text(text)
    tokens = norm.split()
    return [
        stem_token(t)
        for t in tokens
        if len(t) > 1 and t not in FRENCH_STOPWORDS and stem_token(t) not in FRENCH_STOPWORDS
    ]


class OfficialRetriever:
    """Moteur de recherche textuelle pondéré (BM25 simplifié) sur les chunks officiels."""

    def __init__(self, dataset_path: Path = DEFAULT_DATASET_PATH):
        self.dataset_path = dataset_path
        self.chunks: List[Dict[str, Any]] = []
        self._load_chunks()

    def _load_chunks(self) -> None:
        if not self.dataset_path.exists():
            raise FileNotFoundError(f"Dataset introuvable : {self.dataset_path}")

        self.chunks = []
        with open(self.dataset_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    self.chunks.append(json.loads(line))

    def search(
        self,
        query: str,
        level: Optional[str] = None,
        subject: Optional[str] = None,
        top_k: int = 3,
        min_score: float = 0.15,
    ) -> List[Dict[str, Any]]:
        """
        Recherche les chunks officiels les plus pertinents pour une requête donnée.

        Args:
            query: La question ou requête en langage naturel.
            level: Filtre optionnel sur le niveau scolaire (ex: 'CM1', 'CE2').
            subject: Filtre optionnel sur la matière (ex: 'Mathématiques', 'Français').
            top_k: Nombre maximum d'extraits retournés.
            min_score: Seuil minimal de pertinence (0.0 à 1.0).

        Returns:
            Liste de dictionnaires formatés contenant chunk_id, source_ref, score, text, etc.
        """
        query_tokens = tokenize(query)
        if not query_tokens:
            return []

        scored_results = []

        for chunk in self.chunks:
            # 1. Filtre strict sur le niveau scolaire
            if level and level not in chunk.get("levels", []):
                continue

            # 2. Filtre strict sur la matière
            if subject and chunk.get("subject", "").lower() != subject.lower():
                continue

            # 3. Calcul du score de correspondance textuelle
            # On donne un poids fort au titre (topic) et aux identifiants, et standard au texte
            topic_tokens = tokenize(chunk.get("topic", ""))
            text_tokens = tokenize(chunk.get("text", ""))
            domain_tokens = tokenize(chunk.get("domain", ""))

            score = 0.0
            matched_terms = 0

            for q_term in query_tokens:
                term_score = 0.0
                # Match dans le sujet / topic (poids x3)
                if q_term in topic_tokens:
                    term_score += 3.0
                # Match dans le domaine (poids x1.5)
                if q_term in domain_tokens:
                    term_score += 1.5
                # Match dans le corps du texte (fréquence)
                text_count = text_tokens.count(q_term)
                if text_count > 0:
                    term_score += 1.0 + math.log1p(text_count)

                if term_score > 0:
                    score += term_score
                    matched_terms += 1

            if score > 0:
                # Normalisation du score entre 0.0 et 1.0
                # Plus la proportion de mots de la requête est couverte, plus le score monte
                query_coverage = matched_terms / len(query_tokens)
                normalized_score = min(1.0, round((score / (len(query_tokens) * 4.0)) * (0.5 + 0.5 * query_coverage), 2))

                if normalized_score >= min_score:
                    scored_results.append({
                        "chunk_id": chunk["id"],
                        "source_ref": chunk["source_ref"],
                        "version": chunk.get("version"),
                        "score": normalized_score,
                        "subject": chunk["subject"],
                        "domain": chunk["domain"],
                        "topic": chunk["topic"],
                        "levels": chunk["levels"],
                        "text": chunk["text"],
                    })

        # Tri par score décroissant
        scored_results.sort(key=lambda x: x["score"], reverse=True)
        return scored_results[:top_k]


def search_official(
    query: str,
    level: Optional[str] = None,
    subject: Optional[str] = None,
    top_k: int = 3,
    min_score: float = 0.15,
    dataset_path: Path = DEFAULT_DATASET_PATH,
) -> List[Dict[str, Any]]:
    """Fonction utilitaire principale pour interroger le référentiel officiel."""
    retriever = OfficialRetriever(dataset_path=dataset_path)
    return retriever.search(query=query, level=level, subject=subject, top_k=top_k, min_score=min_score)


def main():
    parser = argparse.ArgumentParser(description="Recherche textuelle dans le référentiel officiel POPY")
    parser.add_argument("query", type=str, help="Question ou mots-clés à rechercher")
    parser.add_argument("--level", "-l", type=str, choices=["CP", "CE1", "CE2", "CM1", "CM2"], help="Niveau scolaire")
    parser.add_argument("--subject", "-s", type=str, help="Discipline (ex: Mathématiques, Français)")
    parser.add_argument("--top-k", "-k", type=int, default=3, help="Nombre de résultats")
    parser.add_argument("--dataset", "-d", type=Path, default=DEFAULT_DATASET_PATH, help="Chemin vers chunks_v0.jsonl")
    args = parser.parse_args()

    results = search_official(
        query=args.query,
        level=args.level,
        subject=args.subject,
        top_k=args.top_k,
        dataset_path=args.dataset,
    )

    print(f"\n🔍 Recherche : '{args.query}' (Niveau: {args.level or 'Tous'}, Matière: {args.subject or 'Toutes'})")
    print(f"📊 Résultats trouvés : {len(results)}\n" + "-" * 60)

    if not results:
        print("❌ 0 résultat officiel trouvé -> Déclenchement du REFUS STANDARD (Pas d'hallucination)")
    else:
        for i, hit in enumerate(results, 1):
            print(f"[{i}] Chunk: {hit['chunk_id']} | Score: {hit['score']}")
            print(f"    Sujet: {hit['topic']} ({hit['subject']} - {hit['levels']})")
            print(f"    Source: {hit['source_ref']}")
            print(f"    Extrait: {hit['text'][:120]}...\n")


if __name__ == "__main__":
    main()
