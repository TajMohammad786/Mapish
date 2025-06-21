import { useEffect, useRef, useState, useCallback } from 'react';
import useMapStore from '../store/mapStore';
import { apiCall } from '../utils/apiCall';
import Modal from './PlayVidModal'; // Assuming you have a Modal component
import './VideoSidebar.css'; // Assuming you have a CSS file for styling
import '../AppGlobal.css';

const VideoSidebar = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const {selectedChannel, selectedCountry} = useMapStore();
  const {dateRange} = useMapStore();
   const [startDate, endDate] = dateRange;
  const observer = useRef();
  const [open, setOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleClose = () => {
    setOpen(false);
    setSelectedVideo(null);
  };

  const handleOpen = (video) => {
    setSelectedVideo(video);
    setOpen(true);
  };

  const { setPosition, setAccuracy, setZoom, isSidebarOpen,toggleSidebar } = useMapStore();

  const lastVideoElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (!selectedCountry) return;
    setVideos([]);
    setPage(1);
    setHasMore(true);
  }, [selectedCountry, selectedChannel, endDate]);

  useEffect(() => {
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

        const url = `http://localhost:8080/getVideos/videos?page=${page}&limit=10&${queryParams}`;
        const response = await apiCall(url, 'POST', payload);
        const data = response;
        setVideos((prev) => [...prev, ...data.videos]);
        setHasMore(data.hasMore);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
    isSidebarOpen ? '': toggleSidebar();
  }, [page, selectedCountry, endDate]);

  return (
    
   <>
    <div
      className={`hide-scrollbar sidebar ${isSidebarOpen ? 'open' : ''}`}
    >
      {videos.map((video, index) => {
        const isLast = index === videos.length - 1;
        return (
          <div
            key={video._id + video.title + index}
            ref={isLast ? lastVideoElementRef : null}
            onClick={() => handleOpen(video)}
            className='video-item'
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
      {loading && <p>Loading more...</p>}
      {!hasMore && <p className="videosidebar-empty">No more videos.<br></br> Try changing scope!!</p>}
    </div>
    <Modal isOpen={open} onClose={handleClose}>
      {selectedVideo && (
        <div className="modal-video-content">
         
            <>
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${selectedVideo.playbackId}`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onError={() => {
                  setSelectedVideo({
                    ...selectedVideo,
                    unavailable: true
                  });
                }}
              ></iframe>
            </>
          )           <h2>{selectedVideo.title}</h2>
          <p>
            {selectedVideo.locality ? selectedVideo.locality + ', ' : ''}
            {selectedVideo.location ? selectedVideo.location + ', ' : ''}
            {selectedVideo.country || ''}
          </p>
        </div>
      )}
    </Modal>
    </>
  )
};

export default VideoSidebar;
