import { useState, useRef, useEffect } from 'react';
import { FaUpload, FaCamera, FaExclamationCircle } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { detectLicensePlate, getHighestConfidencePlate } from '../utils/api';
import './ImageUpload.css';

const getImageDimensions = (fileUrl) => 
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = (err) => {
      console.error("Error loading image for dimensions:", err);
      reject(err);
    };
    img.src = fileUrl;
  });

export default function ImageUpload({ onLicensePlateDetected, onImageSelected }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectionBox, setDetectionBox] = useState(null);
  const [imageDimensions, setImageDimensions] = useState(null);
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
          streamRef.current = stream; 
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
  }, [isCameraActive]); 

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setSelectedImage(file);
    setDetectionBox(null); 
    setImageDimensions(null);
    
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    
    try {
      const dimensions = await getImageDimensions(fileUrl);
      setImageDimensions(dimensions);
    } catch (err) {
      setError("Could not load image details. Please try a different image.");
    }
    
    if (onImageSelected) {
      onImageSelected(file);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
      setSelectedImage(file);
      setDetectionBox(null); 
      setImageDimensions(null);
      const fileUrl = URL.createObjectURL(blob);
      setPreviewUrl(fileUrl);
      
      try {
        const dimensions = await getImageDimensions(fileUrl);
        setImageDimensions(dimensions);
      } catch (err) {
        setError("Could not load image details. Please try a different image.");
      }
      
      if (onImageSelected) {
        onImageSelected(file);
      }
      stopCamera();
    }, 'image/jpeg', 0.95);
  };

  const processImageForOCR = async (file) => {
    if (!imageDimensions) {
      setError("Image dimensions are not available. Cannot process for OCR.");
      console.error("Attempted to process OCR without image dimensions.");
      setIsProcessing(false);
      return;
    }
    setIsProcessing(true);
    setError('');
    setDetectionBox(null);
    try {
      const ocrResult = await detectLicensePlate(file);
      const licensePlate = getHighestConfidencePlate(ocrResult);
      
      if (licensePlate) {
        onLicensePlateDetected(licensePlate);
        if (ocrResult.licensePlate?.box && imageDimensions) {
          const box = ocrResult.licensePlate.box;
          const relativeBox = {
            xmin: (box.xmin / imageDimensions.width) * 100,
            ymin: (box.ymin / imageDimensions.height) * 100,
            xmax: (box.xmax / imageDimensions.width) * 100,
            ymax: (box.ymax / imageDimensions.height) * 100
          };
          setDetectionBox(relativeBox);
        }
      } else {
        setError('No license plate detected in this image. Please try a clearer photo or enter the plate manually.');
      }
    } catch (err) {
      console.error('OCR Error:', err);
      const errorMessage = err.message || 'Failed to detect license plate. Please try again or enter manually.';
      if (errorMessage.includes("Internal Server Error") || 
          errorMessage.includes("500") || 
          errorMessage.includes("encountered an internal error")) {
        setError('The license plate detection service is currently having technical issues. Please enter the plate manually.');
      }
       else {
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
    setDetectionBox(null);
    setImageDimensions(null); 
    stopCamera();
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleCameraClick = () => {
    setError(''); 
    setIsCameraActive(true);
  };

  const stopCamera = () => {
    setIsCameraActive(false); 
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
          <div className="image-wrapper">
            <img src={previewUrl} alt="Selected car" className="image-preview" />
            {detectionBox && (
              <div 
                className="detection-box"
                style={{
                  left: `${detectionBox.xmin}%`,
                  top: `${detectionBox.ymin}%`,
                  width: `${detectionBox.xmax - detectionBox.xmin}%`,
                  height: `${detectionBox.ymax - detectionBox.ymin}%`
                }}
              />
            )}
          </div>
          
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