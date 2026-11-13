#!/usr/bin/env python3
"""
Génère le script SQL d'insertion (Seed) pour charger les chunks officiels dans PostgreSQL.
Lit ai/datasets/ds-rag-official/chunks_v0.jsonl -> backend/prisma/seed_official_chunks.sql
"""

import json
from pathlib import Path

INPUT_PATH = Path("ai/datasets/ds-rag-official/chunks_v0.jsonl")
OUTPUT_PATH = Path("backend/prisma/seed_official_chunks.sql")


def escape_sql(text: str) -> str:
    """Échappe les apostrophes pour PostgreSQL."""
    if text is None:
        return "NULL"
    return "'" + str(text).replace("'", "''") + "'"


def format_text_array(items: list) -> str:
    """Formate une liste Python en tableau PostgreSQL TEXT[]."""
    if not items:
        return "ARRAY[]::TEXT[]"
    escaped_items = ["'" + str(x).replace("'", "''") + "'" for x in items]
    return "ARRAY[" + ", ".join(escaped_items) + "]::TEXT[]"


def main():
    if not INPUT_PATH.exists():
        raise FileNotFoundError(f"Dataset introuvable : {INPUT_PATH}")

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    statements = [
        "-- Seed initial des chunks officiels POPY Academy",
        "-- Source : Éduscol / BO (Licence Ouverte Etalab)",
        "BEGIN;\n"
    ]

    with open(INPUT_PATH, "r", encoding="utf-8") as f:
        for line in f:
            chunk = json.loads(line.strip())
            levels_sql = format_text_array(chunk.get("levels", []))
            comp_sql = format_text_array(chunk.get("competency_ids", []))
            
            stmt = f"""INSERT INTO "official_chunks" (
    "id", "cycle", "levels", "subject", "domain", "topic",
    "competency_ids", "text", "source_type", "source_ref", "source_url",
    "version", "license", "is_active", "created_at", "updated_at"
) VALUES (
    {escape_sql(chunk['id'])},
    {escape_sql(chunk['cycle'])},
    {levels_sql},
    {escape_sql(chunk['subject'])},
    {escape_sql(chunk['domain'])},
    {escape_sql(chunk['topic'])},
    {comp_sql},
    {escape_sql(chunk['text'])},
    {escape_sql(chunk['source_type'])},
    {escape_sql(chunk['source_ref'])},
    {escape_sql(chunk.get('source_url'))},
    {escape_sql(chunk.get('version', '2025-04'))},
    {escape_sql(chunk.get('license'))},
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO UPDATE SET
    "topic" = EXCLUDED."topic",
    "text" = EXCLUDED."text",
    "source_ref" = EXCLUDED."source_ref",
    "version" = EXCLUDED."version",
    "updated_at" = CURRENT_TIMESTAMP;
"""
            statements.append(stmt)

    statements.append("COMMIT;\n")

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(statements))

    print(f"✅ [Seed SQL] Script généré avec succès dans {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
