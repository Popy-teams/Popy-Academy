import { PrismaClient, UserRole } from "@prisma/client"
import * as argon2 from "argon2"
import { randomBytes } from "node:crypto"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding anonymized demo data…")

  await prisma.auditLog.deleteMany()
  await prisma.syncOperation.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.subscriptionPlan.deleteMany()
  await prisma.robotEvent.deleteMany()
  await prisma.robotPairing.deleteMany()
  await prisma.robotDevice.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.message.deleteMany()
  await prisma.consent.deleteMany()
  await prisma.observation.deleteMany()
  await prisma.accommodation.deleteMany()
  await prisma.accessibilityProfile.deleteMany()
  await prisma.competencyEvidence.deleteMany()
  await prisma.activity.deleteMany()
  await prisma.learningContent.deleteMany()
  await prisma.competency.deleteMany()
  await prisma.staffAssignment.deleteMany()
  await prisma.classMembership.deleteMany()
  await prisma.class.deleteMany()
  await prisma.school.deleteMany()
  await prisma.guardianship.deleteMany()
  await prisma.childProfile.deleteMany()
  await prisma.mfaSecret.deleteMany()
  await prisma.refreshToken.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await argon2.hash("DemoPassw0rd!", { type: argon2.argon2id })

  const planOrdinateur = await prisma.subscriptionPlan.create({
    data: {
      code: "ordinateur",
      name: "Ordinateur",
      description:
        "Accès complet sur PC/tablette. Aucun robot requis — idéal sans matériel.",
      priceCentsMonth: 0,
      maxChildren: 2,
      computerAccess: true,
      robotOptional: true,
      robotIncluded: false,
      features: [
        "Apprentissages complets sur ordinateur",
        "Hors ligne / PWA",
        "Jusqu’à 2 profils enfants",
        "Robot optionnel plus tard",
      ],
      sortOrder: 1,
    },
  })

  const planFamille = await prisma.subscriptionPlan.create({
    data: {
      code: "famille",
      name: "Famille",
      description:
        "Multi-enfants à la maison. Fonctionne sans robot ; robot en complément.",
      priceCentsMonth: 1299,
      maxChildren: 5,
      computerAccess: true,
      robotOptional: true,
      robotIncluded: false,
      features: [
        "Tout le plan Ordinateur",
        "Jusqu’à 5 enfants",
        "Exports & consentements",
        "Robot familial optionnel",
      ],
      sortOrder: 2,
    },
  })

  await prisma.subscriptionPlan.create({
    data: {
      code: "ecole",
      name: "École",
      description:
        "Licence établissement. Classes sur ordinateurs ; robots de classe optionnels.",
      priceCentsMonth: 9900,
      maxChildren: 200,
      computerAccess: true,
      robotOptional: true,
      robotIncluded: false,
      features: [
        "Classes & personnels",
        "Parc informatique prioritaire",
        "Robots de classe optionnels",
        "Exports institutionnels",
      ],
      sortOrder: 3,
    },
  })

  const parent = await prisma.user.create({
    data: {
      email: "parent.demo@example.invalid",
      passwordHash,
      displayName: "Parent Démo",
      role: UserRole.PARENT,
    },
  })

  const periodEnd = new Date()
  periodEnd.setMonth(periodEnd.getMonth() + 1)
  await prisma.subscription.create({
    data: {
      userId: parent.id,
      planId: planOrdinateur.id,
      status: "ACTIVE",
      accessMode: "COMPUTER",
      robotEnabled: false,
      currentPeriodEnd: periodEnd,
    },
  })
  void planFamille

  const teacher = await prisma.user.create({
    data: {
      email: "enseignant.demo@example.invalid",
      passwordHash,
      displayName: "Enseignant Démo",
      role: UserRole.TEACHER,
    },
  })

  const aesh = await prisma.user.create({
    data: {
      email: "aesh.demo@example.invalid",
      passwordHash,
      displayName: "AESH Démo",
      role: UserRole.AESH,
    },
  })

  const admin = await prisma.user.create({
    data: {
      email: "admin.demo@example.invalid",
      passwordHash,
      displayName: "Admin Démo",
      role: UserRole.ADMIN,
    },
  })

  const childA = await prisma.childProfile.create({
    data: {
      displayName: "Enfant A",
      birthYear: 2017,
      schoolLevel: "CE2",
      locale: "fr",
      currentXp: 120,
      currentLevel: 3,
    },
  })

  const childB = await prisma.childProfile.create({
    data: {
      displayName: "Enfant B",
      birthYear: 2019,
      schoolLevel: "CP",
      locale: "fr",
      currentXp: 40,
      currentLevel: 1,
    },
  })

  await prisma.guardianship.createMany({
    data: [
      {
        childId: childA.id,
        guardianUserId: parent.id,
        relationship: "parent",
        isPrimary: true,
      },
      {
        childId: childB.id,
        guardianUserId: parent.id,
        relationship: "parent",
        isPrimary: true,
      },
    ],
  })

  const school = await prisma.school.create({
    data: {
      name: "École Démo Anonyme",
      academy: "Demo",
      country: "FR",
      dataRegion: "eu-west",
    },
  })

  const klass = await prisma.class.create({
    data: {
      schoolId: school.id,
      name: "CE2-Demo",
      level: "CE2",
      schoolYear: "2025-2026",
    },
  })

  await prisma.classMembership.create({
    data: { classId: klass.id, childId: childA.id },
  })

  await prisma.staffAssignment.createMany({
    data: [
      {
        userId: teacher.id,
        classId: klass.id,
        assignmentRole: UserRole.TEACHER,
      },
      {
        userId: aesh.id,
        childId: childA.id,
        assignmentRole: UserRole.AESH,
      },
    ],
  })

  const competency = await prisma.competency.create({
    data: {
      cycle: "2",
      level: "CE2",
      subject: "maths",
      domain: "nombres",
      officialReference: "DEMO-MATH-01",
      label: "Additionner jusqu’à 100",
      description: "Compétence de démonstration anonymisée",
    },
  })

  const content = await prisma.learningContent.create({
    data: {
      contentType: "exercise",
      subject: "maths",
      level: "CE2",
      title: "Additions démo",
      body: "Contenu pédagogique fictif sans donnée personnelle.",
      validationStatus: "VALIDATED",
      validatedById: teacher.id,
    },
  })

  await prisma.activity.create({
    data: {
      contentId: content.id,
      childId: childA.id,
      assignedById: teacher.id,
      status: "ASSIGNED",
    },
  })

  await prisma.accessibilityProfile.create({
    data: {
      childId: childA.id,
      profileName: "lecture-facilitée",
      settings: { fontScale: 1.2, highContrast: false, reducedMotion: true },
      source: "parent",
      updatedById: parent.id,
    },
  })

  await prisma.consent.create({
    data: {
      childId: childA.id,
      guardianUserId: parent.id,
      purpose: "learning_analytics",
      status: "GRANTED",
      policyVersion: "2026.1",
      grantedAt: new Date(),
      evidence: "seed-demo",
    },
  })

  await prisma.robotDevice.create({
    data: {
      serialNumber: "POPY-ROBOT-DEMO-001",
      schoolId: school.id,
      nickname: "Robot Démo",
      firmwareVersion: "1.0.0-demo",
      status: "OFFLINE",
      pairingSecret: randomBytes(24).toString("hex"),
    },
  })

  await prisma.notification.create({
    data: {
      userId: parent.id,
      title: "Bienvenue",
      body: "Compte démo prêt — aucune donnée personnelle réelle.",
      channel: "in_app",
    },
  })

  console.log("Seed OK", {
    parent: parent.email,
    teacher: teacher.email,
    aesh: aesh.email,
    admin: admin.email,
    children: [childA.displayName, childB.displayName],
    competency: competency.label,
    password: "DemoPassw0rd!",
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
