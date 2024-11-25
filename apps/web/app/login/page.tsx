"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function LoginPage() {
  const { status } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (result?.error) {
      alert("Login failed: " + result.error);
    } else {
      alert("Login successful!");
      router.push("/");
    }
  };

  // Show a loading indicator while checking the session status
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // Render the login form only if the user is not authenticated
  if (status === "unauthenticated") {
    return (
      <div className={styles.login_page}>
        <div className={styles.page}>
          <h1>Login</h1>
          <form onSubmit={handleCredentialsLogin}>
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
            <button type="submit">Sign in with Username/Password</button>
          </form>
          <hr />
          <button
            onClick={() =>
              signIn("google", { callbackUrl: "http://localhost:3000" })
            }
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // If authenticated, don't show the login page at all
  return null;
}
