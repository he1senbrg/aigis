'use client'

import { InputSidebar } from '@/components/InputSidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import jsPDF from 'jspdf'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Moon, Sun } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

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

const indianLanguages = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'हिन्दी (Hindi)' },
  { value: 'bengali', label: 'বাংলা (Bengali)' },
  { value: 'telugu', label: 'తెలుగు (Telugu)' },
  { value: 'marathi', label: 'मराठी (Marathi)' },
  { value: 'tamil', label: 'தமிழ் (Tamil)' },
  { value: 'gujarati', label: 'ગુજરાતી (Gujarati)' },
  { value: 'urdu', label: 'اردو (Urdu)' },
  { value: 'kannada', label: 'ಕನ್ನಡ (Kannada)' },
  { value: 'odia', label: 'ଓଡ଼ିଆ (Odia)' },
  { value: 'punjabi', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { value: 'malayalam', label: 'മലയാളം (Malayalam)' },
  { value: 'assamese', label: 'অসমীয়া (Assamese)' },
  { value: 'maithili', label: 'मैथिली (Maithili)' },
  { value: 'santali', label: 'ᱥᱟᱱᱛᱟᱲᱤ (Santali)' },
  { value: 'kashmiri', label: 'कॉशुर (Kashmiri)' },
  { value: 'nepali', label: 'नेपाली (Nepali)' },
  { value: 'konkani', label: 'कोंकणी (Konkani)' },
  { value: 'sindhi', label: 'सिन्धी (Sindhi)' },
  { value: 'dogri', label: 'डोगरी (Dogri)' },
  { value: 'manipuri', label: 'মৈতৈলোন্ (Manipuri)' },
  { value: 'bodo', label: 'बड़ो (Bodo)' },
  { value: 'sanskrit', label: 'संस्कृतम् (Sanskrit)' }
]

const WaterMonitoringDashboard: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true)
  const [reportLanguage, setReportLanguage] = useState('english')
  
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

  const handleCsvUpload = (csvData: any[]) => {
    const newWaterData: WaterData[] = csvData.map((row, index) => ({
      id: (waterData.length + index + 1).toString(),
      location: row.location || '',
      latitude: parseFloat(row.latitude) || 0,
      longitude: parseFloat(row.longitude) || 0,
      districtName: row.districtName || row.location || '',
      population: parseInt(row.population) || 0,
      groundwaterLevel: parseFloat(row.groundwaterLevel) || 0,
      ph: parseFloat(row.ph) || 7,
      tds: parseFloat(row.tds) || 0,
      nitrate: parseFloat(row.nitrate) || 0,
      fluoride: parseFloat(row.fluoride) || 0,
      arsenic: parseFloat(row.arsenic) || 0,
      temperature: parseFloat(row.temperature) || 25,
      wellDepth: parseFloat(row.wellDepth) || 0,
      annualDomesticIndustryDraft: parseFloat(row.annualDomesticIndustryDraft) || 0,
      annualIrrigationDraft: parseFloat(row.annualIrrigationDraft) || 0,
      annualGroundwaterDraftTotal: parseFloat(row.annualGroundwaterDraftTotal) || 0,
      annualReplenishableGroundwaterResources: parseFloat(row.annualReplenishableGroundwaterResources) || 0,
      naturalDischargeNonMonsoon: parseFloat(row.naturalDischargeNonMonsoon) || 0,
      netGroundwaterAvailability: parseFloat(row.netGroundwaterAvailability) || 0,
      projectedDemandDomesticIndustrial2025: parseFloat(row.projectedDemandDomesticIndustrial2025) || 0,
      groundwaterAvailabilityFutureIrrigation: parseFloat(row.groundwaterAvailabilityFutureIrrigation) || 0,
      stageGroundwaterDevelopment: parseFloat(row.stageGroundwaterDevelopment) || 0,
      timestamp: new Date().toISOString()
    }))

    setWaterData(prev => [...prev, ...newWaterData])
    alert(`Successfully imported ${newWaterData.length} records from CSV`)
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

    // Get selected language info
    const selectedLanguage = indianLanguages.find(lang => lang.value === reportLanguage)
    const languageLabel = selectedLanguage?.label || 'English'

    // Header
    doc.setFontSize(18)
    doc.text('Water Monitoring Report', 20, yPosition)
    yPosition += 10
    
    doc.setFontSize(10)
    doc.text(`Language: ${languageLabel}`, 20, yPosition)
    yPosition += 15

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

    // Add language note at the bottom
    if (reportLanguage !== 'english') {
      doc.setFontSize(8)
      doc.text(`Note: This report was generated for ${languageLabel}`, 20, pageHeight - 10)
    }

    doc.save(`water-monitoring-report-${reportLanguage}.pdf`)
  }

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
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-end relative z-10">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
                  <label htmlFor="report-language" className="text-sm font-medium text-foreground whitespace-nowrap">
                    Report Language:
                  </label>
                  <Select value={reportLanguage} onValueChange={setReportLanguage}>
                    <SelectTrigger className="w-full sm:w-48" id="report-language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      {indianLanguages.map((language) => (
                        <SelectItem key={language.value} value={language.value}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={generateReport} variant="outline" className="text-sm">
                  Generate Report
                </Button>
              </div>
            </div>          {/* GW Resource Level Section */}
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
                  <div className="text-2xl font-bold">
                    {waterData.length > 0 ? (waterData.reduce((sum, data) => sum + data.groundwaterLevel, 0) / waterData.length).toFixed(1) : '0'}m
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg Net Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {waterData.length > 0 ? (waterData.reduce((sum, data) => sum + data.netGroundwaterAvailability, 0) / waterData.length).toFixed(1) : '0'} MCM
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg Development Stage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {waterData.length > 0 ? (waterData.reduce((sum, data) => sum + data.stageGroundwaterDevelopment, 0) / waterData.length).toFixed(1) : '0'}%
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* GW Quality Section */}
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
                    {waterData.length > 0 ? Math.round(waterData.reduce((sum, data) => sum + data.tds, 0) / waterData.length) : '0'} mg/L
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg Nitrate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {waterData.length > 0 ? (waterData.reduce((sum, data) => sum + data.nitrate, 0) / waterData.length).toFixed(1) : '0'} mg/L
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
          </div>

          {/* Map */}
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Location</CardTitle>
              <CardDescription>Geographic distribution of water monitoring points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full rounded-lg overflow-hidden">
                <MapContainer
                  center={[10.8505, 76.2711]}
                  zoom={7}
                  style={{ height: '100%', width: '100%' }}
                  attributionControl={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution=""
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
        onCsvUpload={handleCsvUpload}
        className="w-[22%] border-l border-border bg-card/50 overflow-y-auto scrollbar-thin"
      />
    </div>
  )
}

export default WaterMonitoringDashboard
