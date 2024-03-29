import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { CompletedGame, FriendsNote, User } from '../../types/interfaces';
import { UserContext } from '../../components/users/userProvider';
import GameInviteButton from '../../components/users/gameInviteButton';
import { useContext } from 'react';
import CompletedGameList from '../../components/games/completedGameList';
import UserBlock from '../../components/users/userBlock';
import UserProfile from '../../components/users/userProfile';
import styles from '../../styles/UserPage.module.css';
import TwoFactorSettings from '../../components/users/twoFactorSettings';
import InviteFriendButton from '../../components/users/inviteFriendButton';
import UserFriendsList from '../../components/users/usersFriends';
import DirectMessagesButtons from '../../components/users/directMessagesButtons';

interface UserPageProps {
  user: User;
  completedGames: CompletedGame[];
  friends: FriendsNote[];
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
  const friendsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/friends/${userId}`,
  );
  const friends: FriendsNote[] = await friendsResponse.json();
  return { props: { user, completedGames, friends } };
};

const UserPage: NextPage<UserPageProps> = ({
  user,
  completedGames,
  friends,
}) => {
  const userContext = useContext(UserContext);

  return (
    <>
      <Head>
        <title>{`Player ${user.username}`}</title>
      </Head>

      <div className="row">
        <div className="col-lg-4 col-xl-3 mx-auto">
          <UserBlock user={user} />

          {userContext.user?.id != user.id ? (
            <ul className={`${styles.buttonsList} mt-4 mx-4`}>
              <li>
                <GameInviteButton user={user} />
              </li>
              <li>
                <InviteFriendButton user={user} />
              </li>
              <DirectMessagesButtons user={user} />
            </ul>
          ) : (
            <>
              <UserProfile />
              <TwoFactorSettings />
            </>
          )}
        </div>
        <div className="col-lg">
          <h2>Completed games</h2>
          <CompletedGameList games={completedGames} />

          <h2>Friends</h2>
          <UserFriendsList friendsNotes={friends} />
        </div>
      </div>
    </>
  );
};

export default UserPage;
