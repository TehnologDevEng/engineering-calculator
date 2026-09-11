import React from 'react';
import { WellState, FullCalculations } from '../../types';
import { WellProfileChart } from '../charts/WellProfileChart';
import { Gauge, ShieldCheck, Compass, Settings2 } from 'lucide-react';
import { NumericInput } from '../NumericInput';

interface WellSchemeTabProps {
  state: WellState;
  calc: FullCalculations;
  updateState: (updates: Partial<WellState>) => void;
}

export const WellSchemeTab: React.FC<WellSchemeTabProps> = ({ state, calc, updateState }) => {
  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                Модуль визуализации и ввода данных
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Скв. {state.wellName} ({state.clusterName})
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Главная схема и параметры скважины
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Наглядная схема скважины и единый центр ввода ключевых исходных данных. Введённые здесь параметры автоматически применяются во всех остальных расчётных модулях.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-center">
              <div className="text-[10px] uppercase text-slate-400 font-semibold">Спуск насоса</div>
              <div className="text-base font-bold text-white font-mono">{state.pumpDepth} м</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-center">
              <div className="text-[10px] uppercase text-slate-400 font-semibold">Глубина пласта</div>
              <div className="text-base font-bold text-emerald-400 font-mono">{state.depthPlast} м</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-center">
              <div className="text-[10px] uppercase text-slate-400 font-semibold">Динамич. уровень</div>
              <div className="text-base font-bold text-blue-400 font-mono">{state.dynLevel} м</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main visual & rapid adjustment panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Visual Drawing - 2 cols on wide screens */}
        <div className="xl:col-span-2">
          <WellProfileChart state={state} calc={calc} />
        </div>

        {/* Rapid Well Geometry Adjustment */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Settings2 className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                Исходные данные скважины
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Скважина</label>
                  <input type="text" value={state.wellName} onChange={e => updateState({ wellName: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-blue-500 focus:outline-none transition-colors" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Куст</label>
                  <input type="text" value={state.clusterName} onChange={e => updateState({ clusterName: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-blue-500 focus:outline-none transition-colors" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Дебит жидкости <span className="text-blue-400 font-mono">м³/сут</span></label>
                <NumericInput value={state.flowRate} onChange={val => updateState({ flowRate: val, nktFlowQ: val })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Обводненность <span className="text-blue-400 font-mono">%</span></label>
                <NumericInput value={state.waterCut} onChange={val => updateState({ waterCut: val })} />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Глубина пласта <span className="text-blue-400 font-mono">м</span></label>
                <NumericInput value={state.depthPlast} onChange={val => updateState({ depthPlast: val })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Спуск насоса <span className="text-blue-400 font-mono">м</span></label>
                <NumericInput value={state.pumpDepth} onChange={val => updateState({ pumpDepth: val, nktLength: val })} />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">H дин. <span className="text-blue-400 font-mono">м</span></label>
                <NumericInput value={state.dynLevel} onChange={val => updateState({ dynLevel: val })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">H стат. <span className="text-blue-400 font-mono">м</span></label>
                <NumericInput value={state.pkvHstat} onChange={val => updateState({ pkvHstat: val })} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Внутр. D ЭК <span className="text-blue-400 font-mono">мм</span></label>
                <NumericInput value={state.casingId} onChange={val => updateState({ casingId: val, pkvCasingId: val })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Пласт. давление <span className="text-blue-400 font-mono">атм</span></label>
                <NumericInput value={state.pPlast} onChange={val => updateState({ pPlast: val })} />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Compass className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                Быстрая юстировка
              </h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 flex justify-between">
                  <span>Спуск насоса Hсп:</span>
                  <span className="font-mono text-white font-bold">{state.pumpDepth} м</span>
                </label>
                <input
                  type="range"
                  min={500}
                  max={state.depthPlast}
                  step={10}
                  value={state.pumpDepth}
                  onChange={e => updateState({ pumpDepth: Number(e.target.value), nktLength: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 flex justify-between">
                  <span>Динамический уровень Hдин:</span>
                  <span className="font-mono text-white font-bold">{state.dynLevel} м</span>
                </label>
                <input
                  type="range"
                  min={100}
                  max={state.pumpDepth - 50}
                  step={10}
                  value={state.dynLevel}
                  onChange={e => updateState({ dynLevel: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400 mt-1"
                />
              </div>
            </div>
          </div>

          {/* Key Hydromechanical Status Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Gauge className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                Гидростатические напоры
              </h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Столб жидкости над приёмом:</span>
                <span className="font-mono font-bold text-white">
                  {Math.max(0, state.pumpDepth - state.dynLevel)} м
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Расстояние насос — пласт:</span>
                <span className="font-mono font-bold text-white">
                  {Math.max(0, state.depthPlast - state.pumpDepth)} м
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Давление на приёме насоса:</span>
                <span className="font-mono font-bold text-blue-400">
                  {calc.hydraulics.pPr.toFixed(1)} атм
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Забойное давление Pзаб:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {calc.hydraulics.pZab.toFixed(1)} атм
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
