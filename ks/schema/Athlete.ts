import { list } from '@keystone-next/keystone'
import {
  checkbox,
  integer,
  select,
  text,
  timestamp,
  relationship,
} from '@keystone-next/keystone/fields'
import { teamTypeMatchesGender } from './Team'

export const Athlete = list({
  access: {},
  ui: {
    labelField: 'lastName',
    listView: {
      initialColumns: ['lastName', 'firstName', 'birthYear', 'team', 'club'],
    },
  },
  fields: {
    firstName: text({
      db: { isNullable: false },
      validation: { isRequired: true },
    }),
    lastName: text({
      db: { isNullable: false },
      validation: { isRequired: true },
    }),
    birthYear: integer({
      isOrderable: true,
      validation: { isRequired: true, min: 1900, max: 2050 },
    }),
    gender: select({
      options: [
        { label: 'MALE', value: 'MALE' },
        { label: 'FEMALE', value: 'FEMALE' },
      ],
      ui: {
        displayMode: 'segmented-control',
      },
      hooks: {
        validateInput: async args => {
          const { resolvedData, item, context } = args
          const newGender = resolvedData.gender ?? item?.gender
          const teamId = resolvedData.team?.connect?.id ?? item?.teamId

          console.log('new gender', newGender, 'team', teamId)
          if (newGender && teamId) {
            const team = await context.db.Team.findOne({
              where: { id: teamId },
            })
            console.log('got team', team)
            if (!teamTypeMatchesGender(team.teamType, newGender)) {
              args.addValidationError(
                `The gender for athlete (${newGender}) does not match to the teamType ${team.teamType} of team ${team.teamName}`
              )
            }
          }
        },
      },
    }),
    disabled: checkbox({ defaultValue: false }),
    club: relationship({
      ref: 'Club.athletes',
      ui: {
        displayMode: 'select',
      },
    }),
    team: relationship({
      ref: 'Team.athletes',
      ui: {
        displayMode: 'cards',
        cardFields: ['teamName', 'club'],
        inlineConnect: true,
      },
    }),
    version: integer({ db: { isNullable: false }, defaultValue: 0 }),
    createdBy: text({
      ui: {
        itemView: { fieldMode: 'hidden' },
        createView: { fieldMode: 'hidden' },
      },
    }),
    lastModifiedBy: text({
      ui: {
        itemView: { fieldMode: 'hidden' },
        createView: { fieldMode: 'hidden' },
      },
    }),
    createdDate: timestamp({
      defaultValue: { kind: 'now' },
      ui: {
        itemView: { fieldMode: 'hidden' },
        createView: { fieldMode: 'hidden' },
      },
    }),
    lastModifiedDate: timestamp({
      defaultValue: { kind: 'now' },
      db: { updatedAt: true },
      ui: {
        itemView: { fieldMode: 'hidden' },
        createView: { fieldMode: 'hidden' },
      },
    }),
  },
})
