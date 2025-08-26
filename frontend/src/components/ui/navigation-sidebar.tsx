'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronRight, Database, LayoutDashboard, Menu, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface NavigationSidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
  mobileMenuOpen?: boolean
  setMobileMenuOpen?: (open: boolean) => void
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
  mobileMenuOpen = false,
  setMobileMenuOpen,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Close mobile menu when clicking on a navigation item
  const handlePageChange = (page: string) => {
    onPageChange(page)
    if (setMobileMenuOpen) {
      setMobileMenuOpen(false)
    }
  }

  // Close mobile menu when clicking outside on mobile
  useEffect(() => {
    if (mobileMenuOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        const sidebar = document.getElementById('navigation-sidebar')
        if (sidebar && !sidebar.contains(event.target as Node)) {
          setMobileMenuOpen?.(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [mobileMenuOpen, setMobileMenuOpen])

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen?.(false)} />
      )}
      
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:flex lg:flex-col relative transition-all duration-300 ease-in-out bg-card border-r border-border",
          isExpanded ? "lg:w-64" : "lg:w-16",
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Desktop Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                <Menu className="w-4 h-4 text-primary-foreground" />
              </button>
              
              {isExpanded && (
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-sm truncate">AIGIS</h2>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Items */}
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
                  onClick={() => handlePageChange(item.id)}
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

          {/* Desktop Footer */}
          <div className="p-4 border-t border-border">
            <div className={cn(
              "text-xs text-muted-foreground text-center",
              !isExpanded && "hidden"
            )}>
              Team AIGIS
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar */}
      <div
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out bg-card border-r border-border",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen?.(false)}
                className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                <X className="w-4 h-4 text-primary-foreground" />
              </button>
              
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-sm truncate">AIGIS</h2>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Items */}
          <nav className="flex-1 p-2 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start relative px-3",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                  onClick={() => handlePageChange(item.id)}
                >
                  <Icon className="w-4 h-4 flex-shrink-0 mr-3" />
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                  {isActive && (
                    <ChevronRight className="w-3 h-3 ml-auto" />
                  )}
                </Button>
              )
            })}
          </nav>

          {/* Mobile Footer */}
          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">
              Team AIGIS
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NavigationSidebar
