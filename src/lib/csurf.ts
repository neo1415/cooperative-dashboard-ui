import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Using Next.js environment variables (frontend should have NEXT_PUBLIC prefix)
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
const CSRF_TOKEN_ENDPOINT = `${BASE_URL}/csrf-token`;

// Define function return type and error handling
const getCsrfToken = async (): Promise<string> => {
  try {
    const response: AxiosResponse<{ csrfToken: string }> = await axios.get(CSRF_TOKEN_ENDPOINT, { withCredentials: true });
    const csrfToken = response.data.csrfToken;
    return csrfToken;
  } catch (error: any) {
    console.error('Error fetching CSRF Token:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Generic function for CSRF-protected requests
const csrfProtectedRequest = async (method: 'get' | 'post' | 'delete', url: string, data?: any): Promise<AxiosResponse> => {
  const csrfToken = await getCsrfToken();
  const timestamp = Date.now().toString();

  const config: AxiosRequestConfig = {
    method,
    url,
    headers: {
      'CSRF-Token': csrfToken,
      'x-timestamp': timestamp,
      ...(method !== 'delete' && { 'Content-Type': 'application/json' }), // use 'delete' lowercase
    },
    withCredentials: true,
    ...(data && { data }), // Only include data if provided
  };

  const response: AxiosResponse = await axios(config);
  return response;
};

// Specific methods for POST, GET, DELETE
export const csrfProtectedPost = (url: string, data: any): Promise<AxiosResponse> => csrfProtectedRequest('post', url, data);
export const csrfProtectedGet = (url: string): Promise<AxiosResponse> => csrfProtectedRequest('get', url);
export const csrfProtectedDelete = (url: string): Promise<AxiosResponse> => csrfProtectedRequest('delete', url);
