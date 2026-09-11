import { NumericInput } from "../NumericInput";
import React from 'react';
import { WellState, NktResults } from '../../types';
import { Pipette, ShieldCheck, Download, HelpCircle, Layers } from 'lucide-react';

interface NktTabProps {
  state: WellState;
  nkt: NktResults;
  onChange: (updates: Partial<WellState>) => void;
}

export const NktTab: React.FC<NktTabProps> = ({ state, nkt, onChange }) => {
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

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-1">
            Модуль 02 · Лифтовая колонна
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Гидравлический и прочностной расчёт колонны НКТ
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Потери давления на трение по Дарси-Вейсбаху, скорость выноса шлама и запас статической прочности колонны (ГОСТ 633-80)
          </p>
        </div>
        <button
          onClick={loadExample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          <Download className="w-3.5 h-3.5 text-purple-400" />
          📥 Пример
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Pipette className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Параметры колонны НКТ
                </h3>
              </div>
              <span className="text-[11px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                ГОСТ 633-80
              </span>
            </div>

            {/* Section 1: Pipe construction */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                  1. Конструкция и геометрия колонны НКТ
                </div>
                <button
                  type="button"
                  onClick={() => onChange({ nktIsStepped: !state.nktIsStepped })}
                  className={`text-[11px] px-2 py-0.5 rounded border flex items-center gap-1 transition ${
                    state.nktIsStepped
                      ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  Ступенчатая
                </button>
              </div>

              {state.nktIsStepped ? (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="text-[11px] font-bold text-slate-300">Верхняя ступень (устье):</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Длина, м</label>
                      <NumericInput
                        
                        value={state.nktTopLen}
                        onChange={val => onChange({ nktTopLen: val })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Размер</label>
                      <select
                        value={state.nktTopSize}
                        onChange={val => onChange({ nktTopSize: val })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"
                      >
                        <option value="73">73 мм</option>
                        <option value="89">89 мм</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Сталь</label>
                      <select
                        value={state.nktTopGrade}
                        onChange={(e) => onChange({ nktTopGrade: e.target.value as any })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"
                      >
                        <option value="D">Д</option>
                        <option value="K">К</option>
                        <option value="E">Е</option>
                        <option value="L">Л</option>
                      </select>
                    </div>
                  </div>
                  <div className="text-[11px] font-bold text-slate-300 pt-2 border-t border-slate-800">
                    Нижняя ступень (до УЭЦН): {Math.max(0, state.nktLength - state.nktTopLen)} м
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Типоразмер НКТ
                  </label>
                  <select
                    value={state.nktSize}
                    onChange={val => onChange({ nktSize: val })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-purple-500 focus:outline-none"
                  >
                    <option value="60">НКТ 60 (Внутр. 50.3 мм)</option>
                    <option value="73">НКТ 73 (Внутр. 62.0 мм)</option>
                    <option value="89">НКТ 89 (Внутр. 75.9 мм)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Группа прочности стали
                  </label>
                  <select
                    value={state.nktSteelGrade}
                    onChange={(e) => onChange({ nktSteelGrade: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-purple-500 focus:outline-none"
                  >
                    <option value="D">Группа «Д» (σт = 379 МПа)</option>
                    <option value="K">Группа «К» (σт = 490 МПа)</option>
                    <option value="E">Группа «Е» (σт = 552 МПа)</option>
                    <option value="L">Группа «Л» (σт = 655 МПа)</option>
                    <option value="M">Группа «М» (σт = 724 МПа)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Длина колонны Hсп <span className="text-purple-400 font-mono">м</span>
                  </label>
                  <NumericInput
                    
                    
                    value={state.nktLength}
                    onChange={val => onChange({ nktLength: val, pumpDepth: val })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Исполнение труб
                  </label>
                  <select
                    value={state.nktType}
                    onChange={(e) => onChange({ nktType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-purple-500 focus:outline-none"
                  >
                    <option value="smooth">Гладкие (ГОСТ 633)</option>
                    <option value="upset">НКТ-В (высаженные концы)</option>
                    <option value="coated">С антикоррозионным покрытием</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Fluid & Weight */}
            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                2. Параметры потока и подвески
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Дебит потока Q <span className="text-purple-400 font-mono">м³/сут</span>
                  </label>
                  <NumericInput
                    
                    
                    value={state.nktFlowQ}
                    onChange={val => onChange({ nktFlowQ: val, flowRate: val })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Вязкость смеси μ <span className="text-purple-400 font-mono">сСт</span>
                  </label>
                  <NumericInput
                    
                    
                    value={state.nktViscosity}
                    onChange={val => onChange({ nktViscosity: val })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Плотность смеси ρ <span className="text-purple-400 font-mono">кг/м³</span>
                  </label>
                  <NumericInput
                    
                    
                    value={state.nktDensity}
                    onChange={val => onChange({ nktDensity: val })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Вес УЭЦН + кабель <span className="text-purple-400 font-mono">кг</span>
                  </label>
                  <NumericInput
                    
                    
                    value={state.nktEspWeight}
                    onChange={val => onChange({ nktEspWeight: val })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Hydro & Strength Results */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Hydraulic Results */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                Гидравлический расчёт потока в НКТ
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-purple-500/10 text-purple-300 border-purple-500/30">
                {nkt.flowRegime}
              </span>
            </div>

            <div className="divide-y divide-slate-800/80 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Внутренний диаметр трубы dвн:</span>
                <span className="font-mono font-bold text-purple-400 text-sm">{nkt.dInnerMm.toFixed(1)} мм</span>
              </div>

              <div className="py-2.5 flex justify-between items-center bg-slate-950/40 px-2 rounded-lg">
                <span className="text-slate-300 font-medium">Скорость восходящего потока в НКТ v:</span>
                <span className="font-mono font-bold text-blue-400 text-sm">{nkt.vNkt.toFixed(2)} м/с</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Число Рейнольдса Re:</span>
                <span className="font-mono font-semibold text-slate-200">{Math.round(nkt.reynolds)}</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Коэффициент гидравлического трения λ:</span>
                <span className="font-mono font-semibold text-slate-200">{nkt.lambda.toFixed(4)}</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Потери напора на трение hтр:</span>
                <span className="font-mono font-bold text-slate-200 text-sm">{nkt.hLossM.toFixed(1)} м</span>
              </div>

              <div className="py-2.5 flex justify-between items-center bg-slate-950/40 px-2 rounded-lg">
                <span className="text-slate-300 font-medium">Потери давления на трение ΔPтр:</span>
                <span className="font-mono font-bold text-purple-400 text-sm">
                  {nkt.deltaPAtm.toFixed(2)} атм ({nkt.deltaPMpa.toFixed(3)} МПа)
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Вынос мехпримесей и парафина:</span>
                <span className={`font-semibold ${
                  nkt.sandCarryStatus === 'good' ? 'text-emerald-400' : nkt.sandCarryStatus === 'fair' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {nkt.sandCarryText}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-purple-950/20 border border-purple-900/40 rounded-xl text-xs text-purple-200">
              <strong>Инженерный анализ:</strong> Потери напора на трение ({nkt.hLossM.toFixed(1)} м) прибавляются к расчетному напору насоса Hнас. Скорость потока {nkt.vNkt.toFixed(2)} м/с: {nkt.sandCarryStatus === 'danger' ? 'низкая, при высоком КВЧ возможно оседание шлама на клапаны.' : 'обеспечивает устойчивый гидротранспорт.'}
            </div>
          </div>

          {/* Strength & Tension Results */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Прочностной расчёт колонны НКТ</span>
              </h3>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                nkt.isStrengthOk
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}>
                {nkt.isStrengthOk ? 'Запас в норме' : 'Опасность обрыва!'}
              </span>
            </div>

            <div className="divide-y divide-slate-800/80 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Вес колонны труб в воздухе:</span>
                <span className="font-mono font-semibold text-slate-200">
                  {Math.round(nkt.pipeWeightAirKg)} кг ({((nkt.pipeWeightAirKg * 9.81) / 1000).toFixed(1)} кН)
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Вес в жидкости (с учетом силы Архимеда):</span>
                <span className="font-mono font-semibold text-slate-200">
                  {Math.round(nkt.pipeWeightFluidKg)} кг ({((nkt.pipeWeightFluidKg * 9.81) / 1000).toFixed(1)} кН)
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center bg-slate-950/40 px-2 rounded-lg">
                <span className="text-slate-300 font-medium">Суммарная растягивающая нагрузка на верхнее сечение:</span>
                <span className="font-mono font-bold text-white text-sm">
                  {Math.round(nkt.totalTensionKg)} кг ({nkt.totalTensionKn.toFixed(1)} кН)
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Предел страгивающей нагрузки (сталь {state.nktSteelGrade}):</span>
                <span className="font-mono font-bold text-blue-400">{nkt.tensionAllowKn} кН</span>
              </div>

              <div className="py-2.5 flex justify-between items-center bg-slate-950/40 px-2 rounded-lg">
                <span className="text-slate-300 font-medium">Коэффициент запаса прочности kзап:</span>
                <span className={`font-mono font-bold text-sm ${
                  nkt.isStrengthOk ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {nkt.safetyFactor.toFixed(2)} (Норматив k ≥ 1.50)
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-xs text-emerald-200">
              {nkt.isStrengthOk ? (
                <p>
                  ✓ Колонна труб НКТ обладает достаточным запасом статической прочности (k = {nkt.safetyFactor.toFixed(2)} ≥ 1.50). Риск обрыва под собственным весом и подвеской УЭЦН исключен.
                </p>
              ) : (
                <p className="text-rose-300">
                  ⚠ Запас прочности ниже нормативного 1.50! Рекомендуется повысить группу прочности стали (на «К» или «Е») или использовать ступенчатую колонну.
                </p>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Guide Details */}
      <details className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 leading-relaxed">
        <summary className="font-semibold text-purple-400 cursor-pointer select-none flex items-center gap-1.5 hover:text-purple-300">
          <HelpCircle className="w-4 h-4" />
          📘 Методика гидравлики НКТ и критерии выноса мехпримесей
        </summary>
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
          <p>
            Гидравлические потери напора на трение определяются формулой Дарси-Вейсбаха с вычислением коэффициента $\lambda$ по формуле Альтшуля с учетом шероховатости стенок $\Delta = 0.05$ мм (для стандартных труб) или $\Delta = 0.01$ мм (для труб с гладкостным внутренним покрытием):
          </p>
          <p className="font-mono text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-800">
            hтр = λ · (L / d) · (v² / (2g))
          </p>
          <p>
            Для надежного выноса частиц песка и механических примесей минимальная скорость восходящего потока должна составлять не менее 0.35–0.40 м/с. При скоростях ниже 0.25 м/с возникает риск песчаных пробок над обратным клапаном насоса при остановках.
          </p>
        </div>
      </details>
    </div>
  );
};

