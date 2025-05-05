// constants/api.js

// Switch easily between fake backend and real backend
const USE_FAKE_BACKEND = false;  // Change to false when connecting to Alon's backend

export const API_BASE_URL = USE_FAKE_BACKEND ? '/api/auth' : 'http://localhost:3000/api';
