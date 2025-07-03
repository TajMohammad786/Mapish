import { useEffect, useRef, useState, useCallback } from 'react';
import useVideoStore from '../store/videoStore';
import useMapStore from '../store/mapStore';
import { apiCall } from '../utils/apiCall';
import Modal from './PlayVidModal'; // Assuming you have a Modal component
import './VideoSidebar.css'; // Assuming you have a CSS file for styling
import '../AppGlobal.css';


const VideoSidebar = () => {

  // This way is used since we cannot directly update without having instance video
  const videos = useVideoStore((state) => state.videos);
  const setVideos = useVideoStore((state) => state.setVideos);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  // const [hasMore, setHasMore] = useState(true);
  const {selectedChannel, selectedCountry, dateRange, isSidebarOpen, toggleSidebar,
         open,selectedVideo,handleClose, handleOpen} = useVideoStore();
  const [startDate, endDate] = dateRange;
  const observer = useRef();
  const videoRefs = useRef({});
  const selectedVideoId = useVideoStore((state) => state.selectedVideoId);
  const searchTerm = useVideoStore((state) => state.searchTerm);

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
      // console.log('initial', payload)
      const url = `/getVideos/videos?${queryParams}`;
      const response = await apiCall(url, 'POST', payload);
      const data = response;
      // setVideos((prev) => [...prev, ...data.videos]);
      //useVideoStore used to get most recent state of videos from store
      setVideos([...useVideoStore.getState().videos, ...data.videos]);
      
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedCountry) return;
    // console.log('selectedChannel', selectedChannel);
    setVideos([]);
    fetchVideos();
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

            onClick={() => handleOpen(video)}
            className={`video-item ${selectedVideoId === video.playbackId ? 'highlighted' : ''}`}
          >
            <img
              src={video?.thumbnails?.high}
              alt={video.title}
              loading='lazy'
            />
            <p>{video.title}</p>
            <small>
              {video.locality ? video.locality + ', ' : ''}
              {video.location ? video.location + ', ' : ''}
              {video.country || ''}
            </small>
          </div>
        );
      })}
      {!videos.length && <p className="videosidebar-empty">No videos to show!! <br></br> Select channel and country</p>}

      
    </div>
    <Modal isOpen={open} onClose={handleClose} selectedVideo={selectedVideo}>
    
    </Modal>
    </>
  )
};

export default VideoSidebar;
