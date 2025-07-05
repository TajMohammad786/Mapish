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
import useMapStore from '../store/mapStore';
import useVideoStore from '../store/videoStore';
import '../AppGlobal.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import {LocateButton} from './LocateButton';
import WorldBorders from '../utils/worldBorders';

import ytIcon from '../src/assets/yt-icon.png';
import './MapComponent.css';
import Modal from './PlayVidModal'; // Assuming you have a Modal component

// import redIconUrl from 'leaflet-color-markers/img/marker-icon-red.png'
// import shadowUrl from 'leaflet-color-markers/img/marker-shadow.png';
// create a custom Icon instance
// const redIcon = new L.Icon({
//   iconUrl: redIconUrl,
//   shadowUrl: shadowUrl,
//   iconSize:    [25, 41],  // same size as default
//   iconAnchor:  [12, 41],  // point of the icon which will correspond to marker's location
//   popupAnchor: [1, -34],  // point from which the popup should open relative to the iconAnchor
//   shadowSize:  [41, 41]
// })

const youtubeIcon = new L.Icon({
  iconUrl: ytIcon,
  iconSize: [35, 32],         // size of the icon
  iconAnchor: [15, 40],       // point of the icon which will correspond to marker's location
  popupAnchor: [0, -40],      // position of the popup relative to the icon
  shadowUrl: null,            // optional shadow
})


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
    const { videos, open, selectedVideo, handleClose, handleOpen, toggleSidebar,
       isSidebarOpen, setSelectedVideoId, isMobile } = useVideoStore();

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

    const [markers, setMarkers] = useState([])

    useEffect(() => {
      const updatedMarkers = videos.map((video) => ({
        // wanted some random value to be added to id so that it is unique
        id: video.playbackId + Math.random().toString(36).substring(2, 15),
        position: [
          video.coordinates.coordinates[1],
          video.coordinates.coordinates[0],
        ],
        title: video.title,
        thumbnail: video.thumbnails?.high, // Make sure this exists
        videoId: video.playbackId,
        location: video.location,
        locality: video.locality,
        country: video.country,
      }))
      setMarkers(updatedMarkers)
    }, [videos])

  
    return (
      <div className="flex h-screen w-full">
      
      <MapContainer center={position} zoom={zoom}  className="map-container-fullscreen" zoomControl={false} >
        <RecenterMap position={position} />
        <LocateButton  />
        <WorldBorders />
        
        <ZoomControl position="bottomright" /> {/* Add custom zoom control */}
        <LayersControl position="bottomright">
          <BaseLayer checked name="Street View">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
          </BaseLayer>
          {/* <BaseLayer checked name="Street View">
            {/* <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />            
            <TileLayer
              url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
              attribution='© OpenStreetMap France | © OpenStreetMap contributors'
            /> 
          </BaseLayer> */}
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
  
        <Marker position={position} >
          <Popup>You are here!</Popup>
        </Marker>
        {/* {console.log("marker", markers)} */}
         {markers.map(({ id, position, title, thumbnail, videoId, location, locality, country }) => (
          <Marker
            key={id}
            position={position}
            icon = {youtubeIcon} 
           
          >
           <Popup maxWidth={300}>
              <div
                className='popup-content'
                onClick={() => {
                  isMobile ? '': handleOpen({ playbackId: videoId, title, thumbnail, location, locality, country })
                  isSidebarOpen ? '':toggleSidebar();
                  setSelectedVideoId(videoId);
                }}
              >
                  <img
                    src={thumbnail}
                    alt={title}
                  />
                  <p >
                    {title}
                  </p>
                  <p id='popup-location'>
                    {locality ? locality + ', ' : ''}
                    {location ? location + ', ' : ''}
                    {country || ''}
                  </p>
              </div>
            </Popup>  

          </Marker>
        ))}
        <Modal isOpen={open} onClose={handleClose} selectedVideo={selectedVideo}>
    
        </Modal>
      </MapContainer> 
      </div>
    );
  };
  
  export default MapWithLayers;
