import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, AlertCircle } from 'lucide-react';
import './PhotoCapture.css';

export const PhotoCapture = ({
  photo,
  onPhotoChange,
  label = 'Photo (Optional)',
  maxDimension = 320,
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  // Compress image helper using canvas
  const compressAndSetImage = (imgSrc, isVideo = false) => {
    try {
      const canvas = document.createElement('canvas');
      let width = 0;
      let height = 0;

      if (isVideo) {
        width = imgSrc.videoWidth || 320;
        height = imgSrc.videoHeight || 320;
      } else {
        width = imgSrc.naturalWidth || imgSrc.width || 320;
        height = imgSrc.naturalHeight || imgSrc.height || 320;
      }

      if (width > height) {
        if (width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(imgSrc, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
        onPhotoChange(compressedBase64);
      }
    } catch (err) {
      console.error('Failed to compress image:', err);
      if (typeof imgSrc === 'string') {
        onPhotoChange(imgSrc);
      }
    }
  };

  const startCamera = async () => {
    setCameraError('');
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 400 },
          height: { ideal: 400 },
          facingMode: 'user',
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Webcam access error:', err);
      setCameraError('Unable to access camera. Please check permissions or upload a file.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      compressAndSetImage(videoRef.current, true);
      stopCamera();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      const img = new Image();
      img.onload = () => {
        compressAndSetImage(img, false);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="photo-capture-container">
      <label className="form-label">{label}</label>

      {photo ? (
        <div className="animate-fade photo-preview-box">
          <img src={photo} alt="Preview" className="photo-preview-img" />
          <button
            type="button"
            onClick={() => onPhotoChange(undefined)}
            className="photo-remove-btn"
            title="Remove Photo"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ) : isCameraActive ? (
        <div className="glass-card animate-fade photo-camera-card">
          <video ref={videoRef} autoPlay playsInline className="photo-video-feed" />
          <div className="photo-camera-actions">
            <button
              type="button"
              className="btn btn-secondary photo-btn-cancel"
              onClick={stopCamera}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary photo-btn-capture"
              onClick={capturePhoto}
            >
              Capture
            </button>
          </div>
        </div>
      ) : (
        <div className="photo-capture-container">
          {cameraError && (
            <div className="alert-box alert-danger animate-fade photo-error-box">
              <AlertCircle size={14} />
              <span>{cameraError}</span>
            </div>
          )}

          <div className="photo-trigger-group">
            <button
              type="button"
              className="btn btn-secondary photo-action-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={14} />
              Upload Image File
            </button>

            <button
              type="button"
              className="btn btn-secondary photo-action-btn"
              onClick={startCamera}
            >
              <Camera size={14} />
              Take Photo
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
