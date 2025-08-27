import { StaticImageData } from 'next/image'

export interface Dataset {
  id: string
  title: string
  description: string
  image: string | StaticImageData
  fields: string[]
  size: string
  format: string
  lastUpdated: string
  downloadUrl: string
  category: string
}
