// src/states/arizona/arizona.ts

import { GameDefinition } from "../../types";

export const ARIZONA_GAMES: GameDefinition[] = [
  // -----------------------
  // THE PICK
  // -----------------------
  {
    game_id: "thepick_az",
    state: "AZ",
    displayName: "The Pick",
    url: "https://www.lotteryusa.com/arizona/the-pick/",
    mainNumbers: 6,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "09:00 PM",
    daysOfWeek: [3, 6], // Wed & Sat
  },

  // -----------------------
  // TRIPLE TWIST
  // -----------------------
  {
    game_id: "tripletwist_az",
    state: "AZ",
    displayName: "Triple Twist",
    url: "https://www.lotteryusa.com/arizona/triple-twist/",
    mainNumbers: 6,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "09:00 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Daily
  },

  // -----------------------
  // FANTASY 5
  // -----------------------
  {
    game_id: "fantasy5_az",
    state: "AZ",
    displayName: "Fantasy 5",
    url: "https://www.lotteryusa.com/arizona/fantasy-5/",
    mainNumbers: 5,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "09:00 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Daily
  },

  // -----------------------
  // PICK 3
  // -----------------------
  {
    game_id: "pick3_az",
    state: "AZ",
    displayName: "Pick 3",
    url: "https://www.lotteryusa.com/arizona/pick-3/",
    mainNumbers: 3,
    hasExtraBall: false,
    supportsCashValue: false,
    drawTimeET: "09:00 PM",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Daily
  },
];
