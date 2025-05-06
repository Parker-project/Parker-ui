import { Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';

export default function EmailNotVerifiedScreen() {
  return (
    <PageWrapper>
      <div className="page-container" style={{ textAlign: 'center', padding: '2rem 1rem', maxWidth: '500px', margin: '0 auto' }}>
        <h2>Email Not Verified</h2>

        <p style={{ marginTop: '1rem', fontSize: '1.1rem', color: '#555' }}>
          Please verify your email to continue using the app.
        </p>

        <p style={{ marginTop: '1.5rem' }}>
          Didn’t get the email?{' '}
          <Link to="/resend-verification" style={{ color: '#007bff', fontWeight: 'bold' }}>
            Resend it here
          </Link>
        </p>
      </div>
    </PageWrapper>
  );
}
