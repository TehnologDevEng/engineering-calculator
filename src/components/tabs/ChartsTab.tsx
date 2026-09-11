import React from 'react';
import { WellState, FullCalculations } from '../../types';
import { WellProfileChart } from '../charts/WellProfileChart';
import { PkvCycleChart } from '../charts/PkvCycleChart';
import { PumpCurveChart } from '../charts/PumpCurveChart';
import { BarChart3, Layers, TrendingUp, Activity } from 'lucide-react';

interface ChartsTabProps {
  state: WellState;
  calc: FullCalculations;
  onChange: (updates: Partial<WellState>) => void;
}

export const ChartsTab: React.FC<ChartsTabProps> = ({ state, calc, onChange }) => {
  return (
    <div className="space-y-6">
      
      {/* Visual Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wide">
              Графический комплекс и инженерная визуализация
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Интерактивный чертёж ствола скважины, динамика циклического уровня жидкости во времени и характеристика насоса Q-H с частотным регулированием
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800">
          <span className="text-slate-400">Скважина:</span>
          <strong className="text-white font-mono">{state.wellName}</strong>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Частота:</span>
          <strong className="text-blue-400 font-mono">{state.frequency} Гц</strong>
        </div>
      </div>

      {/* 1. Well Borehole Profile Chart */}
      <section>
        <WellProfileChart state={state} calc={calc} />
      </section>

      {/* 2. Pump Curve & Affinity Laws Chart */}
      <section>
        <PumpCurveChart
          state={state}
          hydraulics={calc.hydraulics}
          onFrequencyChange={(freq) => onChange({ frequency: freq })}
        />
      </section>

      {/* 3. PKV Sawtooth Level Dynamics */}
      <section>
        <PkvCycleChart state={state} pkv={calc.pkv} />
      </section>

    </div>
  );
};
