import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import UserHeaderBlock from '../users/userHeaderBlock';
import { UserContext } from '../users/userProvider';

const Modal = dynamic(() => import('../../components/layout/modal'), {
  ssr: false,
});

interface RequestErrorHandlerProviderProps {
  children?: ReactNode;
}

type RequestHandler = () => Promise<Response | undefined>;
type RequestErrorHandler = (
  requestHandler: RequestHandler,
  ignoreCodes: number[],
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
  const userContext = useContext(UserContext);
  const [result, setResult] = useState(RequestResult.Success);
  const [response, setResponse] = useState<Response | undefined>();

  const requestErrorHandler = async (
    requestHandler: () => Promise<Response | undefined>,
    ignoreCodes: number[] = [],
  ) => {
    const response = await requestHandler();
    if (response?.status == 401 && !ignoreCodes.includes(401)) {
      userContext.handleLogout();
      setResult(RequestResult.Unauthorized);
    } else if (
      !response?.ok &&
      response?.status != 401 &&
      !ignoreCodes.includes(response?.status)
    ) {
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
          <div className="d-flex">
            <p>You must be authenticated to do this</p>
            <UserHeaderBlock onLogin={closeHandler} />
          </div>
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
