"use client";
import { FormEventHandler, useState } from "react";
import styles from "./page.module.css";
import { signIn } from "next-auth/react";

type Props = {
  handleCredentialsLogin: (e: React.FormEvent, userInfo: { username: string; password: string }) => Promise<void>;
  handleCreateNewUser: (e: React.FormEvent, userInfo: { username: string; password: string }) => Promise<void>;
};

export default function LoginForm({ handleCredentialsLogin, handleCreateNewUser }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Handle form submit for login or user creation
  const handleSubmit = (e: React.FormEvent, isCreateUser: boolean) => {
    e.preventDefault();
    const userInfo = { username, password };
    
    if (isCreateUser) {
      handleCreateNewUser(e, userInfo); // Handle user creation
    } else {
      handleCredentialsLogin(e, userInfo); // Handle login
    }
  };

  return (
    <div className={styles.login_page}>
      <div className={styles.page}>
        <h1>Login</h1>
        <form onSubmit={(e) => handleSubmit(e, false)}>
          <div>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>
          {/* Submit for login */}
          <button type="submit">Sign in with Username/Password</button>
        </form>
        
        <form onSubmit={(e) => handleSubmit(e, true)}>
          {/* Button for creating a new user */}
          <button type="submit">Create User</button>
        </form>
        
        <hr />
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
