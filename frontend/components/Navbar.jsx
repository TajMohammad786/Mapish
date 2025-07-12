import { useState, useEffect } from 'react';
import useVideoStore from '../store/videoStore';
import { MdMenuOpen, MdClose } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Navbar.css';
import { apiCall } from '../utils/apiCall';
import { IoSettingsOutline } from "react-icons/io5";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const isMobile = useVideoStore((state) => state.isMobile);
  const {
    isSidebarOpen,
    toggleSidebar,
    selectedChannel,
    setSelectedChannel,
    selectedCountry,
    setSelectedCountry,
    dateRange,
    setDateRange,
    searchTerm,
    setSearchTerm,
  } = useVideoStore();
  const isAuthenticated = useVideoStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useVideoStore((state) => state.setIsAuthenticated);
  // const selectedVideoId = useVideoStore((state) => state.selectedVideoId);

  const [channels, setChannels] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  const [startDate, endDate] = dateRange;


  useEffect(() => {
    const fetchChannels = async () => {
      setLoading(true);
      try {
        if(isAuthenticated){
          const ytChannelNames = await apiCall('/getVideos/getYTChannel', 'POST');
          
          if (ytChannelNames.channelArr) {
            setChannels(ytChannelNames.channelArr);
          }

        }
        else{
          throw new Error("User is not authenticated");
        }
      } catch (err) {
        console.error("Error fetching channels", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchCountries = async () => {
      if (!selectedChannel) return;
      setLoading(true);
      try {
        const payload = { channelTitle: selectedChannel };
        const res = await apiCall('/getVideos/getCountryNameFromDB', 'POST', payload);
        if (res?.countries && isAuthenticated) {
          setCountries(res.countries);
        }
      } catch (err) {
        console.error("Error fetching countries", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, [selectedChannel,isAuthenticated]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('user-info');
  };

  const handleDateChange = (update) => {
    const [start, end] = update;

    if (start && end) {
      const diffInMs = end - start;
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
      const today = new Date();
      const isFuture = end > today;

      if (diffInDays > 1825) {
        alert('Please select a range within 5 years.');
        return;
      }

      if (diffInDays < 30) {
        alert('Select at least a 1-month range.');
        return;
      }

      if (isFuture) {
        alert('End date cannot be in the future.');
        return;
      }
    }

    setDateRange(update);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <button onClick={() => {
                            setShowFilterDrawer(false);
                            toggleSidebar();
                          }} className="sidebar-toggle">
            {isSidebarOpen ? <MdClose size={20} /> : <MdMenuOpen size={20} />}
          </button>
          <h3 className="navbar-logo">Mapish</h3>
          <input
            className="navbar-search"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="navbar-right">
          {!isMobile && (
            <>
              <div className="custom-select">
                <select
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                >
                  <option value="">Channel</option>
                  {channels.map((ch, idx) => (
                    <option key={idx} value={ch}>{ch}</option>
                  ))}
                </select>
              </div>

              <div className="custom-select">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  disabled={!selectedChannel || loading}
                >
                  <option value="">Country</option>
                  {countries.map((c, idx) => (
                    <option key={idx} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={handleDateChange}
                className="navbar-date-picker"
                placeholderText="Select Date Range"
                dateFormat="MMM yyyy"
                showMonthYearPicker
              />
            </>
          )}
          
          {isMobile && (
            <button className="mobile-filter-btn"  onClick={() => {
              setShowFilterDrawer(true);
              if (isSidebarOpen) toggleSidebar(); // close video sidebar
            }}>
              Filters
            </button>
          )}
          {isMobile && ( <button
              onClick={() => setShowModal(prev => !prev)}
              className="drawer-settings-btn"
              aria-label="Settings"
            >
              <IoSettingsOutline />
            </button>)}

          {!isMobile && (
            <button onClick={() => setShowModal(prev => !prev)} className="settings-button"><IoSettingsOutline /></button>
          )}


          {showModal && (
            <div className="settings-modal">
              <ul>
                {isAuthenticated && <li><button onClick={() => alert('Upload clicked')}>Upload Video</button></li>}
                {isAuthenticated && <li><button onClick={() => alert('Saved Videos clicked')}>Saved Videos</button></li>}
                <li>
                  {isAuthenticated ? (
                    <button onClick={handleLogout}>Logout</button>
                  ) : (
                    <button onClick={() => alert('Redirect to Login')}>Login</button>
                  )}
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {isMobile && showFilterDrawer && (
        <div className={`mobile-filter-drawer ${showFilterDrawer ? 'open' : ''}`}>
          <div className="drawer-header">
          <h4>Filters</h4>
            <button
              onClick={() => setShowFilterDrawer(false)}
              className="drawer-back-btn"
              aria-label="Close drawer"
            >
              x
            </button>
          </div>

          

          <div className="drawer-content">
            <label>Channel</label>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
            >
              <option value="">Channel</option>
              {channels.map((ch, idx) => (
                <option key={idx} value={ch}>{ch}</option>
              ))}
            </select>

            <label>Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              disabled={!selectedChannel || loading}
            >
              <option value="">Country</option>
              {countries.map((c, idx) => (
                <option key={idx} value={c}>{c}</option>
              ))}
            </select>

            <label>Date Range</label>
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateChange}
              className="navbar-date-picker"
              placeholderText="Select Date Range"
              dateFormat="MMM yyyy"
              showMonthYearPicker
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
