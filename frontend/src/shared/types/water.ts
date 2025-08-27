export interface WaterInputData {
  location: string;
  districtName: string;
  population: string;
  groundwaterLevel: string
  ph: string
  ec: string // Electrical Conductivity
  tds: string
  th: string // Total Hardness
  ca: string // Calcium
  mg: string // Magnesium
  na: string // Sodium
  k: string // Potassium
  cl: string // Chloride
  so4: string // Sulfate
  nitrate: string
  fluoride: string
  uranium: string // Uranium (ppb)
  arsenic: string
  temperature: string
  wellDepth: string
  // Groundwater Assessment Parameters
  annualDomesticIndustryDraft: string
  annualIrrigationDraft: string
  annualGroundwaterDraftTotal: string
  annualReplenishableGroundwaterResources: string
  naturalDischargeNonMonsoon: string
  netGroundwaterAvailability: string
  projectedDemandDomesticIndustrial2025: string
  groundwaterAvailabilityFutureIrrigation: string
  stageGroundwaterDevelopment: string
}

export interface WaterData {
  groundwaterLevel: number;
  ph: number;
  id: string
  location: string;
  districtName: string;
  population: string;
  ec: number // Electrical Conductivity
  tds: number
  th: number // Total Hardness
  ca: number // Calcium
  mg: number // Magnesium
  na: number // Sodium
  k: number // Potassium
  cl: number // Chloride
  so4: number // Sulfate
  nitrate: number
  fluoride: number
  uranium: number // Uranium (ppb)
  arsenic: number
  temperature: number
  wellDepth: number
  annualDomesticIndustryDraft: number
  annualIrrigationDraft: number
  annualGroundwaterDraftTotal: number
  annualReplenishableGroundwaterResources: number
  naturalDischargeNonMonsoon: number
  netGroundwaterAvailability: number
  projectedDemandDomesticIndustrial2025: number
  groundwaterAvailabilityFutureIrrigation: number
  stageGroundwaterDevelopment: number
  timestamp: string
}

export interface CsvRowData {
  location?: string
  districtName?: string
  population?: string | number
  groundwaterLevel?: string | number
  ph?: string | number
  ec?: string | number // Electrical Conductivity
  tds?: string | number
  th?: string | number // Total Hardness
  ca?: string | number // Calcium
  mg?: string | number // Magnesium
  na?: string | number // Sodium
  k?: string | number // Potassium
  cl?: string | number // Chloride
  so4?: string | number // Sulfate
  nitrate?: string | number
  fluoride?: string | number
  uranium?: string | number // Uranium (ppb)
  arsenic?: string | number
  temperature?: string | number
  wellDepth?: string | number
  annualDomesticIndustryDraft?: string | number
  annualIrrigationDraft?: string | number
  annualGroundwaterDraftTotal?: string | number
  annualReplenishableGroundwaterResources?: string | number
  naturalDischargeNonMonsoon?: string | number
  netGroundwaterAvailability?: string | number
  projectedDemandDomesticIndustrial2025?: string | number
  groundwaterAvailabilityFutureIrrigation?: string | number
  stageGroundwaterDevelopment?: string | number
}

export interface GroundwaterParameter {
  id: string
  type: string
  value: string
}

export interface PredictionInputData {
  location: string
  districtName: string
  population: string
  groundwaterLevel: string
  ph: string
  ec: string // Electrical Conductivity
  tds: string
  th: string // Total Hardness
  ca: string // Calcium
  mg: string // Magnesium
  na: string // Sodium
  k: string // Potassium
  cl: string // Chloride
  so4: string // Sulfate
  nitrate: string
  fluoride: string
  uranium: string // Uranium (ppb)
  arsenic: string
  temperature: string
  wellDepth: string
  // Dynamic Groundwater Assessment Parameters
  groundwaterParameters: GroundwaterParameter[]
}

export interface WaterQualityResult {
  status: string
  color: string
  riskFactors: string[]
}

export interface PotabilityResult {
  score: number
  isSafe: boolean
  contributions: { [key: string]: number }
  failedThresholds: string[]
  status: string
  color: string
}

export interface GroundwaterClassification {
  status: string
  color: string
}
