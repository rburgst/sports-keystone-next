type SessionContext = {
  session?: {
    data: {
      name: string
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
  canReadContentList: ({ session }: SessionContext) => {
    if (permissions.canManageContent({ session })) return true
    return { status: { equals: 'published' } }
  },
  canManageUser: ({ session, item }: ItemContext) => {
    if (permissions.canManageUsers({ session })) return true
    if (session?.itemId === item.id) return true
    return false
  },
  canManageUserList: ({ session }: SessionContext) => {
    if (permissions.canManageUsers({ session })) return true
    if (!isSignedIn({ session })) return false
    return { where: { id: { equals: session!.itemId } } }
  },
}
