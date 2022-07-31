import { createContext, FC, ReactNode, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

const Modal = dynamic(() => import('../../components/layout/modal'), { ssr: false });

interface RequestErrorHandlerProviderProps {
  children?: ReactNode;
}

interface RequestErrorHandlerContextInterface {
  requestErrorHandler: (requestHandler: () => Promise<Response | undefined>) => Promise<Response | undefined>;
}

export const RequestErrorHandlerContext = createContext<RequestErrorHandlerContextInterface>({
  requestErrorHandler: async (requestHandler) => { return await requestHandler() }
});

const RequestErrorHandlerProvider: FC<RequestErrorHandlerProviderProps> = ({ children }) => {
  const [isError, setIsError] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);

  const requestErrorHandler = async (requestHandler: () => Promise<Response | undefined>) => {
    try {
      const response = await requestHandler();
      if (response?.status == 403) setIsForbidden(true);
      else if (!response?.ok) setIsError(true);
      return response;
    } catch (e) {
      setIsError(true);
    }
  };

  const closeHandler = () => {
    setIsError(false);
    setIsForbidden(false);
  }

  const value = useMemo(() => ({ requestErrorHandler }), []);

  return (
    <>
      <RequestErrorHandlerContext.Provider value={value}>{children}</RequestErrorHandlerContext.Provider>
      <Modal
        isOpen={isError || isForbidden}
        title={isError ? 'Server error...' : 'Please login'}
        cancelButtonText={'Close'}
        cancelButtonHandler={closeHandler}
      >
        {isError ? <pre className="error-doge"></pre> : <></>}
      </Modal>
    </>
  );
};

export default RequestErrorHandlerProvider;
