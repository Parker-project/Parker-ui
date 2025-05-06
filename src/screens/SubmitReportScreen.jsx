import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import Autocomplete from 'react-google-autocomplete';
import PageWrapper from '../components/PageWrapper';

const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '300px',
  marginBottom: '16px',
  borderRadius: '8px'
};

const DEFAULT_CENTER = {
  lat: 31.7683, // Tel Aviv
  lng: 35.2137
};

const LIBRARIES = ['places'];

const INPUT_STYLE = {
  width: '100%',
  height: '40px',
  padding: '8px 12px',
  marginBottom: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc'
};

const BUTTON_STYLE = {
  padding: '8px 12px',
  backgroundColor: '#f0f0f0',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center'
};

const NavigationButtons = ({ onDashboardClick, onMyReportsClick }) => (
  <div style={{ display: 'flex', gap: '10px' }}>
    <button onClick={onDashboardClick} style={BUTTON_STYLE}>
      <span style={{ marginRight: '5px' }}>🏠</span> Dashboard
    </button>
    <button onClick={onMyReportsClick} style={BUTTON_STYLE}>
      <span style={{ marginRight: '5px' }}>📋</span> My Reports
    </button>
  </div>
);

const LocationDisplay = ({ isLoading, location }) => {
  if (isLoading) {
    return (
      <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
        Getting your current location...
      </div>
    );
  }

  if (!location) return null;

  return (
    <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
      <strong>Selected Location:</strong> {location.address || 'Custom Location'}<br />
      <strong>Coordinates:</strong> {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
    </div>
  );
};

export default function SubmitReportScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    licensePlate: '',
    notes: '',
    location: null,
    addressInput: ''
  });
  const [uiState, setUiState] = useState({
    submitted: false,
    error: '',
    isLoadingLocation: true,
    apiError: false
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
    console.warn("Location error:", error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUiState(prev => ({ ...prev, error: '', submitted: false }));

    const { licensePlate, notes, location } = formData;

    if (!licensePlate.trim()) {
      setUiState(prev => ({ ...prev, error: 'License plate is required!' }));
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

    const reportData = {
      liscensePlateNumber: licensePlate,
      description: notes,
      location: {
        latitude: location.lat,
        longitude: location.lng,
        address: location.address
      }
    };

    try {
      const response = await fetch('http://localhost:3000/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(reportData),
      });

      const text = await response.text();
      
      if (response.ok) {
        setUiState(prev => ({ ...prev, submitted: true }));
        setFormData({
          licensePlate: '',
          notes: '',
          location: null,
          addressInput: ''
        });
      } else {
        try {
          const data = JSON.parse(text);
          setUiState(prev => ({ ...prev, error: data.message || 'Failed to submit report.' }));
        } catch {
          setUiState(prev => ({ 
            ...prev, 
            error: `Failed to submit report: ${response.status} ${response.statusText}` 
          }));
        }
      }
    } catch (err) {
      console.error("Error submitting report:", err);
      setUiState(prev => ({ 
        ...prev, 
        error: 'Server not available. Please try again later.' 
      }));
    }
  };

  useEffect(() => {
    if (loadError) {
      console.error("Google Maps loading error:", loadError);
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
        <div className="page-container">
          <h2>Submit Parking Violation</h2>
          <div className="error-message" style={{ padding: '20px', textAlign: 'center' }}>
            <p>Failed to load Google Maps. Please check your internet connection or try again later.</p>
            <p>If you're using an ad blocker, you may need to disable it for this site.</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="page-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Submit Parking Violation</h2>
          <NavigationButtons 
            onDashboardClick={() => navigate('/dashboard')}
            onMyReportsClick={() => navigate('/my-reports')}
          />
        </div>

        {uiState.submitted && (
          <p style={{ color: 'green', textAlign: 'center', marginBottom: '10px' }}>
            ✅ Report submitted successfully!
          </p>
        )}

        {uiState.error && (
          <p className="error-message">{uiState.error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            className="input-field"
            type="text"
            placeholder="License Plate Number"
            value={formData.licensePlate}
            onChange={(e) => handleInputChange('licensePlate', e.target.value)}
          />

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Location
            </label>
            {!isLoaded ? (
              <p>Loading Google Maps...</p>
            ) : (
              <>
                <Autocomplete
                  className="input-field"
                  apiKey={apiKey}
                  onPlaceSelected={handlePlaceSelected}
                  options={{
                    types: ['address'],
                    componentRestrictions: { country: 'il' },
                  }}
                  placeholder="Search for an address"
                  value={formData.addressInput}
                  onChange={(e) => handleInputChange('addressInput', e.target.value)}
                  style={INPUT_STYLE}
                />
                <GoogleMap
                  mapContainerStyle={MAP_CONTAINER_STYLE}
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
                <LocationDisplay 
                  isLoading={uiState.isLoadingLocation}
                  location={formData.location}
                />
              </>
            )}
          </div>

          <textarea
            className="input-field"
            rows="3"
            placeholder="Additional Notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
          />

          <button className="primary-button" type="submit">
            Submit Report
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}
