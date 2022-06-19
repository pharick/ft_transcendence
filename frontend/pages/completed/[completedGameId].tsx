import type { GetServerSideProps, NextPage } from 'next';

import { userContext } from '../../components/userProvider';
import { CompletedGameInfo } from '../../types/interfaces';

interface CompletedGamePageProps {
  completedGameInfo: CompletedGameInfo;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const completedGameId = context.params?.completedGameId;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/completed/${completedGameId}`,
  );
  if (response.status == 404) return { notFound: true };
  const completedGameInfo: CompletedGameInfo = await response.json();
  console.log(completedGameInfo);
  return { props: { completedGameInfo } };
};

const CompletedGamePage: NextPage<CompletedGamePageProps> = ({
  completedGameInfo,
}) => {
  return (
    <h1>
      Game{' '}
      <b>
        {completedGameInfo.hostUser
          ? completedGameInfo.hostUser.username
          : 'Mr. Wall'}
      </b>{' '}
      vs.{' '}
      <b>
        {completedGameInfo.guestUser
          ? completedGameInfo.guestUser.username
          : 'Mr.Wall'}
      </b>{' '}
      is completed
    </h1>
  );
};

export default CompletedGamePage;
