// api-client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import useSessionStore from '../hooks/auth/user';

const axiosInstance: AxiosInstance = axios.create({
      baseURL: '/api',
});

interface APIError {
      status: 'failed';
      message: string;
}

class APIClient<T> {
      endpoint: string;

      constructor(endpoint: string) {
            this.endpoint = endpoint;
      }

      private formatError = async (error: unknown, originalRequest?: AxiosRequestConfig): Promise<T | APIError> => {
            if (axios.isAxiosError(error)) {
                  const status = error.response?.status;

                  if (!status) {
                        return {
                              status: 'failed',
                              message: 'Network Error: Please check your internet connection.',
                        };
                  }

                  switch (status) {
                        case 404:
                              return {
                                    status: 'failed',
                                    message: error.response?.data?.message || 'Error 404: The requested resource could not be found.',
                              };
                        case 504:
                              return {
                                    status: 'failed',
                                    message: 'Error 504: Gateway Timeout. The server took too long to respond.',
                              };
                        case 429:
                              return {
                                    status: 'failed',
                                    message: 'Error 429: Too many requests. You’ve hit the rate limit.',
                              };
                        default:
                              if (status >= 500) {
                                    return {
                                          status: 'failed',
                                          message: error.response?.data?.message || 'Server Error: Something went wrong. Please try again later.',
                                    };
                              }

                              // Handle auth failure — try reinitializing session and retrying
                              if (error.response?.data?.status === "authFailed" && originalRequest) {
                                    try {
                                          // Reinitialize session
                                          await useSessionStore.getState().initSession(true);

                                          // Retry the original request ONCE
                                          const retryResponse = await axiosInstance({
                                                ...originalRequest,
                                                withCredentials: true,
                                          });

                                          return retryResponse.data as T;
                                    } catch (retryError) {
                                          console.error('Retry after reauth failed:', retryError);
                                          return {
                                                status: 'failed',
                                                message: 'Session expired. Please log in again.',
                                          };
                                    }
                              }

                              return {
                                    status: 'failed',
                                    message:
                                          (error.response?.data?.message as string) ||
                                          'An unknown error occurred.',
                              };
                  }
            }

            return {
                  status: 'failed',
                  message: 'Unexpected Error: Something went wrong.',
            };
      };

      private async request(method: 'get' | 'post' | 'put' | 'delete', data?: Record<string, unknown>): Promise<T> {
            const config: AxiosRequestConfig = {
                  url: this.endpoint,
                  method,
                  data,
                  withCredentials: true,
            };

            try {
                  const response = await axiosInstance.request<T>(config);
                  return response.data;
            } catch (error) {
                  return (await this.formatError(error, config)) as T;
            }
      }

      get() {
            return this.request('get');
      }

      post(data: Record<string, unknown>) {
            return this.request('post', data);
      }

      put(data: Record<string, unknown>) {
            return this.request('put', data);
      }

      delete() {
            return this.request('delete');
      }
}

export default APIClient;

