'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { WaterInputData } from '@/shared/types'
import { parseCsvData } from '@/shared/utils'
import { FileText, Upload, X } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { toast } from 'sonner'

interface CsvUploadProps {
  onCsvUpload?: (data: WaterInputData[]) => void
}

export const CsvUpload: React.FC<CsvUploadProps> = ({ onCsvUpload }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      toast("Please upload a CSV file.", {
        action: {
          label: "✕",
          onClick: () => {},
        },
      })
      return
    }

    setUploadedFile(file)
    setIsProcessing(true)

    try {
      const text = await file.text()
      const parsedData = parseCsvData(text)
      
      if (onCsvUpload && parsedData.length > 0) {
        onCsvUpload(parsedData)
      }
      
    } catch (error) {
      console.error('Error parsing CSV:', error)
      toast("Could not parse CSV file.", {
        action: {
          label: "✕",
          onClick: () => {},
        },
      })
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

  return (
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
          <div className="text-xs text-muted-foreground space-y-2">
            <p className="font-medium">Expected CSV headers:</p>
            <div className="bg-muted/50 p-2 rounded text-[10px] leading-relaxed break-all">
              <p className="mb-1">
                 location, district, population, groundwater level, ph, ec, tds, th, ca, mg, na, k, cl, so4, nitrate, fluoride, uranium, arsenic, temperature, well depth, 
                 annualdomesticindustrydraft, annualirrigationdraft, annualgroundwaterdrafttotal, annualreplenishablegroundwaterresources, naturaldischargenonmonsoon, netgroundwateravailability, projecteddemanddomesticindustrial2025, groundwateravailabilityfutureirrigation, stagegroundwaterdevelopment
              </p>
            </div>
            <p className="text-[10px] leading-tight">
              <span className="font-medium">Chemical symbols also supported:</span> NO₃ (nitrate), F (fluoride), U (uranium), SO₄ (sulfate)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
