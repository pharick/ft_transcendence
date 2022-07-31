import { RequestErrorHandlerContextInterface } from './components/utils/requestErrorHandlerProvider';

export const fetchWithHandleErrors = async (
  requestErrorHandlerContext: RequestErrorHandlerContextInterface,
  url: string,
  authRequired = false,
  method = 'GET',
  headers: HeadersInit | undefined = undefined,
  body: BodyInit | null | undefined = undefined,
) => {
  return await requestErrorHandlerContext.requestErrorHandler(async () => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 2000);
    return await fetch(url, {
      method: method,
      headers,
      body,
      signal: controller.signal,
    });
  }, authRequired);
};
