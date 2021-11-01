import { list } from '@keystone-next/keystone'
import {
  checkbox,
  integer,
  relationship,
  select,
  text,
} from '@keystone-next/keystone/fields'
import { version } from '../fields/version-field'
import { rules } from './access'

export const Club = list({
  ui: {
    labelField: 'clubName',
  },
  fields: {
    clubName: text({
      db: { isNullable: false },
      validation: { isRequired: true },
    }),
    clubNumber: integer({ isOrderable: true, isIndexed: 'unique' }),
    contactEmail: text(),
    addressName: text(),
    street: text(),
    zip: text(),
    city: text(),

    // Having the status here will make it easy for us to choose whether to display
    // posts on a live site.
    country: select({
      options: [
        { label: 'AT', value: 'AT' },
        { label: 'DE', value: 'DE' },
      ],
      // We want to make sure new posts start off as a draft when they are created
      defaultValue: 'AT',
      // fields also have the ability to configure their appearance in the Admin UI
      ui: {
        displayMode: 'select',
      },
    }),
    external: checkbox({ defaultValue: false }),

    athletes: relationship({
      ref: 'Athlete.club',
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
    teams: relationship({
      ref: 'Team.club',
      many: true,
      ui: {
        displayMode: 'cards',
        cardFields: ['teamName'],
        linkToItem: true,
        inlineConnect: true,
      },
    }),
  },
})
