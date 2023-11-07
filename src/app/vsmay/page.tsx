"use client";
import Image from "next/image";
import styles from "./vsmay.module.css";

import ListCard from "@/components/ListCard";
import {
  createDeck,
  dealUniqueCardsToPlayers,
} from "@/utils/distributethecards";

const Page = () => {
  const players = ["Player1", "Player2", "Player3", "Player4"];
  const deck = createDeck();
  const hands = dealUniqueCardsToPlayers(players, deck);

  const player1 = hands.Player1.map((card: any) => {
    return { ...card, isSelected: false };
  });
  return (
    <div className={styles.wrapper}>
      <div className={styles.player1}>
        <div className={styles.option}>
          <div className={styles.skip}>Bỏ qua</div>
          <div className={styles.gambling}>Đánh</div>
        </div>
        <div className={styles.b}>
          <div className={styles.info}>
            <div className={styles.time}>30</div>
            <div className={styles.name}>Name</div>
          </div>
          {/* <ListCard listCard={player1} /> */}
        </div>
      </div>
      <div className={styles.player2}>
        <Image
          src="/assets/cards/1B.svg"
          alt="player2"
          width={100}
          height={150}
        />

        <div className="info">
          <div className={styles.time}>30</div>
          <div className={styles.name}>Robot2</div>
        </div>
      </div>
      <div className={styles.player3}>
        {/* <Image
          src="/assets/cards/1B.svg"
          alt="player3"
          width={100}
          height={150}
        /> */}
        {/* <ListCard listCard={hands.Player3} /> */}

        <div className={styles.info3}>
          <div className={styles.time}>30</div>
          <div className={styles.name}>Robot3</div>
        </div>
      </div>
      <div className={styles.player4}>
        <Image
          src="/assets/cards/1B.svg"
          alt="player4"
          width={100}
          height={150}
        />

        <div className="info">
          <div className={styles.time}>30</div>
          <div className={styles.name}>Robot4</div>
        </div>
      </div>
    </div>
  );
};

export default Page;
