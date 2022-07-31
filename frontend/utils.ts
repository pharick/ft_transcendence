import { RequestErrorHandlerContextInterface } from './components/utils/requestErrorHandlerProvider';

export const fetchWithHandleErrors = async (url: string, method: string, requestErrorHandlerContext: RequestErrorHandlerContextInterface) => {
  await requestErrorHandlerContext.requestErrorHandler(async () => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 2000);
    return await fetch(url, {
      method: method,
      signal: controller.signal,
    });
  });
};