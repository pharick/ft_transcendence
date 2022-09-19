import { FC, useContext, useState } from 'react';
import { fetchWithHandleErrors } from '../../utils';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import styles from '../../styles/TwoFactorSettings.module.css';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TwoFactorCodeDto } from '../../types/dtos';
import { useRouter } from 'next/router';
import { UserContext } from './userProvider';

const Modal = dynamic(() => import('../../components/layout/modal'), {
  ssr: false,
});

const TwoFactorSettings: FC = () => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);
  const userContext = useContext(UserContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>();
  const [isCodeError, setIsCodeError] = useState(false);
  const codeForm = useForm<TwoFactorCodeDto>();
  const router = useRouter();

  const handle2FactorEnable = async () => {
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

  return (
    <>
      {userContext.user?.twoFactorEnabled ? (
        <div className="d-flex align-items-center justify-content-between">
          <p>Two-factor auth enabled</p>
        </div>
      ) : (
        <div className="d-flex align-items-center justify-content-between">
          <p>Two-factor auth disabled</p>
          <button onClick={handle2FactorEnable}>Enable</button>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        title="Enable two-factor authentication"
        cancelButtonText="Cancel"
        cancelButtonHandler={() => {
          setModalOpen(false);
        }}
      >
        <div className={styles.wrapper}>
          <Image src={qrCodeUrl} width={200} height={200} />

          {isCodeError && (
            <p className={styles.error}>Invalid code. Try again.</p>
          )}

          <form onSubmit={codeForm.handleSubmit(checkCode)}>
            <input
              type="text"
              placeholder="Google Authenticator code"
              {...codeForm.register('code', { required: true })}
            />
            <button type="submit">Check</button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default TwoFactorSettings;
