# Popy Academy — Feuille de route jusqu’à la version complète

Ce document est la source de vérité du reste à faire. Il doit être mis à jour à
chaque phase de développement.

**Coordination des 7 collaborateurs** (travaux communs, jalons, gates, qui parle à qui) :  
[`PLAN_COORDINATION_7.md`](PLAN_COORDINATION_7.md)

## Légende

- `[x]` terminé et vérifié
- `[-]` partiellement réalisé
- `[ ]` à faire
- `[!]` dépend d’un backend, du robot ou d’une validation externe

## Fondations

- [x] Interfaces chargées par rôle
- [x] Navigation par URL
- [x] Error Boundary et skeletons
- [x] IndexedDB et file de synchronisation
- [x] Import et export local
- [x] Mode hors ligne et manifeste PWA
- [x] Résolution complète des conflits
- [x] Synchronisation backend et authentification

## Interface enfant

- [x] Bureau, devoirs, chat, matières, technologie et lecture adaptée
- [x] Planning, carnet, récompenses et studio créatif
- [x] Explorateur avec dossiers et corbeille
- [x] Canvas avec formes, gomme, historique et export
- [x] Historique des versions du cahier
- [x] Cahiers et pages multiples
- [x] Campagne de jeux avec XP et mondes
- [x] Plusieurs niveaux jouables par monde
- [x] Révision espacée et évaluations complètes
- [!] OCR, voix et caméra réels

## Interfaces adultes

- [x] Parent : suivi, contrôle, inclusion, confidentialité et robot
- [x] Parent : gestion multi-enfants approfondie
- [x] Enseignant : classe, séquences, adaptations et rapports
- [x] Éditeur pédagogique par blocs avec prévisualisation
- [x] Éditeur : barèmes, modèles, correction et versionnement
- [x] AESH : élèves, adaptations, observations et transmissions
- [x] Admin : pilotage, établissements, comptes, robots, contenus et audit
- [x] Admin : création, renommage et suppression locales
- [x] Admin : affectations, formulaires détaillés et pagination

## Comptes et internationalisation

- [x] Onboarding multi-rôles
- [x] Centre de comptes multi-profils et auth API adultes
- [x] Relations parent–enfants et sessions
- [x] Infrastructure français, anglais et espagnol
- [x] Navigation et commandes globales traduites
- [x] Traduction exhaustive des contenus pédagogiques

## PWA

- [x] Manifeste, Service Worker, cache et indicateur hors ligne
- [x] Icône d’installation et page de secours hors ligne
- [x] Écran de mise à jour
- [x] Gestion sélective du cache
- [x] Test automatisé hors ligne

## Banque pédagogique

- [x] Structure CP à CM2
- [x] Compétences structurées par matière
- [x] Validation institutionnelle
- [x] Leçons, exercices, corrections et évaluations complets
- [x] Import de référentiels officiels

## Qualité

- [x] Tests des services, routes et onboarding
- [x] Tests des parcours enfant et adulte
- [x] Audit responsive et accessibilité
- [x] Tests navigateur IndexedDB et PWA
- [!] Tests avec enfants, parents et professionnels

## Backend réel

Suivi détaillé : [`BACKEND_IMPLEMENTATION_TRACKER.md`](BACKEND_IMPLEMENTATION_TRACKER.md)  
Spec : [`BACKEND_SPECIFICATIONS.md`](BACKEND_SPECIFICATIONS.md)

- [x] API Fastify + Prisma + PostgreSQL
- [x] Auth email / mot de passe + MFA TOTP
- [x] RBAC + audit + rate limit
- [x] Sync hors ligne idempotente
- [x] Temps réel (WebSocket)
- [x] RGPD (export / effacement)
- [x] Robot (appairage / urgence)
- [x] Adaptateur hybride IndexedDB → API réelle

## Abonnement & accès ordinateur

- [x] Formules `ordinateur` / `famille` / `ecole` (robot jamais obligatoire)
- [x] API `/subscriptions/*`
- [x] Paiement démo + Stripe-ready (`/subscriptions/billing/*`)
- [x] UI parent **Abonnement**
- [x] Parcours produit « computer-first » (onboarding, robot optionnel)
- [x] Sync enfants parent → API quand session active
- [x] Bootstrap session (santé API + sync IndexedDB au démarrage)
- [x] MFA obligatoire enseignants / admin
- [x] CI GitHub Actions + compose préprod (`RUN_SEED=false`)

## Équipe IA & données

Plan collaborateurs Sonia & Pierre-Alexis (jusqu’à juin 2027) :  
[`PLAN_IA_SONIA_PIERRE_ALEXIS.md`](PLAN_IA_SONIA_PIERRE_ALEXIS.md)

## Équipe Hardware & IoT

Plan collaborateurs Erwan & Théo (robot + app terminés juin 2027) :  
[`PLAN_HARDWARE_ERWAN_THEO.md`](PLAN_HARDWARE_ERWAN_THEO.md)

## Équipe Cloud & Cybersécurité

Plan collaborateurs Mériem & Fabio (hébergement UE + sécu → juin 2027) :  
[`PLAN_CLOUD_CYBER_MERIEM_FABIO.md`](PLAN_CLOUD_CYBER_MERIEM_FABIO.md)

**Budget unique (robot + cloud + IA) :** [`robot/bom/BOM_ACHATS_POPY.md`](robot/bom/BOM_ACHATS_POPY.md) — total recommandé **3 700 €**.

## Équipe RGPD & Privacy

Plan collaborateur **Yacine** (registre, notices, droits, AIPD → juin 2027) :  
[`PLAN_RGPD_YACINE.md`](PLAN_RGPD_YACINE.md)

## Coordination transverse (les 7)

Qui collabore avec qui, livrables communs **X01–X15**, gates bloquants, calendrier sync :  
[`PLAN_COORDINATION_7.md`](PLAN_COORDINATION_7.md)

## Moteur pédagogique / IA (RAG)

Plan détaillé : [`PEDAGOGICAL_AI_PLAN.md`](PEDAGOGICAL_AI_PLAN.md)

- [ ] P0 — Contrats & tracker
- [ ] P1 — Référentiel officiel interrogeable
- [ ] P2 — Contenus POPY liés aux compétences
- [ ] P3 — Contexte enfant minimisé
- [ ] P4 — Orchestrateur RAG (stub sans LLM)
- [ ] P5 — LLM reformulateur (flag)
- [ ] P6 — Chat / aide devoirs branchés (PC d’abord)
- [ ] P7 — Anti-hallucination & validation

## Règle de maintenance

Mettre à jour les cases de ce fichier après chaque ajout, correction ou
vérification. Mettre à jour aussi `BACKEND_IMPLEMENTATION_TRACKER.md`
pour toute évolution backend.
