-- Seed initial des chunks officiels POPY Academy
-- Source : Éduscol / BO (Licence Ouverte Etalab)
BEGIN;

INSERT INTO "official_chunks" (
    "id", "cycle", "levels", "subject", "domain", "topic",
    "competency_ids", "text", "source_type", "source_ref", "source_url",
    "version", "license", "is_active", "created_at", "updated_at"
) VALUES (
    'chunk_cm1_maths_fractions_01',
    '3',
    ARRAY['CM1', 'CM2']::TEXT[],
    'Mathématiques',
    'Nombres et calculs',
    'Fractions - Sens et partage',
    ARRAY['comp_c3_maths_frac_sens']::TEXT[],
    'Comprendre et utiliser la notion de fractions simples. Une fraction est utilisée pour rendre compte de partages de grandeurs (longueurs, aires, volumes) ou de collections d''objets en parts égales. Les élèves manipulent des fractions simples : la moitié (un demi, 1/2), le tiers (1/3), le quart (1/4), le dixième (1/10) et le centième (1/100). Le partage doit être constitué de parts rigoureusement égales.',
    'BO',
    'BO n° 16 du 17 avril 2025 (Programme révisé - NOUVEAU)',
    'https://eduscol.education.gouv.fr/4356/enseigner-au-cycle-3',
    '2025-04',
    'Licence Ouverte v2.0 (Etalab) / Citation pédagogique',
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

INSERT INTO "official_chunks" (
    "id", "cycle", "levels", "subject", "domain", "topic",
    "competency_ids", "text", "source_type", "source_ref", "source_url",
    "version", "license", "is_active", "created_at", "updated_at"
) VALUES (
    'chunk_cm1_maths_fractions_02',
    '3',
    ARRAY['CM1', 'CM2']::TEXT[],
    'Mathématiques',
    'Nombres et calculs',
    'Fractions - Vocabulaire numérateur et dénominateur',
    ARRAY['comp_c3_maths_frac_voc']::TEXT[],
    'Connaître et expliciter le vocabulaire associé aux fractions : Dans l''écriture a/b, le dénominateur b (nombre situé en bas) indique en combien de parts égales l''unité de référence a été découpée ou partagée. Le numérateur a (nombre situé en haut) indique le nombre de parts que l''on prend ou que l''on considère. Exemple : dans 3/4, l''unité est partagée en 4 parts égales et on en prend 3.',
    'BO',
    'BO n° 16 du 17 avril 2025 (Programme révisé - NOUVEAU)',
    'https://eduscol.education.gouv.fr/4356/enseigner-au-cycle-3',
    '2025-04',
    'Licence Ouverte v2.0 (Etalab) / Citation pédagogique',
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

INSERT INTO "official_chunks" (
    "id", "cycle", "levels", "subject", "domain", "topic",
    "competency_ids", "text", "source_type", "source_ref", "source_url",
    "version", "license", "is_active", "created_at", "updated_at"
) VALUES (
    'chunk_cm1_maths_fractions_03',
    '3',
    ARRAY['CM1', 'CM2']::TEXT[],
    'Mathématiques',
    'Nombres et calculs',
    'Fractions - Équivalence à l''unité',
    ARRAY['comp_c3_maths_frac_unite']::TEXT[],
    'Établir l''égalité entre une fraction et l''unité : Lorsque le numérateur est égal au dénominateur, la fraction est égale au nombre entier 1. Ainsi : 2/2 = 1, 3/3 = 1, 4/4 = 1, 10/10 = 1, 100/100 = 1. Toutes les parts de l''unité ont été reconstituées.',
    'BO',
    'BO n° 16 du 17 avril 2025 (Programme révisé - NOUVEAU)',
    'https://eduscol.education.gouv.fr/4356/enseigner-au-cycle-3',
    '2025-04',
    'Licence Ouverte v2.0 (Etalab) / Citation pédagogique',
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

INSERT INTO "official_chunks" (
    "id", "cycle", "levels", "subject", "domain", "topic",
    "competency_ids", "text", "source_type", "source_ref", "source_url",
    "version", "license", "is_active", "created_at", "updated_at"
) VALUES (
    'chunk_cm1_maths_fractions_04',
    '3',
    ARRAY['CM1', 'CM2']::TEXT[],
    'Mathématiques',
    'Nombres et calculs',
    'Fractions - Fractions supérieures à 1 et décomposition',
    ARRAY['comp_c3_maths_frac_decomp']::TEXT[],
    'Identifier les fractions supérieures à 1 et savoir les décomposer : Une fraction est supérieure à 1 lorsque son numérateur est plus grand que son dénominateur. Les élèves apprennent à décomposer une fraction comme la somme d''un nombre entier et d''une fraction inférieure à 1. Exemple : 7/4 = 4/4 + 3/4 = 1 + 3/4. Cette décomposition s''appuie sur la visualisation géométrique ou les partages concrets.',
    'BO',
    'BO n° 16 du 17 avril 2025 (Programme révisé - NOUVEAU)',
    'https://eduscol.education.gouv.fr/4356/enseigner-au-cycle-3',
    '2025-04',
    'Licence Ouverte v2.0 (Etalab) / Citation pédagogique',
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

INSERT INTO "official_chunks" (
    "id", "cycle", "levels", "subject", "domain", "topic",
    "competency_ids", "text", "source_type", "source_ref", "source_url",
    "version", "license", "is_active", "created_at", "updated_at"
) VALUES (
    'chunk_cm1_maths_fractions_05',
    '3',
    ARRAY['CM1', 'CM2']::TEXT[],
    'Mathématiques',
    'Nombres et calculs',
    'Fractions - Demi-droite graduée',
    ARRAY['comp_c3_maths_frac_graduee']::TEXT[],
    'Repérer et placer des fractions simples sur une demi-droite graduée : L''abscisse d''un point est un nombre qui repère sa position sur une droite graduée à partir de l''origine 0. Pour placer une fraction a/b, le segment unité (de 0 à 1) est divisé en b parts égales. On compte ensuite a sous-graduations à partir de 0. Exemple : pour placer 1/2, on repère le milieu exact entre 0 et 1.',
    'BO',
    'BO n° 16 du 17 avril 2025 (Programme révisé - NOUVEAU)',
    'https://eduscol.education.gouv.fr/4356/enseigner-au-cycle-3',
    '2025-04',
    'Licence Ouverte v2.0 (Etalab) / Citation pédagogique',
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

INSERT INTO "official_chunks" (
    "id", "cycle", "levels", "subject", "domain", "topic",
    "competency_ids", "text", "source_type", "source_ref", "source_url",
    "version", "license", "is_active", "created_at", "updated_at"
) VALUES (
    'chunk_cm1_maths_fractions_06',
    '3',
    ARRAY['CM1', 'CM2']::TEXT[],
    'Mathématiques',
    'Nombres et calculs',
    'Fractions - Encadrement par deux entiers consécutifs',
    ARRAY['comp_c3_maths_frac_encadre']::TEXT[],
    'Encadrer une fraction simple par deux nombres entiers consécutifs : À partir de la demi-droite graduée ou de la décomposition sous forme entier + fraction, l''élève situe une fraction entre deux entiers qui se suivent. Exemple : comme 7/4 = 1 + 3/4 et que 3/4 < 1, alors 1 < 7/4 < 2.',
    'BO',
    'BO n° 16 du 17 avril 2025 (Programme révisé - NOUVEAU)',
    'https://eduscol.education.gouv.fr/4356/enseigner-au-cycle-3',
    '2025-04',
    'Licence Ouverte v2.0 (Etalab) / Citation pédagogique',
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

INSERT INTO "official_chunks" (
    "id", "cycle", "levels", "subject", "domain", "topic",
    "competency_ids", "text", "source_type", "source_ref", "source_url",
    "version", "license", "is_active", "created_at", "updated_at"
) VALUES (
    'chunk_cm1_maths_fractions_07',
    '3',
    ARRAY['CM1', 'CM2']::TEXT[],
    'Mathématiques',
    'Nombres et calculs',
    'Fractions - Comparaison à dénominateur égal',
    ARRAY['comp_c3_maths_frac_comp']::TEXT[],
    'Comparer des fractions de même dénominateur : Lorsque deux fractions ont le même dénominateur (les parts sont de même taille), la fraction la plus grande est celle qui a le plus grand numérateur. Exemple : 4/5 > 3/5 car 4 parts d''un cinquième sont plus grandes que 3 parts d''un cinquième.',
    'BO',
    'BO n° 16 du 17 avril 2025 (Programme révisé - NOUVEAU)',
    'https://eduscol.education.gouv.fr/4356/enseigner-au-cycle-3',
    '2025-04',
    'Licence Ouverte v2.0 (Etalab) / Citation pédagogique',
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

INSERT INTO "official_chunks" (
    "id", "cycle", "levels", "subject", "domain", "topic",
    "competency_ids", "text", "source_type", "source_ref", "source_url",
    "version", "license", "is_active", "created_at", "updated_at"
) VALUES (
    'chunk_cm1_maths_fractions_08',
    '3',
    ARRAY['CM1', 'CM2']::TEXT[],
    'Mathématiques',
    'Nombres et calculs',
    'Fractions - Écritures équivalentes simples',
    ARRAY['comp_c3_maths_frac_equiv']::TEXT[],
    'Établir des égalités simples entre fractions : À l''aide de représentations imagées (disques, bandes rectangulaires), l''élève découvre que différentes fractions représentent la même quantité. Exemples fondamentaux au CM1 : 1/2 = 2/4 = 5/10 ; 1/4 = 2/8 = 25/100 ; 2/4 = 1/2.',
    'BO',
    'BO n° 16 du 17 avril 2025 (Programme révisé - NOUVEAU)',
    'https://eduscol.education.gouv.fr/4356/enseigner-au-cycle-3',
    '2025-04',
    'Licence Ouverte v2.0 (Etalab) / Citation pédagogique',
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

INSERT INTO "official_chunks" (
    "id", "cycle", "levels", "subject", "domain", "topic",
    "competency_ids", "text", "source_type", "source_ref", "source_url",
    "version", "license", "is_active", "created_at", "updated_at"
) VALUES (
    'chunk_cm1_maths_fractions_09',
    '3',
    ARRAY['CM1', 'CM2']::TEXT[],
    'Mathématiques',
    'Nombres et calculs',
    'Fractions - Addition de fractions de même dénominateur',
    ARRAY['comp_c3_maths_frac_add']::TEXT[],
    'Calculer la somme de deux fractions de même dénominateur : Pour additionner deux fractions qui ont le même dénominateur, on additionne les numérateurs et on garde le dénominateur commun. Exemple : 1/4 + 2/4 = (1+2)/4 = 3/4. Attention : on n''additionne JAMAIS les dénominateurs (1/4 + 2/4 n''est pas égal à 3/8).',
    'BO',
    'BO n° 16 du 17 avril 2025 (Programme révisé - NOUVEAU)',
    'https://eduscol.education.gouv.fr/4356/enseigner-au-cycle-3',
    '2025-04',
    'Licence Ouverte v2.0 (Etalab) / Citation pédagogique',
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

INSERT INTO "official_chunks" (
    "id", "cycle", "levels", "subject", "domain", "topic",
    "competency_ids", "text", "source_type", "source_ref", "source_url",
    "version", "license", "is_active", "created_at", "updated_at"
) VALUES (
    'chunk_cm1_maths_fractions_10',
    '3',
    ARRAY['CM1', 'CM2']::TEXT[],
    'Mathématiques',
    'Nombres et calculs',
    'Fractions décimales',
    ARRAY['comp_c3_maths_frac_decimale']::TEXT[],
    'Comprendre et utiliser les fractions décimales : Une fraction décimale est une fraction dont le dénominateur est 10, 100, 1000... L''élève comprend que 1 unité = 10 dixièmes (10/10) = 100 centièmes (100/100). 1 dixième = 10 centièmes (1/10 = 10/100). Ces équivalences constituent le socle de l''apprentissage des nombres décimaux.',
    'BO',
    'BO n° 16 du 17 avril 2025 (Programme révisé - NOUVEAU)',
    'https://eduscol.education.gouv.fr/4356/enseigner-au-cycle-3',
    '2025-04',
    'Licence Ouverte v2.0 (Etalab) / Citation pédagogique',
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

INSERT INTO "official_chunks" (
    "id", "cycle", "levels", "subject", "domain", "topic",
    "competency_ids", "text", "source_type", "source_ref", "source_url",
    "version", "license", "is_active", "created_at", "updated_at"
) VALUES (
    'chunk_cm1_maths_fractions_11',
    '3',
    ARRAY['CM1', 'CM2']::TEXT[],
    'Mathématiques',
    'Nombres et calculs',
    'Nombres décimaux - Lien fraction décimale et écriture à virgule',
    ARRAY['comp_c3_maths_decimaux_virgule']::TEXT[],
    'Faire le lien entre fraction décimale et écriture décimale à virgule : Les nombres décimaux sont introduits à partir des fractions décimales. 1/10 s''écrit 0,1 (zéro unité et un dixième). 1/100 s''écrit 0,01 (zéro unité et un centième). Exemple de conversion : 14/10 = 10/10 + 4/10 = 1 + 4/10 = 1,4. La virgule sépare la partie entière de la partie décimale.',
    'BO',
    'BO n° 16 du 17 avril 2025 (Programme révisé - NOUVEAU)',
    'https://eduscol.education.gouv.fr/4356/enseigner-au-cycle-3',
    '2025-04',
    'Licence Ouverte v2.0 (Etalab) / Citation pédagogique',
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

INSERT INTO "official_chunks" (
    "id", "cycle", "levels", "subject", "domain", "topic",
    "competency_ids", "text", "source_type", "source_ref", "source_url",
    "version", "license", "is_active", "created_at", "updated_at"
) VALUES (
    'chunk_cm1_maths_fractions_12',
    '3',
    ARRAY['CM1', 'CM2']::TEXT[],
    'Mathématiques',
    'Nombres et calculs',
    'Résolution de problèmes avec fractions simples',
    ARRAY['comp_c3_maths_frac_pb']::TEXT[],
    'Résoudre des problèmes du quotidien impliquant des fractions simples de grandeurs ou de collections : Calculer une fraction d''une quantité : pour trouver le quart de 20 bonbons, on divise 20 par 4 = 5 bonbons. Pour trouver les trois quarts de 20 bonbons, on prend 3 fois le quart (3 x 5 = 15 bonbons). Les situations s''appuient sur des unités de mesure concrètes (longueurs en mètres, masses en grammes, durées en minutes, contenances en litres).',
    'BO',
    'BO n° 16 du 17 avril 2025 (Programme révisé - NOUVEAU)',
    'https://eduscol.education.gouv.fr/4356/enseigner-au-cycle-3',
    '2025-04',
    'Licence Ouverte v2.0 (Etalab) / Citation pédagogique',
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

INSERT INTO "official_chunks" (
    "id", "cycle", "levels", "subject", "domain", "topic",
    "competency_ids", "text", "source_type", "source_ref", "source_url",
    "version", "license", "is_active", "created_at", "updated_at"
) VALUES (
    'chunk_ce2_fr_grammaire_01',
    '2',
    ARRAY['CE2']::TEXT[],
    'Français',
    'Étude de la langue',
    'Identification du verbe conjugué',
    ARRAY['comp_c2_fr_verbe_ident']::TEXT[],
    'Identifier le verbe conjugué dans une phrase simple : Le verbe est le mot qui change de forme lorsque le temps change (passé, présent, futur) ou lorsque la personne qui fait l''action change (je, tu, nous...). Méthodes pour le repérer : 1. Encadrer le verbe par la négation ''ne ... pas'' (ex: ''Léo mange une pomme'' -> ''Léo NE mange PAS de pomme''). 2. Commencer la phrase par ''Hier'', ''Aujourd''hui'' ou ''Demain'' pour observer quel mot se transforme. L''élève sait également donner l''infinitif du verbe.',
    'BO',
    'BO n°31 du 30 juillet 2020 (NOR : MENE2018712A)',
    'https://eduscol.education.gouv.fr/4355/enseigner-au-cycle-2',
    '2020-07',
    'Licence Ouverte v2.0 (Etalab) / Citation pédagogique',
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

INSERT INTO "official_chunks" (
    "id", "cycle", "levels", "subject", "domain", "topic",
    "competency_ids", "text", "source_type", "source_ref", "source_url",
    "version", "license", "is_active", "created_at", "updated_at"
) VALUES (
    'chunk_ce2_fr_grammaire_02',
    '2',
    ARRAY['CE2']::TEXT[],
    'Français',
    'Étude de la langue',
    'Identification du sujet du verbe',
    ARRAY['comp_c2_fr_sujet_ident']::TEXT[],
    'Identifier le sujet du verbe dans la phrase : Le sujet indique qui fait l''action exprimée par le verbe ou de qui on parle. Pour trouver le sujet, l''élève pose la question : ''Qui est-ce qui + verbe ?'' ou ''Qu''est-ce qui + verbe ?''. On peut également encadrer le sujet par la formule ''C''est ... qui ...'' ou ''Ce sont ... qui ...''. Le sujet peut être un nom propre, un pronom personnel (il, elle, ils, elles...) ou un groupe nominal.',
    'BO',
    'BO n°31 du 30 juillet 2020 (NOR : MENE2018712A)',
    'https://eduscol.education.gouv.fr/4355/enseigner-au-cycle-2',
    '2020-07',
    'Licence Ouverte v2.0 (Etalab) / Citation pédagogique',
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

INSERT INTO "official_chunks" (
    "id", "cycle", "levels", "subject", "domain", "topic",
    "competency_ids", "text", "source_type", "source_ref", "source_url",
    "version", "license", "is_active", "created_at", "updated_at"
) VALUES (
    'chunk_ce2_fr_grammaire_03',
    '2',
    ARRAY['CE2']::TEXT[],
    'Français',
    'Étude de la langue',
    'Accord sujet-verbe au présent',
    ARRAY['comp_c2_fr_accord_sv']::TEXT[],
    'Maîtriser l''accord du verbe avec son sujet au présent de l''indicatif : Le verbe s''accorde obligatoirement en personne et en nombre avec son sujet. Pour les verbes du premier groupe (-er), les terminaisons du présent sont : -e, -es, -e, -ons, -ez, -ent. Attention au pluriel : à la 3e personne du pluriel (ils / elles ou un groupe nominal pluriel), la terminaison du verbe est toujours ''-ent'' qui ne s''entend pas à l''oral.',
    'BO',
    'BO n°31 du 30 juillet 2020 (NOR : MENE2018712A)',
    'https://eduscol.education.gouv.fr/4355/enseigner-au-cycle-2',
    '2020-07',
    'Licence Ouverte v2.0 (Etalab) / Citation pédagogique',
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

INSERT INTO "official_chunks" (
    "id", "cycle", "levels", "subject", "domain", "topic",
    "competency_ids", "text", "source_type", "source_ref", "source_url",
    "version", "license", "is_active", "created_at", "updated_at"
) VALUES (
    'chunk_ce2_fr_grammaire_04',
    '2',
    ARRAY['CE2']::TEXT[],
    'Français',
    'Étude de la langue',
    'Le nom et le groupe nominal',
    ARRAY['comp_c2_fr_nom_gn']::TEXT[],
    'Distinguer le nom commun et le nom propre et identifier le déterminant : Le nom commun désigne une personne, un animal, un objet ou une idée (garçon, chat, table, courage). Il est presque toujours précédé d''un déterminant (le, la, un, une, des, mon, ce...). Le nom propre désigne une personne, un pays ou une ville unique et commence toujours par une majuscule (Paris, Marie, France).',
    'BO',
    'BO n°31 du 30 juillet 2020 (NOR : MENE2018712A)',
    'https://eduscol.education.gouv.fr/4355/enseigner-au-cycle-2',
    '2020-07',
    'Licence Ouverte v2.0 (Etalab) / Citation pédagogique',
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

INSERT INTO "official_chunks" (
    "id", "cycle", "levels", "subject", "domain", "topic",
    "competency_ids", "text", "source_type", "source_ref", "source_url",
    "version", "license", "is_active", "created_at", "updated_at"
) VALUES (
    'chunk_ce2_fr_grammaire_05',
    '2',
    ARRAY['CE2']::TEXT[],
    'Français',
    'Étude de la langue',
    'L''adjectif qualificatif et les accords dans le groupe nominal',
    ARRAY['comp_c2_fr_accord_gn']::TEXT[],
    'Identifier l''adjectif qualificatif et accorder le groupe nominal : L''adjectif qualificatif apporte une précision sur le nom qu''il accompagne (ex: un *grand* arbre *vert*). Dans le groupe nominal, le déterminant et l''adjectif s''accordent en genre (masculin / féminin) et en nombre (singulier / pluriel) avec le nom noyau. Règle générale du pluriel : on ajoute un ''-s'' au nom et à l''adjectif.',
    'BO',
    'BO n°31 du 30 juillet 2020 (NOR : MENE2018712A)',
    'https://eduscol.education.gouv.fr/4355/enseigner-au-cycle-2',
    '2020-07',
    'Licence Ouverte v2.0 (Etalab) / Citation pédagogique',
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

INSERT INTO "official_chunks" (
    "id", "cycle", "levels", "subject", "domain", "topic",
    "competency_ids", "text", "source_type", "source_ref", "source_url",
    "version", "license", "is_active", "created_at", "updated_at"
) VALUES (
    'chunk_ce2_maths_nombres_01',
    '2',
    ARRAY['CE2']::TEXT[],
    'Mathématiques',
    'Nombres et calculs',
    'Numération décimale jusqu''à 10 000',
    ARRAY['comp_c2_maths_num_10000']::TEXT[],
    'Comprendre et utiliser des nombres entiers pour dénombrer, ordonner et comparer jusqu''à 10 000 : Principe de la numération de position : la valeur d''un chiffre dépend de sa place dans le nombre (unités simples, dizaines, centaines, milliers). 1 millier = 10 centaines = 100 dizaines = 1000 unités. Les élèves apprennent à décomposer un nombre : 4 528 = (4 x 1000) + (5 x 100) + (2 x 10) + 8.',
    'BO',
    'BO n°31 du 30 juillet 2020 (NOR : MENE2018712A)',
    'https://eduscol.education.gouv.fr/4355/enseigner-au-cycle-2',
    '2020-07',
    'Licence Ouverte v2.0 (Etalab) / Citation pédagogique',
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

INSERT INTO "official_chunks" (
    "id", "cycle", "levels", "subject", "domain", "topic",
    "competency_ids", "text", "source_type", "source_ref", "source_url",
    "version", "license", "is_active", "created_at", "updated_at"
) VALUES (
    'chunk_ce2_maths_calcul_02',
    '2',
    ARRAY['CE2']::TEXT[],
    'Mathématiques',
    'Nombres et calculs',
    'Technique posée de l''addition avec retenue',
    ARRAY['comp_c2_maths_addition_pos']::TEXT[],
    'Mémoriser et appliquer la technique opératoire de l''addition posée en colonnes : Les nombres sont alignés colonne par colonne (unités sous unités, dizaines sous dizaines, centaines sous centaines). On commence le calcul par la colonne des unités à droite. Sens de la retenue : dès que la somme d''une colonne atteint ou dépasse 10, on forme un paquet de 10 qui bascule sous forme de retenue (+1) dans la colonne immédiatement à gauche.',
    'BO',
    'BO n°31 du 30 juillet 2020 (NOR : MENE2018712A)',
    'https://eduscol.education.gouv.fr/4355/enseigner-au-cycle-2',
    '2020-07',
    'Licence Ouverte v2.0 (Etalab) / Citation pédagogique',
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

INSERT INTO "official_chunks" (
    "id", "cycle", "levels", "subject", "domain", "topic",
    "competency_ids", "text", "source_type", "source_ref", "source_url",
    "version", "license", "is_active", "created_at", "updated_at"
) VALUES (
    'chunk_ce2_maths_nombres_03',
    '2',
    ARRAY['CE2']::TEXT[],
    'Mathématiques',
    'Nombres et calculs',
    'Nombres pairs et impairs',
    ARRAY['comp_c2_maths_pairs_impairs']::TEXT[],
    'Identifier les nombres pairs et impairs : Un nombre pair peut être partagé exactement en deux parties entières égales sans reste. Tout nombre dont le chiffre des unités est 0, 2, 4, 6 ou 8 est un nombre pair. Un nombre impair se termine par 1, 3, 5, 7 ou 9 ; lorsqu''on le partage en deux parts égales, il reste toujours 1.',
    'BO',
    'BO n°31 du 30 juillet 2020 (NOR : MENE2018712A)',
    'https://eduscol.education.gouv.fr/4355/enseigner-au-cycle-2',
    '2020-07',
    'Licence Ouverte v2.0 (Etalab) / Citation pédagogique',
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

COMMIT;
