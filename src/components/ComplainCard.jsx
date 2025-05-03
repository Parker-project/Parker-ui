import './ComplainCard.css';

const ComplainCard = ({ violation }) => {
  const {
    id,
    title,
    type,
    description,
    location,
    carPlate,
    photo,
    reporter
  } = violation;

  return (
    <div className="complain-card">
      <div className="card-content">
        <div className="card-header">
          <div className="type-text">{type}</div>
          <h3 className="card-title">{title}</h3>
        </div>

        <div className="card-description">
          <p>{description}</p>
          <p><strong>Car Plate:</strong> {carPlate}</p>
          <p><strong>Reported by:</strong> {reporter.name}</p>
          <p><strong>Contact:</strong> {reporter.contactEmail} / {reporter.contactPhone}</p>
        </div>

        {photo && (
          <div className="card-photo">
            <img src={photo} alt="violation" />
          </div>
        )}

        <div className="card-location">
          <i className="fa-solid fa-location-dot"></i> {location}
        </div>

        <a href={`/violation/${id}`} className="card-button">
          View Report
        </a>
      </div>
    </div>
  );
};

export default ComplainCard;
