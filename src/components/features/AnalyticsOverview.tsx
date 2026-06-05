import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { BarChart3, MousePointerClick, Link as LinkIcon } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

export default function AnalyticsOverview() {
  const stats = useQuery(api.analytics.getDashboardStats)

  // 1. Loading State
  if (stats === undefined) {
    return (
      <div className='w-full h-64 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-center mb-8'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600' />
      </div>
    )
  }

  // 2. Empty State (Hide the charts if there are no links at all)
  if (!stats || stats.totalLinks === 0) {
    return null
  }

  return (
    <div className='mb-8 space-y-6 animate-fade-in-down'>
      {/* Top Stat Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4'>
          <div className='p-4 bg-blue-50 text-blue-600 rounded-lg'>
            <LinkIcon className='w-6 h-6' />
          </div>
          <div>
            <p className='text-sm font-medium text-gray-500'>
              Total Active Links
            </p>
            <p className='text-3xl font-display font-bold text-gray-900'>
              {stats.totalLinks}
            </p>
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4'>
          <div className='p-4 bg-emerald-50 text-emerald-600 rounded-lg'>
            <MousePointerClick className='w-6 h-6' />
          </div>
          <div>
            <p className='text-sm font-medium text-gray-500'>
              Total Lifetime Clicks
            </p>
            <p className='text-3xl font-display font-bold text-gray-900'>
              {stats.totalClicks}
            </p>
          </div>
        </div>
      </div>

      {/* The Graphs */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Click Timeline (Spans 2 columns on large screens) */}
        <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2 flex flex-col'>
          <h3 className='text-lg font-display font-bold text-gray-900 mb-6 flex items-center gap-2'>
            <BarChart3 className='w-5 h-5 text-gray-400' />
            Click Engagement Timeline
          </h3>
          <div className='h-64 w-full flex-grow'>
            {stats.timelineStats.length > 0 ? (
              <ResponsiveContainer
                width='100%'
                height='100%'
              >
                <LineChart data={stats.timelineStats}>
                  <CartesianGrid
                    strokeDasharray='3 3'
                    vertical={false}
                    stroke='#E5E7EB'
                  />
                  <XAxis
                    dataKey='date'
                    stroke='#9CA3AF'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke='#9CA3AF'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Line
                    type='monotone'
                    dataKey='clicks'
                    stroke='#3b82f6'
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className='h-full flex items-center justify-center text-gray-400'>
                Not enough click data to generate timeline yet.
              </div>
            )}
          </div>
        </div>

        {/* Device Distribution Pie Chart */}
        <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col'>
          <h3 className='text-lg font-display font-bold text-gray-900 mb-6'>
            Device Distribution
          </h3>
          <div className='h-64 w-full flex-grow'>
            {stats.deviceStats.some((d) => d.value > 0) ? (
              <ResponsiveContainer
                width='100%'
                height='100%'
              >
                <PieChart>
                  <Pie
                    data={stats.deviceStats}
                    cx='50%'
                    cy='50%'
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey='value'
                  >
                    {stats.deviceStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Legend
                    verticalAlign='bottom'
                    height={36}
                    iconType='circle'
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className='h-full flex items-center justify-center text-gray-400 text-center px-4'>
                Waiting for the first clicks to generate device data.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
