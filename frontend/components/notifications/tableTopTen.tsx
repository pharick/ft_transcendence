import React, { FC, useContext, useEffect, useState } from 'react';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { fetchWithHandleErrors } from '../../utils';
import { User } from '../../types/interfaces';
import styles from '../../styles/TableTopTen.module.css';

const TableTopTen: FC = () => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);
  const [topTenList, setTopTen] = useState<User[]>([]);

  const compare = (a: User, b: User) => {
    return b.rank - a.rank;
  };

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetchWithHandleErrors({
        requestErrorHandlerContext,
        url: '/api/users',
        method: 'GET',
      });
      const users = await response.json();
      setTopTen(users.sort(compare).slice(0, 10));
    };
    getUsers().then();
  }, []);

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            <th>Nickname</th>
            <th>Wins</th>
            <th>Loses</th>
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
          {topTenList.map((user, i) => (
            <tr key={user.id}>
              <td className={styles.number}>{i + 1}</td>
              <td className={styles.username}>{user.username}</td>
              <td className={styles.wins}>{user.rankedWins}</td>
              <td className={styles.loses}>{user.rankedLoses}</td>
              {user.rank > user.prevRank ? (
                <td className={`${styles.arrowUp} ${styles.rank}`}>
                  ▲ {user.rank}
                </td>
              ) : user.rank < user.prevRank ? (
                <td className={`${styles.arrowDown} ${styles.rank}`}>
                  ▼ {user.rank}
                </td>
              ) : (
                <td className={styles.rank}>{user.rank}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default TableTopTen;
