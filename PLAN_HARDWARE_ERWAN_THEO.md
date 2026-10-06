# Plan Hardware & IoT — Erwan & Théo  
**Popy Academy · Robot physique + intégration · octobre 2026 → juin 2027**

> **Version :** 1.0 — 2026-10-06  
> **Statut :** document vivant — sera croisé avec les 7 collaborateurs.  
> **Public :** Erwan · Théo · lead produit.  
> **Objectif non négociable :** en **juin 2027**, le **robot physique** et l’**application** sont terminés pour la démo / préprod projet (PC utilisable seul ; robot = complément intégré).  
> **Références :** `BACKEND_SPECIFICATIONS.md` §10 · `PEDAGOGICAL_AI_PLAN.md` · `PLAN_IA_SONIA_PIERRE_ALEXIS.md` · `BACKEND_IMPLEMENTATION_TRACKER.md`

---

## Comment utiliser ce document

1. Lire d’abord **§0 État des lieux** (ne pas refaire l’API robot déjà amorcée).
2. Avancer en **sprints de 2 semaines** ; cocher les IDs dans `HARDWARE_IOT_TRACKER.md` (à créer au kickoff).
3. Toute décision mécanique / protocole / radio = **ADR** `docs/adr/HW-XXX.md`.
4. Sécurité robot (arrêt d’urgence, révocation) = priorité absolue sur les features « fun ».
5. Mapping des 7 collabs : **§16** (à compléter).  
6. **Travaux croisés :** [`PLAN_COORDINATION_7.md`](PLAN_COORDINATION_7.md) — surtout X05, X06, X04, G1, G4.

---

## 0. État des lieux — ce qui existe DÉJÀ

### 0.1 Décisions produit déjà figées

| Décision | Statut |
|----------|--------|
| L’app fonctionne **sans robot** (ordinateur d’abord) | Fait |
| Robot = **optionnel**, jamais requis pour apprendre | Fait |
| Même moteur pédagogique pour Web et Robot | Cadré (IA) |
| Pas de stockage inutile d’images / audio bruts | Spec backend |
| Appairage mutuellement authentifié, urgence, OTA signée, révocation | Spec §10 — **à implémenter côté device** |

### 0.2 Déjà dans le logiciel (réutilisable)

| Élément | État | Où | Pour vous |
|---------|------|-----|-----------|
| API robots (register, pair, command, emergency-stop, revoke) | MVP serveur | `backend/src/routes/robots.ts` | Client robot doit parler **ce contrat** (à enrichir) |
| Prisma `robot_devices`, `robot_pairings`, `robot_events` | OK | `schema.prisma` | Étendre champs firmware / batterie si besoin |
| Tests pairing + urgence | OK | `backend/tests/privacy-robot.test.ts` | Garder verts |
| UI simulateur robot (front) | Démo | `ProductTools.tsx` → `RobotSimulator` | Remplacer progressivement par vrai device |
| Pages « Robot (optionnel) » parent / enseignant / admin | UI | Interfaces | Brancher états réels |
| Auth JWT + RBAC (TEACHER/ADMIN : robot:write, emergency) | OK | API | Le robot n’utilise **pas** le compte enfant email |
| WebSocket `/realtime/ws` | MVP | Diffusion événements | Utile pour statut batterie / online |
| Spec protocole attendu | Doc | `BACKEND_SPECIFICATIONS.md` §10 | Checklist de conformité |

### 0.3 Ce qui N’existe PAS (votre chantier principal)

| Absent | À livrer |
|--------|----------|
| Robot physique (BOM, mécanique, électronique) | Prototype → démo juin 2027 |
| Firmware embarqué | Mouvements, LED, audio, sécurité |
| Client IoT (agent robot) | Appairage, heartbeat, commandes, cache offline |
| OTA signée réelle | Pipeline update |
| Capteurs / télémétrie terrain | Events normalisés (méta, pas média brut) |
| Homologation / checklist sécurité physique | Doc + procédures |
| Dossier `robot/` ou `hardware/` dans le monorepo | À créer Sprint 0 |

### 0.4 Principe d’architecture (aligné IA)

```
                 POPY ACADEMY (cloud/API)
                        │
              Moteur pédagogique + /robots/*
                        │
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
     Web/App         Agent IoT       Enseignant
   (sans robot OK)   (sur robot)     (commande)
                        │
                   Firmware / HW
```

Le robot est un **client** du même backend. Il ne réinvente pas la pédagogie.

### 0.5 Lancer l’existant logiciel

```bash
docker compose up -d
# API :5001  Front :8443
# Compte enseignant démo : enseignant.demo@example.invalid / DemoPassw0rd!
```

### 0.6 Achats composants (BOM)

**Document d’achats unique (v4 — robot + cloud/cyber + IA) :**  
[`robot/bom/BOM_ACHATS_POPY.md`](robot/bom/BOM_ACHATS_POPY.md)

| | |
|--|--|
| **Total projet à provisionner** | **≈ 3 700 €** (§0 du BOM) |
| **A — Robot Performance** | **2 900 €** — Jetson **Orin NX 16 Go** |
| **B — Cloud & cyber** | **700 €** — hébergement UE 9 mois + marge (§13) |
| **C — Crédits LLM** | **100 €** (§14) |
| **Repli robot Nano** | 1 700 € robot → total projet **≈ 2 500 €** |
| **Owners achats** | Erwan/Théo (A) · **Mériem/Fabio** (B) · Sonia (C) | 

---

## 1. Mission du binôme Erwan & Théo

Livrer d’ici **juin 2027** :

1. Un **prototype robot POPY** démontrable (mouvement basique, LED, voix/volume, arrêt d’urgence).  
2. Un **agent IoT** fiable (appairage, session, heartbeat, commandes, offline cache).  
3. L’**intégration** complète avec l’application (statut, commandes, urgence, sync progression).  
4. Documentation fabrication, sécurité, OTA, limites.

### Répartition nominative (ajustable)

| Domaine | Owner principal | Backup |
|---------|-----------------|--------|
| Mécanique / structure / impression / assemblage | **Erwan** | Théo |
| Électronique / alimentation / moteurs / PCB | **Erwan** | Théo |
| Firmware embarqué (MCU) | **Théo** | Erwan |
| Agent IoT / protocole / sécurité crypto device | **Théo** | Erwan |
| OTA + CI firmware | **Théo** | Erwan |
| Intégration API `/robots` + events | **Théo** | + backend |
| Capteurs / télémétrie (méta) | **Erwan** (HW) + **Théo** (firmware) | |
| Sécurité physique + E-stop | **Les deux** | Lead |
| Doc BOM / assemblage / soutenance | **Les deux** | |

### Hors périmètre (sauf demande)

- NLP / RAG / fine-tune (Sonia & Pierre-Alexis) — vous **consommez** `/pedagogy/ask`  
- UI marketing React complète  
- Rédaction des exercices pédagogiques  
- Hébergement cloud prod  

---

## 2. Exigences produit juin 2027 (Definition of Done robot)

Le lot Hardware/IoT est **terminé** pour juin 2027 quand :

| # | Critère | Preuve |
|---|---------|--------|
| 1 | Robot physique démarre, se connecte, s’appaire à l’API | Vidéo + logs |
| 2 | Arrêt d’urgence **prioritaire** (local + API) | Test protocole |
| 3 | Commandes : move basique, LED, volume/voix (ou TTS local) | Démo scriptée |
| 4 | Heartbeat + batterie + statut online/offline visibles dans l’app | UI parent/enseignant |
| 5 | Cache local d’activités : robot utile **offline** (activités déjà téléchargées) | Test coupe-réseau |
| 6 | Progression sync au retour réseau (même enfant / compétence) | Lien sync API |
| 7 | Révocation device compromise | Test API revoke |
| 8 | OTA : au moins **un** canal d’update signé (même artisanal mais documenté) | Procédure + essai |
| 9 | App 100 % utilisable **sans** robot | Non-régression |
| 10 | Dossier technique HW + risques + BOM | Doc soutenance |

**Hors DoD juin (backlog post) :** production série, certification CE complète, navigation SLAM avancée, bras manipulateur complexe, vision identitaire (interdite).

---

## 3. Stack & hypothèses techniques (à figer Sprint 0)

> Les choix exacts MCU / SBC sont une **ADR obligatoire** avant achats lourds.

| Couche | Options recommandées (à trancher) | Contrainte |
|--------|-----------------------------------|------------|
| Cerveau haut niveau | Raspberry Pi 4/5 **ou** équivalent | Wi-Fi, cache activités, agent IoT |
| MCU temps réel | ESP32 / STM32 | Moteurs, E-stop, LED, safety loop |
| Liaison MCU↔SBC | UART / USB | Watchdog |
| Radio | Wi-Fi (priorité école) ; BLE optionnel appairage | Pas de dépendance cloud propriétaire opaque |
| Audio | Speaker + amp ; micro **opt-in** | Pas d’enregistrement brut stocké par défaut |
| Alim | Batterie + BMS + coupe-circuit E-stop | Autonomie démo ≥ 45–60 min |
| Agent IoT | Python ou Rust/Go sur SBC | TLS vers API |
| Secrets device | `pairing_secret` + device credentials | Rotation / revoke |

**Décision Sprint 0 écrite :** architecture **SBC + MCU** (recommandé) vs MCU seul.

---

## 4. Protocole logiciel (contrat avec le backend)

### 4.1 Déjà exposé (MVP) — à respecter puis enrichir

| Méthode | Rôle |
|---------|------|
| `POST /robots/register` | Créer device + `pairing_secret` |
| `POST /robots/:id/pair` | Appairage (secret + child/class optionnel) |
| `POST /robots/:id/command` | `move\|led\|voice\|volume\|stop\|profile` |
| `POST /robots/:id/emergency-stop` | Priorité 0 |
| `POST /robots/:id/revoke` | Compromission |
| `GET /robots` | Liste / statut |

### 4.2 À ajouter avec collab backend (backlog protocole)

| Endpoint / canal | Usage |
|------------------|--------|
| `POST /robots/:id/heartbeat` | Batterie, firmware, RSSI, online |
| `GET /robots/:id/commands/poll` ou WS | File de commandes si pas de push |
| `POST /robots/:id/events` | Events normalisés (meta) |
| `GET /robots/:id/activity-cache` | Manifest activités à précharger |
| Auth device (JWT device ou mTLS) | Au-delà du simple pairing_secret démo |

### 4.3 Format event robot (aligné IA behavior)

```json
{
  "robot_id": "…",
  "event_type": "heartbeat|command_ack|estop|offline|cache_sync",
  "severity": "info|warning|critical",
  "payload": {
    "battery_pct": 73,
    "firmware": "1.2.0",
    "child_id": null,
    "note": "pas d’image brute"
  },
  "occurred_at": "ISO-8601"
}
```

---

## 5. Calendrier global → juin 2027

| Période | Phase | Résultat |
|---------|-------|----------|
| oct–nov 2026 | **HW0** Cadrage & BOM | ADR archi, budget, maquette papier |
| déc 2026 | **HW1** Proto électronique | Breadboard : moteurs + E-stop + LED |
| jan–fév 2027 | **HW2** Mécanique v1 + firmware v1 | Châssis bouge, agent hello API |
| mars 2027 | **HW3** Intégration app | Statut + commandes dans UI réelle |
| avr 2027 | **HW4** Offline + pédagogie | Cache activités + ask pedagogy |
| mai 2027 | **HW5** OTA + durcissement | Update signée, revoke, endurance |
| **juin 2027** | **HW6** Freeze démo | Robot + app terminés pour soutenance |

---

## 6. Sprints détaillés (2 semaines)

Légende : **E** = Erwan · **T** = Théo · estimations en jours-homme.

---

### SPRINT H0 — 6→19 oct 2026 — Kickoff & architecture

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| H0-1 | E+T | Kickoff : lire ce plan + spec §10 + API robots existante | CR | Décisions listées | 0.5 |
| H0-2 | E+T | ADR-HW-001 : SBC+MCU vs MCU seul | ADR | Validé lead | 1 |
| H0-3 | E | Esquisse mécanique (dimensions, matériaux, sécurité enfant) | PDF/CAD rough | Contraintes âge | 2 |
| H0-4 | T | Spéc agent IoT (process, états, watchdog) | `robot/docs/agent_spec.md` | Review | 1.5 |
| H0-5 | T | Inventaire API existante + gaps protocole | Doc gaps | Liste endpoints manquants | 1 |
| H0-6 | E | BOM v0 + budget prévisionnel **à partir de** `robot/bom/BOM_ACHATS_POPY.md` | Tableur + devis RS/Kubii | Validé lead | 1.5 |
| H0-6b | T | Vérifier stock Jetson RS vs Kubii + capturer prix du jour | CR + lien | Commande vague 1 prête | 0.5 |
| H0-7 | E+T | Créer arborescence `robot/` + `HARDWARE_IOT_TRACKER.md` | Repo | README | 0.5 |
| H0-8 | E+T | Matrice risques sécurité physique | Doc | Top 10 | 1 |

**Revue :** ADR signée + BOM v0.

---

### SPRINT H1 — 20 oct→2 nov 2026 — Sécurité & E-stop d’abord

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| H1-1 | E | Conception coupe-circuit / bouton E-stop matériel | Schéma | Appui = coupure moteurs | 2 |
| H1-2 | T | State machine firmware : SAFE / ACTIVE / ESTOP / REVOKED | Doc + code stub | Tests unitaires logique | 2 |
| H1-3 | T | Priorité commande `stop` / `emergency` sur toute file | Spec | Test ordre | 1 |
| H1-4 | E | Choix moteurs + drivers (couple limité, anti-pincement) | ADR-HW-002 | Achats validés | 1.5 |
| H1-5 | T | Client HTTP prototype : `register` + `pair` contre API locale | Script | 200 OK | 1.5 |
| H1-6 | E+T | Checklist « robot et enfant » (doigts, bords, chaleur) | Doc | Revue | 1 |

---

### SPRINT H2 — 3→16 nov 2026 — Proto électrique

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| H2-1 | E | Alim + BMS + mesures courant | Banc | Rapport | 2.5 |
| H2-2 | E | Breadboard moteurs 2 axes + LED | Proto | Move avant/arrière | 3 |
| H2-3 | T | Firmware MCU : PWM moteurs + LED + lecture E-stop | Firmware v0.1 | Démo banc | 3 |
| H2-4 | T | Heartbeat simulé → `robot_events` (via script API) | Events en DB | Visible SQL | 1.5 |
| H2-5 | E | Capteur obstacle basique (ultrason/IR) optionnel v1 | Proto | Stop si seuil | 2 |

---

### SPRINT H3 — 17→30 nov 2026 — Maquette mécanique v0

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| H3-1 | E | CAD v0 châssis + supports | Fichiers CAD | Export STL | 3 |
| H3-2 | E | Impression / découpe pièces v0 | Pièces | Assemblage à la main | 2.5 |
| H3-3 | E+T | Intégration breadboard dans coque ouverte | Maquette | Roule 2 m | 2 |
| H3-4 | T | Agent SBC hello world (si ADR SBC) | Image OS doc | Boot + Wi-Fi | 2 |
| H3-5 | T | TLS / config `API_BASE_URL` device | Config | Doc flash | 1 |
| H3-6 | E+T | Photos proto + journal de bord | `robot/journal/` | 1 entrée/semaine | 0.5 |

**Jalon fin nov :** maquette qui bouge + parle à l’API (même minimal).

---

### SPRINT H4 — 1→14 déc 2026 — Appairage réel & commandes

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| H4-1 | T | Flux complet register → pair → command `led` / `move` | Agent v0.2 | Tests E2E | 3 |
| H4-2 | T | Ack commandes + event `command_ack` | Code | Trace DB | 1.5 |
| H4-3 | T | Mapping command API → firmware | Table | Doc | 1 |
| H4-4 | E | Fix mécanique v0.1 (rigidité, câbles) | Itération | Moins de pannes | 2.5 |
| H4-5 | E | Mesure bruit / chaleur / autonomie démo | Rapport | Chiffres | 1.5 |
| H4-6 | E+T | Geler BOM « commande Noël » si délais fournisseurs | BOM v1 | Lead OK | 1 |

**Freeze mi-déc → début jan :** commandes fournisseurs, doc, pas de redesign majeur.

---

### SPRINT H5 — 5→18 jan 2027 — Firmware v1 + batterie

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| H5-1 | T | Firmware v1.0 tags git | Release | Notes | 2 |
| H5-2 | T | Watchdog MCU + redémarrage safe | Code | Test kill process | 1.5 |
| H5-3 | E | Intégration batterie finale proto | HW | Autonomie ≥ 45 min | 3 |
| H5-4 | T | Heartbeat périodique (batterie, firmware) | API enrichie | UI peut afficher | 2 |
| H5-5 | E | Bouton E-stop accessible + marquage | HW | Essai utilisateur | 1 |
| H5-6 | T | Mode REVOKED : ignore commandes sauf diagnostic local | Code | Test revoke API | 1.5 |

---

### SPRINT H6 — 19 jan→1 fév 2027 — Voix / LED / UX robot

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| H6-1 | E | Audio path (HP + amp) | HW | Volume commandable | 2 |
| H6-2 | T | Commande `volume` + `voice` (TTS local ou clips) | Firmware/agent | 3 phrases démo | 3 |
| H6-3 | T | Patterns LED (idle, listening, success, estop) | Code | Doc patterns | 1.5 |
| H6-4 | E | Esthétique coque v1 (sécurisée) | CAD v1 | Pas d’arêtes vives | 3 |
| H6-5 | E+T | Scénario démo 5 min scripté | Script | Répétable | 1 |

---

### SPRINT H7 — 2→15 fév 2027 — Intégration application (UI réelle)

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| H7-1 | T | Avec front/backend : remplacer simulateur par statut live | PR | Parent voit batterie | 3 |
| H7-2 | T | Enseignant : pause / resume / estop depuis UI | PR | RBAC respecté | 2 |
| H7-3 | T | WS ou poll : online/offline < 10 s | Code | Mesure | 2 |
| H7-4 | E | Support atelier pour démos classe | Accessoire | Stable | 1.5 |
| H7-5 | E+T | Tests non-régression « app sans robot » | Checklist | 100 % OK | 1 |
| H7-6 | T | Logs device rotatifs sans PII enfant | Config | Doc | 1 |

**Jalon mi-fév :** robot visible et commandable depuis l’app.

---

### SPRINT H8 — 16 fév→1 mars 2027 — Offline & cache activités

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| H8-1 | T | Manifest cache activités (liste content_ids) | Format JSON | Spec | 1.5 |
| H8-2 | T | Download + stockage local SBC | Agent | 10 activités | 3 |
| H8-3 | T | Mode offline : exécuter activité cache | Demo | Coupe Wi-Fi | 2 |
| H8-4 | T | Reprise sync progression via API sync/pedagogy | Code | XP/compétence OK | 2.5 |
| H8-5 | E | Conso énergie offline vs online | Mesures | Tableau | 1 |
| H8-6 | E+T | Doc enseignant « que faire si plus de réseau » | 1 page | Validé product | 0.5 |

---

### SPRINT H9 — 2→15 mars 2027 — Pédagogie sur robot

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| H9-1 | T | Client `POST /pedagogy/ask` depuis agent (device=robot) | Code | Réponse grounded | 2.5 |
| H9-2 | T | Affichage/lecture réponse (LED + voice) | UX | Pas d’invention locale | 2 |
| H9-3 | T | Continuité : enfant fait 5 exos sur PC → robot reprend compétence | Scénario E2E | Avec IA/backend | 3 |
| H9-4 | E | Confort interaction (hauteur, boutons gros) | HW itération | Essai enfant si possible | 2 |
| H9-5 | E+T | Interdit : robot ne stocke pas le référentiel pour « inventer » | Policy | Review Sonia | 0.5 |

**Jalon fin mars :** parcours hybride PC → robot démontrable.

---

### SPRINT H10 — 16→29 mars 2027 — Durcissement terrain

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| H10-1 | E | Endurance 2 h cycle move/stop | Rapport | 0 incident critique | 2 |
| H10-2 | T | Fuzz commandes API / mauvais secrets | Rapport | Aucun unsafe | 2 |
| H10-3 | T | Gestion perte Wi-Fi / reconnexion | Code | Recouvrement auto | 2 |
| H10-4 | E | Révision thermique / câblage | HW | Photos avant/après | 1.5 |
| H10-5 | E+T | Mise à jour matrice risques | Doc | Signée | 1 |

---

### SPRINT H11 — 30 mars→12 avr 2027 — OTA v1

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| H11-1 | T | ADR-HW-010 stratégie OTA (signed bundle) | ADR | Validé | 1 |
| H11-2 | T | Pipeline build firmware + checksum/signature | CI scripts | Reproductible | 3 |
| H11-3 | T | Procédure update + rollback | Doc | Essai réussi | 2.5 |
| H11-4 | E | Accès physique port flash / recovery | HW | Doc | 1.5 |
| H11-5 | T | Event `ota_success` / `ota_fail` | API | Logs | 1 |

---

### SPRINT H12 — 13→26 avr 2027 — Capteurs & events IA

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| H12-1 | E+T | Publier méta-events vers pipeline behavior (PA) | Contrat | Pas de média brut | 2 |
| H12-2 | T | Flag capteurs micro/caméra **off by default** | Config | Parent opt-in | 1.5 |
| H12-3 | E | Si caméra présente : obturateur physique recommandé | HW | Photo | 2 |
| H12-4 | T | Alignement avec `PLAN_IA` § vision opt-in | CR joint | OK PA | 1 |
| H12-5 | E+T | Tests app **vision off / robot on** | Checklist | OK | 1 |

---

### SPRINT H13 — 27 avr→10 mai 2027 — Coque finale démo + admin flot

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| H13-1 | E | Coque démo v2 (aspect soutenance) | Assemblage | Esthétique OK | 3 |
| H13-2 | T | Admin « Parc de robots » : données live (avec front) | PR | 1 device réel | 2.5 |
| H13-3 | T | Révocation + re-pair documentés | Runbook | Essai | 1.5 |
| H13-4 | E | Kit transport démo | Caisse | Checklist | 1 |
| H13-5 | E+T | Vidéo technique 3 min | MP4 | Backup démo | 1.5 |

---

### SPRINT H14 — 11→31 mai 2027 — Freeze robot démo

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| H14-1 | E+T | Freeze BOM + firmware tag `demo-juin-2027` | Tags | Immutable | 1 |
| H14-2 | T | Scénario soutenance robot (8–10 min) | Script | Répété 3× | 2 |
| H14-3 | E | Pièces de rechange critiques | Stock | Liste | 1 |
| H14-4 | E+T | Non-régression app alone | Checklist | Signée | 1 |
| H14-5 | E+T | Buffer bugs P0/P1 only | — | Liste fermée | 3 |

---

### SPRINT H15 — juin 2027 — Livraison

| ID | Owner | Tâche | Sortie | Acceptation | Est. |
|----|-------|-------|--------|-------------|------|
| H15-1 | E+T | Dossier HW/IoT final | `docs/DOSSIER_ROBOT_JUIN2027.md` | Relu lead | 4 |
| H15-2 | E | Chapitre mécanique / électronique / BOM | Inclus | — | 2 |
| H15-3 | T | Chapitre firmware / agent / OTA / sécu | Inclus | — | 2 |
| H15-4 | E+T | Démo finale robot + app | — | DoD §2 vert | 2 |
| H15-5 | E+T | Handover maintenance | README robot | Tiers rejoue flash | 1 |
| H15-6 | E+T | Backlog post-juin (série, CE, etc.) | Liste | Priorisée | 0.5 |

---

## 7. Sécurité (checklist permanente)

### 7.1 Sécurité physique
- [ ] E-stop accessible et testé chaque sprint hardware  
- [ ] Limitation couple / vitesse  
- [ ] Pas d’arêtes vives ; stabilité anti-basculement  
- [ ] Température surface acceptable  
- [ ] Batterie avec protection (court-circuit, overcharge)  

### 7.2 Sécurité cyber
- [ ] Secrets device non commités  
- [ ] TLS vers API  
- [ ] Revoke efficace  
- [ ] Commandes authentifiées  
- [ ] Logs sans donnée personnelle enfant  
- [ ] Cam/micro off by default  

### 7.3 Sécurité pédagogique
- [ ] Robot n’invente pas le programme (passe par moteur grounded)  
- [ ] Offline = contenus déjà validés en cache seulement  

---

## 8. Arborescence cible

```
robot/
  README.md
  HARDWARE_IOT_TRACKER.md
  docs/
    adr/
    agent_spec.md
    assembly.md
    safety.md
    ota.md
    journal/
  bom/
  cad/
  firmware/          # MCU
  agent/             # SBC IoT client
  scripts/           # flash, pair, smoke
  demos/
hardware/            # optionnel photos, PDF fab
```

---

## 9. Rituals & reporting (pour le lead)

### Hebdo Erwan ↔ Théo (45 min)
- Avancement IDs  
- Achats / délais fournisseurs  
- Incidents sécurité  
- Besoins backend/front/IA  

### Bi-hebdo avec lead
- Burndown  
- Risque démo juin  
- Budget  

### Format statut vendredi

```
Sprint: H…
Done: …
In progress: …
Blocked: … (attente: collab X / fournisseur Y)
Hardware health: OK|DEGRADED
Demo risk: low|med|high
Next week: …
```

---

## 10. RACI (extrait)

| Activité | Erwan | Théo | Lead | Backend | Front | IA | Pédagogie |
|----------|-------|------|------|---------|-------|----|-----------|
| BOM / mécanique | R | C | A | I | I | I | I |
| Firmware MCU | C | R | A | I | I | I | I |
| Agent IoT | C | R | A | C | I | C | I |
| API robots enrichie | I | C | A | R | C | I | I |
| UI statut robot | I | C | A | C | R | I | I |
| Pedagogy on robot | I | R | A | C | I | R | C |
| OTA | C | R | A | C | I | I | I |
| Dossier juin | R | R | A | C | C | C | I |

---

## 11. Dépendances vers les autres

> Vue complète multi-équipes : [`PLAN_COORDINATION_7.md`](PLAN_COORDINATION_7.md).

| Besoin | Collab | Quand |
|--------|--------|-------|
| Endpoints heartbeat / device auth | Fabio / API | dès H4–H5 |
| UI live statut / estop | Frontend | H7 |
| `/pedagogy/ask` + sync progression | **Sonia** / PA (X01, X06) | H8–H9 |
| Contenu cache activités | Pédagogie | H8 |
| Consentement capteurs / notice robot | **Yacine** (X04, G1) | H12 / avant caméra |
| Préprod HTTPS pour tests device | **Mériem** (X07) | dès agent réseau |

---

## 12. Risques

| ID | Risque | Mitigation | Owner |
|----|--------|------------|-------|
| RH1 | Retard fournisseurs | BOM tôt ; pièces alternatives | E |
| RH2 | Scope robot trop ambitieux | DoD juin strict ; pas de SLAM | Lead+E+T |
| RH3 | Sécurité enfant | E-stop first ; revue mensuelle | E+T |
| RH4 | API incomplète | Gaps listés H0 ; stubs agent | T |
| RH5 | Robot retarde l’app | App never blocked ; simulateur interim | T+Front |
| RH6 | OTA bancale | Rollback obligatoire | T |
| RH7 | Survente vision | Off by default ; meta only | E+T+PA |

---

## 13. Scénarios démo juin 2027 (robot)

1. Appairage enseignant → robot online dans l’UI.  
2. LED + move + voix.  
3. E-stop hardware **et** software.  
4. Coupe Wi-Fi → activité cache continue.  
5. Retour réseau → sync.  
6. Enfant : suite de séance PC sur robot (« on continue les fractions ? »).  
7. Revoke device → robots n’accepte plus les commandes.  
8. App utilisée **sans** robot à côté (preuve non-dépendance).

---

## 14. Brief manager (à leur lire)

> Erwan, Théo : vous livrez le robot physique et son IoT jusqu’à juin 2027, intégré à l’app.  
> L’application doit rester 100 % utilisable sans robot.  
> Vous réutilisez l’API `/robots` existante et vous l’étendez avec le backend.  
> **Achats :** suivez `robot/bom/BOM_ACHATS_POPY.md` (Jetson NVIDIA Orin Nano Super chez RS/Kubii, ESP32, châssis, E-stop, etc.).  
> Sécurité (E-stop, revoke, pas de média brut) avant les features avancées.  
> La pédagogie passe par le moteur central (pas d’IA locale qui invente le programme).  
> Sprints de 2 semaines, tracker, statut vendredi, ADR pour les choix HW.  
> En juin : robot + app terminés pour la démo projet.

---

## 15. Onboarding 48h

**Jour 1 :** lire §0–2, spec §10, tester `POST /robots/*` sur API locale, lister matériel dispo.  
**Jour 2 :** ADR-HW-001, arborescence `robot/`, BOM v0 draft, premier smoke `register/pair`.

---

## 16. Mapping 7 collaborateurs (à compléter)

| # | Nom | Domaine | Lien avec Erwan/Théo |
|---|-----|---------|----------------------|
| 1 | Sonia | NLP / RAG | Pedagogy on robot |
| 2 | Pierre-Alexis | Vision / behavior | Events meta, vision opt-in |
| 3 | **Erwan** | Hardware mécanique/électro | — |
| 4 | **Théo** | Firmware / IoT / agent | — |
| 5 | **Mériem** | Cloud / infra | HTTPS, préprod, backups |
| 6 | **Fabio** | Cybersécurité | Revoke, rate robots, secrets device |
| 7 | **Yacine** | RGPD / privacy | Notice robot, opt-in capteurs, AIPD |

---

## 17. Historique

| Version | Date | Changement |
|---------|------|------------|
| 1.0 | 2026-10-06 | Création plan Erwan & Théo → juin 2027 (app + robot terminés) |
