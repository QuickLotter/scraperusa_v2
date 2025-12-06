// src/states/index.ts

import { NEW_YORK_GAMES } from "./new_york/new_york";
import { PENNSYLVANIA_GAMES } from "./pennsylvania/pennsylvania";
import { OHIO_GAMES } from "./ohio/ohio";
import { TEXAS_GAMES } from "./texas/texas";
import { IDAHO_GAMES } from "./idaho/idaho";
import { ARIZONA_GAMES } from "./arizona/arizona";
import { CALIFORNIA_GAMES } from "./california/california";

export const ALL_GAMES = [
  ...NEW_YORK_GAMES,
  ...PENNSYLVANIA_GAMES,
  ...OHIO_GAMES,
  ...TEXAS_GAMES,
  ...IDAHO_GAMES,
  ...ARIZONA_GAMES,
  ...CALIFORNIA_GAMES,
];
