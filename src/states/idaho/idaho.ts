// src/states/idaho/idaho.ts

import { GameDefinition } from "../../types";

export const IDAHO_GAMES: GameDefinition[] = [
  // -----------------------
  // LOTTO AMERICA
  // -----------------------
  {
    game_id: "lottoamerica_id",
    state: "ID",
    displayName: "Lotto America",
    url: "https://www.lotteryusa.com/idaho/lotto-america/",
    mainNumbers: 5,
    hasExtraBall: true,
    supportsCashValue: true,
    drawTimeET: "11:00 PM",
    daysOfWeek: [2, 6], // Wed, Sat
  },

  // -----------------------
  // LUCKY FOR LIFE
  // -----------------------
  {
    game_id: "luckyforlife_id",
    state: "ID",
    displayName: "Lucky for Life",
    url: "https://www.lotteryusa.com/idaho/lucky-4-life/",
    mainNumbers: 5,
    hasExtraBall: true,
    supportsCashValue: false,
    drawTimeET: "10:38 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Daily
  },

  // -----------------------
  // IDAHO CASH
  // -----------------------
  {
    game_id: "idahocash_id",
    state: "ID",
    displayName: "Idaho Cash",
    url: "https://www.lotteryusa.com/idaho/idaho-cash/",
    mainNumbers: 5,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "08:00 PM",
    daysOfWeek: [1, 3, 6], // Mon, Wed, Sat
  },

  // -----------------------
  // PICK 4 — DAY
  // -----------------------
  {
    game_id: "pick4day_id",
    state: "ID",
    displayName: "Pick 4 Day",
    url: "https://www.lotteryusa.com/idaho/pick-4-day/",
    mainNumbers: 4,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "01:59 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },

  // -----------------------
  // PICK 4 — NIGHT
  // -----------------------
  {
    game_id: "pick4night_id",
    state: "ID",
    displayName: "Pick 4 Night",
    url: "https://www.lotteryusa.com/idaho/pick-4/",
    mainNumbers: 4,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "07:59 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },

  // -----------------------
  // PICK 3 — DAY
  // -----------------------
  {
    game_id: "pick3day_id",
    state: "ID",
    displayName: "Pick 3 Day",
    url: "https://www.lotteryusa.com/idaho/midday-pick-3/",
    mainNumbers: 3,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "01:59 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },

  // -----------------------
  // PICK 3 — NIGHT
  // -----------------------
  {
    game_id: "pick3night_id",
    state: "ID",
    displayName: "Pick 3 Night",
    url: "https://www.lotteryusa.com/idaho/pick-3/",
    mainNumbers: 3,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "07:59 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },
];
