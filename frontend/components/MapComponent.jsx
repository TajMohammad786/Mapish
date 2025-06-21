import {
    MapContainer,
    TileLayer,
    LayersControl,
    Circle,
    Marker,
    Popup,
    useMap,
    ZoomControl
  } from 'react-leaflet';
  import L, { LatLngExpression } from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import { useEffect, useState } from 'react';
  import useMapStore  from '../store/mapStore';
 
  import '../AppGlobal.css';
  
  // Import marker icons (Vite/ESM compatible)
  import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
  import markerIcon from 'leaflet/dist/images/marker-icon.png';
  import markerShadow from 'leaflet/dist/images/marker-shadow.png';
  import {LocateButton} from './LocateButton';
  
  // Fix missing marker icons in Leaflet
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });
  
  const { BaseLayer } = LayersControl;
  
  const RecenterMap = ({ position }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(position);
    }, [position, map]);
    return null;
  };
  

  
  const MapWithLayers = () => {
    const { position, accuracy, zoom, updateLocation } = useMapStore();
    // const [position, setPosition] = useState([19.3919, 72.8397]);
    // const [accuracy, setaccuracy] = useState(0);
    // const [zoom, setZoom] = useState(16);
  
    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude, accuracy } = pos.coords;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Accuracy: ${accuracy}`);
           updateLocation(latitude, longitude, accuracy);
          },
          (err) => {
            console.warn(`Geolocation error: ${err.message}`);
          }
        );
      }
    }, [accuracy,zoom]);
  
    return (
      <div className="flex h-screen w-full">
      
      <MapContainer center={position} zoom={zoom}  className="map-container-fullscreen" zoomControl={false} >
        <RecenterMap position={position} />
        <LocateButton  />
        
        <ZoomControl position="bottomright" /> {/* Add custom zoom control */}
        <LayersControl position="bottomright">
          <BaseLayer checked name="Street View">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
          </BaseLayer>
  
          <BaseLayer name="Satellite View">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
            />
          </BaseLayer>
           {/* <BaseLayer name="Positron View">
            <TileLayer
              url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
              attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
            />
          </BaseLayer> */}
        </LayersControl>
        
        
        

        <Circle
            center={position}
            pathOptions={{ color: 'magenta', fillOpacity: 0.1 }}
            radius={accuracy}
        />
  
        <Marker position={position}>
          <Popup>You are here!</Popup>
        </Marker>
      </MapContainer>
      </div>
    );
  };
  
  export default MapWithLayers;
