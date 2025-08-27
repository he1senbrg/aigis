import { Dataset } from '@/shared/types'
import gw_quality_img from "../../../shared/assets/gw_quality.jpg"
import gw_resource_img from "../../../shared/assets/gw_resource.jpg"
import population_img from "../../../shared/assets/population.jpg"

export const DATASETS: Dataset[] = [
  {
    id: '1',
    title: 'Ground Water Quality Dataset',
    description: 'Comprehensive water quality measurements including pH, TDS, nitrate, fluoride, and arsenic levels across various monitoring locations.',
    image: gw_quality_img,
    fields: ['pH', 'TDS', 'Nitrate', 'Fluoride', 'Arsenic', 'Temperature', 'Location', 'Timestamp'],
    size: '2.4 MB',
    format: 'CSV',
    lastUpdated: '2024-08-20',
    downloadUrl: '/datasets/water-quality.csv',
    category: 'Quality'
  },
  {
    id: '2',
    title: 'Ground Water Resource Dataset',
    description: 'Groundwater assessment data including draft, recharge, availability, and development stage across different regions.',
    image: gw_resource_img,
    fields: ['Annual Draft', 'Replenishable Resources', 'Net Availability', 'Development Stage', 'District', 'Year'],
    size: '1.8 MB',
    format: 'CSV',
    lastUpdated: '2024-08-18',
    downloadUrl: '/datasets/water-resources.csv',
    category: 'Resources'
  },
  {
    id: '3',
    title: 'Population Dataset',
    description: 'Demographic data including population distribution, density, and growth patterns correlated with water monitoring locations.',
    image: population_img,
    fields: ['Population', 'Density', 'Growth Rate', 'Urban/Rural', 'District', 'Census Year'],
    size: '950 KB',
    format: 'CSV',
    lastUpdated: '2024-08-15',
    downloadUrl: '/datasets/population.csv',
    category: 'Demographics'
  }
]

export const downloadDataset = (dataset: Dataset) => {
  // In a real app, this would trigger the actual download
  console.log(`Downloading ${dataset.title}...`)
  // For demo purposes, we'll create a sample CSV content
  const csvContent = `# ${dataset.title}\n# Fields: ${dataset.fields.join(', ')}\n# Last Updated: ${dataset.lastUpdated}\n\nSample data would be here...`
  
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${dataset.title.toLowerCase().replace(/\s+/g, '-')}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}
