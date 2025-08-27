import { GroundwaterClassification, PotabilityResult, WaterQualityResult } from '../types'

export const getLocationCoordinates = async (location: string): Promise<[number, number]> => {
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

export const getGroundwaterClassification = (stageOfDevelopment: number): GroundwaterClassification => {
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

export const getPotabilityScore = (ph: number, tds: number, nitrate: number, fluoride: number, arsenic: number): PotabilityResult => {
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

export const getWaterQuality = (ph: number, tds: number, nitrate: number, fluoride: number, arsenic: number): WaterQualityResult => {
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
