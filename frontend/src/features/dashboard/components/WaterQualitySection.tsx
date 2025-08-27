import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { WaterData } from '@/shared/types'
import { getPotabilityScore, getWaterQuality } from '@/shared/utils'

interface WaterQualitySectionProps {
  waterData: WaterData[]
}

export const WaterQualitySection: React.FC<WaterQualitySectionProps> = ({ waterData }) => {
  console.log('WaterQualitySection received waterData:', waterData)
  console.log('First item qualityAnalysis:', waterData.length > 0 ? waterData[0].qualityAnalysis : 'No data')
  
  const avgPh = waterData.length > 0 ? (waterData.reduce((sum, data) => sum + data.ph, 0) / waterData.length).toFixed(1) : '0'
  const avgTds = waterData.length > 0 ? Math.round(waterData.reduce((sum, data) => sum + data.tds, 0) / waterData.length) : 0
  const avgNitrate = waterData.length > 0 ? (waterData.reduce((sum, data) => sum + data.nitrate, 0) / waterData.length).toFixed(1) : '0'
  
  // Use server analysis data if available, otherwise fall back to client-side calculations
  const serverQualityAnalysis = waterData.length > 0 && waterData[0].qualityAnalysis ? waterData[0].qualityAnalysis : null
  
  // Use server analysis for quality issues count, fallback to client-side calculation
  const qualityIssues = serverQualityAnalysis?.failed_parameters 
    ? Object.keys(serverQualityAnalysis.failed_parameters).length
    : waterData.filter(data => {
        const quality = getWaterQuality(data.ph, data.tds, data.nitrate, data.fluoride, data.arsenic)
        return quality.status === 'Fair' || quality.status === 'Poor'
      }).length

  const avgPhValue = waterData.length > 0 ? waterData.reduce((sum, data) => sum + data.ph, 0) / waterData.length : 0
  const avgTdsValue = waterData.length > 0 ? waterData.reduce((sum, data) => sum + data.tds, 0) / waterData.length : 0
  const avgNitrateValue = waterData.length > 0 ? waterData.reduce((sum, data) => sum + data.nitrate, 0) / waterData.length : 0
  const avgFluoride = waterData.length > 0 ? waterData.reduce((sum, data) => sum + data.fluoride, 0) / waterData.length : 0
  const avgArsenic = waterData.length > 0 ? waterData.reduce((sum, data) => sum + data.arsenic, 0) / waterData.length : 0

  // Use server potability score if available, otherwise calculate client-side
  const potability = serverQualityAnalysis 
    ? {
        score: Math.round(serverQualityAnalysis.potability_score),
        status: serverQualityAnalysis.safety_label,
        color: serverQualityAnalysis.safety_label === 'Safe' ? 'bg-green-500' : 
               serverQualityAnalysis.safety_label === 'Critical' ? 'bg-red-500' : 'bg-yellow-500',
        contributions: serverQualityAnalysis.explanation?.Contributions || {},
        failedThresholds: Object.entries(serverQualityAnalysis.failed_parameters || {}).map(([param, value]) => ({
          parameter: param,
          value: value
        }))
      }
    : waterData.length > 0 ? getPotabilityScore(avgPhValue, avgTdsValue, avgNitrateValue, avgFluoride, avgArsenic) : null

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
                  {(() => {
                    // If we have server analysis, show all parameters with contributions
                    if (serverQualityAnalysis && serverQualityAnalysis.explanation?.Contributions) {
                      const contributions = serverQualityAnalysis.explanation.Contributions;
                      
                      // Map server parameter names to display names and thresholds
                      const parameterMap: Record<string, { 
                        name: string; 
                        threshold: string; 
                        getValue: () => string;
                        getRawValue: () => number;
                        checkPass: (value: number) => boolean;
                      }> = {
                        'pH': { 
                          name: 'pH', 
                          threshold: '6.5-8.5', 
                          getValue: () => avgPhValue.toFixed(1),
                          getRawValue: () => avgPhValue,
                          checkPass: (value) => value >= 6.5 && value <= 8.5
                        },
                        'TDS': { 
                          name: 'TDS', 
                          threshold: '≤500 mg/L', 
                          getValue: () => `${Math.round(avgTdsValue)} mg/L`,
                          getRawValue: () => avgTdsValue,
                          checkPass: (value) => value <= 500
                        },
                        'EC': { 
                          name: 'Electrical Conductivity', 
                          threshold: '≤1500 μS/cm', 
                          getValue: () => `${waterData[0]?.ec || 0} μS/cm`,
                          getRawValue: () => waterData[0]?.ec || 0,
                          checkPass: (value) => value <= 1500
                        },
                        'TH': { 
                          name: 'Total Hardness', 
                          threshold: '≤300 mg/L', 
                          getValue: () => `${waterData[0]?.th || 0} mg/L`,
                          getRawValue: () => waterData[0]?.th || 0,
                          checkPass: (value) => value <= 300
                        },
                        'Ca': { 
                          name: 'Calcium', 
                          threshold: '≤75 mg/L', 
                          getValue: () => `${waterData[0]?.ca || 0} mg/L`,
                          getRawValue: () => waterData[0]?.ca || 0,
                          checkPass: (value) => value <= 75
                        },
                        'Mg': { 
                          name: 'Magnesium', 
                          threshold: '≤30 mg/L', 
                          getValue: () => `${waterData[0]?.mg || 0} mg/L`,
                          getRawValue: () => waterData[0]?.mg || 0,
                          checkPass: (value) => value <= 30
                        },
                        'Na': { 
                          name: 'Sodium', 
                          threshold: '≤200 mg/L', 
                          getValue: () => `${waterData[0]?.na || 0} mg/L`,
                          getRawValue: () => waterData[0]?.na || 0,
                          checkPass: (value) => value <= 200
                        },
                        'K': { 
                          name: 'Potassium', 
                          threshold: '≤12 mg/L', 
                          getValue: () => `${waterData[0]?.k || 0} mg/L`,
                          getRawValue: () => waterData[0]?.k || 0,
                          checkPass: (value) => value <= 12
                        },
                        'Cl': { 
                          name: 'Chloride', 
                          threshold: '≤250 mg/L', 
                          getValue: () => `${waterData[0]?.cl || 0} mg/L`,
                          getRawValue: () => waterData[0]?.cl || 0,
                          checkPass: (value) => value <= 250
                        },
                        'SO4': { 
                          name: 'Sulfate', 
                          threshold: '≤250 mg/L', 
                          getValue: () => `${waterData[0]?.so4 || 0} mg/L`,
                          getRawValue: () => waterData[0]?.so4 || 0,
                          checkPass: (value) => value <= 250
                        },
                        'NO3': { 
                          name: 'Nitrate', 
                          threshold: '≤45 mg/L', 
                          getValue: () => `${avgNitrateValue.toFixed(1)} mg/L`,
                          getRawValue: () => avgNitrateValue,
                          checkPass: (value) => value <= 45
                        },
                        'F': { 
                          name: 'Fluoride', 
                          threshold: '≤1.5 mg/L', 
                          getValue: () => `${avgFluoride.toFixed(1)} mg/L`,
                          getRawValue: () => avgFluoride,
                          checkPass: (value) => value <= 1.5
                        },
                        'U(ppb)': { 
                          name: 'Uranium', 
                          threshold: '≤30 ppb', 
                          getValue: () => `${waterData[0]?.uranium || 0} ppb`,
                          getRawValue: () => waterData[0]?.uranium || 0,
                          checkPass: (value) => value <= 30
                        },
                        'Arsenic': { 
                          name: 'Arsenic', 
                          threshold: '≤10 μg/L', 
                          getValue: () => `${avgArsenic.toFixed(1)} μg/L`,
                          getRawValue: () => avgArsenic,
                          checkPass: (value) => value <= 10
                        }
                      };
                      
                      return Object.entries(contributions).map(([paramKey, contribution]) => {
                        const paramInfo = parameterMap[paramKey];
                        if (!paramInfo) return null;
                        
                        const rawValue = paramInfo.getRawValue();
                        const isPass = paramInfo.checkPass(rawValue);
                        
                        // Use server's failed_parameters for more accurate Pass/Fail
                        const serverFailedParams = serverQualityAnalysis?.failed_parameters || {};
                        const isServerFail = paramKey in serverFailedParams;
                        
                        console.log(`${paramKey}: rawValue=${rawValue}, isPass=${isPass}, isServerFail=${isServerFail}`);
                        
                        return (
                          <TableRow key={paramKey}>
                            <TableCell className="font-medium">{paramInfo.name}</TableCell>
                            <TableCell>{paramInfo.getValue()}</TableCell>
                            <TableCell>{paramInfo.threshold}</TableCell>
                            <TableCell className={(contribution || 0) < 0 ? 'text-red-500' : 'text-green-600'}>
                              {(contribution || 0) === 0 ? '0' : (contribution || 0).toFixed(1)}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={isServerFail ? 'destructive' : 'default'}
                                className={isServerFail ? '' : 'bg-green-100 text-green-800'}
                              >
                                {isServerFail ? 'Fail' : 'Pass'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      }).filter(Boolean);
                    } else {
                      // Fallback to basic parameters if no server analysis
                      return [
                        { name: 'pH', value: avgPhValue.toFixed(1), threshold: '6.5-8.5', contribution: 0 },
                        { name: 'TDS', value: `${Math.round(avgTdsValue)} mg/L`, threshold: '≤500 mg/L', contribution: 0 },
                        { name: 'Nitrate', value: `${avgNitrateValue.toFixed(1)} mg/L`, threshold: '≤45 mg/L', contribution: 0 },
                        { name: 'Fluoride', value: `${avgFluoride.toFixed(1)} mg/L`, threshold: '0.6-1.5 mg/L', contribution: 0 },
                        { name: 'Arsenic', value: `${avgArsenic.toFixed(1)} μg/L`, threshold: '≤10 μg/L', contribution: 0 }
                      ].map((param, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{param.name}</TableCell>
                          <TableCell>{param.value}</TableCell>
                          <TableCell>{param.threshold}</TableCell>
                          <TableCell className="text-gray-500">N/A</TableCell>
                          <TableCell>
                            <Badge variant="default" className="bg-gray-100 text-gray-800">
                              N/A
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ));
                    }
                  })()}
                </TableBody>
              </Table>
            </div>
            {potability.failedThresholds.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Failed WHO/BIS Thresholds:</h4>
                <div className="flex flex-wrap gap-2">
                  {potability.failedThresholds.map((threshold: any, index: number) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {typeof threshold === 'string' ? threshold : `${threshold.parameter}: ${threshold.value}`}
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
