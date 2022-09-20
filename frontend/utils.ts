import { RequestErrorHandlerContextInterface } from './components/utils/requestErrorHandlerProvider';

export interface FetchParams {
  requestErrorHandlerContext: RequestErrorHandlerContextInterface;
  url: string;
  method?: string;
  headers?: HeadersInit;
  body?: Record<string, any> | FormData;
  authRequired?: boolean;
  ignoreCodes?: number[];
}

export const fetchWithHandleErrors = async ({
  requestErrorHandlerContext,
  url,
  method,
  body,
  authRequired,
  ignoreCodes,
}: FetchParams) => {
  const token = localStorage.getItem('token');
  if (ignoreCodes == null) ignoreCodes = [];
  if (authRequired) ignoreCodes.push(401);
  return await requestErrorHandlerContext.requestErrorHandler(async () => {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (body && !(body instanceof FormData))
      headers['Content-Type'] = 'application/json';
    return await fetch(url, {
      method: method || 'GET',
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }, ignoreCodes);
};
