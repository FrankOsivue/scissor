import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  // 1. Users Table (Synced from Clerk)
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
  }).index('by_clerk_id', ['clerkId']), // Fast lookup for auth

  // 2. Links Table (The Core Resource)
  links: defineTable({
    userId: v.optional(v.id('users')), // Optional, as anonymous users might create links
    longUrl: v.string(),
    shortCode: v.string(), // The 6-char slug or custom slug
    clicks: v.number(),
    expiryDate: v.optional(v.string()), // ISO date string
    isActive: v.boolean(),
  })
    .index('by_shortCode', ['shortCode']) // We need to query this instantly for redirects
    .index('by_userId', ['userId']), // To display links in the user dashboard

  // 3. Analytics Table
  analytics: defineTable({
    linkId: v.id('links'),
    timestamp: v.number(),
    referrer: v.optional(v.string()), // e.g., Google, Facebook, Direct
    deviceType: v.string(), // e.g., Mobile, Desktop
    country: v.optional(v.string()), // For location data
  }).index('by_linkId', ['linkId']), // Fast lookup for a specific link's stats
})
