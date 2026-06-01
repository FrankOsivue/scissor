import { mutation } from './_generated/server'
import { query } from './_generated/server'
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

export const getAndTrackClick = mutation({
  args: {
    shortCode: v.string(),
    deviceType: v.string(), // We will pass whether they are on mobile or desktop
  },
  handler: async (ctx, args) => {
    // 1. Find the link in the database
    const link = await ctx.db
      .query('links')
      .withIndex('by_shortCode', (q) => q.eq('shortCode', args.shortCode))
      .unique()

    // If it doesn't exist, return null so the frontend can show a 404
    if (!link) {
      return null
    }

    // 2. Increment the total click counter on the link itself
    await ctx.db.patch(link._id, {
      clicks: link.clicks + 1,
    })

    // 3. Log the specific click event for the Analytics Dashboard
    await ctx.db.insert('analytics', {
      linkId: link._id,
      timestamp: Date.now(),
      deviceType: args.deviceType,
    })

    // 4. Return the original destination URL
    return link.longUrl
  },
})

export const getUserLinks = query({
  args: {},
  handler: async (ctx) => {
    // 1. Verify the user is logged in via the Clerk-Convex bridge
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return []
    }

    // 2. Find the user's internal Convex database ID using their Clerk ID
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()

    if (!user) {
      return []
    }

    // 3. Fetch all links belonging to this specific user
    const links = await ctx.db
      .query('links')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .order('desc')
      .collect()

    return links
  },
})

export const deleteLink = mutation({
  args: {
    id: v.id('links'), //target link by ID
  },
  handler: async (ctx, args) => {
    // 1. Security Check: Who is logged in?
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('You must be logged in to delete a link.')
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()

    if (!user) throw new Error('User profile not found.')

    // 2. Fetch the link the user is trying to delete
    const link = await ctx.db.get(args.id)
    if (!link) throw new Error('Link not found.')

    // 3. Authorization Check: Does this link actually belong to this user?
    if (link.userId !== user._id) {
      throw new Error('Unauthorized: You do not own this link.')
    }

    // 4. Clean up the database: Delete all analytics associated with this link
    const relatedAnalytics = await ctx.db
      .query('analytics')
      .withIndex('by_linkId', (q) => q.eq('linkId', args.id))
      .collect()

    for (const record of relatedAnalytics) {
      await ctx.db.delete(record._id)
    }

    // 5. Finally, delete the link itself
    await ctx.db.delete(args.id)
  },
})
