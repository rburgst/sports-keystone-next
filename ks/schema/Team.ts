import { list } from '@keystone-next/keystone'
import { relationship, select, text } from '@keystone-next/keystone/fields'
import { PrismaClient } from '@prisma/client'

export const Team = list({
  ui: {
    labelField: 'teamName',
  },
  fields: {
    teamName: text({
      db: { isNullable: false },
      validation: { isRequired: true },
    }),
    teamType: select({
      db: { isNullable: false },
      validation: { isRequired: true },
      options: [
        { label: 'MALE', value: 'MALE' },
        { label: 'FEMALE', value: 'FEMALE' },
        { label: 'MIXED', value: 'MIXED' },
      ],
      ui: {
        displayMode: 'segmented-control',
      },
    }),
    club: relationship({
      ref: 'Club.teams',
      ui: {
        displayMode: 'select',
      },
    }),
    athletes: relationship({
      ref: 'Athlete.team',
      many: true,
      ui: {
        displayMode: 'cards',
        cardFields: ['lastName', 'firstName', 'birthYear'],
        //        inlineEdit: { fields: ['lastName', 'firstName', 'birthYear'] },
        linkToItem: true,
        inlineConnect: true,
        //        inlineCreate: { fields: ['lastName', 'firstName', 'birthYear'] },
      },
    }),
  },
  hooks: {
    validateInput: async ({
      resolvedData,
      context,
      addValidationError,
      item,
    }) => {
      const teamType = resolvedData.teamType ?? item?.teamType
      const teamId = resolvedData.id ?? item?.id
      if (teamType && teamId) {
        const prisma: PrismaClient = context.prisma
        const members = await prisma.athlete.groupBy({
          where: { team: { id: { equals: teamId } } },
          by: ['gender'],
        })
        console.log('got team member genders', members)
        const memberWithWrongGender = members.find(
          member => !teamTypeMatchesGender(teamType, member.gender ?? '')
        )
        if (memberWithWrongGender) {
          addValidationError(
            `There are athletes in the team with a non-matching gender ${memberWithWrongGender.gender} for teamType ${teamType}`
          )
        }
      }
    },
  },
})

export function teamTypeMatchesGender(teamType: string, gender: string) {
  if (teamType === gender) {
    return true
  }
  return teamType === 'MIXED'
}
