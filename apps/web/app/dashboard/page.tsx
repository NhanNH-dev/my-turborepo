import { UserRepository } from "app/lib/repositories/userRepository";
import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const users = await UserRepository.getAllUsers();
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }
  return (
    <div>
      <h1>User Dashboard</h1>
      <table border={1}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>provider</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id.toString()}>
              <td>{user._id.toString()}</td>
              <td>{user.username}</td>
              <td>{user.email || "N/A"}</td>
              <td>{user.provider || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
