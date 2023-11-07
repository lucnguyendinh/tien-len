"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import styles from "./ListCard.module.css";
import { TCard } from "@/app/ngvsng/page";
import { rule } from "@/config/rule";

type TProps = {
  indexP?: any;
  table: TCard[];
  setTable?: any;
  listCard: TCard[];
  isCurrentPlayer?: boolean;
  onPlayerTurn?: any;
  player?: any;
  handleSkipTurn?: any;
  noti?: boolean;
  setNoti?: any;
  firstCard?: any;
  setFirstCard?: any;
  handlePlayerWin?: any;
};

const ListCard = (props: TProps) => {
  const {
    indexP,
    listCard,
    table,
    setTable,
    isCurrentPlayer,
    onPlayerTurn,
    player,
    handleSkipTurn,
    noti = false,
    setNoti,
    firstCard,
    setFirstCard,
    handlePlayerWin,
  } = props;

  const rankOrder = "3456789TJQKA2";

  //Đã được sắp xếp theo thứ tự
  const [cards, setCards] = useState<TCard[]>([]);
  const [waitCard, setWaitCard] = useState<TCard[]>([]);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (Array.isArray(listCard)) {
      const c = listCard.sort((a, b) => {
        const rankA = rankOrder.indexOf(a.rank);
        const rankB = rankOrder.indexOf(b.rank);

        if (rankA < rankB) return -1;
        if (rankA > rankB) return 1;
        if (a.suit < b.suit) return -1;
        if (a.suit > b.suit) return 1;
        return 0;
      });
      setCards(c);
    }
  }, [listCard]);

  useEffect(() => {
    if (cards.length === 0 && player.rating === 0) {
      if (mountedRef.current) {
        handlePlayerWin(indexP);
      }
    } else {
      mountedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCurrentPlayer, cards, indexP, player]);

  const handleWaitCard = (card: TCard) => {
    setWaitCard((prev) => {
      const cloneCards: TCard[] = [...prev];

      const repeatTesting = cloneCards.some((c) => {
        return c.rank === card.rank && c.suit === card.suit;
      });
      if (repeatTesting) {
        const a = cloneCards.filter((c) => {
          return !(c.rank === card.rank && c.suit === card.suit);
        });
        return a;
      }
      return [...prev, card].sort((a, b) => {
        const rankA = rankOrder.indexOf(a.rank);
        const rankB = rankOrder.indexOf(b.rank);

        if (rankA < rankB) return -1;
        if (rankA > rankB) return 1;
        if (a.suit < b.suit) return -1;
        if (a.suit > b.suit) return 1;
        return 0;
      });
    });
  };

  const handleSelected = (index: any) => {
    const list = [...cards];
    list[index].isSelected = !list[index].isSelected;
    setCards(list);
  };

  const handleFight = (waitCard: TCard[]) => {
    const rulee = rule(table, waitCard);

    if (rulee) {
      setTable(waitCard);
      const cloneCards = cards;
      const c = cloneCards.filter((c) => {
        return !waitCard.some((w) => w.rank === c.rank && w.suit === c.suit);
      });
      setCards(c);
      setWaitCard([]);
      setFirstCard([]);
      onPlayerTurn();
    } else {
      alert("Không hợp lệ!");
    }
  };

  useEffect(() => {
    isCurrentPlayer && setFirstCard([cards[0]]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCurrentPlayer, cards]);

  useEffect(() => {
    if (noti) {
      handleFight(firstCard);
      setNoti(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noti, cards, firstCard]);

  return (
    <div
      className={`${styles.wrapper} ${
        player.posion === "center" && styles.center
      }`}
    >
      {player.posion !== "center" ? (
        <>
          {isCurrentPlayer ? (
            <>
              <div
                className={`${styles.option} ${
                  player.posion === "bottom" && styles.bottom
                } ${player.posion === "top" && styles.top} ${
                  player.posion === "right" && styles.right
                } ${player.posion === "left" && styles.left}`}
              >
                <div
                  className={styles.skip}
                  onClick={() => handleSkipTurn(indexP)}
                >
                  Bỏ qua
                </div>
                <div
                  className={styles.gambling}
                  onClick={() => handleFight(waitCard)}
                >
                  Đánh
                </div>
              </div>
              <div
                className={`${styles.listCard} ${
                  player.posion === "bottom" && styles.bottomC
                } ${player.posion === "top" && styles.topC} ${
                  player.posion === "right" && styles.rightC
                } ${player.posion === "left" && styles.leftC}`}
              >
                {cards?.map((card, index) => {
                  const img = card.rank + card.suit;

                  return (
                    <div
                      className={`${styles.card} ${
                        card?.isSelected && styles.isSelected
                      }`}
                      key={index}
                      onClick={() => {
                        handleSelected(index);
                        handleWaitCard(card);
                      }}
                    >
                      <Image
                        src={`/assets/cards/${img}.svg`}
                        alt="card"
                        width={100}
                        height={150}
                        priority={true}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <Image
                src={`/assets/cards/1B.svg`}
                alt="card"
                width={100}
                height={150}
                priority={true}
              />
              <p className={styles.numberCard}>{cards.length}</p>
            </>
          )}
        </>
      ) : (
        <div className={`${styles.listCard} `}>
          {cards?.map((card, index) => {
            return (
              <div
                className={`${styles.card} ${
                  card?.isSelected && styles.isSelected
                }`}
                key={index}
              >
                <Image
                  src={`/assets/cards/${card.rank + card.suit}.svg`}
                  alt="card"
                  width={100}
                  height={150}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ListCard;
