import { Suits, Ranks } from "@/config/constants";

// Hàm để tạo một bộ bài tiêu chuẩn
export function createDeck() {
  const deck = [];
  for (const suit of Suits) {
    for (const rank of Ranks) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

// Hàm để phát ngẫu nhiên 13 lá bài cho mỗi người mà không trùng bài
export function dealUniqueCardsToPlayers(players: string[], deck: any) {
  const hands: any = {};

  for (const player of players) {
    hands[player] = [];
  }

  for (let i = 0; i < 13; i++) {
    for (const player of players) {
      const randomIndex = Math.floor(Math.random() * deck.length);
      const card = deck.splice(randomIndex, 1)[0];
      hands[player].push(card);
    }
  }

  return hands;
}
