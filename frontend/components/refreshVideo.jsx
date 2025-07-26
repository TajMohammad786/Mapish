import { useState, useEffect } from "react";
import { apiCall } from "../utils/apiCall";

function RefreshVideos() {
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const fetchLastUpdated = async () => {
      try {
        const res = await apiCall("/getVideos/refresh-status", 'GET');
        setLastUpdated(res.lastUpdated);
      } catch (e) {
        console.error("Error fetching last updated status:", e);
      }
    };
    fetchLastUpdated();
  }, []);
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000); // 10 seconds
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const canRefresh = !lastUpdated || (Date.now() - lastUpdated > 24 * 60 * 60 * 1000);

  const handleRefresh = async () => {
    if (!canRefresh || loading) {
      setError(`Refresh after ${ 24 - Math.floor((Date.now() - lastUpdated) / (1000 * 60 * 60))} hours`);
      return;
    };
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await apiCall("/getVideos/refresh-videos", "POST");
      setLastUpdated(res.lastUpdated);
      setSuccess("Videos refreshed!");
    } catch (e) {
      setError(e.message || "Error refreshing videos");
    } finally {
      setLoading(false);
    }
  };

  // Format last updated for tooltip
  const lastUpdatedText = lastUpdated
    ? `${Math.floor((Date.now() - lastUpdated) / (1000 * 60 * 60))} hour(s) ago`
    : "Never";

  return (
    <div style={{ position: "relative", display: "inline-block", marginBottom: "0.5rem" }}>
      <button
        onClick={handleRefresh}
        style={{
          backgroundColor: canRefresh ? "#3399FF" : "gray",
          color: "white",
          position: "relative",
          cursor: canRefresh && !loading ? "pointer" : "not-allowed",
          opacity: canRefresh && !loading ? 1 : 0.6
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        disabled={false} // Always enabled for tooltip, but visually indicate disabled state
      >
        {loading ? "Refreshing..." : "Refresh Videos"}
        {/* <span
          style={{
            marginLeft: 8,
            cursor: "help",
            fontSize: "1.0em",
            verticalAlign: "middle"
          }}
        >&#9432;</span> */}
      </button>
      {showTooltip && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#222",
            color: "#fff",
            padding: "6px 14px",
            borderRadius: "6px",
            fontSize: "0.95em",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 10
          }}
        >
          Last updated: {lastUpdatedText}
          {!canRefresh && !loading && (
            <div style={{ color: "#ffb300", marginTop: 4, fontSize: "0.9em" }}>
              You can refresh after 24 hours.
            </div>
          )}
        </div>
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}
    </div>
  );
}
export default RefreshVideos;