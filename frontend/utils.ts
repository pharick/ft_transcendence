import { RequestErrorHandlerContextInterface } from './components/utils/requestErrorHandlerProvider';

export interface FetchParams {
  requestErrorHandlerContext: RequestErrorHandlerContextInterface;
  url: string;
  method?: string;
  headers?: HeadersInit;
  body?: Record<string, any>;
  authRequired?: boolean;
}

export const fetchWithHandleErrors = async ({
  requestErrorHandlerContext,
  url,
  method,
  headers,
  body,
  authRequired,
}: FetchParams) => {
  const token = localStorage.getItem('token');
  return await requestErrorHandlerContext.requestErrorHandler(async () => {
    return await fetch(url, {
      method: method || 'GET',
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }, authRequired || false);
};
