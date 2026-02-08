import { LotteryGame } from '@/types';

export const LOTTERY_GAMES: LotteryGame[] = [
  {
    id: 'powerball',
    name: 'Powerball',
    region: 'USA',
    primaryColor: 'bg-lucky-ball-red',
    secondaryColor: 'bg-lucky-ball-red',
    primaryCount: 5,
    primaryMax: 69,
    secondaryCount: 1,
    secondaryMax: 26,
    description: 'America\'s favorite lottery with massive jackpots',
    drawDays: ['Monday', 'Wednesday', 'Saturday'],
    dataFile: '/data/powerball.json',
    bonusBallLabel: 'Powerball',
    nextDrawDate: () => {
      const today = new Date();
      const drawDays = [1, 3, 6];
      const todayDay = today.getDay();
      let daysUntilDraw = 0;

      for (const drawDay of drawDays) {
        if (drawDay > todayDay) {
          daysUntilDraw = drawDay - todayDay;
          break;
        }
      }

      if (daysUntilDraw === 0) {
        daysUntilDraw = 7 - todayDay + 1;
      }

      const nextDraw = new Date(today);
      nextDraw.setDate(today.getDate() + daysUntilDraw);
      nextDraw.setHours(22, 59, 0, 0);
      return nextDraw;
    },
  },
  {
    id: 'megamillions',
    name: 'Mega Millions',
    region: 'USA',
    primaryColor: 'bg-lucky-ball-blue',
    secondaryColor: 'bg-lucky-ball-gold',
    primaryCount: 5,
    primaryMax: 70,
    secondaryCount: 1,
    secondaryMax: 25,
    description: 'Huge jackpots with Megaplier option',
    drawDays: ['Tuesday', 'Friday'],
    dataFile: '/data/megamillions.json',
    bonusBallLabel: 'Mega Ball',
    nextDrawDate: () => {
      const today = new Date();
      const drawDays = [2, 5];
      const todayDay = today.getDay();
      let daysUntilDraw = 0;

      for (const drawDay of drawDays) {
        if (drawDay > todayDay) {
          daysUntilDraw = drawDay - todayDay;
          break;
        }
      }

      if (daysUntilDraw === 0) {
        daysUntilDraw = 7 - todayDay + 2;
      }

      const nextDraw = new Date(today);
      nextDraw.setDate(today.getDate() + daysUntilDraw);
      nextDraw.setHours(23, 0, 0, 0);
      return nextDraw;
    },
  },
  {
    id: 'luckyforlife',
    name: 'Lucky for Life',
    region: 'USA',
    primaryColor: 'bg-lucky-ball-green',
    secondaryColor: 'bg-lucky-ball-blue',
    primaryCount: 5,
    primaryMax: 48,
    secondaryCount: 1,
    secondaryMax: 18,
    description: 'Win $1,000 a day for life!',
    drawDays: ['Monday', 'Thursday'],
    dataFile: '/data/luckyforlife.json',
    bonusBallLabel: 'Lucky Ball',
    nextDrawDate: () => {
      const today = new Date();
      const drawDays = [1, 4];
      const todayDay = today.getDay();
      let daysUntilDraw = 0;

      for (const drawDay of drawDays) {
        if (drawDay > todayDay) {
          daysUntilDraw = drawDay - todayDay;
          break;
        }
      }

      if (daysUntilDraw === 0) {
        daysUntilDraw = 7 - todayDay + 1;
      }

      const nextDraw = new Date(today);
      nextDraw.setDate(today.getDate() + daysUntilDraw);
      nextDraw.setHours(22, 35, 0, 0);
      return nextDraw;
    },
  },
  {
    id: 'cash4life',
    name: 'Cash4Life',
    region: 'USA',
    primaryColor: 'bg-lucky-ball-green',
    secondaryColor: 'bg-lucky-ball-red',
    primaryCount: 5,
    primaryMax: 60,
    secondaryCount: 1,
    secondaryMax: 4,
    description: '$1,000 a day for life - daily draws!',
    drawDays: ['Daily'],
    dataFile: '/data/cash4life.json',
    bonusBallLabel: 'Cash Ball',
    nextDrawDate: () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(21, 0, 0, 0);
      return tomorrow;
    },
  },
  {
    id: 'lottoamerica',
    name: 'Lotto America',
    region: 'USA',
    primaryColor: 'bg-lucky-ball-blue',
    secondaryColor: 'bg-lucky-ball-red',
    primaryCount: 5,
    primaryMax: 52,
    secondaryCount: 1,
    secondaryMax: 10,
    description: 'All-American lottery with Star Ball bonus',
    drawDays: ['Monday', 'Wednesday', 'Saturday'],
    dataFile: '/data/lottoamerica.json',
    bonusBallLabel: 'Star Ball',
    nextDrawDate: () => {
      const today = new Date();
      const drawDays = [1, 3, 6];
      const todayDay = today.getDay();
      let daysUntilDraw = 0;

      for (const drawDay of drawDays) {
        if (drawDay > todayDay) {
          daysUntilDraw = drawDay - todayDay;
          break;
        }
      }

      if (daysUntilDraw === 0) {
        daysUntilDraw = 7 - todayDay + 1;
      }

      const nextDraw = new Date(today);
      nextDraw.setDate(today.getDate() + daysUntilDraw);
      nextDraw.setHours(22, 0, 0, 0);
      return nextDraw;
    },
  },
];

export const GAMES_MAP: Record<string, LotteryGame> = Object.fromEntries(
  LOTTERY_GAMES.map(game => [game.id, game])
);

export function getGameById(id: string): LotteryGame | undefined {
  return GAMES_MAP[id];
}

export function getDefaultGame(): LotteryGame {
  return LOTTERY_GAMES[0];
}
