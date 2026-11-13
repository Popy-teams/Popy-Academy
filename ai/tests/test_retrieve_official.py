#!/usr/bin/env python3
"""
Tests unitaires pour le moteur de recherche textuelle officiel (Retrieval).
Valide la capacité du RAG à sourcer les questions scolaires et à bloquer les hallucinations.

Conforme à la tâche S2-5 du PLAN_IA_SONIA_PIERRE_ALEXIS.md (>= 10 assertions).
"""

import sys
import unittest
from pathlib import Path

# Ajout du dossier racine ai au PYTHONPATH
ai_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ai_root))

from src.retrieve.search_official import search_official, normalize_text, tokenize


class TestOfficialRetrieval(unittest.TestCase):
    """Suite de tests unitaires du moteur de retrieval officiel."""

    def test_01_fractions_cm1_returns_results(self):
        """Vérifie qu'une recherche sur les fractions en CM1 remonte des chunks officiels pertinents."""
        results = search_official("Qu'est-ce qu'une fraction ?", level="CM1", subject="Mathématiques")
        self.assertGreater(len(results), 0, "Doit retourner au moins un chunk officiel")
        chunk_ids = [r["chunk_id"] for r in results]
        self.assertIn("chunk_cm1_maths_fractions_01", chunk_ids, "Le chunk sur le sens de la fraction doit être présent")
        self.assertGreater(results[0]["score"], 0.2, "Le score doit dépasser le seuil minimal")

    def test_02_denominateur_cm1_returns_relevant_chunk(self):
        """Vérifie que la question sur le dénominateur cible le chunk de vocabulaire approprié."""
        results = search_official("Quel est le rôle du dénominateur ?", level="CM1")
        self.assertGreater(len(results), 0)
        top_chunk_id = results[0]["chunk_id"]
        # Vérifie que le chunk de vocabulaire ou de comparaison fait partie du top
        self.assertTrue(top_chunk_id in ["chunk_cm1_maths_fractions_02", "chunk_cm1_maths_fractions_07", "chunk_cm1_maths_fractions_09"])

    def test_03_droite_graduee_returns_targeted_chunk(self):
        """Vérifie la remontée du chunk sur la demi-droite graduée."""
        results = search_official("Comment placer une fraction sur une droite graduée ?", level="CM1")
        self.assertGreater(len(results), 0)
        self.assertEqual(results[0]["chunk_id"], "chunk_cm1_maths_fractions_05")
        self.assertIn("demi-droite graduée", results[0]["topic"].lower())

    def test_04_verbe_ce2_returns_grammar_chunk(self):
        """Vérifie que la recherche sur le verbe au CE2 retourne le chunk de grammaire correspondant."""
        results = search_official("Comment repérer le verbe conjugué dans une phrase ?", level="CE2", subject="Français")
        self.assertGreater(len(results), 0)
        self.assertEqual(results[0]["chunk_id"], "chunk_ce2_fr_grammaire_01")
        self.assertIn("verbe", results[0]["topic"].lower())

    def test_05_out_of_curriculum_pythagore_returns_zero(self):
        """Règle anti-hallucination : une notion de 4e (Pythagore) demandée en CM1 doit renvoyer 0 résultat."""
        results = search_official("Explique le théorème de Pythagore", level="CM1")
        self.assertEqual(len(results), 0, "Pythagore ne doit retourner AUCUN résultat officiel pour le CM1")

    def test_06_out_of_curriculum_discriminant_returns_zero(self):
        """Règle anti-hallucination : les équations du second degré / discriminant (lycée) renvoient 0 résultat."""
        results = search_official("Calculer les racines avec le discriminant delta", level="CM1")
        self.assertEqual(len(results), 0, "Notion de lycée : doit renvoyer 0 résultat pour déclencher le refus")

    def test_07_level_filter_isolation(self):
        """Vérifie que le filtre par niveau est strictement hermétique."""
        # Recherche d'une notion typique de CE2 (accord du verbe au présent) en demandant le niveau CM1
        # Les chunks CE2 ne doivent pas apparaître si on filtre strictement sur CM1
        results_cm1 = search_official("Identifier le verbe conjugué", level="CM1")
        for res in results_cm1:
            self.assertIn("CM1", res["levels"], "Un résultat filtré sur CM1 ne doit contenir que des niveaux autorisés")

    def test_08_subject_filter_isolation(self):
        """Vérifie que le filtre par matière isole correctement les disciplines."""
        results_maths = search_official("accord du verbe", subject="Mathématiques")
        self.assertEqual(len(results_maths), 0, "Une question de grammaire ne doit rien renvoyer en Mathématiques")

    def test_09_results_format_complies_with_contract(self):
        """Vérifie que chaque résultat contient tous les champs requis pour le schéma GroundedAnswer."""
        results = search_official("fractions simples", level="CM1")
        self.assertGreater(len(results), 0)
        hit = results[0]
        self.assertIn("chunk_id", hit)
        self.assertIn("source_ref", hit)
        self.assertIn("score", hit)
        self.assertIn("text", hit)
        self.assertIn("version", hit)
        self.assertIsInstance(hit["score"], float)
        self.assertGreaterEqual(hit["score"], 0.0)
        self.assertLessEqual(hit["score"], 1.0)

    def test_10_empty_query_returns_empty_list(self):
        """Vérifie qu'une requête vide ou constituée uniquement de stopwords renvoie une liste vide."""
        self.assertEqual(search_official(""), [])
        self.assertEqual(search_official("le la les de du"), [])


if __name__ == "__main__":
    unittest.main()

