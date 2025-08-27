'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { WaterInputData } from '@/shared/types'
import { setupLeafletIcons } from '@/shared/utils'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

interface MapSectionProps {
  mapCenter: [number, number]
  markerPosition: [number, number] | null
  inputData: WaterInputData
}

export const MapSection: React.FC<MapSectionProps> = ({
  mapCenter,
  markerPosition,
  inputData
}) => {
  useEffect(() => {
    setupLeafletIcons()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monitoring Location</CardTitle>
        <CardDescription>Geographic distribution of water monitoring points</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 sm:h-80 lg:h-96 w-full rounded-lg overflow-hidden">
          <MapContainer
            key={`${mapCenter[0]}-${mapCenter[1]}`}
            center={mapCenter}
            zoom={10}
            style={{ height: '100%', width: '100%' }}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution=""
            />
            {markerPosition && inputData.location.trim() && (
              <Marker position={markerPosition}>
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold">{inputData.location}</h3>
                    {inputData.districtName && (
                      <p>District: {inputData.districtName}</p>
                    )}
                    {inputData.population && (
                      <p>Population: {parseInt(inputData.population).toLocaleString()}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  )
}
