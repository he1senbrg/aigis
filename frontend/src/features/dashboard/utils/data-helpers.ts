import { WaterData, WaterInputData } from '@/shared/types'

export const createWaterDataFromInput = (inputData: WaterInputData, existingData: WaterData[]): WaterData => {
  return {
    id: (existingData.length + 1).toString(),
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

export const getInitialWaterData = (): WaterData[] => {
  return [
    {
      id: '1',
      location: 'Kollam',
      districtName: 'Kollam',
      population: '2629000',
      groundwaterLevel: 8.5,
      ph: 7.2,
      ec: 680, // Electrical Conductivity (µS/cm)
      tds: 450,
      th: 220, // Total Hardness (mg/L)
      ca: 65, // Calcium (mg/L)
      mg: 18, // Magnesium (mg/L)
      na: 45, // Sodium (mg/L)
      k: 8, // Potassium (mg/L)
      cl: 85, // Chloride (mg/L)
      so4: 32, // Sulfate (mg/L)
      nitrate: 25,
      fluoride: 0.8,
      uranium: 2.5, // Uranium (ppb)
      arsenic: 5,
      temperature: 28,
      wellDepth: 25,
      annualDomesticIndustryDraft: 45.67,
      annualIrrigationDraft: 189.23,
      annualGroundwaterDraftTotal: 234.9,
      annualReplenishableGroundwaterResources: 234.9,
      naturalDischargeNonMonsoon: 23.49,
      netGroundwaterAvailability: 211.41,
      projectedDemandDomesticIndustrial2025: 59.33,
      groundwaterAvailabilityFutureIrrigation: 152.08,
      stageGroundwaterDevelopment: 111.11,
      timestamp: new Date().toISOString()
    }
  ]
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
