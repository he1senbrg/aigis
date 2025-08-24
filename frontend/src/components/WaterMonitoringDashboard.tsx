'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import jsPDF from 'jspdf'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Moon, Sun } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

// Fix for default markers in react-leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

interface WaterData {
  id: string
  location: string
  latitude: number
  longitude: number
  districtName: string
  population: number // population in the area
  groundwaterLevel: number // depth in meters
  ph: number
  tds: number // Total Dissolved Solids
  nitrate: number // mg/L
  fluoride: number // mg/L
  arsenic: number // μg/L
  temperature: number
  wellDepth: number // meters
  // Groundwater Assessment Parameters
  annualDomesticIndustryDraft: number // MCM
  annualIrrigationDraft: number // MCM
  annualGroundwaterDraftTotal: number // MCM
  annualReplenishableGroundwaterResources: number // MCM
  naturalDischargeNonMonsoon: number // MCM
  netGroundwaterAvailability: number // MCM
  projectedDemandDomesticIndustrial2025: number // MCM
  groundwaterAvailabilityFutureIrrigation: number // MCM
  stageGroundwaterDevelopment: number // percentage
  timestamp: string
}

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

const WaterMonitoringDashboard: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true) // Set dark mode as default
  
  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Set dark mode as default on mount
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  const [waterData, setWaterData] = useState<WaterData[]>([
    {
      id: '1',
      location: 'Kollam',
      latitude: 8.8932,
      longitude: 76.6141,
      districtName: 'Kollam',
      population: 385000, // population in the area
      groundwaterLevel: 15.5, // depth in meters
      ph: 6.8,
      tds: 850, // mg/L
      nitrate: 25, // mg/L
      fluoride: 0.8, // mg/L
      arsenic: 5, // μg/L
      temperature: 28.5,
      wellDepth: 45,
      annualDomesticIndustryDraft: 45.2,
      annualIrrigationDraft: 125.8,
      annualGroundwaterDraftTotal: 171.0,
      annualReplenishableGroundwaterResources: 180.5,
      naturalDischargeNonMonsoon: 12.3,
      netGroundwaterAvailability: 156.9,
      projectedDemandDomesticIndustrial2025: 52.1,
      groundwaterAvailabilityFutureIrrigation: 104.8,
      stageGroundwaterDevelopment: 94.7,
      timestamp: new Date().toISOString()
    }
  ])

  const [inputData, setInputData] = useState<WaterInputData>({
    location: '',
    latitude: '',
    longitude: '',
    districtName: '',
    population: '',
    groundwaterLevel: '',
    ph: '',
    tds: '',
    nitrate: '',
    fluoride: '',
    arsenic: '',
    temperature: '',
    wellDepth: '',
    annualDomesticIndustryDraft: '',
    annualIrrigationDraft: '',
    annualGroundwaterDraftTotal: '',
    annualReplenishableGroundwaterResources: '',
    naturalDischargeNonMonsoon: '',
    netGroundwaterAvailability: '',
    projectedDemandDomesticIndustrial2025: '',
    groundwaterAvailabilityFutureIrrigation: '',
    stageGroundwaterDevelopment: ''
  })

  const [selectedLocation, setSelectedLocation] = useState<string>('all')

  const getWaterQuality = (ph: number, tds: number, nitrate: number, fluoride: number, arsenic: number): { 
    status: string, 
    color: string, 
    riskFactors: string[] 
  } => {
    const riskFactors: string[] = []
    let riskLevel = 0

    // pH assessment (WHO standards: 6.5-8.5)
    if (ph < 6.5 || ph > 8.5) {
      riskFactors.push('pH out of safe range')
      riskLevel += 1
    }

    // TDS assessment (WHO standards: <1000 mg/L acceptable, >2000 mg/L not acceptable)
    if (tds > 2000) {
      riskFactors.push('Very high TDS - not potable')
      riskLevel += 3
    } else if (tds > 1000) {
      riskFactors.push('High TDS - poor taste')
      riskLevel += 1
    }

    // Nitrate assessment (WHO standards: <50 mg/L)
    if (nitrate > 50) {
      riskFactors.push('High nitrate - health risk')
      riskLevel += 2
    } else if (nitrate > 25) {
      riskFactors.push('Elevated nitrate levels')
      riskLevel += 1
    }

    // Fluoride assessment (WHO standards: 0.5-1.5 mg/L)
    if (fluoride > 1.5) {
      riskFactors.push('High fluoride - dental/skeletal fluorosis risk')
      riskLevel += 2
    } else if (fluoride < 0.5) {
      riskFactors.push('Low fluoride - dental caries risk')
      riskLevel += 1
    }

    // Arsenic assessment (WHO standards: <10 μg/L)
    if (arsenic > 10) {
      riskFactors.push('High arsenic - cancer risk')
      riskLevel += 3
    } else if (arsenic > 5) {
      riskFactors.push('Elevated arsenic levels')
      riskLevel += 1
    }

    // Overall quality assessment
    if (riskLevel === 0) {
      return { status: 'Excellent', color: 'bg-green-500', riskFactors }
    } else if (riskLevel <= 2) {
      return { status: 'Good', color: 'bg-blue-500', riskFactors }
    } else if (riskLevel <= 4) {
      return { status: 'Fair', color: 'bg-yellow-500', riskFactors }
    } else {
      return { status: 'Poor', color: 'bg-red-500', riskFactors }
    }
  }

  // Risk assessment for different use cases
  const getRiskAssessmentForUseCase = (data: WaterData, useCase: 'residential' | 'industrial' | 'agricultural'): {
    riskLevel: number,
    riskFactors: string[],
    suitability: string,
    color: string,
    recommendations: string[]
  } => {
    const riskFactors: string[] = []
    const recommendations: string[] = []
    let riskLevel = 0

    // Common water quality risks
    if (data.ph < 6.5 || data.ph > 8.5) {
      riskFactors.push('pH out of safe range')
      riskLevel += 1
    }

    if (data.arsenic > 10) {
      riskFactors.push('High arsenic - health hazard')
      riskLevel += 3
    }

    // Use case specific assessments
    switch (useCase) {
      case 'residential':
        if (data.tds > 500) {
          riskFactors.push('High TDS - poor taste for drinking')
          riskLevel += 1
        }
        if (data.nitrate > 45) {
          riskFactors.push('High nitrate - unsafe for infants')
          riskLevel += 2
        }
        if (data.fluoride > 1.5) {
          riskFactors.push('High fluoride - dental fluorosis risk')
          riskLevel += 2
        }
        if (data.population > 100000 && data.stageGroundwaterDevelopment > 85) {
          riskFactors.push('High population density with over-exploitation')
          riskLevel += 1
        }
        if (riskLevel === 0) recommendations.push('Suitable for residential use')
        else if (riskLevel <= 2) recommendations.push('Suitable with basic treatment')
        else recommendations.push('Requires advanced treatment for drinking')
        break

      case 'industrial':
        if (data.tds > 1000) {
          riskFactors.push('High TDS - may cause scaling in equipment')
          riskLevel += 1
        }
        if (data.groundwaterLevel > 30) {
          riskFactors.push('Deep groundwater - high pumping costs')
          riskLevel += 1
        }
        if (data.stageGroundwaterDevelopment > 90) {
          riskFactors.push('Critical groundwater depletion')
          riskLevel += 2
        }
        if (riskLevel === 0) recommendations.push('Suitable for industrial use')
        else if (riskLevel <= 2) recommendations.push('Suitable with water treatment')
        else recommendations.push('Consider alternative water sources')
        break

      case 'agricultural':
        if (data.tds > 2000) {
          riskFactors.push('High TDS - soil salinity risk')
          riskLevel += 2
        }
        if (data.nitrate > 10) {
          riskFactors.push('High nitrate - crop damage risk')
          riskLevel += 1
        }
        if (data.stageGroundwaterDevelopment > 85) {
          riskFactors.push('Groundwater over-exploitation')
          riskLevel += 2
        }
        if (data.annualIrrigationDraft > data.groundwaterAvailabilityFutureIrrigation) {
          riskFactors.push('Current demand exceeds sustainable supply')
          riskLevel += 3
        }
        if (riskLevel === 0) recommendations.push('Excellent for agriculture')
        else if (riskLevel <= 2) recommendations.push('Suitable with proper irrigation management')
        else recommendations.push('High risk - implement water conservation')
        break
    }

    // Overall suitability
    let suitability = ''
    let color = ''
    if (riskLevel === 0) {
      suitability = 'Excellent'
      color = 'bg-green-500'
    } else if (riskLevel <= 2) {
      suitability = 'Good'
      color = 'bg-blue-500'
    } else if (riskLevel <= 4) {
      suitability = 'Moderate Risk'
      color = 'bg-yellow-500'
    } else {
      suitability = 'High Risk'
      color = 'bg-red-500'
    }

    return { riskLevel, riskFactors, suitability, color, recommendations }
  }

  const handleInputChange = (field: keyof WaterInputData, value: string) => {
    setInputData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputData.location || !inputData.latitude || !inputData.longitude || 
        !inputData.districtName || !inputData.groundwaterLevel || !inputData.ph || 
        !inputData.tds || !inputData.nitrate || !inputData.fluoride || !inputData.arsenic ||
        !inputData.temperature || !inputData.wellDepth || !inputData.annualDomesticIndustryDraft ||
        !inputData.annualIrrigationDraft || !inputData.annualGroundwaterDraftTotal ||
        !inputData.annualReplenishableGroundwaterResources || !inputData.naturalDischargeNonMonsoon ||
        !inputData.netGroundwaterAvailability || !inputData.projectedDemandDomesticIndustrial2025 ||
        !inputData.groundwaterAvailabilityFutureIrrigation || !inputData.stageGroundwaterDevelopment) {
      alert('Please fill in all fields')
      return
    }

    const newData: WaterData = {
      id: Date.now().toString(),
      location: inputData.location,
      latitude: parseFloat(inputData.latitude),
      longitude: parseFloat(inputData.longitude),
      districtName: inputData.districtName,
      population: parseFloat(inputData.population),
      groundwaterLevel: parseFloat(inputData.groundwaterLevel),
      ph: parseFloat(inputData.ph),
      tds: parseFloat(inputData.tds),
      nitrate: parseFloat(inputData.nitrate),
      fluoride: parseFloat(inputData.fluoride),
      arsenic: parseFloat(inputData.arsenic),
      temperature: parseFloat(inputData.temperature),
      wellDepth: parseFloat(inputData.wellDepth),
      annualDomesticIndustryDraft: parseFloat(inputData.annualDomesticIndustryDraft),
      annualIrrigationDraft: parseFloat(inputData.annualIrrigationDraft),
      annualGroundwaterDraftTotal: parseFloat(inputData.annualGroundwaterDraftTotal),
      annualReplenishableGroundwaterResources: parseFloat(inputData.annualReplenishableGroundwaterResources),
      naturalDischargeNonMonsoon: parseFloat(inputData.naturalDischargeNonMonsoon),
      netGroundwaterAvailability: parseFloat(inputData.netGroundwaterAvailability),
      projectedDemandDomesticIndustrial2025: parseFloat(inputData.projectedDemandDomesticIndustrial2025),
      groundwaterAvailabilityFutureIrrigation: parseFloat(inputData.groundwaterAvailabilityFutureIrrigation),
      stageGroundwaterDevelopment: parseFloat(inputData.stageGroundwaterDevelopment),
      timestamp: new Date().toISOString()
    }

    setWaterData(prev => [...prev, newData])
    setInputData({
      location: '',
      latitude: '',
      longitude: '',
      districtName: '',
      population: '',
      groundwaterLevel: '',
      ph: '',
      tds: '',
      nitrate: '',
      fluoride: '',
      arsenic: '',
      temperature: '',
      wellDepth: '',
      annualDomesticIndustryDraft: '',
      annualIrrigationDraft: '',
      annualGroundwaterDraftTotal: '',
      annualReplenishableGroundwaterResources: '',
      naturalDischargeNonMonsoon: '',
      netGroundwaterAvailability: '',
      projectedDemandDomesticIndustrial2025: '',
      groundwaterAvailabilityFutureIrrigation: '',
      stageGroundwaterDevelopment: ''
    })
  }

  const generateReport = async () => {
    const pdf = new jsPDF()
    const filteredData = selectedLocation === 'all' 
      ? waterData 
      : waterData.filter(data => data.location === selectedLocation)

    // Add title
    pdf.setFontSize(20)
    pdf.text('Water Monitoring Report', 20, 30)
    
    // Add date
    pdf.setFontSize(12)
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45)
    
    // Add summary
    pdf.setFontSize(14)
    pdf.text('Groundwater Monitoring Report - Summary:', 20, 65)
    pdf.setFontSize(10)
    pdf.text(`Total monitoring wells: ${filteredData.length}`, 20, 75)
    
    const avgGroundwaterLevel = filteredData.reduce((sum, data) => sum + data.groundwaterLevel, 0) / filteredData.length
    const avgPH = filteredData.reduce((sum, data) => sum + data.ph, 0) / filteredData.length
    const avgTDS = filteredData.reduce((sum, data) => sum + data.tds, 0) / filteredData.length
    
    pdf.text(`Average Groundwater Depth: ${avgGroundwaterLevel.toFixed(2)}m`, 20, 85)
    pdf.text(`Average pH: ${avgPH.toFixed(2)}`, 20, 95)
    pdf.text(`Average TDS: ${avgTDS.toFixed(0)} mg/L`, 20, 105)
    
    // Add table data
    let yPosition = 120
    pdf.setFontSize(12)
    pdf.text('Detailed Well Analysis:', 20, yPosition)
    yPosition += 15
    
    filteredData.forEach((data) => {
      if (yPosition > 250) {
        pdf.addPage()
        yPosition = 20
      }
      
      const quality = getWaterQuality(data.ph, data.tds, data.nitrate, data.fluoride, data.arsenic)
      
      pdf.setFontSize(9)
      pdf.text(`${data.location}`, 20, yPosition)
      pdf.text(`Depth: ${data.groundwaterLevel}m`, 20, yPosition + 8)
      pdf.text(`pH: ${data.ph}`, 20, yPosition + 16)
      pdf.text(`TDS: ${data.tds} mg/L`, 80, yPosition + 8)
      pdf.text(`Nitrate: ${data.nitrate} mg/L`, 80, yPosition + 16)
      pdf.text(`Fluoride: ${data.fluoride} mg/L`, 140, yPosition + 8)
      pdf.text(`Arsenic: ${data.arsenic} μg/L`, 140, yPosition + 16)
      pdf.text(`Quality: ${quality.status}`, 140, yPosition + 8)
      
      yPosition += 30
    })

    pdf.save('water-monitoring-report.pdf')
  }

  const filteredData = selectedLocation === 'all' 
    ? waterData 
    : waterData.filter(data => data.location === selectedLocation)

  // Get the latest data entry for risk analysis
  const currentData = waterData.length > 0 ? waterData[waterData.length - 1] : null

  // Create risk analysis data for different use cases
  const riskAnalysisData = currentData ? [
    {
      useCase: 'Residential',
      ...getRiskAssessmentForUseCase(currentData, 'residential')
    },
    {
      useCase: 'Industrial',
      ...getRiskAssessmentForUseCase(currentData, 'industrial')
    },
    {
      useCase: 'Agricultural',
      ...getRiskAssessmentForUseCase(currentData, 'agricultural')
    }
  ] : []

  // Water quality parameters chart data
  const waterQualityData = currentData ? [
    { parameter: 'pH', value: currentData.ph, safeRange: '6.5-8.5', status: currentData.ph >= 6.5 && currentData.ph <= 8.5 ? 'Safe' : 'Risk' },
    { parameter: 'TDS', value: currentData.tds, safeRange: '<1000', status: currentData.tds < 1000 ? 'Safe' : 'Risk' },
    { parameter: 'Nitrate', value: currentData.nitrate, safeRange: '<45', status: currentData.nitrate < 45 ? 'Safe' : 'Risk' },
    { parameter: 'Fluoride', value: currentData.fluoride, safeRange: '0.5-1.5', status: currentData.fluoride >= 0.5 && currentData.fluoride <= 1.5 ? 'Safe' : 'Risk' },
    { parameter: 'Arsenic', value: currentData.arsenic, safeRange: '<10', status: currentData.arsenic < 10 ? 'Safe' : 'Risk' }
  ] : []

  return (
    <div className="min-h-screen transition-colors duration-300 bg-background">
      <div className="flex h-screen">
        {/* Left Sidebar - Input Form (18% width) */}
        <div className="w-[18%] border-r border-border bg-card/50 overflow-y-auto scrollbar-thin">
          <div className="p-4 space-y-4">
            {/* Header in Sidebar */}
            <div className="text-center relative">
              <h1 className="text-xl font-bold text-foreground">AIGIS</h1>
              <p className="mt-1 text-xs text-muted-foreground">Water Monitoring</p>
              {/* Dark Mode Toggle */}
              <div className="absolute top-0 right-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
                </Button>
              </div>
            </div>

            {/* Input Form */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Add New Water Monitoring Data</CardTitle>
                <CardDescription className="text-xs">Enter water monitoring data for a new location</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="location" className="text-xs">Location Name</Label>
                      <Input
                        id="location"
                        value={inputData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
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
                        onChange={(e) => handleInputChange('latitude', e.target.value)}
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
                        onChange={(e) => handleInputChange('longitude', e.target.value)}
                        placeholder="76.6141"
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="districtName" className="text-xs">District</Label>
                      <Input
                        id="districtName"
                        value={inputData.districtName}
                        onChange={(e) => handleInputChange('districtName', e.target.value)}
                        placeholder="Kollam"
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="population" className="text-xs">Population</Label>
                      <Input
                        id="population"
                        type="number"
                        value={inputData.population}
                        onChange={(e) => handleInputChange('population', e.target.value)}
                        placeholder="385000"
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="groundwaterLevel" className="text-xs">Depth (m)</Label>
                      <Input
                        id="groundwaterLevel"
                        type="number"
                        step="0.1"
                        value={inputData.groundwaterLevel}
                        onChange={(e) => handleInputChange('groundwaterLevel', e.target.value)}
                        placeholder="0-100"
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
                        onChange={(e) => handleInputChange('ph', e.target.value)}
                        placeholder="0-14"
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tds" className="text-xs">TDS (mg/L)</Label>
                      <Input
                        id="tds"
                        type="number"
                        step="0.1"
                        value={inputData.tds}
                        onChange={(e) => handleInputChange('tds', e.target.value)}
                        placeholder="0-2000"
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
                        onChange={(e) => handleInputChange('nitrate', e.target.value)}
                        placeholder="0-50"
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
                        onChange={(e) => handleInputChange('fluoride', e.target.value)}
                        placeholder="0-5"
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
                        onChange={(e) => handleInputChange('temperature', e.target.value)}
                        placeholder="0-40"
                        className="text-xs h-8"
                      />
                    </div>
                    
                    {/* Groundwater Assessment Parameters */}
                    <div className="pt-2 border-t border-border">
                      <Label className="text-xs font-semibold text-muted-foreground">Groundwater Assessment Parameters</Label>
                    </div>
                    
                    <div>
                      <Label htmlFor="wellDepth" className="text-xs">Well Depth (m)</Label>
                      <Input
                        id="wellDepth"
                        type="number"
                        step="0.1"
                        value={inputData.wellDepth}
                        onChange={(e) => handleInputChange('wellDepth', e.target.value)}
                        placeholder="0-200"
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
                        onChange={(e) => handleInputChange('arsenic', e.target.value)}
                        placeholder="0-50"
                        className="text-xs h-8"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="annualDomesticIndustryDraft" className="text-xs">Annual Domestic & Industry Draft (MCM)</Label>
                      <Input
                        id="annualDomesticIndustryDraft"
                        type="number"
                        step="0.1"
                        value={inputData.annualDomesticIndustryDraft}
                        onChange={(e) => handleInputChange('annualDomesticIndustryDraft', e.target.value)}
                        placeholder="0-100"
                        className="text-xs h-8"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="annualIrrigationDraft" className="text-xs">Annual Irrigation Draft (MCM)</Label>
                      <Input
                        id="annualIrrigationDraft"
                        type="number"
                        step="0.1"
                        value={inputData.annualIrrigationDraft}
                        onChange={(e) => handleInputChange('annualIrrigationDraft', e.target.value)}
                        placeholder="0-500"
                        className="text-xs h-8"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="annualGroundwaterDraftTotal" className="text-xs">Annual Groundwater Draft Total (MCM)</Label>
                      <Input
                        id="annualGroundwaterDraftTotal"
                        type="number"
                        step="0.1"
                        value={inputData.annualGroundwaterDraftTotal}
                        onChange={(e) => handleInputChange('annualGroundwaterDraftTotal', e.target.value)}
                        placeholder="0-600"
                        className="text-xs h-8"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="annualReplenishableGroundwaterResources" className="text-xs">Annual Replenishable Groundwater Resources (MCM)</Label>
                      <Input
                        id="annualReplenishableGroundwaterResources"
                        type="number"
                        step="0.1"
                        value={inputData.annualReplenishableGroundwaterResources}
                        onChange={(e) => handleInputChange('annualReplenishableGroundwaterResources', e.target.value)}
                        placeholder="0-800"
                        className="text-xs h-8"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="naturalDischargeNonMonsoon" className="text-xs">Natural Discharge During Non-Monsoon (MCM)</Label>
                      <Input
                        id="naturalDischargeNonMonsoon"
                        type="number"
                        step="0.1"
                        value={inputData.naturalDischargeNonMonsoon}
                        onChange={(e) => handleInputChange('naturalDischargeNonMonsoon', e.target.value)}
                        placeholder="0-50"
                        className="text-xs h-8"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="netGroundwaterAvailability" className="text-xs">Net Groundwater Availability (MCM)</Label>
                      <Input
                        id="netGroundwaterAvailability"
                        type="number"
                        step="0.1"
                        value={inputData.netGroundwaterAvailability}
                        onChange={(e) => handleInputChange('netGroundwaterAvailability', e.target.value)}
                        placeholder="0-700"
                        className="text-xs h-8"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="projectedDemandDomesticIndustrial2025" className="text-xs">Projected Demand Domestic & Industrial 2025 (MCM)</Label>
                      <Input
                        id="projectedDemandDomesticIndustrial2025"
                        type="number"
                        step="0.1"
                        value={inputData.projectedDemandDomesticIndustrial2025}
                        onChange={(e) => handleInputChange('projectedDemandDomesticIndustrial2025', e.target.value)}
                        placeholder="0-150"
                        className="text-xs h-8"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="groundwaterAvailabilityFutureIrrigation" className="text-xs">Groundwater Availability Future Irrigation (MCM)</Label>
                      <Input
                        id="groundwaterAvailabilityFutureIrrigation"
                        type="number"
                        step="0.1"
                        value={inputData.groundwaterAvailabilityFutureIrrigation}
                        onChange={(e) => handleInputChange('groundwaterAvailabilityFutureIrrigation', e.target.value)}
                        placeholder="0-400"
                        className="text-xs h-8"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="stageGroundwaterDevelopment" className="text-xs">Stage of Groundwater Development (%)</Label>
                      <Input
                        id="stageGroundwaterDevelopment"
                        type="number"
                        step="0.1"
                        value={inputData.stageGroundwaterDevelopment}
                        onChange={(e) => handleInputChange('stageGroundwaterDevelopment', e.target.value)}
                        placeholder="0-100"
                        className="text-xs h-8"
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full text-xs h-8">
                    Analyze Risk Factor
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Area - Results (82% width) */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-6 space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="locationFilter">Filter by Location:</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {waterData.map(data => (
                      <SelectItem key={data.id} value={data.location}>
                        {data.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={generateReport} variant="outline">
                Download Report
              </Button>
            </div>

        {/* Map and Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map */}
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Locations</CardTitle>
              <CardDescription>Interactive map showing water monitoring stations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full rounded-lg overflow-hidden">
                <MapContainer
                  center={[8.8932, 76.6141]}
                  zoom={11}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url={darkMode 
                      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" 
                      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                    attribution={darkMode
                      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
                  />
                  {filteredData.map(data => {
                    const quality = getWaterQuality(data.ph, data.tds, data.nitrate, data.fluoride, data.arsenic)
                    return (
                      <Marker
                        key={data.id}
                        position={[data.latitude, data.longitude]}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-semibold">{data.location}</h3>
                            <p>Groundwater Depth: {data.groundwaterLevel}m</p>
                            <p>pH: {data.ph}</p>
                            <p>TDS: {data.tds} mg/L</p>
                            <p>Quality: <Badge className={quality.color}>{quality.status}</Badge></p>
                            {quality.riskFactors.length > 0 && (
                              <p className="text-xs text-red-600 mt-1">
                                Risks: {quality.riskFactors.join(', ')}
                              </p>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    )
                  })}
                </MapContainer>
              </div>
            </CardContent>
          </Card>

          {/* Risk Analysis Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment by Use Case</CardTitle>
              <CardDescription>Risk level comparison for different applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskAnalysisData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis 
                      dataKey="useCase" 
                      tick={{ fill: darkMode ? '#d1d5db' : '#374151' }}
                    />
                    <YAxis tick={{ fill: darkMode ? '#d1d5db' : '#374151' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                        color: darkMode ? '#f3f4f6' : '#111827'
                      }}
                    />
                    <Bar dataKey="riskLevel" fill={darkMode ? '#ef4444' : '#dc2626'} name="Risk Level" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Water Quality Parameters Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Water Quality Parameter Analysis</CardTitle>
            <CardDescription>Current values vs. safe ranges for key parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterQualityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis 
                    dataKey="parameter" 
                    tick={{ fill: darkMode ? '#d1d5db' : '#374151' }}
                  />
                  <YAxis tick={{ fill: darkMode ? '#d1d5db' : '#374151' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                      border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                      color: darkMode ? '#f3f4f6' : '#111827'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill={darkMode ? '#60a5fa' : '#3b82f6'}
                    name="Current Value" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Monitoring Data</CardTitle>
            <CardDescription>Detailed water monitoring information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Depth (m)</TableHead>
                    <TableHead>pH</TableHead>
                    <TableHead>TDS (mg/L)</TableHead>
                    <TableHead>Nitrate (mg/L)</TableHead>
                    <TableHead>Fluoride (mg/L)</TableHead>
                    <TableHead>Arsenic (μg/L)</TableHead>
                    <TableHead>Quality</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map(data => {
                    const quality = getWaterQuality(data.ph, data.tds, data.nitrate, data.fluoride, data.arsenic)
                    return (
                      <TableRow key={data.id}>
                        <TableCell className="font-medium">{data.location}</TableCell>
                        <TableCell>{data.groundwaterLevel}m</TableCell>
                        <TableCell>{data.ph}</TableCell>
                        <TableCell>{data.tds}</TableCell>
                        <TableCell>{data.nitrate}</TableCell>
                        <TableCell>{data.fluoride}</TableCell>
                        <TableCell>{data.arsenic}</TableCell>
                        <TableCell>
                          <Badge className={quality.color}>{quality.status}</Badge>
                        </TableCell>
                        <TableCell>{new Date(data.timestamp).toLocaleString()}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaterMonitoringDashboard
