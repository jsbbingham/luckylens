import { LotteryGame, PrizeTier } from '@/types';

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
    ticketCost: 2,
    supportsWheeling: true,
    supportsBirthdayFilter: true,
    prizeTiers: [
      { label: '5+PB', prize: 0, isJackpot: true, odds: 292201338 },
      { label: '5+0', prize: 1000000, isJackpot: false, odds: 11688054 },
      { label: '4+PB', prize: 50000, isJackpot: false, odds: 913129 },
      { label: '4+0', prize: 100, isJackpot: false, odds: 36525 },
      { label: '3+PB', prize: 100, isJackpot: false, odds: 14494 },
      { label: '3+0', prize: 7, isJackpot: false, odds: 580 },
      { label: '2+PB', prize: 7, isJackpot: false, odds: 701 },
      { label: '1+PB', prize: 4, isJackpot: false, odds: 92 },
      { label: '0+PB', prize: 4, isJackpot: false, odds: 38 },
    ] as PrizeTier[],
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
    ticketCost: 2,
    supportsWheeling: true,
    supportsBirthdayFilter: true,
    prizeTiers: [
      { label: '5+MB', prize: 0, isJackpot: true, odds: 302575350 },
      { label: '5+0', prize: 1000000, isJackpot: false, odds: 12607306 },
      { label: '4+MB', prize: 10000, isJackpot: false, odds: 931001 },
      { label: '4+0', prize: 500, isJackpot: false, odds: 38792 },
      { label: '3+MB', prize: 200, isJackpot: false, odds: 14547 },
      { label: '3+0', prize: 10, isJackpot: false, odds: 606 },
      { label: '2+MB', prize: 10, isJackpot: false, odds: 693 },
      { label: '1+MB', prize: 4, isJackpot: false, odds: 89 },
      { label: '0+MB', prize: 2, isJackpot: false, odds: 37 },
    ] as PrizeTier[],
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
    ticketCost: 2,
    supportsWheeling: true,
    supportsBirthdayFilter: true,
    // "For life" prizes approximated as lump sum equivalents for EV purposes
    prizeTiers: [
      { label: '5+LB', prize: 7000000, isJackpot: true, odds: 30821472 },   // $1k/day for life ≈ $7M
      { label: '5+0', prize: 390000, isJackpot: false, odds: 1813028 },     // $25k/yr for life ≈ $390k
      { label: '4+LB', prize: 5000, isJackpot: false, odds: 143356 },
      { label: '4+0', prize: 200, isJackpot: false, odds: 8433 },
      { label: '3+LB', prize: 150, isJackpot: false, odds: 3413 },
      { label: '3+0', prize: 20, isJackpot: false, odds: 201 },
      { label: '2+LB', prize: 25, isJackpot: false, odds: 538 },
      { label: '1+LB', prize: 6, isJackpot: false, odds: 102 },
      { label: '0+LB', prize: 4, isJackpot: false, odds: 44 },
    ] as PrizeTier[],
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
    ticketCost: 2,
    supportsWheeling: true,
    supportsBirthdayFilter: true,
    // "For life" prizes approximated as lump sum equivalents for EV purposes
    prizeTiers: [
      { label: '5+CB', prize: 7000000, isJackpot: true, odds: 21846048 },   // $1k/day for life ≈ $7M
      { label: '5+0', prize: 2500000, isJackpot: false, odds: 7282016 },    // $1k/week for life ≈ $2.5M
      { label: '4+CB', prize: 2500, isJackpot: false, odds: 79440 },
      { label: '4+0', prize: 500, isJackpot: false, odds: 26480 },
      { label: '3+CB', prize: 100, isJackpot: false, odds: 1471 },
      { label: '3+0', prize: 25, isJackpot: false, odds: 490 },
      { label: '2+CB', prize: 10, isJackpot: false, odds: 83 },
      { label: '1+CB', prize: 4, isJackpot: false, odds: 14 },
      { label: '0+CB', prize: 2, isJackpot: false, odds: 8 },
    ] as PrizeTier[],
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
    ticketCost: 1,
    supportsWheeling: true,
    supportsBirthdayFilter: true,
    prizeTiers: [
      { label: '5+SB', prize: 0, isJackpot: true, odds: 25989600 },
      { label: '5+0', prize: 20000, isJackpot: false, odds: 2887733 },
      { label: '4+SB', prize: 1000, isJackpot: false, odds: 110594 },
      { label: '4+0', prize: 100, isJackpot: false, odds: 12288 },
      { label: '3+SB', prize: 20, isJackpot: false, odds: 2404 },
      { label: '3+0', prize: 5, isJackpot: false, odds: 267 },
      { label: '2+SB', prize: 5, isJackpot: false, odds: 386 },
      { label: '1+SB', prize: 2, isJackpot: false, odds: 73 },
      { label: '0+SB', prize: 2, isJackpot: false, odds: 45 },
    ] as PrizeTier[],
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
    ticketCost: 1,
    supportsWheeling: true,
    supportsBirthdayFilter: true,
    // CA lottery has 0% state tax; prizes subject to federal tax only
    prizeTiers: [
      { label: '5+Mega', prize: 0, isJackpot: true, odds: 41416353 },
      { label: '5+0', prize: 26948, isJackpot: false, odds: 1592937 },
      { label: '4+Mega', prize: 1500, isJackpot: false, odds: 197221 },
      { label: '4+0', prize: 73, isJackpot: false, odds: 7585 },
      { label: '3+Mega', prize: 55, isJackpot: false, odds: 4305 },
      { label: '3+0', prize: 8, isJackpot: false, odds: 166 },
      { label: '2+Mega', prize: 10, isJackpot: false, odds: 356 },
      { label: '1+Mega', prize: 2, isJackpot: false, odds: 74 },
      { label: '0+Mega', prize: 1, isJackpot: false, odds: 49 },
    ] as PrizeTier[],
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
    ticketCost: 1,
    supportsWheeling: true,
    // Birthday filter not applied: primaryMax=39, only 8 numbers >31 — too restrictive
    supportsBirthdayFilter: false,
    // Fantasy 5 is fully pari-mutuel; prize amounts are averages based on historical payouts
    prizeTiers: [
      { label: '5/5', prize: 100000, isJackpot: true, odds: 575757 },
      { label: '4/5', prize: 500, isJackpot: false, odds: 3387 },
      { label: '3/5', prize: 22, isJackpot: false, odds: 103 },
      { label: '2/5', prize: 1, isJackpot: false, odds: 9 },
    ] as PrizeTier[],
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
    ticketCost: 1,
    supportsWheeling: false,
    supportsBirthdayFilter: false,
    prizeTiers: [] as PrizeTier[],
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
    ticketCost: 1,
    supportsWheeling: false,
    supportsBirthdayFilter: false,
    prizeTiers: [] as PrizeTier[],
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
