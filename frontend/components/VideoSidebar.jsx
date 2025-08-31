import { useEffect, useRef, useState, useCallback } from 'react';
import useVideoStore from '../store/videoStore';
import useMapStore from '../store/mapStore';
import { FaCrosshairs } from 'react-icons/fa';
import { apiCall } from '../utils/apiCall';
import Modal from './PlayVidModal'; // Assuming you have a Modal component
import './VideoSidebar.css'; // Assuming you have a CSS file for styling
import '../AppGlobal.css';
import Spinner from './Spinner';



const VideoSidebar = ({mapRef}) => {
  // This way is used since we cannot directly update without having instance video
  const videos = useVideoStore((state) => state.videos);
  const setVideos = useVideoStore((state) => state.setVideos);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  // const [hasMore, setHasMore] = useState(true);
  const {selectedChannel, selectedCountry, dateRange, isSidebarOpen, toggleSidebar,
         open,selectedVideo,handleVidModalClose, handleVidModalOpen} = useVideoStore();
  const [startDate, endDate] = dateRange;
  const observer = useRef();
  const videoRefs = useRef({});
  const selectedVideoId = useVideoStore((state) => state.selectedVideoId);
  const searchTerm = useVideoStore((state) => state.searchTerm);
  const isMobile = useVideoStore((state) => state.isMobile);

  const channelIdToThumbnail = useVideoStore((state) => state.channelIdToThumbnail);
  const setChannelIdToThumbnail = useVideoStore((state) => state.setChannelIdToThumbnail);

  const [iframeLoaded, setIframeLoaded] = useState({});


  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  //Used to observe the last video element for infinite scrolling
  // const lastVideoElementRef = useCallback(
  //   (node) => {
  //     if (loading) return;
  //     if (observer.current) observer.current.disconnect();

  //     observer.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting ) {
  //         setPage((prevPage) => prevPage + 1);
  //       }
  //     });

  //     if (node) observer.current.observe(node);
  //   },
  //   [loading]
  // );

  const vidStartDate = startDate ? new Date(startDate).toISOString() : new Date('2020-01-01').toISOString();
  const vidEndDate = endDate ? new Date(endDate).toISOString() : new Date().toISOString();
  // console.log(vidStartDate, vidEndDate);
  const fetchVideos = async () => {
    setLoading(true);
    try {
      const payload = {
        channelTitle: selectedChannel,
        country: selectedCountry
      };
      const queryParams = new URLSearchParams({
        startDate: vidStartDate,
        endDate: vidEndDate
      }).toString();
      const url = `/getVideos/videos?${queryParams}`;
      const response = await apiCall(url, 'POST', payload);
      const data = response;

      const allVideos = [...useVideoStore.getState().videos, ...data.videos];
      // allVideos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

      setVideos(allVideos);

    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannels = async () => {
      try {
        const res = await apiCall('/getVideos/channels', 'GET');
        // Assuming res.channels is an array of channel objects
        const mapping = {};
        res.channels.forEach(channel => {
          mapping[channel.channelId] = channel.channelThumbnail;
        });
        setChannelIdToThumbnail(mapping);
      } catch (err) {
        console.error('Failed to fetch channels:', err);
      }
    };

    const getChannelThumbnail = (channelId) => channelIdToThumbnail[channelId] || '';

  


  useEffect(() => {
    if (!selectedCountry) return;
    // console.log('selectedChannel', selectedChannel);
    setVideos([]);
    fetchVideos();
    fetchChannels();
    setPage(1);
    
  }, [selectedCountry, selectedChannel, endDate]);

  

  useEffect(() => {
    const el = videoRefs.current[selectedVideoId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedVideoId]);


  return (
    
   <>
    {loading && <Spinner />}
    <div
      className={`hide-scrollbar sidebar ${isSidebarOpen ? 'open' : ''}`}
    >
     
     {filteredVideos.map((video, index) => {
        const isLast = index === filteredVideos.length - 1;
        return (
          <div
            key={video._id + video.title + index}
            
            ref={(el) => {
              if (el) videoRefs.current[video.playbackId] = el;
            }}
            onClick={() => {
              if (isMobile) {
                setIframeLoaded(prev => ({ [video.playbackId]: true }));
              } else {
                handleVidModalOpen(video); // Open modal for desktop
              }
            }}

            className={`video-item ${selectedVideoId === video.playbackId ? 'highlighted' : ''}`}
          >
          {isMobile ? (
            
            iframeLoaded[video.playbackId] ? (
              <iframe
                width="100%"
                height="170"
                src={`https://www.youtube.com/embed/${video.playbackId}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <img
                src={`https://img.youtube.com/vi/${video.playbackId}/hqdefault.jpg`}
                alt={video.title}
                width="100%"
                height="170"
                loading="lazy"
                style={{ cursor: 'pointer', objectFit: 'cover' }}
              />
            )
            

          ) : (
            <img
              src={`https://img.youtube.com/vi/${video.playbackId}/hqdefault.jpg`}
              alt={video.title}
              loading="lazy"
              style={{ width: '100%', height: '170px', objectFit: 'cover' }}
            />
          )}

            
            <p>{video.title}</p>
            <small style={{color:"#cbcacaff"}}>
              {(video.locality && video.locality !== "Unknown") ? video.locality + ', ' : ''}
              {(video.location && video.location !== "Unknown") ? video.location + ', ' : ''}
              {video.country || ''}
            </small>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0' }}>
              <img
                src={getChannelThumbnail(video.channelId)}
                alt={video.channelTitle}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid #ddd',
                  background: '#fff'
                }}
              />
              <span style={{ fontWeight: 500, fontSize: 15 }}>{video.channelTitle}</span>
              <div
              style={{ color: "white", marginLeft: 'auto', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid white', borderRadius: '4px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  mapRef.current?.zoomAndHighlight(video.playbackId, video.coordinates.coordinates[1], video.coordinates.coordinates[0]);
                  if(isMobile && isSidebarOpen) toggleSidebar(); // close sidebar on mobile
                  if(!isMobile) handleVidModalClose();
                }}
              >
                Locate
                <FaCrosshairs />
              </div>
            </div>
          </div>
        );
      })}
      {!videos.length && <p className="videosidebar-empty">No videos to show!! <br></br> Select channel and country</p>}

      
    </div>
    {!isMobile && (
      <Modal isOpen={open} onClose={handleVidModalClose} selectedVideo={selectedVideo} />
    )}

    </>
  )
};

export default VideoSidebar;
