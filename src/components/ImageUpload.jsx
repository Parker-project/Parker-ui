import { useState, useRef, useEffect } from 'react';
import { FaUpload, FaCamera, FaExclamationCircle } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { detectLicensePlate, getHighestConfidencePlate } from '../utils/api';
import './ImageUpload.css';

export default function ImageUpload({ onLicensePlateDetected, onImageSelected }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (isCameraActive && videoRef.current) {
      let stream;
      const startCamera = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'environment',
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            }
          });
          videoRef.current.srcObject = stream;
          streamRef.current = stream; // Store the stream for cleanup
        } catch (err) {
          console.error('Camera error:', err);
          setError('Could not access camera. Please ensure permissions are granted.');
          setIsCameraActive(false);
        }
      };
      startCamera();

      return () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
      };
    }
  }, [isCameraActive]); // Rerun when isCameraActive changes

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setSelectedImage(file);
    
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    
    if (onImageSelected) {
      onImageSelected(file);
    }
  };

  const handleCameraClick = () => {
    setError('');
    setIsCameraActive(true);
  };

  const handleCapture = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(blob));
      if (onImageSelected) {
        onImageSelected(file);
      }
      stopCamera();
    }, 'image/jpeg', 0.95);
  };

  const stopCamera = () => {
    setIsCameraActive(false); // This will trigger the cleanup in useEffect
  };

  const processImageForOCR = async (file) => {
    setIsProcessing(true);
    setError('');
    // API call
    try {
      const ocrResult = await detectLicensePlate(file);
      const licensePlate = getHighestConfidencePlate(ocrResult);
      
      if (licensePlate) {
        onLicensePlateDetected(licensePlate);
      } else {
        setError('No license plate detected in this image. Please try a clearer photo or enter the plate manually.');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to detect license plate. Please try again or enter manually.';
      
      if (errorMessage.includes("Internal Server Error") || 
          errorMessage.includes("500") || 
          errorMessage.includes("encountered an internal error")) {
        setError('The license plate detection service is currently having technical issues. Please enter the plate manually.');
      }
      else if (errorMessage.includes("Cannot read properties of undefined") || 
               errorMessage.includes("TypeError") ||
               errorMessage.includes("internal error")) {
        setError('The image could not be processed by our license plate detection system. Please enter the plate manually.');
      }
      else if (errorMessage.includes("server couldn't process") || 
          errorMessage.includes("OCR failed") || 
          errorMessage.includes("Unexpected token")) {
        setError('The image could not be processed. Please try a clearer photo or enter the plate manually.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = async () => {
    if (selectedImage) {
      await processImageForOCR(selectedImage);
    }
  };

  const handleClear = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedImage(null);
    setPreviewUrl(null);
    setError('');
    stopCamera();
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="image-upload-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png"
        className="file-input"
      />
      
      {isCameraActive && !selectedImage ? (
        <div className="camera-view">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="camera-preview"
          />
          <div className="camera-controls">
            <button type="button" onClick={handleCapture} className="capture-button">
              <FaCamera />
            </button>
            <button type="button" onClick={stopCamera} className="cancel-button">
              <MdCancel />
            </button>
          </div>
        </div>
      ) : !selectedImage ? (
        <div className="upload-placeholder">
          <div className="upload-buttons">
            <button type="button" onClick={handleUploadClick} className="upload-button">
              <FaUpload className="upload-icon" />
              <span>Upload Photo</span>
            </button>
            <button type="button" onClick={handleCameraClick} className="camera-button">
              <FaCamera className="camera-icon" />
              <span>Take Photo</span>
            </button>
          </div>
          <small>Select a photo or take one with your camera</small>
        </div>
      ) : (
        <div className="image-preview-container">
          <img src={previewUrl} alt="Selected car" className="image-preview" />
          
          <div className="image-actions">
            <button 
              type="button" 
              className="clear-button" 
              onClick={handleClear}
              aria-label="Clear image"
            >
              <MdCancel />
            </button>
            
            {onLicensePlateDetected && (
              <button 
                type="button" 
                className="scan-button" 
                onClick={handleRetry}
                disabled={isProcessing}
                aria-label="Scan license plate"
              >
                <FaCamera /> Scan Plate
              </button>
            )}
          </div>
          
          {isProcessing && (
            <div className="processing-overlay">
              <div className="processing-indicator">Scanning license plate...</div>
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div className="upload-error">
          <FaExclamationCircle className="error-icon" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
} 