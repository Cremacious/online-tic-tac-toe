import GameBoard from '@/components/GameBoard';
import { convex } from '../../../../convex/convexConnection';
import { api } from '../../../../convex/_generated/api';

const GamePage = async () => {
  const users = await convex.query(api.users.getUsers);
  if (!users) return <div>Loading...</div>;

  return (
    <>
      {users.map((user) => (
        <div key={user._id}>
          <h2>{user.name}</h2>
          <p>Email: {user.email}</p>
        </div>
      ))}{' '}
      Game board page
      <GameBoard />
    </>
  );
};

export default GamePage;
