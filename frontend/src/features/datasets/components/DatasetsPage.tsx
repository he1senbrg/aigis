'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Grid3X3, List, Search } from 'lucide-react'
import React, { useState } from 'react'
import { DATASETS, downloadDataset } from '../data/datasets'
import { DatasetCard } from './DatasetCard'

interface DatasetsPageProps {
  className?: string
}

export const DatasetsPage: React.FC<DatasetsPageProps> = ({ className }) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  React.useEffect(() => {
    if (isMobile && viewMode !== 'list') {
      setViewMode('list')
    }
  }, [isMobile, viewMode])

  const filteredDatasets = DATASETS.filter(dataset =>
    dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dataset.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={cn("space-y-4 sm:space-y-6", className)}>
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Datasets</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Download water quality and resource datasets for research and analysis
        </p>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search datasets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
        
        {!isMobile && (
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="flex-1 sm:flex-none"
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="flex-1 sm:flex-none"
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Grid
            </Button>
          </div>
        )}
      </div>

      {/* Datasets */}
      <div className={cn(
        viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" 
          : "space-y-3 sm:space-y-4"
      )}>
        {filteredDatasets.map((dataset) => (
          <DatasetCard
            key={dataset.id}
            dataset={dataset}
            viewMode={viewMode}
            onDownload={downloadDataset}
          />
        ))}
      </div>

      {filteredDatasets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            No datasets found matching your search criteria.
          </div>
        </div>
      )}
    </div>
  )
}
