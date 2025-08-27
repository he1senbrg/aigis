'use client'

import { DEFAULT_MAP_CENTER, FALLBACK_INDIA_CENTER } from '@/shared/constants'
import { analyzeWaterData, predictWaterData } from '@/shared/services'
import { PredictionInputData, WaterData, WaterInputData } from '@/shared/types'
import { getLocationCoordinates } from '@/shared/utils'
import React, { useEffect, useState } from 'react'
import { createWaterDataFromInput, getInitialInputData, getInitialWaterData } from '../utils/data-helpers'
import { generateReport } from '../utils/report-generator'
import { DashboardHeader } from './DashboardHeader'
import { InputSidebar } from './InputSidebar'
import { MapSection } from './MapSection'
import { ResourceLevelSection } from './ResourceLevelSection'
import { WaterQualitySection } from './WaterQualitySection'

interface WaterMonitoringDashboardProps {
  setMobileMenuOpen?: (open: boolean) => void
}

const WaterMonitoringDashboard: React.FC<WaterMonitoringDashboardProps> = ({ setMobileMenuOpen }) => {
  const [darkMode, setDarkMode] = useState(true)
  const [reportLanguage, setReportLanguage] = useState('english')
  const [mobileInputVisible, setMobileInputVisible] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_MAP_CENTER)
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

  const [waterData, setWaterData] = useState<WaterData[]>(getInitialWaterData())
  const [inputData, setInputData] = useState<WaterInputData>(getInitialInputData())

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
      setMapCenter(FALLBACK_INDIA_CENTER)
      setMarkerPosition(FALLBACK_INDIA_CENTER)
    }

    try {
      await analyzeWaterData(inputData)
      
      // Add to local state
      const newData = createWaterDataFromInput(inputData, waterData)
      setWaterData(prev => [...prev, newData])
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert('Error analyzing data: ' + errorMessage)
    }
  }

  const handlePredictionSubmit = async (addData: WaterInputData, predData: PredictionInputData) => {
    // First add the existing data
    if (!addData.location) {
      alert('Please fill in at least Location in the existing data')
      return
    }

    const newData = createWaterDataFromInput(addData, waterData)
    setWaterData(prev => [...prev, newData])

    try {
      await predictWaterData(addData, predData)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Prediction request failed: ${errorMessage}`)
    }
  }

  const handleCsvUpload = (csvData: WaterInputData[]) => {
    const newWaterData: WaterData[] = csvData.map((row) => 
      createWaterDataFromInput(row, waterData)
    )

    setWaterData(prev => [...prev, ...newWaterData])
    alert(`Successfully imported ${newWaterData.length} records from CSV`)
  }

  const handleGenerateReport = () => {
    generateReport(waterData, reportLanguage)
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Mobile Header */}
      <DashboardHeader
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        reportLanguage={reportLanguage}
        setReportLanguage={setReportLanguage}
        onGenerateReport={handleGenerateReport}
        setMobileMenuOpen={setMobileMenuOpen}
        isMobile={true}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Desktop Header */}
          <DashboardHeader
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            reportLanguage={reportLanguage}
            setReportLanguage={setReportLanguage}
            onGenerateReport={handleGenerateReport}
          />

          {/* GW Resource Level Section */}
          <ResourceLevelSection waterData={waterData} />

          {/* GW Quality Section */}
          <WaterQualitySection waterData={waterData} />

          {/* Map */}
          <MapSection
            mapCenter={mapCenter}
            markerPosition={markerPosition}
            inputData={inputData}
          />
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
