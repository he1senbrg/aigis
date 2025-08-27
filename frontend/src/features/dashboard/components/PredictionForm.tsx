'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GROUNDWATER_PARAMETER_OPTIONS } from '@/shared/constants'
import { PredictionInputData, WaterInputData } from '@/shared/types'
import { Plus, X } from 'lucide-react'
import React, { useState } from 'react'

interface PredictionFormProps {
  inputData: WaterInputData
  onPredictionSubmit?: (addData: WaterInputData, predData: PredictionInputData) => void
  isMobile?: boolean
}

export const PredictionForm: React.FC<PredictionFormProps> = ({
  inputData,
  onPredictionSubmit,
  isMobile = false
}) => {
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

  const onPredictionInputChange = (field: keyof PredictionInputData, value: string) => {
    setPredictionData(prev => ({
      ...prev,
      [field]: value
    }))
  }

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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Prediction</CardTitle>
        <CardDescription className="text-xs">Predict future water quality parameters</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePredictionSubmit} className="space-y-3">
          <div className={`${isMobile ? 'space-y-2' : 'space-y-5'}`}>
            {/* Basic Info */}
            <div>
              <Label htmlFor="pred-location" className="text-xs">Location Name</Label>
              <Input
                id="pred-location"
                value={predictionData.location}
                onChange={(e) => onPredictionInputChange('location', e.target.value)}
                placeholder="e.g., Clappana"
                className={`text-xs ${isMobile ? 'h-7' : 'h-8'}`}
              />
            </div>
            <div>
              <Label htmlFor="pred-districtName" className="text-xs">District Name</Label>
              <Input
                id="pred-districtName"
                value={predictionData.districtName}
                onChange={(e) => onPredictionInputChange('districtName', e.target.value)}
                placeholder="e.g., Kollam"
                className={`text-xs ${isMobile ? 'h-7' : 'h-8'}`}
              />
            </div>
            <div>
              <Label htmlFor="pred-population" className="text-xs">Population</Label>
              <Input
                id="pred-population"
                type="number"
                value={predictionData.population}
                onChange={(e) => onPredictionInputChange('population', e.target.value)}
                placeholder="2629000"
                className="text-xs h-7 sm:h-8"
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
                placeholder="8.5"
                className="text-xs h-7 sm:h-8"
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
                    className="text-xs h-7 sm:h-8"
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
                    className="text-xs h-7 sm:h-8"
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
                    className="text-xs h-7 sm:h-8"
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
                    className="text-xs h-7 sm:h-8"
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
                    className="text-xs h-7 sm:h-8"
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
                    className="text-xs h-7 sm:h-8"
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
                    className="text-xs h-7 sm:h-8"
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
                    className="text-xs h-7 sm:h-8"
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
                    className="text-xs h-7 sm:h-8"
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
                    className="text-xs h-7 sm:h-8"
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
                    className="text-xs h-7 sm:h-8"
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
                    className="text-xs h-7 sm:h-8"
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
                    className="text-xs h-7 sm:h-8"
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
                    className="text-xs h-7 sm:h-8"
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
                        <SelectTrigger className="text-xs h-7 sm:h-8">
                          <SelectValue placeholder="Select parameter type" />
                        </SelectTrigger>
                        <SelectContent>
                          {GROUNDWATER_PARAMETER_OPTIONS.map((option) => (
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
                        className="text-xs h-7 sm:h-8"
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
  )
}
