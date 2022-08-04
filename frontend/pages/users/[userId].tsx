import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { CompletedGame, User } from '../../types/interfaces';
import { UserContext } from '../../components/users/userProvider';
import GameInviteButton from '../../components/users/gameInviteButton';
import Link from 'next/link';
import { useContext } from 'react';
import CompletedGameList from '../../components/games/completedGameList';

interface UserPageProps {
  user: User;
  completedGames: CompletedGame[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userId = context.params?.userId;
  const userResponse = await fetch(
    `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/users/${userId}`,
  );
  if (userResponse.status == 404 || userResponse.status == 400)
    return { notFound: true };
  const user: User = await userResponse.json();
  const completedGamesResponse = await fetch(
    `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/completed/user/${userId}`,
  );
  const completedGames: CompletedGame[] = await completedGamesResponse.json();
  return { props: { user, completedGames } };
};

const UserPage: NextPage<UserPageProps> = ({ user, completedGames }) => {
  const userContext = useContext(UserContext);

  return (
    <>
      <Head>
        <title>Player {user.username}</title>
      </Head>

      <h1>{user.username}</h1>

      {userContext.user?.id != user.id && (
        <>
          <GameInviteButton user={user} />
          <Link href={`/chat/private/${user.id}`}>
            <a className="button">Private chat</a>
          </Link>
        </>
      )}

      <h2>Completed games</h2>
      <CompletedGameList games={completedGames} />
    </>
  );
};

export default UserPage;
