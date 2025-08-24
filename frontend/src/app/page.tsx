'use client'

import dynamic from 'next/dynamic'

const WaterMonitoringApp = dynamic(
  () => import('@/components/WaterMonitoringApp'),
  { ssr: false }
)

export default function Home() {
  return <WaterMonitoringApp />
}
