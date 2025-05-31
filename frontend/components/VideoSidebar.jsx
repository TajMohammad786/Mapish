import { useEffect, useRef, useState,useCallback } from 'react';
import useMapStore from '../store/mapStore';

const VideoSidebar = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const { setPosition, setAccuracy, setZoom, toggleSidebar, isSidebarOpen } = useMapStore();

  const lastVideoElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/getVideos/videos?page=${page}&limit=10`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            }
        });
        const data = await response.json();
        setVideos(prev => [...prev, ...data.videos]);
        setHasMore(data.hasMore);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [page]);

  const handleVideoClick = (video) => {
    setPosition([video.latitude, video.longitude]);
    setAccuracy(video.accuracy);
    setZoom(video.zoom);
  };

  return (
    <div 
      className={`fixed left-0 top-[48px] h-[calc(100vh-48px)] z-[1002] transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-full w-[400px] bg-zinc-900 shadow-lg text-white">
        {/* Header with toggle button */} 
        <div className="sticky top-0 z-[1000] bg-zinc-800 border-b border-zinc-700 pl-4 py-2 flex items-center justify-between">
          <h2 className="text-xl font-bold">Videos</h2>
        </div>

        {/* Scrollable content */}
        <div className="h-[calc(100vh-4rem)] overflow-y-auto hide-scrollbar">
          <div className="p-4 space-y-4">
            {videos.map((video, index) => (
              <div 
                key={video.videoId || video.id || index}
                ref={index === videos.length - 1 ? lastVideoElementRef : null}
                onClick={() => handleVideoClick(video)}
                className="cursor-pointer hover:bg-zinc-800 p-2 rounded transition-colors"
              >
                <img 
                  src={video.thumbnails.high} 
                  alt={video.title}
                  className="w-full h-60 object-cover rounded"
                />
                <h3 className="font-semibold mt-2">{video.title}</h3>
                <p className="text-sm text-zinc-400">{video?.locality} {video.location}</p>
              </div>
            ))}
            {loading && (
              <div className="text-center p-4">
                <span className="animate-spin inline-block w-6 h-6 border-4 border-zinc-700 border-t-blue-500 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  
  );
};

export default VideoSidebar;