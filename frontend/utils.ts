import { RequestErrorHandlerContextInterface } from './components/utils/requestErrorHandlerProvider';

export interface FetchParams {
  requestErrorHandlerContext: RequestErrorHandlerContextInterface;
  url: string;
  token?: string;
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit;
}

export const fetchWithHandleErrors = async (params: FetchParams) => {
  return await params.requestErrorHandlerContext.requestErrorHandler(
    async () => {
      return await fetch(params.url, {
        method: params.method || 'GET',
        headers: {
          ...params.headers,
          Authorization: `Bearer ${params.token}`,
        },
        body: params.body,
      });
    },
    Boolean(params.token),
  );
};
