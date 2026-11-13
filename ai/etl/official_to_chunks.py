#!/usr/bin/env python3
"""
Pipeline ETL : Ingestion et découpage des programmes officiels Éduscol / BO en fragments RAG.
Conforme au schéma : ai/schemas/official_chunk.json

Auteur : Sonia (NLP / RAG / Données) - Popy Academy
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any, Dict, List

# Constantes institutionnelles v1
SOURCE_TYPE_DEFAULT = "BO"
SOURCE_REF_MATHS_CYCLE3 = "BO n° 16 du 17 avril 2025 (Programme révisé - NOUVEAU)"
SOURCE_REF_CYCLE2 = "BO n°31 du 30 juillet 2020 (NOR : MENE2018712A)"
URL_CYCLE3 = "https://eduscol.education.gouv.fr/4356/enseigner-au-cycle-3"
URL_CYCLE2 = "https://eduscol.education.gouv.fr/4355/enseigner-au-cycle-2"
VERSION_MATHS_CYCLE3 = "2025-04"
VERSION_CYCLE2 = "2020-07"
LICENSE_DEFAULT = "Licence Ouverte v2.0 (Etalab) / Citation pédagogique"


def get_raw_curriculum_records() -> List[Dict[str, Any]]:
    """
    Retourne la matière première institutionnelle brute extraite des programmes
    officiels Éduscol / BO n°31 du 30 juillet 2020.
    Focus : CM1 Mathématiques (Fractions & Décimaux) + CE2 Français & Mathématiques.
    """
    return [
        # =========================================================================
        # CYCLE 3 - CM1 - MATHÉMATIQUES : FRACTIONS ET DÉCIMAUX
        # =========================================================================
        {
            "id": "chunk_cm1_maths_fractions_01",
            "cycle": "3",
            "levels": ["CM1", "CM2"],
            "subject": "Mathématiques",
            "domain": "Nombres et calculs",
            "topic": "Fractions - Sens et partage",
            "competency_ids": ["comp_c3_maths_frac_sens"],
            "text": (
                "Comprendre et utiliser la notion de fractions simples. "
                "Une fraction est utilisée pour rendre compte de partages de grandeurs (longueurs, aires, volumes) "
                "ou de collections d'objets en parts égales. Les élèves manipulent des fractions simples : "
                "la moitié (un demi, 1/2), le tiers (1/3), le quart (1/4), le dixième (1/10) et le centième (1/100). "
                "Le partage doit être constitué de parts rigoureusement égales."
            ),
            "source_type": SOURCE_TYPE_DEFAULT,
            "source_ref": SOURCE_REF_MATHS_CYCLE3,
            "source_url": URL_CYCLE3,
            "version": VERSION_MATHS_CYCLE3,
            "license": LICENSE_DEFAULT,
            "embedding_id": None,
        },
        {
            "id": "chunk_cm1_maths_fractions_02",
            "cycle": "3",
            "levels": ["CM1", "CM2"],
            "subject": "Mathématiques",
            "domain": "Nombres et calculs",
            "topic": "Fractions - Vocabulaire numérateur et dénominateur",
            "competency_ids": ["comp_c3_maths_frac_voc"],
            "text": (
                "Connaître et expliciter le vocabulaire associé aux fractions : "
                "Dans l'écriture a/b, le dénominateur b (nombre situé en bas) indique en combien de parts égales "
                "l'unité de référence a été découpée ou partagée. "
                "Le numérateur a (nombre situé en haut) indique le nombre de parts que l'on prend ou que l'on considère. "
                "Exemple : dans 3/4, l'unité est partagée en 4 parts égales et on en prend 3."
            ),
            "source_type": SOURCE_TYPE_DEFAULT,
            "source_ref": SOURCE_REF_MATHS_CYCLE3,
            "source_url": URL_CYCLE3,
            "version": VERSION_MATHS_CYCLE3,
            "license": LICENSE_DEFAULT,
            "embedding_id": None,
        },
        {
            "id": "chunk_cm1_maths_fractions_03",
            "cycle": "3",
            "levels": ["CM1", "CM2"],
            "subject": "Mathématiques",
            "domain": "Nombres et calculs",
            "topic": "Fractions - Équivalence à l'unité",
            "competency_ids": ["comp_c3_maths_frac_unite"],
            "text": (
                "Établir l'égalité entre une fraction et l'unité : "
                "Lorsque le numérateur est égal au dénominateur, la fraction est égale au nombre entier 1. "
                "Ainsi : 2/2 = 1, 3/3 = 1, 4/4 = 1, 10/10 = 1, 100/100 = 1. "
                "Toutes les parts de l'unité ont été reconstituées."
            ),
            "source_type": SOURCE_TYPE_DEFAULT,
            "source_ref": SOURCE_REF_MATHS_CYCLE3,
            "source_url": URL_CYCLE3,
            "version": VERSION_MATHS_CYCLE3,
            "license": LICENSE_DEFAULT,
            "embedding_id": None,
        },
        {
            "id": "chunk_cm1_maths_fractions_04",
            "cycle": "3",
            "levels": ["CM1", "CM2"],
            "subject": "Mathématiques",
            "domain": "Nombres et calculs",
            "topic": "Fractions - Fractions supérieures à 1 et décomposition",
            "competency_ids": ["comp_c3_maths_frac_decomp"],
            "text": (
                "Identifier les fractions supérieures à 1 et savoir les décomposer : "
                "Une fraction est supérieure à 1 lorsque son numérateur est plus grand que son dénominateur. "
                "Les élèves apprennent à décomposer une fraction comme la somme d'un nombre entier et d'une fraction "
                "inférieure à 1. Exemple : 7/4 = 4/4 + 3/4 = 1 + 3/4. "
                "Cette décomposition s'appuie sur la visualisation géométrique ou les partages concrets."
            ),
            "source_type": SOURCE_TYPE_DEFAULT,
            "source_ref": SOURCE_REF_MATHS_CYCLE3,
            "source_url": URL_CYCLE3,
            "version": VERSION_MATHS_CYCLE3,
            "license": LICENSE_DEFAULT,
            "embedding_id": None,
        },
        {
            "id": "chunk_cm1_maths_fractions_05",
            "cycle": "3",
            "levels": ["CM1", "CM2"],
            "subject": "Mathématiques",
            "domain": "Nombres et calculs",
            "topic": "Fractions - Demi-droite graduée",
            "competency_ids": ["comp_c3_maths_frac_graduee"],
            "text": (
                "Repérer et placer des fractions simples sur une demi-droite graduée : "
                "L'abscisse d'un point est un nombre qui repère sa position sur une droite graduée à partir de l'origine 0. "
                "Pour placer une fraction a/b, le segment unité (de 0 à 1) est divisé en b parts égales. "
                "On compte ensuite a sous-graduations à partir de 0. "
                "Exemple : pour placer 1/2, on repère le milieu exact entre 0 et 1."
            ),
            "source_type": SOURCE_TYPE_DEFAULT,
            "source_ref": SOURCE_REF_MATHS_CYCLE3,
            "source_url": URL_CYCLE3,
            "version": VERSION_MATHS_CYCLE3,
            "license": LICENSE_DEFAULT,
            "embedding_id": None,
        },
        {
            "id": "chunk_cm1_maths_fractions_06",
            "cycle": "3",
            "levels": ["CM1", "CM2"],
            "subject": "Mathématiques",
            "domain": "Nombres et calculs",
            "topic": "Fractions - Encadrement par deux entiers consécutifs",
            "competency_ids": ["comp_c3_maths_frac_encadre"],
            "text": (
                "Encadrer une fraction simple par deux nombres entiers consécutifs : "
                "À partir de la demi-droite graduée ou de la décomposition sous forme entier + fraction, "
                "l'élève situe une fraction entre deux entiers qui se suivent. "
                "Exemple : comme 7/4 = 1 + 3/4 et que 3/4 < 1, alors 1 < 7/4 < 2."
            ),
            "source_type": SOURCE_TYPE_DEFAULT,
            "source_ref": SOURCE_REF_MATHS_CYCLE3,
            "source_url": URL_CYCLE3,
            "version": VERSION_MATHS_CYCLE3,
            "license": LICENSE_DEFAULT,
            "embedding_id": None,
        },
        {
            "id": "chunk_cm1_maths_fractions_07",
            "cycle": "3",
            "levels": ["CM1", "CM2"],
            "subject": "Mathématiques",
            "domain": "Nombres et calculs",
            "topic": "Fractions - Comparaison à dénominateur égal",
            "competency_ids": ["comp_c3_maths_frac_comp"],
            "text": (
                "Comparer des fractions de même dénominateur : "
                "Lorsque deux fractions ont le même dénominateur (les parts sont de même taille), "
                "la fraction la plus grande est celle qui a le plus grand numérateur. "
                "Exemple : 4/5 > 3/5 car 4 parts d'un cinquième sont plus grandes que 3 parts d'un cinquième."
            ),
            "source_type": SOURCE_TYPE_DEFAULT,
            "source_ref": SOURCE_REF_MATHS_CYCLE3,
            "source_url": URL_CYCLE3,
            "version": VERSION_MATHS_CYCLE3,
            "license": LICENSE_DEFAULT,
            "embedding_id": None,
        },
        {
            "id": "chunk_cm1_maths_fractions_08",
            "cycle": "3",
            "levels": ["CM1", "CM2"],
            "subject": "Mathématiques",
            "domain": "Nombres et calculs",
            "topic": "Fractions - Écritures équivalentes simples",
            "competency_ids": ["comp_c3_maths_frac_equiv"],
            "text": (
                "Établir des égalités simples entre fractions : "
                "À l'aide de représentations imagées (disques, bandes rectangulaires), l'élève découvre que "
                "différentes fractions représentent la même quantité. "
                "Exemples fondamentaux au CM1 : 1/2 = 2/4 = 5/10 ; 1/4 = 2/8 = 25/100 ; 2/4 = 1/2."
            ),
            "source_type": SOURCE_TYPE_DEFAULT,
            "source_ref": SOURCE_REF_MATHS_CYCLE3,
            "source_url": URL_CYCLE3,
            "version": VERSION_MATHS_CYCLE3,
            "license": LICENSE_DEFAULT,
            "embedding_id": None,
        },
        {
            "id": "chunk_cm1_maths_fractions_09",
            "cycle": "3",
            "levels": ["CM1", "CM2"],
            "subject": "Mathématiques",
            "domain": "Nombres et calculs",
            "topic": "Fractions - Addition de fractions de même dénominateur",
            "competency_ids": ["comp_c3_maths_frac_add"],
            "text": (
                "Calculer la somme de deux fractions de même dénominateur : "
                "Pour additionner deux fractions qui ont le même dénominateur, on additionne les numérateurs "
                "et on garde le dénominateur commun. "
                "Exemple : 1/4 + 2/4 = (1+2)/4 = 3/4. "
                "Attention : on n'additionne JAMAIS les dénominateurs (1/4 + 2/4 n'est pas égal à 3/8)."
            ),
            "source_type": SOURCE_TYPE_DEFAULT,
            "source_ref": SOURCE_REF_MATHS_CYCLE3,
            "source_url": URL_CYCLE3,
            "version": VERSION_MATHS_CYCLE3,
            "license": LICENSE_DEFAULT,
            "embedding_id": None,
        },
        {
            "id": "chunk_cm1_maths_fractions_10",
            "cycle": "3",
            "levels": ["CM1", "CM2"],
            "subject": "Mathématiques",
            "domain": "Nombres et calculs",
            "topic": "Fractions décimales",
            "competency_ids": ["comp_c3_maths_frac_decimale"],
            "text": (
                "Comprendre et utiliser les fractions décimales : "
                "Une fraction décimale est une fraction dont le dénominateur est 10, 100, 1000... "
                "L'élève comprend que 1 unité = 10 dixièmes (10/10) = 100 centièmes (100/100). "
                "1 dixième = 10 centièmes (1/10 = 10/100). "
                "Ces équivalences constituent le socle de l'apprentissage des nombres décimaux."
            ),
            "source_type": SOURCE_TYPE_DEFAULT,
            "source_ref": SOURCE_REF_MATHS_CYCLE3,
            "source_url": URL_CYCLE3,
            "version": VERSION_MATHS_CYCLE3,
            "license": LICENSE_DEFAULT,
            "embedding_id": None,
        },
        {
            "id": "chunk_cm1_maths_fractions_11",
            "cycle": "3",
            "levels": ["CM1", "CM2"],
            "subject": "Mathématiques",
            "domain": "Nombres et calculs",
            "topic": "Nombres décimaux - Lien fraction décimale et écriture à virgule",
            "competency_ids": ["comp_c3_maths_decimaux_virgule"],
            "text": (
                "Faire le lien entre fraction décimale et écriture décimale à virgule : "
                "Les nombres décimaux sont introduits à partir des fractions décimales. "
                "1/10 s'écrit 0,1 (zéro unité et un dixième). "
                "1/100 s'écrit 0,01 (zéro unité et un centième). "
                "Exemple de conversion : 14/10 = 10/10 + 4/10 = 1 + 4/10 = 1,4. "
                "La virgule sépare la partie entière de la partie décimale."
            ),
            "source_type": SOURCE_TYPE_DEFAULT,
            "source_ref": SOURCE_REF_MATHS_CYCLE3,
            "source_url": URL_CYCLE3,
            "version": VERSION_MATHS_CYCLE3,
            "license": LICENSE_DEFAULT,
            "embedding_id": None,
        },
        {
            "id": "chunk_cm1_maths_fractions_12",
            "cycle": "3",
            "levels": ["CM1", "CM2"],
            "subject": "Mathématiques",
            "domain": "Nombres et calculs",
            "topic": "Résolution de problèmes avec fractions simples",
            "competency_ids": ["comp_c3_maths_frac_pb"],
            "text": (
                "Résoudre des problèmes du quotidien impliquant des fractions simples de grandeurs ou de collections : "
                "Calculer une fraction d'une quantité : pour trouver le quart de 20 bonbons, on divise 20 par 4 = 5 bonbons. "
                "Pour trouver les trois quarts de 20 bonbons, on prend 3 fois le quart (3 x 5 = 15 bonbons). "
                "Les situations s'appuient sur des unités de mesure concrètes (longueurs en mètres, masses en grammes, "
                "durées en minutes, contenances en litres)."
            ),
            "source_type": SOURCE_TYPE_DEFAULT,
            "source_ref": SOURCE_REF_MATHS_CYCLE3,
            "source_url": URL_CYCLE3,
            "version": VERSION_MATHS_CYCLE3,
            "license": LICENSE_DEFAULT,
            "embedding_id": None,
        },

        # =========================================================================
        # CYCLE 2 - CE2 - FRANÇAIS : ÉTUDE DE LA LANGUE & GRAMMAIRE
        # =========================================================================
        {
            "id": "chunk_ce2_fr_grammaire_01",
            "cycle": "2",
            "levels": ["CE2"],
            "subject": "Français",
            "domain": "Étude de la langue",
            "topic": "Identification du verbe conjugué",
            "competency_ids": ["comp_c2_fr_verbe_ident"],
            "text": (
                "Identifier le verbe conjugué dans une phrase simple : "
                "Le verbe est le mot qui change de forme lorsque le temps change (passé, présent, futur) "
                "ou lorsque la personne qui fait l'action change (je, tu, nous...). "
                "Méthodes pour le repérer : "
                "1. Encadrer le verbe par la négation 'ne ... pas' (ex: 'Léo mange une pomme' -> 'Léo NE mange PAS de pomme'). "
                "2. Commencer la phrase par 'Hier', 'Aujourd'hui' ou 'Demain' pour observer quel mot se transforme. "
                "L'élève sait également donner l'infinitif du verbe."
            ),
            "source_type": SOURCE_TYPE_DEFAULT,
            "source_ref": SOURCE_REF_CYCLE2,
            "source_url": URL_CYCLE2,
            "version": VERSION_CYCLE2,
            "license": LICENSE_DEFAULT,
            "embedding_id": None,
        },
        {
            "id": "chunk_ce2_fr_grammaire_02",
            "cycle": "2",
            "levels": ["CE2"],
            "subject": "Français",
            "domain": "Étude de la langue",
            "topic": "Identification du sujet du verbe",
            "competency_ids": ["comp_c2_fr_sujet_ident"],
            "text": (
                "Identifier le sujet du verbe dans la phrase : "
                "Le sujet indique qui fait l'action exprimée par le verbe ou de qui on parle. "
                "Pour trouver le sujet, l'élève pose la question : 'Qui est-ce qui + verbe ?' ou 'Qu'est-ce qui + verbe ?'. "
                "On peut également encadrer le sujet par la formule 'C'est ... qui ...' ou 'Ce sont ... qui ...'. "
                "Le sujet peut être un nom propre, un pronom personnel (il, elle, ils, elles...) ou un groupe nominal."
            ),
            "source_type": SOURCE_TYPE_DEFAULT,
            "source_ref": SOURCE_REF_CYCLE2,
            "source_url": URL_CYCLE2,
            "version": VERSION_CYCLE2,
            "license": LICENSE_DEFAULT,
            "embedding_id": None,
        },
        {
            "id": "chunk_ce2_fr_grammaire_03",
            "cycle": "2",
            "levels": ["CE2"],
            "subject": "Français",
            "domain": "Étude de la langue",
            "topic": "Accord sujet-verbe au présent",
            "competency_ids": ["comp_c2_fr_accord_sv"],
            "text": (
                "Maîtriser l'accord du verbe avec son sujet au présent de l'indicatif : "
                "Le verbe s'accorde obligatoirement en personne et en nombre avec son sujet. "
                "Pour les verbes du premier groupe (-er), les terminaisons du présent sont : "
                "-e, -es, -e, -ons, -ez, -ent. "
                "Attention au pluriel : à la 3e personne du pluriel (ils / elles ou un groupe nominal pluriel), "
                "la terminaison du verbe est toujours '-ent' qui ne s'entend pas à l'oral."
            ),
            "source_type": SOURCE_TYPE_DEFAULT,
            "source_ref": SOURCE_REF_CYCLE2,
            "source_url": URL_CYCLE2,
            "version": VERSION_CYCLE2,
            "license": LICENSE_DEFAULT,
            "embedding_id": None,
        },
        {
            "id": "chunk_ce2_fr_grammaire_04",
            "cycle": "2",
            "levels": ["CE2"],
            "subject": "Français",
            "domain": "Étude de la langue",
            "topic": "Le nom et le groupe nominal",
            "competency_ids": ["comp_c2_fr_nom_gn"],
            "text": (
                "Distinguer le nom commun et le nom propre et identifier le déterminant : "
                "Le nom commun désigne une personne, un animal, un objet ou une idée (garçon, chat, table, courage). "
                "Il est presque toujours précédé d'un déterminant (le, la, un, une, des, mon, ce...). "
                "Le nom propre désigne une personne, un pays ou une ville unique et commence toujours par une majuscule "
                "(Paris, Marie, France)."
            ),
            "source_type": SOURCE_TYPE_DEFAULT,
            "source_ref": SOURCE_REF_CYCLE2,
            "source_url": URL_CYCLE2,
            "version": VERSION_CYCLE2,
            "license": LICENSE_DEFAULT,
            "embedding_id": None,
        },
        {
            "id": "chunk_ce2_fr_grammaire_05",
            "cycle": "2",
            "levels": ["CE2"],
            "subject": "Français",
            "domain": "Étude de la langue",
            "topic": "L'adjectif qualificatif et les accords dans le groupe nominal",
            "competency_ids": ["comp_c2_fr_accord_gn"],
            "text": (
                "Identifier l'adjectif qualificatif et accorder le groupe nominal : "
                "L'adjectif qualificatif apporte une précision sur le nom qu'il accompagne (ex: un *grand* arbre *vert*). "
                "Dans le groupe nominal, le déterminant et l'adjectif s'accordent en genre (masculin / féminin) "
                "et en nombre (singulier / pluriel) avec le nom noyau. "
                "Règle générale du pluriel : on ajoute un '-s' au nom et à l'adjectif."
            ),
            "source_type": SOURCE_TYPE_DEFAULT,
            "source_ref": SOURCE_REF_CYCLE2,
            "source_url": URL_CYCLE2,
            "version": VERSION_CYCLE2,
            "license": LICENSE_DEFAULT,
            "embedding_id": None,
        },

        # =========================================================================
        # CYCLE 2 - CE2 - MATHÉMATIQUES : NUMÉRATION ET CALCUL
        # =========================================================================
        {
            "id": "chunk_ce2_maths_nombres_01",
            "cycle": "2",
            "levels": ["CE2"],
            "subject": "Mathématiques",
            "domain": "Nombres et calculs",
            "topic": "Numération décimale jusqu'à 10 000",
            "competency_ids": ["comp_c2_maths_num_10000"],
            "text": (
                "Comprendre et utiliser des nombres entiers pour dénombrer, ordonner et comparer jusqu'à 10 000 : "
                "Principe de la numération de position : la valeur d'un chiffre dépend de sa place dans le nombre "
                "(unités simples, dizaines, centaines, milliers). "
                "1 millier = 10 centaines = 100 dizaines = 1000 unités. "
                "Les élèves apprennent à décomposer un nombre : 4 528 = (4 x 1000) + (5 x 100) + (2 x 10) + 8."
            ),
            "source_type": SOURCE_TYPE_DEFAULT,
            "source_ref": SOURCE_REF_CYCLE2,
            "source_url": URL_CYCLE2,
            "version": VERSION_CYCLE2,
            "license": LICENSE_DEFAULT,
            "embedding_id": None,
        },
        {
            "id": "chunk_ce2_maths_calcul_02",
            "cycle": "2",
            "levels": ["CE2"],
            "subject": "Mathématiques",
            "domain": "Nombres et calculs",
            "topic": "Technique posée de l'addition avec retenue",
            "competency_ids": ["comp_c2_maths_addition_pos"],
            "text": (
                "Mémoriser et appliquer la technique opératoire de l'addition posée en colonnes : "
                "Les nombres sont alignés colonne par colonne (unités sous unités, dizaines sous dizaines, "
                "centaines sous centaines). On commence le calcul par la colonne des unités à droite. "
                "Sens de la retenue : dès que la somme d'une colonne atteint ou dépasse 10, on forme un paquet de 10 "
                "qui bascule sous forme de retenue (+1) dans la colonne immédiatement à gauche."
            ),
            "source_type": SOURCE_TYPE_DEFAULT,
            "source_ref": SOURCE_REF_CYCLE2,
            "source_url": URL_CYCLE2,
            "version": VERSION_CYCLE2,
            "license": LICENSE_DEFAULT,
            "embedding_id": None,
        },
        {
            "id": "chunk_ce2_maths_nombres_03",
            "cycle": "2",
            "levels": ["CE2"],
            "subject": "Mathématiques",
            "domain": "Nombres et calculs",
            "topic": "Nombres pairs et impairs",
            "competency_ids": ["comp_c2_maths_pairs_impairs"],
            "text": (
                "Identifier les nombres pairs et impairs : "
                "Un nombre pair peut être partagé exactement en deux parties entières égales sans reste. "
                "Tout nombre dont le chiffre des unités est 0, 2, 4, 6 ou 8 est un nombre pair. "
                "Un nombre impair se termine par 1, 3, 5, 7 ou 9 ; lorsqu'on le partage en deux parts égales, "
                "il reste toujours 1."
            ),
            "source_type": SOURCE_TYPE_DEFAULT,
            "source_ref": SOURCE_REF_CYCLE2,
            "source_url": URL_CYCLE2,
            "version": VERSION_CYCLE2,
            "license": LICENSE_DEFAULT,
            "embedding_id": None,
        },
    ]


def validate_chunk(chunk: Dict[str, Any]) -> List[str]:
    """
    Validation stricte d'un chunk selon le schéma ai/schemas/official_chunk.json.
    Retourne la liste des erreurs éventuelles.
    """
    errors = []
    required_fields = [
        "id", "cycle", "levels", "subject", "domain", "topic",
        "text", "source_type", "source_ref", "version", "license"
    ]
    for field in required_fields:
        if field not in chunk:
            errors.append(f"Champ obligatoire manquant : {field}")

    if chunk.get("cycle") not in ["1", "2", "3", "4"]:
        errors.append(f"Cycle invalide : {chunk.get('cycle')}")

    levels = chunk.get("levels", [])
    valid_levels = {"CP", "CE1", "CE2", "CM1", "CM2", "6e"}
    if not isinstance(levels, list) or len(levels) == 0:
        errors.append("levels doit être une liste non vide")
    elif not all(lvl in valid_levels for lvl in levels):
        errors.append(f"Niveau invalide dans levels : {levels}")

    if not isinstance(chunk.get("text"), str) or len(chunk.get("text", "")) < 10:
        errors.append("text doit être une chaîne d'au moins 10 caractères")

    if chunk.get("source_type") not in ["BO", "EDUSCOL", "MENJ_DECRET"]:
        errors.append(f"source_type invalide : {chunk.get('source_type')}")

    return errors


def build_and_save_chunks(output_path: Path) -> int:
    """
    Exécute le pipeline d'extraction, validation et écriture au format JSONL.
    """
    records = get_raw_curriculum_records()
    output_path.parent.mkdir(parents=True, exist_ok=True)

    valid_count = 0
    with open(output_path, "w", encoding="utf-8") as f:
        for record in records:
            errors = validate_chunk(record)
            if errors:
                raise ValueError(f"Erreur de validation sur le chunk {record.get('id')}: {errors}")
            f.write(json.dumps(record, ensure_ascii=False) + "\n")
            valid_count += 1

    return valid_count


def main():
    parser = argparse.ArgumentParser(
        description="ETL POPY : Ingestion des programmes officiels Éduscol / BO en JSONL"
    )
    parser.add_argument(
        "--output",
        "-o",
        type=Path,
        default=Path("ai/datasets/ds-rag-official/chunks_v0.jsonl"),
        help="Chemin de sortie du fichier JSONL",
    )
    args = parser.parse_args()

    print(f"🚀 [ETL] Démarrage de l'ingestion des programmes officiels...")
    count = build_and_save_chunks(args.output)
    print(f"✅ [ETL] Succès : {count} chunks officiels générés et validés dans {args.output}")


if __name__ == "__main__":
    main()

