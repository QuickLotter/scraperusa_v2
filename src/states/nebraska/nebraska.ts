import { GameDefinition } from "../../types";

export const NEBRASKA_GAMES: GameDefinition[] = [
  {
    game_id: "nebraskalotto_ne",
    state: "NE",
    displayName: "Nebraska Pick 5",
    url: "https://www.lotteryusa.com/nebraska/pick-5/",
    mainNumbers: 5,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "09:00 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    table: "results_ne",
  },
  {
    game_id: "pick3_ne",
    state: "NE",
    displayName: "Pick 3",
    url: "https://www.lotteryusa.com/nebraska/pick-3/",
    mainNumbers: 3,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "09:00 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    table: "results_ne",
  },
];
