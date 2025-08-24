'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

interface WaterInputData {
  location: string
  latitude: string
  longitude: string
  districtName: string
  population: string
  groundwaterLevel: string
  ph: string
  tds: string
  nitrate: string
  fluoride: string
  arsenic: string
  temperature: string
  wellDepth: string
  // Groundwater Assessment Parameters
  annualDomesticIndustryDraft: string
  annualIrrigationDraft: string
  annualGroundwaterDraftTotal: string
  annualReplenishableGroundwaterResources: string
  naturalDischargeNonMonsoon: string
  netGroundwaterAvailability: string
  projectedDemandDomesticIndustrial2025: string
  groundwaterAvailabilityFutureIrrigation: string
  stageGroundwaterDevelopment: string
}

interface InputSidebarProps {
  inputData: WaterInputData
  onInputChange: (field: keyof WaterInputData, value: string) => void
  onSubmit: (e: React.FormEvent) => void
  className?: string
}

export const InputSidebar: React.FC<InputSidebarProps> = ({
  inputData,
  onInputChange,
  onSubmit,
  className
}) => {
  return (
    <div className={className}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-lg font-bold text-foreground">Add Data</h2>
          <p className="mt-1 text-xs text-muted-foreground">Enter new monitoring data</p>
        </div>

        {/* Input Form */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Water Monitoring Data</CardTitle>
            <CardDescription className="text-xs">Enter water monitoring data for a new location</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-3">
              <div className="space-y-2">
                <div>
                  <Label htmlFor="location" className="text-xs">Location Name</Label>
                  <Input
                    id="location"
                    value={inputData.location}
                    onChange={(e) => onInputChange('location', e.target.value)}
                    placeholder="e.g., Kollam"
                    className="text-xs h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="latitude" className="text-xs">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={inputData.latitude}
                    onChange={(e) => onInputChange('latitude', e.target.value)}
                    placeholder="8.8932"
                    className="text-xs h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude" className="text-xs">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={inputData.longitude}
                    onChange={(e) => onInputChange('longitude', e.target.value)}
                    placeholder="76.6141"
                    className="text-xs h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="districtName" className="text-xs">District Name</Label>
                  <Input
                    id="districtName"
                    value={inputData.districtName}
                    onChange={(e) => onInputChange('districtName', e.target.value)}
                    placeholder="e.g., Kollam"
                    className="text-xs h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="population" className="text-xs">Population</Label>
                  <Input
                    id="population"
                    type="number"
                    value={inputData.population}
                    onChange={(e) => onInputChange('population', e.target.value)}
                    placeholder="2629000"
                    className="text-xs h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="groundwaterLevel" className="text-xs">Groundwater Level (m)</Label>
                  <Input
                    id="groundwaterLevel"
                    type="number"
                    step="0.1"
                    value={inputData.groundwaterLevel}
                    onChange={(e) => onInputChange('groundwaterLevel', e.target.value)}
                    placeholder="8.5"
                    className="text-xs h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="ph" className="text-xs">pH Level</Label>
                  <Input
                    id="ph"
                    type="number"
                    step="0.1"
                    value={inputData.ph}
                    onChange={(e) => onInputChange('ph', e.target.value)}
                    placeholder="7.2"
                    className="text-xs h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="tds" className="text-xs">TDS (mg/L)</Label>
                  <Input
                    id="tds"
                    type="number"
                    value={inputData.tds}
                    onChange={(e) => onInputChange('tds', e.target.value)}
                    placeholder="450"
                    className="text-xs h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="nitrate" className="text-xs">Nitrate (mg/L)</Label>
                  <Input
                    id="nitrate"
                    type="number"
                    step="0.1"
                    value={inputData.nitrate}
                    onChange={(e) => onInputChange('nitrate', e.target.value)}
                    placeholder="25"
                    className="text-xs h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="fluoride" className="text-xs">Fluoride (mg/L)</Label>
                  <Input
                    id="fluoride"
                    type="number"
                    step="0.1"
                    value={inputData.fluoride}
                    onChange={(e) => onInputChange('fluoride', e.target.value)}
                    placeholder="0.8"
                    className="text-xs h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="arsenic" className="text-xs">Arsenic (μg/L)</Label>
                  <Input
                    id="arsenic"
                    type="number"
                    step="0.1"
                    value={inputData.arsenic}
                    onChange={(e) => onInputChange('arsenic', e.target.value)}
                    placeholder="5"
                    className="text-xs h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="temperature" className="text-xs">Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={inputData.temperature}
                    onChange={(e) => onInputChange('temperature', e.target.value)}
                    placeholder="28"
                    className="text-xs h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="wellDepth" className="text-xs">Well Depth (m)</Label>
                  <Input
                    id="wellDepth"
                    type="number"
                    step="0.1"
                    value={inputData.wellDepth}
                    onChange={(e) => onInputChange('wellDepth', e.target.value)}
                    placeholder="25"
                    className="text-xs h-8"
                  />
                </div>

                {/* Groundwater Assessment Parameters */}
                <div className="mt-4 pt-2 border-t border-border">
                  <h4 className="text-xs font-medium mb-2">Groundwater Assessment Parameters</h4>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="annualDomesticIndustryDraft" className="text-xs">Annual Domestic/Industry Draft (MCM)</Label>
                      <Input
                        id="annualDomesticIndustryDraft"
                        type="number"
                        step="0.01"
                        value={inputData.annualDomesticIndustryDraft}
                        onChange={(e) => onInputChange('annualDomesticIndustryDraft', e.target.value)}
                        placeholder="45.67"
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="annualIrrigationDraft" className="text-xs">Annual Irrigation Draft (MCM)</Label>
                      <Input
                        id="annualIrrigationDraft"
                        type="number"
                        step="0.01"
                        value={inputData.annualIrrigationDraft}
                        onChange={(e) => onInputChange('annualIrrigationDraft', e.target.value)}
                        placeholder="189.23"
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="annualGroundwaterDraftTotal" className="text-xs">Annual Groundwater Draft Total (MCM)</Label>
                      <Input
                        id="annualGroundwaterDraftTotal"
                        type="number"
                        step="0.01"
                        value={inputData.annualGroundwaterDraftTotal}
                        onChange={(e) => onInputChange('annualGroundwaterDraftTotal', e.target.value)}
                        placeholder="234.9"
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="annualReplenishableGroundwaterResources" className="text-xs">Annual Replenishable Resources (MCM)</Label>
                      <Input
                        id="annualReplenishableGroundwaterResources"
                        type="number"
                        step="0.01"
                        value={inputData.annualReplenishableGroundwaterResources}
                        onChange={(e) => onInputChange('annualReplenishableGroundwaterResources', e.target.value)}
                        placeholder="234.9"
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="naturalDischargeNonMonsoon" className="text-xs">Natural Discharge Non-Monsoon (MCM)</Label>
                      <Input
                        id="naturalDischargeNonMonsoon"
                        type="number"
                        step="0.01"
                        value={inputData.naturalDischargeNonMonsoon}
                        onChange={(e) => onInputChange('naturalDischargeNonMonsoon', e.target.value)}
                        placeholder="23.49"
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="netGroundwaterAvailability" className="text-xs">Net Groundwater Availability (MCM)</Label>
                      <Input
                        id="netGroundwaterAvailability"
                        type="number"
                        step="0.01"
                        value={inputData.netGroundwaterAvailability}
                        onChange={(e) => onInputChange('netGroundwaterAvailability', e.target.value)}
                        placeholder="211.41"
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectedDemandDomesticIndustrial2025" className="text-xs">Projected Demand 2025 (MCM)</Label>
                      <Input
                        id="projectedDemandDomesticIndustrial2025"
                        type="number"
                        step="0.01"
                        value={inputData.projectedDemandDomesticIndustrial2025}
                        onChange={(e) => onInputChange('projectedDemandDomesticIndustrial2025', e.target.value)}
                        placeholder="59.33"
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="groundwaterAvailabilityFutureIrrigation" className="text-xs">Future Irrigation Availability (MCM)</Label>
                      <Input
                        id="groundwaterAvailabilityFutureIrrigation"
                        type="number"
                        step="0.01"
                        value={inputData.groundwaterAvailabilityFutureIrrigation}
                        onChange={(e) => onInputChange('groundwaterAvailabilityFutureIrrigation', e.target.value)}
                        placeholder="152.08"
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stageGroundwaterDevelopment" className="text-xs">Stage of Development (%)</Label>
                      <Input
                        id="stageGroundwaterDevelopment"
                        type="number"
                        step="0.1"
                        value={inputData.stageGroundwaterDevelopment}
                        onChange={(e) => onInputChange('stageGroundwaterDevelopment', e.target.value)}
                        placeholder="111.11"
                        className="text-xs h-8"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full text-xs h-8">
                Add Monitoring Data
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
