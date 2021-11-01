import { KeystoneContext } from '@keystone-next/keystone/types'
import { permissionsList } from '../schema/fields'
import { PrismaClient } from '@prisma/client'

export async function insertSeedData({ prisma, query }: KeystoneContext) {
  const client = prisma as PrismaClient
  console.log(`🌱 Checking Seed Data: Role`)
  // first check whether we need to do anything
  const roleCount = await prisma.role.count()
  if (roleCount === 0) {
    console.log(`🌱 Inserting Seed Data: Role`)
    const roleData: Record<string, unknown> = { name: 'super admin' }
    permissionsList.forEach(perm => (roleData[perm] = true))
    console.log(`  🛍️ Adding role: ${roleData.name}`)

    const { id } = await prisma.role.create({
      data: roleData,
    })
    console.log(`✅ Seed Data Inserted: Role`)
    const userCount = await prisma.user.count()
    if (userCount === 1) {
      const adminUsers = await prisma.user.findMany()
      if (adminUsers.length !== 1) {
        throw new Error(
          `have unexpected admin users length ${adminUsers.length}`
        )
      }
      const adminUser = adminUsers[0]

      if (!adminUser.roleId) {
        console.log(`🌱 Attaching admin role to user`, adminUser)
        const updatedUser = await client.user.update({
          where: { id: adminUser.id },
          data: { roleId: id },
        })
        console.log(`🌱 Attaching admin role to user ... done`, updatedUser)
      }
    }

    // now add other roles
    const { id: clubAdminRoleId } = await client.role.create({
      data: {
        name: 'club admin',
        canReadOwnClubAthletes: true,
        canWriteOwnClubAthletes: true,
      },
    })

    // now add clubs
    const club1 = await client.club.create({
      data: { clubName: 'test club 1' },
    })
    // now add team
    const team1Male = await client.team.create({
      data: { teamName: 'club1 team male', teamType: 'MALE', clubId: club1.id },
    })
    const team1Female = await client.team.create({
      data: {
        teamName: 'club1 team female',
        teamType: 'FEMALE',
        clubId: club1.id,
      },
    })
    const team1Mixed = await client.team.create({
      data: {
        teamName: 'club1 team mixed',
        teamType: 'MIXED',
        clubId: club1.id,
      },
    })
  }

  console.log(
    `👋 Please start the process with \`yarn dev\` or \`npm run dev\``
  )
  process.exit()
}
