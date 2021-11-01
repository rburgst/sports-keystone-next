import { checkbox } from '@keystone-next/keystone/fields'

export const permissionFields = {
  canManageClubs: checkbox({ defaultValue: false }),
  canManageUsers: checkbox({ defaultValue: false }),
  canReadAllAthletes: checkbox({ defaultValue: false }),
  canWriteAllAthletes: checkbox({ defaultValue: false }),
  canReadOwnClubAthletes: checkbox({ defaultValue: false }),
  canWriteOwnClubAthletes: checkbox({ defaultValue: false }),
  canEnterScores: checkbox({ defaultValue: false }),
  canEnterScoresWhenDone: checkbox({ defaultValue: false }),
  canManageContent: checkbox({ defaultValue: false }),
}

export type Permission = keyof typeof permissionFields

export const permissionsList: Permission[] = Object.keys(
  permissionFields
) as Permission[]
