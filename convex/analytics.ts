import { query } from './_generated/server'
import { v } from 'convex/values'

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null

    // 1. Authenticate the User
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique()

    if (!user) return null

    // 2. Fetch all links belonging to this user
    const links = await ctx.db
      .query('links')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .collect()

    if (links.length === 0) {
      return {
        totalLinks: 0,
        totalClicks: 0,
        deviceStats: [],
        timelineStats: [],
      }
    }

    let totalClicks = 0
    let desktopClicks = 0
    let mobileClicks = 0

    // We will store clicks by date (e.g., "2023-10-25": 5)
    const clicksByDate: Record<string, number> = {}

    // 3. Aggregate data across all links
    for (const link of links) {
      totalClicks += link.clicks

      // Fetch the specific analytics events for this link
      const events = await ctx.db
        .query('analytics')
        .withIndex('by_linkId', (q) => q.eq('linkId', link._id))
        .collect()

      for (const event of events) {
        // Tally device types
        if (event.deviceType === 'Desktop') desktopClicks++
        if (event.deviceType === 'Mobile') mobileClicks++

        // Format the timestamp to a readable date (YYYY-MM-DD)
        const dateObj = new Date(event.timestamp)
        const dateKey = dateObj.toISOString().split('T')[0]

        // Increment the count for this specific day
        if (!clicksByDate[dateKey]) {
          clicksByDate[dateKey] = 0
        }
        clicksByDate[dateKey]++
      }
    }

    // 4. Format the data perfectly for Recharts
    const deviceStats = [
      { name: 'Desktop', value: desktopClicks, fill: '#3b82f6' }, // Blue
      { name: 'Mobile', value: mobileClicks, fill: '#10b981' }, // Green
    ]

    // Convert the date object into a sorted array for the line chart
    const timelineStats = Object.keys(clicksByDate)
      .sort() // Ensure dates are in chronological order
      .map((date) => ({
        date: date,
        clicks: clicksByDate[date],
      }))

    return {
      totalLinks: links.length,
      totalClicks,
      deviceStats,
      timelineStats,
    }
  },
})
