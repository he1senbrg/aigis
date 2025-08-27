import { CsvRowData, WaterInputData } from '../types'

export const parseCsvData = (text: string): WaterInputData[] => {
  const lines = text.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  
  const parsedData: WaterInputData[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    const rowData: Partial<WaterInputData> = {}
    
    headers.forEach((header, index) => {
      const value = values[index] || ''
      // Map CSV headers to our data structure
      switch (header) {
        case 'location':
        case 'location name':
          rowData.location = value
          break
        case 'district':
        case 'district name':
          rowData.districtName = value
          break
        case 'population':
          rowData.population = value
          break
        case 'groundwater level':
        case 'groundwaterlevel':
        case 'gw level':
          rowData.groundwaterLevel = value
          break
        case 'ph':
        case 'ph level':
          rowData.ph = value
          break
        case 'ec':
        case 'electrical conductivity':
        case 'conductivity':
          rowData.ec = value
          break
        case 'tds':
        case 'total dissolved solids':
          rowData.tds = value
          break
        case 'th':
        case 'total hardness':
        case 'hardness':
          rowData.th = value
          break
        case 'ca':
        case 'calcium':
          rowData.ca = value
          break
        case 'mg':
        case 'magnesium':
          rowData.mg = value
          break
        case 'na':
        case 'sodium':
          rowData.na = value
          break
        case 'k':
        case 'potassium':
          rowData.k = value
          break
        case 'cl':
        case 'chloride':
          rowData.cl = value
          break
        case 'so4':
        case 'so₄':
        case 'sulfate':
        case 'sulphate':
          rowData.so4 = value
          break
        case 'no3':
        case 'no₃':
        case 'nitrate':
          rowData.nitrate = value
          break
        case 'f':
        case 'fluoride':
          rowData.fluoride = value
          break
        case 'u':
        case 'uranium':
        case 'u (ppb)':
          rowData.uranium = value
          break
        case 'arsenic':
          rowData.arsenic = value
          break
        case 'temperature':
        case 'temp':
          rowData.temperature = value
          break
        case 'well depth':
        case 'welldepth':
          rowData.wellDepth = value
          break
        case 'annual domestic industry draft':
        case 'annualdomesticindustrydraft':
          rowData.annualDomesticIndustryDraft = value
          break
        case 'annual irrigation draft':
        case 'annualirrigationdraft':
          rowData.annualIrrigationDraft = value
          break
        case 'annual groundwater draft total':
        case 'annualgroundwaterdrafttotal':
          rowData.annualGroundwaterDraftTotal = value
          break
        case 'annual replenishable groundwater resources':
        case 'annualreplenishablegroundwaterresources':
          rowData.annualReplenishableGroundwaterResources = value
          break
        case 'natural discharge non monsoon':
        case 'naturaldischargenonmonsoon':
          rowData.naturalDischargeNonMonsoon = value
          break
        case 'net groundwater availability':
        case 'netgroundwateravailability':
          rowData.netGroundwaterAvailability = value
          break
        case 'projected demand domestic industrial 2025':
        case 'projecteddemanddomesticindustrial2025':
          rowData.projectedDemandDomesticIndustrial2025 = value
          break
        case 'groundwater availability future irrigation':
        case 'groundwateravailabilityfutureirrigation':
          rowData.groundwaterAvailabilityFutureIrrigation = value
          break
        case 'stage groundwater development':
        case 'stagegroundwaterdevelopment':
          rowData.stageGroundwaterDevelopment = value
          break
      }
    })
    
    // Fill in empty fields with default values
    const completeRowData: WaterInputData = {
      location: rowData.location || '',
      districtName: rowData.districtName || rowData.location || '',
      population: rowData.population || '',
      groundwaterLevel: rowData.groundwaterLevel || '',
      ph: rowData.ph || '',
      ec: rowData.ec || '', // Electrical Conductivity
      tds: rowData.tds || '',
      th: rowData.th || '', // Total Hardness
      ca: rowData.ca || '', // Calcium
      mg: rowData.mg || '', // Magnesium
      na: rowData.na || '', // Sodium
      k: rowData.k || '', // Potassium
      cl: rowData.cl || '', // Chloride
      so4: rowData.so4 || '', // Sulfate
      nitrate: rowData.nitrate || '',
      fluoride: rowData.fluoride || '',
      uranium: rowData.uranium || '', // Uranium (ppb)
      arsenic: rowData.arsenic || '',
      temperature: rowData.temperature || '',
      wellDepth: rowData.wellDepth || '',
      annualDomesticIndustryDraft: rowData.annualDomesticIndustryDraft || '',
      annualIrrigationDraft: rowData.annualIrrigationDraft || '',
      annualGroundwaterDraftTotal: rowData.annualGroundwaterDraftTotal || '',
      annualReplenishableGroundwaterResources: rowData.annualReplenishableGroundwaterResources || '',
      naturalDischargeNonMonsoon: rowData.naturalDischargeNonMonsoon || '',
      netGroundwaterAvailability: rowData.netGroundwaterAvailability || '',
      projectedDemandDomesticIndustrial2025: rowData.projectedDemandDomesticIndustrial2025 || '',
      groundwaterAvailabilityFutureIrrigation: rowData.groundwaterAvailabilityFutureIrrigation || '',
      stageGroundwaterDevelopment: rowData.stageGroundwaterDevelopment || ''
    }
    
    parsedData.push(completeRowData)
  }
  
  return parsedData
}

export const convertCsvRowToWaterData = (row: CsvRowData): WaterInputData => {
  return {
    location: row.location || '',
    districtName: row.districtName || row.location || '',
    population: String(row.population) || '',
    groundwaterLevel: String(row.groundwaterLevel) || '',
    ph: String(row.ph) || '',
    ec: String(row.ec) || '',
    tds: String(row.tds) || '',
    th: String(row.th) || '',
    ca: String(row.ca) || '',
    mg: String(row.mg) || '',
    na: String(row.na) || '',
    k: String(row.k) || '',
    cl: String(row.cl) || '',
    so4: String(row.so4) || '',
    nitrate: String(row.nitrate) || '',
    fluoride: String(row.fluoride) || '',
    uranium: String(row.uranium) || '',
    arsenic: String(row.arsenic) || '',
    temperature: String(row.temperature) || '',
    wellDepth: String(row.wellDepth) || '',
    annualDomesticIndustryDraft: String(row.annualDomesticIndustryDraft) || '',
    annualIrrigationDraft: String(row.annualIrrigationDraft) || '',
    annualGroundwaterDraftTotal: String(row.annualGroundwaterDraftTotal) || '',
    annualReplenishableGroundwaterResources: String(row.annualReplenishableGroundwaterResources) || '',
    naturalDischargeNonMonsoon: String(row.naturalDischargeNonMonsoon) || '',
    netGroundwaterAvailability: String(row.netGroundwaterAvailability) || '',
    projectedDemandDomesticIndustrial2025: String(row.projectedDemandDomesticIndustrial2025) || '',
    groundwaterAvailabilityFutureIrrigation: String(row.groundwaterAvailabilityFutureIrrigation) || '',
    stageGroundwaterDevelopment: String(row.stageGroundwaterDevelopment) || ''
  }
}
