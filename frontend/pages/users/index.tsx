import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { User } from '../../types/interfaces';
import Link from 'next/link';
import Head from 'next/head';

interface UsersPageProps {
  users: User[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/users`,
  );
  const users: User[] = await response.json();
  return { props: { users } };
};

const UsersPage: NextPage<UsersPageProps> = ({ users }) => {
  return (
    <>
      <Head>
        <title>Players</title>
      </Head>

      <h1>Players</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link href={`/users/${user.id}`}>
              <a>{user.username}</a>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default UsersPage;
