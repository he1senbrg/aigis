'use client'

import dynamic from 'next/dynamic'

const WaterMonitoringDashboard = dynamic(
  () => import('@/components/WaterMonitoringDashboard'),
  { ssr: false }
)

export default function Home() {
  return <WaterMonitoringDashboard />
}
