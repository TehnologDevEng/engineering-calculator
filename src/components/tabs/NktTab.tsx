import React from 'react';
import { NumericInput } from '../NumericInput';
import { FieldHint } from '../FieldHint';
import { WellState, NktResults, CoolingKillResults } from '../../types';
import { Pipette, ShieldCheck, Download, HelpCircle, Layers, Wrench, Link2, Droplets } from 'lucide-react';

interface NktTabProps {
  state: WellState;
  nkt: NktResults;
  coolingKill: CoolingKillResults;
  onChange: (updates: Partial<WellState>) => void;
}

const STEEL_ORDER: WellState['nktSteelGrade'][] = ['D', 'K', 'E', 'L', 'M'];

export const NktTab: React.FC<NktTabProps> = ({ state, nkt, coolingKill, onChange }) => {
  const loadExample = () => {
    onChange({
      nktSize: 73,
      nktSteelGrade: 'D',
      nktLength: 1800,
      nktType: 'smooth',
      nktFlowQ: 80,
      nktViscosity: 1.5,
      nktDensity: 1020,
      nktEspWeight: 950,
      nktIsStepped: false,
      nktTopLen: 1000,
      nktTopSize: 73,
      nktTopGrade: 'K',
    });
  };

  const syncFromPassport = () => {
    onChange({
      nktLength: state.pumpDepth,
      nktFlowQ: state.flowRate,
    });
  };

  const upgradeSteelGrade = () => {
    const idx = STEEL_ORDER.indexOf(state.nktSteelGrade);
    const next = STEEL_ORDER[Math.min(STEEL_ORDER.length - 1, Math.max(1, idx + 1))];
    if (state.nktIsStepped) {
      const topIdx = STEEL_ORDER.indexOf(state.nktTopGrade ?? 'K');
      const nextTop = STEEL_ORDER[Math.min(STEEL_ORDER.length - 1, Math.max(1, topIdx + 1))];
      onChange({ nktTopGrade: nextTop });
    } else {
      onChange({ nktSteelGrade: next });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
            Лифтовая колонна и ПРС / КРС
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Колонна НКТ и расчёт глушения скважины
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Гидравлические потери по Дарси-Вейсбаху, статическая прочность (ГОСТ 633-80) и расчёт жидкости глушения по объёму НКТ и затруба (РД 08-200-98)
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={syncFromPassport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition"
          >
            <Link2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Взять из схемы
          </button>
          <button
            type="button"
            onClick={loadExample}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Пример
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Pipette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                  Параметры колонны НКТ
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-300 font-mono">
                ГОСТ 633-80
              </span>
            </div>

            {/* Section 1: Pipe construction */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  1. Конструкция и геометрия колонны
                </div>
                <button
                  type="button"
                  onClick={() => onChange({ nktIsStepped: !state.nktIsStepped })}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border flex items-center gap-1 transition font-semibold ${
                    state.nktIsStepped
                      ? 'bg-purple-50 dark:bg-purple-600/20 border-purple-400 dark:border-purple-500 text-purple-700 dark:text-purple-300'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  Ступенчатая
                </button>
              </div>

              {state.nktIsStepped && (
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Верхняя ступень (устье):
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Длина, м</label>
                      <NumericInput
                        value={state.nktTopLen}
                        onChange={(val) => onChange({ nktTopLen: val })}
                        className="px-2 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Размер</label>
                      <select
                        value={state.nktTopSize ?? 73}
                        onChange={(e) => onChange({ nktTopSize: Number(e.target.value) })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-900 dark:text-white font-mono"
                      >
                        <option value="73">73 мм</option>
                        <option value="89">89 мм</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1">Сталь</label>
                      <select
                        value={state.nktTopGrade}
                        onChange={(e) => onChange({ nktTopGrade: e.target.value as WellState['nktTopGrade'] })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-900 dark:text-white font-mono"
                      >
                        <option value="D">Д</option>
                        <option value="K">К</option>
                        <option value="E">Е</option>
                        <option value="L">Л</option>
                        <option value="M">М</option>
                      </select>
                    </div>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800">
                    Нижняя ступень (до УЭЦН): {Math.max(0, state.nktLength - (state.nktTopLen ?? 1000))} м
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Типоразмер НКТ
                  </label>
                  <select
                    value={state.nktSize}
                    onChange={(e) => {
                      const size = Number(e.target.value);
                      onChange({ nktSize: size, tubingSize: size, pkvTubingD: size });
                    }}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:border-purple-500 focus:outline-none"
                  >
                    <option value="60">НКТ 60 (Внутр. 50.3 мм)</option>
                    <option value="73">НКТ 73 (Внутр. 62.0 мм)</option>
                    <option value="89">НКТ 89 (Внутр. 75.9 мм)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Группа прочности стали
                  </label>
                  <select
                    value={state.nktSteelGrade}
                    onChange={(e) => onChange({ nktSteelGrade: e.target.value as WellState['nktSteelGrade'] })}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:border-purple-500 focus:outline-none"
                  >
                    <option value="D">Группа «Д» (379 МПа)</option>
                    <option value="K">Группа «К» (490 МПа)</option>
                    <option value="E">Группа «Е» (552 МПа)</option>
                    <option value="L">Группа «Л» (655 МПа)</option>
                    <option value="M">Группа «М» (724 МПа)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Длина Hсп <span className="text-purple-600 dark:text-purple-400 font-mono">м</span>
                    <FieldHint hintKey="pumpDepth" />
                  </label>
                  <NumericInput
                    value={state.nktLength}
                    onChange={(val) => onChange({ nktLength: val, pumpDepth: val })}
                    className="focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Исполнение труб
                  </label>
                  <select
                    value={state.nktType}
                    onChange={(e) => onChange({ nktType: e.target.value as WellState['nktType'] })}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:border-purple-500 focus:outline-none"
                  >
                    <option value="smooth">Гладкие (ГОСТ 633)</option>
                    <option value="upset">НКТ-В (высаженные концы)</option>
                    <option value="coated">С гладкостным покрытием</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Fluid & Weight */}
            <div className="space-y-3 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 mt-4">
              <div className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                2. Параметры потока и подвески
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Дебит Q <span className="text-purple-600 dark:text-purple-400 font-mono">м³/сут</span>
                    <FieldHint hintKey="flowRate" />
                  </label>
                  <NumericInput
                    value={state.nktFlowQ}
                    onChange={(val) => onChange({ nktFlowQ: val, flowRate: val })}
                    className="focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Вязкость μ <span className="text-purple-600 dark:text-purple-400 font-mono">сСт</span>
                  </label>
                  <NumericInput
                    value={state.nktViscosity}
                    onChange={(val) => onChange({ nktViscosity: val })}
                    className="focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Плотность ρ <span className="text-purple-600 dark:text-purple-400 font-mono">кг/м³</span>
                  </label>
                  <NumericInput
                    value={state.nktDensity}
                    onChange={(val) => onChange({ nktDensity: val })}
                    className="focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Вес УЭЦН + кабель <span className="text-purple-600 dark:text-purple-400 font-mono">кг</span>
                  </label>
                  <NumericInput
                    value={state.nktEspWeight}
                    onChange={(val) => onChange({ nktEspWeight: val })}
                    className="focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hydro & Strength Results */}
        <div className="lg:col-span-7 space-y-5">
          {/* Hydraulic Results */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4 gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Гидравлический расчёт потока в НКТ
              </h3>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-300 font-mono">
                {nkt.flowRegime}
              </span>
            </div>

            <div className="divide-y divide-slate-200/80 dark:divide-slate-800/80 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Внутренний диаметр трубы dвн:</span>
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400 text-sm">
                  {nkt.dInnerMm.toFixed(1)} мм
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 px-2.5 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  Скорость восходящего потока в НКТ v:
                </span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                  {nkt.vNkt.toFixed(2)} м/с
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Число Рейнольдса Re:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {Math.round(nkt.reynolds)}
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Коэффициент гидравлического трения λ:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {nkt.lambda.toFixed(4)}
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Потери напора на трение hтр:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-200 text-sm">
                  {nkt.hLossM.toFixed(1)} м
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 px-2.5 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  Потери давления на трение ΔPтр:
                </span>
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400 text-sm">
                  {nkt.deltaPAtm.toFixed(2)} атм ({nkt.deltaPMpa.toFixed(3)} МПа)
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Вынос мехпримесей и парафина:</span>
                <span
                  className={`font-semibold ${
                    nkt.sandCarryStatus === 'good'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : nkt.sandCarryStatus === 'fair'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {nkt.sandCarryText}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 rounded-xl text-xs text-purple-900 dark:text-purple-200">
              <strong>Инженерный анализ:</strong> Потери напора на трение ({nkt.hLossM.toFixed(1)} м) прибавляются к
              расчётному напору насоса Hнас. Скорость потока {nkt.vNkt.toFixed(2)} м/с:{' '}
              {nkt.sandCarryStatus === 'danger'
                ? 'низкая — при высоком КВЧ возможно оседание шлама на клапаны.'
                : 'обеспечивает устойчивый гидротранспорт.'}
            </div>
          </div>

          {/* Strength & Tension Results */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Прочностной расчёт колонны НКТ</span>
              </h3>
              <span
                className={`text-xs font-semibold ${
                  nkt.isStrengthOk
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {nkt.isStrengthOk ? 'Запас в норме' : 'Опасность обрыва!'}
              </span>
            </div>

            <div className="divide-y divide-slate-200/80 dark:divide-slate-800/80 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Вес колонны труб в воздухе:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {Math.round(nkt.pipeWeightAirKg)} кг ({((nkt.pipeWeightAirKg * 9.81) / 1000).toFixed(1)} кН)
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Вес в жидкости (с учётом Архимеда):</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {Math.round(nkt.pipeWeightFluidKg)} кг ({((nkt.pipeWeightFluidKg * 9.81) / 1000).toFixed(1)} кН)
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 px-2.5 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  Суммарная растягивающая нагрузка:
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {Math.round(nkt.totalTensionKg)} кг ({nkt.totalTensionKn.toFixed(1)} кН)
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">
                  Предел страгивающей нагрузки (сталь {state.nktIsStepped ? state.nktTopGrade ?? 'K' : state.nktSteelGrade}):
                </span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{nkt.tensionAllowKn} кН</span>
              </div>

              <div className="py-2.5 flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 px-2.5 rounded-lg">
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  Коэффициент запаса прочности kзап:
                </span>
                <span
                  className={`font-mono font-bold text-sm ${
                    nkt.isStrengthOk
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {nkt.safetyFactor.toFixed(2)} (Норматив k ≥ 1.50)
                </span>
              </div>
            </div>

            <div
              className={`mt-4 p-3.5 rounded-xl border text-xs space-y-2.5 ${
                nkt.isStrengthOk
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40 text-rose-900 dark:text-rose-200'
              }`}
            >
              {nkt.isStrengthOk ? (
                <p>
                  Колонна труб НКТ обладает достаточным запасом статической прочности (k ={' '}
                  {nkt.safetyFactor.toFixed(2)} ≥ 1.50). Риск обрыва под собственным весом и подвеской УЭЦН исключён.
                </p>
              ) : (
                <>
                  <p>
                    <strong>Предупреждение:</strong> Запас прочности ниже нормативного 1.50! Повысьте группу прочности
                    стали или примените ступенчатую колонну.
                  </p>
                  {state.nktSteelGrade !== 'M' && (
                    <button
                      type="button"
                      onClick={upgradeSteelGrade}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition shadow-xs"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      Повысить группу стали
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PART 2: WELL KILLING (Directly tied to NKT & Annulus volumes) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
              Расчёт глушения скважины (ПРС / КРС)
            </h3>
          </div>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 font-mono">
            РД 08-200-98 · НКТ {state.nktSize} мм / ЭК {state.casingId} мм
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Killing Inputs */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Коэффициент запаса kзап
                <FieldHint hintKey="killSafetyMargin" />
              </label>
              <select
                value={state.killSafetyMargin}
                onChange={(e) => onChange({ killSafetyMargin: Number(e.target.value) })}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:border-blue-500 focus:outline-none"
              >
                <option value="1.05">1.05 (Запас 5% — до 1200 м)</option>
                <option value="1.08">1.08 (Запас 8% — 1200–2000 м)</option>
                <option value="1.10">1.10 (Запас 10% — свыше 2000 м)</option>
                <option value="1.15">1.15 (Запас 15% — АВПД)</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pпл, атм
                  <FieldHint hintKey="pPlast" />
                </label>
                <NumericInput
                  value={state.pPlast}
                  onChange={(val) => onChange({ pPlast: val })}
                  className="focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hпл, м
                  <FieldHint hintKey="depthPlast" />
                </label>
                <NumericInput
                  value={state.depthPlast}
                  onChange={(val) => onChange({ depthPlast: val })}
                  className="focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dвн ЭК, мм
                  <FieldHint hintKey="casingId" />
                </label>
                <NumericInput
                  value={state.casingId}
                  onChange={(val) => onChange({ casingId: val, pkvCasingId: val })}
                  className="focus:border-blue-500"
                />
              </div>
            </div>

            <div className="p-3.5 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-xl text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
              Перед началом ПРС/КРС подготовьте не менее{' '}
              <strong>{coolingKill.vKillReq.toFixed(1)} м³</strong> жидкости глушения плотностью{' '}
              <strong>{coolingKill.rhoKillGCm3.toFixed(2)} г/см³</strong> ({coolingKill.fluidType}) с контролем выравнивания плотности на выходе из затруба.
            </div>
          </div>

          {/* Killing Results */}
          <div className="lg:col-span-7 divide-y divide-slate-200/80 dark:divide-slate-800/80 text-xs">
            <div className="py-2.5 flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 px-2.5 rounded-lg">
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Требуемая плотность ЖГ ρглуш:
              </span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                {coolingKill.rhoKillGCm3.toFixed(2)} г/см³ ({coolingKill.rhoKillKgM3} кг/м³)
              </span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">Тип технологической жидкости глушения:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">
                {coolingKill.fluidType}
                {coolingKill.requiredSaltMassKgPerM3 > 0 && (
                  <span className="font-mono text-slate-500 dark:text-slate-400 ml-1">
                    (~{coolingKill.requiredSaltMassKgPerM3} кг/м³)
                  </span>
                )}
              </span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">Внутренний объём колонны НКТ ({state.nktLength} м):</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                {coolingKill.vTubing.toFixed(2)} м³
              </span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">Объём кольцевого пространства (затруб):</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                {coolingKill.vAnnulus.toFixed(2)} м³
              </span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">Полный объём скважины до забоя Vскв:</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                {coolingKill.vTotalWell.toFixed(1)} м³
              </span>
            </div>

            <div className="py-2.5 flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 px-2.5 rounded-lg">
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Потребный объём жидкости глушения (1.25 V):
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                {coolingKill.vKillReq.toFixed(1)} м³
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Details */}
      <details className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        <summary className="font-semibold text-purple-600 dark:text-purple-400 cursor-pointer select-none flex items-center gap-1.5 hover:text-purple-500">
          <HelpCircle className="w-4 h-4" />
          Методика гидравлики НКТ и критерии выноса мехпримесей
        </summary>
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <p>
            Гидравлические потери напора на трение определяются формулой Дарси-Вейсбаха с вычислением коэффициента λ по
            формуле Альтшуля с учётом шероховатости стенок Δ = 0.05 мм (стандартные трубы) или Δ = 0.01 мм (гладкостное
            покрытие):
          </p>
          <p className="font-mono text-slate-700 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 p-2 rounded border border-slate-200 dark:border-slate-800">
            hтр = λ · (L / d) · (v² / (2g))
          </p>
          <p>
            Для надёжного выноса частиц песка и механических примесей минимальная скорость восходящего потока должна
            составлять не менее 0.35–0.40 м/с.
          </p>
        </div>
      </details>
    </div>
  );
};
