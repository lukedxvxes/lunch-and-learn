import React, { useContext } from 'react';
import { Posts } from '../components/posts/Posts';
import { UserContext } from '../context/userContext';

export function Home() {
  const { user } = useContext(UserContext);
  return (
    <div className="page home-page">
      {user ? <Posts /> : <p>please login to see posts</p>}
    </div>
  );
}
