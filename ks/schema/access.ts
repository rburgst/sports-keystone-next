export type SessionContextData = {
  name: string
  club?: {
    id: string
  }
  role: {
    canManageClubs: boolean
    canManageUsers: boolean
    canReadAllAthletes: boolean
    canWriteAllAthletes: boolean
    canReadOwnClubAthletes: boolean
    canWriteOwnClubAthletes: boolean
    canEnterScores: boolean
    canEnterScoresWhenDone: boolean
  }
}
export type SessionContext = {
  session?: {
    data: SessionContextData
    itemId: string
    listKey: string
  }
}
type ItemContext = { item: any } & SessionContext

export const isSignedIn = ({ session }: SessionContext) => {
  return !!session
}

export const permissions = {
  canManageClubs: ({ session }: SessionContext) => {
    return !!session?.data.role?.canManageClubs
  },
  canReadAllAthletes: ({ session }: SessionContext) => {
    return !!session?.data.role?.canReadAllAthletes
  },
  canWriteAllAthletes: ({ session }: SessionContext) => {
    return !!session?.data.role?.canWriteAllAthletes
  },
  canReadOwnClubAthletes: ({ session }: SessionContext) => {
    return !!session?.data.role?.canReadOwnClubAthletes
  },
  canWriteOwnClubAthletes: ({ session }: SessionContext) => {
    return !!session?.data.role?.canWriteOwnClubAthletes
  },
  canManageUsers: ({ session }: SessionContext) => {
    return !!session?.data.role?.canManageUsers
  },
}

export const rules = {
  canUseAdminUI: ({ session }: SessionContext) => {
    return !!session?.data.role
  },

  canManageClubList: ({ session }: SessionContext) => {
    if (!isSignedIn({ session })) {
      return false
    }
    if (permissions.canManageClubs({ session })) {
      return true
    }
    const managedClubId = session?.data.club?.id
    if (!managedClubId) {
      return false
    }
    return { id: { equals: managedClubId } }
  },

  canManageUser: ({ session, item }: ItemContext) => {
    if (permissions.canManageUsers({ session })) {
      return true
    }
    return session?.itemId === item.id
  },
  canManageUserList: ({ session }: SessionContext) => {
    if (!isSignedIn({ session })) {
      return false
    }
    if (permissions.canManageUsers({ session })) {
      return true
    }
    return false
  },
}
