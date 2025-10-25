import React, { useState } from 'react';
import { apiCall } from '../utils/apiCall';
import useVideoStore from '../store/videoStore';
import {UAParser} from 'ua-parser-js';

export default function GuestEntry({ asButton = false }) {
  const setIsAuthenticated = useVideoStore((s) => s.setIsAuthenticated);
  const [loading, setLoading] = useState(false);

  async function hashFingerprint(data) {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }



  const generateDeviceFingerprint = () => {
    const parser = new UAParser();
    const ua = parser.getResult();

    // Combine multiple browser/device characteristics
    const fingerprint = {
      browser: ua.browser.name + ua.browser.version,
      os: ua.os.name + ua.os.version,
      screen: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
    };
    
    return JSON.stringify(fingerprint);
  };

  const ensureVisitorId = async() => {
    let id = localStorage.getItem('visitorId');
    if (!id) {
      // id = (crypto && crypto.randomUUID) ? crypto.randomUUID() : ('v_' + Math.random().toString(36).slice(2));
      // localStorage.setItem('visitorId', id);
      const fingerprint = generateDeviceFingerprint();
      const raw = JSON.stringify(fingerprint);
      id = await hashFingerprint(raw);
      localStorage.setItem('visitorId', id);
    }
    return id;
  };

  const continueAsGuest = async (e) => {
    if (e) e.stopPropagation();
    setLoading(true);
    const visitorId = await ensureVisitorId();
    try {
      const res = await apiCall('/auth/guest', 'POST', { visitorId });
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        console.error('Guest login failed', res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Button-only variant used in AuthEntry
  
  return (
    <div className="App" style={{ display: "flex", justifyContent: "center" }}>
      <button
        className="auth-button guest"
        onClick={continueAsGuest}
        style={{ border: "2px solid grey", marginTop: "30px" }}
        disabled={loading}
      >
        {loading ? 'Please wait...' : 'Continue as Guest'}
      </button>
    </div>
    
  );
  

 
}