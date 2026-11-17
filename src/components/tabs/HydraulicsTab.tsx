import React from 'react';
import { NumericInput } from '../NumericInput';
import { FieldHint } from '../FieldHint';
import { WellState, HydraulicsResults } from '../../types';
import { Gauge, Flame, Sliders, HelpCircle, Download, Activity, AlertTriangle } from 'lucide-react';

interface HydraulicsTabProps {
  state: WellState;
  hydraulics: HydraulicsResults;
  onChange: (updates: Partial<WellState>) => void;
}

export const HydraulicsTab: React.FC<HydraulicsTabProps> = ({ state, hydraulics, onChange }) => {
  const loadExample = () => {
    onChange({
      pPlast: 185,
      pSat: 85,
      gasFactor: 45,
      depthPlast: 2200,
      flowRate: 80,
      dynLevel: 1100,
      pumpDepth: 1800,
      waterCut: 40,
      pZatr: 12,
      pBuf: 22,
      measuredPtube: 65,
      frequency: 50,
      kprMode: 0,
      customKpr: 0.8,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            Модуль 03 · Пласт и забой
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Приток пласта, давление приёма Pпр и газосодержание βвх
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Расчёт давления на приёме насоса, депрессии, продуктивности (4 режима), сверка эхограммы с ТМС и подбор газозащиты
          </p>
        </div>
        <button
          type="button"
          onClick={loadExample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition"
        >
          <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          Пример
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                  Параметры пласта и скважины
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 font-mono">
                Pпл & Газ
              </span>
            </div>

            {/* Section 1: Inflow & Reservoir */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                1. Пластовые условия и насыщение
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pпл <span className="text-blue-600 dark:text-blue-400 font-mono">атм</span>
                    <FieldHint hintKey="pPlast" />
                  </label>
                  <NumericInput
                    value={state.pPlast}
                    onChange={(val) => onChange({ pPlast: val })}
                  />
                  <span className="text-[10px] text-slate-500">Пластовое давление</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pнас <span className="text-blue-600 dark:text-blue-400 font-mono">атм</span>
                    <FieldHint hintKey="pSat" />
                  </label>
                  <NumericInput
                    value={state.pSat}
                    onChange={(val) => onChange({ pSat: val })}
                  />
                  <span className="text-[10px] text-slate-500">Давление насыщения нефти</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Газ. фактор G₀ <span className="text-blue-600 dark:text-blue-400 font-mono">м³/м³</span>
                    <FieldHint hintKey="gasFactor" />
                  </label>
                  <NumericInput
                    value={state.gasFactor}
                    onChange={(val) => onChange({ gasFactor: val })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Глубина пласта <span className="text-blue-600 dark:text-blue-400 font-mono">м</span>
                    <FieldHint hintKey="depthPlast" />
                  </label>
                  <NumericInput
                    value={state.depthPlast}
                    onChange={(val) => onChange({ depthPlast: val })}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Well and Wellhead */}
            <div className="space-y-3 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 mt-4">
              <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                2. Режим работы скважины
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Дебит Q <span className="text-blue-600 dark:text-blue-400 font-mono">м³/сут</span>
                    <FieldHint hintKey="flowRate" />
                  </label>
                  <NumericInput
                    value={state.flowRate}
                    onChange={(val) => onChange({ flowRate: val, nktFlowQ: val, chokeQ: val })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hдин <span className="text-blue-600 dark:text-blue-400 font-mono">м</span>
                    <FieldHint hintKey="dynLevel" />
                  </label>
                  <NumericInput
                    value={state.dynLevel}
                    onChange={(val) => onChange({ dynLevel: val })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Спуск Hсп <span className="text-blue-600 dark:text-blue-400 font-mono">м</span>
                    <FieldHint hintKey="pumpDepth" />
                  </label>
                  <NumericInput
                    value={state.pumpDepth}
                    onChange={(val) => onChange({ pumpDepth: val, nktLength: val })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Обводнённость <span className="text-blue-600 dark:text-blue-400 font-mono">%</span>
                    <FieldHint hintKey="waterCut" />
                  </label>
                  <NumericInput
                    value={state.waterCut}
                    onChange={(val) => onChange({ waterCut: Math.min(100, Math.max(0, val)) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pзатр <span className="text-blue-600 dark:text-blue-400 font-mono">атм</span>
                    <FieldHint hintKey="pZatr" />
                  </label>
                  <NumericInput
                    value={state.pZatr}
                    onChange={(val) => onChange({ pZatr: val })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pбуф <span className="text-blue-600 dark:text-blue-400 font-mono">атм</span>
                    <FieldHint hintKey="pBuf" />
                  </label>
                  <NumericInput
                    value={state.pBuf}
                    onChange={(val) => onChange({ pBuf: val })}
                  />
                </div>
              </div>

              {state.dynLevel >= state.pumpDepth && (
                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>Hдин ({state.dynLevel} м) глубже спуска насоса Hсп ({state.pumpDepth} м). Проверьте эхограмму.</span>
                </div>
              )}
            </div>

            {/* Section 3: Cross-validation via measured Tubing Pressure */}
            <div className="space-y-3 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 mt-4">
              <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center justify-between">
                <span>3. Сверка эхограммы и датчика ТМС</span>
                <Activity className="w-3.5 h-3.5" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Давление на приёме по ТМС (Pкт) <span className="text-blue-600 dark:text-blue-400 font-mono">атм</span>
                  <FieldHint hintKey="measuredPtube" />
                </label>
                <NumericInput
                  value={state.measuredPtube}
                  onChange={(val) => onChange({ measuredPtube: val })}
                />
              </div>

              <div
                className={`p-3 rounded-xl border text-xs ${
                  hydraulics.isDiscrepancyOk
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40 text-rose-900 dark:text-rose-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>Расчётный Hдин по датчику ТМС:</span>
                  <span className="font-mono font-bold">{Math.round(hydraulics.calculatedDynLevelFromPt)} м</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span>Расхождение с эхограммой:</span>
                  <span className="font-mono font-bold">
                    {hydraulics.levelDiscrepancyM} м{' '}
                    {hydraulics.isDiscrepancyOk ? '(в норме ≤ 100 м)' : '(> 100 м — проверьте замер)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 4: VFD frequency */}
            <div className="space-y-3 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5" />
                  4. Частота тока СУ (ЧРП)
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm bg-slate-100 dark:bg-slate-950 px-2.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                  {state.frequency} Гц
                </span>
              </div>

              <input
                type="range"
                min="35"
                max="65"
                step="1"
                value={state.frequency}
                onChange={(e) => onChange({ frequency: Number(e.target.value) })}
                className="w-full accent-blue-600 dark:accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>35 Гц (-30% Q)</span>
                <span>50 Гц (База)</span>
                <span>65 Гц (+30% Q)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculation results */}
        <div className="lg:col-span-7 space-y-5">
          {/* 4 MODES OF KPR */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Режимы расчёта продуктивности Кпр
              </h3>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                Режим {state.kprMode + 1} из 4
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 0, label: 'Расчёт Кпр', sub: 'по Q и депрессии' },
                { id: 1, label: 'Расчёт Дебита Q', sub: 'по Кпр' },
                { id: 2, label: 'Расчёт Pпл', sub: 'по Q и Кпр' },
                { id: 3, label: 'Расчёт Pзаб', sub: 'по Q и Кпр' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChange({ kprMode: m.id })}
                  className={`p-2.5 rounded-xl text-left border transition ${
                    state.kprMode === m.id
                      ? 'bg-blue-50 dark:bg-blue-600/20 border-blue-500 text-slate-900 dark:text-white'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold">{m.label}</div>
                  <div className="text-[10px] text-slate-500 truncate">{m.sub}</div>
                </button>
              ))}
            </div>

            {state.kprMode !== 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center">
                  Заданный Кпр (м³/сут/атм):
                  <FieldHint hintKey="customKpr" />
                </label>
                <NumericInput
                  value={state.customKpr}
                  onChange={(val) => onChange({ customKpr: val })}
                  className="w-24 px-2 py-1 text-xs"
                />
                <span className="text-xs text-blue-600 dark:text-blue-400 font-mono font-bold">
                  Результат: {hydraulics.kprModeResult.toFixed(1)} {state.kprMode === 1 ? 'м³/сут' : 'атм'}
                </span>
              </div>
            )}
          </div>

          {/* Pressure & Inflow Results */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Забойное давление и продуктивность
              </h3>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Приток рассчитан
              </span>
            </div>

            <div className="divide-y divide-slate-200/80 dark:divide-slate-800/80 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Средняя плотность жидкости ρсм:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {Math.round(hydraulics.rhoMix)} кг/м³
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 px-2.5 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  Давление на приёме насоса Pпр:
                </span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                  {hydraulics.pPr.toFixed(1)} атм
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">
                  Запас над давлением насыщения (Pпр − Pнас):
                </span>
                <span
                  className={`font-mono font-bold text-sm ${
                    hydraulics.deltaSat >= 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {hydraulics.deltaSat >= 0
                    ? `+${hydraulics.deltaSat.toFixed(1)} атм (Однофазный)`
                    : `${hydraulics.deltaSat.toFixed(1)} атм (Выделение газа)`}
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 px-2.5 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Забойное давление Pзаб:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {hydraulics.pZab.toFixed(1)} атм
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Депрессия на пласт (Pпл − Pзаб):</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {hydraulics.depression.toFixed(1)} атм
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 px-2.5 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  Коэффициент продуктивности Кпр:
                </span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                  {hydraulics.kpr.toFixed(2)} м³/(сут·атм)
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Потенциальный дебит при Pзаб = Pнас:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {hydraulics.potentialQ} м³/сут
                </span>
              </div>
            </div>
          </div>

          {/* Free Gas on Intake Module */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Свободный газ на входе насоса (βвх)</span>
              </h3>
              <span
                className={`text-xs font-semibold ${
                  hydraulics.gasRiskLevel === 'low'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : hydraulics.gasRiskLevel === 'medium'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {hydraulics.gasRiskLevel === 'low'
                  ? 'Газ в норме'
                  : hydraulics.gasRiskLevel === 'medium'
                  ? 'Умеренный газ'
                  : 'Высокий газ!'}
              </span>
            </div>

            <div className="divide-y divide-slate-200/80 dark:divide-slate-800/80 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Объём свободного газа в рабочих условиях:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {hydraulics.freeGasVol.toFixed(1)} м³/сут
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 px-2.5 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  Объёмное газосодержание на приёме βвх:
                </span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">
                  {hydraulics.betaIn.toFixed(1)} %
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Рекомендованный входной модуль:</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {hydraulics.gasEquipRecommendation}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs text-amber-900 dark:text-amber-200">
              {hydraulics.betaIn < 15 ? (
                <p>
                  Газосодержание низкое (β &lt; 15%). Срыв подачи исключён, стандартная входная сетка работает надёжно.
                </p>
              ) : hydraulics.betaIn <= 50 ? (
                <p>
                  Газосодержание умеренное (15–50%). Для исключения пульсаций тока и срыва подачи необходим
                  газосепаратор типа МН-ГС5.
                </p>
              ) : (
                <p className="text-rose-700 dark:text-rose-300">
                  Высокое газосодержание (&gt; 50%)! Требуется модуль газосепаратора-диспергатора ГС-10 или насос в
                  антигазовом исполнении (ЭЦНГД).
                </p>
              )}
            </div>
          </div>

          {/* VFD Scaling Laws */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Пересчёт по законам подобия ЧРП (f = {state.frequency} Гц)
              </h3>
              <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
                f/50 = {(state.frequency / 50).toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Дебит Q(f)</div>
                <div className="text-base font-extrabold text-blue-600 dark:text-blue-400 font-mono mt-1">
                  {hydraulics.scaledQ.toFixed(1)} <span className="text-xs">м³/сут</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Напор H(f)</div>
                <div className="text-base font-extrabold text-purple-600 dark:text-purple-400 font-mono mt-1">
                  {hydraulics.scaledH} <span className="text-xs">м</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                  Мощность N(f)
                </div>
                <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                  {hydraulics.scaledPower} <span className="text-xs">кВт</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Details */}
      <details className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        <summary className="font-semibold text-blue-600 dark:text-blue-400 cursor-pointer select-none flex items-center gap-1.5 hover:text-blue-500">
          <HelpCircle className="w-4 h-4" />
          Методика расчёта притока, депрессии и свободного газа на приёме
        </summary>
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <p>
            Давление на приёме насоса определяется суммой давления в затрубном пространстве на устье Pзатр и
            гидростатического давления столба смеси над приёмом:
          </p>
          <p className="font-mono text-slate-700 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 p-2 rounded border border-slate-200 dark:border-slate-800">
            Pпр = Pзатр + ρсм · g · (Hсп − Hдин) / 101325
          </p>
          <p>
            Если давление на приёме опускается ниже давления насыщения Pнас, из нефти начинает выделяться свободный
            попутный газ. При βвх &gt; 15% стандартные ступени теряют напор, а при βвх &gt; 25% необходим
            газосепаратор.
          </p>
        </div>
      </details>
    </div>
  );
};
