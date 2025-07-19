import { GeoJSON, useMap } from 'react-leaflet'
import { useEffect, useRef } from 'react'
import IndiaGeo from '../src/assets/IndiaGeoJSON.json'
import useVideoStore from '../store/videoStore'
import L from 'leaflet'

function WorldBorders() {
  const { selectedCountry } = useVideoStore()
  const map = useMap()
  const geoJsonRef = useRef(null)

  useEffect(() => {
    if (!geoJsonRef.current || !selectedCountry) return

    // Find the matching feature
    const matchingFeature = IndiaGeo.features.find(
      (feature) => feature.properties.BRK_NAME === selectedCountry
    )

    if (matchingFeature) {
      const layer = L.geoJSON(matchingFeature)
      const bounds = layer.getBounds()
      map.fitBounds(bounds) // optional padding
    }
  }, [selectedCountry, map])

  return (
    <GeoJSON
      ref={geoJsonRef}
      data={IndiaGeo}
      style={(feature) => ({
        color: feature.properties.BRK_NAME === selectedCountry ? '#7300ffff' : 'white',
        weight: feature.properties.BRK_NAME === selectedCountry ? 1 : 0.3,
        fillOpacity: 0.05,
      })}
    />
  )
}

export default WorldBorders
