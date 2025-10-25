import React from 'react';
import GoogleLogin from '../utils/GoogleLogin';
import GuestEntry from '../components/GuestEntry';

export default function AuthEntry() {
  return (
    <div className="auth-entry">
      <div className="auth-btn">
        <GoogleLogin />
      </div>
      <div className="auth-btn">
        <GuestEntry />
      </div>
    </div>
  );
}