import { NumericInput } from "../NumericInput";
import React from 'react';
import { WellState, FullCalculations, AnnulusInterval, TubingInterval } from '../../types';
import { Layers, HelpCircle, Plus, Trash2, Download, CheckCircle, Scale } from 'lucide-react';

interface VolumesTabProps {
  state: WellState;
  calc: FullCalculations;
  updateState: (updates: Partial<WellState>) => void;
}

export const VolumesTab: React.FC<VolumesTabProps> = ({ state, calc, updateState }) => {
  const { volumes } = calc;

  const loadExample = () => {
    updateState({
      annulusIntervals: [
        { id: '1', casingDe: 168.3, casingS: 8.9, tubingDn: 73, length: 1200 },
        { id: '2', casingDe: 146.1, casingS: 7.7, tubingDn: 73, length: 850 },
      ],
      tubingIntervals: [
        { id: '1', tubingDn: 73, tubingS: 5.5, length: 2050 },
      ],
    });
  };

  const addAnnulusInterval = () => {
    const newInterval: AnnulusInterval = {
      id: Date.now().toString(),
      casingDe: 146.1,
      casingS: 7.7,
      tubingDn: 73,
      length: 500,
    };
    updateState({
      annulusIntervals: [...state.annulusIntervals, newInterval],
    });
  };

  const removeAnnulusInterval = (id: string) => {
    if (state.annulusIntervals.length <= 1) return;
    updateState({
      annulusIntervals: state.annulusIntervals.filter(i => i.id !== id),
    });
  };

  const updateAnnulusInterval = (id: string, updates: Partial<AnnulusInterval>) => {
    updateState({
      annulusIntervals: state.annulusIntervals.map(i => (i.id === id ? { ...i, ...updates } : i)),
    });
  };

  const addTubingInterval = () => {
    const newInterval: TubingInterval = {
      id: Date.now().toString(),
      tubingDn: 73,
      tubingS: 5.5,
      length: 500,
    };
    updateState({
      tubingIntervals: [...state.tubingIntervals, newInterval],
    });
  };

  const removeTubingInterval = (id: string) => {
    if (state.tubingIntervals.length <= 1) return;
    updateState({
      tubingIntervals: state.tubingIntervals.filter(i => i.id !== id),
    });
  };

  const updateTubingInterval = (id: string, updates: Partial<TubingInterval>) => {
    updateState({
      tubingIntervals: state.tubingIntervals.map(i => (i.id === id ? { ...i, ...updates } : i)),
    });
  };

  return (
    <div className="space-y-6">
      {/* Module Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-1">
            Модуль 07 · Геометрия и объёмы
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Ступенчатый расчёт объёмов скважины и дебита нефти
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Поинтервальный расчёт внутреннего объёма труб НКТ и затрубного пространства для планирования глушения и промывок
          </p>
        </div>
        <button
          onClick={loadExample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          <Download className="w-3.5 h-3.5 text-blue-400" />
          📥 Пример
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interval configuration tables */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Annulus Intervals */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Интервалы затрубного пространства (ЭК — НКТ)
              </h3>
              <button
                onClick={addAnnulusInterval}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Добавить интервал
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] text-slate-400 uppercase bg-slate-800/60 border-b border-slate-700">
                  <tr>
                    <th className="py-2 px-3">#</th>
                    <th className="py-2 px-3">Dнар ЭК (мм)</th>
                    <th className="py-2 px-3">Стенка s (мм)</th>
                    <th className="py-2 px-3">Dнар НКТ (мм)</th>
                    <th className="py-2 px-3">Длина L (м)</th>
                    <th className="py-2 px-3 text-right">Объём (м³)</th>
                    <th className="py-2 px-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {state.annulusIntervals.map((item, idx) => {
                    const dCasingInner = item.casingDe - 2 * item.casingS;
                    const vol =
                      dCasingInner > item.tubingDn
                        ? (Math.PI / 4) *
                          (Math.pow(dCasingInner / 1000, 2) - Math.pow(item.tubingDn / 1000, 2)) *
                          item.length
                        : 0;
                    return (
                      <tr key={item.id} className="hover:bg-slate-800/30">
                        <td className="py-2 px-3 font-mono text-slate-400">{idx + 1}</td>
                        <td className="py-2 px-3">
                          <NumericInput
                            
                            value={item.casingDe}
                            onChange={e => updateAnnulusInterval(item.id, { casingDe: Number(e.target.value) })}
                            className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 font-mono text-white text-xs outline-none"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <NumericInput
                            
                            
                            value={item.casingS}
                            onChange={e => updateAnnulusInterval(item.id, { casingS: Number(e.target.value) })}
                            className="w-16 bg-slate-800 border border-slate-700 rounded px-2 py-1 font-mono text-white text-xs outline-none"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <NumericInput
                            
                            value={item.tubingDn}
                            onChange={e => updateAnnulusInterval(item.id, { tubingDn: Number(e.target.value) })}
                            className="w-16 bg-slate-800 border border-slate-700 rounded px-2 py-1 font-mono text-white text-xs outline-none"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <NumericInput
                            
                            value={item.length}
                            onChange={e => updateAnnulusInterval(item.id, { length: Number(e.target.value) })}
                            className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 font-mono text-white text-xs outline-none"
                          />
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-amber-400">
                          {vol.toFixed(2)}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            onClick={() => removeAnnulusInterval(item.id)}
                            disabled={state.annulusIntervals.length <= 1}
                            className="text-slate-500 hover:text-rose-400 disabled:opacity-30 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. Tubing Intervals */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                Интервалы внутренней полости НКТ
              </h3>
              <button
                onClick={addTubingInterval}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Добавить секцию
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] text-slate-400 uppercase bg-slate-800/60 border-b border-slate-700">
                  <tr>
                    <th className="py-2 px-3">#</th>
                    <th className="py-2 px-3">Dнар НКТ (мм)</th>
                    <th className="py-2 px-3">Стенка s (мм)</th>
                    <th className="py-2 px-3">Длина L (м)</th>
                    <th className="py-2 px-3 text-right">Объём (м³)</th>
                    <th className="py-2 px-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {state.tubingIntervals.map((item, idx) => {
                    const dTubingInner = item.tubingDn - 2 * item.tubingS;
                    const vol =
                      dTubingInner > 0
                        ? (Math.PI / 4) * Math.pow(dTubingInner / 1000, 2) * item.length
                        : 0;
                    return (
                      <tr key={item.id} className="hover:bg-slate-800/30">
                        <td className="py-2 px-3 font-mono text-slate-400">{idx + 1}</td>
                        <td className="py-2 px-3">
                          <NumericInput
                            
                            value={item.tubingDn}
                            onChange={e => updateTubingInterval(item.id, { tubingDn: Number(e.target.value) })}
                            className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 font-mono text-white text-xs outline-none"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <NumericInput
                            
                            
                            value={item.tubingS}
                            onChange={e => updateTubingInterval(item.id, { tubingS: Number(e.target.value) })}
                            className="w-16 bg-slate-800 border border-slate-700 rounded px-2 py-1 font-mono text-white text-xs outline-none"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <NumericInput
                            
                            value={item.length}
                            onChange={e => updateTubingInterval(item.id, { length: Number(e.target.value) })}
                            className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 font-mono text-white text-xs outline-none"
                          />
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-purple-400">
                          {vol.toFixed(2)}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            onClick={() => removeTubingInterval(item.id)}
                            disabled={state.tubingIntervals.length <= 1}
                            className="text-slate-500 hover:text-rose-400 disabled:opacity-30 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Results Summary Cards */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide border-b border-slate-800 pb-2">
              Итоговые объёмы
            </h3>

            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-3.5">
              <div className="text-[11px] font-semibold text-amber-300 uppercase">
                Суммарный объём затрубного пр-ва
              </div>
              <div className="text-2xl font-extrabold text-white font-mono mt-1">
                {volumes.totalAnnulusVolM3.toFixed(2)} <span className="text-sm font-normal text-slate-400">м³</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Общая длина интервалов: {volumes.totalAnnulusLengthM} м
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-3.5">
              <div className="text-[11px] font-semibold text-purple-300 uppercase">
                Суммарный внутренний объём НКТ
              </div>
              <div className="text-2xl font-extrabold text-white font-mono mt-1">
                {volumes.totalTubingVolM3.toFixed(2)} <span className="text-sm font-normal text-slate-400">м³</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Общая длина колонны: {volumes.totalTubingLengthM} м
              </div>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-3.5">
              <div className="text-[11px] font-semibold text-blue-300 uppercase">
                Полный объём скважины (НКТ + Затруб)
              </div>
              <div className="text-2xl font-extrabold text-blue-400 font-mono mt-1">
                {(volumes.totalAnnulusVolM3 + volumes.totalTubingVolM3).toFixed(2)} <span className="text-sm font-normal text-slate-300">м³</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Объём для двух циклов глушения: {((volumes.totalAnnulusVolM3 + volumes.totalTubingVolM3) * 1.5).toFixed(1)} м³
              </div>
            </div>

            {/* Mass Flow Rate */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5">
              <div className="text-[11px] font-semibold text-emerald-300 uppercase flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                Массовый дебит чистой нефти
              </div>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
                {volumes.oilMassTonsDay.toFixed(1)} <span className="text-sm font-normal text-slate-300">т/сут</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                При обводнённости {state.waterCut}% и плотности нефти {state.oilDensity} кг/м³
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Details */}
      <details className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 leading-relaxed">
        <summary className="font-semibold text-blue-400 cursor-pointer select-none flex items-center gap-1.5 hover:text-blue-300">
          <HelpCircle className="w-4 h-4" />
          📘 Технологическое назначение расчёта ступенчатых объёмов
        </summary>
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
          <p>
            В скважинах часто применяются комбинированные эксплуатационные колонны (например, верхняя секция 168 мм, хвостовик 146 мм) либо ступенчатые подвески НКТ (например, 73 мм вверху и 60 мм у насоса).
          </p>
          <p>
            Точный поинтервальный учёт внутреннего объёма НКТ и кольцевого затрубного пространства необходим для:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>Точного расчёта объёма жидкости глушения при смене насоса или глушении перед ТКРС (прямая или обратная циркуляция);</li>
            <li>Определения времени вытеснения пачки химреагентов (ингибиторов солеотложения, коррозии, растворителей АСПО);</li>
            <li>Контроля времени движения волны давления при снятии КВД (кривых восстановления давления).</li>
          </ul>
        </div>
      </details>
    </div>
  );
};
