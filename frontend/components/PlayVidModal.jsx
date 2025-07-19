// Modal.js

import React from "react";
import './PlayVidModal.css';

const Modal = ({ isOpen, onClose, selectedVideo }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {selectedVideo && (
          <div className="modal-video-content">
            <div className="modal-header">
              <button
                onClick={onClose}
                className="close-btn"
                aria-label="Close"
              >
                &times;
              </button>
              <div />
            </div>
            <>
              <iframe
                width="100%"
                height="470"
                src={`https://www.youtube.com/embed/${selectedVideo.playbackId}`}
                // src={`https://www.youtube.com/embed/qRnX1fQFqK4`}
                // src={`https://www.youtube.com/embed/XtvRMZjYXsc`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </>
            <div className="modal-details">
              <div>
                <h2>{selectedVideo.title}</h2>
                <p>
                  {selectedVideo.locality ? selectedVideo.locality + ", " : ""}
                  {selectedVideo.location ? selectedVideo.location + ", " : ""}
                  {selectedVideo.country || ""}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
