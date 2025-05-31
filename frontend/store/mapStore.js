import { create } from 'zustand'
import { getZoomLevelByAccuracy } from '../components/MapComponent';

const useMapStore = create((set, get) => ({
  position: [0, 0],
  accuracy: 0,
  zoom: 16,
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  setPosition: (pos) => set({ position: pos }),
  setAccuracy: (acc) => set({ accuracy: acc }),
  setZoom: (zoom) => set({ zoom: zoom }),
  getZoomLevelByAccuracy : (accuracy) => {
    if (accuracy < 10) return 19;
    if (accuracy < 20) return 18;
    if (accuracy < 50) return 17;
    if (accuracy < 100) return 16;
    if (accuracy < 200) return 15;
    if (accuracy < 500) return 14;
    if (accuracy < 1000) return 13;
    if (accuracy < 5000) return 12;
    return 10;
  },
  updateLocation: (latitude, longitude, accuracy) => {
    const zoom = get().getZoomLevelByAccuracy(accuracy);
    set({
      position: [latitude, longitude],
      accuracy: accuracy,
      zoom: zoom
    });
  },
}));



export default useMapStore;