'use client'

import { AlertDialog } from '@/components/ui/alert-dialog'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DEFAULT_MAP_CENTER, FALLBACK_INDIA_CENTER } from '@/shared/constants'
import { analyzeWaterData, generateReport as generateServerReport, predictWaterData, ServerAnalysisResponse } from '@/shared/services'
import { PredictionInputData, WaterData, WaterInputData } from '@/shared/types'
import { getLocationCoordinates } from '@/shared/utils'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { createWaterDataFromServerResponse, getInitialInputData } from '../utils/data-helpers'
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
  const [lastPredictionResponse, setLastPredictionResponse] = useState<ServerAnalysisResponse | null>(null)
  const [reportGenerating, setReportGenerating] = useState(false)
  const [alertDialog, setAlertDialog] = useState<{
    open: boolean
    title: string
    description: string
    type: 'info' | 'warning' | 'error' | 'success'
  }>({
    open: false,
    title: '',
    description: '',
    type: 'info'
  })
  
  
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

  const [waterData, setWaterData] = useState<WaterData[]>([])
  const [inputData, setInputData] = useState<WaterInputData>(getInitialInputData())

  const showAlertDialog = (title: string, description: string, type: 'info' | 'warning' | 'error' | 'success' = 'info') => {
    setAlertDialog({
      open: true,
      title,
      description,
      type
    })
  }

  const handleInputChange = (field: keyof WaterInputData, value: string) => {
    setInputData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputData.location) {
      showAlertDialog('Missing Information', 'Please fill in Location', 'warning')
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
      console.log('Sending data to server:', inputData)
      const serverResponse = await analyzeWaterData(inputData)
      console.log('Received server response:', serverResponse)
      
      // Create water data with server analysis results
      const newData = createWaterDataFromServerResponse(inputData, serverResponse)
      console.log('Created water data:', newData)
      console.log('Quality analysis in newData:', newData.qualityAnalysis)
      console.log('Level analysis in newData:', newData.levelAnalysis)
      setWaterData([newData])
    } catch (error: unknown) {
      console.error('Full error details:', error)
      toast('Analysis failed. Please try again.', {
        action: {
          label: "✕",
          onClick: () => {},
        },
      })
    }
  }

  const handlePredictionSubmit = async (addData: WaterInputData, predData: PredictionInputData) => {
    // Replace existing data with new data (only one location at a time)
    if (!addData.location) {
      showAlertDialog('Missing Information', 'Please fill in at least Location in the existing data', 'warning')
      return
    }

    try {
      const serverResponse = await predictWaterData(addData, predData)
      // Store the prediction response for report generation
      setLastPredictionResponse(serverResponse)
      // Create water data with server analysis results
      const newData = createWaterDataFromServerResponse(addData, serverResponse)
      setWaterData([newData])
  } catch {
    toast('Prediction failed. Please try again.', {
      action: {
        label: "✕",
        onClick: () => {},
      },
    })
    }
  }

  const handleCsvUpload = (csvData: WaterInputData[]) => {
    // Only process the first row since we handle one location at a time
    if (csvData.length === 0) {
      toast('No data found in CSV.', {
        action: {
          label: "✕",
          onClick: () => {},
        },
      })
      return
    }
    
    if (csvData.length > 1) {
      toast('Only the first location in the CSV will be used.', {
        action: {
          label: "✕",
          onClick: () => {},
        },
      })
    }

    // Populate the input form fields with CSV data
    setInputData(csvData[0])
    
    // On mobile, show the input form so user can see the populated data
    setMobileInputVisible(true)
    
    toast('CSV loaded into form fields.', {
      action: {
        label: "✕",
        onClick: () => {},
      },
    })
  }

  const handleGenerateServerReport = async () => {
    if (!lastPredictionResponse) {
      showAlertDialog('No Prediction Data', 'No prediction data available. Please run a prediction first.', 'warning')
      return
    }

    try {
      setReportGenerating(true)
      const pdfLink = await generateServerReport(lastPredictionResponse, reportLanguage)
      
      // Open PDF in new tab
      window.open(pdfLink, '_blank')
      
      // Auto-close dialog after successful generation
      setReportGenerating(false)
      
    } catch {
      toast('Failed to generate report.', {
        action: {
          label: "✕",
          onClick: () => {},
        },
      })
      setReportGenerating(false)
    }
  }

  const handleClear = () => {
    setWaterData([])
    setInputData(getInitialInputData())
    setMapCenter(DEFAULT_MAP_CENTER)
    setMarkerPosition(null)
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Mobile Header */}
      <DashboardHeader
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        reportLanguage={reportLanguage}
        setReportLanguage={setReportLanguage}
        onGenerateServerReport={handleGenerateServerReport}
        hasPredictionData={lastPredictionResponse !== null}
        setMobileMenuOpen={setMobileMenuOpen}
        isMobile={true}
        hasData={waterData.length > 0}
        onClear={handleClear}
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
            onGenerateServerReport={handleGenerateServerReport}
            hasPredictionData={lastPredictionResponse !== null}
            hasData={waterData.length > 0}
            onClear={handleClear}
          />

          {waterData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <div className="text-2xl font-semibold text-center text-muted-foreground">Enter data to begin</div>
            </div>
          ) : (
            <>
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
            </>
          )}
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

      {/* Report Generation Dialog */}
      {reportGenerating && (
        <Dialog open={reportGenerating} onOpenChange={setReportGenerating}>
          <DialogContent>
            <DialogClose onClose={() => setReportGenerating(false)} />
            <DialogHeader>
              <DialogTitle>Generating Report</DialogTitle>
              <DialogDescription>
                Your report is being generated and will open in a new tab shortly. You can close this dialog and continue working.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Alert Dialog */}
      <AlertDialog
        open={alertDialog.open}
        onOpenChange={(open) => setAlertDialog(prev => ({ ...prev, open }))}
        title={alertDialog.title}
        description={alertDialog.description}
        type={alertDialog.type}
      />
    </div>
  )
}

export default WaterMonitoringDashboard
