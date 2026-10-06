# Coordination des 7 collaborateurs — Popy Academy  
**Qui travaille avec qui · quand · sur quoi (en commun)**

> **Version :** 1.0 — 2026-10-06  
> **Statut :** document vivant — **source de vérité transversale**.  
> **Public :** toute l’équipe + lead.  
> **Objectif :** que personne ne travaille en silo ; chaque livrable partagé a un owner, des contributeurs et une fenêtre de sync.

---

## Comment utiliser ce document

1. Chaque binôme garde **son plan détaillé** (ci-dessous).  
2. Ce fichier dit **quand se parler** et **quoi livrer ensemble**.  
3. Avant chaque sprint : cocher les **jalons communs** (§4) qui vous concernent.  
4. Réunion **transverse** = créneau §6 (ne pas tout résoudre en 1-to-1 dispersés).

| Plan détaillé | Fichier |
|---------------|---------|
| IA & données | [`PLAN_IA_SONIA_PIERRE_ALEXIS.md`](PLAN_IA_SONIA_PIERRE_ALEXIS.md) |
| Hardware & IoT | [`PLAN_HARDWARE_ERWAN_THEO.md`](PLAN_HARDWARE_ERWAN_THEO.md) |
| Cloud & cyber | [`PLAN_CLOUD_CYBER_MERIEM_FABIO.md`](PLAN_CLOUD_CYBER_MERIEM_FABIO.md) |
| RGPD & privacy | [`PLAN_RGPD_YACINE.md`](PLAN_RGPD_YACINE.md) |
| Budget unique | [`robot/bom/BOM_ACHATS_POPY.md`](robot/bom/BOM_ACHATS_POPY.md) |

---

## 1. Les 7 — qui fait quoi (rappel)

| # | Nom | Domaine | Plan |
|---|-----|---------|------|
| 1 | **Sonia** | NLP / RAG / dialogue pédagogique | IA |
| 2 | **Pierre-Alexis** | Vision / comportement / données | IA |
| 3 | **Erwan** | Mécanique / électronique robot | Hardware |
| 4 | **Théo** | Firmware / agent IoT / protocole | Hardware |
| 5 | **Mériem** | Cloud / infra / ops | Cloud |
| 6 | **Fabio** | Cybersécurité | Cloud |
| 7 | **Yacine** | RGPD / privacy | RGPD |

**Lead** = priorisation, budget, go/no-go features sensibles, validation ADR.

---

## 2. Carte des dépendances (vue d’ensemble)

```
                    ┌─────────────┐
                    │   YACINE    │  RGPD / privacy
                    │  (garde-fou)│
                    └──────┬──────┘
           notices│AIPD│droits│DPA│opt-in
        ┌─────────┼─────────┬─────────┐
        ↓         ↓         ↓         ↓
   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
   │ SONIA  │ │  P-A   │ │ ERWAN  │ │  THÉO  │
   │  RAG   │ │ vision │ │   HW   │ │  IoT   │
   └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
       │          │          │          │
       │   /pedagogy + events + robots API
       └──────────┴─────┬────┴──────────┘
                        ↓
              ┌──────────────────┐
              │  API / App (repo)│
              └────────┬─────────┘
                       ↓
              ┌────────┴────────┐
              │ MÉRIEM │ FABIO  │
              │ cloud  │ cyber  │
              └─────────────────┘
```

**Règle d’or :** une feature qui touche **enfant + donnée + réseau** implique au minimum **owner métier + Yacine + Fabio** (et Mériem si déployée).

---

## 3. Travaux EN COMMUN (livrables partagés)

Ce ne sont pas des tâches « nice to have » : ce sont des **contrats d’équipe**.

### 3.1 Matrice « livrable commun »

| ID | Livrable commun | Owner | Doit collaborer avec | Sortie attendue | Fenêtre |
|----|-----------------|-------|----------------------|-----------------|---------|
| **X01** | Contrat `/pedagogy/ask` (request/response + sources) | Sonia | PA, Fabio (abuse), Yacine (minimisation), Front | OpenAPI + ADR-AI | nov–déc 2026 |
| **X02** | Schéma `behavior_events` / track() | Pierre-Alexis | Sonia, Yacine, Fabio, Front | Spec events + rétention | déc 2026–jan 2027 |
| **X03** | Policy vision / caméra opt-in | Yacine | PA, Erwan, Théo, Fabio | Policy + AIPD ou memo non-nécessité | mars 2027 |
| **X04** | Notice + consentements robot / capteurs | Yacine | Erwan, Théo, Front | Textes + finalités | mars–avr 2027 |
| **X05** | Appairage / revoke / E-stop bout-en-bout | Théo | Fabio, Mériem, Erwan, Front | Scénario démo vert | avr–mai 2027 |
| **X06** | Pedagogy **aussi** sur robot (même moteur) | Sonia + Théo | PA, Front | Démo « continue les fractions » | mai 2027 |
| **X07** | Préprod HTTPS UE + secrets IA/robot | Mériem | Fabio, Sonia, Théo, Yacine (DPA) | URL préprod | déc 2026–jan 2027 |
| **X08** | Export / effacement prouvés | Yacine | Fabio, Mériem | PV chronométré | fév–mars 2027 |
| **X09** | Logs : pas de PII / prompts enfants en clair | Fabio | Sonia, PA, Yacine, Mériem | Règle + contrôle sampling | fév–avr 2027 |
| **X10** | BOM / budget projet unique | Lead | Tous (surtout Erwan, Mériem, Sonia) | `BOM_ACHATS_POPY.md` à jour | Continu |
| **X11** | Scénario démo jury bout-en-bout | Lead | **Tous les 7** | Script 15–20 min | mai–juin 2027 |
| **X12** | Dossier soutenance chapitres croisés | Lead | Chaque owner chapitre | Docs `docs/soutenance/` | juin 2027 |
| **X13** | Threat model incluant robot + IA | Fabio | Théo, Sonia, PA, Yacine | `threat-model.md` | nov 2026 + maj avr |
| **X14** | Durées de conservation (doc ↔ technique) | Yacine | Mériem, Fabio, PA | Registre + jobs purge | jan–mars 2027 |
| **X15** | Computer-first garanti (app sans robot) | Front + Lead | Théo, Erwan (ne pas bloquer) | Tests démo sans robot | Continu |

### 3.2 Ce que « collaborer » veut dire concrètement

| Mode | Quand l’utiliser | Exemple |
|------|------------------|---------|
| **Sync 30–45 min** | Décision ou contrat d’interface | X01 OpenAPI pedagogy |
| **Revue écrite (PR / doc)** | Validation privacy ou sécu | Yacine commente ADR vision |
| **Co-écriture** | Livrable à deux plumes | Sonia+Théo scénario robot+RAG |
| **Gate (bloquant)** | Interdit de merger / commander sans OK | Caméra sans policy Yacine |
| **Info seule** | Statut vendredi | Erwan informe que le BOM a changé |

---

## 4. Calendrier des jalons communs (oct 2026 → juin 2027)

| Mois | Jalon commun | Qui dans la pièce | Bloquant si manqué ? |
|------|--------------|-------------------|----------------------|
| **Oct 2026** | Kickoff 7 + lecture plans + BOM 3 700 € | Tous + Lead | Oui |
| **Nov 2026** | ADR hébergeur (Mériem) + threat model v0 (Fabio) + data map RGPD v0 (Yacine) | M, F, Y | Oui pour cloud |
| **Nov–déc** | Contrat `/pedagogy/ask` figé | Sonia, PA, Y, F | Oui pour IA |
| **Déc** | Vague 1 robot commandée (Théo/Erwan) + préprod HTTPS amorcée | E, T, M | Oui hardware/cloud |
| **Jan 2027** | Events/comportement schéma + rétention validée Yacine | PA, Y, F | Moyen |
| **Fév** | PV export/delete + headers/rate durcis | Y, F, M | Oui soutenance |
| **Mars** | **Gate vision** : AIPD/memo + policy opt-in **avant** commande caméra | Y, PA, E, T | **Oui** |
| **Avr** | Robot appairé sur préprod + revoke cloud | T, F, M, E | Oui démo robot |
| **Mai** | Démo intégrée PC + robot + pedagogy + HTTPS | **Tous** | Oui |
| **Juin** | Freeze + soutenance chapitres + script jury | **Tous** | Oui |

### 4.1 Gates bloquants (à connaître par cœur)

| Gate | Condition | Qui dit GO | Conséquence si NON |
|------|-----------|------------|---------------------|
| **G1 Caméra** | Policy + (AIPD ou memo) | Yacine (+ Lead) | Pas de commande #16–18 BOM |
| **G2 LLM prod/préprod** | Pas de log prompts enfants ; clé isolée | Fabio + Yacine | Flag LLM off |
| **G3 Hébergeur** | UE + DPA | Mériem + Yacine | Pas de mise en ligne données réelles |
| **G4 Robot démo** | E-stop HW+SW + revoke | Erwan + Théo + Fabio | Robot hors scénario jury |
| **G5 Seed** | `RUN_SEED=false` préprod | Mériem | Interdit d’appeler ça « préprod » |

---

## 5. Paires & triangles qui DOIVENT se parler

### 5.1 Routines binômes / triangles

| Duo / triangle | Fréquence | Sujets types | Animé par |
|----------------|-----------|--------------|-----------|
| Sonia ↔ Pierre-Alexis | Hebdo (déjà) | RAG, events, eval | Alternance |
| Erwan ↔ Théo | Hebdo | BOM, firmware, méca | Alternance |
| Mériem ↔ Fabio | Hebdo | Infra, sécu, incidents | Alternance |
| **Yacine ↔ Fabio** | Bi-hebdo | Preuves, logs, IDOR, rétention | Yacine |
| **Yacine ↔ Mériem** | Mensuel + ad hoc | DPA, UE, TTL exports | Yacine |
| **Yacine ↔ Sonia/PA** | Mensuel + gate features | Minimisation, AIPD, consentements IA | Yacine |
| **Yacine ↔ Erwan/Théo** | À chaque jalon capteur | Notice robot, opt-in | Yacine |
| **Sonia ↔ Théo** | Dès H8 / S pedagogy robot | Même moteur sur device | Sonia |
| **Théo ↔ Fabio/Mériem** | Dès agent sur préprod | TLS, revoke, rate robots | Théo |
| **Pierre-Alexis ↔ Erwan** | Avant vision HW | Caméra, obturateur, meta only | PA |
| **Mériem ↔ Sonia** | Avant LLM préprod | Secrets, quotas, coût API | Mériem |

### 5.2 Matrice « qui a besoin de qui » (résumé)

|  | Sonia | PA | Erwan | Théo | Mériem | Fabio | Yacine |
|--|:-----:|:--:|:-----:|:----:|:------:|:-----:|:------:|
| **Sonia** | — | fort | info | **fort** | moyen | moyen | **fort** |
| **PA** | fort | — | **moyen** | moyen | info | moyen | **fort** |
| **Erwan** | info | moyen | — | **fort** | info | info | **moyen** |
| **Théo** | **fort** | moyen | **fort** | — | **fort** | **fort** | **moyen** |
| **Mériem** | moyen | info | info | **fort** | — | **fort** | **fort** |
| **Fabio** | moyen | moyen | info | **fort** | **fort** | — | **fort** |
| **Yacine** | **fort** | **fort** | **moyen** | **moyen** | **fort** | **fort** | — |

*fort* = sync régulière obligatoire · *moyen* = jalons · *info* = statut / lecture plans.

---

## 6. Cadence transverse (toute l’équipe)

| Rituel | Durée | Qui | Contenu |
|--------|-------|-----|---------|
| **Kickoff** (une fois) | 2 h | 7 + Lead | Lecture §3–4 de ce doc ; owners X01–X15 |
| **Sync transverse** | 45 min / **2 semaines** | 7 + Lead | Jalons communs, gates, blocages croisés |
| **Statut vendredi** | Écrit async | Chacun | Format de son plan → canal commun |
| **Revue gate** | 30 min | Concernés + Yacine/Fabio | G1–G5 |
| **Répétition démo** | 2× en mai–juin | Tous | Script X11 |

### Agenda type sync transverse (45 min)

1. (5) Burn jalons X01–X15  
2. (10) Blocages « j’attends l’équipe X »  
3. (10) Gates à venir (30 jours)  
4. (10) Démo juin : risque rouge/orange/vert  
5. (10) Décisions Lead

---

## 7. En commun pour la démo juin 2027 (script d’équipe)

Ordre recommandé (chaque segment = owner visible) :

| # | Segment | Owner devant le jury | Support présent |
|---|---------|----------------------|-----------------|
| 1 | App PC sans robot (computer-first) | Front / Lead | Tous |
| 2 | Compte enseignant + MFA | Fabio | Mériem |
| 3 | Chat / aide ancrée programme + sources | Sonia | PA |
| 4 | HTTPS + hébergement UE | Mériem | Fabio |
| 5 | Export / effacement RGPD | Yacine | Fabio |
| 6 | Appairage robot + LED/mouvement | Théo | Erwan |
| 7 | E-stop + revoke | Erwan + Théo | Fabio |
| 8 | « On continue les fractions » sur robot | Sonia + Théo | — |
| 9 | Budget / BOM (si question) | Lead | Erwan, Mériem |

**Répétitions :** au moins **2 run-through** complets avec les 7.

---

## 8. Canaux & artefacts partagés

| Artefact | Où | Qui met à jour |
|----------|-----|----------------|
| Ce fichier coordination | `PLAN_COORDINATION_7.md` | Lead + owners X* |
| Budget | `robot/bom/BOM_ACHATS_POPY.md` | Erwan/Théo, Mériem, Sonia, Lead |
| ADR | `docs/adr/` | Auteur + review croisée |
| Privacy | `docs/privacy/` | **Yacine** |
| Security | `docs/security/` | **Fabio** |
| Runbooks cloud | `docs/runbooks/` | **Mériem** |
| Trackers | `*_TRACKER.md` | Chaque binôme |
| Soutenance | `docs/soutenance/` | Chaque owner chapitre |

**Canal chat suggéré :** `#popy-transverse` (jalons) + canaux binômes (`#popy-ia`, `#popy-hw`, `#popy-cloud`, `#popy-rgpd`).

---

## 9. Escalade

| Situation | Escalader vers | Délai |
|-----------|----------------|-------|
| Blocage > 5 jours ouvrés entre 2 équipes | Lead + sync transverse | Immédiat |
| Désaccord privacy vs feature | **Yacine** tranche process ; Lead tranche produit | 48 h |
| Désaccord sécu vs deadline | **Fabio** ; Lead assume risque **par écrit** | 48 h |
| Budget dépassé BOM | Lead | Avant commande |
| Incident données / sécu | Fabio + Yacine + Mériem + Lead | Immédiat |

---

## 10. Checklist « je ne suis pas en silo »

Avant de dire « c’est fini » sur une feature :

- [ ] Ai-je touché des **données enfant** ? → prévenir **Yacine**  
- [ ] Ai-je ouvert une **surface réseau** ? → prévenir **Fabio** (+ **Mériem** si déployé)  
- [ ] Ai-je besoin du **robot** ? → **Théo/Erwan** et rappel computer-first  
- [ ] Ai-je besoin du **moteur pédagogique** ? → **Sonia** (contrat X01)  
- [ ] Ai-je un **coût** ? → mettre à jour le **BOM**  
- [ ] Est-ce dans le **script démo** X11 ? → prévenir Lead  

---

## 11. Brief pour toute l’équipe

> Vous avez chacun un plan détaillé.  
> **Ce document** dit comment vous vous interconnectez.  
> Les livrables **X01–X15** sont **communs** : un owner, plusieurs contributeurs, une date.  
> Les **gates G1–G5** sont bloquants (caméra, LLM, hébergeur UE, robot safe, seed off).  
> Sync transverse **toutes les 2 semaines** + répétitions démo à **7**.  
> Pas de feature sensible mergée sans passer la case Yacine / Fabio quand elle s’applique.

---

## 12. Historique

| Version | Date | Changement |
|---------|------|------------|
| 1.0 | 2026-10-06 | Création coordination 7 collabs : communs, jalons, gates, cadence |
