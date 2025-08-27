'use client'

import { Button } from '@/components/ui/button'
import { NavigationSidebar } from '@/components/ui/navigation-sidebar'
import { WaterMonitoringDashboard } from '@/features/dashboard'
import { DatasetsPage } from '@/features/datasets'
import { Menu } from 'lucide-react'
import React, { useState } from 'react'

const WaterMonitoringApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <WaterMonitoringDashboard setMobileMenuOpen={setMobileMenuOpen} />
      case 'datasets':
        return (
          <div className="flex flex-col h-screen">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
              <div>
                <h1 className="text-xl font-bold text-foreground">AIGIS</h1>
                <p className="text-sm text-muted-foreground">Datasets</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              <div className="p-3 sm:p-6">
                <DatasetsPage />
              </div>
            </div>
          </div>
        )
      default:
        return <WaterMonitoringDashboard setMobileMenuOpen={setMobileMenuOpen} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Navigation Sidebar */}
        <NavigationSidebar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
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
