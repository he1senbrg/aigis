import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { WaterData } from '@/shared/types'
import { getPotabilityScore, getWaterQuality } from '@/shared/utils'

interface WaterQualitySectionProps {
  waterData: WaterData[]
}

export const WaterQualitySection: React.FC<WaterQualitySectionProps> = ({ waterData }) => {
  const avgPh = waterData.length > 0 ? (waterData.reduce((sum, data) => sum + data.ph, 0) / waterData.length).toFixed(1) : '0'
  const avgTds = waterData.length > 0 ? Math.round(waterData.reduce((sum, data) => sum + data.tds, 0) / waterData.length) : 0
  const avgNitrate = waterData.length > 0 ? (waterData.reduce((sum, data) => sum + data.nitrate, 0) / waterData.length).toFixed(1) : '0'
  
  const qualityIssues = waterData.filter(data => {
    const quality = getWaterQuality(data.ph, data.tds, data.nitrate, data.fluoride, data.arsenic)
    return quality.status === 'Fair' || quality.status === 'Poor'
  }).length

  const avgPhValue = waterData.length > 0 ? waterData.reduce((sum, data) => sum + data.ph, 0) / waterData.length : 0
  const avgTdsValue = waterData.length > 0 ? waterData.reduce((sum, data) => sum + data.tds, 0) / waterData.length : 0
  const avgNitrateValue = waterData.length > 0 ? waterData.reduce((sum, data) => sum + data.nitrate, 0) / waterData.length : 0
  const avgFluoride = waterData.length > 0 ? waterData.reduce((sum, data) => sum + data.fluoride, 0) / waterData.length : 0
  const avgArsenic = waterData.length > 0 ? waterData.reduce((sum, data) => sum + data.arsenic, 0) / waterData.length : 0

  const potability = waterData.length > 0 ? getPotabilityScore(avgPhValue, avgTdsValue, avgNitrateValue, avgFluoride, avgArsenic) : null

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground">GW Quality</h2>
        <p className="text-sm text-muted-foreground">Water quality parameters and contamination levels</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average pH</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgPh}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average TDS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTds} mg/L</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Nitrate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgNitrate} mg/L</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quality Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qualityIssues}</div>
          </CardContent>
        </Card>
      </div>

      {/* Second row for additional GW Quality boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Water Safety Status</CardTitle>
          </CardHeader>
          <CardContent>
            {potability ? (
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${potability.color}`}></div>
                <div className="text-lg font-bold">{potability.status}</div>
              </div>
            ) : (
              <div className="text-lg font-bold">No Data</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Potability Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {potability ? `${potability.score}/100` : '0'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Potability Analysis Table */}
      {waterData.length > 0 && potability && (
        <Card>
          <CardHeader>
            <CardTitle>Potability Analysis</CardTitle>
            <CardDescription>Chemical contributions to potability score and WHO/BIS threshold compliance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parameter</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead>WHO/BIS Threshold</TableHead>
                    <TableHead>Score Contribution</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: 'pH', value: avgPhValue.toFixed(1), threshold: '6.5-8.5', contribution: potability.contributions['pH'] },
                    { name: 'TDS', value: `${Math.round(avgTdsValue)} mg/L`, threshold: '≤500 mg/L', contribution: potability.contributions['TDS'] },
                    { name: 'Nitrate', value: `${avgNitrateValue.toFixed(1)} mg/L`, threshold: '≤45 mg/L', contribution: potability.contributions['Nitrate'] },
                    { name: 'Fluoride', value: `${avgFluoride.toFixed(1)} mg/L`, threshold: '0.6-1.5 mg/L', contribution: potability.contributions['Fluoride'] },
                    { name: 'Arsenic', value: `${avgArsenic.toFixed(1)} μg/L`, threshold: '≤10 μg/L', contribution: potability.contributions['Arsenic'] }
                  ].map((param, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{param.name}</TableCell>
                      <TableCell>{param.value}</TableCell>
                      <TableCell>{param.threshold}</TableCell>
                      <TableCell className={param.contribution < 0 ? 'text-red-500' : 'text-green-600'}>
                        {param.contribution === 0 ? '0' : param.contribution.toFixed(1)}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={param.contribution === 0 ? 'default' : 'destructive'}
                          className={param.contribution === 0 ? 'bg-green-100 text-green-800' : ''}
                        >
                          {param.contribution === 0 ? 'Pass' : 'Fail'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {potability.failedThresholds.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Failed WHO/BIS Thresholds:</h4>
                <div className="flex flex-wrap gap-2">
                  {potability.failedThresholds.map((threshold, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {threshold}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
