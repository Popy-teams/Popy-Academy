# Dictionnaire des types d'événements comportement

**Schéma de référence :** `behavior_event.json`  
**Version schéma :** 1.1  
**Owner :** Pierre-Alexis  
**Dernière mise à jour :** 2026-10-29

> Ce document est la version lisible par un humain du schéma JSON.
> En cas de conflit, `behavior_event.json` fait foi.

---

## Structure commune à tous les événements

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| `event_id` | UUID v4 | ✅ | Identifiant unique — généré côté client |
| `ts` | ISO-8601 UTC | ✅ | Horodatage de l'action réelle (pas de l'envoi) |
| `schema_version` | `"1.0"` | ✅ | Version du schéma |
| `device` | `"web"` ou `"robot"` | ✅ | Canal d'émission |
| `session_id` | UUID v4 | ✅ | Regroupe tous les événements d'une séance |
| `child_id_hash` | hex 64 chars | ✅ | HMAC-SHA256 du child_id — jamais l'ID en clair |
| `type` | string enum | ✅ | Type d'événement (voir ci-dessous) |
| `sync_policy` | `"stream"` / `"local_buffer"` / `"local_only"` | — | Politique de transport. `stream` = direct API cloud (web). `local_buffer` = stocké localement, agrégé avant envoi cloud (robot). `local_only` = reste sur l'appareil. Optionnel : le pipeline infère depuis `device` si absent. |
| `payload` | object | ✅ | Données spécifiques au type |

**Règle privacy :** le payload ne contient jamais nom, email, école, diagnostic, ni contenu de messages famille.

---

## Types d'événements

### `session_start`
**Quand :** l'enfant ouvre l'app et démarre une séance de travail (après authentification).  
**Payload :**

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| `child_level` | `CP` / `CE1` / `CE2` / `CM1` / `CM2` | — | Niveau scolaire de l'enfant |
| `subscription_type` | `ordinateur` / `famille` / `ecole` | — | Type d'abonnement actif |
| `is_offline` | boolean | — | `true` si l'app démarre hors-ligne |

---

### `session_end`
**Quand :** la session se termine (déconnexion, timeout, fermeture de l'app).  
**Note :** peut ne pas arriver en cas de crash — prévoir une logique de fermeture automatique après X minutes d'inactivité côté backend.  
**Payload :**

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| `duration_ms` | integer ≥ 0 | ✅ | Durée totale de la session en ms |
| `activities_completed` | integer ≥ 0 | — | Activités réussies pendant la session |
| `activities_attempted` | integer ≥ 0 | — | Activités démarrées pendant la session |
| `reason` | `user_logout` / `inactivity_timeout` / `app_close` / `crash` / `unknown` | — | Cause de fin de session |

---

### `activity_start`
**Quand :** l'enfant démarre une activité (clic sur "Commencer", chargement auto…).  
**Payload :**

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| `content_id` | string | ✅ | ID du contenu POPY démarré |
| `difficulty` | `easy` / `standard` / `remediation` | — | Niveau proposé à l'enfant |
| `activity_type` | `exercise` / `quiz` / `game` / `reading` | — | Modalité de l'activité |
| `competency_id` | string | — | Compétence travaillée |

**Exemple :**
```json
{
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "ts": "2026-10-22T10:00:00.000Z",
  "schema_version": "1.0",
  "device": "web",
  "session_id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "child_id_hash": "a3f5c7d2e1b4960873a25d1c6f8e042b9710345678abcdef9012345678abcdef",
  "type": "activity_start",
  "payload": {
    "content_id": "content_frac_visuel_01",
    "difficulty": "standard",
    "activity_type": "exercise",
    "competency_id": "comp_cm1_maths_frac_01"
  }
}
```

---

### `activity_success`
**Quand :** l'enfant complète correctement une activité.  
**Payload :**

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| `content_id` | string | ✅ | ID du contenu complété |
| `duration_ms` | integer ≥ 0 | ✅ | Durée totale en ms depuis `activity_start` |
| `attempt` | integer ≥ 1 | ✅ | Numéro de la tentative réussie (1 = premier coup) |
| `score_pct` | integer 0–100 | — | Score si l'activité est scorée |
| `hints_used_count` | integer ≥ 0 | — | Nombre d'indices demandés au total |

---

### `activity_fail`
**Quand :** l'enfant donne une mauvaise réponse / dépasse le temps imparti sur une tentative.  
**Note :** peut apparaître plusieurs fois avant un `activity_success`.  
**Payload :**

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| `content_id` | string | ✅ | ID du contenu échoué |
| `duration_ms` | integer ≥ 0 | ✅ | Durée de cette tentative |
| `attempt` | integer ≥ 1 | ✅ | Numéro de la tentative échouée |
| `error_category` | `wrong_answer` / `timeout` / `incomplete` / `unknown` | — | Catégorie d'erreur si identifiable |

---

### `hint_used`
**Quand :** l'enfant clique sur "Indice" / "Aide" pendant une activité.  
**Payload :**

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| `content_id` | string | ✅ | ID du contenu en cours |
| `hint_index` | integer ≥ 1 | ✅ | Rang de l'indice (1 = premier indice disponible) |
| `attempt` | integer ≥ 1 | ✅ | Numéro de la tentative en cours |

**Usage analytique :** un enfant qui demande `hint_index=3` a déjà épuisé les deux premiers — signal de difficulté forte.

---

### `abandon`
**Quand :** l'enfant quitte une activité sans la terminer (navigation, timeout, fermeture).  
**Payload :**

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| `content_id` | string | ✅ | ID du contenu abandonné |
| `duration_ms` | integer ≥ 0 | ✅ | Durée passée sur l'activité avant abandon |
| `attempt` | integer ≥ 1 | ✅ | Numéro de la tentative abandonnée |
| `completion_pct` | integer 0–100 | — | Avancement si mesurable par le front |
| `trigger` | `user_navigation` / `inactivity_timeout` / `session_end` / `unknown` | — | Ce qui a déclenché l'abandon |

---

### `pause`
**Quand :** la session est mise en pause (bouton pause, inactivité détectée, coupure réseau…).  
**Payload :**

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| `content_id` | string | — | ID du contenu en cours (vide si hors activité) |
| `reason` | `user_action` / `inactivity_timeout` / `system` | — | Origine de la pause |

---

### `resume`
**Quand :** la session reprend après une pause.  
**Payload :**

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| `pause_duration_ms` | integer ≥ 0 | ✅ | Durée de la pause en ms |
| `content_id` | string | — | ID du contenu repris (même valeur que le `pause` associé) |

---

### `vision_signal`
**Quand :** le robot détecte un changement d'état attentionnel ou d'engagement via son analyse posturale et de direction du regard.  
**Contrainte :** uniquement `device: "robot"` — jamais émis depuis l'interface web.  
**Contrainte RGPD :** indicateurs comportementaux posturo-gestuels uniquement. Pas de reconnaissance faciale, pas d'inférence d'émotions au sens biométrique. Camera opt-in obligatoire — cet événement ne peut être émis que si le consentement a été accordé en amont.  
**Payload :**

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| `attention_state` | `focused` / `distracted` / `absent` / `unknown` | ✅ | État attentionnel détecté |
| `engagement_level` | `high` / `medium` / `low` / `unknown` | — | Niveau d'engagement estimé |
| `fatigue_detected` | boolean | — | Indicateur de fatigue comportementale |
| `context` | `activity` / `between_activities` | — | Moment dans la session au moment de la capture |

---

## Séquences typiques d'événements

### Enfant réussit au deuxième essai après un indice
```
activity_start  (attempt implicitement 1)
activity_fail   (attempt=1, duration_ms=45000)
hint_used       (attempt=2, hint_index=1)
activity_success(attempt=2, duration_ms=38000)
```

### Enfant abandonne après deux indices
```
activity_start
hint_used       (attempt=1, hint_index=1)
hint_used       (attempt=1, hint_index=2)
abandon         (attempt=1, trigger="user_navigation")
```

### Pause puis reprise
```
pause           (reason="inactivity_timeout")
resume          (pause_duration_ms=180000)
```

---

## Règles de rétention (à valider avec Yacine — RGPD)

| Niveau | Durée | Contenu |
|--------|-------|---------|
| Brut (table `behavior_events`) | 90 jours | Événements complets |
| Agrégés (table `behavior_features`) | 365 jours | Scores calculés, pas d'événements individuels |
| Après suppression compte | Purge immédiate | Tous les hash liés à l'enfant |

---

## Questions ouvertes (à trancher avec le lead)

- [ ] `completion_pct` sur `abandon` : à implémenter côté front uniquement si la granularité du suivi le permet — laisser `null` sinon, ne pas bloquer sur ce champ.
- [ ] Rotation de la clé HMAC : fréquence et impact sur les hashs existants à valider avec Yacine (RGPD).
- [ ] `session_end` en cas de crash : définir avec le backend une logique de fermeture automatique (ex. session marquée fermée après 30 min sans événement).
