import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { GoogleMap, Marker, useJsApiLoader, LoadScript } from '@react-google-maps/api';
import Autocomplete from 'react-google-autocomplete';

const mapContainerStyle = {
  width: '100%',
  height: '300px',
  marginBottom: '16px',
  borderRadius: '8px'
};

const defaultCenter = {
  lat: 31.7683, // Default to Tel Aviv
  lng: 35.2137
};

const libraries = ['places'];

export default function SubmitReportScreen() {
  const navigate = useNavigate();
  const [licensePlate, setLicensePlate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [map, setMap] = useState(null);
  const [apiError, setApiError] = useState(false);
  const [addressInput, setAddressInput] = useState('');

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  console.log("Google Maps API Key length:", apiKey ? apiKey.length : 'not found');

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries
  });

  useEffect(() => {
    if (loadError) {
      console.error("Google Maps loading error:", loadError);
      setApiError(true);
    }
  }, [loadError]);

  const onLoad = useCallback((map) => {
    console.log("Map loaded successfully");
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handlePlaceSelected = (place) => {
    console.log("Place selected:", place);
    
    if (place && place.geometry) {
      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: place.formatted_address
      };
      console.log("Setting location:", newLocation);
      setLocation(newLocation);
      setCenter(newLocation);
      setAddressInput(place.formatted_address);
    } else {
      console.warn("Selected place had no geometry:", place);
    }
  };

  const handleMarkerDragEnd = (e) => {
    const newLatLng = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };

    // Using the Geocoding service to get the address
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: newLatLng }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const newLocation = {
          lat: newLatLng.lat,
          lng: newLatLng.lng,
          address: results[0].formatted_address
        };
        console.log("New marker position with address:", newLocation);
        setLocation(newLocation);
        setAddressInput(results[0].formatted_address);
      } else {
        console.warn("Geocoding failed:", status);

        // Fallback to just coordinates if geocoding fails
        const newLocation = {
          lat: newLatLng.lat,
          lng: newLatLng.lng,
          address: 'Custom Location'
        };
        setLocation(newLocation);
        setAddressInput('Custom Location');
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitted(false);

    if (!licensePlate.trim()) {
      setError('License plate is required!');
      return;
    }

    if (!notes.trim()) {
      setError('Description is required!');
      return;
    }

    if (!location) {
      setError('Please select a location on the map!');
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
    
    console.log("Submitting report:", reportData);

    try {
      const response = await fetch('http://localhost:3000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify(reportData),
      });

      console.log("Response status:", response.status);
      
      const text = await response.text();
      console.log("Response text:", text);
      
      if (response.ok) {
        setSubmitted(true);
        setLicensePlate('');
        setNotes('');
        setLocation(null);
        setAddressInput('');
      } else {

        try {
          const data = JSON.parse(text);
          setError(data.message || 'Failed to submit report.');
        } catch (parseError) {
          setError(`Failed to submit report: ${response.status} ${response.statusText}`);
        }
      }
    } catch (err) {
      console.error("Error submitting report:", err);
      setError('Server not available. Please try again later.');
    }
  };

  if (apiError) {
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
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '8px 12px',
                backgroundColor: '#f0f0f0',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <span style={{ marginRight: '5px' }}>🏠</span> Dashboard
            </button>
            <button 
              onClick={() => navigate('/my-reports')}
              style={{
                padding: '8px 12px',
                backgroundColor: '#f0f0f0',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <span style={{ marginRight: '5px' }}>📋</span> My Reports
            </button>
          </div>
        </div>

        {submitted && (
          <p style={{ color: 'green', textAlign: 'center', marginBottom: '10px' }}>
            ✅ Report submitted successfully!
          </p>
        )}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            className="input-field"
            type="text"
            placeholder="License Plate Number"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
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
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '8px 12px',
                    marginBottom: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                />
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={15}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                >
                  {location && (
                    <Marker
                      position={location}
                      draggable={true}
                      onDragEnd={handleMarkerDragEnd}
                    />
                  )}
                </GoogleMap>
                {location && (
                  <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
                    <strong>Selected Location:</strong> {location.address || 'Custom Location'}<br />
                    <strong>Coordinates:</strong> {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </div>
                )}
              </>
            )}
          </div>

          <textarea
            className="input-field"
            rows="3"
            placeholder="Additional Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <button
            className="primary-button"
            type="submit"
          >
            Submit Report
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}
