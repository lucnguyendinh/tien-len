"use client";
import { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  const [select, setSelect] = useState(true);
  const [option, setOption] = useState("");
  const handleClick = (option?: string) => {
    setSelect(!select);
    option && setOption(option);
  };
  return (
    <div className={styles.wrapper}>
      {select ? (
        <div className={styles.container}>
          <div className={styles.btn} onClick={() => handleClick("ngvsng")}>
            <h2>Chơi với người</h2>
          </div>
          <div className={styles.btn} onClick={() => handleClick("vsmay")}>
            <h2>Chơi với máy</h2>
          </div>
        </div>
      ) : (
        <div className={styles.option}>
          <Link href={`/${option}?number=${2}`}>
            <div className={styles.btn}>
              <h2>2 người</h2>
            </div>
          </Link>
          <Link href={`/${option}?number=${3}`}>
            <div className={styles.btn}>
              <h2>3 người</h2>
            </div>
          </Link>
          <Link href={`/${option}?number=${4}`}>
            <div className={styles.btn}>
              <h2>4 người</h2>
            </div>
          </Link>

          <div
            className={`${styles.btn} ${styles.back}`}
            onClick={() => handleClick()}
          >
            <h2>Quay về</h2>
          </div>
        </div>
      )}
    </div>
  );
}
