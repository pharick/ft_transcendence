import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { CompletedGameInfo, UserInfo } from '../../types/interfaces';
import { UserContext } from '../../components/users/userProvider';
import Invite from '../../components/users/invite';
import Link from 'next/link';
import { useContext } from 'react';

interface UserPageProps {
  userInfo: UserInfo;
  completedGames: CompletedGameInfo[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userId = context.params?.userId;
  const userResponse = await fetch(`${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/users/${userId}`);
  if (userResponse.status == 404 || userResponse.status == 400) return { notFound: true };
  const userInfo: UserInfo = await userResponse.json();
  const completedGamesResponse = await fetch(`${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/completed/user/${userId}`);
  const completedGames: CompletedGameInfo[] = await completedGamesResponse.json();
  return { props: { userInfo, completedGames } };
};

const UserPage: NextPage<UserPageProps> = ({ userInfo, completedGames }) => {

  const userContext = useContext(UserContext);

  return (
    <>
      <Head>
        <title>Player {userInfo.username}</title>
      </Head>

      <h1> {userInfo.username} </h1>

      {userContext.user?.id != userInfo.id &&
        <>
          <Invite userInfo={userInfo} />
          <Link href={`/chat/private/${userInfo.id}`}>
            <a className="button">Private chat</a>
          </Link>
        </>
      }

      <ul>
        {completedGames.map((game) => (
          <li key={game.id}>
            {game.hostUser.username}: {game.score1} {game.guestUser.username}: {game.score2}
          </li>
        ))}
      </ul>
    </>
  );
};

export default UserPage;
