# Plan RGPD & Privacy — Yacine  
**Popy Academy · octobre 2026 → juin 2027**

> **Version :** 1.0 — 2026-10-06  
> **Statut :** document vivant — croisé avec les 7 collaborateurs.  
> **Public :** Yacine · lead produit · Mériem · Fabio (support technique).  
> **Objectif non négociable :** en **juin 2027**, POPY dispose d’un **cadre RGPD complet et démontrable** (registre, bases légales, consentements, droits des personnes, AIPD si besoin, clauses hébergeur, notices lisibles) — pas seulement des endpoints techniques.  
> **Références :** `BACKEND_SPECIFICATIONS.md` §8 · `docs/BACKEND_HARDENING.md` · `PEDAGOGICAL_AI_PLAN.md` · `PLAN_IA_SONIA_PIERRE_ALEXIS.md` · `PLAN_CLOUD_CYBER_MERIEM_FABIO.md` · `PLAN_HARDWARE_ERWAN_THEO.md` · `robot/bom/BOM_ACHATS_POPY.md`

---

## Comment utiliser ce document

1. Lire **§0** (ce qui existe déjà côté code vs ce qui manque côté conformité).  
2. Avancer en **sprints de 2 semaines** ; cocher les IDs dans `RGPD_TRACKER.md` (à créer au kickoff).  
3. Toute décision privacy structurante = **ADR** `docs/adr/RGPD-XXX.md` **ou** fiche dans `docs/privacy/`.  
4. Yacine **pilote** le RGPD ; Mériem/Fabio **implémentent** le technique ; Sonia/PA **fournissent** les inputs IA/vision ; Erwan/Théo **respectent** minimisation robot.  
5. Mapping 7 collabs : **§15**.  
6. **Travaux croisés :** [`PLAN_COORDINATION_7.md`](PLAN_COORDINATION_7.md) — Yacine est au centre des gates G1–G3 et des livrables X03, X04, X08, X14.

---

## 0. État des lieux — ce qui existe DÉJÀ

### 0.1 Décisions produit déjà figées

| Décision | Statut |
|----------|--------|
| Pas de publicité / pas de profilage commercial | Spec |
| Hébergement européen ou souverain | Spec — déploiement = Mériem |
| Minimisation des données | Spec |
| Consentement traçable | Spec + modèle Prisma |
| Export structuré + droit à l’effacement | MVP API |
| Caméra / micro / vision = **opt-in**, off by default | Plans IA + Hardware |
| Pas de diagnostic médical / psy automatique | Spec IA |
| AIPD avant biométrie / émotion | Spec §8 |
| PIN parental = local client (pas auth serveur) | Hardening doc |

### 0.2 Déjà dans le logiciel (réutilisable)

| Élément | État | Où | Pour toi |
|---------|------|-----|----------|
| `GET /exports/:childId` | MVP | `backend/src/routes/privacy.ts` | Spécifier format « lisible humain », délais, qui peut demander |
| `PATCH /privacy/:childId` + effacement | MVP | idem | Processus, preuves, exceptions légales |
| Table / modèle `Consent` | OK | Prisma + routes consents | Cartographier finalités ↔ consentements |
| RBAC (parent, enseignant, AESH, admin) | OK | `rbac.ts` | Matrice « qui a droit à quoi » privacy |
| Audit log | MVP | `audit` | Quelles actions privacy journaliser / durée |
| Tests export + erase | OK | `backend/tests/privacy-robot.test.ts` | Garder verts ; étendre cas métier |
| Seed démo anonymisée | OK | `*.demo@example.invalid` | Jamais en prod (Mériem) |
| Mentions partielles UI | Variable | Front | Inventaire + textes manquants |

### 0.3 Ce qui N’existe PAS (ton chantier principal)

| Absent | À livrer |
|--------|----------|
| **Registre des traitements** (art. 30) | Document maître à jour |
| Cartographie des données (data map) | Tables, finalités, durées, destinataires |
| Mentions d’information (parents, école, enfants adaptés) | Textes FR validés lead |
| Politique de confidentialité / CGU privacy | Pages ou PDF versionnés |
| Procédure exercice des droits (accès, rectif, effacement, portabilité, opposition) | Runbook + SLA projet |
| Gestion des consentements (finalités, retrait, preuves) | Spec + UI checklist |
| **AIPD** (si vision/audio/profiling sensible) | Dossier + avis lead |
| Analyse bases légales (contrat, intérêt légitime, consentement, obligation légale) | Tableau par traitement |
| DPA / contrats sous-traitants (hébergeur, LLM, mail) | Archive + checklist |
| Politique de conservation / purge | Alignée Fabio/Mériem technique |
| Procédure violation de données (72 h CNIL) | Runbook + contacts |
| Notice robot / capteurs | Avec Hardware |
| Dossier soutenance RGPD | Chapitre jury |
| Formation équipe (1 h privacy by design) | Atelier |

### 0.4 Frontière avec les autres (très important)

```
Yacine (RGPD)          Fabio (Cyber)         Mériem (Cloud)
─────────────          ─────────────         ──────────────
Registre               Threat model          Hébergement UE
Bases légales          Secrets / TLS         Backups techniques
Notices / consent UI   Pentest / SCA         DPA hébergeur (signature)
AIPD (pilotage)        Logs sécu             TTL storage exports
Droits des personnes   Harden API            Environnements
Violation de données   Incident sécu         ──┬── Yacine rédige
(procédure CNIL)       (technique)              └── procédure + notification
```

**Règle :** si c’est une **obligation légale / document / process privacy** → **Yacine**.  
Si c’est un **contrôle technique** (chiffrage, firewall, rate limit) → **Fabio/Mériem**, avec exigence écrite de Yacine.

### 0.5 Lancer l’existant pour comprendre

```bash
docker compose up -d
# Tester export / effacement avec compte parent démo
# parent.demo@example.invalid / DemoPassw0rd!
cd backend && pnpm test -- privacy
```

### 0.6 Documents déjà écrits

| Doc | Rôle |
|-----|------|
| `BACKEND_SPECIFICATIONS.md` §8 | Exigences RGPD produit |
| `PLAN_CLOUD_CYBER_MERIEM_FABIO.md` | Ops techniques (support) |
| `PLAN_IA_…` / `PEDAGOGICAL_AI_PLAN.md` | Contraintes IA / vision |
| Ce fichier | Plan opérationnel Yacine → juin 2027 |

---

## 1. Mission de Yacine

Livrer d’ici **juin 2027** :

1. Un **registre des traitements** complet et maintenu.  
2. Des **mentions d’information** et parcours de **consentement** cohérents (app + école).  
3. Des **procédures droits des personnes** (export, effacement, etc.) avec preuves.  
4. Une **AIPD** (ou justification documentée de non-nécessité) pour vision/audio/IA.  
5. Un **dossier sous-traitants** (hébergeur, LLM, outils) + DPA.  
6. Un **chapitre soutenance RGPD** clair pour le jury.

### Tu ne fais pas (sauf demande écrite)

- Configurer le VPS / TLS (Mériem)  
- Écrire le firmware robot (Théo)  
- Entraîner les modèles (Sonia / Pierre-Alexis)  
- Refonte visuelle complète du front  
- Remplacer Fabio sur le pentest

Tu **spécifies**, tu **valides**, tu **documentes**, tu **animes** les revues privacy.

---

## 2. Principes durs (non négociables)

| # | Principe |
|---|----------|
| 1 | **Privacy by design / by default** : caméra, micro, vision OFF sauf opt-in. |
| 2 | **Minimisation** : pas de collecte « au cas où ». |
| 3 | **Finalité** claire avant chaque nouveau champ / event / modèle. |
| 4 | **Enfant** = protection renforcée ; language adapté ; parent/école responsables. |
| 5 | Pas de **revente** / pub / tracking commercial. |
| 6 | Pas de **diagnostic** médical ou psychologique automatisé. |
| 7 | Hébergement / sous-traitants **documentés** (UE de préférence). |
| 8 | Droits exercables **réellement** (pas seulement en théorie). |
| 9 | Violation de données : procédure prête **avant** l’incident. |
| 10 | Toute feature IA/robot sensible passe une **revue Yacine** avant merge démo. |

### Phrase jury (à connaître)

> POPY Academy traite des données d’enfants dans un cadre éducatif strictement encadré : minimisation, consentements traçables, hébergement européen, droits d’accès et d’effacement opérationnels, et analyse d’impact lorsque la vision ou des traitements sensibles sont envisagés. Le RGPD n’est pas un bandeau cookie : c’est un livrable projet porté jusqu’à la soutenance.

---

## 3. Cartographie cible des traitements (v1)

À figer en Sprint R0–R1 (tableau vivant dans `docs/privacy/registre-traitements.md`).

| ID | Traitement | Données | Base légale probable | Durée (cible) | Destinataires |
|----|------------|---------|----------------------|---------------|---------------|
| T01 | Comptes adultes (parent, enseignant…) | Identité, email, auth, MFA | Exécution contrat / intérêt légitime sécurité | Compte + 1 an après clôture | Hébergeur |
| T02 | Profils enfants | Prénom/affichage, année, niveau, XP | Consentement parent / mission école | Scolarité + purge | Hébergeur |
| T03 | Progressions / activités | Scores, preuves compétences | Idem T02 | Année scolaire + N | Hébergeur |
| T04 | Consentements | Finalités, timestamps | Obligation accountability | 5 ans après retrait | Hébergeur |
| T05 | Messages / notifs | Contenu échangé | Contrat / consentement | 1–2 ans | Hébergeur |
| T06 | Logs audit / sécu | IP, user id, action | Intérêt légitime sécu | 6–12 mois | Hébergeur |
| T07 | Billing / abonnement | Email, statut plan | Contrat | Obligation comptable | Stripe (si live) |
| T08 | Robot (télémétrie méta) | Batterie, events, device id | Consentement / contrat école | Session + purge | Hébergeur |
| T09 | IA pedagogy (prompts minimisés) | Contexte réduit, pas BO inventé | Consentement / contrat | Court / pas d’entraînement sans base | LLM UE si possible |
| T10 | Vision / audio (opt-in) | Méta ou flux temporaire | **Consentement + AIPD** | Interdit long terme brut | Strict |

Les bases légales exactes = **ta** validation R1 (pas inventées par le code).

---

## 4. Stack documentaire (où écrire)

| Livrable | Chemin suggéré |
|----------|----------------|
| Tracker | `RGPD_TRACKER.md` |
| Registre | `docs/privacy/registre-traitements.md` |
| Data map | `docs/privacy/data-map.md` |
| Mentions / politique | `docs/privacy/politique-confidentialite.md` (+ extrait UI) |
| Procédure droits | `docs/privacy/droits-des-personnes.md` |
| Consentements | `docs/privacy/consentements-finalites.md` |
| AIPD | `docs/privacy/aipd-vision.md` (ou `aipd-globale.md`) |
| Sous-traitants / DPA | `docs/privacy/sous-traitants.md` |
| Violation de données | `docs/privacy/violation-donnees.md` |
| Notice robot | `docs/privacy/notice-robot.md` |
| ADR privacy | `docs/adr/RGPD-XXX.md` |
| Soutenance | `docs/soutenance/rgpd.md` |

---

## 5. Roadmap sprints (oct. 2026 → juin 2027)

Légende : `R#` = tâche Yacine · `J#` = joint autre collab.

### Calendrier macro

| Période | Focus | Livrable clé |
|---------|-------|--------------|
| oct–nov 2026 | **R0** Cadrage | Tracker, data map v0, inventaire code |
| nov–déc 2026 | **R1** Registre & bases légales | Registre v1 signé lead |
| jan 2027 | **R2** Notices & consentements | Textes + matrice finalités |
| fév 2027 | **R3** Droits des personnes | Runbook export/delete + preuves |
| mars 2027 | **R4** AIPD & IA/robot | AIPD ou memo non-nécessité |
| avr 2027 | **R5** Sous-traitants & contracts | DPA hébergeur/LLM classés |
| mai 2027 | **R6** Violation + audit interne | Tabletop + checklist |
| juin 2027 | **R7** Freeze soutenance | Dossier jury + formation équipe |

---

### Sprint R0 — Cadrage (2 sem.)

| ID | Tâche | Sortie | Acceptation | Est. | Dépend |
|----|-------|--------|-------------|------|--------|
| R0-1 | Lire spec §8 + privacy.ts + plans IA/Cloud/HW | Notes | Quiz lead OK | 1 j | — |
| R0-2 | Créer `RGPD_TRACKER.md` + arbo `docs/privacy/` | Fichiers | Merge | 0.5 j | — |
| R0-3 | Inventaire écrans / API touchant des données perso | Table | Exhaustif MVP | 2 j | Front/API |
| R0-4 | Data map v0 (entités Prisma → catégorie donnée) | `data-map.md` | Relu Fabio | 2 j | — |
| R0-5 | Liste gaps (mentions absentes, consentements flous) | Backlog priorisé | Top 10 | 1 j | — |
| J0-1 | Point Mériem/Fabio : hébergeur, logs, backups | CR | Actions partagées | 0.5 j | Cloud |

**Revue :** data map v0 + backlog privacy.

---

### Sprint R1 — Registre & bases légales (nov–déc)

| ID | Tâche | Sortie | Acceptation | Est. | Dépend |
|----|-------|--------|-------------|------|--------|
| R1-1 | Rédiger registre traitements T01–T10 | `registre-traitements.md` | Lead signe v1 | 3 j | R0-4 |
| R1-2 | Valider base légale par traitement | Tableau | Pas de case vide | 2 j | R1-1 |
| R1-3 | Définir durées de conservation cibles | Doc | Alignement Mériem purge | 1 j | Cloud |
| R1-4 | ADR-RGPD-001 : rôles (responsable de traitement vs sous-traitant école) | ADR | Signé | 1 j | Lead |
| R1-5 | Matrice RBAC × données (qui voit l’enfant) | Table | Écarts ticketés Fabio | 1.5 j | Fabio |
| J1-1 | Revue Sonia/PA : pas d’entraînement sur conversations sans base | CR | Écrit | 0.5 j | IA |

---

### Sprint R2 — Notices & consentements (janv.)

| ID | Tâche | Sortie | Acceptation | Est. | Dépend |
|----|-------|--------|-------------|------|--------|
| R2-1 | Politique de confidentialité FR (langage clair) | Doc v1 | Lead OK | 2.5 j | R1 |
| R2-2 | Mentions courtes in-app (parent, enseignant) | Textes + emplacements UI | Front peut intégrer | 2 j | Front |
| R2-3 | Notice enfant (formulation simple / pictos si besoin) | Doc | Pédagogie consultée | 1.5 j | — |
| R2-4 | Catalogue finalités de consentement (learning, sync école, robot, vision…) | `consentements-finalites.md` | 1 finalité = 1 case | 2 j | — |
| R2-5 | Spec retrait de consentement (effet sur sync/features) | Spec | Backend ticketé | 1 j | Backend |
| J2-1 | Parcours UI consentement (wire ou tickets) | Tickets | Priorisés lead | 1 j | Front |

---

### Sprint R3 — Droits des personnes (fév.)

| ID | Tâche | Sortie | Acceptation | Est. | Dépend |
|----|-------|--------|-------------|------|--------|
| R3-1 | Procédure exercice des droits (canal, délais, preuves) | `droits-des-personnes.md` | SLA projet ≤ 72 h démo | 2 j | — |
| R3-2 | Cahier des charges export « lisible » (JSON + résumé humain) | Spec | Implémentable | 1.5 j | privacy.ts |
| R3-3 | Cahier des charges effacement (périmètre, cascades, exceptions) | Spec | Tests étendus | 1.5 j | Backend |
| R3-4 | PV de test : export + delete chronométrés | PV signé | Avec Fabio | 1 j | Fabio |
| R3-5 | Droit d’opposition / limitation (cas école) | Note | Lead OK | 1 j | — |
| J3-1 | Vérifier PIN parental ≠ confusion avec droits RGPD | Note hardening | Clarifié UI | 0.5 j | Front |

---

### Sprint R4 — AIPD, IA, robot (mars)

| ID | Tâche | Sortie | Acceptation | Est. | Dépend |
|----|-------|--------|-------------|------|--------|
| R4-1 | Décider : AIPD nécessaire ou memo de non-nécessité | Décision écrite | Lead | 1 j | PA/HW |
| R4-2 | AIPD vision/audio (si go) — finalités, risques, mesures | `aipd-vision.md` | Complet | 4 j | PA |
| R4-3 | Règles : pas d’ID faciale, pas émotion, pas biométrie | ADR-RGPD-002 | Aligné PLAN_IA | 1 j | PA |
| R4-4 | Notice robot + capteurs (méta only) | `notice-robot.md` | Erwan/Théo OK | 1.5 j | HW |
| R4-5 | Checklist merge « feature sensible » | Checklist | Utilisée en revue | 0.5 j | Tous |
| J4-1 | Revue prompts / logs IA (pas de PII enfant longue durée) | CR | Sonia + Fabio | 1 j | IA/Cyber |

---

### Sprint R5 — Sous-traitants & contrats (avr.)

| ID | Tâche | Sortie | Acceptation | Est. | Dépend |
|----|-------|--------|-------------|------|--------|
| R5-1 | Inventaire sous-traitants (hébergeur, GitHub, LLM, Stripe, mail…) | `sous-traitants.md` | Complet | 1.5 j | Mériem |
| R5-2 | Vérifier DPA / clauses hébergeur UE | Archive PDF | Présents | 1 j | Mériem |
| R5-3 | Fiche transfert hors UE (si un outil l’impose) + mesures | Note | Lead assume ou refuse | 1 j | — |
| R5-4 | Exigences privacy pour contrat école (modèle) | Modèle | Lead OK | 2 j | — |
| R5-5 | Billing Stripe : mentions + données carte (Stripe = sous-traitant) | Note | Aligné billing | 0.5 j | Cloud |
| J5-1 | Aligner BOM cloud (pas d’hébergeur hors UE sans ADR) | BOM §13 | OK | 0.5 j | Mériem |

---

### Sprint R6 — Violation de données & audit (mai)

| ID | Tâche | Sortie | Acceptation | Est. | Dépend |
|----|-------|--------|-------------|------|--------|
| R6-1 | Procédure violation (détecter → évaluer → notifier 72 h) | `violation-donnees.md` | Tabletop fait | 2 j | Fabio |
| R6-2 | Tabletop 45 min avec Mériem/Fabio/Lead | CR | Actions | 0.5 j | Cloud |
| R6-3 | Audit interne checklist CNIL / projet éducatif | Rapport | Top écarts prioritaires | 2 j | — |
| R6-4 | Correctifs documentaires + tickets techniques | Tickets | Assignés | 1 j | Tous |
| J6-1 | Participation revue pentest (angle privacy / IDOR enfant) | Notes | Remontées Fabio | 0.5 j | Fabio |

---

### Sprint R7 — Soutenance juin 2027

| ID | Tâche | Sortie | Acceptation | Est. | Dépend |
|----|-------|--------|-------------|------|--------|
| R7-1 | Chapitre soutenance RGPD (10–15 min oral) | `docs/soutenance/rgpd.md` | Relu lead | 2 j | — |
| R7-2 | Dossier preuves (registre, PV export/delete, DPA, AIPD) | Binder / dossier git | Complet | 1.5 j | — |
| R7-3 | Formation équipe 1 h « privacy by design » | Support + émargement | Faite | 1 j | Tous |
| R7-4 | Freeze textes notices version démo | Tag version | Immutable | 0.5 j | Front |
| R7-5 | FAQ jury RGPD (10 questions/réponses) | Doc | — | 1 j | — |

---

## 6. Critères « terminé pour juin 2027 »

- [ ] Registre des traitements v1+ à jour  
- [ ] Data map alignée Prisma / features démo  
- [ ] Politique de confidentialité + mentions in-app disponibles  
- [ ] Catalogue consentements / finalités documenté  
- [ ] Procédure droits des personnes + PV export/delete  
- [ ] AIPD vision **ou** memo de non-nécessité signé  
- [ ] Notice robot publiée (même courte)  
- [ ] Sous-traitants listés + DPA hébergeur archivé  
- [ ] Procédure violation de données + tabletop  
- [ ] Chapitre soutenance + FAQ jury  
- [ ] Formation équipe réalisée  

Hors obligation : certification ISO, DPO externe payant, registre CNIL formel si pas d’ouverture grand public — **à trancher avec le lead** selon statut juridique du projet.

---

## 7. Dépendances

| Besoin | Collab | Quand |
|--------|--------|-------|
| Hébergeur UE + DPA | **Mériem** | R1 / R5 |
| Purge technique / TTL / logs | **Fabio** + Mériem | R1 / R3 |
| Spec vision / events | **Pierre-Alexis** | R4 |
| Prompts / pas d’entraînement sauvage | **Sonia** | R1 / R4 |
| Capteurs robot / opt-in | **Erwan / Théo** | R4 |
| Intégration textes UI | Front (TBD) | R2 / R7 |
| Go feature sensible | Lead | Continu |
| Budget éventuel conseil juridique | Lead | Si besoin |

---

## 8. RACI (extrait)

| Activité | Yacine | Fabio | Mériem | IA | Hardware | Lead |
|----------|--------|-------|--------|----|----------|------|
| Registre / bases légales | R | C | C | C | C | A |
| Notices / politique | R | I | I | C | C | A |
| Consentements finalités | R | C | I | C | C | A |
| Export / delete process | R | C | C | I | I | A |
| Implémentation technique droits | C | R | C | I | I | A |
| AIPD | R | C | C | C | C | A |
| DPA hébergeur | C | I | R | I | I | A |
| Violation données (procédure) | R | C | C | I | I | A |
| Incident technique | C | R | R | I | C | A |
| Soutenance RGPD | R | C | C | C | C | A |

---

## 9. Risques

| ID | Risque | Mitigation | Owner |
|----|--------|------------|-------|
| RP1 | RGPD « papier » déconnecté du code | Data map + PV tests avec Fabio | Yacine |
| RP2 | Vision activée sans AIPD | Gate merge R4 + checklist | Yacine + PA |
| RP3 | École = responsable flou | ADR-RGPD-001 tôt | Yacine + Lead |
| RP4 | LLM hors UE sans analyse | Fiche transfert ou refus | Yacine + Sonia |
| RP5 | Textes juridiques incompréhensibles | Langage clair + relecture lead | Yacine |
| RP6 | Confusion PIN parental / RGPD | Note + UI | Yacine + Front |
| RP7 | Retard front notices | PDF + page markdown démo interim | Yacine |
| RP8 | Sous-estimation charge AIPD | Commencer R4 dès mars ; memo si vision off | Yacine |

---

## 10. Cadence & reporting

### Hebdo (30 min)

- Avancement tracker  
- Features en revue privacy  
- Blocages lead / technique  

### Bi-hebdo avec lead

- Risques conformité démo  
- Décisions base légale / AIPD / sous-traitants  

### Format statut vendredi

```
Sprint: R…
Done: …
In progress: …
Blocked: … (attente: Mériem DPA / PA vision / Front textes)
Privacy risk: low|med|high
AIPD status: na|draft|done
Next week: …
```

---

## 11. Scénarios démo / soutenance RGPD

1. Montrer le **registre** (extrait T01–T10).  
2. Parcourir une **mention** parent dans l’app (ou PDF versionné).  
3. Faire un **export** enfant démo + expliquer le contenu.  
4. Faire un **effacement** test + montrer la preuve / audit.  
5. Expliquer **caméra OFF** by default + opt-in.  
6. Montrer la fiche **sous-traitant hébergeur UE**.  
7. Si vision : résumé **AIPD** en 2 minutes.  
8. Expliquer la procédure **violation 72 h** (sans dramatiser).  
9. Répondre : « Qui est responsable de traitement ? » via ADR-RGPD-001.

---

## 12. Brief manager (à lui lire)

> Yacine : tu portes le **RGPD et la privacy** jusqu’à juin 2027.  
> Le code a déjà un MVP export/effacement/consentements : tu transformes ça en **conformité démontrable** (registre, notices, procédures, AIPD, DPA, soutenance).  
> Tu ne configures pas le cloud : tu **exiges** et tu **valides** avec Mériem et Fabio.  
> Tu gates les features sensibles (vision, audio, logs IA, robot).  
> Sprints R0→R7, tracker, statut vendredi.  
> En juin : dossier RGPD prêt pour le jury, pas seulement une slide « on est RGPD ».

---

## 13. Onboarding 48 h

**Jour 1**  
- Lire §0–2 + spec §8 + `privacy.ts`.  
- Tester export/delete en local.  
- Lister 10 données perso déjà collectées.

**Jour 2**  
- Créer `RGPD_TRACKER.md` + `docs/privacy/`.  
- Draft data map v0.  
- Point 30 min Mériem/Fabio + point 20 min Sonia/PA (vision/prompts).  
- Demander au lead le statut juridique du projet (asso / école / startup / scolarité).

---

## 14. Coûts

Le RGPD est surtout du **temps** (intégré au BOM projet global : pas de ligne matériel dédiée).

| Poste | Provision |
|-------|-----------|
| Outils (Notion/docs git) | 0 € |
| Conseil juridique externe (option Lead) | 0 – 1 500 € |
| **Défaut projet** | **0 €** (Yacine + relectures lead) |

Si conseil externe : ajouter une ligne au BOM §0 / annexe D (go Lead).

---

## 15. Mapping 7 collaborateurs

| # | Nom | Domaine | Lien avec Yacine |
|---|-----|---------|------------------|
| 1 | Sonia | NLP / RAG | Bases légales prompts, pas d’entraînement sauvage |
| 2 | Pierre-Alexis | Vision / behavior | AIPD, opt-in, minimisation |
| 3 | Erwan | Hardware | Notice capteurs, pas de média brut |
| 4 | Théo | Firmware / IoT | Télémétrie méta, revoke |
| 5 | Mériem | Cloud | DPA, UE, retention technique |
| 6 | Fabio | Cybersécurité | Preuves techniques, logs, IDOR, incident |
| 7 | **Yacine** | **RGPD / privacy** | — |

---

## 16. Checklist kickoff (semaine 1)

- [ ] Lecture plan + spec §8  
- [ ] Accès GitHub  
- [ ] Tracker + dossier `docs/privacy/` créés  
- [ ] Data map v0 démarrée  
- [ ] Point Cloud (Mériem/Fabio)  
- [ ] Point IA (Sonia/PA)  
- [ ] Clarifier avec lead : responsable de traitement  
- [ ] Canal « privacy-rgpd »

---

## 17. Historique

| Version | Date | Changement |
|---------|------|------------|
| 1.0 | 2026-10-06 | Création plan Yacine — RGPD & privacy → juin 2027 |
