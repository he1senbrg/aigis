'use client'

import { InputSidebar } from '@/components/InputSidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  population: number
  groundwaterLevel: number
  ph: number
  tds: number
  nitrate: number
  fluoride: number
  arsenic: number
  temperature: number
  wellDepth: number
  annualDomesticIndustryDraft: number
  annualIrrigationDraft: number
  annualGroundwaterDraftTotal: number
  annualReplenishableGroundwaterResources: number
  naturalDischargeNonMonsoon: number
  netGroundwaterAvailability: number
  projectedDemandDomesticIndustrial2025: number
  groundwaterAvailabilityFutureIrrigation: number
  stageGroundwaterDevelopment: number
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
  const [darkMode, setDarkMode] = useState(true)
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

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
      population: 2629000,
      groundwaterLevel: 8.5,
      ph: 7.2,
      tds: 450,
      nitrate: 25,
      fluoride: 0.8,
      arsenic: 5,
      temperature: 28,
      wellDepth: 25,
      annualDomesticIndustryDraft: 45.67,
      annualIrrigationDraft: 189.23,
      annualGroundwaterDraftTotal: 234.9,
      annualReplenishableGroundwaterResources: 234.9,
      naturalDischargeNonMonsoon: 23.49,
      netGroundwaterAvailability: 211.41,
      projectedDemandDomesticIndustrial2025: 59.33,
      groundwaterAvailabilityFutureIrrigation: 152.08,
      stageGroundwaterDevelopment: 111.11,
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

  const handleInputChange = (field: keyof WaterInputData, value: string) => {
    setInputData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputData.location || !inputData.latitude || !inputData.longitude) {
      alert('Please fill in at least Location, Latitude, and Longitude')
      return
    }

    const newData: WaterData = {
      id: (waterData.length + 1).toString(),
      location: inputData.location,
      latitude: parseFloat(inputData.latitude) || 0,
      longitude: parseFloat(inputData.longitude) || 0,
      districtName: inputData.districtName || inputData.location,
      population: parseInt(inputData.population) || 0,
      groundwaterLevel: parseFloat(inputData.groundwaterLevel) || 0,
      ph: parseFloat(inputData.ph) || 7,
      tds: parseFloat(inputData.tds) || 0,
      nitrate: parseFloat(inputData.nitrate) || 0,
      fluoride: parseFloat(inputData.fluoride) || 0,
      arsenic: parseFloat(inputData.arsenic) || 0,
      temperature: parseFloat(inputData.temperature) || 25,
      wellDepth: parseFloat(inputData.wellDepth) || 0,
      annualDomesticIndustryDraft: parseFloat(inputData.annualDomesticIndustryDraft) || 0,
      annualIrrigationDraft: parseFloat(inputData.annualIrrigationDraft) || 0,
      annualGroundwaterDraftTotal: parseFloat(inputData.annualGroundwaterDraftTotal) || 0,
      annualReplenishableGroundwaterResources: parseFloat(inputData.annualReplenishableGroundwaterResources) || 0,
      naturalDischargeNonMonsoon: parseFloat(inputData.naturalDischargeNonMonsoon) || 0,
      netGroundwaterAvailability: parseFloat(inputData.netGroundwaterAvailability) || 0,
      projectedDemandDomesticIndustrial2025: parseFloat(inputData.projectedDemandDomesticIndustrial2025) || 0,
      groundwaterAvailabilityFutureIrrigation: parseFloat(inputData.groundwaterAvailabilityFutureIrrigation) || 0,
      stageGroundwaterDevelopment: parseFloat(inputData.stageGroundwaterDevelopment) || 0,
      timestamp: new Date().toISOString()
    }

    setWaterData(prev => [...prev, newData])
    
    // Reset form
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

  const getWaterQuality = (ph: number, tds: number, nitrate: number, fluoride: number, arsenic: number) => {
    let riskLevel = 0
    const riskFactors: string[] = []

    if (ph < 6.5 || ph > 8.5) {
      riskLevel += 1
      riskFactors.push('pH out of range')
    }

    if (tds > 500) {
      riskLevel += 1
      riskFactors.push('High TDS')
    } else if (tds > 1000) {
      riskLevel += 2
      riskFactors.push('Very high TDS')
    }

    if (nitrate > 10) {
      riskLevel += 1
      riskFactors.push('Elevated nitrate')
    } else if (nitrate > 25) {
      riskLevel += 2
      riskFactors.push('High nitrate')
    }

    if (fluoride > 1.5) {
      riskLevel += 1
      riskFactors.push('High fluoride')
    } else if (fluoride < 0.5) {
      riskLevel += 1
      riskFactors.push('Low fluoride')
    }

    if (arsenic > 3) {
      riskLevel += 1
      riskFactors.push('Elevated arsenic')
    } else if (arsenic > 5) {
      riskLevel += 2
      riskFactors.push('High arsenic')
    }

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

  const generateReport = () => {
    const doc = new jsPDF()
    const pageHeight = doc.internal.pageSize.height
    let yPosition = 20

    // Header
    doc.setFontSize(18)
    doc.text('Water Monitoring Report', 20, yPosition)
    yPosition += 20

    doc.setFontSize(12)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition)
    yPosition += 20

    // Summary
    doc.setFontSize(14)
    doc.text('Summary:', 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    waterData.forEach((data, index) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage()
        yPosition = 20
      }

      const quality = getWaterQuality(data.ph, data.tds, data.nitrate, data.fluoride, data.arsenic)
      doc.text(`${index + 1}. ${data.location} - Quality: ${quality.status}`, 20, yPosition)
      yPosition += 8
      doc.text(`   pH: ${data.ph}, TDS: ${data.tds}, Nitrate: ${data.nitrate}`, 25, yPosition)
      yPosition += 8
      doc.text(`   Fluoride: ${data.fluoride}, Arsenic: ${data.arsenic}`, 25, yPosition)
      yPosition += 12
    })

    doc.save('water-monitoring-report.pdf')
  }

  const chartData = waterData.map(data => ({
    location: data.location,
    ph: data.ph,
    tds: data.tds / 100, // Scale down for better visualization
    nitrate: data.nitrate,
    fluoride: data.fluoride * 10, // Scale up for better visualization
    arsenic: data.arsenic
  }))

  return (
    <div className="flex h-screen">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">AIGIS Water Monitoring</h1>
              <p className="text-muted-foreground">Real-time water quality monitoring and analysis</p>
            </div>
            {/* Dark Mode Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-end">
            <Button onClick={generateReport} variant="outline">
              Generate Report
            </Button>
          </div>

          {/* Stats Cards */}
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
                <CardTitle className="text-sm font-medium">Average pH</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {waterData.length > 0 ? (waterData.reduce((sum, data) => sum + data.ph, 0) / waterData.length).toFixed(1) : '0'}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average TDS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {waterData.length > 0 ? Math.round(waterData.reduce((sum, data) => sum + data.tds, 0) / waterData.length) : '0'}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Quality Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {waterData.filter(data => {
                    const quality = getWaterQuality(data.ph, data.tds, data.nitrate, data.fluoride, data.arsenic)
                    return quality.status === 'Fair' || quality.status === 'Poor'
                  }).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Water Quality Metrics</CardTitle>
              <CardDescription>Comparison of key water quality parameters across locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="ph" fill="#8884d8" name="pH" />
                    <Bar dataKey="tds" fill="#82ca9d" name="TDS (scaled)" />
                    <Bar dataKey="nitrate" fill="#ffc658" name="Nitrate" />
                    <Bar dataKey="fluoride" fill="#ff7300" name="Fluoride (scaled)" />
                    <Bar dataKey="arsenic" fill="#8dd1e1" name="Arsenic" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Map */}
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Locations</CardTitle>
              <CardDescription>Geographic distribution of water monitoring points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full rounded-lg overflow-hidden">
                <MapContainer
                  center={[10.8505, 76.2711]}
                  zoom={7}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {waterData.map(data => {
                    const quality = getWaterQuality(data.ph, data.tds, data.nitrate, data.fluoride, data.arsenic)
                    return (
                      <Marker
                        key={data.id}
                        position={[data.latitude, data.longitude]}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-bold">{data.location}</h3>
                            <p>Quality: <span className={`px-2 py-1 rounded text-white text-xs ${quality.color}`}>{quality.status}</span></p>
                            <p>pH: {data.ph}</p>
                            <p>TDS: {data.tds} mg/L</p>
                            <p>Population: {data.population.toLocaleString()}</p>
                          </div>
                        </Popup>
                      </Marker>
                    )
                  })}
                </MapContainer>
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
                    {waterData.map(data => {
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

      {/* Right Sidebar - Input Form */}
      <InputSidebar
        inputData={inputData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        className="w-[22%] border-l border-border bg-card/50 overflow-y-auto scrollbar-thin"
      />
    </div>
  )
}

export default WaterMonitoringDashboard
