import { FC } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TwoFactorCodeDto } from '../../types/dtos';
import styles from '../../styles/TwoFactorModal.module.css';

const Modal = dynamic(() => import('../../components/layout/modal'), {
  ssr: false,
});

interface TwoFactorModalProps {
  title: string;
  isOpen: boolean;
  isCodeError: boolean;
  cancelButtonHandler: () => void;
  checkCodeHandler: SubmitHandler<TwoFactorCodeDto>;
  qrCodeUrl?: string;
}

const TwoFactorModal: FC<TwoFactorModalProps> = ({
  title,
  isOpen,
  isCodeError,
  cancelButtonHandler,
  checkCodeHandler,
  qrCodeUrl,
}) => {
  const codeForm = useForm<TwoFactorCodeDto>();

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      cancelButtonText="Cancel"
      cancelButtonHandler={cancelButtonHandler}
    >
      <div className={styles.wrapper}>
        {qrCodeUrl && <Image src={qrCodeUrl} width={200} height={200} />}

        {isCodeError && (
          <p className={styles.error}>Invalid code. Try again.</p>
        )}

        <form onSubmit={codeForm.handleSubmit(checkCodeHandler)}>
          <input
            type="text"
            placeholder="Google Authenticator code"
            {...codeForm.register('code', { required: true })}
          />
          <button type="submit">Check</button>
        </form>
      </div>
    </Modal>
  );
};

export default TwoFactorModal;
