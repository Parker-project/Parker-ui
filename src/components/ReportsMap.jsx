import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { useEffect, useState, useMemo } from 'react';
import { getAllReports } from '../utils/api'; 

const containerStyle = {
  width: '100%',
  height: '600px',
};

const defaultCenter = {
  lat: 32.0853,
  lng: 34.7818,
};

export default function ReportsMap() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  const LIBRARIES = ['places'];
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: LIBRARIES
  });
  
  

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getAllReports();
      setReports(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err.message || 'Failed to load reports.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return <div>Loading map...</div>;
  if (loading) return <div>Loading reports...</div>;
  if (error) return <div>{error}</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={10}>
      {reports.map((report) =>
        report.location ? (
          <Marker
            key={report._id}
            position={{
              lat: report.location.latitude,
              lng: report.location.longitude,
            }}
            title={report.description}
            onClick={() => setSelectedReport(report)}
          />
        ) : null
      )}

    {selectedReport && selectedReport.location && (
        <InfoWindow
          position={{
            lat: selectedReport.location.latitude,
            lng: selectedReport.location.longitude
          }}
          onCloseClick={() => setSelectedReport(null)} // ⬅️ Close info window
        >
          <div style={{ maxWidth: '250px' }}>
            <h3>{selectedReport.description}</h3>
            <p><strong>Plate:</strong> {selectedReport.liscensePlateNumber}</p>
            <p><strong>Status:</strong> {selectedReport.status}</p>
            <p><strong>Address:</strong> {selectedReport.location.address}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

