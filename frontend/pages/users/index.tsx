import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { UserInfo } from '../../types/interfaces';
import Link from 'next/link';

interface UsersPageProps {
  users: UserInfo[],
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await fetch('http://localhost:3000/api/users');
  const users: UserInfo[] = await response.json();
  return { props: { users } };
};

const UsersPage: NextPage<UsersPageProps> = ({ users }) => {
  return (
    <>
      <h1>Users</h1>
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
