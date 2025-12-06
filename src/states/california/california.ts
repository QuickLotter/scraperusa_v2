// src/states/california/california.ts

import { GameDefinition } from "../../types";

export const CALIFORNIA_GAMES: GameDefinition[] = [
  // -----------------------
  // SUPERLOTTO PLUS
  // -----------------------
  {
    game_id: "superlottoplus_ca",
    state: "CA",
    displayName: "SuperLotto Plus",
    url: "https://www.lotteryusa.com/california/super-lotto-plus/",
    mainNumbers: 5,
    hasExtraBall: true, // Mega Number
    supportsCashValue: false,
    drawTimeET: "11:00 PM",
    daysOfWeek: [2, 6], // Wed & Sat
  },

  // -----------------------
  // FANTASY 5
  // -----------------------
  {
    game_id: "fantasy5_ca",
    state: "CA",
    displayName: "Fantasy 5",
    url: "https://www.lotteryusa.com/california/fantasy-5/",
    mainNumbers: 5,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "11:00 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Daily
  },

  // -----------------------
  // DAILY 4
  // -----------------------
  {
    game_id: "daily4_ca",
    state: "CA",
    displayName: "Daily 4",
    url: "https://www.lotteryusa.com/california/daily-4/",
    mainNumbers: 4,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "09:00 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },

  // -----------------------
  // DAILY 3 MIDDAY
  // -----------------------
  {
    game_id: "daily3midday_ca",
    state: "CA",
    displayName: "Daily 3 Midday",
    url: "https://www.lotteryusa.com/california/midday-3/",
    mainNumbers: 3,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "03:00 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },

  // -----------------------
  // DAILY 3 EVENING
  // -----------------------
  {
    game_id: "daily3evening_ca",
    state: "CA",
    displayName: "Daily 3 Evening",
    url: "https://www.lotteryusa.com/california/daily-3/",
    mainNumbers: 3,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "09:00 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },

  // -----------------------
  // DAILY DERBY
  // -----------------------
  {
    game_id: "dailyderby_ca",
    state: "CA",
    displayName: "Daily Derby",
    url: "https://www.lotteryusa.com/california/daily-derby/",
    mainNumbers: 3, // game format is unique but uses 3 selections
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "09:00 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },
];
