import React from 'react';
import { ActiveTab, WellState, FullCalculations } from '../../types';
import { WellProfileChart } from '../charts/WellProfileChart';
import { PkvCycleChart } from '../charts/PkvCycleChart';
import { PumpCurveChart } from '../charts/PumpCurveChart';
import { BarChart3 } from 'lucide-react';

interface ChartsTabProps {
  state: WellState;
  calc: FullCalculations;
  onChange: (updates: Partial<WellState>) => void;
  onNavigateTab?: (tab: ActiveTab) => void;
}

export const ChartsTab: React.FC<ChartsTabProps> = ({
  state,
  calc,
  onChange,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-6">
      {/* Visual Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide">
              Графический комплекс и инженерная визуализация
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Интерактивный чертёж ствола скважины, динамика циклического уровня во времени и характеристика насоса Q-H с ЧРП
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-950/90 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400">Скважина:</span>
          <strong className="text-slate-900 dark:text-white font-mono">{state.wellName}</strong>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span className="text-slate-500 dark:text-slate-400">Частота:</span>
          <strong className="text-blue-600 dark:text-blue-400 font-mono">{state.frequency} Гц</strong>
        </div>
      </div>

      <section>
        <WellProfileChart state={state} calc={calc} onNavigateTab={onNavigateTab} />
      </section>

      <section>
        <PumpCurveChart
          state={state}
          hydraulics={calc.hydraulics}
          onFrequencyChange={(freq) => onChange({ frequency: freq })}
        />
      </section>

      <section>
        <PkvCycleChart state={state} pkv={calc.pkv} />
      </section>
    </div>
  );
};
