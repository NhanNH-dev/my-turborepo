"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function LoginPage() {
  const { status } = useSession();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      alert("Login failed: " + result.error);
    } else {
      alert("Login successful!");
      router.push("/");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if(!email && !password) {
      setError("Please fill out email and password");
      return;
    }
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: 'newbie',
          email,
          password,
          provider: "email"
        }),
      })

      if(res.ok) {
        setEmail("")
        setPassword("")
      } else {
        setError("Register failed. Please try again")
      }
    } catch (error) {
      console.log('error', error)
    }
   
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // Render the login form only if the user is not authenticated
  if (status === "unauthenticated") {
    return (
      <div className={styles.login_page}>
        <div className={styles.page}>
          <h1>Login</h1>
          <form onSubmit={isSignUp ? handleSignUp : handleCredentialsLogin}>
            <div>
              <label>
                email:
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                Password:
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>
            <button type="submit">
              {isSignUp ? "Sign Up" : "Sign In with Username/Password"}
            </button>
            <div>
              {/* Toggle between Sign Up and Sign In */}
              <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </button>
            </div>
          </form>
          <br />
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
