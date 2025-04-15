import { useState } from 'react';

export default function SubmitReportScreen() {
  const [licensePlate, setLicensePlate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!licensePlate.trim()) {
      alert('License plate is required!');
      return;
    }

    // For now, just simulate submission
    console.log('Report submitted:', { licensePlate, notes });

    setSubmitted(true);
    setLicensePlate('');
    setNotes('');
  };

  return (
    <div style={styles.container}>
      <h2>Submit a Parking Violation Report</h2>

      {submitted && <p style={{ color: 'green' }}>Report submitted successfully!</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>License Plate Number:</label>
        <input
          style={styles.input}
          type="text"
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
          placeholder="e.g., 123-456-78"
        />

        <label style={styles.label}>Additional Notes (optional):</label>
        <textarea
          style={{ ...styles.input, height: '80px' }}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g., Blocking a driveway..."
        />

        <button type="submit" style={styles.button}>
          Submit Report
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '3rem auto',
    padding: '2rem',
    border: '1px solid #ccc',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontFamily: 'sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  label: {
    fontWeight: 'bold',
  },
  input: {
    padding: '0.6rem',
    fontSize: '1rem',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '0.75rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};
