// constants/styles.js

import { StyleSheet } from 'react-native';

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

export const styles = StyleSheet.create({
  // Main screen layout
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'center',
  },

  // Big title text
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.black,
    marginBottom: 24,
  },

  // Email/password input boxes
  input: {
    backgroundColor: colors.white,
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
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
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  // Button label text
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
  },

  // Secondary text link (forgot password etc.)
  linkText: {
    color: colors.primary,
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
    textDecorationLine: 'underline',
  },

  // Optional card layout (for reports, lists, etc.)
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 16,
  }
});
