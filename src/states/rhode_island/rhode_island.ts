import { GameDefinition } from "../../types";

export const RHODE_ISLAND_GAMES: GameDefinition[] = [
  {
    game_id: "winfourlife_ri",
    state: "RI",
    displayName: "Wild Money",
    url: "https://www.lotteryusa.com/rhode-island/wild-money/",
    mainNumbers: 5,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "07:59 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    table: "results_ri",
  },
  {
    game_id: "numbers_ri",
    state: "RI",
    displayName: "Numbers Game",
    url: "https://www.lotteryusa.com/rhode-island/numbers-game/",
    mainNumbers: 4,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "07:59 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    table: "results_ri",
  },
];
