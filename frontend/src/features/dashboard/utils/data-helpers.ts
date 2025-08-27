import { LevelAnalysis, QualityAnalysis, WaterData, WaterInputData } from '@/shared/types'

export const createWaterDataFromServerResponse = (inputData: WaterInputData, serverResponse: any): WaterData => {
  // Parse the quality and level analysis from server response
  let qualityAnalysis: QualityAnalysis | undefined
  let levelAnalysis: LevelAnalysis | undefined
  
  try {
    console.log('Server response:', serverResponse)
    console.log('Server response type:', typeof serverResponse)
    
    // If serverResponse is a string, parse it as JSON first
    let parsedResponse = serverResponse
    if (typeof serverResponse === 'string') {
      console.log('Server response is string, parsing as JSON...')
      parsedResponse = JSON.parse(serverResponse)
      console.log('Parsed response:', parsedResponse)
    }
    
    console.log('Parsed response keys:', Object.keys(parsedResponse))
    
    // Handle both direct properties and nested properties
    const qualityAnalysisString = parsedResponse.quality_analysis || parsedResponse['quality_analysis']
    const levelAnalysisString = parsedResponse.level_analysis || parsedResponse['level_analysis']
    
    console.log('Quality analysis string:', qualityAnalysisString)
    console.log('Level analysis string:', levelAnalysisString)
    
    // Check if the properties exist and are strings
    if (typeof qualityAnalysisString === 'string' && qualityAnalysisString) {
      qualityAnalysis = JSON.parse(qualityAnalysisString)
      console.log('Parsed quality analysis:', qualityAnalysis)
    } else {
      console.warn('quality_analysis is not a valid string:', qualityAnalysisString)
    }
    
    if (typeof levelAnalysisString === 'string' && levelAnalysisString) {
      levelAnalysis = JSON.parse(levelAnalysisString)
      console.log('Parsed level analysis:', levelAnalysis)
    } else {
      console.warn('level_analysis is not a valid string:', levelAnalysisString)
    }
    
  } catch (error) {
    console.error('Error parsing server response:', error)
    // Continue without analysis data if parsing fails
  }
  
  return {
    id: '1', // Always use id '1' since we only handle one location at a time
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
    timestamp: new Date().toISOString(),
    // Add server analysis data
    qualityAnalysis,
    levelAnalysis
  }
}

export const createWaterDataFromInput = (inputData: WaterInputData): WaterData => {
  return {
    id: '1', // Always use id '1' since we only handle one location at a time
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
}

export const getInitialInputData = (): WaterInputData => {
  return {
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
  }
}
