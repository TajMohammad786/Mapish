import {useMap} from 'react-leaflet';
// import useVideoStore from '../store/videoStore';
import useMapStore from '../store/mapStore';
import { Button } from '@/components/ui/button';

export const LocateButton = () => {
  const map = useMap();
  const {accuracy,position, getZoomLevelByAccuracy} = useMapStore()

  const handleClick = () => {
    const zoom = getZoomLevelByAccuracy(accuracy);
    map.setView(position, zoom);
  };

  return (
    <div className="absolute bottom-24 right-16 z-[1000] md:bottom-12" >
      <Button
        onClick={handleClick}
        variant="default"
        className="bg-white text-black border border-gray-300 rounded-lg px-4 py-2 shadow-md hover:bg-gray-100 transition"
      >
        📍 Locate Me
      </Button>
    </div>
  );
};
