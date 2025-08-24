'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Download, Grid3X3, List, Search } from 'lucide-react'
import React, { useState } from 'react'

interface Dataset {
  id: string
  title: string
  description: string
  image: string
  fields: string[]
  size: string
  format: string
  lastUpdated: string
  downloadUrl: string
  category: string
}

const datasets: Dataset[] = [
  {
    id: '1',
    title: 'Ground Water Quality Dataset',
    description: 'Comprehensive water quality measurements including pH, TDS, nitrate, fluoride, and arsenic levels across various monitoring locations.',
    image: '/api/placeholder/300/200',
    fields: ['pH', 'TDS', 'Nitrate', 'Fluoride', 'Arsenic', 'Temperature', 'Location', 'Timestamp'],
    size: '2.4 MB',
    format: 'CSV',
    lastUpdated: '2024-08-20',
    downloadUrl: '/datasets/water-quality.csv',
    category: 'Quality'
  },
  {
    id: '2',
    title: 'Ground Water Resource Dataset',
    description: 'Groundwater assessment data including draft, recharge, availability, and development stage across different regions.',
    image: '/api/placeholder/300/200',
    fields: ['Annual Draft', 'Replenishable Resources', 'Net Availability', 'Development Stage', 'District', 'Year'],
    size: '1.8 MB',
    format: 'CSV',
    lastUpdated: '2024-08-18',
    downloadUrl: '/datasets/water-resources.csv',
    category: 'Resources'
  },
  {
    id: '3',
    title: 'Population Dataset',
    description: 'Demographic data including population distribution, density, and growth patterns correlated with water monitoring locations.',
    image: '/api/placeholder/300/200',
    fields: ['Population', 'Density', 'Growth Rate', 'Urban/Rural', 'District', 'Census Year'],
    size: '950 KB',
    format: 'CSV',
    lastUpdated: '2024-08-15',
    downloadUrl: '/datasets/population.csv',
    category: 'Demographics'
  }
]

interface DatasetsPageProps {
  className?: string
}

export const DatasetsPage: React.FC<DatasetsPageProps> = ({ className }) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDatasets = datasets.filter(dataset =>
    dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dataset.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDownload = (dataset: Dataset) => {
    // In a real app, this would trigger the actual download
    console.log(`Downloading ${dataset.title}...`)
    // For demo purposes, we'll create a sample CSV content
    const csvContent = `# ${dataset.title}\n# Fields: ${dataset.fields.join(', ')}\n# Last Updated: ${dataset.lastUpdated}\n\nSample data would be here...`
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${dataset.title.toLowerCase().replace(/\s+/g, '-')}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Datasets</h1>
          <p className="text-muted-foreground">
            Access and download the datasets used in our water monitoring system
          </p>
        </div>

        {/* Search and View Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search datasets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Grid
            </Button>
          </div>
        </div>
      </div>

      {/* Datasets */}
      <div className={cn(
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
      )}>
        {filteredDatasets.map((dataset) => (
          <Card key={dataset.id} className={cn(
            "transition-all duration-200 hover:shadow-lg",
            viewMode === 'list' && "flex flex-row overflow-hidden"
          )}>
            {viewMode === 'grid' ? (
              // Grid View
              <>
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  <img
                    src={dataset.image}
                    alt={dataset.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to a colored div if image fails to load
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"><div class="text-primary text-4xl font-bold">${dataset.category[0]}</div></div>`
                      }
                    }}
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{dataset.title}</CardTitle>
                    <Badge variant="secondary">{dataset.category}</Badge>
                  </div>
                  <CardDescription className="text-sm">{dataset.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Fields</h4>
                    <div className="flex flex-wrap gap-1">
                      {dataset.fields.slice(0, 6).map((field, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                      {dataset.fields.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{dataset.fields.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{dataset.format} • {dataset.size}</span>
                    <span>Updated {dataset.lastUpdated}</span>
                  </div>
                  <Button
                    onClick={() => handleDownload(dataset)}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </>
            ) : (
              // List View
              <>
                <div className="w-48 flex-shrink-0 bg-muted overflow-hidden">
                  <img
                    src={dataset.image}
                    alt={dataset.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"><div class="text-primary text-2xl font-bold">${dataset.category[0]}</div></div>`
                      }
                    }}
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{dataset.title}</CardTitle>
                      <Badge variant="secondary">{dataset.category}</Badge>
                    </div>
                    <CardDescription>{dataset.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Available Fields</h4>
                      <div className="flex flex-wrap gap-1">
                        {dataset.fields.map((field, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {dataset.format} • {dataset.size} • Updated {dataset.lastUpdated}
                      </div>
                      <Button
                        onClick={() => handleDownload(dataset)}
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </>
            )}
          </Card>
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
