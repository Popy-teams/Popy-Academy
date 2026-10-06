# BOM Projet POPY — Tous les coûts

> **Document unique d’achats / budget** : robot + cloud + cybersécurité (+ options IA).  
> **Pour :** Erwan & Théo (robot) · Mériem & Fabio (cloud/cyber) · Sonia & Pierre-Alexis (options IA) · Lead (validation).  
> **Version :** 4.0 — 2026-10-06  
> **Horizon :** octobre 2026 → juin 2027 (**9 mois** de cloud).  
> **Panier robot retenu :** **A++ Performance** (Jetson **Orin NX 16 Go**).  
> **À provisionner (total projet recommandé) :** **≈ 3 700 €** — détail §0.

---

## Comment utiliser ce document

1. Lire **§0** (total consolidé) — 2 minutes.  
2. Robot : **§1 → §12** (NVIDIA, listes, vagues).  
3. Cloud & cyber : **§13** (mensuel + one-shot).  
4. Options IA : **§14**.  
5. Après chaque dépense : **§15 Suivi**.

**Prix :** indicatifs TTC France/Europe (~oct. 2026). **Revérifier le jour J.**

---

## 0. Budget consolidé — tout le projet

### 0.1 Vue d’ensemble (à provisionner)

| Bloc | Contenu | Provision recommandée |
|------|---------|------------------------|
| **A — Robot** | Orin NX + WAVE ROVER + sécu + capteurs + caméra + audio + coque + rechanges + outillage | **2 900 €** |
| **B — Cloud & cyber** | Hébergement UE 9 mois + domaine + monitoring + backups + marge + pentest light option | **700 €** |
| **C — IA cloud (option)** | Crédits API LLM (Mistral/OpenAI) démo + eval | **100 €** |
| **TOTAL PROJET** | A + B + C | **≈ 3 700 €** |

| Scénario | Total à bloquer |
|----------|-----------------|
| **Recommandé (Performance + cloud 9 mois + IA légère)** | **3 700 €** |
| Sans option IA (A+B seulement) | **3 600 €** |
| Robot Confort Nano + cloud (repli) | **1 700 + 700 = 2 400 €** |
| Robot Performance + cloud + pentest externe | **3 700 + 0–2 000 €** (sur devis) |
| Robot AGX lab + cloud | **~4 000 + 700 ≈ 4 700 €** |

### 0.2 Qui paie / qui commande quoi

| Bloc | Owner achat | Valide |
|------|-------------|--------|
| A — Robot | Erwan + Théo | Lead |
| B — Cloud & cyber | **Mériem** (infra) + **Fabio** (outils sécu) | Lead |
| C — IA API | Sonia (+ Mériem pour facturation compte) | Lead |

### 0.3 Récap chiffres clés

```
Robot Performance (Orin NX) .......... 2 900 €   (one-shot)
Cloud UE × 9 mois (confort) ..........   540 €   (récurrent)
Domaine + setup + marge cyber ........   160 €
Crédits LLM option ...................   100 €
─────────────────────────────────────────────
PROVISIONNER ......................... 3 700 €
```

> Les détails robot restent en **§1–§12**.  
> Les détails cloud/cyber sont en **§13** (même fichier — pas de second BOM).

---

## 1. Quelle carte NVIDIA ? (le point important)

### 1.1 Réponse courte

Oui, on peut avoir une carte **vraiment plus performante** — toujours en **Jetson embarqué**, **jamais** une GeForce RTX de PC.

| Niveau | Carte | Perf IA (ordre de grandeur) | RAM | Conso typique | Prix carte ~ | Pour POPY |
|--------|-------|------------------------------|-----|---------------|--------------|-----------|
| Entrée | Orin **Nano Super** 8 Go | **~67 TOPS** | 8 Go | 7–25 W | **289–522 €** | Panier Confort (repli) |
| **Retenu** | Orin **NX 16 Go** (Super) | **~157 TOPS** (~**2,3×** Nano) | **16 Go** | 10–40 W | **1 500–1 750 €** | **Panier Performance** |
| Max lab | **AGX Orin 64 Go** | **~275 TOPS** (~**4×** Nano) | **64 Go** | 15–60 W | **2 300–2 800 €** | Seulement banc / hors robot léger |

**Décision projet :** **Orin NX 16 Go** = le bon compromis « vraiment performant » + encore monable sur un robot mobile.

### 1.2 Pourquoi Orin NX et pas AGX / pas RTX ?

| Option | Verdict | Pourquoi |
|--------|---------|----------|
| **Orin NX 16 Go** | **Choisir** | ~2,3× plus fort que Nano Super, **2× RAM**, modèles vision/voix plus lourds, reste dans un format robot |
| AGX Orin 64 Go | Possible en **labo** | Très fort, mais **cher** (~2,4 k€ la carte seule), chaud, lourd, autonomie batterie difficile sur WAVE ROVER |
| GeForce RTX PC | **Interdit** | Pas un cerveau robot : alimentation ATX, taille, chaleur, pas de stack Jetson embarquée |

Comparatif officiel NVIDIA : https://www.nvidia.com/en-gb/autonomous-machines/embedded-systems/jetson-orin/

### 1.3 Où acheter l’Orin NX 16 Go (fiable)

| Priorité | Produit | Fournisseur | Lien | Prix indicatif TTC |
|----------|---------|-------------|------|--------------------|
| **1 (recommandé)** | **Seeed reComputer J4012** (Orin NX 16 Go + SSD + boîtier) | RobotShop EU / Aetherix / Seeed | https://eu.robotshop.com/products/recomputer-j4012-edge-ai-device-w-nvidia-jetson-orin-nx-16gb-128gb-ssd · https://aetherix.com/product/recomputer-j4012-edge-computer-jetson-orin-nx-16gb/ · https://www.seeedstudio.com/reComputer-J4012-p-5586.html | **≈ 1 500 – 1 750 €** |
| 2 | Waveshare Jetson Orin NX 16G Dev Kit (+ NVMe) | OpenELAB DE / Kamami / Waveshare | https://www.waveshare.com/jetson-orin-nx-16g-dev-kit.htm · https://openelab.io/products/jetson-orin-nx-dev-kit-16gb | **≈ 1 500 – 1 600 €** |
| Lab only | **Jetson AGX Orin 64 Go Dev Kit** | **RS** / Reichelt / Conrad | https://befr.rs-online.com/ (chercher « AGX Orin 64 ») · ex. RS IE : https://ie.rs-online.com/web/p/processor-development-tools/2539662 | **≈ 2 300 – 2 800 €** |

**Règle :** commander **un seul** cerveau (NX **ou** Nano **ou** AGX) — jamais deux.

### 1.4 Budgets paniers

| Panier | Cerveau | Total robot estimé | **À provisionner** | Statut |
|--------|---------|--------------------|--------------------|--------|
| **A++ Performance** | **Orin NX 16 Go** | **≈ 2 550 – 2 800 €** | **2 900 €** | **RETENU** |
| A+ Confort | Orin Nano Super (RS) | ≈ 1 450 – 1 550 € | **1 700 €** | Repli budget |
| A+ Confort (Kubii) | Orin Nano Super | ≈ 1 680 – 1 780 € | **1 900 €** | Repli si Nano |
| Max Lab (AGX) | AGX Orin 64 Go | ≈ 3 400 – 3 800 € | **4 000 €** | Hors robot léger |
| B Secours | Raspberry Pi 5 | ≈ 550 – 900 € | 1 000 € | Si rupture NVIDIA |

### 1.5 Répartition argent — Performance (Orin NX)

```
Jetson Orin NX 16 Go ....... ~1 600 €   (55 %)
Châssis WAVE ROVER ......... ~250 €     (9 %)
Alim renforcée / batteries . ~150 €     (5 %)   ← un peu plus que Confort
Sécurité ESP32 + E-stop .... ~90 €      (3 %)
Capteurs ................... ~48 €      (2 %)
Caméra + cache ............. ~45 €      (2 %)
Audio + LED ................ ~53 €      (2 %)
Câblage / coque / méca ..... ~130 €     (4 %)
Rechanges .................. ~80 €      (3 %)
Outillage .................. ~120 €     (4 %)
Marge / écarts prix ........ ~150 €     (5 %)
────────────────────────────────────────────
À PROVISIONNER ............. 2 900 €
```

### 1.6 Inclus / exclu Performance

| Inclus | Exclu |
|--------|-------|
| **Jetson Orin NX 16 Go** (reComputer ou Waveshare kit) | GeForce RTX PC |
| WAVE ROVER + sécurité + capteurs + audio + caméra budgétée | 2e cerveau NVIDIA |
| Batterie / chargeur **dimensionnés pour conso NX** | AGX sur le châssis léger (sauf décision Lead « lab ») |
| Coque, rechanges, outillage | — |

---

## 2. Ce qu’on construit

```
┌──────────────────────────────────────────────────────────┐
│                 ROBOT POPY — Performance                   │
│                                                            │
│  ┌─────────────────────┐    UART/USB    ┌──────────────┐  │
│  │ NVIDIA Jetson       │◄──────────────►│ ESP32        │  │
│  │ Orin NX 16 Go       │  cerveau IA    │ moteurs      │  │
│  │ ~157 TOPS · 16 Go   │  haute perf    │ E-stop · LED │  │
│  └──────────┬──────────┘                └──────┬───────┘  │
│             │ CSI                               │          │
│             ▼                                   ▼          │
│  ┌─────────────────────┐              ┌────────────────┐  │
│  │ Caméra IMX219       │              │ WAVE ROVER 4WD │  │
│  │ (opt-in privacy)    │              │ + batterie 3S  │  │
│  └─────────────────────┘              └────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### Impact perf sur le reste du robot

| Sujet | Conséquence Orin NX |
|-------|---------------------|
| Autonomie | Un peu **moins** qu’avec Nano → pack batterie soigné, mode 15–25 W en démo |
| Refroidissement | Ventilation **active** (inclus reComputer / kits) — ne pas enfermer sans flux d’air |
| Poids | Boîtier un peu plus lourd → fixer solidement sur WAVE ROVER |
| Logiciel | Même stack JetPack / TensorRT que Nano → le travail IA (Sonia / Pierre-Alexis) **gagne** en marge |

---

## 3. Où commander (fournisseurs fiables)

| Priorité | Boutique | Lien | Pour quoi |
|----------|----------|------|-----------|
| 1 | **RobotShop EU** / **Aetherix** / **Seeed** | https://eu.robotshop.com/ · https://aetherix.com/ · https://www.seeedstudio.com/ | **Orin NX** reComputer J4012 |
| 1b | **OpenELAB** / Waveshare | https://openelab.io/ · https://www.waveshare.com/ | Alt. kit Orin NX 16G |
| 2 | **RS Components France** | https://befr.rs-online.com/ | E-stop, accus, outillage ; AGX si lab ; Nano si repli Confort |
| 3 | **Kubii** | https://www.kubii.com/fr/ | SD, caméra CSI, jumpers ; Nano alt. |
| 4 | **Gotronic** | https://www.gotronic.fr/ | ESP32, capteurs, moteurs, LED, audio |
| 5 | **DigiKey FR** / **Mouser FR** | https://www.digikey.fr/ · https://www.mouser.fr/ | MOSFET, buck, INA219, connecteurs |
| 6 | **Bastelgarage** | https://www.bastelgarage.ch/ | WAVE ROVER |
| OK si marque | LDLC / Amazon **vendu par** Amazon | — | Alim lab |
| Éviter | Accus 18650 no-name, RTX PC « pour le robot » | — | Sécurité / architecture |

**Règle d’or Performance :** cerveau **Orin NX** chez RobotShop/Seeed/OpenELAB → reste électro chez RS/Gotronic/DigiKey.

---

## 4. Décisions figées — panier Performance

| Sujet | Décision | Alternative |
|-------|----------|-------------|
| Cerveau | **Jetson Orin NX 16 Go** | Nano Super (Confort) · AGX (lab only) |
| Achat cerveau | reComputer J4012 **ou** Waveshare NX 16G kit | — |
| Mobilité | **WAVE ROVER / RaspRover** | DIY |
| Sécurité | E-stop + MOSFET + ESP32 | Soft-stop seul |
| Caméra | Budgétée ; vague 3 après policy | — |
| Audio | HP + ampli + micro I2S | — |
| Alim | Pack 3S soigné + éventuellement cellule haute capacité | Accus cheap |
| Coque | PETG avec **aération** pour NX | Boîte fermée étanche sans flux |
| Rechanges / outillage | Oui | — |

---

## 5. Liste complète Confort — à cocher

Légende colonnes :

- **Vague** : 1 = tout de suite · 2 = mobilité · 3 = UX démo  
- **Qui** : E = Erwan · T = Théo · L = Lead valide  
- **Statut** : à cocher `[ ]` → `[x]` quand commandé

### 5.1 Cerveau NVIDIA haute perf (Orin NX) & stockage

| OK | # | Vague | Qté | Article | Pourquoi | Où acheter | Lien | Prix ~ | Qui |
|----|---|-------|-----|---------|----------|------------|------|--------|-----|
| [ ] | 1 | 1 | 1 | **Seeed reComputer J4012 — Jetson Orin NX 16 Go** (+ SSD) | Cerveau IA **haute perf** (~157 TOPS, 16 Go) | RobotShop EU / Aetherix / Seeed | https://eu.robotshop.com/products/recomputer-j4012-edge-ai-device-w-nvidia-jetson-orin-nx-16gb-128gb-ssd | **1 600 €** | T |
| [ ] | 1b | 1 | 1 | *Alt. Waveshare Orin NX 16G Dev Kit* | Même classe perf si J4012 rupture | OpenELAB / Waveshare | https://www.waveshare.com/jetson-orin-nx-16g-dev-kit.htm · https://openelab.io/products/jetson-orin-nx-dev-kit-16gb | *1 550–1 600 €* | T |
| [ ] | 1c | — | 1 | *Repli Confort : Orin Nano Super* | Seulement si budget NX refusé | **RS** | https://befr.rs-online.com/web/p/processor-development-tools/2647384 | *289 €* | T |
| [ ] | 1d | — | 1 | *Lab max : AGX Orin 64 Go* | Banc lourd, **pas** châssis léger | RS / Reichelt | https://ie.rs-online.com/web/p/processor-development-tools/2539662 | *2 300–2 800 €* | L+T |
| [ ] | 2 | 1 | 1 | microSD **A2 128 Go** (backup / outils ; J4012 a déjà NVMe) | Image de secours / transfert | Kubii / LDLC | « microSD 128 Go A2 Extreme » | **25 €** | T |

> **Commander une seule ligne parmi #1 / #1b / #1c / #1d.**  
> Panier Performance = **#1** (ou **#1b** si rupture).

**Sous-total cerveau Performance (#1 + #2) :** ≈ **1 625 €**

---

### 5.2 Sécurité & MCU (ESP32)

| OK | # | Vague | Qté | Article | Pourquoi | Où | Lien / recherche | Prix ~ | Qui |
|----|---|-------|-----|---------|----------|-----|------------------|--------|-----|
| [ ] | 3 | 1 | **2** | ESP32-WROOM DevKit (ou ESP32-S3) | Moteurs, E-stop, LED ; 1 rechange | Gotronic | https://www.gotronic.fr/ → « ESP32 » | **30 €** | T |
| [ ] | 4 | 1 | 1 | Bouton **arrêt d’urgence** champignon **NC** | Coupure physique moteurs | RS | https://befr.rs-online.com/ → « emergency stop » / « arrêt d'urgence » | **30 €** | E |
| [ ] | 5 | 1 | 1 | MOSFET logic-level **20–30 A** (ou relais puissance) | Coupe alim traction | DigiKey / Mouser | DigiKey → MOSFET N-channel logic-level | **12 €** | E |
| [ ] | 6 | 1 | 1 | Convertisseur **buck 5 V / ≥ 5 A** | Alim logique stable | DigiKey / Kubii | « buck 5V 5A » | **18 €** | E |

**Sous-total sécurité/MCU :** ≈ **90 €**

---

### 5.3 Mobilité — châssis Confort

| OK | # | Vague | Qté | Article | Pourquoi | Où | Lien | Prix ~ | Qui |
|----|---|-------|-----|---------|----------|-----|------|--------|-----|
| [ ] | 7 | 2 | 1 | **WAVE ROVER / RaspRover** 4WD (alu + drivers + UPS) | Châssis prêt, compatible Jetson/Pi | Bastelgarage / UE | https://www.bastelgarage.ch/rasprover-4wd-ai-robot-pour-raspberry-pi-5 | **250 €** | E |
| [ ] | 8 | 2 | **3** | Accus **18650 protégés** marque (Panasonic / Samsung / Sony) | Batterie UPS 3S — **pas de no-name** | RS | RS → « 18650 protected » | **33 €** | E |

Doc technique rover : https://www.waveshare.com/wiki/WAVE_ROVER

**Sous-total mobilité :** ≈ **283 €**

---

### 5.4 Alimentation & banc de test

| OK | # | Vague | Qté | Article | Pourquoi | Où | Recherche | Prix ~ | Qui |
|----|---|-------|-----|---------|----------|-----|-----------|--------|-----|
| [ ] | 9 | 2 | 1 | Chargeur adapté **3S** ou USB-C PD compatible | Recharger le pack | Kubii / constructeur UPS | Selon doc WAVE ROVER | **30 €** | E |
| [ ] | 10 | 2 | 1 | Interrupteur général + porte-fusible | Coupure manuelle safe | RS | « switch » + « fuse holder » | **10 €** | E |
| [ ] | 11 | 2 | 1 | Alim lab **12 V 5 A** (marque : Mean Well ou équivalent sérieux) | Tests sans batterie | LDLC / Amazon marque | « 12V 5A power supply » | **35 €** | E |

**Sous-total alim :** ≈ **75 €**

---

### 5.5 Capteurs démo

| OK | # | Vague | Qté | Article | Pourquoi | Où | Recherche | Prix ~ | Qui |
|----|---|-------|-----|---------|----------|-----|-----------|--------|-----|
| [ ] | 12 | 2 | 1 | Ultrason **HC-SR04** **ou** ToF **VL53L0X** | Anti-collision | Gotronic | https://www.gotronic.fr/ | **12 €** | E |
| [ ] | 13 | 2 | 1 | IMU 6 axes (**MPU6050** / BMI160) | Orientation / logs | Gotronic / DigiKey | « MPU6050 » | **12 €** | T |
| [ ] | 14 | 2 | 1 | Capteur courant **INA219** | Mesure conso | DigiKey | « INA219 breakout » | **12 €** | T |
| [ ] | 15 | 2 | 1 | Lot boutons tactiles **gros format** | Interaction enfant | Gotronic | boutons arcade / tactiles | **12 €** | E |

**Sous-total capteurs :** ≈ **48 €**

---

### 5.6 Caméra (budgétée Confort — commander en vague 3 seulement)

| OK | # | Vague | Qté | Article | Pourquoi | Où | Recherche | Prix ~ | Qui |
|----|---|-------|-----|---------|----------|-----|-----------|--------|-----|
| [ ] | 16 | 3 | 1 | Caméra **CSI IMX219** 8 MP (compatible Jetson/Pi) | Vision IA | Kubii | « caméra CSI » / IMX219 | **35 €** | T |
| [ ] | 17 | 3 | 1 | Nappe CSI longueur adaptée | Liaison caméra ↔ Jetson | Kubii | nappe CSI | **5 €** | T |
| [ ] | 18 | 3 | 1 | Cache / obturateur mécanique | Privacy (caméra off by default) | Impression 3D | — | **5 €** | E |

**Bloquant avant commande #16–18 :** policy opt-in vision écrite et validée Lead.  
**Sous-total caméra :** ≈ **45 €** (à provisionner dès maintenant)

---

### 5.7 Audio & LED

| OK | # | Vague | Qté | Article | Pourquoi | Où | Recherche | Prix ~ | Qui |
|----|---|-------|-----|---------|----------|-----|-----------|--------|-----|
| [ ] | 19 | 3 | 1 | Haut-parleur **3–5 W** + ampli **MAX98357** ou PAM8403 | Voix / consignes | Gotronic / DigiKey | HP + ampli I2S / class D | **20 €** | T |
| [ ] | 20 | 3 | 1 | Micro **I2S** (ex. INMP441) | Écoute (off by default) | DigiKey | « INMP441 » | **10 €** | T |
| [ ] | 21 | 2 | 1 | Bandeau LED **WS2812** 30–60 LEDs | États : idle / listen / ok / estop | Gotronic / Kubii | « WS2812 » | **15 €** | E |
| [ ] | 22 | 2 | 1 | Level shifter 3.3↔5 V + résistances | LED / logique | DigiKey | level shifter + kit résistances | **8 €** | E |

**Sous-total audio/LED :** ≈ **53 €**

---

### 5.8 Câblage, proto, coque

| OK | # | Vague | Qté | Article | Pourquoi | Où | Prix ~ | Qui |
|----|---|-------|-----|---------|----------|-----|--------|-----|
| [ ] | 23 | 1 | 1 | Kit jumpers M-M / M-F / F-F + breadboard | Proto rapide | Kubii | **15 €** | T |
| [ ] | 24 | 3 | 1 lot | Connecteurs **XT30** / **JST** (alim) | Câblage batterie propre | DigiKey | **15 €** | E |
| [ ] | 25 | 3 | 1 | Perfboard + fil silicone **18–22 AWG** | Câblage définitif | DigiKey | **25 €** | E |
| [ ] | 26 | 3 | 1 | Vis M2/M3 nylon + inserts + attaches câbles | Fixations | Quincaillerie / Amazon | **20 €** | E |
| [ ] | 27 | 3 | 1 | Filament **PETG** + impression coque | Look démo + protection | Local / école | **50 €** | E |
| [ ] | 28 | 3 | 1 | Patins antidérapants / butées | Sol / table | Quincaillerie | **5 €** | E |

**Sous-total méca/câblage :** ≈ **130 €**

---

### 5.9 Rechanges (obligatoires Confort)

| OK | # | Vague | Qté | Article | Pourquoi | Où | Prix ~ | Qui |
|----|---|-------|-----|---------|----------|-----|--------|-----|
| [ ] | 29 | 3 | 2 | Motoréducteurs de secours | Usure / casse démo | Gotronic | **30 €** | E |
| [ ] | 30 | 3 | 1 | Driver moteurs de secours | Court-circuit | Gotronic | **20 €** | E |
| [ ] | 31 | 3 | 1 lot | Fusibles + MOSFET secours | Sécurité | DigiKey | **10 €** | E |
| [ ] | 32 | 3 | 1 | microSD 128 Go de secours | Corruption OS | Kubii | **20 €** | T |

> L’ESP32 de rechange est déjà dans la **qté 2** de la ligne #3.

**Sous-total rechanges :** ≈ **80 €**

---

### 5.10 Outillage (si pas déjà à l’atelier)

| OK | # | Vague | Qté | Article | Pourquoi | Où | Prix ~ | Qui |
|----|---|-------|-----|---------|----------|-----|--------|-----|
| [ ] | 33 | 1 | 1 | Multimètre | Debug tension / continuité | RS / Leroy Merlin | **35 €** | E |
| [ ] | 34 | 3 | 1 | Fer à souder + étain | Assemblages fiables | RS | **50 €** | E |
| [ ] | 35 | 3 | 1 | Tournevis précision + pince coupante + pince à dénuder | Montage | RS / Leroy | **35 €** | E |

**Sous-total outillage :** ≈ **120 €** — **à sauter** si l’atelier est déjà équipé.

---

### 5.11 Totaux Performance (récap)

| Bloc | Lignes | Total ~ |
|------|--------|---------|
| **Cerveau Orin NX + SD** | #1 + #2 | **1 625 €** |
| Sécurité / ESP32 | #3–#6 | 90 € |
| Mobilité WAVE ROVER + 18650 | #7–#8 | 283 € |
| Alimentation | #9–#11 | 75 € |
| Capteurs | #12–#15 | 48 € |
| Caméra | #16–#18 | 45 € |
| Audio / LED | #19–#22 | 53 € |
| Câblage / coque | #23–#28 | 130 € |
| Rechanges | #29–#32 | 80 € |
| Outillage | #33–#35 | 120 € |
| **TOTAL Performance** | | **≈ 2 550 – 2 800 €** |
| **À PROVISIONNER** | | **2 900 €** |
| Si repli Confort (#1c Nano RS) | | provisionner **1 700 €** |
| Si lab AGX (#1d) | | provisionner **4 000 €** |

---

## 6. Paniers par boutique (pratique)

### 6.0 Panier cerveau Performance — ~1 600 €

| Article | Lien | ~ |
|---------|------|---|
| **reComputer J4012 Orin NX 16 Go** | https://eu.robotshop.com/products/recomputer-j4012-edge-ai-device-w-nvidia-jetson-orin-nx-16gb-128gb-ssd | 1 600 € |
| *Alt. Waveshare NX 16G* | https://www.waveshare.com/jetson-orin-nx-16g-dev-kit.htm | *1 550 €* |

### 6.1 Panier RS Components — ~160 € (sans Nano ; + Nano seulement si repli Confort)

| Article | Lien / recherche | ~ |
|---------|------------------|---|
| Bouton E-stop champignon NC | « arrêt d'urgence » | 30 € |
| 3× 18650 protégés | « 18650 protected » | 33 € |
| Interrupteur + porte-fusible | switch + fuse holder | 10 € |
| Multimètre | multimètre | 35 € |
| Fer + étain (vague 3) | fer à souder | 50 € |
| *Repli : Orin Nano Super* | https://befr.rs-online.com/web/p/processor-development-tools/2647384 | *289 €* |
| *Lab : AGX Orin 64 Go* | chercher « AGX Orin 64 » | *2 360 €+* |

Site : https://befr.rs-online.com/

### 6.2 Panier Kubii — ~100 €

| Article | Recherche | ~ |
|---------|-----------|---|
| microSD 128 Go A2 | microSD Extreme | 25 € |
| Caméra CSI IMX219 (vague 3) | caméra CSI | 35 € |
| Nappe CSI | nappe | 5 € |
| Jumpers + breadboard | jumpers breadboard | 15 € |
| microSD rechange | idem | 20 € |

Site : https://www.kubii.com/fr/

### 6.3 Panier Gotronic — ~130 €

| Article | Recherche | ~ |
|---------|-----------|---|
| 2× ESP32 DevKit | ESP32 | 30 € |
| Ultrason ou VL53L0X | ultrason / ToF | 12 € |
| IMU MPU6050 | MPU6050 | 12 € |
| Boutons gros format | boutons | 12 € |
| LED WS2812 | WS2812 | 15 € |
| HP + ampli | haut-parleur ampli | 20 € |
| 2× motoréducteurs rechange | motoréducteur | 30 € |
| Driver moteurs rechange | driver moteur | 20 € |

Site : https://www.gotronic.fr/

### 6.4 Panier DigiKey / Mouser — ~100 €

| Article | Recherche | ~ |
|---------|-----------|---|
| MOSFET 20–30 A logic-level | MOSFET N-CH logic level | 12 € |
| Buck 5 V 5 A | buck converter 5A | 18 € |
| INA219 | INA219 | 12 € |
| Micro INMP441 | INMP441 | 10 € |
| Level shifter + résistances | level shifter | 8 € |
| XT30 / JST + fil silicone + perfboard | XT30, JST, silicone wire | 40 € |
| Fusibles / MOSFET secours | fuse | 10 € |

Sites : https://www.digikey.fr/ · https://www.mouser.fr/

### 6.5 Panier Bastelgarage (rover) — ~250 €

| Article | Lien | ~ |
|---------|------|---|
| RaspRover / WAVE ROVER (sans Pi) | https://www.bastelgarage.ch/rasprover-4wd-ai-robot-pour-raspberry-pi-5 | 250 € |

### 6.6 Divers local — ~110 €

| Article | Où | ~ |
|---------|-----|---|
| Alim lab 12 V 5 A | LDLC / Amazon marque | 35 € |
| Chargeur 3S / PD | selon UPS rover | 30 € |
| Vis / inserts / patins | Quincaillerie | 25 € |
| Filament PETG + impression | École / fablab | 50 € |
| Cache caméra | Impression 3D | 5 € |
| Outillage pinces / tournevis | Leroy / RS | 35 € |

---

## 7. Trois vagues de commande (calendrier)

### Vague 1 — Immédiat (sprints H0–H1) — ~1 750 €

**Objectif :** faire démarrer **Orin NX** + ESP32 + sécurité de base.

| # | Article |
|---|---------|
| 1 | **reComputer J4012 Orin NX 16 Go** (ou 1b Waveshare) |
| 2 | microSD 128 Go (secours) |
| 3 | ESP32 ×2 |
| 4 | E-stop |
| 5 | MOSFET |
| 6 | Buck 5 V |
| 23 | Jumpers + breadboard |
| 33 | Multimètre |

**Checklist vague 1**

- [ ] Budget **2 900 €** validé Lead  
- [ ] Stock J4012 / Waveshare NX vérifié (capture)  
- [ ] Si rupture NX → trancher repli Nano (#1c) ou attendre restock  
- [ ] Commande cerveau passée  
- [ ] N° commande noté en §10 

### Vague 2 — Mobilité (sprints H2–H3) — ~470 €

**Objectif :** robot qui roule + capteurs + LED.

| # | Article |
|---|---------|
| 7 | WAVE ROVER |
| 8 | 3× 18650 |
| 9–11 | Chargeur, interrupteur, alim lab |
| 12–15 | Capteurs + boutons |
| 21–22 | LED + level shifter |

**Checklist vague 2**

- [ ] Doc WAVE ROVER lue  
- [ ] Accus **protégés** uniquement (pas cheap)  
- [ ] Commande Bastelgarage + Gotronic + RS restant  
- [ ] N° commandes en §10  

### Vague 3 — UX démo (sprints H6+) — ~450 €

**Objectif :** voix, look, vision (si policy OK), stock rechange, outillage soudure.

| # | Article |
|---|---------|
| 16–18 | Caméra + nappe + cache (**après policy**) |
| 19–20 | HP + ampli + micro |
| 24–28 | Connecteurs, fil, vis, coque, patins |
| 29–32 | Rechanges |
| 34–35 | Fer + pinces / tournevis |

**Checklist vague 3**

- [ ] Policy caméra opt-in **écrite et validée** avant #16  
- [ ] Coque dimensionnée après 1er assemblage rover  
- [ ] Rechanges stockées dans boîte « DEMO »  
- [ ] N° commandes en §10  

---

## 8. Avant d’acheter — checklist Lead

- [ ] ADR-HW-001 signée (**Orin NX 16 Go** + MCU)  
- [ ] Budget **Performance** validé : **2 900 €**  
- [ ] Si budget insuffisant : bascule écrite vers Confort Nano (**1 700 €**)  
- [ ] Adresse de livraison confirmée  
- [ ] Compte RobotShop / Seeed / RS / DigiKey prêts  
- [ ] Stock Orin NX vérifié (capture)  
- [ ] Erwan & Théo ont lu §1 (comparatif NVIDIA)  
- [ ] Caméra budgétée, pas commandée sans policy  
- [ ] Plan aération coque pour NX noté  

---

## 9. Ne pas acheter (erreurs fréquentes)

| Ne pas commander | Pourquoi |
|------------------|----------|
| GeForce RTX 3060/4060/4090… | Pas un cerveau robot |
| Orin NX **et** Nano **et** AGX | Un seul cerveau |
| AGX Orin sur WAVE ROVER sans étude alim/thermique | Trop gourmand / chaud / lourd |
| Accus 18650 no-name | Risque incendie |
| Caméra vague 1 | Policy privacy |
| Coque 100 % fermée sans ventilation | Thermal throttle / panne NX |
| Châssis DIY **en plus** du WAVE ROVER | Doublon |

---

## 10. Suivi des dépenses (robot + cloud + IA)

### 10.1 Achats robot / one-shot

| Date | Vague | Fournisseur | N° commande | Articles (#) | Montant réel TTC | Reçu le | Statut |
|------|-------|-------------|-------------|--------------|------------------|---------|--------|
| | 1 | | | | | | |
| | 2 | | | | | | |
| | 3 | | | | | | |

### 10.2 Abonnements & cloud (mensuel)

| Mois | Hébergeur | Domaine | Monitoring | LLM API | Sécu / autre | Total mois | Payé par |
|------|-----------|---------|------------|---------|--------------|------------|----------|
| 2026-10 | | | | | | | |
| 2026-11 | | | | | | | |
| 2026-12 | | | | | | | |
| 2027-01 | | | | | | | |
| 2027-02 | | | | | | | |
| 2027-03 | | | | | | | |
| 2027-04 | | | | | | | |
| 2027-05 | | | | | | | |
| 2027-06 | | | | | | | |

### 10.3 Totaux réels

| Poste | Provisionné | Dépensé à ce jour | Écart |
|-------|-------------|-------------------|-------|
| A — Robot | 2 900 € | ___ € | |
| B — Cloud & cyber | 700 € | ___ € | |
| C — IA API | 100 € | ___ € | |
| **TOTAL** | **3 700 €** | ___ € | |

Après chaque livraison robot, cocher `[x]` en §5.

---

## 11. Qui fait quoi (achats)

| Qui | Responsabilité achats |
|-----|------------------------|
| **Théo** | Orin NX, SD, ESP32, caméra, audio, JetPack |
| **Erwan** | WAVE ROVER, batteries, E-stop, coque ventilée, DigiKey |
| **Mériem** | Hébergeur UE, VPS, domaine, monitoring, object storage, factures cloud |
| **Fabio** | Outils sécu (scan, pentest si budget), validation DPA / checklist avant paiement risqué |
| **Sonia** | Crédits LLM (avec Mériem pour le compte de facturation) |
| **Yacine** | Cadre RGPD (validation DPA / privacy avant outils risqués) — `PLAN_RGPD_YACINE.md` |
| **Lead** | Valide **3 700 €** global ; tranche NX vs Nano ; go pentest / conseil juridique |
| **Tous** | Remplissent §10 à chaque dépense |

---

## 12. Liens rapides (favoris)

| Besoin | URL |
|--------|-----|
| **Orin NX reComputer J4012** (RobotShop EU) | https://eu.robotshop.com/products/recomputer-j4012-edge-ai-device-w-nvidia-jetson-orin-nx-16gb-128gb-ssd |
| Orin NX J4012 (Aetherix) | https://aetherix.com/product/recomputer-j4012-edge-computer-jetson-orin-nx-16gb/ |
| Orin NX J4012 (Seeed) | https://www.seeedstudio.com/reComputer-J4012-p-5586.html |
| Waveshare Orin NX 16G kit | https://www.waveshare.com/jetson-orin-nx-16g-dev-kit.htm |
| Comparatif Jetson NVIDIA | https://www.nvidia.com/en-gb/autonomous-machines/embedded-systems/jetson-orin/ |
| Repli Nano Super RS | https://befr.rs-online.com/web/p/processor-development-tools/2647384 |
| AGX Orin 64 Go (lab) | https://ie.rs-online.com/web/p/processor-development-tools/2539662 |
| Scaleway | https://www.scaleway.com/fr/ |
| OVHcloud | https://www.ovhcloud.com/fr/ |
| Infomaniak | https://www.infomaniak.com/ |
| Let’s Encrypt | https://letsencrypt.org/ |
| Kubii FR | https://www.kubii.com/fr/ |
| Gotronic | https://www.gotronic.fr/ |
| DigiKey FR | https://www.digikey.fr/ |
| RaspRover EU | https://www.bastelgarage.ch/rasprover-4wd-ai-robot-pour-raspberry-pi-5 |
| Doc WAVE ROVER | https://www.waveshare.com/wiki/WAVE_ROVER |

---

## 13. Cloud & cybersécurité — coûts (Mériem & Fabio)

> Même BOM que le robot. Plan détaillé : [`PLAN_CLOUD_CYBER_MERIEM_FABIO.md`](../../PLAN_CLOUD_CYBER_MERIEM_FABIO.md).  
> Période budgétée : **9 mois** (oct. 2026 → juin 2027).

### 13.1 Récurrent mensuel (hébergement UE)

| OK | # | Qté | Article | Pourquoi | Fournisseur type | Prix ~ / mois | Qui |
|----|---|-----|---------|----------|------------------|---------------|-----|
| [ ] | C1 | 1 | **VPS / instance** 4–8 Go RAM (préprod + demo) | API + front + Postgres | **Scaleway** ou **OVHcloud** | **25 – 40 €** | Mériem |
| [ ] | C2 | 0–1 | Postgres **managé** (si pas Postgres dans le VPS) | HA / backups hébergeur | Scaleway/OVH | **0 – 30 €** | Mériem |
| [ ] | C3 | 1 | **Object storage** (backups chiffrés, exports) | Restore + RGPD | Scaleway Object / OVH S3 | **2 – 5 €** | Mériem |
| [ ] | C4 | 1 | **Nom de domaine** (.fr / .eu) | HTTPS démo | OVH / Gandi / Infomaniak | **≈ 1 €** (amorti) | Mériem |
| [ ] | C5 | 0–1 | Monitoring uptime (si au-delà du free) | Alertes down | Better Stack / UptimeRobot | **0 – 10 €** | Mériem |
| [ ] | C6 | 0–1 | Boîte mail transactionnelle (opt.) | Reset MDP / notifs | Brevo / Scaleway Tem | **0 – 5 €** | Mériem |

**Sous-total mensuel Confort cloud :** **≈ 30 – 60 € / mois** (VPS all-in sans Postgres managé).  
**Sous-total mensuel Haut de gamme :** **≈ 50 – 80 € / mois**.

#### Projection 9 mois

| Intensité | € / mois | × 9 mois | À provisionner |
|-----------|----------|----------|----------------|
| Essentiel (VPS + stockage + domaine) | **35 €** | **315 €** | **350 €** |
| **Confort (retenu)** | **50 €** | **450 €** | **500 €** |
| Confort + marge + outils | **70 €** | **630 €** | **700 €** ← **retenu projet** |

### 13.2 One-shot / ponctuel cyber

| OK | # | Qté | Article | Pourquoi | Où | Prix ~ | Qui |
|----|---|-----|---------|----------|-----|--------|-----|
| [ ] | C10 | 1 | Frais création compte org / CB vérif | Setup hébergeur | Scaleway/OVH | **0 – 20 €** | Mériem |
| [ ] | C11 | 1 | Certificats TLS | HTTPS | Let’s Encrypt | **0 €** | Mériem |
| [ ] | C12 | 1 | Nom de domaine (1re année) | URL démo | OVH/Gandi | **10 – 20 €** | Mériem |
| [ ] | C13 | 1 | Outils SCA/SAST | Dependabot/CodeQL/Semgrep | GitHub | **0 €** (free) | Fabio |
| [ ] | C14 | 0–1 | **Pentest externe light** (option Lead) | Audit avant juin | Prestataire FR/UE | **500 – 2 000 €** | Fabio + Lead |
| [ ] | C15 | 0–1 | Formation / livre sécu (opt.) | Montée en compétence | — | **0 – 50 €** | Fabio |

**One-shot minimum (sans pentest) :** ≈ **15 – 40 €** (domaine + setup).  
**Inclus dans les 700 € provisionnés :** mensuel confort 9 mois + domaine + **~150 € marge** (écarts prix / mois de plus / petit outil).  
**Pentest externe :** **hors** des 700 € — ligne séparée si le Lead dit oui.

### 13.3 Ticket cloud Confort retenu (dans les 700 €)

| Poste | Calcul | Montant |
|-------|--------|---------|
| VPS + object storage + monitoring léger | 50 € × 9 | 450 € |
| Domaine 1 an | — | 15 € |
| Marge / imprévus cloud-cyber | — | 135 € |
| Outils sécu CI | free | 0 € |
| TLS | Let’s Encrypt | 0 € |
| **Provision B — Cloud & cyber** | | **700 €** |
| *Option pentest externe* | devis | *+500–2 000 €* |

### 13.4 Ordre d’achat cloud (aligné sprints CC)

| Vague | Quand | Quoi | € approx |
|-------|-------|------|----------|
| **CV1** | Sprint CC0–CC1 (oct–nov) | Compte hébergeur + domaine + VPS + TLS | ~50–80 € setup + 1er mois |
| **CV2** | CC2 (janv.) | Object storage backups + monitoring | +5–15 € / mois |
| **CV3** | CC6 (mai) | Pentest **si** budget Lead | +500–2 000 € |
| **Mensuel** | Chaque mois | Facture VPS/stockage | ~35–70 € |

### 13.5 Fournisseurs cloud fiables (UE)

| Priorité | Fournisseur | Lien | Usage |
|----------|-------------|------|-------|
| 1 | **Scaleway** | https://www.scaleway.com/fr/ | VPS, Object, secrets |
| 1 | **OVHcloud** | https://www.ovhcloud.com/fr/ | VPS, domaine, DNS |
| 2 | **Infomaniak** | https://www.infomaniak.com/ | Hébergement CH/UE, mail |
| OK | GitHub | https://github.com/ | CI, Dependabot, CodeQL, Environments secrets |
| OK | Let’s Encrypt | https://letsencrypt.org/ | TLS gratuit |
| Éviter | Hébergeur hors UE sans ADR/DPA | — | Non conforme spec projet |

### 13.6 Ne pas acheter (cloud/cyber)

| Ne pas | Pourquoi |
|--------|----------|
| Cluster Kubernetes « pour la démo » | Trop cher / complexe avant juin |
| Multi-région mondiale | Hors besoin ; coût ×N |
| SIEM enterprise | Overkill étudiant / préprod |
| VPN payant inutile si SSH clé + firewall OK | — |
| Pentest 5 k€ | Pas le premier levier ; option light suffit |

---

## 14. Options IA (crédits API) — même BOM

| OK | # | Article | Pourquoi | Fournisseur | Provision | Qui |
|----|---|---------|----------|-------------|-----------|-----|
| [ ] | I1 | Crédits **Mistral** ou **OpenAI** (inference démo) | `/pedagogy/ask` avec LLM | Console Mistral/OpenAI | **100 €** (jusqu’à juin) | Sonia |
| [ ] | I2 | GPU cloud train (opt., si pas machine école) | LoRA ponctuel | Scaleway GPU / Colab Pro | **0 – 200 €** | Sonia/PA |
| [ ] | I3 | Stockage datasets (si hors git) | Cards / dumps | Object storage (déjà C3) | inclus B | PA |

**Provision C retenue :** **100 €** (I1).  
I2 seulement si ADR-AI + go Lead (sinon machine locale / école).

---

## Annexe A — Panier B secours (si Jetson impossible)

| Article | Où | ~ |
|---------|-----|---|
| Raspberry Pi 5 8 Go | Kubii | 100 € |
| Alim officielle Pi 5 27 W | Kubii | 15 € |
| SD 128 Go | Kubii | 20 € |
| Reste Confort sans NVIDIA | — | 400–700 € |
| **Total robot B** | | **≈ 550 – 900 €** |
| **+ Cloud B (700 €)** | | **≈ 1 250 – 1 600 €** projet |

IA lourde → surtout **serveur**.

---

## Annexe B — Panier A+ Confort robot (repli budget NX)

Si le Lead refuse les **2 900 €** robot :

- Remplacer #1 par **Orin Nano Super RS** (#1c, ~289 €)  
- Garder le reste robot  
- Provisionner robot **1 700 €** + cloud **700 €** + IA **100 €** = **≈ 2 500 €** projet  
- Perf IA ~**67 TOPS** au lieu de ~**157 TOPS**

---

## Annexe C — Option Max Lab AGX (hors robot léger)

- #1d AGX Orin 64 Go (~2 300–2 800 €)  
- Robot+AGX ~**4 000 €** + cloud **700 €** ≈ **4 700 €**  
- **Ne pas** monter tel quel sur WAVE ROVER sans redesign alim/thermique/mécanique  

---

## Annexe D — Tableau unique « bon de commande Lead »

| Ligne | Libellé | Provision | GO Lead |
|-------|---------|-----------|---------|
| A | Robot Performance (Orin NX) | 2 900 € | [ ] |
| B | Cloud & cyber (9 mois + marge) | 700 € | [ ] |
| C | Crédits LLM | 100 € | [ ] |
| D | Pentest externe (option) | 0 – 2 000 € | [ ] |
| E | Conseil juridique RGPD externe (option Yacine) | 0 – 1 500 € | [ ] |
| | **TOTAL recommandé (A+B+C)** | **3 700 €** | [ ] |

---

**Fin du BOM v4.0 — Budget projet unique (Robot + Cloud/Cyber + IA).**  
Prochaines actions : Lead valide **3 700 €** → Théo vague 1 robot (J4012) · Mériem vague CV1 cloud (hébergeur + domaine).
