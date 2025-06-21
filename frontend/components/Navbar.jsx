import { useState, useEffect } from 'react';
import useMapStore from '../store/mapStore';
import { MdMenuOpen, MdClose } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Navbar.css';
import { apiCall } from '../utils/apiCall'; // Adjust the import path as necessary

// const countries = ['India', 'USA', 'Germany', 'Japan'];

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const [showModal, setShowModal] = useState(false);
  const { isSidebarOpen, toggleSidebar } = useMapStore();
  const {selectedChannel, setSelectedChannel} = useMapStore();
  const {selectedCountry, setSelectedCountry} = useMapStore();
  const {dateRange, setDateRange} = useMapStore();
  const [startDate, endDate] = dateRange;
  const [channels, setChannels] = useState([]); // Renamed to setChannels for clarity
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]); // Initialize with predefined countries

  useEffect(() => {
    const fetchChannels = async () => {
      setLoading(true);
      try {
        const ytChannelNames = await apiCall('http://localhost:8080/getVideos/getYTChannel', 'POST');
        if (ytChannelNames.channelArr) {
          setChannels(ytChannelNames.channelArr);
          console.log(channels);
        }
      } catch (err) {
        console.error("Error fetching channels", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []); 


useEffect(() => {
  const fetchCountries = async () => {
    if (!selectedChannel) return;
    setLoading(true);
    try {
      const payload = { channelTitle: selectedChannel };
      const res = await apiCall('http://localhost:8080/getVideos/getCountryNameFromDB', 'POST', payload);
      if (res?.countries) {
        setCountries(res.countries);
      }
    } catch (err) {
      console.error("Error fetching countries", err);
    } finally {
      setLoading(false);
    }
  };

  fetchCountries();
}, [selectedChannel]); 

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('user-info');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button onClick={toggleSidebar} className="sidebar-toggle">
          {isSidebarOpen ? <MdClose size={20} /> : <MdMenuOpen size={20} />}
        </button>
        <h3 className="navbar-logo">Mapish</h3>
        <input className="navbar-search" type="text" placeholder="Search..." />
      </div>

      <div className="navbar-right">
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
          onChange={(update) => {
            const [start, end] = update;

            // Example validations
            if (start && end) {
              const diffInMs = end - start;
              const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

              const today = new Date();
              const isFuture = end > today;
              // 5 Years range
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
          }}
          className="navbar-date-picker"
          placeholderText="Select Date Range"
          dateFormat="MMM yyyy"
          showMonthYearPicker
        />


        <button onClick={() => setShowModal(prev => !prev)} className="settings-button">⚙️</button>

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
  );
};

export default Navbar;
