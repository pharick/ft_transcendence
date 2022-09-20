import { FC, useContext, useState } from 'react';
import { fetchWithHandleErrors } from '../../utils';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { SubmitHandler } from 'react-hook-form';
import { TwoFactorCodeDto } from '../../types/dtos';
import { useRouter } from 'next/router';
import { UserContext } from './userProvider';
import TwoFactorModal from './twoFactorModal';

const TwoFactorSettings: FC = () => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);
  const userContext = useContext(UserContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [isCodeError, setIsCodeError] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>();
  const router = useRouter();

  const getQrCode = async () => {
    const response = await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: '/api/auth/2fa_gen',
      method: 'POST',
    });
    const blob = await response.blob();
    setQrCodeUrl(URL.createObjectURL(blob));
    setModalOpen(true);
  };

  const checkCode: SubmitHandler<TwoFactorCodeDto> = async (data) => {
    const response = await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: '/api/auth/2fa_enable',
      method: 'POST',
      body: data,
    });
    if (response.ok) {
      router.reload();
    } else {
      setIsCodeError(true);
    }
  };

  const disable2Fa = async () => {
    await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: '/api/auth/2fa_disable',
      method: 'POST',
    });
    router.reload();
  };

  return (
    <>
      {userContext.user?.twoFactorEnabled ? (
        <div className="d-flex align-items-center justify-content-between">
          <p>Two-factor auth enabled</p>
          <button onClick={disable2Fa}>Disable</button>
        </div>
      ) : (
        <div className="d-flex align-items-center justify-content-between">
          <p>Two-factor auth disabled</p>
          <button onClick={getQrCode}>Enable</button>
        </div>
      )}

      <TwoFactorModal
        title="Enable two-factor authentication"
        isOpen={modalOpen}
        isCodeError={isCodeError}
        cancelButtonHandler={() => {
          setModalOpen(false);
        }}
        checkCodeHandler={checkCode}
        qrCodeUrl={qrCodeUrl}
      />
    </>
  );
};

export default TwoFactorSettings;
