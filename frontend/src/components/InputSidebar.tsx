'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Upload, X, Plus } from 'lucide-react'
import React, { useRef, useState } from 'react'

interface WaterInputData {
  location: string
  latitude: string
  longitude: string
  districtName: string
  population: string
  groundwaterLevel: string
  ph: string
  ec: string // Electrical Conductivity
  tds: string
  th: string // Total Hardness
  ca: string // Calcium
  mg: string // Magnesium
  na: string // Sodium
  k: string // Potassium
  cl: string // Chloride
  so4: string // Sulfate
  nitrate: string
  fluoride: string
  uranium: string // Uranium (ppb)
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

export interface GroundwaterParameter {
  id: string
  type: string
  value: string
}

export interface PredictionInputData {
  location: string
  districtName: string
  population: string
  groundwaterLevel: string
  ph: string
  ec: string // Electrical Conductivity
  tds: string
  th: string // Total Hardness
  ca: string // Calcium
  mg: string // Magnesium
  na: string // Sodium
  k: string // Potassium
  cl: string // Chloride
  so4: string // Sulfate
  nitrate: string
  fluoride: string
  uranium: string // Uranium (ppb)
  arsenic: string
  temperature: string
  wellDepth: string
  // Dynamic Groundwater Assessment Parameters
  groundwaterParameters: GroundwaterParameter[]
}

export type { WaterInputData }

interface InputSidebarProps {
  inputData: WaterInputData
  onInputChange: (field: keyof WaterInputData, value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCsvUpload?: (data: WaterInputData[]) => void
  onPredictionSubmit?: (addData: WaterInputData, predData: PredictionInputData) => void
  className?: string
}

export const InputSidebar: React.FC<InputSidebarProps> = ({
  inputData,
  onInputChange,
  onSubmit,
  onCsvUpload,
  onPredictionSubmit,
  className
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [predictionData, setPredictionData] = useState<PredictionInputData>({
    location: '',
    districtName: '',
    population: '',
    groundwaterLevel: '',
    ph: '',
    ec: '',
    tds: '',
    th: '',
    ca: '',
    mg: '',
    na: '',
    k: '',
    cl: '',
    so4: '',
    nitrate: '',
    fluoride: '',
    uranium: '',
    arsenic: '',
    temperature: '',
    wellDepth: '',
    groundwaterParameters: [
      { id: '1', type: '', value: '' }
    ]
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      alert('Please upload a CSV file')
      return
    }

    setUploadedFile(file)
    setIsProcessing(true)

    try {
      const text = await file.text()
      const lines = text.trim().split('\n')
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      
      const parsedData: WaterInputData[] = []
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        const rowData: Partial<WaterInputData> = {}
        
        headers.forEach((header, index) => {
          const value = values[index] || ''
          // Map CSV headers to our data structure
          switch (header) {
            case 'location':
            case 'location name':
              rowData.location = value
              break
            case 'latitude':
            case 'lat':
              rowData.latitude = value
              break
            case 'longitude':
            case 'lng':
            case 'lon':
              rowData.longitude = value
              break
            case 'district':
            case 'district name':
              rowData.districtName = value
              break
            case 'population':
              rowData.population = value
              break
            case 'groundwater level':
            case 'groundwaterlevel':
            case 'gw level':
              rowData.groundwaterLevel = value
              break
            case 'ph':
            case 'ph level':
              rowData.ph = value
              break
            case 'ec':
            case 'electrical conductivity':
            case 'conductivity':
              rowData.ec = value
              break
            case 'tds':
            case 'total dissolved solids':
              rowData.tds = value
              break
            case 'th':
            case 'total hardness':
            case 'hardness':
              rowData.th = value
              break
            case 'ca':
            case 'calcium':
              rowData.ca = value
              break
            case 'mg':
            case 'magnesium':
              rowData.mg = value
              break
            case 'na':
            case 'sodium':
              rowData.na = value
              break
            case 'k':
            case 'potassium':
              rowData.k = value
              break
            case 'cl':
            case 'chloride':
              rowData.cl = value
              break
            case 'so4':
            case 'so₄':
            case 'sulfate':
            case 'sulphate':
              rowData.so4 = value
              break
            case 'no3':
            case 'no₃':
            case 'nitrate':
              rowData.nitrate = value
              break
            case 'f':
            case 'fluoride':
              rowData.fluoride = value
              break
            case 'u':
            case 'uranium':
            case 'u (ppb)':
              rowData.uranium = value
              break
            case 'arsenic':
              rowData.arsenic = value
              break
            case 'temperature':
            case 'temp':
              rowData.temperature = value
              break
            case 'well depth':
            case 'welldepth':
              rowData.wellDepth = value
              break
            case 'annual domestic industry draft':
            case 'annualdomesticindustrydraft':
              rowData.annualDomesticIndustryDraft = value
              break
            case 'annual irrigation draft':
            case 'annualirrigationdraft':
              rowData.annualIrrigationDraft = value
              break
            case 'annual groundwater draft total':
            case 'annualgroundwaterdrafttotal':
              rowData.annualGroundwaterDraftTotal = value
              break
            case 'annual replenishable groundwater resources':
            case 'annualreplenishablegroundwaterresources':
              rowData.annualReplenishableGroundwaterResources = value
              break
            case 'natural discharge non monsoon':
            case 'naturaldischargenonmonsoon':
              rowData.naturalDischargeNonMonsoon = value
              break
            case 'net groundwater availability':
            case 'netgroundwateravailability':
              rowData.netGroundwaterAvailability = value
              break
            case 'projected demand domestic industrial 2025':
            case 'projecteddemanddomesticindustrial2025':
              rowData.projectedDemandDomesticIndustrial2025 = value
              break
            case 'groundwater availability future irrigation':
            case 'groundwateravailabilityfutureirrigation':
              rowData.groundwaterAvailabilityFutureIrrigation = value
              break
            case 'stage groundwater development':
            case 'stagegroundwaterdevelopment':
              rowData.stageGroundwaterDevelopment = value
              break
          }
        })
        
        // Fill in empty fields with default values
        const completeRowData: WaterInputData = {
          location: rowData.location || '',
          latitude: rowData.latitude || '',
          longitude: rowData.longitude || '',
          districtName: rowData.districtName || rowData.location || '',
          population: rowData.population || '',
          groundwaterLevel: rowData.groundwaterLevel || '',
          ph: rowData.ph || '',
          ec: rowData.ec || '', // Electrical Conductivity
          tds: rowData.tds || '',
          th: rowData.th || '', // Total Hardness
          ca: rowData.ca || '', // Calcium
          mg: rowData.mg || '', // Magnesium
          na: rowData.na || '', // Sodium
          k: rowData.k || '', // Potassium
          cl: rowData.cl || '', // Chloride
          so4: rowData.so4 || '', // Sulfate
          nitrate: rowData.nitrate || '',
          fluoride: rowData.fluoride || '',
          uranium: rowData.uranium || '', // Uranium (ppb)
          arsenic: rowData.arsenic || '',
          temperature: rowData.temperature || '',
          wellDepth: rowData.wellDepth || '',
          annualDomesticIndustryDraft: rowData.annualDomesticIndustryDraft || '',
          annualIrrigationDraft: rowData.annualIrrigationDraft || '',
          annualGroundwaterDraftTotal: rowData.annualGroundwaterDraftTotal || '',
          annualReplenishableGroundwaterResources: rowData.annualReplenishableGroundwaterResources || '',
          naturalDischargeNonMonsoon: rowData.naturalDischargeNonMonsoon || '',
          netGroundwaterAvailability: rowData.netGroundwaterAvailability || '',
          projectedDemandDomesticIndustrial2025: rowData.projectedDemandDomesticIndustrial2025 || '',
          groundwaterAvailabilityFutureIrrigation: rowData.groundwaterAvailabilityFutureIrrigation || '',
          stageGroundwaterDevelopment: rowData.stageGroundwaterDevelopment || ''
        }
        
        parsedData.push(completeRowData)
      }
      
      if (onCsvUpload && parsedData.length > 0) {
        onCsvUpload(parsedData)
      }
      
    } catch (error) {
      console.error('Error parsing CSV:', error)
      alert('Error parsing CSV file. Please check the file format.')
    } finally {
      setIsProcessing(false)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onPredictionInputChange = (field: keyof PredictionInputData, value: string) => {
    setPredictionData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Groundwater parameter options
  const groundwaterParameterOptions = [
    { value: 'annualDomesticIndustryDraft', label: 'Annual Domestic/Industry Draft (MCM)' },
    { value: 'annualIrrigationDraft', label: 'Annual Irrigation Draft (MCM)' },
    { value: 'annualGroundwaterDraftTotal', label: 'Annual Groundwater Draft Total (MCM)' },
    { value: 'annualReplenishableGroundwaterResources', label: 'Annual Replenishable Resources (MCM)' },
    { value: 'naturalDischargeNonMonsoon', label: 'Natural Discharge Non-Monsoon (MCM)' },
    { value: 'netGroundwaterAvailability', label: 'Net Groundwater Availability (MCM)' }
  ]

  const addGroundwaterParameter = () => {
    setPredictionData(prev => ({
      ...prev,
      groundwaterParameters: [
        ...prev.groundwaterParameters,
        { id: Date.now().toString(), type: '', value: '' }
      ]
    }))
  }

  const removeGroundwaterParameter = (id: string) => {
    setPredictionData(prev => ({
      ...prev,
      groundwaterParameters: prev.groundwaterParameters.filter(param => param.id !== id)
    }))
  }

  const updateGroundwaterParameter = (id: string, field: 'type' | 'value', value: string) => {
    setPredictionData(prev => ({
      ...prev,
      groundwaterParameters: prev.groundwaterParameters.map(param =>
        param.id === id ? { ...param, [field]: value } : param
      )
    }))
  }

  const handlePredictionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onPredictionSubmit) {
      onPredictionSubmit(inputData, predictionData)
    }
  }
  return (
    <div className={className}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-lg font-bold text-foreground">Add Data</h2>
          <p className="mt-1 text-xs text-muted-foreground">Enter new monitoring data</p>
        </div>

        <Tabs defaultValue="existing" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing" className="text-xs">Existing Data</TabsTrigger>
            <TabsTrigger value="prediction" className="text-xs">Prediction</TabsTrigger>
          </TabsList>
          
          <TabsContent value="existing" className="space-y-4">

        {/* CSV Upload Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Upload CSV File</CardTitle>
            <CardDescription className="text-xs">Upload a CSV file with water monitoring data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {!uploadedFile ? (
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label 
                    htmlFor="csv-upload" 
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Click to upload CSV file
                    </span>
                  </label>
                </div>
              ) : (
                <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium">{uploadedFile.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
              {isProcessing && (
                <div className="text-xs text-center text-muted-foreground">
                  Processing CSV file...
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">Expected CSV headers:</p>
                <p className="text-[10px] leading-tight">
                  location, latitude, longitude, district, population, groundwater level, ph, ec, tds, th, ca, mg, na, k, cl, so4, nitrate, fluoride, uranium, arsenic, temperature, well depth
                </p>
                <p className="text-[10px] leading-tight mt-1">
                  <span className="font-medium">Additional chemical symbols supported:</span> NO₃ (nitrate), F (fluoride), U (uranium), SO₄ (sulfate)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manual Input Form */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Manual Entry</CardTitle>
            <CardDescription className="text-xs">Enter water monitoring data manually</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-3">
              <div className="space-y-5">
                <div>
                  <Label htmlFor="location" className="text-xs">Location Name</Label>
                  <Input
                    id="location"
                    value={inputData.location}
                    onChange={(e) => onInputChange('location', e.target.value)}
                    placeholder="e.g., Clappana"
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
                                    {/* Water Quality Parameters */}
                    <div className="border-t pt-4">
                      <h4 className="text-xs font-medium mb-3">Water Quality Parameters</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="pred-ph" className="text-xs">pH</Label>
                          <Input
                            id="pred-ph"
                            type="number"
                            step="0.1"
                            value={predictionData.ph}
                            onChange={(e) => onPredictionInputChange('ph', e.target.value)}
                            placeholder="7.2"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-ec" className="text-xs">EC (μS/cm)</Label>
                          <Input
                            id="pred-ec"
                            type="number"
                            step="0.1"
                            value={predictionData.ec}
                            onChange={(e) => onPredictionInputChange('ec', e.target.value)}
                            placeholder="800"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-tds" className="text-xs">TDS (mg/L)</Label>
                          <Input
                            id="pred-tds"
                            type="number"
                            step="0.1"
                            value={predictionData.tds}
                            onChange={(e) => onPredictionInputChange('tds', e.target.value)}
                            placeholder="400"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-th" className="text-xs">TH (mg/L)</Label>
                          <Input
                            id="pred-th"
                            type="number"
                            step="0.1"
                            value={predictionData.th}
                            onChange={(e) => onPredictionInputChange('th', e.target.value)}
                            placeholder="300"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-ca" className="text-xs">Ca (mg/L)</Label>
                          <Input
                            id="pred-ca"
                            type="number"
                            step="0.1"
                            value={predictionData.ca}
                            onChange={(e) => onPredictionInputChange('ca', e.target.value)}
                            placeholder="80"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-mg" className="text-xs">Mg (mg/L)</Label>
                          <Input
                            id="pred-mg"
                            type="number"
                            step="0.1"
                            value={predictionData.mg}
                            onChange={(e) => onPredictionInputChange('mg', e.target.value)}
                            placeholder="25"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-na" className="text-xs">Na (mg/L)</Label>
                          <Input
                            id="pred-na"
                            type="number"
                            step="0.1"
                            value={predictionData.na}
                            onChange={(e) => onPredictionInputChange('na', e.target.value)}
                            placeholder="50"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-k" className="text-xs">K (mg/L)</Label>
                          <Input
                            id="pred-k"
                            type="number"
                            step="0.1"
                            value={predictionData.k}
                            onChange={(e) => onPredictionInputChange('k', e.target.value)}
                            placeholder="10"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-cl" className="text-xs">Cl (mg/L)</Label>
                          <Input
                            id="pred-cl"
                            type="number"
                            step="0.1"
                            value={predictionData.cl}
                            onChange={(e) => onPredictionInputChange('cl', e.target.value)}
                            placeholder="100"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-so4" className="text-xs">SO₄ (mg/L)</Label>
                          <Input
                            id="pred-so4"
                            type="number"
                            step="0.1"
                            value={predictionData.so4}
                            onChange={(e) => onPredictionInputChange('so4', e.target.value)}
                            placeholder="50"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-nitrate" className="text-xs">NO₃ (mg/L)</Label>
                          <Input
                            id="pred-nitrate"
                            type="number"
                            step="0.1"
                            value={predictionData.nitrate}
                            onChange={(e) => onPredictionInputChange('nitrate', e.target.value)}
                            placeholder="10"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-fluoride" className="text-xs">F (mg/L)</Label>
                          <Input
                            id="pred-fluoride"
                            type="number"
                            step="0.1"
                            value={predictionData.fluoride}
                            onChange={(e) => onPredictionInputChange('fluoride', e.target.value)}
                            placeholder="0.8"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-uranium" className="text-xs">U (ppb)</Label>
                          <Input
                            id="pred-uranium"
                            type="number"
                            step="0.1"
                            value={predictionData.uranium}
                            onChange={(e) => onPredictionInputChange('uranium', e.target.value)}
                            placeholder="5"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-arsenic" className="text-xs">Arsenic (mg/L)</Label>
                          <Input
                            id="pred-arsenic"
                            type="number"
                            step="0.001"
                            value={predictionData.arsenic}
                            onChange={(e) => onPredictionInputChange('arsenic', e.target.value)}
                            placeholder="0.005"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-temperature" className="text-xs">Temperature (°C)</Label>
                          <Input
                            id="pred-temperature"
                            type="number"
                            step="0.1"
                            value={predictionData.temperature}
                            onChange={(e) => onPredictionInputChange('temperature', e.target.value)}
                            placeholder="25"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-wellDepth" className="text-xs">Well Depth (m)</Label>
                          <Input
                            id="pred-wellDepth"
                            type="number"
                            step="0.1"
                            value={predictionData.wellDepth}
                            onChange={(e) => onPredictionInputChange('wellDepth', e.target.value)}
                            placeholder="30"
                            className="text-xs h-8"
                          />
                        </div>
                      </div>
                    </div>

                {/* Groundwater Assessment Parameters */}
                <div className="mt-4 pt-2 border-t border-border">
                  <h4 className="text-xs font-medium mb-2">Groundwater Assessment Parameters</h4>
                  <div className="space-y-5">
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
          </TabsContent>

          <TabsContent value="prediction" className="space-y-4">
            {/* Prediction Form */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Prediction Data Entry</CardTitle>
                <CardDescription className="text-xs">Enter data for water quality prediction</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePredictionSubmit} className="space-y-3">
                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="pred-location" className="text-xs">Location Name</Label>
                      <Input
                        id="pred-location"
                        value={predictionData.location}
                        onChange={(e) => onPredictionInputChange('location', e.target.value)}
                        placeholder="e.g., Clappana"
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pred-districtName" className="text-xs">District Name</Label>
                      <Input
                        id="pred-districtName"
                        value={predictionData.districtName}
                        onChange={(e) => onPredictionInputChange('districtName', e.target.value)}
                        placeholder="e.g., Trivandrum"
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pred-population" className="text-xs">Population</Label>
                      <Input
                        id="pred-population"
                        type="number"
                        value={predictionData.population}
                        onChange={(e) => onPredictionInputChange('population', e.target.value)}
                        placeholder="e.g., 5000"
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pred-groundwaterLevel" className="text-xs">Groundwater Level (m)</Label>
                      <Input
                        id="pred-groundwaterLevel"
                        type="number"
                        step="0.1"
                        value={predictionData.groundwaterLevel}
                        onChange={(e) => onPredictionInputChange('groundwaterLevel', e.target.value)}
                        placeholder="e.g., 4.3"
                        className="text-xs h-8"
                      />
                    </div>

                    {/* Water Quality Parameters */}
                    <div className="border-t pt-4">
                      <h4 className="text-xs font-medium mb-3">Water Quality Parameters</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="pred-ph" className="text-xs">pH</Label>
                          <Input
                            id="pred-ph"
                            type="number"
                            step="0.1"
                            value={predictionData.ph}
                            onChange={(e) => onPredictionInputChange('ph', e.target.value)}
                            placeholder="7.2"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-ec" className="text-xs">EC (μS/cm)</Label>
                          <Input
                            id="pred-ec"
                            type="number"
                            step="0.1"
                            value={predictionData.ec}
                            onChange={(e) => onPredictionInputChange('ec', e.target.value)}
                            placeholder="800"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-tds" className="text-xs">TDS (mg/L)</Label>
                          <Input
                            id="pred-tds"
                            type="number"
                            step="0.1"
                            value={predictionData.tds}
                            onChange={(e) => onPredictionInputChange('tds', e.target.value)}
                            placeholder="400"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-th" className="text-xs">TH (mg/L)</Label>
                          <Input
                            id="pred-th"
                            type="number"
                            step="0.1"
                            value={predictionData.th}
                            onChange={(e) => onPredictionInputChange('th', e.target.value)}
                            placeholder="300"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-ca" className="text-xs">Ca (mg/L)</Label>
                          <Input
                            id="pred-ca"
                            type="number"
                            step="0.1"
                            value={predictionData.ca}
                            onChange={(e) => onPredictionInputChange('ca', e.target.value)}
                            placeholder="80"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-mg" className="text-xs">Mg (mg/L)</Label>
                          <Input
                            id="pred-mg"
                            type="number"
                            step="0.1"
                            value={predictionData.mg}
                            onChange={(e) => onPredictionInputChange('mg', e.target.value)}
                            placeholder="25"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-na" className="text-xs">Na (mg/L)</Label>
                          <Input
                            id="pred-na"
                            type="number"
                            step="0.1"
                            value={predictionData.na}
                            onChange={(e) => onPredictionInputChange('na', e.target.value)}
                            placeholder="50"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-k" className="text-xs">K (mg/L)</Label>
                          <Input
                            id="pred-k"
                            type="number"
                            step="0.1"
                            value={predictionData.k}
                            onChange={(e) => onPredictionInputChange('k', e.target.value)}
                            placeholder="10"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-cl" className="text-xs">Cl (mg/L)</Label>
                          <Input
                            id="pred-cl"
                            type="number"
                            step="0.1"
                            value={predictionData.cl}
                            onChange={(e) => onPredictionInputChange('cl', e.target.value)}
                            placeholder="100"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-so4" className="text-xs">SO₄ (mg/L)</Label>
                          <Input
                            id="pred-so4"
                            type="number"
                            step="0.1"
                            value={predictionData.so4}
                            onChange={(e) => onPredictionInputChange('so4', e.target.value)}
                            placeholder="50"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-nitrate" className="text-xs">NO₃ (mg/L)</Label>
                          <Input
                            id="pred-nitrate"
                            type="number"
                            step="0.1"
                            value={predictionData.nitrate}
                            onChange={(e) => onPredictionInputChange('nitrate', e.target.value)}
                            placeholder="10"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-fluoride" className="text-xs">F (mg/L)</Label>
                          <Input
                            id="pred-fluoride"
                            type="number"
                            step="0.1"
                            value={predictionData.fluoride}
                            onChange={(e) => onPredictionInputChange('fluoride', e.target.value)}
                            placeholder="0.8"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-uranium" className="text-xs">U (ppb)</Label>
                          <Input
                            id="pred-uranium"
                            type="number"
                            step="0.1"
                            value={predictionData.uranium}
                            onChange={(e) => onPredictionInputChange('uranium', e.target.value)}
                            placeholder="5"
                            className="text-xs h-8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pred-arsenic" className="text-xs">Arsenic (mg/L)</Label>
                          <Input
                            id="pred-arsenic"
                            type="number"
                            step="0.001"
                            value={predictionData.arsenic}
                            onChange={(e) => onPredictionInputChange('arsenic', e.target.value)}
                            placeholder="0.005"
                            className="text-xs h-8"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Groundwater Assessment Parameters for Prediction */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-medium">Groundwater Assessment Parameters</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addGroundwaterParameter}
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {predictionData.groundwaterParameters.map((param, index) => (
                          <div key={param.id} className="border border-border rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-medium">Parameter {index + 1}</Label>
                              {predictionData.groundwaterParameters.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeGroundwaterParameter(param.id)}
                                  className="h-5 w-5 p-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                            <div>
                              <Label htmlFor={`param-type-${param.id}`} className="text-xs">Parameter Type</Label>
                              <Select
                                value={param.type}
                                onValueChange={(value) => updateGroundwaterParameter(param.id, 'type', value)}
                              >
                                <SelectTrigger className="text-xs h-8">
                                  <SelectValue placeholder="Select parameter type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {groundwaterParameterOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value} className="text-xs">
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor={`param-value-${param.id}`} className="text-xs">Value</Label>
                              <Input
                                id={`param-value-${param.id}`}
                                type="number"
                                step="0.01"
                                value={param.value}
                                onChange={(e) => updateGroundwaterParameter(param.id, 'value', e.target.value)}
                                placeholder="Enter value"
                                className="text-xs h-8"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full text-xs h-8">
                    Submit for Prediction
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
