"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import style from "./page.module.css";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    if (session) {
      setHasSession(true);
    }
  }, [session]);

  return (
    <header className={style.container}>
      <Link href="/">
        <h1>My App</h1>
      </Link>
      <nav>
        <ul className={style.tag_ul}>
          <li className={style.tag_li}>
            <Link href="/">Home</Link>
          </li>
          <li className={style.tag_li}>
            <Link href="/about">About</Link>
          </li>
          {hasSession ? (
            <div>
              <span>Welcome, {session?.user?.name || "User"}!</span>
              <button onClick={() => signOut()}>Sign out</button>
            </div>
          ) : (
            <li className={style.tag_li}>
              <Link href="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
