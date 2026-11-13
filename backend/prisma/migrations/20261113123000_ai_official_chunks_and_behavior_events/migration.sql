-- CreateTable
CREATE TABLE "official_chunks" (
    "id" TEXT NOT NULL,
    "cycle" TEXT NOT NULL,
    "levels" TEXT[],
    "subject" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "competency_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "text" TEXT NOT NULL,
    "source_type" TEXT NOT NULL DEFAULT 'BO',
    "source_ref" TEXT NOT NULL,
    "source_url" TEXT,
    "version" TEXT NOT NULL DEFAULT '2025-04',
    "license" TEXT NOT NULL DEFAULT 'Licence Ouverte v2.0 (Etalab) / Citation pédagogique',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text_search" tsvector GENERATED ALWAYS AS (to_tsvector('french', coalesce("topic", '') || ' ' || coalesce("text", ''))) STORED,

    CONSTRAINT "official_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "behavior_events" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL,
    "schema_version" TEXT NOT NULL DEFAULT '1.2',
    "device" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "child_id_hash" TEXT NOT NULL,
    "sync_policy" TEXT,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "behavior_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "official_chunks_subject_cycle_idx" ON "official_chunks"("subject", "cycle");
CREATE INDEX "official_chunks_is_active_idx" ON "official_chunks"("is_active");
CREATE INDEX "official_chunks_text_search_idx" ON "official_chunks" USING GIN ("text_search");

-- CreateIndex
CREATE UNIQUE INDEX "behavior_events_event_id_key" ON "behavior_events"("event_id");
CREATE INDEX "behavior_events_session_id_idx" ON "behavior_events"("session_id");
CREATE INDEX "behavior_events_child_id_hash_idx" ON "behavior_events"("child_id_hash");
CREATE INDEX "behavior_events_type_idx" ON "behavior_events"("type");
CREATE INDEX "behavior_events_ts_idx" ON "behavior_events"("ts");

