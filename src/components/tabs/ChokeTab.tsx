import React from 'react';
import { NumericInput } from '../NumericInput';
import { FieldHint } from '../FieldHint';
import { WellState, FullCalculations } from '../../types';
import { HelpCircle, CheckCircle, Download, Link2, AlertTriangle } from 'lucide-react';
import { STD_CHOKES } from '../../data/constants';

interface ChokeTabProps {
  state: WellState;
  calc: FullCalculations;
  updateState: (updates: Partial<WellState>) => void;
}

export const ChokeTab: React.FC<ChokeTabProps> = ({ state, calc, updateState }) => {
  const { choke } = calc;

  const loadExample = () => {
    updateState({
      chokeQ: 80,
      chokeDp: 15,
      chokeRho: 950,
      chokeC: 0.68,
    });
  };

  const syncFromPassport = () => {
    updateState({
      chokeQ: state.flowRate,
      chokeRho: Math.round(calc.hydraulics.rhoMix),
    });
  };

  const hasInvalidInput = state.chokeQ <= 0 || state.chokeDp <= 0 || state.chokeRho <= 0 || state.chokeC <= 0;

  return (
    <div className="space-y-6">
      {/* Module Title Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
            Модуль 06 · Гидродинамика устья
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Расчёт и подбор диаметра штуцера
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Определение требуемого диаметра диафрагмы устьевого штуцера по заданному дебиту и перепаду давления
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={syncFromPassport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition whitespace-nowrap"
          >
            <Link2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Взять из схемы
          </button>
          <button
            type="button"
            onClick={loadExample}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Пример
          </button>
        </div>
      </div>

      {hasInvalidInput && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-500/40 text-xs text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Дебит, перепад давления ΔP, плотность и коэффициент расхода должны быть больше нуля.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Parameters */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 transition-colors">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide border-b border-slate-200 dark:border-slate-800 pb-2">
            Исходные технологические параметры
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <span>Дебит жидкости Q, м³/сут</span>
                <FieldHint hintKey="flowRate" />
              </label>
              <div className="relative mt-1">
                <NumericInput
                  value={state.chokeQ || ''}
                  onChange={val => updateState({ chokeQ: val })}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 pr-14 text-sm text-slate-900 dark:text-white font-mono focus:border-blue-500 outline-none"
                  placeholder="80"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400">м³/сут</span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Фактический или плановый расход скважины</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <span>Перепад давления на штуцере ΔP, атм</span>
                <FieldHint hintKey="chokeDp" />
              </label>
              <div className="relative mt-1">
                <NumericInput
                  value={state.chokeDp || ''}
                  onChange={val => updateState({ chokeDp: val })}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 pr-12 text-sm text-slate-900 dark:text-white font-mono focus:border-blue-500 outline-none"
                  placeholder="15"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400">атм</span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Pбуф (до штуцера) минус Pлин (после штуцера)</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Плотность протекающей смеси ρ, кг/м³
              </label>
              <div className="relative mt-1">
                <NumericInput
                  value={state.chokeRho || ''}
                  onChange={val => updateState({ chokeRho: val })}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 pr-14 text-sm text-slate-900 dark:text-white font-mono focus:border-blue-500 outline-none"
                  placeholder="950"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400">кг/м³</span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Средневзвешенная плотность водонефтяной эмульсии</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <span>Коэффициент расхода диафрагмы C</span>
                <FieldHint hintKey="chokeC" />
              </label>
              <div className="relative mt-1">
                <NumericInput
                  value={state.chokeC || ''}
                  onChange={val => updateState({ chokeC: val })}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 pr-12 text-sm text-slate-900 dark:text-white font-mono focus:border-blue-500 outline-none"
                  placeholder="0.68"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400">доля</span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Стандартное значение для штуцеров = 0.68</span>
            </div>
          </div>

          {/* Standard Row Visualizer */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Стандартный типоразмерный ряд штуцеров (мм):
            </div>
            <div className="flex flex-wrap gap-1.5">
              {STD_CHOKES.map(d => {
                const isSelected = d === choke.stdChokeMm;
                return (
                  <span
                    key={d}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {d} мм
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Cards */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 transition-colors">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide border-b border-slate-200 dark:border-slate-800 pb-2">
              Результаты расчёта
            </h3>

            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3.5">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Точный расчётный диаметр
              </div>
              <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-mono mt-1">
                {choke.calcDiameterMm.toFixed(2)}{' '}
                <span className="text-sm font-normal text-slate-500 dark:text-slate-300">мм</span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/30 rounded-xl p-3.5">
              <div className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 uppercase">
                Ближайший стандартный штуцер
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1 flex items-center gap-2">
                <span>{choke.stdChokeMm} мм</span>
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-xs text-blue-800 dark:text-blue-200 mt-1">
                {choke.statusText}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3.5">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Площадь проходного сечения
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-1">
                {choke.areaMm2.toFixed(2)}{' '}
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">мм²</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Details */}
      <details className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed transition-colors">
        <summary className="font-semibold text-blue-600 dark:text-blue-400 cursor-pointer select-none flex items-center gap-1.5 hover:text-blue-500 dark:hover:text-blue-300">
          <HelpCircle className="w-4 h-4" />
          Физический смысл и методика расчёта штуцера
        </summary>
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <p>
            Штуцирование устья применяется для регулирования давления в буферной линии и затрубном пространстве, а также для создания противодавления насосу, предотвращающего самоизлив или срыв подачи.
          </p>
          <p className="font-mono text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded border border-slate-200 dark:border-slate-800">
            A = (Q / 86400) / [ C · √(2 · ΔP · 101325 / ρ) ]<br />
            d = √(4 · A / π) · 1000 (мм)
          </p>
          <p>
            Калькулятор рассчитывает точную площадь диафрагмы по уравнению истечения несжимаемой жидкости через сужающее отверстие и автоматически подбирает ближайший больший диаметр из промыслового ряда ГОСТ/РД.
          </p>
        </div>
      </details>
    </div>
  );
};
