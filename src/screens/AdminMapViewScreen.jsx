import ReportsMap from '../components/ReportsMap';
import { useNavigate } from 'react-router-dom';
import './AdminScreens.css';


export default function MapViewScreen() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="btn back-btn" onClick={() => navigate(-1)}>⬅</button>
        <h2>Reports Map</h2>
      </div>
      <div className="fullscreen-map-container">
        <ReportsMap/>
      </div>
    </div>
  );
}