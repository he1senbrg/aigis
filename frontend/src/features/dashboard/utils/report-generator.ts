import { INDIAN_LANGUAGES } from '@/shared/constants'
import { WaterData } from '@/shared/types'
import { getWaterQuality } from '@/shared/utils'
import jsPDF from 'jspdf'

export const generateReport = (waterData: WaterData[], reportLanguage: string) => {
  const doc = new jsPDF()
  const pageHeight = doc.internal.pageSize.height
  let yPosition = 20

  // Get selected language info
  const selectedLanguage = INDIAN_LANGUAGES.find(lang => lang.value === reportLanguage)
  const languageLabel = selectedLanguage?.label || 'English'

  // Header
  doc.setFontSize(18)
  doc.text('Water Monitoring Report', 20, yPosition)
  yPosition += 10
  
  doc.setFontSize(10)
  doc.text(`Language: ${languageLabel}`, 20, yPosition)
  yPosition += 15

  doc.setFontSize(12)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition)
  yPosition += 20

  // Summary
  doc.setFontSize(14)
  doc.text('Summary:', 20, yPosition)
  yPosition += 10

  doc.setFontSize(10)
  waterData.forEach((data, index) => {
    if (yPosition > pageHeight - 20) {
      doc.addPage()
      yPosition = 20
    }

    const quality = getWaterQuality(data.ph, data.tds, data.nitrate, data.fluoride, data.arsenic)
    doc.text(`${index + 1}. ${data.location} - Quality: ${quality.status}`, 20, yPosition)
    yPosition += 8
    doc.text(`   pH: ${data.ph}, TDS: ${data.tds}, Nitrate: ${data.nitrate}`, 25, yPosition)
    yPosition += 8
    doc.text(`   Fluoride: ${data.fluoride}, Arsenic: ${data.arsenic}`, 25, yPosition)
    yPosition += 12
  })

  // Add language note at the bottom
  if (reportLanguage !== 'english') {
    doc.setFontSize(8)
    doc.text(`Note: This report was generated for ${languageLabel}`, 20, pageHeight - 10)
  }

  doc.save(`water-monitoring-report-${reportLanguage}.pdf`)
}
