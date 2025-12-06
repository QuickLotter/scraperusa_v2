// src/states/texas/texas.ts

import { GameDefinition } from "../../types";

export const TEXAS_GAMES: GameDefinition[] = [
  // -----------------------
  // MEGA MILLIONS
  // -----------------------
  {
    game_id: "megamillions_tx",
    state: "TX",
    displayName: "Mega Millions",
    url: "https://www.lotteryusa.com/texas/mega-millions/",
    mainNumbers: 5,
    hasExtraBall: true,
    supportsCashValue: true,
    drawTimeET: "11:00 PM",
    daysOfWeek: [2, 5],
  },

  // -----------------------
  // POWERBALL
  // -----------------------
  {
    game_id: "powerball_tx",
    state: "TX",
    displayName: "Powerball",
    url: "https://www.lotteryusa.com/texas/powerball/",
    mainNumbers: 5,
    hasExtraBall: true,
    supportsCashValue: true,
    drawTimeET: "10:59 PM",
    daysOfWeek: [1, 3, 6], // Mon, Wed, Sat
  },

  // -----------------------
  // LOTTO TEXAS
  // -----------------------
  {
    game_id: "lottotexas_tx",
    state: "TX",
    displayName: "Lotto Texas",
    url: "https://www.lotteryusa.com/texas/lotto-texas/",
    mainNumbers: 6,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "11:12 PM",
    daysOfWeek: [1, 6], // Mon, Sat
  },

  // -----------------------
  // TEXAS TWO STEP
  // -----------------------
  {
    game_id: "texastwostep_tx",
    state: "TX",
    displayName: "Texas Two Step",
    url: "https://www.lotteryusa.com/texas/texas-two-step/",
    mainNumbers: 4,
    hasExtraBall: true,
    supportsCashValue: false,
    drawTimeET: "10:12 PM",
    daysOfWeek: [1, 4], // Mon, Thu
  },

  // -----------------------
  // CASH FIVE
  // -----------------------
  {
    game_id: "cashfive_tx",
    state: "TX",
    displayName: "Cash Five",
    url: "https://www.lotteryusa.com/texas/cash-5/",
    mainNumbers: 5,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "10:12 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },

  // -----------------------
  // DAILY 4 — MORNING
  // -----------------------
  {
    game_id: "daily4morning_tx",
    state: "TX",
    displayName: "Daily 4 Morning",
    url: "https://www.lotteryusa.com/texas/morning-pick-4/",
    mainNumbers: 4,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "10:00 AM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },

  // -----------------------
  // DAILY 4 — DAY
  // -----------------------
  {
    game_id: "daily4day_tx",
    state: "TX",
    displayName: "Daily 4 Day",
    url: "https://www.lotteryusa.com/texas/midday-4/",
    mainNumbers: 4,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "12:27 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },

  // -----------------------
  // DAILY 4 — EVENING
  // -----------------------
  {
    game_id: "daily4evening_tx",
    state: "TX",
    displayName: "Daily 4 Evening",
    url: "https://www.lotteryusa.com/texas/evening-pick-4/",
    mainNumbers: 4,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "06:00 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },

  // -----------------------
  // DAILY 4 — NIGHT
  // -----------------------
  {
    game_id: "daily4night_tx",
    state: "TX",
    displayName: "Daily 4 Night",
    url: "https://www.lotteryusa.com/texas/daily-4/",
    mainNumbers: 4,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "10:12 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },

  // -----------------------
  // PICK 3 — MORNING
  // -----------------------
  {
    game_id: "pick3morning_tx",
    state: "TX",
    displayName: "Pick 3 Morning",
    url: "https://www.lotteryusa.com/texas/morning-pick-3/",
    mainNumbers: 3,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "10:00 AM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },

  // -----------------------
  // PICK 3 — DAY
  // -----------------------
  {
    game_id: "pick3day_tx",
    state: "TX",
    displayName: "Pick 3 Day",
    url: "https://www.lotteryusa.com/texas/midday-pick-3/",
    mainNumbers: 3,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "12:27 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },

  // -----------------------
  // PICK 3 — EVENING
  // -----------------------
  {
    game_id: "pick3evening_tx",
    state: "TX",
    displayName: "Pick 3 Evening",
    url: "https://www.lotteryusa.com/texas/evening-pick-3/",
    mainNumbers: 3,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "06:00 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },

  // -----------------------
  // PICK 3 — NIGHT
  // -----------------------
  {
    game_id: "pick3night_tx",
    state: "TX",
    displayName: "Pick 3 Night",
    url: "https://www.lotteryusa.com/texas/pick-3/",
    mainNumbers: 3,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "10:12 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },

  // -----------------------
  // ALL OR NOTHING — MORNING
  // -----------------------
  {
    game_id: "allornothingmorning_tx",
    state: "TX",
    displayName: "All or Nothing Morning",
    url: "https://www.lotteryusa.com/texas/morning-all-or-nothing/",
    mainNumbers: 12,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "10:00 AM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },

  // -----------------------
  // ALL OR NOTHING — DAY
  // -----------------------
  {
    game_id: "allornothingday_tx",
    state: "TX",
    displayName: "All or Nothing Day",
    url: "https://www.lotteryusa.com/texas/day-all-or-nothing/",
    mainNumbers: 12,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "12:27 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },

  // -----------------------
  // ALL OR NOTHING — EVENING
  // -----------------------
  {
    game_id: "allornothingevening_tx",
    state: "TX",
    displayName: "All or Nothing Evening",
    url: "https://www.lotteryusa.com/texas/evening-all-or-nothing/",
    mainNumbers: 12,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "06:00 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },

  // -----------------------
  // ALL OR NOTHING — NIGHT
  // -----------------------
  {
    game_id: "allornothingnight_tx",
    state: "TX",
    displayName: "All or Nothing Night",
    url: "https://www.lotteryusa.com/texas/night-all-or-nothing/",
    mainNumbers: 12,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "10:12 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },
];
