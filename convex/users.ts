import { mutation } from './_generated/server'

/**
 * Syncs the authenticated Clerk user with the Convex database.
 * If the user doesn't exist, it creates a new record.
 * If they do exist, it ensures their profile details are up to date.
 */
export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Unauthenticated call to storeUser')
    }

    // Check if the user already exists by their Clerk ID index
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()

    if (user !== null) {
      // User exists, update their details if they changed
      if (
        user.email !== identity.email ||
        user.firstName !== identity.givenName
      ) {
        await ctx.db.patch(user._id, {
          email: identity.email ?? user.email,
          firstName: identity.givenName ?? user.firstName,
          lastName: identity.familyName ?? user.lastName,
        })
      }
      return user._id
    }

    // User is new, insert a brand new record
    return await ctx.db.insert('users', {
      clerkId: identity.subject,
      email: identity.email ?? '',
      firstName: identity.givenName,
      lastName: identity.familyName,
    })
  },
})
