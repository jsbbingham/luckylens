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
      const drawDays = [1, 3, 6]; // Mon, Wed, Sat
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
      nextDraw.setHours(19, 59, 0, 0); // 7:59 PM PT (10:59 PM ET)
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
      const drawDays = [2, 5]; // Tue, Fri
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
      nextDraw.setHours(20, 0, 0, 0); // 8:00 PM PT (11:00 PM ET)
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
    isDemoData: true,
    nextDrawDate: () => {
      const today = new Date();
      const drawDays = [1, 4]; // Mon, Thu
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
      nextDraw.setHours(19, 38, 0, 0); // 7:38 PM PT (10:38 PM ET)
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
      tomorrow.setHours(18, 0, 0, 0); // 6:00 PM PT (9:00 PM ET)
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
      const drawDays = [1, 3, 6]; // Mon, Wed, Sat
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
      nextDraw.setHours(19, 15, 0, 0); // 7:15 PM PT (9:15 PM CT / 10:15 PM ET)
      return nextDraw;
    },
  },
  {
    id: 'superlottoplus',
    name: 'SuperLotto Plus',
    region: 'California',
    primaryColor: 'bg-orange-500',
    secondaryColor: 'bg-red-600',
    primaryCount: 5,
    primaryMax: 47,
    secondaryCount: 1,
    secondaryMax: 27,
    description: 'California\'s original jackpot game since 1986',
    drawDays: ['Wednesday', 'Saturday'],
    dataFile: '/data/superlottoplus.json',
    bonusBallLabel: 'Mega',
    nextDrawDate: () => {
      const today = new Date();
      const drawDays = [3, 6]; // Wednesday, Saturday
      const todayDay = today.getDay();
      let daysUntilDraw = 0;

      for (const drawDay of drawDays) {
        if (drawDay > todayDay) {
          daysUntilDraw = drawDay - todayDay;
          break;
        }
      }

      if (daysUntilDraw === 0) {
        daysUntilDraw = 7 - todayDay + 3;
      }

      const nextDraw = new Date(today);
      nextDraw.setDate(today.getDate() + daysUntilDraw);
      nextDraw.setHours(19, 45, 0, 0); // 7:45 PM PT
      return nextDraw;
    },
  },
  {
    id: 'fantasy5',
    name: 'Fantasy 5',
    region: 'California',
    primaryColor: 'bg-purple-600',
    secondaryColor: 'bg-pink-500',
    primaryCount: 5,
    primaryMax: 39,
    secondaryCount: 0,
    secondaryMax: 0,
    description: 'California\'s daily game with great odds!',
    drawDays: ['Daily'],
    dataFile: '/data/fantasy5.json',
    bonusBallLabel: '',
    nextDrawDate: () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(18, 30, 0, 0); // 6:30 PM PT
      return tomorrow;
    },
  },
  {
    id: 'daily3',
    name: 'Daily 3',
    region: 'California',
    primaryColor: 'bg-blue-600',
    secondaryColor: 'bg-blue-400',
    primaryCount: 3,
    primaryMax: 9,
    secondaryCount: 0,
    secondaryMax: 0,
    description: 'Pick 3 digits - Midday & Evening draws daily',
    drawDays: ['Daily (Midday & Evening)'],
    dataFile: '/data/daily3.json',
    bonusBallLabel: '',
    nextDrawDate: () => {
      const today = new Date();
      const hour = today.getHours();

      // If before 12:30 PM, next draw is midday today
      if (hour < 12 || (hour === 12 && today.getMinutes() < 30)) {
        const nextDraw = new Date(today);
        nextDraw.setHours(12, 30, 0, 0);
        return nextDraw;
      }
      // If before 6:30 PM, next draw is evening today
      else if (hour < 18 || (hour === 18 && today.getMinutes() < 30)) {
        const nextDraw = new Date(today);
        nextDraw.setHours(18, 30, 0, 0);
        return nextDraw;
      }
      // Otherwise, next draw is midday tomorrow
      else {
        const nextDraw = new Date(today);
        nextDraw.setDate(today.getDate() + 1);
        nextDraw.setHours(12, 30, 0, 0);
        return nextDraw;
      }
    },
  },
  {
    id: 'daily4',
    name: 'Daily 4',
    region: 'California',
    primaryColor: 'bg-green-600',
    secondaryColor: 'bg-green-400',
    primaryCount: 4,
    primaryMax: 9,
    secondaryCount: 0,
    secondaryMax: 0,
    description: 'Pick 4 digits - Midday & Evening draws daily',
    drawDays: ['Daily (Midday & Evening)'],
    dataFile: '/data/daily4.json',
    bonusBallLabel: '',
    nextDrawDate: () => {
      const today = new Date();
      const hour = today.getHours();

      // If before 12:30 PM, next draw is midday today
      if (hour < 12 || (hour === 12 && today.getMinutes() < 30)) {
        const nextDraw = new Date(today);
        nextDraw.setHours(12, 30, 0, 0);
        return nextDraw;
      }
      // If before 6:30 PM, next draw is evening today
      else if (hour < 18 || (hour === 18 && today.getMinutes() < 30)) {
        const nextDraw = new Date(today);
        nextDraw.setHours(18, 30, 0, 0);
        return nextDraw;
      }
      // Otherwise, next draw is midday tomorrow
      else {
        const nextDraw = new Date(today);
        nextDraw.setDate(today.getDate() + 1);
        nextDraw.setHours(12, 30, 0, 0);
        return nextDraw;
      }
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
