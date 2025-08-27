import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WaterData } from '@/shared/types'
import { getGroundwaterClassification } from '@/shared/utils'

interface ResourceLevelSectionProps {
  waterData: WaterData[]
}

export const ResourceLevelSection: React.FC<ResourceLevelSectionProps> = ({ waterData }) => {
  const avgGroundwaterLevel = waterData.length > 0 
    ? (waterData.reduce((sum, data) => sum + data.groundwaterLevel, 0) / waterData.length).toFixed(1)
    : '0'
  
  const avgNetAvailability = waterData.length > 0 
    ? (waterData.reduce((sum, data) => sum + data.netGroundwaterAvailability, 0) / waterData.length).toFixed(1)
    : '0'
  
  const avgDevelopmentStage = waterData.length > 0 
    ? (waterData.reduce((sum, data) => sum + data.stageGroundwaterDevelopment, 0) / waterData.length).toFixed(1)
    : '0'

  const avgStage = waterData.length > 0 
    ? (waterData.reduce((sum, data) => sum + data.stageGroundwaterDevelopment, 0) / waterData.length) 
    : 0
  
  const classification = getGroundwaterClassification(avgStage)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground">GW Resource Level</h2>
        <p className="text-sm text-muted-foreground">Groundwater resource monitoring and availability metrics</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waterData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Groundwater Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgGroundwaterLevel}m</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Net Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgNetAvailability} MCM</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Development Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDevelopmentStage}%</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Second row for additional GW Resource boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stage of GW Development</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDevelopmentStage}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">GW Classification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${classification.color}`}></div>
              <div className="text-lg font-bold">{classification.status}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
