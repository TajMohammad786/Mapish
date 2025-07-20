import { useEffect } from 'react';
import { ClipLoader } from 'react-spinners';

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000,
};

export default function Spinner() {
 

  return (
    <div style={overlayStyle}>
      <ClipLoader color="#007bff" size={50} speedMultiplier={1.2} />
      {/* <p style={{ color: '#fff', marginLeft: '20px' }}>Loading...</p> */}
    </div>
  );
}