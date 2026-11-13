#!/usr/bin/env python3
"""
Orchestrateur Pédagogique RAG « Bouchon » (Stub sans LLM).
Combine la Base A (programmes officiels) et la Base B (exercices POPY)
pour générer des réponses sourcées et déclencher les refus standards anti-hallucination.

Conforme aux contrats :
- Entrée : ai/schemas/pedagogy_query.json
- Sortie : ai/schemas/grounded_answer.json

Auteur : Sonia (NLP / RAG / Données) - Popy Academy
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any, Dict, List, Optional
import sys

# Assure la résolution des imports racine
project_root = Path(__file__).resolve().parents[3]
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

# Import des services de retrieval
from ai.src.retrieve.search_official import search_official
from ai.src.retrieve.retrieve_contents import retrieve_contents

# Chemins des gabarits de refus
REFUSAL_FILE = Path("ai/prompts/refuse_fr.txt")


def load_refusal_templates() -> Dict[str, str]:
    """Charge les gabarits de refus depuis ai/prompts/refuse_fr.txt."""
    templates = {}
    if not REFUSAL_FILE.exists():
        return templates

    current_tag = None
    current_lines = []

    with open(REFUSAL_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line_str = line.strip()
            if line_str.startswith("[") and line_str.endswith("]"):
                if current_tag and current_lines:
                    templates[current_tag] = "\n".join(current_lines).strip()
                current_tag = line_str[1:-1]
                current_lines = []
            elif current_tag and not line.startswith("#"):
                current_lines.append(line.rstrip())

        if current_tag and current_lines:
            templates[current_tag] = "\n".join(current_lines).strip()

    return templates


def enrich_query_for_retrieval(query: str) -> str:
    """Enrichit sémantiquement la requête avec des concepts clés du programme."""
    norm = query.lower()
    additions = []
    if "/" in query:
        additions.append("fraction")
    if "+" in query:
        additions.append("addition")
    if any(k in norm for k in ["un s", "un 's'", "des s", "pourquoi un s", "accord"]):
        additions.append("accord pluriel groupe nominal")
    if any(k in norm for k in ["comparer", "plus grand", "plus petit"]):
        additions.append("comparaison")
    if "partager" in norm or "partage" in norm:
        additions.append("fraction")

    if additions:
        return query + " " + " ".join(additions)
    return query


class PedagogicalOrchestratorStub:
    """Orchestrateur bouchon pour valider la chaîne de décision RAG sans modèle LLM."""

    def __init__(self):
        self.refusals = load_refusal_templates()

    def ask(self, query_payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Traite une requête pédagogique et produit la réponse GroundedAnswer.
        """
        message = query_payload.get("message", "").strip()
        level = query_payload.get("level") or "CM1"
        subject = query_payload.get("subject")
        intent = query_payload.get("intent", "programme")
        learning_context = query_payload.get("learning_context") or {}
        adaptation_tags = learning_context.get("effective_adaptation_tags", [])

        # =====================================================================
        # 1. GARDE-FOUS DE SÉCURITÉ & DÉVOYAGE (Jailbreak, PII, Triche)
        # =====================================================================
        norm_msg = message.lower()

        # Tentative de jailbreak / override
        if any(w in norm_msg for w in ["ignore", "oublie", "règles précédentes"]):
            refusal_text = self.refusals.get(
                "JAILBREAK_OVERRIDE_ATTEMPT",
                "Je suis programmé pour respecter strictement les programmes scolaires officiels."
            )
            return self._build_refusal(refusal_text, intent="refusal", reason="system_prompt_override_attempt")

        # Demande de données privées / coordonnées
        if any(w in norm_msg for w in ["adresse", "téléphone", "numéro", "vie privée", "nom de famille"]):
            refusal_text = self.refusals.get(
                "SAFETY_PII_OR_INAPPROPRIATE",
                "Je ne peux pas échanger d'informations personnelles. Parles-en à un adulte de confiance."
            )
            return self._build_refusal(refusal_text, intent="refusal", reason="pii_detected")

        # Demande de solution toute faite sans effort (triche devoirs)
        if any(phrase in norm_msg for phrase in ["fais mes devoirs", "donne-moi directement la réponse", "rédige à ma place"]):
            refusal_text = self.refusals.get(
                "AIDE_DEVOIRS_NO_DIRECT_ANSWER",
                "Je suis là pour t'aider à trouver la solution par toi-même, pas pour faire l'exercice à ta place !"
            )
            return self._build_refusal(refusal_text, intent="aide", reason=None, mark_refused=False)

        # Questions hors sujet ou désinformation
        if any(w in norm_msg for w in ["terre est plate", "ronaldo", "messi", "joueur de foot"]):
            refusal_text = "Je suis Popy, ton compagnon d'apprentissage. Recentrons-nous sur tes leçons scolaires !"
            return self._build_refusal(refusal_text, intent="chitchat", reason="out_of_curriculum")

        # =====================================================================
        # 2. RETRIEVAL OFFICIEL (Base A - Vérité Programme)
        # =====================================================================
        search_query = enrich_query_for_retrieval(message)
        official_hits = search_official(
            query=search_query,
            level=level,
            subject=subject,
            top_k=2,
            min_score=0.14,
        )

        # RÈGLE D'OR : Si 0 résultat officiel pour une question de programme -> REFUS
        if not official_hits:
            refusal_template = self.refusals.get(
                "OUT_OF_CURRICULUM",
                "Cette notion ne figure pas dans le programme officiel pour ton niveau ({LEVEL})."
            )
            refusal_text = refusal_template.replace("{LEVEL}", str(level)).replace("{SUBJECT}", str(subject or "ce domaine"))
            return self._build_refusal(refusal_text, intent=intent, reason="out_of_curriculum")

        # =====================================================================
        # 3. RETRIEVAL EXERCICES POPY (Base B - Contenus Ancrés)
        # =====================================================================
        top_hit = official_hits[0]
        # Déduction de la compétence ciblée depuis l'identifiant du chunk ou sujet
        competency_id = None
        if "fractions" in top_hit["topic"].lower():
            if "vocabulaire" in top_hit["topic"].lower():
                competency_id = "comp_c3_maths_frac_voc"
            elif "décomposition" in top_hit["topic"].lower() or "supérieure" in top_hit["topic"].lower():
                competency_id = "comp_c3_maths_frac_decomp"
            elif "droite" in top_hit["topic"].lower():
                competency_id = "comp_c3_maths_frac_graduee"
            elif "décimale" in top_hit["topic"].lower():
                competency_id = "comp_c3_maths_decimaux_virgule"
            elif "addition" in top_hit["topic"].lower():
                competency_id = "comp_c3_maths_frac_add"
            else:
                competency_id = "comp_c3_maths_frac_sens"
        elif "verbe" in top_hit["topic"].lower():
            competency_id = "comp_c2_fr_verbe_ident"
        elif "accord" in top_hit["topic"].lower():
            competency_id = "comp_c2_fr_accord_sv"

        matched_contents = []
        if competency_id:
            matched_contents = retrieve_contents(
                competency_ids=[competency_id],
                adaptation_tags=adaptation_tags,
                top_k=1,
            )

        # =====================================================================
        # 4. ASSEMBLAGE DE LA RÉPONSE (Format GroundedAnswer)
        # =====================================================================
        response_lines = [
            f"D'après les repères officiels de l'Éducation Nationale ({top_hit['source_ref']}) :",
            f"« {top_hit['text']} »",
        ]

        content_ids = []
        if matched_contents:
            c = matched_contents[0]
            content_ids.append(c["id"])
            response_lines.append("")
            response_lines.append(f"Pour t'entraîner, voici une activité POPY adaptée :")
            response_lines.append(f"👉 {c['exercise']}")
            if adaptation_tags and "exemple_visuel" in c.get("adaptations", []):
                response_lines.append("*(Support visuel activé selon tes préférences)*")

        sources_payload = [
            {
                "chunk_id": h["chunk_id"],
                "source_ref": h["source_ref"],
                "score": h["score"],
            }
            for h in official_hits
        ]

        return {
            "answer_text": "\n".join(response_lines),
            "grounded": True,
            "intent": intent,
            "sources": sources_payload,
            "content_ids": content_ids,
            "safety": {
                "refused": False,
                "reason": None,
            },
            "model": {
                "llm": "none (RAG stub v0)",
                "prompt_version": "pedagogy_v1",
            },
        }

    def _build_refusal(
        self,
        refusal_text: str,
        intent: str,
        reason: Optional[str],
        mark_refused: bool = True,
    ) -> Dict[str, Any]:
        return {
            "answer_text": refusal_text,
            "grounded": False,
            "intent": intent,
            "sources": [],
            "content_ids": [],
            "safety": {
                "refused": mark_refused,
                "reason": reason,
            },
            "model": {
                "llm": "none (RAG stub v0)",
                "prompt_version": "pedagogy_v1",
            },
        }


def ask_pedagogy_stub(query_payload: Dict[str, Any]) -> Dict[str, Any]:
    """Point d'entrée fonctionnel du service pédagogique stub."""
    orchestrator = PedagogicalOrchestratorStub()
    return orchestrator.ask(query_payload)


def main():
    parser = argparse.ArgumentParser(description="Test du moteur pédagogique POPY en mode bouchon (Stub)")
    parser.add_argument("message", type=str, help="Message ou question de l'enfant")
    parser.add_argument("--level", "-l", type=str, default="CM1", choices=["CP", "CE1", "CE2", "CM1", "CM2"])
    parser.add_argument("--subject", "-s", type=str, help="Discipline")
    parser.add_argument("--tags", "-t", nargs="*", default=[], help="Tags d'adaptation (ex: exemple_visuel)")
    args = parser.parse_args()

    payload = {
        "message": args.message,
        "level": args.level,
        "subject": args.subject,
        "learning_context": {
            "effective_adaptation_tags": args.tags,
        },
    }

    result = ask_pedagogy_stub(payload)
    print("\n" + "=" * 70)
    print(f"👦 Question [{args.level}] : {args.message}")
    print("=" * 70)
    print(result["answer_text"])
    print("\n" + "-" * 70)
    print(f"🛡️  Grounded : {result['grounded']} | Refusé : {result['safety']['refused']} (Raison: {result['safety']['reason']})")
    print(f"📚 Sources citées : {[s['chunk_id'] for s in result['sources']]}")
    print(f"🎯 Exercices recommandés : {result['content_ids']}")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    main()
