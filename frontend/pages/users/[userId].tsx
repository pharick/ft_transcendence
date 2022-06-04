import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { UserInfo } from '../../types/interfaces';
import { userContext } from '../../components/userProvider';
import Invite from '../../components/invite';

interface UserPageProps {
  userInfo: UserInfo;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userId = context.params?.userId;
  const response = await fetch(`${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/users/${userId}`);
  if (response.status == 404 || response.status == 400) return { notFound: true };
  const userInfo: UserInfo = await response.json();
  return { props: { userInfo } };
};

const UserPage: NextPage<UserPageProps> = ({ userInfo }) => {
  return (
    <>
      <Head>
        <title>User</title>
      </Head>
      <h1> {userInfo.username} </h1>
      <userContext.Consumer>
        {({ user }) => (
          <Invite currentUser={user} userInfo={userInfo} />
        )}
      </userContext.Consumer>
    </>
  );
};

export default UserPage;
