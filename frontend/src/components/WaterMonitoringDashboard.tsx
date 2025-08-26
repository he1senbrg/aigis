'use client'

import { InputSidebar, PredictionInputData, WaterInputData } from '@/components/InputSidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import jsPDF from 'jspdf'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Menu, Moon, Sun } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

// Fix for default markers in react-leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Function to get coordinates for any location using geocoding
const getLocationCoordinates = async (location: string): Promise<[number, number]> => {
  try {
    // Use OpenStreetMap Nominatim geocoding service (free and no API key required)
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`)
    const data = await response.json()
    
    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat)
      const lon = parseFloat(data[0].lon)
      return [lat, lon]
    }
    
    // Fallback to center of India if location not found
    return [20.5937, 78.9629]
  } catch (error) {
    console.error('Geocoding error:', error)
    // Fallback to center of India if error occurs
    return [20.5937, 78.9629]
  }
}

interface WaterData {
  groundwaterLevel: number;
  ph: number;
  id: string
  location: string;
  districtName: string;
  population: string;
  ec: number // Electrical Conductivity
  tds: number
  th: number // Total Hardness
  ca: number // Calcium
  mg: number // Magnesium
  na: number // Sodium
  k: number // Potassium
  cl: number // Chloride
  so4: number // Sulfate
  nitrate: number
  fluoride: number
  uranium: number // Uranium (ppb)
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

interface CsvRowData {
  location?: string
  // latitude and longitude removed
  districtName?: string
  population?: string | number
  groundwaterLevel?: string | number
  ph?: string | number
  ec?: string | number // Electrical Conductivity
  tds?: string | number
  th?: string | number // Total Hardness
  ca?: string | number // Calcium
  mg?: string | number // Magnesium
  na?: string | number // Sodium
  k?: string | number // Potassium
  cl?: string | number // Chloride
  so4?: string | number // Sulfate
  nitrate?: string | number
  fluoride?: string | number
  uranium?: string | number // Uranium (ppb)
  arsenic?: string | number
  temperature?: string | number
  wellDepth?: string | number
  annualDomesticIndustryDraft?: string | number
  annualIrrigationDraft?: string | number
  annualGroundwaterDraftTotal?: string | number
  annualReplenishableGroundwaterResources?: string | number
  naturalDischargeNonMonsoon?: string | number
  netGroundwaterAvailability?: string | number
  projectedDemandDomesticIndustrial2025?: string | number
  groundwaterAvailabilityFutureIrrigation?: string | number
  stageGroundwaterDevelopment?: string | number
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

const WaterMonitoringDashboard: React.FC<{
  setMobileMenuOpen?: (open: boolean) => void
}> = ({ setMobileMenuOpen }) => {
  const [darkMode, setDarkMode] = useState(true)
  const [reportLanguage, setReportLanguage] = useState('english')
  const [mobileInputVisible, setMobileInputVisible] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>([10.8505, 76.2711])
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null)
  
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
      districtName: 'Kollam',
  population: '2629000',
      groundwaterLevel: 8.5,
      ph: 7.2,
      ec: 680, // Electrical Conductivity (µS/cm)
      tds: 450,
      th: 220, // Total Hardness (mg/L)
      ca: 65, // Calcium (mg/L)
      mg: 18, // Magnesium (mg/L)
      na: 45, // Sodium (mg/L)
      k: 8, // Potassium (mg/L)
      cl: 85, // Chloride (mg/L)
      so4: 32, // Sulfate (mg/L)
      nitrate: 25,
      fluoride: 0.8,
      uranium: 2.5, // Uranium (ppb)
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
    districtName: '',
    population: '',
    groundwaterLevel: '',
    ph: '',
    ec: '', // Electrical Conductivity
    tds: '',
    th: '', // Total Hardness
    ca: '', // Calcium
    mg: '', // Magnesium
    na: '', // Sodium
    k: '', // Potassium
    cl: '', // Chloride
    so4: '', // Sulfate
    nitrate: '',
    fluoride: '',
    uranium: '', // Uranium (ppb)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputData.location) {
      alert('Please fill in Location')
      return
    }

    // Update map location on form submission
    try {
      const coordinates = await getLocationCoordinates(inputData.location)
      console.log(`Location: ${inputData.location}, Coordinates: [${coordinates[0]}, ${coordinates[1]}]`)
      setMapCenter(coordinates)
      setMarkerPosition(coordinates)
    } catch (error) {
      console.error('Error getting coordinates:', error)
      // Fallback to center of India
      const fallbackCoords: [number, number] = [20.5937, 78.9629]
      setMapCenter(fallbackCoords)
      setMarkerPosition(fallbackCoords)
    }

    // POST to backend
    fetch('http://127.0.0.1:8000/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inputData)
    })
    .then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to analyze data')
      }
      return response.json()
    })
  .then(() => {
    // Add to local state as before
    const newData = {
        id: (waterData.length + 1).toString(),
        location: inputData.location,
        districtName: inputData.districtName || inputData.location,
            population: inputData.population,
            groundwaterLevel: parseFloat(inputData.groundwaterLevel) || 0,
            ph: parseFloat(inputData.ph) || 7,
            ec: parseFloat(inputData.ec) || 0,
            tds: parseFloat(inputData.tds) || 0,
            th: parseFloat(inputData.th) || 0,
            ca: parseFloat(inputData.ca) || 0,
            mg: parseFloat(inputData.mg) || 0,
            na: parseFloat(inputData.na) || 0,
            k: parseFloat(inputData.k) || 0,
            cl: parseFloat(inputData.cl) || 0,
            so4: parseFloat(inputData.so4) || 0,
            nitrate: parseFloat(inputData.nitrate) || 0,
            fluoride: parseFloat(inputData.fluoride) || 0,
            uranium: parseFloat(inputData.uranium) || 0,
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
        //   setInputData({
        // location: '',
        // districtName: '',
        //     population: '',
        //     groundwaterLevel: '',
        //     ph: '',
        //     ec: '',
        //     tds: '',
        //     th: '',
        //     ca: '',
        //     mg: '',
        //     na: '',
        //     k: '',
        //     cl: '',
        //     so4: '',
        //     nitrate: '',
        //     fluoride: '',
        //     uranium: '',
        //     arsenic: '',
        //     temperature: '',
        //     wellDepth: '',
        //     annualDomesticIndustryDraft: '',
        //     annualIrrigationDraft: '',
        //     annualGroundwaterDraftTotal: '',
        //     annualReplenishableGroundwaterResources: '',
        //     naturalDischargeNonMonsoon: '',
        //     netGroundwaterAvailability: '',
        //     projectedDemandDomesticIndustrial2025: '',
        //     groundwaterAvailabilityFutureIrrigation: '',
        //     stageGroundwaterDevelopment: ''
        //   })
        })
        .catch((error) => {
          alert('Error analyzing data: ' + error.message)
        })
  }

  const handlePredictionSubmit = (addData: WaterInputData, predData: PredictionInputData) => {
    // First add the existing data
    if (!addData.location) {
      alert('Please fill in at least Location in the existing data')
      return
    }

    const newData: WaterData = {
      id: (waterData.length + 1).toString(),
      location: addData.location,
  // latitude and longitude removed
      districtName: addData.districtName || addData.location,
  population: addData.population,
      groundwaterLevel: parseFloat(addData.groundwaterLevel) || 0,
      ph: parseFloat(addData.ph) || 7,
      ec: parseFloat(addData.ec) || 0,
      tds: parseFloat(addData.tds) || 0,
      th: parseFloat(addData.th) || 0,
      ca: parseFloat(addData.ca) || 0,
      mg: parseFloat(addData.mg) || 0,
      na: parseFloat(addData.na) || 0,
      k: parseFloat(addData.k) || 0,
      cl: parseFloat(addData.cl) || 0,
      so4: parseFloat(addData.so4) || 0,
      nitrate: parseFloat(addData.nitrate) || 0,
      fluoride: parseFloat(addData.fluoride) || 0,
      uranium: parseFloat(addData.uranium) || 0,
      arsenic: parseFloat(addData.arsenic) || 0,
      temperature: parseFloat(addData.temperature) || 25,
      wellDepth: parseFloat(addData.wellDepth) || 0,
      annualDomesticIndustryDraft: parseFloat(addData.annualDomesticIndustryDraft) || 0,
      annualIrrigationDraft: parseFloat(addData.annualIrrigationDraft) || 0,
      annualGroundwaterDraftTotal: parseFloat(addData.annualGroundwaterDraftTotal) || 0,
      annualReplenishableGroundwaterResources: parseFloat(addData.annualReplenishableGroundwaterResources) || 0,
      naturalDischargeNonMonsoon: parseFloat(addData.naturalDischargeNonMonsoon) || 0,
      netGroundwaterAvailability: parseFloat(addData.netGroundwaterAvailability) || 0,
      projectedDemandDomesticIndustrial2025: parseFloat(addData.projectedDemandDomesticIndustrial2025) || 0,
      groundwaterAvailabilityFutureIrrigation: parseFloat(addData.groundwaterAvailabilityFutureIrrigation) || 0,
      stageGroundwaterDevelopment: parseFloat(addData.stageGroundwaterDevelopment) || 0,
      timestamp: new Date().toISOString()
    }

    setWaterData(prev => [...prev, newData])

    fetch('http://127.0.0.1:8000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        existing: addData,
        for_prediction: predData
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Prediction request failed')
        }
        return response.json()
      })
      .catch(error => {
        alert(`Prediction request failed: ${error.message}`)
      })
  }

  const handleCsvUpload = (csvData: CsvRowData[]) => {
    const newWaterData: WaterData[] = csvData.map((row, index) => ({
      id: (waterData.length + index + 1).toString(),
      location: row.location || '',
      districtName: row.districtName || row.location || '',
      population: String(row.population) || '',
      groundwaterLevel: parseFloat(String(row.groundwaterLevel)) || 0,
      ph: parseFloat(String(row.ph)) || 7,
      ec: parseFloat(String(row.ec)) || 0, // Electrical Conductivity
      tds: parseFloat(String(row.tds)) || 0,
      th: parseFloat(String(row.th)) || 0, // Total Hardness
      ca: parseFloat(String(row.ca)) || 0, // Calcium
      mg: parseFloat(String(row.mg)) || 0, // Magnesium
      na: parseFloat(String(row.na)) || 0, // Sodium
      k: parseFloat(String(row.k)) || 0, // Potassium
      cl: parseFloat(String(row.cl)) || 0, // Chloride
      so4: parseFloat(String(row.so4)) || 0, // Sulfate
      nitrate: parseFloat(String(row.nitrate)) || 0,
      fluoride: parseFloat(String(row.fluoride)) || 0,
      uranium: parseFloat(String(row.uranium)) || 0, // Uranium (ppb)
      arsenic: parseFloat(String(row.arsenic)) || 0,
      temperature: parseFloat(String(row.temperature)) || 25,
      wellDepth: parseFloat(String(row.wellDepth)) || 0,
      annualDomesticIndustryDraft: parseFloat(String(row.annualDomesticIndustryDraft)) || 0,
      annualIrrigationDraft: parseFloat(String(row.annualIrrigationDraft)) || 0,
      annualGroundwaterDraftTotal: parseFloat(String(row.annualGroundwaterDraftTotal)) || 0,
      annualReplenishableGroundwaterResources: parseFloat(String(row.annualReplenishableGroundwaterResources)) || 0,
      naturalDischargeNonMonsoon: parseFloat(String(row.naturalDischargeNonMonsoon)) || 0,
      netGroundwaterAvailability: parseFloat(String(row.netGroundwaterAvailability)) || 0,
      projectedDemandDomesticIndustrial2025: parseFloat(String(row.projectedDemandDomesticIndustrial2025)) || 0,
      groundwaterAvailabilityFutureIrrigation: parseFloat(String(row.groundwaterAvailabilityFutureIrrigation)) || 0,
      stageGroundwaterDevelopment: parseFloat(String(row.stageGroundwaterDevelopment)) || 0,
      timestamp: new Date().toISOString()
    }))

    setWaterData(prev => [...prev, ...newWaterData])
    alert(`Successfully imported ${newWaterData.length} records from CSV`)
  }

  const getGroundwaterClassification = (stageOfDevelopment: number) => {
    if (stageOfDevelopment <= 70) {
      return { status: 'Safe', color: 'bg-green-500' }
    } else if (stageOfDevelopment <= 90) {
      return { status: 'Semi-Critical', color: 'bg-yellow-500' }
    } else if (stageOfDevelopment <= 100) {
      return { status: 'Critical', color: 'bg-orange-500' }
    } else {
      return { status: 'Over-Exploited', color: 'bg-red-500' }
    }
  }

  const getPotabilityScore = (ph: number, tds: number, nitrate: number, fluoride: number, arsenic: number) => {
    let score = 100
    const contributions: { [key: string]: number } = {}
    const failedThresholds: string[] = []

    // WHO/BIS thresholds and scoring
    if (ph < 6.5 || ph > 8.5) {
      const deduction = Math.abs(ph - 7.25) * 10
      contributions['pH'] = -Math.min(deduction, 15)
      score += contributions['pH']
      failedThresholds.push('pH (6.5-8.5)')
    } else {
      contributions['pH'] = 0
    }

    if (tds > 500) {
      const deduction = ((tds - 500) / 500) * 20
      contributions['TDS'] = -Math.min(deduction, 25)
      score += contributions['TDS']
      failedThresholds.push('TDS (≤500 mg/L)')
    } else {
      contributions['TDS'] = 0
    }

    if (nitrate > 45) {
      const deduction = ((nitrate - 45) / 45) * 20
      contributions['Nitrate'] = -Math.min(deduction, 25)
      score += contributions['Nitrate']
      failedThresholds.push('Nitrate (≤45 mg/L)')
    } else {
      contributions['Nitrate'] = 0
    }

    if (fluoride > 1.5 || fluoride < 0.6) {
      const deduction = fluoride > 1.5 ? ((fluoride - 1.5) / 1.5) * 15 : ((0.6 - fluoride) / 0.6) * 10
      contributions['Fluoride'] = -Math.min(deduction, 20)
      score += contributions['Fluoride']
      failedThresholds.push('Fluoride (0.6-1.5 mg/L)')
    } else {
      contributions['Fluoride'] = 0
    }

    if (arsenic > 10) {
      const deduction = ((arsenic - 10) / 10) * 30
      contributions['Arsenic'] = -Math.min(deduction, 35)
      score += contributions['Arsenic']
      failedThresholds.push('Arsenic (≤10 μg/L)')
    } else {
      contributions['Arsenic'] = 0
    }

    const finalScore = Math.max(0, Math.min(100, score))
    const isSafe = finalScore >= 70
    
    return {
      score: Math.round(finalScore),
      isSafe,
      contributions,
      failedThresholds,
      status: isSafe ? 'Safe' : 'Critical',
      color: isSafe ? 'bg-green-500' : 'bg-red-500'
    }
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
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <div>
          <h1 className="text-xl font-bold text-foreground">AIGIS</h1>
          <p className="text-sm text-muted-foreground">Water Monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileMenuOpen?.(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">AIGIS Water Monitoring</h1>
              {/* <p className="text-muted-foreground">Real-time water quality monitoring and analysis</p> */}
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
            
            {/* Second row for additional GW Resource boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Stage of GW Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {waterData.length > 0 ? (waterData.reduce((sum, data) => sum + data.stageGroundwaterDevelopment, 0) / waterData.length).toFixed(1) : '0'}%
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">GW Classification</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const avgStage = waterData.length > 0 ? (waterData.reduce((sum, data) => sum + data.stageGroundwaterDevelopment, 0) / waterData.length) : 0
                    const classification = getGroundwaterClassification(avgStage)
                    return (
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${classification.color}`}></div>
                        <div className="text-lg font-bold">{classification.status}</div>
                      </div>
                    )
                  })()}
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

            {/* Second row for additional GW Quality boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Water Safety Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    if (waterData.length === 0) return <div className="text-lg font-bold">No Data</div>
                    const avgPh = waterData.reduce((sum, data) => sum + data.ph, 0) / waterData.length
                    const avgTds = waterData.reduce((sum, data) => sum + data.tds, 0) / waterData.length
                    const avgNitrate = waterData.reduce((sum, data) => sum + data.nitrate, 0) / waterData.length
                    const avgFluoride = waterData.reduce((sum, data) => sum + data.fluoride, 0) / waterData.length
                    const avgArsenic = waterData.reduce((sum, data) => sum + data.arsenic, 0) / waterData.length
                    const potability = getPotabilityScore(avgPh, avgTds, avgNitrate, avgFluoride, avgArsenic)
                    return (
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${potability.color}`}></div>
                        <div className="text-lg font-bold">{potability.status}</div>
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Potability Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(() => {
                      if (waterData.length === 0) return '0'
                      const avgPh = waterData.reduce((sum, data) => sum + data.ph, 0) / waterData.length
                      const avgTds = waterData.reduce((sum, data) => sum + data.tds, 0) / waterData.length
                      const avgNitrate = waterData.reduce((sum, data) => sum + data.nitrate, 0) / waterData.length
                      const avgFluoride = waterData.reduce((sum, data) => sum + data.fluoride, 0) / waterData.length
                      const avgArsenic = waterData.reduce((sum, data) => sum + data.arsenic, 0) / waterData.length
                      const potability = getPotabilityScore(avgPh, avgTds, avgNitrate, avgFluoride, avgArsenic)
                      return `${potability.score}/100`
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Potability Analysis Table */}
            {waterData.length > 0 && (
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
                          const avgPh = waterData.reduce((sum, data) => sum + data.ph, 0) / waterData.length
                          const avgTds = waterData.reduce((sum, data) => sum + data.tds, 0) / waterData.length
                          const avgNitrate = waterData.reduce((sum, data) => sum + data.nitrate, 0) / waterData.length
                          const avgFluoride = waterData.reduce((sum, data) => sum + data.fluoride, 0) / waterData.length
                          const avgArsenic = waterData.reduce((sum, data) => sum + data.arsenic, 0) / waterData.length
                          const potability = getPotabilityScore(avgPh, avgTds, avgNitrate, avgFluoride, avgArsenic)
                          
                          const parameters = [
                            { name: 'pH', value: avgPh.toFixed(1), threshold: '6.5-8.5', contribution: potability.contributions['pH'] },
                            { name: 'TDS', value: `${Math.round(avgTds)} mg/L`, threshold: '≤500 mg/L', contribution: potability.contributions['TDS'] },
                            { name: 'Nitrate', value: `${avgNitrate.toFixed(1)} mg/L`, threshold: '≤45 mg/L', contribution: potability.contributions['Nitrate'] },
                            { name: 'Fluoride', value: `${avgFluoride.toFixed(1)} mg/L`, threshold: '0.6-1.5 mg/L', contribution: potability.contributions['Fluoride'] },
                            { name: 'Arsenic', value: `${avgArsenic.toFixed(1)} μg/L`, threshold: '≤10 μg/L', contribution: potability.contributions['Arsenic'] }
                          ]
                          
                          return parameters.map((param, index) => (
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
                          ))
                        })()}
                      </TableBody>
                    </Table>
                  </div>
                  {(() => {
                    const avgPh = waterData.reduce((sum, data) => sum + data.ph, 0) / waterData.length
                    const avgTds = waterData.reduce((sum, data) => sum + data.tds, 0) / waterData.length
                    const avgNitrate = waterData.reduce((sum, data) => sum + data.nitrate, 0) / waterData.length
                    const avgFluoride = waterData.reduce((sum, data) => sum + data.fluoride, 0) / waterData.length
                    const avgArsenic = waterData.reduce((sum, data) => sum + data.arsenic, 0) / waterData.length
                    const potability = getPotabilityScore(avgPh, avgTds, avgNitrate, avgFluoride, avgArsenic)
                    
                    if (potability.failedThresholds.length > 0) {
                      return (
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
                      )
                    }
                    return null
                  })()}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Map */}
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Location</CardTitle>
              <CardDescription>Geographic distribution of water monitoring points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 sm:h-80 lg:h-96 w-full rounded-lg overflow-hidden">
                <MapContainer
                  key={`${mapCenter[0]}-${mapCenter[1]}`}
                  center={mapCenter}
                  zoom={10}
                  style={{ height: '100%', width: '100%' }}
                  attributionControl={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution=""
                  />
                  {markerPosition && inputData.location.trim() && (
                    <Marker position={markerPosition}>
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-bold">{inputData.location}</h3>
                          {inputData.districtName && (
                            <p>District: {inputData.districtName}</p>
                          )}
                          {inputData.population && (
                            <p>Population: {parseInt(inputData.population).toLocaleString()}</p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Sidebar - Input Form */}
      <div className="hidden lg:block lg:w-[35%]">
        <InputSidebar
          inputData={inputData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onCsvUpload={handleCsvUpload}
          onPredictionSubmit={handlePredictionSubmit}
          className="h-full border-l border-border bg-card/50 overflow-y-auto scrollbar-thin"
        />
      </div>

      {/* Mobile Bottom Sidebar */}
      <div className="lg:hidden">
        <div className="border-t border-border bg-card/50">
          <button
            onClick={() => setMobileInputVisible(!mobileInputVisible)}
            className="w-full p-3 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <div>
              <h3 className="font-medium text-sm">Add Data</h3>
              <p className="text-xs text-muted-foreground">Enter new monitoring data</p>
            </div>
            <div className={`transform transition-transform ${mobileInputVisible ? 'rotate-180' : ''}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          {mobileInputVisible && (
            <div className="max-h-[50vh] overflow-y-auto">
              <InputSidebar
                inputData={inputData}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                onCsvUpload={handleCsvUpload}
                onPredictionSubmit={handlePredictionSubmit}
                className="border-0"
                isMobile={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WaterMonitoringDashboard
