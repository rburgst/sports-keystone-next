import { fields } from '@graphql-ts/schema/dist/declarations/src/api-with-context'
import { list } from '@keystone-next/keystone'
import {
  checkbox,
  password,
  relationship,
  text,
} from '@keystone-next/keystone/fields'
import { permissions, rules } from './access'
import { permissionFields } from './fields'

const fieldModes = {
  editSelfOrRead: ({ session, item }: any) =>
    permissions.canManageUsers({ session }) || session.itemId === item.id
      ? 'edit'
      : 'read',
  editSelfOrHidden: ({ session, item }: any) =>
    permissions.canManageUsers({ session }) || session.itemId === item.id
      ? 'edit'
      : 'hidden',
}

export const User = list({
  // access: {
  //   operation: {
  //     create: () => true,
  //   },
  //   filter: {
  //     query: () => true,
  //     update: rules.canManageUserList,
  //     delete: rules.canManageUserList,
  //   },
  // },
  ui: {
    hideCreate: context => !permissions.canManageUsers(context),
    hideDelete: context => !permissions.canManageUsers(context),
    itemView: {
      defaultFieldMode: context =>
        permissions.canManageUsers(context) ? 'edit' : 'hidden',
    },
    listView: {
      defaultFieldMode: context =>
        permissions.canManageUsers(context) ? 'read' : 'hidden',
    },
  },
  fields: {
    name: text({
      ui: {
        itemView: { fieldMode: fieldModes.editSelfOrRead },
      },
    }),
    email: text({
      isIndexed: 'unique',
      validation: {
        isRequired: true,
      },
      access: {
        read: rules.canManageUser,
      },
      ui: {
        itemView: { fieldMode: fieldModes.editSelfOrHidden },
      },
    }),
    password: password({
      validation: {
        isRequired: true,
      },
      ui: {
        itemView: { fieldMode: fieldModes.editSelfOrHidden },
      },
    }),
    role: relationship({
      ref: 'Role.users',
      access: permissions.canManageUsers,
    }),
    club: relationship({ ref: 'Club.managerUser' }),
  },
})

export const Role = list({
  // access: {
  //   filter: {
  //     delete: permissions.canManageUsers,
  //     query: permissions.canManageUsers,
  //     update: permissions.canManageUsers,
  //   },
  // },
  ui: {
    //isHidden: context => !permissions.canManageUsers(context),
  },
  fields: {
    name: text(),
    ...permissionFields,
    users: relationship({ ref: 'User.role', many: true }),
  },
})
