// constants/styles.js

export const colors = {
  primary: '#007AFF',        // Apple-style blue
  background: '#F2F2F7',     // Soft light gray background
  white: '#FFFFFF',
  black: '#000000',
  gray: '#CCCCCC',
  lightGray: '#E5E5EA',
  error: '#FF3B30',
  success: '#34C759'
};

export const styles = {
  // Main screen layout
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    display: 'flex',
    justifyContent: 'center',
  },

  // Big title text
  title: {
    fontSize: 28,
    fontWeight: 600,
    textAlign: 'center',
    color: colors.black,
    marginBottom: 24,
  },

  // Email/password input boxes
  input: {
    backgroundColor: colors.white,
    border: `1px solid ${colors.gray}`,
    borderRadius: 10,
    padding: '12px 16px',
    fontSize: 16,
    marginBottom: 16,
    width: '100%',
    boxSizing: 'border-box',
  },

  // Validation error message
  errorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },

  // Remember Me switch row
  rememberMeContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  rememberMeText: {
    fontSize: 16,
    color: colors.black,
  },

  // Modern primary button
  button: {
    backgroundColor: colors.primary,
    padding: '14px 20px',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: `${colors.primary}dd`,
    },
  },

  // Button label text
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 500,
  },

  // Secondary text link (forgot password etc.)
  linkText: {
    color: colors.primary,
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
    textDecoration: 'underline',
    cursor: 'pointer',
  },

  // Optional card layout (for reports, lists, etc.)
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: 16,
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
    '&:hover': {
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      transform: 'translateY(-2px)',
    },
  }
};
