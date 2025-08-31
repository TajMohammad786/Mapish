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
import { forwardRef, useEffect, useState, useRef,useImperativeHandle } from 'react';
import useMapStore from '../store/mapStore';
import useVideoStore from '../store/videoStore';
import '../AppGlobal.css';
// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import {LocateButton} from './LocateButton';
import WorldBorders from '../utils/worldBorders';
import MapSearchBar from './MapSearchBar';

import ytIcon from '../src/assets/yt-icon.png';
import './MapComponent.css';
import Modal from './PlayVidModal'; // Assuming you have a Modal component

import goldIcon from 'leaflet-color-markers/img/marker-icon-2x-gold.png'
import greenIcon from 'leaflet-color-markers/img/marker-icon-2x-green.png'
import shadowUrl from 'leaflet-color-markers/img/marker-shadow.png';
// create a custom Icon instance
const goldenIcon = new L.Icon({
  iconUrl: goldIcon,  
  shadowUrl: shadowUrl,
  iconSize:    [25, 41],  // same size as default
  iconAnchor:  [12, 41],  // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34],  // point from which the popup should open relative to the iconAnchor
  shadowSize:  [41, 41]
})

const greenerIcon = new L.Icon({
  iconUrl: greenIcon,  
  shadowUrl: shadowUrl,
  iconSize:    [25, 41],  // same size as default
  iconAnchor:  [12, 41],  // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34],  // point from which the popup should open relative to the iconAnchor
  shadowSize:  [41, 41]
})

const youtubeIcon = new L.Icon({
  iconUrl: ytIcon,
  iconSize: [35, 32],         // size of the icon
  iconAnchor: [15, 40],       // point of the icon which will correspond to marker's location
  popupAnchor: [0, -40],      // position of the popup relative to the icon
  shadowUrl: null,            // optional shadow
})


// Fix missing marker icons in Leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

const { BaseLayer } = LayersControl;

const RecenterMap = ({ position, setMapInstance }) => {
  const map = useMap();
  useEffect(() => {
    setMapInstance(map);
    // map.flyTo(position, 20, { animate: true })
    map.setView(position, 20);
  }, [position, map]);
  return null;
};
  


const MapWithLayers = forwardRef((props, ref) => {
    const { position, accuracy, zoom, updateLocation } = useMapStore();
    const { videos, open, selectedVideo, handleVidModalClose, handleVidModalOpen, toggleSidebar,
       isSidebarOpen, setSelectedVideoId, isMobile } = useVideoStore();
    const mapTilerApiKey = import.meta.env.VITE_MAPTILER_API_KEY;
    const [leafletMap, setLeafletMap] = useState(null);
    const channelIdToThumbnail = useVideoStore((state) => state.channelIdToThumbnail);
    const [highlightedId, setHighlightedId] = useState(null);
    const [markers, setMarkers] = useState([])

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
        channelId: video.channelId,
        channelTitle: video.channelTitle,
        location: video.location,
        locality: video.locality,
        country: video.country,
      }))
      setMarkers(updatedMarkers)
    }, [videos])

    const getChannelThumbnail = (channelId) => channelIdToThumbnail[channelId] || '';



    useImperativeHandle(ref, () => ({
      zoomAndHighlight(videoId, lat, lng) {
         setHighlightedId(videoId);
         if(leafletMap){
          leafletMap.flyTo([lat, lng], 16, { animate: true });
         }
       }
    }));

  
    return (
      <div className="flex h-screen w-full">
      
      <MapContainer center={position} zoom={zoom}  className="map-container-fullscreen" zoomControl={false} >
        <MapSearchBar/>
        <RecenterMap position={position} setMapInstance={setLeafletMap} />
        <LocateButton  />
        <WorldBorders />
        
        <ZoomControl position="bottomright" /> {/* Add custom zoom control */}
        <LayersControl position="bottomright">
          <BaseLayer checked name="Street View">
            <TileLayer
              url={`https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=${mapTilerApiKey}`}
              attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
          </BaseLayer>
          <BaseLayer name="Satellite View">
            <TileLayer
              url={`https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=${mapTilerApiKey}`}
              attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a>'
            />
          </BaseLayer>

          {/* <BaseLayer checked name="Street View">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
          </BaseLayer> */}
          {/* <BaseLayer checked name="Street View">
          <TileLayer
            url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
            attribution='© OpenStreetMap France | © OpenStreetMap contributors'
          /> 
        </BaseLayer>  */}
          {/* <BaseLayer name="Satellite View">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
          />
        </BaseLayer> */}
          {/* <BaseLayer name="Positron View">
          <TileLayer
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
          />
        </BaseLayer> */}

        </LayersControl>
  
        <Circle
            center={position}
            pathOptions={{ color: 'magenta', fillOpacity: 0.05 }}
            radius={accuracy}
        />
  
        <Marker position={position} icon={goldenIcon}>
          <Popup>You are here!</Popup>
        </Marker>
        {/* {console.log("marker", markers)} */}
         {markers.map(({ id, position, title, thumbnail, channelId, channelTitle, videoId, location, locality, country }) => (
          <Marker
            key={id}
            position={position}
            icon={highlightedId === videoId ? greenerIcon : youtubeIcon}  
            zIndexOffset={highlightedId === videoId ? 1000 : 0} 
          >
           <Popup maxWidth={390}>
              <div
                className='popup-content'
                onClick={() => {
                  isMobile ? '': handleVidModalOpen({ playbackId: videoId, title, thumbnail, location, locality, country })
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

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0' }}>
                    <img
                      src={getChannelThumbnail(channelId)}
                      alt={channelTitle}
                      // alt="YouTube Channel"
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1.5px solid #ddd',
                        background: '#fff'
                      }}
                    />
                    <span style={{ fontWeight: 500, fontSize: 14 }}>{channelTitle}</span>
                  </div>
              </div>
            </Popup>  

          </Marker>
        ))}
        <Modal isOpen={open} onClose={handleVidModalClose} selectedVideo={selectedVideo}>
    
        </Modal>
      </MapContainer> 
      </div>
    );
  });
  
  export default MapWithLayers;
