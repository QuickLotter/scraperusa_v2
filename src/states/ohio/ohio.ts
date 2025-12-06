// src/states/ohio/ohio.ts

import { GameDefinition } from "../../types";

export const OHIO_GAMES: GameDefinition[] = [
  // -----------------------
  // LUCKY FOR LIFE
  // -----------------------
  {
    game_id: "luckyforlife_oh",
    state: "OH",
    displayName: "Lucky for Life",
    url: "https://www.lotteryusa.com/ohio/lucky-4-life/",
    mainNumbers: 5,
    hasExtraBall: true,
    supportsCashValue: false,
    drawTimeET: "10:38 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // daily
  },

  // -----------------------
  // CLASSIC LOTTO
  // -----------------------
  {
    game_id: "classiclotto_oh",
    state: "OH",
    displayName: "Classic Lotto",
    url: "https://www.lotteryusa.com/ohio/classic-lotto/",
    mainNumbers: 6,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "07:05 PM",
    daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
  },

  // -----------------------
  // ROLLING CASH 5
  // -----------------------
  {
    game_id: "rollingcash5_oh",
    state: "OH",
    displayName: "Rolling Cash 5",
    url: "https://www.lotteryusa.com/ohio/rolling-cash-5/",
    mainNumbers: 5,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "07:05 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // daily
  },

  // -----------------------
  // PICK 5 MIDDAY
  // -----------------------
  {
    game_id: "pick5midday_oh",
    state: "OH",
    displayName: "Pick 5 Midday",
    url: "https://www.lotteryusa.com/ohio/midday-pick-5/",
    mainNumbers: 5,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "12:29 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },

  // -----------------------
  // PICK 5 EVENING
  // -----------------------
  {
    game_id: "pick5evening_oh",
    state: "OH",
    displayName: "Pick 5 Evening",
    url: "https://www.lotteryusa.com/ohio/pick-5/",
    mainNumbers: 5,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "07:29 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },

  // -----------------------
  // PICK 4 MIDDAY
  // -----------------------
  {
    game_id: "pick4midday_oh",
    state: "OH",
    displayName: "Pick 4 Midday",
    url: "https://www.lotteryusa.com/ohio/midday-pick-4/",
    mainNumbers: 4,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "12:29 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },

  // -----------------------
  // PICK 4 EVENING
  // -----------------------
  {
    game_id: "pick4evening_oh",
    state: "OH",
    displayName: "Pick 4 Evening",
    url: "https://www.lotteryusa.com/ohio/pick-4/",
    mainNumbers: 4,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "07:29 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },

  // -----------------------
  // PICK 3 MIDDAY
  // -----------------------
  {
    game_id: "pick3midday_oh",
    state: "OH",
    displayName: "Pick 3 Midday",
    url: "https://www.lotteryusa.com/ohio/midday-pick-3/",
    mainNumbers: 3,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "12:29 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },

  // -----------------------
  // PICK 3 EVENING
  // -----------------------
  {
    game_id: "pick3evening_oh",
    state: "OH",
    displayName: "Pick 3 Evening",
    url: "https://www.lotteryusa.com/ohio/pick-3/",
    mainNumbers: 3,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "07:29 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },
];
