import { useState } from 'react';
import PageWrapper from '../components/PageWrapper';

export default function SubmitReportScreen() {
  const [licensePlate, setLicensePlate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageUri(imageUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!licensePlate.trim()) {
      alert('License plate is required!');
      return;
    }

    setSubmitted(true);
    setLicensePlate('');
    setNotes('');
    setImageUri(null);
  };

  return (
    <PageWrapper>
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">
        🚗 Submit Parking Violation
      </h2>

      {submitted && (
        <p className="text-green-600 text-center mb-4">
          ✅ Report submitted successfully!
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            License Plate Number
          </label>
          <input
            type="text"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        {imageUri && (
          <div className="flex justify-center my-4">
            <img
              src={imageUri}
              alt="Uploaded Preview"
              className="w-48 h-48 object-cover rounded-lg"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Submit Report
        </button>
      </form>
    </PageWrapper>
  );
}
