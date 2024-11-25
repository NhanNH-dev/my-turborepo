import React from "react";
import style from "./page.module.css";

type Props = {
  children: React.ReactNode;
};

export default function Main({ children }: Props) {
  return <main className={style.main}>{children}</main>;
}
