import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { UserInfo } from '../../types/interfaces';
import { userContext } from '../../components/userProvider';

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
  return (
    <>
      <Head>
        <title>User</title>
      </Head>
      <h1> {userInfo.username} </h1>
      <userContext.Consumer>
        {({ user }) => <p>{user ? "It's me" : "It's not me"}</p>}
      </userContext.Consumer>
    </>
  );
};

export default UserPage;
