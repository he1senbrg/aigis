'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronRight, Database, Home, LayoutDashboard } from 'lucide-react'
import React, { useState } from 'react'

interface NavigationSidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
  className?: string
}

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Water monitoring overview'
  },
  {
    id: 'datasets',
    label: 'Datasets',
    icon: Database,
    description: 'View and download datasets'
  }
]

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  currentPage,
  onPageChange,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className={cn(
        "relative transition-all duration-300 ease-in-out bg-card border-r border-border",
        isExpanded ? "w-64" : "w-16",
        className
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-primary-foreground" />
            </div>
            {isExpanded && (
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-sm truncate">AIGIS</h2>
                <p className="text-xs text-muted-foreground truncate">Navigation</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-2 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start relative",
                  isExpanded ? "px-3" : "px-2",
                  isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
                onClick={() => onPageChange(item.id)}
              >
                <Icon className={cn("w-4 h-4 flex-shrink-0", isExpanded ? "mr-3" : "")} />
                {isExpanded && (
                  <>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-3 h-3 ml-auto" />
                    )}
                  </>
                )}
                {!isExpanded && isActive && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-1 h-6 bg-primary rounded-r" />
                )}
              </Button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          {isExpanded && (
            <div className="text-xs text-muted-foreground text-center">
              {/* Hover to expand */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
