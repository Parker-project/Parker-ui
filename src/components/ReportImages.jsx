import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './ReportImages.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function ReportImages({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadingImages, setLoadingImages] = useState({});
  const [errorImages, setErrorImages] = useState({});

  if (!images || images.length === 0) {
    return null;
  }

  const getImageUrl = (imageId) => {
    const storedData = localStorage.getItem(`image_${imageId}`);
    return storedData || null;
  };

  const handleImageLoad = (imageId) => {
    setLoadingImages(prev => ({ ...prev, [imageId]: false }));
    setErrorImages(prev => ({ ...prev, [imageId]: false }));
  };

  const handleImageError = (imageId) => {
    setLoadingImages(prev => ({ ...prev, [imageId]: false }));
    setErrorImages(prev => ({ ...prev, [imageId]: true }));
  };

  const handleImageClick = (imageId) => {
    const imageUrl = getImageUrl(imageId);
    if (imageUrl) {
      setSelectedImage(imageId);
    }
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div className="report-images">
        {images.map((imageId, index) => {
          const imageUrl = getImageUrl(imageId);
          
          return (
            <div key={index} className="image-thumbnail-container">
              {!imageUrl ? (
                <div className="image-placeholder">
                  <div className="placeholder-icon">📷</div>
                  <div className="placeholder-text">Image #{index + 1}</div>
                </div>
              ) : (
                <img
                  src={imageUrl}
                  alt={`Report image ${index + 1}`}
                  className="image-thumbnail"
                  onClick={() => handleImageClick(imageId)}
                  onLoad={() => handleImageLoad(imageId)}
                  onError={() => handleImageError(imageId)}
                />
              )}
            </div>
          );
        })}
      </div>

      {selectedImage && (
        <div className="image-modal" onClick={closeModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={closeModal}>
              <FaTimes />
            </button>
            <img
              src={getImageUrl(selectedImage)}
              alt="Full size image"
              className="image-modal-img"
            />
          </div>
        </div>
      )}
    </>
  );
} 