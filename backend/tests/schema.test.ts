import { describe, expect, it } from "vitest"
import { UserRole } from "@prisma/client"
import { prisma, registerAndLogin } from "./setup.js"

describe("Phase 1 — schema constraints", () => {
  it("enforces unique email and role enum", async () => {
    await prisma.user.create({
      data: {
        email: "unique@example.invalid",
        displayName: "A",
        role: UserRole.PARENT,
        passwordHash: "x",
      },
    })

    await expect(
      prisma.user.create({
        data: {
          email: "unique@example.invalid",
          displayName: "B",
          role: UserRole.TEACHER,
          passwordHash: "y",
        },
      }),
    ).rejects.toThrow()

    const child = await prisma.childProfile.create({
      data: {
        displayName: "Kid",
        birthYear: 2018,
        schoolLevel: "CE1",
      },
    })
    expect(child.id).toBeTruthy()
  })

  it("cascades guardianship on child delete", async () => {
    const { user } = await registerAndLogin({
      email: "cascade@example.invalid",
      display_name: "Cascade",
      role: "PARENT",
    })
    const child = await prisma.childProfile.create({
      data: { displayName: "C", birthYear: 2018, schoolLevel: "CE1" },
    })
    await prisma.guardianship.create({
      data: {
        childId: child.id,
        guardianUserId: user.id,
        relationship: "parent",
        isPrimary: true,
      },
    })
    await prisma.childProfile.delete({ where: { id: child.id } })
    const links = await prisma.guardianship.findMany({ where: { childId: child.id } })
    expect(links).toHaveLength(0)
  })
})
