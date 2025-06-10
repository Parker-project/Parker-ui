import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import Autocomplete from 'react-google-autocomplete';
import { FaArrowLeft, FaCheck, FaUpload } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import PageWrapper from '../components/PageWrapper';
import ImageUpload from '../components/ImageUpload';
import { submitReport, getUserProfile } from '../utils/api';
import './SubmitReportScreen.css';

const LIBRARIES = ['places'];

const DEFAULT_CENTER = {
  lat: 31.7683, // Tel Aviv
  lng: 35.2137
};

const LocationDisplay = ({ isLoading, location }) => {
  if (isLoading) {
    return (
      <div className="loading-indicator">
        Getting your current location...
      </div>
    );
  }

  if (!location) return null;

  return (
    <div className="location-info">
      <strong>Selected Location:</strong> {location.address || 'Custom Location'}<br />
      <strong>Coordinates:</strong> <span className="coordinates">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</span>
    </div>
  );
};

export default function SubmitReportScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    licensePlate: '',
    notes: '',
    location: null,
    addressInput: '',
    image: null,
    additionalImages: []
  });
  const [uiState, setUiState] = useState({
    submitted: false,
    error: '',
    isLoadingLocation: true,
    apiError: false,
    ocrSuccess: false
  });
  const [mapState, setMapState] = useState({
    center: DEFAULT_CENTER,
    map: null
  });

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: LIBRARIES
  });

  // Map handlers
  const onLoad = useCallback((map) => {
    setMapState(prev => ({ ...prev, map }));
  }, []);

  const onUnmount = useCallback(() => {
    setMapState(prev => ({ ...prev, map: null }));
  }, []);

  // Location handlers
  const handlePlaceSelected = useCallback((place) => {
    if (!place?.geometry) {
      console.warn("Selected place had no geometry:", place);
      return;
    }

    const newLocation = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      address: place.formatted_address
    };

    setFormData(prev => ({
      ...prev,
      location: newLocation,
      addressInput: place.formatted_address
    }));
    setMapState(prev => ({ ...prev, center: newLocation }));
  }, []);

  const handleMarkerDragEnd = useCallback((e) => {
    const newLatLng = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: newLatLng }, (results, status) => {
      const newLocation = {
        lat: newLatLng.lat,
        lng: newLatLng.lng,
        address: status === 'OK' && results[0] 
          ? results[0].formatted_address 
          : 'Custom Location'
      };

      setFormData(prev => ({
        ...prev,
        location: newLocation,
        addressInput: newLocation.address
      }));
    });
  }, []);

  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      handleLocationError('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: userLocation }, (results, status) => {
          const newLocation = {
            ...userLocation,
            address: status === 'OK' && results[0] 
              ? results[0].formatted_address 
              : 'Current Location'
          };

          setFormData(prev => ({
            ...prev,
            location: newLocation,
            addressInput: newLocation.address
          }));
          setMapState(prev => ({ ...prev, center: userLocation }));
          setUiState(prev => ({ ...prev, isLoadingLocation: false }));
        });
      },
      (error) => handleLocationError(error)
    );
  }, []);

  const handleLocationError = useCallback((error) => {
    setFormData(prev => ({
      ...prev,
      location: { ...DEFAULT_CENTER, address: 'Default Location' },
      addressInput: 'Default Location'
    }));
    setUiState(prev => ({ ...prev, isLoadingLocation: false }));
  }, []);

  // Form handlers
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // OCR handlers
  const handleLicensePlateDetected = useCallback((licensePlate) => {
    setFormData(prev => ({ ...prev, licensePlate }));
    setUiState(prev => ({ ...prev, ocrSuccess: true }));
    
    setTimeout(() => {
      setUiState(prev => ({ ...prev, ocrSuccess: false }));
    }, 3000);
  }, []);

  const handleImageSelected = useCallback((imageFile) => {
    setFormData(prev => ({ ...prev, image: imageFile }));
  }, []);

  const handleAdditionalImagesSelected = useCallback((e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, additionalImages: files }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUiState(prev => ({ ...prev, error: '', submitted: false }));

    const { licensePlate, notes, location } = formData;

    if (!licensePlate.trim()) {
      setUiState(prev => ({ ...prev, error: 'License plate is required!' }));
      return;
    }

    const cleanedPlate = licensePlate.replace(/-/g, '');

    // Enforce 6-8 digits only (after removing dashes)
    if (!/^\d{6,8}$/.test(cleanedPlate)) {
      setUiState(prev => ({ ...prev, error: 'License plate must be 6 to 8 digits (numbers only)' }));
      return;
    }

    if (!notes.trim()) {
      setUiState(prev => ({ ...prev, error: 'Description is required!' }));
      return;
    }

    if (!location) {
      setUiState(prev => ({ ...prev, error: 'Please select a location on the map!' }));
      return;
    }

    try {
      const userProfile = await getUserProfile();
      const allImages = [];
      if (formData.image) allImages.push(formData.image);
      if (formData.additionalImages) allImages.push(...formData.additionalImages);

      const reportData = {
        userId: userProfile.id,
        liscensePlateNumber: cleanedPlate,
        description: notes,
        location: {
          latitude: location.lat,
          longitude: location.lng,
          address: location.address
        },
        images: allImages
      };

      await submitReport(reportData);
      setUiState(prev => ({ ...prev, submitted: true }));
      setFormData({
        licensePlate: '',
        notes: '',
        location: null,
        addressInput: '',
        image: null,
        additionalImages: []
      });
    } catch (err) {
      setUiState(prev => ({ 
        ...prev, 
        error: err.message || 'Failed to submit report. Please try again later.' 
      }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (loadError) {
      setUiState(prev => ({ ...prev, apiError: true }));
    }
  }, [loadError]);

  useEffect(() => {
    if (isLoaded && !uiState.apiError) {
      getUserLocation();
    }
  }, [isLoaded, uiState.apiError, getUserLocation]);

  if (uiState.apiError) {
    return (
      <PageWrapper>
        <div className="report-container">
          <div className="report-header">
            <h2>Submit Parking Violation</h2>
          </div>
          <div className="api-error">
            <p>Failed to load Google Maps. Please check your internet connection or try again later.</p>
            <p>If you're using an ad blocker, you may need to disable it for this site.</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="report-container">
        <div className="report-header">
          <h2>Submit Parking Violation</h2>
          <button 
            type="button" 
            className="btn btn-secondary back-btn" 
            onClick={() => navigate('/dashboard')}
            aria-label="Back to Dashboard"
          >
            <FaArrowLeft />
          </button>
        </div>

        {uiState.submitted && (
          <div className="success-message">
            Report submitted successfully!
          </div>
        )}

        {uiState.error && (
          <div className="error-message">{uiState.error}</div>
        )}

        {uiState.ocrSuccess && (
          <div className="success-message ocr-success">
            <FaCheck /> License plate detected successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          <div className="form-group">
            <label className="form-label">Car Photo (for license plate detection)</label>
            <ImageUpload 
              onLicensePlateDetected={handleLicensePlateDetected} 
              onImageSelected={handleImageSelected}
            />
            <small className="form-helper-text">Upload a photo of the car to automatically detect the license plate</small>
          </div>

          <div className="form-group">
            <label className="form-label">Additional Images</label>
            <div className="additional-images-upload">
              {formData.additionalImages.length === 0 ? (
                <div className="upload-placeholder">
                  <div className="upload-buttons">
                    <button type="button" onClick={() => document.getElementById('additional-images-input').click()} className="upload-button">
                      <FaUpload className="upload-icon" />
                      <span>Upload Photos</span>
                    </button>
                  </div>
                  <small>Select multiple photos to support your report</small>
                </div>
              ) : (
                <div className="images-preview-container">
                  <div className="images-grid">
                    {formData.additionalImages.map((file, index) => (
                      <div key={index} className="image-preview-item">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={`Additional ${index + 1}`} 
                          className="additional-image-preview"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="additional-images-actions">
                    <button 
                      type="button" 
                      className="clear-button" 
                      onClick={() => setFormData(prev => ({ ...prev, additionalImages: [] }))}
                    >
                      <MdCancel /> Clear All
                    </button>
                    <button 
                      type="button" 
                      className="upload-button" 
                      onClick={() => document.getElementById('additional-images-input').click()}
                    >
                      <FaUpload /> Add More
                    </button>
                  </div>
                </div>
              )}
              <input
                id="additional-images-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleAdditionalImagesSelected}
                className="file-input"
                style={{ display: 'none' }}
              />
            </div>
            <small className="form-helper-text">Upload additional photos to support your report (optional)</small>
          </div>

          <div className="form-group">
            <label className="form-label">License Plate</label>
            <input
              className="form-input"
              type="text"
              placeholder="XX-XXX-XX"
              value={formData.licensePlate}
              onChange={(e) => handleInputChange('licensePlate', e.target.value)}
            />
            <small className="form-helper-text">Enter 6-8 digits (dashes will be removed)</small>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            {!isLoaded ? (
              <div className="loading-indicator">Loading Google Maps...</div>
            ) : (
              <>
                <Autocomplete
                  className="address-search"
                  apiKey={apiKey}
                  onPlaceSelected={handlePlaceSelected}
                  options={{
                    types: ['address'],
                    componentRestrictions: { country: 'il' },
                  }}
                  placeholder="Search for an address"
                  value={formData.addressInput}
                  onChange={(e) => handleInputChange('addressInput', e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <div className="map-container">
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={mapState.center}
                    zoom={15}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                  >
                    {formData.location && (
                      <Marker
                        position={formData.location}
                        draggable={true}
                        onDragEnd={handleMarkerDragEnd}
                      />
                    )}
                  </GoogleMap>
                </div>
                <LocationDisplay 
                  isLoading={uiState.isLoadingLocation}
                  location={formData.location}
                />
              </>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Additional Notes</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Describe the parking violation"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>

          <button 
            className="btn btn-primary" 
            type="button" 
            onClick={handleSubmit}
          >
            Submit Report
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}
