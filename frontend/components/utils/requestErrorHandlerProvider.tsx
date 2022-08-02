import { createContext, FC, ReactNode, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

const Modal = dynamic(() => import('../../components/layout/modal'), {
  ssr: false,
});

interface RequestErrorHandlerProviderProps {
  children?: ReactNode;
}

type RequestHandler = () => Promise<Response | undefined>;
type RequestErrorHandler = (
  requestHandler: RequestHandler,
  authRequired: boolean,
) => Promise<Response | undefined>;

export interface RequestErrorHandlerContextInterface {
  requestErrorHandler: RequestErrorHandler;
}

enum RequestResult {
  Success,
  Unauthorized,
  Error,
}

export const RequestErrorHandlerContext =
  createContext<RequestErrorHandlerContextInterface>({
    requestErrorHandler: async (requestHandler) => {
      return await requestHandler();
    },
  });

const RequestErrorHandlerProvider: FC<RequestErrorHandlerProviderProps> = ({
  children,
}) => {
  const [result, setResult] = useState(RequestResult.Success);
  const [response, setResponse] = useState<Response | undefined>();

  const requestErrorHandler = async (
    requestHandler: () => Promise<Response | undefined>,
    authRequired = false,
  ) => {
    const response = await requestHandler();
    if (authRequired && response?.status == 401) {
      setResult(RequestResult.Unauthorized);
    } else if (!response?.ok && response?.status != 401) {
      setResult(RequestResult.Error);
      setResponse(response);
    }
    return response;
  };

  const closeHandler = () => {
    setResult(RequestResult.Success);
    setResponse(undefined);
  };

  const value = useMemo(() => ({ requestErrorHandler }), []);

  return (
    <>
      <RequestErrorHandlerContext.Provider value={value}>
        {children}
      </RequestErrorHandlerContext.Provider>
      <Modal
        isOpen={result != RequestResult.Success}
        title={
          result == RequestResult.Unauthorized
            ? 'Please login'
            : 'Server error...'
        }
        cancelButtonText={'Close'}
        cancelButtonHandler={closeHandler}
      >
        {result == RequestResult.Unauthorized ? (
          <></>
        ) : (
          <>
            <p>
              <b>Url:</b> {response?.url}
            </p>
            <p>
              <b>Status:</b> {response?.status}
            </p>
          </>
        )}
      </Modal>
    </>
  );
};

export default RequestErrorHandlerProvider;
