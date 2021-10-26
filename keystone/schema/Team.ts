import { list } from '@keystone-next/keystone'
import {
  checkbox,
  integer,
  select,
  text,
  relationship,
} from '@keystone-next/keystone/fields'

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
})
