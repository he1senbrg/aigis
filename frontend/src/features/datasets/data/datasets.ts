import { Dataset } from '@/shared/types'
import gw_quality_img from "../../../shared/assets/gw_quality.jpg"
import gw_resource_img from "../../../shared/assets/gw_resource.jpg"

export const DATASETS: Dataset[] = [
  {
    id: '1',
    title: 'Ground Water Quality Dataset',
    description: 'Comprehensive water quality measurements including pH, EC, TDS, major ions, trace elements, and location data across various monitoring wells.',
    image: gw_quality_img,
    fields: [
      'Well ID', 'STATE', 'DISTRICT', 'BLOCK', 'LOCATION', 'LATITUDE', 'LONGITUDE', 
      'Year', 'pH', 'EC', 'CO3', 'HCO3', 'Cl', 'SO4', 'NO3', 'PO4', 'TH', 
      'Ca', 'Mg', 'Na', 'K', 'F', 'SiO2', 'TDS', 'U(ppb)'
    ],
    size: '7.7 MB',
    format: 'CSV',
    lastUpdated: '2024-08-27',
    downloadUrl: '/datasets/gwq.csv',
    category: 'Quality'
  },
  {
    id: '2',
    title: 'Ground Water Resource Dataset',
    description: 'Groundwater assessment data including annual draft, replenishable resources, net availability, and development stage across different blocks.',
    image: gw_resource_img,
    fields: [
      'state', 'District Name', 'block', 'Annual Domestic and Industry Draft',
      'Annual Irrigation Draft', 'Annual Groundwater Draft (Total)',
      'Annual Replenishable Groundwater Resources (Total)',
      'Natural Discharge During Non-Monsoon Season',
      'Net Groundwater Availability', 'Stage of Groundwater Development (%)'
    ],
    size: '2.2 MB',
    format: 'CSV',
    lastUpdated: '2024-08-27',
    downloadUrl: '/datasets/gwr.csv',
    category: 'Resources'
  }
]

export const downloadDataset = async (dataset: Dataset) => {
  try {
    console.log(`Downloading ${dataset.title}...`)
    
    // Fetch the actual CSV file
    const response = await fetch(dataset.downloadUrl)
    if (!response.ok) {
      throw new Error(`Failed to download ${dataset.title}`)
    }
    
    const csvContent = await response.text()
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${dataset.title.toLowerCase().replace(/\s+/g, '-')}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    console.log(`Successfully downloaded ${dataset.title}`)
  } catch (error) {
    console.error(`Error downloading ${dataset.title}:`, error)
    alert(`Failed to download ${dataset.title}. Please try again.`)
  }
}
