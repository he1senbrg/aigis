import { PredictionInputData, WaterInputData } from '../types'

const API_BASE_URL = 'https://aegis-backend.mangoforest-0891690a.westus2.azurecontainerapps.io'

export interface ServerAnalysisResponse {
  quality_analysis: string
  level_analysis: string
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

export const predictWaterData = async (existing: WaterInputData, prediction: PredictionInputData): Promise<ServerAnalysisResponse> => {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      existing,
      for_prediction: prediction
    })
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('Server error response:', errorText)
    throw new Error('Prediction request failed')
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

export const generateReport = async (afterPred: ServerAnalysisResponse, language: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/gen_report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      after_pred: afterPred,
      language: language
    })
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('Server error response:', errorText)
    throw new Error(errorText || 'Failed to generate report')
  }
  
  const responseData = await response.text()
  console.log('Report generation response:', responseData)
  
  // Server returns a relative path like "static/report_620968327984.pdf"
  // We need to construct the full URL
  const relativePath = responseData.replace(/"/g, '') // Remove quotes if present
  const fullUrl = `${API_BASE_URL}/${relativePath}`
  
  return fullUrl
}
