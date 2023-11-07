import { TCard, TRank, TSuit } from "@/app/ngvsng/page";

const defineRankCard = (rank: TRank): number => {
  const define: Record<TRank, number> = {
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    T: 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14,
    "2": 15,
  };
  return define[rank];
};

const defineSuitCard = (suit: TSuit) => {
  const define: Record<TSuit, number> = {
    S: 1,
    C: 2,
    D: 3,
    H: 4,
  };
  return define[suit];
};

export const rule = (table: TCard[], waitCard: TCard[]): boolean => {
  const tableLength = table.length;
  const waitCardLength = waitCard.length;

  //la nguoi danh bai dau tien cua vong
  if (tableLength === 0) {
    //Còn trường hợp waitCardLength === 0 chưa xét
    if (waitCardLength === 1) {
      return true;
    } else if (waitCardLength === 2) {
      return TheFirstPlayer.PAIR(waitCard).confirm;
    } else if (waitCardLength === 3) {
      return (
        TheFirstPlayer.TRIPLE(waitCard).confirm ||
        TheFirstPlayer.STRAIGHT(waitCard).confirm
      );
    } else if (waitCardLength === 4) {
      return (
        TheFirstPlayer.FOUROFAKIND(waitCard).confirm ||
        TheFirstPlayer.STRAIGHT(waitCard).confirm
      );
    } else if (waitCardLength === 6) {
      return (
        TheFirstPlayer.THREEPAIR(waitCard).confirm ||
        TheFirstPlayer.STRAIGHT(waitCard).confirm
      );
    } else if (waitCardLength === 8) {
      return (
        TheFirstPlayer.FOURPAIR(waitCard).confirm ||
        TheFirstPlayer.STRAIGHT(waitCard).confirm
      );
    } else {
      return TheFirstPlayer.STRAIGHT(waitCard).confirm;
    }
  } else {
    const type = Type(table);
    if (type === "SINGLE") {
      return BlockingPlayer.SINGLE(table, waitCard);
    }
    if (type === "PAIR") {
      return BlockingPlayer.PAIR(table, waitCard);
    }
    if (type === "TRIPLE") {
      return BlockingPlayer.TRIPLE(table, waitCard);
    }
    if (type === "FOUROFAKIND") {
      return BlockingPlayer.FOUROFAKIND(table, waitCard);
    }
    if (type === "STRAIGHT") {
      return BlockingPlayer.STRAIGHT(table, waitCard);
    }
    if (type === "THREEPAIR") {
      return BlockingPlayer.THREEPAIR(table, waitCard);
    }
    if (type === "FOURPAIR") {
      return BlockingPlayer.FOURPAIR(table, waitCard);
    }
    return false;
  }
};

const Type = (table: TCard[]) => {
  const tableLength = table.length;
  if (tableLength === 1) {
    return "SINGLE";
  } else if (tableLength === 2) {
    return TheFirstPlayer.PAIR(table).type;
  } else if (tableLength === 3) {
    return (
      TheFirstPlayer.TRIPLE(table).type || TheFirstPlayer.STRAIGHT(table).type
    );
  } else if (tableLength === 4) {
    return (
      TheFirstPlayer.FOUROFAKIND(table).type ||
      TheFirstPlayer.STRAIGHT(table).type
    );
  } else if (tableLength === 6) {
    return (
      TheFirstPlayer.THREEPAIR(table).type ||
      TheFirstPlayer.STRAIGHT(table).type
    );
  } else if (tableLength === 8) {
    return (
      TheFirstPlayer.FOURPAIR(table).type || TheFirstPlayer.STRAIGHT(table).type
    );
  } else {
    return TheFirstPlayer.STRAIGHT(table).type;
  }
};

const TheFirstPlayer = {
  PAIR: (cards: TCard[]) => {
    if (cards.length !== 2) {
      return {
        confirm: false,
      };
    }
    return {
      type: "PAIR",
      confirm: defineRankCard(cards[0].rank) === defineRankCard(cards[1].rank),
    };
  },
  TRIPLE: (cards: TCard[]) => {
    if (cards.length !== 3) {
      return {
        confirm: false,
      };
    }
    for (let i = 1; i < cards.length; i++) {
      if (defineRankCard(cards[0].rank) !== defineRankCard(cards[i].rank)) {
        return {
          confirm: false,
        };
      }
    }
    return {
      type: "TRIPLE",
      confirm: true,
    };
  },

  FOUROFAKIND: (cards: TCard[]) => {
    if (cards.length !== 4) {
      return {
        confirm: false,
      };
    }
    for (let i = 1; i < cards.length; i++) {
      if (defineRankCard(cards[0].rank) !== defineRankCard(cards[i].rank)) {
        return {
          confirm: false,
        };
      }
    }
    return {
      type: "FOUROFAKIND",
      confirm: true,
    };
  },

  STRAIGHT: (cards: TCard[]) => {
    if (cards.length < 3) {
      return {
        confirm: false,
      };
    }
    for (let i = 1; i < cards.length; i++) {
      if (
        defineRankCard(cards[i].rank) !==
        defineRankCard(cards[i - 1].rank) + 1
      ) {
        return {
          confirm: false,
        };
      }
    }
    return {
      type: "STRAIGHT",
      length: cards.length,
      confirm: true,
    };
  },

  THREEPAIR: (cards: TCard[]) => {
    if (cards.length !== 6) {
      return {
        confirm: false,
      };
    }
    const rankCount: any = {};
    for (const card of cards) {
      const rank = card.rank;
      if (rankCount[rank]) {
        rankCount[rank]++;
      } else {
        rankCount[rank] = 1;
      }
    }
    let pairCount = 0;
    for (const rank in rankCount) {
      if (rankCount[rank] === 2) {
        pairCount++;
      }
    }
    return {
      type: "THREEPAIR",
      confirm: pairCount === 3,
    };
  },

  FOURPAIR: (cards: TCard[]) => {
    if (cards.length !== 8) {
      return {
        confirm: false,
      };
    }
    const rankCount: any = {};
    for (const card of cards) {
      const rank = card.rank;
      if (rankCount[rank]) {
        rankCount[rank]++;
      } else {
        rankCount[rank] = 1;
      }
    }
    let pairCount = 0;
    for (const rank in rankCount) {
      if (rankCount[rank] === 2) {
        pairCount++;
      }
    }
    return {
      type: "FOURPAIR",
      confirm: pairCount === 4,
    };
  },
};

const BlockingPlayer = {
  SINGLE: (table: TCard[], cards: TCard[]) => {
    if (cards.length !== 1) {
      return false;
    }
    if (defineRankCard(table[0].rank) === defineRankCard(cards[0].rank)) {
      return defineSuitCard(table[0].suit) < defineSuitCard(cards[0].suit);
    }
    return defineRankCard(table[0].rank) < defineRankCard(cards[0].rank);
  },
  PAIR: (table: TCard[], cards: TCard[]) => {
    if (!TheFirstPlayer.PAIR(cards).confirm) {
      return false;
    }

    if (defineRankCard(table[1].rank) === defineRankCard(cards[1].rank)) {
      return defineSuitCard(table[1].suit) < defineSuitCard(cards[1].suit);
    }
    return defineRankCard(table[1].rank) < defineRankCard(cards[1].rank);
  },
  TRIPLE: (table: TCard[], cards: TCard[]) => {
    if (!TheFirstPlayer.TRIPLE(cards).confirm) {
      return false;
    }
    return defineRankCard(table[2].rank) < defineRankCard(cards[2].rank);
  },
  FOUROFAKIND: (table: TCard[], cards: TCard[]) => {
    if (!TheFirstPlayer.FOUROFAKIND(cards).confirm) {
      return false;
    }
    return defineRankCard(table[3].rank) < defineRankCard(cards[3].rank);
  },
  STRAIGHT: (table: TCard[], cards: TCard[]) => {
    const cardsLength = cards.length;
    if (
      !TheFirstPlayer.STRAIGHT(cards).confirm &&
      table.length === cards.length
    ) {
      return false;
    }
    if (
      defineRankCard(table[cardsLength - 1].rank) ===
      defineRankCard(cards[cardsLength - 1].rank)
    ) {
      return (
        defineSuitCard(table[cardsLength - 1].suit) <
        defineSuitCard(cards[cardsLength - 1].suit)
      );
    }
    return (
      defineRankCard(table[cardsLength - 1].rank) <
      defineRankCard(cards[cardsLength - 1].rank)
    );
  },

  THREEPAIR: (table: TCard[], cards: TCard[]) => {
    if (!TheFirstPlayer.THREEPAIR(cards).confirm) {
      return false;
    }
    if (defineRankCard(table[5].rank) === defineRankCard(cards[5].rank)) {
      return defineSuitCard(table[5].suit) < defineSuitCard(cards[5].suit);
    }
    return defineRankCard(table[5].rank) < defineRankCard(cards[5].rank);
  },
  FOURPAIR: (table: TCard[], cards: TCard[]) => {
    if (!TheFirstPlayer.FOURPAIR(cards).confirm) {
      return false;
    }
    if (defineRankCard(table[7].rank) === defineRankCard(cards[7].rank)) {
      return defineSuitCard(table[7].suit) < defineSuitCard(cards[7].suit);
    }
    return defineRankCard(table[7].rank) < defineRankCard(cards[7].rank);
  },
};
