"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./ngvsng.module.css";
import ListCard from "@/components/ListCard";
import {
  createDeck,
  dealUniqueCardsToPlayers,
} from "@/utils/distributethecards";
import Link from "next/link";

export type TRank =
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "T"
  | "J"
  | "Q"
  | "K"
  | "A"
  | "2";

export type TSuit = "S" | "C" | "D" | "H";

export type TCard = {
  rank: TRank;
  suit: TSuit;
  isSelected: boolean;
};

type TUser = {
  user: string;
  posion?: string;
  i: number;
  skip: boolean;
  rating: number;
};

const Page = () => {
  const [table, setTable] = useState<TCard[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [noti, setNoti] = useState<any>(false);
  const [hands, setHands] = useState<any>();
  const [firstCard, setFirstCard] = useState<TCard[]>([]);
  const [turnsCompleted, setTurnsCompleted] = useState(1);
  const [sortedPlayers, setSortedPlayers] = useState<any[]>([]);
  const [round, setRound] = useState(1);

  const searchParams = useSearchParams();

  const number = parseInt(searchParams.get("number") || "2");

  let playerInfo: TUser[];

  if (number === 2) {
    playerInfo = [
      { user: "Player1", posion: "bottom", i: 1, skip: false, rating: 0 },
      { user: "Player2", posion: "top", i: 3, skip: false, rating: 0 },
    ];
  } else if (number === 3) {
    playerInfo = [
      { user: "Player1", posion: "bottom", i: 1, skip: false, rating: 0 },
      { user: "Player2", posion: "right", i: 2, skip: false, rating: 0 },
      { user: "Player3", posion: "top", i: 3, skip: false, rating: 0 },
    ];
  } else {
    playerInfo = [
      { user: "Player1", posion: "bottom", i: 1, skip: false, rating: 0 },
      { user: "Player2", posion: "right", i: 2, skip: false, rating: 0 },
      { user: "Player3", posion: "top", i: 3, skip: false, rating: 0 },
      { user: "Player4", posion: "left", i: 4, skip: false, rating: 0 },
    ];
  }

  const [players, setPlayers] = useState<TUser[]>(playerInfo);

  useEffect(() => {
    const players = ["Player1", "Player2", "Player3", "Player4"];
    const deck = createDeck();
    const a = dealUniqueCardsToPlayers(players, deck);
    console.log(a.Player1);

    setHands(a);
  }, [round]);

  useEffect(() => {
    const setTime = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    if (timeLeft === 0) {
      handleSkipTurn(currentPlayerIndex);
    }

    return () => {
      clearTimeout(setTime);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, currentPlayerIndex]);

  // Hàm này được gọi khi người chơi hết bài
  const handlePlayerWin = (i: number) => {
    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];
      updatedPlayers[i] = {
        ...updatedPlayers[i],
        rating: turnsCompleted,
      };
      return updatedPlayers;
    });
    setTurnsCompleted((prev) => prev + 1);
  };

  const handleSkipTurn = (playerIndex: number) => {
    if (turnsCompleted < number) {
      if (table.length === 0) {
        setNoti(true);
      } else {
        const updatedPlayers = [...players];
        updatedPlayers[playerIndex].skip = true;
        setPlayers(updatedPlayers);
        handlePlayerTurn();
      }
    }
  };

  const handlePlayerTurn = () => {
    if (turnsCompleted < number) {
      let nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
      let skippedPlayersCount = 0;

      // Kiểm tra xem tất cả người chơi đã bỏ lượt hay chưa
      for (let i = 0; i < players.length; i++) {
        if (players[i].skip) {
          skippedPlayersCount++;
        }
      }

      while (
        players[nextPlayerIndex].skip ||
        players[nextPlayerIndex].rating !== 0
      ) {
        nextPlayerIndex = (nextPlayerIndex + 1) % players.length;
      }

      if (skippedPlayersCount === players.length - turnsCompleted) {
        // Nếu có chính xác 3 người có thuộc tính skip là true, đặt lại thuộc tính skip của tất cả người chơi
        for (let i = 0; i < players.length; i++) {
          players[i].skip = false;
          setTable([]);
        }
      }

      setCurrentPlayerIndex(nextPlayerIndex);
      setTimeLeft(20);
    }
  };

  const newGame = () => {
    players.forEach((p, i) => {
      p.rating === 1 && setCurrentPlayerIndex(i);
    });
    setTable([]);
    setRound((prev) => prev + 1);
    setTurnsCompleted(1);
    setTimeLeft(20);
    setTimeout(() => {
      setPlayers(playerInfo);
    }, 500);
  };
  const currentPlayer = players[currentPlayerIndex];

  useEffect(() => {
    const customSortOrder = [1, 2, 3, 0];
    const sortPlayers = [...players];
    sortPlayers.sort((a, b) => {
      return (
        customSortOrder.indexOf(a.rating) - customSortOrder.indexOf(b.rating)
      );
    });
    setSortedPlayers(sortPlayers);
  }, [players]);

  return (
    <>
      {hands && (
        <div className={styles.wrapper}>
          <p style={{ color: "#edff00" }}>Trận thứ: {round}</p>
          {players.map((player, index) => {
            const isCurrentPlayer = player.user === currentPlayer.user;
            return (
              <div className={styles[`player${player.i}`]} key={index}>
                <div className={styles.b}>
                  <div className={styles.info}>
                    {isCurrentPlayer && (
                      <div className={styles.time}>{timeLeft}</div>
                    )}
                    <div className={styles.name}>{player.user}</div>
                    {player.rating !== 0 && (
                      <div className={styles.name}>
                        {player.rating === 1
                          ? "Nhất"
                          : player.rating === 2
                          ? "Nhì"
                          : player.rating === 3
                          ? "Ba"
                          : "Bét"}
                      </div>
                    )}
                  </div>
                  <ListCard
                    indexP={index}
                    listCard={hands[player.user]}
                    table={table}
                    setTable={setTable}
                    isCurrentPlayer={isCurrentPlayer}
                    onPlayerTurn={handlePlayerTurn}
                    player={player}
                    handleSkipTurn={handleSkipTurn}
                    noti={isCurrentPlayer && noti}
                    setNoti={setNoti}
                    firstCard={firstCard}
                    setFirstCard={setFirstCard}
                    handlePlayerWin={handlePlayerWin}
                  />
                </div>
              </div>
            );
          })}
          {table.length > 0 && (
            <div className={styles.table}>
              <ListCard
                listCard={table}
                table={table}
                setTable={setTable}
                player={{ posion: "center" }}
              />
            </div>
          )}
        </div>
      )}
      {turnsCompleted === number && (
        <div className={styles.notification}>
          <div className={styles.head}>
            <h1>Kết thúc</h1>
          </div>
          <div className={styles.body}>
            {sortedPlayers.map((player, index) => {
              return (
                <h3 key={index}>
                  {index === 0
                    ? "Nhất"
                    : index === 1
                    ? "Nhì"
                    : index === 2
                    ? "Ba"
                    : "Bét"}
                  : {player.user}
                </h3>
              );
            })}
          </div>
          <div className={styles.footer}>
            <div onClick={newGame} className={styles.btn}>
              <h2>Chơi tiếp</h2>
            </div>

            <div className={styles.btn}>
              <Link href={"/"}>
                <h2 style={{ color: "#000" }}>Về</h2>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
