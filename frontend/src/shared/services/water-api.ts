import { PredictionInputData, WaterInputData } from '../types'

const API_BASE_URL = 'http://127.0.0.1:8000'

export interface ServerAnalysisResponse {
  quality_analysis: string
  level_analysis: string
  [key: string]: any // Allow additional properties
}

export const analyzeWaterData = async (data: WaterInputData): Promise<ServerAnalysisResponse> => {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('Server error response:', errorText)
    throw new Error(errorText || 'Failed to analyze data')
  }
  
  const responseText = await response.text()
  console.log('Raw response text:', responseText)
  
  try {
    const jsonResponse = JSON.parse(responseText)
    console.log('Parsed JSON response:', jsonResponse)
    return jsonResponse
  } catch (error) {
    console.error('Error parsing server response as JSON:', error)
    console.error('Response text was:', responseText)
    throw new Error('Server returned invalid JSON response')
  }
}

export const predictWaterData = async (existing: WaterInputData, prediction: PredictionInputData): Promise<unknown> => {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      existing,
      for_prediction: prediction
    })
  })
  
  if (!response.ok) {
    throw new Error('Prediction request failed')
  }
  
  return response.json()
}
