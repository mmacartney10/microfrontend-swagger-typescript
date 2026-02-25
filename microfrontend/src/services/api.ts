import { Api } from '@swagger-ts/api-client';

// Create API client instance
export const apiClient = new Api({
  baseUrl: 'http://localhost:4000',
  baseApiParams: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
});

// Export the API client for direct use in hooks
export default apiClient;