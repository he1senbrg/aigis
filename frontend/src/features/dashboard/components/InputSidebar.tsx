'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PredictionInputData, WaterInputData } from '@/shared/types'
import React from 'react'
import { CsvUpload } from './CsvUpload'
import { ManualInputForm } from './ManualInputForm'
import { PredictionForm } from './PredictionForm'

interface InputSidebarProps {
  inputData: WaterInputData
  onInputChange: (field: keyof WaterInputData, value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCsvUpload?: (data: WaterInputData[]) => void
  onPredictionSubmit?: (addData: WaterInputData, predData: PredictionInputData) => void
  className?: string
  isMobile?: boolean
}

export const InputSidebar: React.FC<InputSidebarProps> = ({
  inputData,
  onInputChange,
  onSubmit,
  onCsvUpload,
  onPredictionSubmit,
  className,
  isMobile = false
}) => {
  return (
    <div className={className}>
      <div className={`${isMobile ? 'p-3' : 'p-4'} space-y-3 ${isMobile ? 'space-y-3' : 'space-y-4'}`}>
        {/* Header */}
        <div className="text-center">
          <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-foreground`}>Add Data</h2>
          <p className="mt-1 text-xs text-muted-foreground">Enter new monitoring data</p>
        </div>

        <Tabs defaultValue="existing" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing" className="text-xs">Existing Data</TabsTrigger>
            <TabsTrigger value="prediction" className="text-xs">Prediction</TabsTrigger>
          </TabsList>
          
          <TabsContent value="existing" className={`${isMobile ? 'space-y-3' : 'space-y-4'}`}>
            {/* CSV Upload Section */}
            <CsvUpload onCsvUpload={onCsvUpload} />

            {/* Manual Input Form */}
            <ManualInputForm
              inputData={inputData}
              onInputChange={onInputChange}
              onSubmit={onSubmit}
              isMobile={isMobile}
            />
          </TabsContent>

          <TabsContent value="prediction" className={`${isMobile ? 'space-y-3' : 'space-y-4'}`}>
            <PredictionForm
              inputData={inputData}
              onPredictionSubmit={onPredictionSubmit}
              isMobile={isMobile}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
