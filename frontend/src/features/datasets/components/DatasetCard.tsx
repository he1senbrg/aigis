import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dataset } from '@/shared/types'
import { Download } from 'lucide-react'
import Image from 'next/image'

interface DatasetCardProps {
  dataset: Dataset
  viewMode: 'list' | 'grid'
  onDownload: (dataset: Dataset) => void
}

export const DatasetCard: React.FC<DatasetCardProps> = ({ dataset, viewMode, onDownload }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement
    target.style.display = 'none'
    const parent = target.parentElement
    if (parent) {
      parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"><div class="text-primary text-4xl font-bold">${dataset.category[0]}</div></div>`
    }
  }

  if (viewMode === 'grid') {
    return (
      <Card className="transition-all duration-200 hover:shadow-lg">
        <div className="aspect-video bg-muted rounded-t-lg overflow-hidden relative">
          <Image
            src={dataset.image}
            alt={dataset.title}
            fill
            className="object-cover"
            onError={handleImageError}
          />
        </div>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <CardTitle className="text-base sm:text-lg">{dataset.title}</CardTitle>
            <Badge variant="secondary" className="self-start">{dataset.category}</Badge>
          </div>
          <CardDescription className="text-xs sm:text-sm">{dataset.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div>
            <h4 className="text-xs sm:text-sm font-medium mb-2">Fields</h4>
            <div className="flex flex-wrap gap-1">
              {dataset.fields.slice(0, 6).map((field, index) => (
                <Badge key={index} variant="outline" className="text-[10px] sm:text-xs">
                  {field}
                </Badge>
              ))}
              {dataset.fields.length > 6 && (
                <Badge variant="outline" className="text-[10px] sm:text-xs">
                  +{dataset.fields.length - 6} more
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
            <span>{dataset.format} • {dataset.size}</span>
            <span>Updated {dataset.lastUpdated}</span>
          </div>
          <Button
            onClick={() => onDownload(dataset)}
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-lg flex flex-col sm:flex-row overflow-hidden">
      <div className="w-full h-48 sm:w-48 sm:h-auto sm:flex-shrink-0 bg-muted overflow-hidden relative">
        <Image
          src={dataset.image}
          alt={dataset.title}
          fill
          className="object-cover"
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
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <CardTitle className="text-lg sm:text-xl">{dataset.title}</CardTitle>
            <Badge variant="secondary" className="self-start">{dataset.category}</Badge>
          </div>
          <CardDescription className="text-sm">{dataset.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-3 sm:space-y-4">
          <div>
            <h4 className="text-xs sm:text-sm font-medium mb-2">Available Fields</h4>
            <div className="flex flex-wrap gap-1">
              {dataset.fields.map((field, index) => (
                <Badge key={index} variant="outline" className="text-[10px] sm:text-xs">
                  {field}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-xs sm:text-sm text-muted-foreground">
              {dataset.format} • {dataset.size} • Updated {dataset.lastUpdated}
            </div>
            <Button
              onClick={() => onDownload(dataset)}
              size="sm"
              className="w-full sm:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
