import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { CompletedGame, User } from '../../types/interfaces';
import { UserContext } from '../../components/users/userProvider';
import GameInviteButton from '../../components/users/gameInviteButton';
import { useContext } from 'react';
import CompletedGameList from '../../components/games/completedGameList';
import UserBlock from '../../components/users/userBlock';
import UserProfile from '../../components/users/userProfile';

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

      <div className="row">
        <div className="col-lg-3 mx-auto">
          <UserBlock user={user} />

          {userContext.user?.id != user.id ? (
            <ul className="mt-4">
              <li>
                <GameInviteButton user={user} />
              </li>
            </ul>
          ) : (
            <UserProfile />
          )}
        </div>
        <div className="col-lg">
          <h2>Completed games</h2>
          <CompletedGameList games={completedGames} />
        </div>
      </div>
    </>
  );
};

export default UserPage;
