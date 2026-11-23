import React from 'react';
import { WellState, FullCalculations } from '../../types';
import { NumericInput } from '../NumericInput';
import { FieldHint } from '../FieldHint';
import {
  TrendingUp,
  Link2,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  HelpCircle,
  Sliders,
  Compass,
  Activity,
} from 'lucide-react';

interface HeadMarginTabProps {
  state: WellState;
  calc: FullCalculations;
  onChange: (updates: Partial<WellState>) => void;
}

export const HeadMarginTab: React.FC<HeadMarginTabProps> = ({ state, calc, onChange }) => {
  const { headMargin, hydraulics } = calc;

  const syncFromPassport = () => {
    const tmsPressure = state.levelInputMode === 'tmsp' ? state.tmspPDyn : state.measuredPtube;
    onChange({
      headPumpDepth: state.pumpDepth,
      headPBuf: state.pBuf,
      headPZatr: state.pZatr,
      headFreq: state.frequency,
      headPtms: tmsPressure,
      headNdVert: Math.max(0, state.dynLevel - state.headElongation),
    });
  };

  const applyRecommendedFreq = () => {
    const target = Number(Math.min(200, Math.max(30, headMargin.recFreqMarginHz)).toFixed(1));
    onChange({ headFreq: target });
  };

  const hasElongationError = state.headElongation > state.headPumpDepth;
  const maxBarHead = Math.max(100, headMargin.headAtFreqM, headMargin.requiredHeadM) * 1.08;
  const reqBarPct = Math.min(100, Math.max(0, (headMargin.requiredHeadM / maxBarHead) * 100));
  const actualBarPct = Math.min(100, Math.max(0, (headMargin.headAtFreqM / maxBarHead) * 100));
  const deltaPHeadM = Math.round((state.headPBuf - state.headPZatr) * headMargin.coeffMPerAtm);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1">
            Модуль 08 · Экспресс-контроль напора УЭЦН
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Расчёт запаса напора по ТМС и частоте ЧРП
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Проверка развиваемого напора установки на текущей частоте с учётом удлинения ствола, Pбуф, Pзатр и Pтмс / Hд по вертикали
          </p>
        </div>

        <button
          type="button"
          onClick={syncFromPassport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition whitespace-nowrap shrink-0"
        >
          <Link2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          Взять из схемы
        </button>
      </div>

      {hasElongationError && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-500/40 text-xs text-rose-800 dark:text-rose-200">
          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>
            Удлинение ({state.headElongation} м) не может превышать глубину спуска ({state.headPumpDepth} м). Проверьте инклинометрию.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-5 transition-colors">
            {/* Mode & Method Switches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Источник уровня Hд
                </div>
                <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => onChange({ headMode: 'tms' })}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      state.headMode === 'tms'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    По Pтмс
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ headMode: 'nd' })}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      state.headMode === 'nd'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    По Hд верт.
                  </button>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Перевод атм → метры
                </div>
                <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => onChange({ headMethod: 'express' })}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      state.headMethod === 'express'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title="Промысловый экспресс-коэффициент 10 м/атм"
                  >
                    ×10 м/атм
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ headMethod: 'density' })}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      state.headMethod === 'density'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title={`По расчётной плотности смеси ρсм = ${Math.round(hydraulics.rhoMix)} кг/м³`}
                  >
                    По ρсм ({Math.round(hydraulics.rhoMix)})
                  </button>
                </div>
              </div>
            </div>

            {/* Geometry & Pump Passport */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <Compass className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Параметры спуска и установки</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                    <span>Глубина спуска Hсп, м</span>
                    <FieldHint hintKey="pumpDepth" />
                  </label>
                  <NumericInput
                    value={state.headPumpDepth}
                    onChange={(val) => onChange({ headPumpDepth: val })}
                    className="mt-1 w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                    <span>Удлинение Hсп (ΔL), м</span>
                    <FieldHint hintKey="headElongation" />
                  </label>
                  <NumericInput
                    value={state.headElongation}
                    onChange={(val) => onChange({ headElongation: val })}
                    className="mt-1 w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:border-blue-500 outline-none"
                  />
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    Hсп по вертикали = <strong className="text-slate-800 dark:text-slate-200">{headMargin.hVertPump.toFixed(1)} м</strong>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                    <span>Напор установки на F=50 Гц, м</span>
                    <FieldHint hintKey="headPump50Hz" />
                  </label>
                  <NumericInput
                    value={state.headPump50Hz}
                    onChange={(val) => onChange({ headPump50Hz: val })}
                    className="mt-1 w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                    <span>Текущая частота F, Гц</span>
                    <FieldHint hintKey="headFreq" />
                  </label>
                  <NumericInput
                    value={state.headFreq}
                    onChange={(val) => onChange({ headFreq: val })}
                    className="mt-1 w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:border-blue-500 outline-none"
                  />
                  <input
                    type="range"
                    min={30}
                    max={state.headFreq > 75 ? 120 : 75}
                    step={0.5}
                    value={Math.min(state.headFreq > 75 ? 120 : 75, Math.max(30, state.headFreq))}
                    onChange={(e) => onChange({ headFreq: parseFloat(e.target.value) })}
                    className="w-full mt-2 accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Pressures & Level */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Устьевые давления и уровень</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                    <span>Pбуф, атм</span>
                    <FieldHint hintKey="pBuf" />
                  </label>
                  <NumericInput
                    value={state.headPBuf}
                    onChange={(val) => onChange({ headPBuf: val })}
                    className="mt-1 w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                    <span>Pзатр, атм</span>
                    <FieldHint hintKey="pZatr" />
                  </label>
                  <NumericInput
                    value={state.headPZatr}
                    onChange={(val) => onChange({ headPZatr: val })}
                    className="mt-1 w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:border-blue-500 outline-none"
                  />
                </div>

                {state.headMode === 'tms' ? (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                      <span>Pтмс, атм</span>
                      <FieldHint hintKey="headPtms" />
                    </label>
                    <NumericInput
                      value={state.headPtms}
                      onChange={(val) => onChange({ headPtms: val })}
                      className="mt-1 w-full bg-slate-50 dark:bg-slate-800/80 border border-blue-400 dark:border-blue-500/70 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:border-blue-500 outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                      <span>Hд по вертикали, м</span>
                      <FieldHint hintKey="headNdVert" />
                    </label>
                    <NumericInput
                      value={state.headNdVert}
                      onChange={(val) => onChange({ headNdVert: val })}
                      className="mt-1 w-full bg-slate-50 dark:bg-slate-800/80 border border-blue-400 dark:border-blue-500/70 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:border-blue-500 outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Results & Diagnostics */}
        <div className="lg:col-span-6 space-y-5">
          {/* Hero Reserve Card */}
          <div
            className={`rounded-2xl p-5 border transition-colors ${
              headMargin.status === 'deficit'
                ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-500/50'
                : headMargin.status === 'low'
                ? 'bg-amber-50 dark:bg-amber-950/25 border-amber-300 dark:border-amber-500/40'
                : 'bg-emerald-50 dark:bg-emerald-950/25 border-emerald-300 dark:border-emerald-500/40'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>Запас напора на F = {state.headFreq} Гц</span>
                </div>
                <div
                  className={`text-4xl font-extrabold font-mono mt-1.5 tracking-tight ${
                    headMargin.status === 'deficit'
                      ? 'text-rose-700 dark:text-rose-400'
                      : headMargin.status === 'low'
                      ? 'text-amber-700 dark:text-amber-400'
                      : 'text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  {headMargin.headMarginM > 0 ? `+${headMargin.headMarginM}` : headMargin.headMarginM}{' '}
                  <span className="text-lg font-semibold">м</span>
                  <span className="text-sm font-mono font-semibold ml-2 opacity-80">
                    ({headMargin.headMarginPct >= 0 ? '+' : ''}
                    {headMargin.headMarginPct.toFixed(1)}%)
                  </span>
                </div>
              </div>

              {headMargin.status === 'ok' ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle
                  className={`w-8 h-8 shrink-0 ${
                    headMargin.status === 'deficit'
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                />
              )}
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-200 mt-3 leading-relaxed">
              {headMargin.statusText}
            </p>

            {headMargin.status !== 'ok' && headMargin.recFreqMarginHz > 0 && (
              <div className="mt-3.5 pt-3 border-t border-slate-200/70 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  Для выхода в 0: <strong className="font-mono">{headMargin.minFreqZeroHz.toFixed(1)} Гц</strong> · Для запаса +200 м:{' '}
                  <strong className="font-mono">{headMargin.recFreqMarginHz.toFixed(1)} Гц</strong>
                </div>
                <button
                  type="button"
                  onClick={applyRecommendedFreq}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition cursor-pointer"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  Поставить F = {headMargin.recFreqMarginHz.toFixed(1)} Гц
                </button>
              </div>
            )}
          </div>

          {/* 4 Key Calculated Rows (exact match to Excel output) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                {state.headMode === 'tms' ? 'Hд ТМС по вертикали' : 'Hд по вертикали'}
              </div>
              <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
                {Math.round(headMargin.ndVertM)} <span className="text-xs font-normal text-slate-500">м</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                Hсп.верт = {Math.round(headMargin.hVertPump)} м
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Необходимый напор
              </div>
              <div className="text-xl font-extrabold font-mono text-amber-600 dark:text-amber-400 mt-1">
                {Math.round(headMargin.requiredHeadM)} <span className="text-xs font-normal text-slate-500">м</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                ΔP устья: {deltaPHeadM >= 0 ? `+${deltaPHeadM}` : deltaPHeadM} м
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Напор на F ({state.headFreq} Гц)
              </div>
              <div className="text-xl font-extrabold font-mono text-blue-600 dark:text-blue-400 mt-1">
                {headMargin.headAtFreqM} <span className="text-xs font-normal text-slate-500">м</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                Коэфф. (F/50)² = {Math.pow(state.headFreq / 50, 2).toFixed(3)}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Порог частоты Fmin
              </div>
              <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
                {headMargin.minFreqZeroHz.toFixed(1)} <span className="text-xs font-normal text-slate-500">Гц</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                Для +200 м: {headMargin.recFreqMarginHz.toFixed(1)} Гц
              </div>
            </div>
          </div>

          {/* Visual Head Balance Comparison */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 transition-colors">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Баланс напоров</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Требуемый напор (Hд + ΔP устья)</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {Math.round(headMargin.requiredHeadM)} м
                  </span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${reqBarPct}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Напор установки на F = {state.headFreq} Гц</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {headMargin.headAtFreqM} м
                  </span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      headMargin.status === 'deficit'
                        ? 'bg-rose-500'
                        : headMargin.status === 'low'
                        ? 'bg-amber-400'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${actualBarPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sensitivity Table by Frequency */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 transition-colors">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Прогноз запаса напора при изменении частоты ЧРП
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase text-slate-500 dark:text-slate-400">
                    <th className="py-2 pr-2">Частота F</th>
                    <th className="py-2 px-2">Напор H(F)</th>
                    <th className="py-2 px-2">Запас напора</th>
                    <th className="py-2 pl-2 text-right">Действие</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70 font-mono">
                  {headMargin.freqTable.map((row) => {
                    const isCurrent = Math.abs(row.freq - state.headFreq) < 0.05;
                    return (
                      <tr
                        key={row.freq}
                        className={isCurrent ? 'bg-blue-50/70 dark:bg-blue-950/30' : ''}
                      >
                        <td className="py-2 pr-2 font-bold text-slate-900 dark:text-white">
                          {row.freq} Гц {isCurrent && <span className="font-sans text-[10px] text-blue-600 dark:text-blue-400 ml-1">(текущая)</span>}
                        </td>
                        <td className="py-2 px-2 text-slate-700 dark:text-slate-300">{row.headM} м</td>
                        <td
                          className={`py-2 px-2 font-bold ${
                            row.marginM < 0
                              ? 'text-rose-600 dark:text-rose-400'
                              : row.marginM < 150
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {row.marginM > 0 ? `+${row.marginM}` : row.marginM} м
                        </td>
                        <td className="py-2 pl-2 text-right">
                          {!isCurrent && (
                            <button
                              type="button"
                              onClick={() => onChange({ headFreq: row.freq })}
                              className="font-sans text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                            >
                              Применить
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Formula Reference Details */}
      <details className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed transition-colors">
        <summary className="font-semibold text-blue-600 dark:text-blue-400 cursor-pointer select-none flex items-center gap-1.5 hover:text-blue-500 dark:hover:text-blue-300">
          <HelpCircle className="w-4 h-4" />
          Методика и формулы расчёта запаса напора
        </summary>
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <p className="font-mono text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="block">Hсп.верт = Hсп − Удлинение</span>
            <span className="block">
              Hд ТМС по вертикали = Hсп.верт − (Pтмс − Pзатр) · {headMargin.coeffMPerAtm.toFixed(headMargin.coeffMPerAtm === 10 ? 0 : 2)}
            </span>
            <span className="block">
              Hнеобх = Hд.верт + (Pбуф − Pзатр) · {headMargin.coeffMPerAtm.toFixed(headMargin.coeffMPerAtm === 10 ? 0 : 2)}
            </span>
            <span className="block">H(F) = H(50 Гц) · (F / 50)²</span>
            <span className="block font-bold text-blue-700 dark:text-blue-400">
              Запас напора = H(F) − Hнеобх
            </span>
          </p>
          <p>
            По умолчанию используется промысловый коэффициент <strong>1 атм = 10 м</strong>. При необходимости можно переключить расчёт на фактическую плотность водонефтяной смеси ρсм из паспорта скважины.
          </p>
        </div>
      </details>
    </div>
  );
};
