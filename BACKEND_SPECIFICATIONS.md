# Popy Academy — Spécifications backend et données

## 1. Objectifs

Le backend devra assurer :

- l’authentification des adultes et les profils enfants sans adresse e-mail ;
- la liaison entre enfants, responsables légaux, enseignants, AESH et établissements ;
- la synchronisation multi-appareils et application–robot ;
- la conservation des progressions, activités, adaptations et consentements ;
- le fonctionnement hors ligne avec résolution des conflits ;
- la traçabilité des accès aux données sensibles ;
- l’export, la portabilité et la suppression des données ;
- l’application stricte des permissions par rôle.

Le front utilise actuellement IndexedDB et une file locale de synchronisation.

## 2. Rôles

### Enfant

- consulter uniquement son parcours et ses contenus ;
- créer des réponses, favoris, créations et entrées de carnet ;
- ne jamais modifier les permissions ou consentements ;
- ne jamais accéder aux données des autres enfants.

### Parent ou responsable légal

- gérer les enfants explicitement associés à son compte ;
- consulter progression, bien-être déclaré et activités ;
- gérer les préférences, limites, consentements et exports ;
- communiquer avec les professionnels autorisés.

### Enseignant

- accéder uniquement aux classes qui lui sont affectées ;
- affecter activités, séquences et adaptations pédagogiques ;
- consulter les résultats pédagogiques ;
- générer des rapports et communiquer avec les familles.

### AESH

- accéder uniquement aux élèves et périodes d’accompagnement affectés ;
- consulter les adaptations nécessaires ;
- ajouter des observations factuelles et transmissions ;
- ne pas accéder aux réglages familiaux ou données médicales non nécessaires.

### Administrateur établissement

- gérer classes, personnels et affectations ;
- ne pas consulter le carnet privé de l’enfant ;
- gérer les exports institutionnels et journaux de sécurité.

## 3. Entités principales

### users

- `id`
- `email`
- `phone`
- `display_name`
- `role`
- `status`
- `last_login_at`
- `created_at`
- `updated_at`

### child_profiles

- `id`
- `display_name`
- `birth_year`
- `school_level`
- `avatar`
- `locale`
- `current_xp`
- `current_level`
- `created_at`
- `updated_at`

Ne pas enregistrer de diagnostic médical dans cette table.

### guardianships

- `id`
- `child_id`
- `guardian_user_id`
- `relationship`
- `is_primary`
- `valid_from`
- `valid_until`

### schools

- `id`
- `name`
- `academy`
- `country`
- `data_region`

### classes

- `id`
- `school_id`
- `name`
- `level`
- `school_year`

### class_memberships

- `id`
- `class_id`
- `child_id`
- `valid_from`
- `valid_until`

### staff_assignments

- `id`
- `user_id`
- `class_id`
- `child_id`
- `assignment_role`
- `valid_from`
- `valid_until`

### competencies

- `id`
- `cycle`
- `level`
- `subject`
- `domain`
- `official_reference`
- `label`
- `description`
- `prerequisite_ids`

### learning_contents

- `id`
- `content_type`
- `subject`
- `level`
- `title`
- `body`
- `accessibility_metadata`
- `version`
- `validation_status`
- `validated_by`
- `created_at`

### activities

- `id`
- `content_id`
- `child_id`
- `assigned_by`
- `status`
- `started_at`
- `completed_at`
- `score`
- `duration_seconds`
- `offline_origin_id`

### competency_evidence

- `id`
- `child_id`
- `competency_id`
- `activity_id`
- `mastery_level`
- `evidence_type`
- `observed_at`
- `observed_by`

### accessibility_profiles

- `id`
- `child_id`
- `profile_name`
- `settings`
- `source`
- `active`
- `updated_by`
- `updated_at`

Les paramètres doivent décrire des besoins fonctionnels, pas produire un diagnostic.

### accommodations

- `id`
- `child_id`
- `document_type`
- `objective`
- `adaptation`
- `responsible_user_id`
- `frequency`
- `valid_from`
- `review_at`
- `effectiveness_status`
- `created_at`

### observations

- `id`
- `child_id`
- `author_user_id`
- `context`
- `fact_text`
- `strategy_used`
- `result_text`
- `visibility_scope`
- `created_at`

### messages

- `id`
- `thread_id`
- `sender_user_id`
- `message_type`
- `body`
- `attachment_id`
- `created_at`
- `read_at`

### consents

- `id`
- `child_id`
- `guardian_user_id`
- `purpose`
- `status`
- `policy_version`
- `granted_at`
- `revoked_at`
- `evidence`

### robot_devices

- `id`
- `serial_number`
- `school_id`
- `nickname`
- `firmware_version`
- `status`
- `last_seen_at`

### robot_pairings

- `id`
- `robot_id`
- `child_id`
- `class_id`
- `paired_by`
- `valid_from`
- `valid_until`

### robot_events

- `id`
- `robot_id`
- `event_type`
- `severity`
- `payload`
- `occurred_at`

Ne jamais stocker inutilement des images ou enregistrements vocaux bruts.

### sync_operations

- `id`
- `device_id`
- `user_id`
- `entity_type`
- `entity_id`
- `operation`
- `payload`
- `client_timestamp`
- `server_timestamp`
- `status`
- `conflict_reason`

### audit_logs

- `id`
- `actor_user_id`
- `action`
- `resource_type`
- `resource_id`
- `result`
- `ip_hash`
- `created_at`

## 4. Synchronisation hors ligne

1. Chaque modification locale reçoit un UUID et un horodatage.
2. L’opération est enregistrée dans IndexedDB.
3. Le client tente l’envoi lorsque le réseau revient.
4. Le serveur vérifie permissions, version et validité.
5. Le serveur renvoie `synced`, `rejected` ou `conflict`.
6. Les conflits sensibles doivent être présentés à un adulte.
7. Les opérations synchronisées peuvent être supprimées de la file locale.

Les progressions peuvent utiliser une stratégie de fusion. Les consentements,
permissions et suppressions doivent toujours privilégier la décision serveur la
plus restrictive.

## 5. API attendues

- `/auth/*`
- `/profiles/*`
- `/children/*`
- `/classes/*`
- `/assignments/*`
- `/contents/*`
- `/activities/*`
- `/competencies/*`
- `/accommodations/*`
- `/observations/*`
- `/messages/*`
- `/notifications/*`
- `/consents/*`
- `/robots/*`
- `/sync/*`
- `/exports/*`
- `/privacy/*`

Toutes les écritures doivent être idempotentes grâce à un identifiant
d’opération fourni par le client.

## 6. Temps réel

Canaux nécessaires :

- messages ;
- affectations d’activités ;
- état du robot ;
- notifications ;
- changements d’adaptation ;
- synchronisation des progressions.

Le temps réel ne doit jamais être requis pour utiliser une activité déjà
téléchargée.

## 7. Sécurité

- chiffrement TLS en transit ;
- chiffrement au repos ;
- Row Level Security ou autorisation équivalente ;
- sessions courtes pour les adultes ;
- MFA disponible ;
- code PIN local pour les réglages parentaux ;
- rotation des secrets ;
- journaux d’accès ;
- limitation de débit ;
- sauvegardes chiffrées ;
- suppression programmée des données expirées ;
- tests d’intrusion réguliers.

## 8. RGPD

- minimisation des données ;
- finalités documentées ;
- consentement traçable ;
- export lisible et structuré ;
- droit de rectification ;
- droit à l’effacement ;
- durées de conservation configurées ;
- hébergement européen ou souverain ;
- aucune publicité ;
- aucun profilage commercial ;
- AIPD avant utilisation de données biométriques ou émotionnelles.

## 9. IA

- privilégier un traitement local ou souverain ;
- isoler les conversations par enfant ;
- ne pas utiliser les conversations pour entraîner un modèle sans consentement ;
- filtrer les contenus dangereux ;
- journaliser les versions de prompts et modèles ;
- rendre les suggestions pédagogiques explicables ;
- exiger une validation humaine avant publication ;
- interdire les diagnostics automatiques.

## 10. Robot

Le protocole devra gérer :

- appairage mutuellement authentifié ;
- état de batterie et capteurs ;
- commandes de mouvements ;
- LED, voix et volume ;
- affectation de profil temporaire ;
- cache local des activités ;
- mode hors ligne ;
- mise à jour OTA signée ;
- arrêt d’urgence prioritaire ;
- révocation d’un robot compromis.

## 11. Environnements

- développement avec données fictives ;
- démonstration sans données personnelles ;
- préproduction avec tests de sécurité ;
- production avec supervision et sauvegardes ;
- environnement local du robot.

## 12. Migration depuis le front actuel

1. Conserver les interfaces TypeScript existantes.
2. Remplacer l’adaptateur IndexedDB par un adaptateur hybride.
3. Envoyer la file `sync_operations` au backend.
4. Introduire l’authentification.
5. Migrer les profils locaux après consentement.
6. Activer les politiques d’accès par rôle.
7. Tester les conflits et le mode hors ligne.
