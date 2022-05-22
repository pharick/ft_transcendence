import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { GameInfo, UserInfo } from '../../types/interfaces';
import { userContext } from '../../components/userProvider';
import { CreatePendingGameDto } from '../../types/dtos';

interface UserPageProps {
  userInfo: UserInfo;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userId = context.params?.userId;
  const response = await fetch(`http://localhost:3000/api/users/${userId}`);
  if (response.status == 404) return { notFound: true };
  const userInfo: UserInfo = await response.json();
  return { props: { userInfo } };
};

const UserPage: NextPage<UserPageProps> = ({ userInfo }) => {
  const handleGameInvite = async () => {
    const createPendingGameDto: CreatePendingGameDto = {
      guestUserId: userInfo.id,
    };
    const response = await fetch('/api/pending/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createPendingGameDto),
    });
    if (response.status == 401)
      // redirect на страниця логина ? 404
      return;
    const pendingGameInfo = await response.json();
    console.log(pendingGameInfo);
    // setGameList((gameList) => [...gameList, gameInfo]);
  };

  return (
    <>
      <Head>
        <title>User</title>
      </Head>
      <h1> {userInfo.username} </h1>
      <userContext.Consumer>
        {({ user }) => (
          <p>
            {user?.id == userInfo.id ? (
              "It's me"
            ) : (
              <button onClick={handleGameInvite}>Invite to the game</button>
            )}
          </p>
        )}
      </userContext.Consumer>
    </>
  );
};

export default UserPage;
