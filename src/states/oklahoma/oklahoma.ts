import { GameDefinition } from "../../types";

export const OKLAHOMA_GAMES: GameDefinition[] = [
  {
    game_id: "oklotto_ok",
    state: "OK",
    displayName: "Cash 5",
    url: "https://www.lotteryusa.com/oklahoma/cash-5/",
    mainNumbers: 5,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "10:00 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    table: "results_ok",
  },
  {
    game_id: "pick3_ok",
    state: "OK",
    displayName: "Pick 3",
    url: "https://www.lotteryusa.com/oklahoma/pick-3/",
    mainNumbers: 3,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "10:00 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    table: "results_ok",
  },
];
