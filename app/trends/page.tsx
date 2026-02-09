'use client';

import { useState, useMemo } from 'react';
import { BarChart3, Flame, Snowflake, ArrowUpDown, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { GameSelector } from '@/components/GameSelector';
import { BallDisplay } from '@/components/BallDisplay';
import { getDefaultGame, getGameById, LOTTERY_GAMES } from '@/lib/games';
import { LotteryGame } from '@/types';
import { useTrends } from '@/hooks/useTrends';
import { getHotColor, getColdColor, FrequencyEntry } from '@/lib/trends';
import Link from 'next/link';

export default function TrendsPage() {
  const [selectedGame, setSelectedGame] = useState<LotteryGame>(getDefaultGame());
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [tableTab, setTableTab] = useState<'main' | 'bonus'>('main');
  const [sortColumn, setSortColumn] = useState<'number' | 'count' | 'lastDrawn'>('count');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const game = getGameById(selectedGame.id) || selectedGame;
  const {
    mainFrequencies,
    bonusFrequencies,
    hotMain,
    coldMain,
    hotBonus,
    coldBonus,
    evenOdd,
    highLow,
    drawCount,
    dateRange,
    isLoading,
    hasData,
  } = useTrends(selectedGame.id, game);

  // Calculate max frequencies for bar scaling
  const maxMainFreq = useMemo(() => {
    if (mainFrequencies.length === 0) return 1;
    return Math.max(...mainFrequencies.map(f => f.count));
  }, [mainFrequencies]);

  const maxBonusFreq = useMemo(() => {
    if (bonusFrequencies.length === 0) return 1;
    return Math.max(...bonusFrequencies.map(f => f.count));
  }, [bonusFrequencies]);

  // Calculate high/low midpoint
  const midpoint = Math.floor(game.primaryMax / 2);

  // Handle sort
  const handleSort = (column: 'number' | 'count' | 'lastDrawn') => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection(column === 'count' ? 'desc' : 'asc');
    }
  };

  // Get sorted table data
  const tableData = useMemo(() => {
    const data = tableTab === 'main' ? mainFrequencies : bonusFrequencies;
    return [...data].sort((a, b) => {
      let comparison = 0;
      switch (sortColumn) {
        case 'number':
          comparison = a.number - b.number;
          break;
        case 'count':
          comparison = a.count - b.count;
          break;
        case 'lastDrawn':
          // Handle "Never" specially
          if (a.lastDrawn === 'Never' && b.lastDrawn === 'Never') comparison = 0;
          else if (a.lastDrawn === 'Never') comparison = -1;
          else if (b.lastDrawn === 'Never') comparison = 1;
          else comparison = new Date(a.lastDrawn).getTime() - new Date(b.lastDrawn).getTime();
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [tableTab, mainFrequencies, bonusFrequencies, sortColumn, sortDirection]);

  // Bonus ball label
  const bonusLabel = game.bonusBallLabel;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center py-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-3xl">📊</span>
          <h1 className="text-3xl font-bold text-lucky-text dark:text-lucky-dark-text">
            Number Trends
          </h1>
        </div>
        <p className="text-lucky-text-muted dark:text-lucky-dark-text-muted">
          Analyze historical winning number patterns
        </p>
      </div>

      {/* Game Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-lucky-text dark:text-lucky-dark-text">
          Select Lottery Game
        </label>
        <GameSelector 
          selectedGame={selectedGame}
          onSelectGame={setSelectedGame}
        />
      </div>

      {/* Data Period Indicator */}
      {hasData && !isLoading && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-lucky-primary/10 dark:bg-lucky-primary/20 text-lucky-primary dark:text-lucky-primary rounded-full text-sm">
          <BarChart3 className="w-4 h-4" />
          Based on {drawCount} draws from {dateRange.earliest} to {dateRange.latest} (All times ET)
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="py-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-lucky-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-lucky-text-muted dark:text-lucky-dark-text-muted">
            Analyzing historical data...
          </p>
        </div>
      )}

      {/* No Data State */}
      {!isLoading && !hasData && (
        <div className="bg-lucky-surface dark:bg-lucky-dark-surface rounded-xl p-8 border border-lucky-border dark:border-lucky-dark-border text-center">
          <div className="text-5xl mb-4">📡</div>
          <h2 className="text-xl font-semibold text-lucky-text dark:text-lucky-dark-text mb-2">
            No draw data available for {game.name}
          </h2>
          <p className="text-lucky-text-muted dark:text-lucky-dark-text-muted mb-6">
            Go to the Results tab and sync past winning numbers to see trends.
          </p>
          <Link
            href="/results"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-lucky-primary text-white hover:bg-lucky-primary-hover transition-colors"
          >
            Go to Results
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Trends Content */}
      {!isLoading && hasData && (
        <div className="space-y-8">
          {/* Hot Numbers Section */}
          <section className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-bold text-lucky-text dark:text-lucky-dark-text">
                Hot Numbers
              </h2>
              <span className="text-sm text-lucky-text-muted dark:text-lucky-dark-text-muted">
                — Most Frequently Drawn
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-4">
              {hotMain.map((item, index) => (
                <div key={item.number} className="flex flex-col items-center gap-2">
                  <BallDisplay 
                    number={item.number} 
                    size="md"
                    color={getHotColor(index, hotMain.length)}
                  />
                  <span className="text-xs font-medium text-lucky-text-muted dark:text-lucky-dark-text-muted">
                    Drawn {item.count}x
                  </span>
                  <div className="w-full h-1.5 bg-lucky-border dark:bg-lucky-dark-border rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(item.count / maxMainFreq) * 100}%`,
                        backgroundColor: getHotColor(index, hotMain.length)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Cold Numbers Section */}
          <section className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-4">
              <Snowflake className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-bold text-lucky-text dark:text-lucky-dark-text">
                Cold Numbers
              </h2>
              <span className="text-sm text-lucky-text-muted dark:text-lucky-dark-text-muted">
                — Least Frequently Drawn
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-4">
              {coldMain.map((item, index) => (
                <div key={item.number} className="flex flex-col items-center gap-2">
                  <BallDisplay 
                    number={item.number} 
                    size="md"
                    color={getColdColor(index, coldMain.length)}
                  />
                  <span className="text-xs font-medium text-lucky-text-muted dark:text-lucky-dark-text-muted">
                    {item.count === 0 ? 'Never' : `Drawn ${item.count}x`}
                  </span>
                  <div className="w-full h-1.5 bg-lucky-border dark:bg-lucky-dark-border rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(item.count / maxMainFreq) * 100}%`,
                        opacity: item.count === 0 ? 0.2 : 0.6 + (item.count / maxMainFreq) * 0.4
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bonus Ball Trends */}
          <section className="bg-lucky-surface dark:bg-lucky-dark-surface rounded-xl p-6 border border-lucky-border dark:border-lucky-dark-border">
            <h2 className="text-xl font-bold text-lucky-text dark:text-lucky-dark-text mb-4">
              Bonus Ball Trends — {bonusLabel}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Hot Bonus */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <h3 className="font-semibold text-lucky-text dark:text-lucky-dark-text">
                    Hot {bonusLabel}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {hotBonus.map((item, index) => (
                    <div key={item.number} className="flex flex-col items-center gap-1">
                      <BallDisplay 
                        number={item.number} 
                        size="sm"
                        color={getHotColor(index, hotBonus.length)}
                      />
                      <span className="text-xs text-lucky-text-muted dark:text-lucky-dark-text-muted">
                        {item.count}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cold Bonus */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Snowflake className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold text-lucky-text dark:text-lucky-dark-text">
                    Cold {bonusLabel}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {coldBonus.map((item, index) => (
                    <div key={item.number} className="flex flex-col items-center gap-1">
                      <BallDisplay 
                        number={item.number} 
                        size="sm"
                        color={getColdColor(index, coldBonus.length)}
                      />
                      <span className="text-xs text-lucky-text-muted dark:text-lucky-dark-text-muted">
                        {item.count === 0 ? 'Never' : `${item.count}x`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Even/Odd & High/Low Analysis */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Even/Odd Split */}
            <div className="bg-lucky-surface dark:bg-lucky-dark-surface rounded-xl p-6 border border-lucky-border dark:border-lucky-dark-border">
              <h3 className="font-semibold text-lucky-text dark:text-lucky-dark-text mb-3">
                Even/Odd Split
              </h3>
              <p className="text-sm text-lucky-text-muted dark:text-lucky-dark-text-muted mb-4">
                Average: {evenOdd.avgEven} even / {evenOdd.avgOdd} odd per draw
              </p>
              <div className="h-4 rounded-full overflow-hidden flex">
                <div 
                  className="bg-blue-500 transition-all duration-500"
                  style={{ width: `${(evenOdd.avgEven / (evenOdd.avgEven + evenOdd.avgOdd)) * 100}%` }}
                />
                <div 
                  className="bg-green-500 transition-all duration-500"
                  style={{ width: `${(evenOdd.avgOdd / (evenOdd.avgEven + evenOdd.avgOdd)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-blue-600 dark:text-blue-400">Even</span>
                <span className="text-green-600 dark:text-green-400">Odd</span>
              </div>
            </div>

            {/* High/Low Split */}
            <div className="bg-lucky-surface dark:bg-lucky-dark-surface rounded-xl p-6 border border-lucky-border dark:border-lucky-dark-border">
              <h3 className="font-semibold text-lucky-text dark:text-lucky-dark-text mb-3">
                High/Low Split
              </h3>
              <p className="text-sm text-lucky-text-muted dark:text-lucky-dark-text-muted mb-2">
                Average: {highLow.avgHigh} high / {highLow.avgLow} low per draw
              </p>
              <p className="text-xs text-lucky-text-muted dark:text-lucky-dark-text-muted mb-3">
                High = {midpoint + 1}–{game.primaryMax}, Low = 1–{midpoint}
              </p>
              <div className="h-4 rounded-full overflow-hidden flex">
                <div 
                  className="bg-sky-500 transition-all duration-500"
                  style={{ width: `${(highLow.avgLow / (highLow.avgHigh + highLow.avgLow)) * 100}%` }}
                />
                <div 
                  className="bg-rose-500 transition-all duration-500"
                  style={{ width: `${(highLow.avgHigh / (highLow.avgHigh + highLow.avgLow)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-sky-600 dark:text-sky-400">Low</span>
                <span className="text-rose-600 dark:text-rose-400">High</span>
              </div>
            </div>
          </div>

          {/* Full Frequency Table */}
          <section className="bg-lucky-surface dark:bg-lucky-dark-surface rounded-xl border border-lucky-border dark:border-lucky-dark-border overflow-hidden">
            <button
              onClick={() => setIsTableOpen(!isTableOpen)}
              className="w-full flex items-center justify-between p-4 hover:bg-lucky-surface-hover dark:hover:bg-lucky-dark-surface-hover transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">📋</span>
                <h2 className="font-semibold text-lucky-text dark:text-lucky-dark-text">
                  All Number Frequencies
                </h2>
              </div>
              {isTableOpen ? (
                <ChevronUp className="w-5 h-5 text-lucky-text-muted" />
              ) : (
                <ChevronDown className="w-5 h-5 text-lucky-text-muted" />
              )}
            </button>

            {isTableOpen && (
              <div className="border-t border-lucky-border dark:border-lucky-dark-border">
                {/* Tabs */}
                <div className="flex border-b border-lucky-border dark:border-lucky-dark-border">
                  <button
                    onClick={() => setTableTab('main')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      tableTab === 'main'
                        ? 'text-lucky-primary border-b-2 border-lucky-primary'
                        : 'text-lucky-text-muted hover:text-lucky-text'
                    }`}
                  >
                    Main Balls (1-{game.primaryMax})
                  </button>
                  <button
                    onClick={() => setTableTab('bonus')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      tableTab === 'bonus'
                        ? 'text-lucky-primary border-b-2 border-lucky-primary'
                        : 'text-lucky-text-muted hover:text-lucky-text'
                    }`}
                  >
                    {bonusLabel} (1-{game.secondaryMax})
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-lucky-background dark:bg-lucky-dark-background">
                        <th 
                          className="px-4 py-3 text-left text-xs font-semibold text-lucky-text-muted uppercase tracking-wider cursor-pointer hover:text-lucky-text"
                          onClick={() => handleSort('number')}
                        >
                          <div className="flex items-center gap-1">
                            Number
                            {sortColumn === 'number' && (
                              sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                            )}
                            {sortColumn !== 'number' && <ArrowUpDown className="w-3 h-3 opacity-30" />}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-semibold text-lucky-text-muted uppercase tracking-wider cursor-pointer hover:text-lucky-text"
                          onClick={() => handleSort('count')}
                        >
                          <div className="flex items-center gap-1">
                            Times Drawn
                            {sortColumn === 'count' && (
                              sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                            )}
                            {sortColumn !== 'count' && <ArrowUpDown className="w-3 h-3 opacity-30" />}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-semibold text-lucky-text-muted uppercase tracking-wider cursor-pointer hover:text-lucky-text"
                          onClick={() => handleSort('lastDrawn')}
                        >
                          <div className="flex items-center gap-1">
                            Last Drawn
                            {sortColumn === 'lastDrawn' && (
                              sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                            )}
                            {sortColumn !== 'lastDrawn' && <ArrowUpDown className="w-3 h-3 opacity-30" />}
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-lucky-text-muted uppercase tracking-wider">
                          Frequency
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-lucky-border dark:divide-lucky-dark-border">
                      {tableData.map((entry, index) => (
                        <tr 
                          key={entry.number}
                          className={index % 2 === 0 ? 'bg-white dark:bg-lucky-dark-surface' : 'bg-lucky-background/50 dark:bg-lucky-dark-background/50'}
                        >
                          <td className="px-4 py-3">
                            <BallDisplay number={entry.number} size="sm" />
                          </td>
                          <td className="px-4 py-3 text-sm text-lucky-text dark:text-lucky-dark-text">
                            {entry.count}
                          </td>
                          <td className="px-4 py-3 text-sm text-lucky-text-muted dark:text-lucky-dark-text-muted">
                            {entry.lastDrawn}
                          </td>
                          <td className="px-4 py-3">
                            <div className="w-24 h-2 bg-lucky-border dark:bg-lucky-dark-border rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-lucky-primary rounded-full transition-all duration-500"
                                style={{ 
                                  width: `${(entry.count / (tableTab === 'main' ? maxMainFreq : maxBonusFreq)) * 100}%`,
                                  opacity: entry.count === 0 ? 0.3 : 1
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-center">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>For entertainment only.</strong> Past results don't predict future draws. Play responsibly.
        </p>
      </div>
    </div>
  );
}
