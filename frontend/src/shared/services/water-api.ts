import { PredictionInputData, WaterInputData } from '../types'

const API_BASE_URL = 'http://127.0.0.1:8000'

export const analyzeWaterData = async (data: WaterInputData): Promise<unknown> => {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Failed to analyze data')
  }
  
  return response.json()
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
