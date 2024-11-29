"use client";

import Link from "next/link";
import style from "./page.module.css";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();
  console.log('session',session)
  return (
    <header className={style.container}>
      <Link href="/">
        <h1>My App</h1>
      </Link>
      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          {session ? (
            <>
              <li>
                <Link href="/dashboard">dashboard</Link>
              </li>
              <div>
                <span>Welcome, {session.user?.name || "User"}!</span>
                &nbsp;
                <button onClick={() => signOut()}>Sign out</button>
              </div>
            </>
          ) : (
            <li>
              <Link href="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
