import { mutation } from './_generated/server'
import { v } from 'convex/values'
import { nanoid } from 'nanoid'

export const createShortLink = mutation({
  // The data we expect from the frontend React form
  args: {
    longUrl: v.string(),
    customSlug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Identity Check: See if a user is logged in
    const identity = await ctx.auth.getUserIdentity()
    let internalUserId = undefined

    if (identity) {
      // Find their actual ID in our users table
      const user = await ctx.db
        .query('users')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
        .unique()

      if (user) {
        internalUserId = user._id
      }
    }

    // 2. Slug Generation: Use custom or generate a random 6-character string
    let finalSlug = args.customSlug

    if (!finalSlug) {
      finalSlug = nanoid(6)
    }

    // 3. Collision Defense: Check if this exact slug already exists in the database
    const existingLink = await ctx.db
      .query('links')
      .withIndex('by_shortCode', (q) => q.eq('shortCode', finalSlug as string))
      .unique()

    if (existingLink) {
      throw new Error(
        'This custom slug is already taken. Please choose another.',
      )
    }

    // 4. Database Insertion: Store the payload securely
    const newLinkId = await ctx.db.insert('links', {
      userId: internalUserId, // This will be undefined for anonymous users
      longUrl: args.longUrl,
      shortCode: finalSlug,
      clicks: 0,
      isActive: true,
    })

    // Return the newly created short code to the frontend so it can display the result
    return finalSlug
  },
})
