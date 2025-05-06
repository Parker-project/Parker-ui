import { useEffect, useState } from 'react';
import PageWrapper from '../components/PageWrapper';

export default function InspectorDashboardScreen() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/reports', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports');
        setLoading(false);
      });
  }, []);

  const handleMarkAsHandled = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/reports/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          handled: true
        }),
      });

      if (!response.ok) throw new Error('Failed to mark as handled');

      const updated = await response.json();

      // Update the report in local state
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, handled: true } : r))
      );
    } catch (err) {
      alert('Error: Could not update report');
    }
  };

  const handleDeleteReport = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/reports/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete report');

      // Remove the deleted report from local state
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert('Error: Could not delete report');
    }
  };

  return (
    <PageWrapper>
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">📋 Reports To Handle</h2>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      <div className="space-y-4">
        {reports.length === 0 && !loading && <p className="text-center">No reports available.</p>}

        {reports.map((report) => (
          <div
            key={report.id}
            className="border border-gray-300 p-4 rounded-lg shadow-sm bg-white"
          >
            <p><strong>Plate:</strong> {report.licensePlate}</p>
            <p><strong>Notes:</strong> {report.notes || '-'}</p>
            <p><strong>Status:</strong> {report.handled ? '✅ Handled' : '❌ Pending'}</p>
            <p><strong>Time:</strong> {new Date(report.timestamp).toLocaleString()}</p>

            <div className="flex gap-2 mt-4">
              {!report.handled && (
                <button
                  onClick={() => handleMarkAsHandled(report.id)}
                  className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                >
                  Mark as Handled
                </button>
              )}
              <button
                onClick={() => handleDeleteReport(report.id)}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
