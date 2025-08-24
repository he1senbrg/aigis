'use client'

import { DatasetsPage } from '@/components/DatasetsPage'
import { NavigationSidebar } from '@/components/ui/navigation-sidebar'
import WaterMonitoringDashboard from '@/components/WaterMonitoringDashboardNew'
import React, { useState } from 'react'

const WaterMonitoringApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <WaterMonitoringDashboard />
      case 'datasets':
        return (
          <div className="p-6">
            <DatasetsPage />
          </div>
        )
      default:
        return <WaterMonitoringDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Navigation Sidebar */}
        <NavigationSidebar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {renderCurrentPage()}
        </div>
      </div>
    </div>
  )
}

export default WaterMonitoringApp
