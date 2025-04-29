import { useState } from 'react';
import PageWrapper from '../components/PageWrapper';

export default function SubmitReportScreen() {
  const [licensePlate, setLicensePlate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitted(false);

    if (!licensePlate.trim()) {
      alert('License plate is required!');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          licensePlate,
          notes,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setLicensePlate('');
        setNotes('');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to submit report.');
      }
    } catch (err) {
      setError('Server not available. Please try again later.');
    }
  };

  return (
    <PageWrapper>
      <div className="page-container">
        <h2>Submit Parking Violation</h2>

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
