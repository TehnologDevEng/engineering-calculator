import React from 'react';
import { ActiveTab, WellState, FullCalculations } from '../../types';
import { WellProfileChart } from '../charts/WellProfileChart';
import { Gauge, Compass, Settings2, AlertTriangle, Radio } from 'lucide-react';
import { NumericInput } from '../NumericInput';
import { FieldHint } from '../FieldHint';
import { calculateLevelsFromTmsp } from '../../utils/calculations';

interface WellSchemeTabProps {
  state: WellState;
  calc: FullCalculations;
  updateState: (updates: Partial<WellState>) => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const WellSchemeTab: React.FC<WellSchemeTabProps> = ({
  state,
  calc,
  updateState,
  onNavigateTab,
}) => {
  const tmspInfo = calculateLevelsFromTmsp(state);

  // Real-time logical checks
  const warnings: string[] = [];
  if (state.levelInputMode === 'tmsp' && state.tmspPDyn >= state.tmspPStat) {
    warnings.push(`Давление ТМСП при работе (${state.tmspPDyn} атм) не может быть выше или равно статическому (${state.tmspPStat} атм).`);
  }
  if (state.dynLevel >= state.pumpDepth) {
    warnings.push(`Динамический уровень (${state.dynLevel} м) ниже или равен спуску насоса (${state.pumpDepth} м) — насос будет работать «всухую» (без столба над приёмом).`);
  }
  if (state.pumpDepth > state.depthPlast) {
    warnings.push(`Спуск насоса (${state.pumpDepth} м) глубже продуктивного пласта (${state.depthPlast} м).`);
  }
  if (state.pkvHstat >= state.dynLevel) {
    warnings.push(`Статический уровень (${state.pkvHstat} м) не может быть глубже динамического (${state.dynLevel} м).`);
  }
  if (state.pSat > state.pPlast) {
    warnings.push(`Давление насыщения (${state.pSat} атм) выше пластового (${state.pPlast} атм) — разгазирование начинается уже в пласте.`);
  }

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-blue-600 dark:text-blue-400">Шаг 1 · Паспорт скважины</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">Скв. {state.wellName} ({state.clusterName})</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Главная схема и исходные параметры скважины
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Введите основные данные здесь — они автоматически передадутся во все расчётные модули (НКТ, приток, ПКВ, охлаждение, штуцер). Нажимайте <strong className="text-slate-700 dark:text-slate-200">?</strong> рядом с полем, чтобы узнать, откуда взять значение.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-center">
              <div className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-semibold">Спуск насоса</div>
              <div className="text-base font-bold text-slate-900 dark:text-white font-mono">{state.pumpDepth} м</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-center">
              <div className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-semibold">Глубина пласта</div>
              <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">{state.depthPlast} м</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-center">
              <div className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-semibold">Динамич. уровень</div>
              <div className="text-base font-bold text-blue-600 dark:text-blue-400 font-mono">{state.dynLevel} м</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main visual & rapid adjustment panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Visual Drawing */}
        <div className="xl:col-span-2">
          <WellProfileChart state={state} calc={calc} onNavigateTab={onNavigateTab} />
        </div>

        {/* Rapid Well Geometry Adjustment */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 transition-colors">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Settings2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Паспортные данные скважины
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Скважина
                  </label>
                  <input
                    type="text"
                    value={state.wellName}
                    onChange={(e) => updateState({ wellName: e.target.value })}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Куст
                  </label>
                  <input
                    type="text"
                    value={state.clusterName}
                    onChange={(e) => updateState({ clusterName: e.target.value })}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Дебит Q <span className="text-blue-600 dark:text-blue-400 font-mono">м³/сут</span>
                  <FieldHint hintKey="flowRate" />
                </label>
                <NumericInput
                  value={state.flowRate}
                  onChange={(val) => updateState({ flowRate: val, nktFlowQ: val, chokeQ: val })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Обводнённость <span className="text-blue-600 dark:text-blue-400 font-mono">%</span>
                  <FieldHint hintKey="waterCut" />
                </label>
                <NumericInput
                  value={state.waterCut}
                  onChange={(val) => updateState({ waterCut: Math.min(100, Math.max(0, val)) })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Глубина пласта <span className="text-blue-600 dark:text-blue-400 font-mono">м</span>
                  <FieldHint hintKey="depthPlast" />
                </label>
                <NumericInput
                  value={state.depthPlast}
                  onChange={(val) => updateState({ depthPlast: val })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Спуск насоса <span className="text-blue-600 dark:text-blue-400 font-mono">м</span>
                  <FieldHint hintKey="pumpDepth" />
                </label>
                <NumericInput
                  value={state.pumpDepth}
                  onChange={(val) => updateState({ pumpDepth: val, nktLength: val })}
                />
              </div>

              {/* Mode toggle: Manual levels vs ТМСП */}
              <div className="col-span-2 pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Уровни Hдин и Hстат
                  </span>
                  <div className="inline-flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => updateState({ levelInputMode: 'manual' })}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                        state.levelInputMode === 'manual'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Эхолот
                    </button>
                    <button
                      type="button"
                      onClick={() => updateState({ levelInputMode: 'tmsp' })}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                        state.levelInputMode === 'tmsp'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      По ТМСП
                    </button>
                  </div>
                </div>

                {state.levelInputMode === 'manual' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        H дин. <span className="text-blue-600 dark:text-blue-400 font-mono">м</span>
                        <FieldHint hintKey="dynLevel" />
                      </label>
                      <NumericInput
                        value={state.dynLevel}
                        onChange={(val) => updateState({ dynLevel: val })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        H стат. <span className="text-blue-600 dark:text-blue-400 font-mono">м</span>
                        <FieldHint hintKey="pkvHstat" />
                      </label>
                      <NumericInput
                        value={state.pkvHstat}
                        onChange={(val) => updateState({ pkvHstat: val })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-500/30 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Pтмсп дин. <span className="text-blue-600 dark:text-blue-400 font-mono">атм</span>
                          <FieldHint hintKey="tmspPDyn" />
                        </label>
                        <NumericInput
                          value={state.tmspPDyn}
                          onChange={(val) => updateState({ tmspPDyn: val })}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Pтмсп стат. <span className="text-blue-600 dark:text-blue-400 font-mono">атм</span>
                          <FieldHint hintKey="tmspPStat" />
                        </label>
                        <NumericInput
                          value={state.tmspPStat}
                          onChange={(val) => updateState({ tmspPStat: val })}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Pзатр <span className="text-blue-600 dark:text-blue-400 font-mono">атм</span>
                          <FieldHint hintKey="pZatr" />
                        </label>
                        <NumericInput
                          value={state.pZatr}
                          onChange={(val) => updateState({ pZatr: val })}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Удлинение ΔL <span className="text-blue-600 dark:text-blue-400 font-mono">м</span>
                          <FieldHint hintKey="headElongation" />
                        </label>
                        <NumericInput
                          value={state.headElongation}
                          onChange={(val) => updateState({ headElongation: val })}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                      <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={state.tmspUseVertical}
                          onChange={(e) => updateState({ tmspUseVertical: e.target.checked })}
                          className="accent-blue-600 rounded"
                        />
                        <span>По вертикали (Hсп − ΔL)</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={state.tmspUseDensity}
                          onChange={(e) => updateState({ tmspUseDensity: e.target.checked })}
                          className="accent-blue-600 rounded"
                        />
                        <span>По ρсм ({Math.round(tmspInfo.rhoMix)} кг/м³)</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-200/80 dark:border-blue-500/20 text-xs">
                      <div className="bg-white dark:bg-slate-900/90 rounded-lg px-2.5 py-1.5 border border-slate-200 dark:border-slate-800">
                        <div className="text-[10px] uppercase text-slate-500 dark:text-slate-400">
                          Расчётный Hдин {state.tmspUseVertical ? '(верт.)' : ''}
                        </div>
                        <div className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                          {state.dynLevel} м
                        </div>
                      </div>
                      <div className="bg-white dark:bg-slate-900/90 rounded-lg px-2.5 py-1.5 border border-slate-200 dark:border-slate-800">
                        <div className="text-[10px] uppercase text-slate-500 dark:text-slate-400">
                          Расчётный Hстат {state.tmspUseVertical ? '(верт.)' : ''}
                        </div>
                        <div className="font-mono font-bold text-sky-600 dark:text-sky-400 text-sm">
                          {state.pkvHstat} м
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Внутр. D ЭК <span className="text-blue-600 dark:text-blue-400 font-mono">мм</span>
                  <FieldHint hintKey="casingId" />
                </label>
                <NumericInput
                  value={state.casingId}
                  onChange={(val) => updateState({ casingId: val, pkvCasingId: val })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Пласт. давление <span className="text-blue-600 dark:text-blue-400 font-mono">атм</span>
                  <FieldHint hintKey="pPlast" />
                </label>
                <NumericInput
                  value={state.pPlast}
                  onChange={(val) => updateState({ pPlast: val })}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Диаметр НКТ (единый для расчётов)
                </label>
                <select
                  value={state.nktSize}
                  onChange={(e) => {
                    const size = Number(e.target.value);
                    updateState({ nktSize: size, tubingSize: size, pkvTubingD: size });
                  }}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:border-blue-500 focus:outline-none"
                >
                  <option value="60">НКТ 60 мм (внутр. 50.3 мм)</option>
                  <option value="73">НКТ 73 мм (внутр. 62.0 мм)</option>
                  <option value="89">НКТ 89 мм (внутр. 75.9 мм)</option>
                </select>
              </div>
            </div>

            {/* Logical validation warnings */}
            {warnings.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/50 space-y-1.5 text-xs text-amber-900 dark:text-amber-200">
                <div className="font-bold flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  Проверьте корректность исходных данных:
                </div>
                {warnings.map((w, i) => (
                  <p key={i} className="leading-relaxed">
                    • {w}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 transition-colors">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Быстрая юстировка
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 flex justify-between">
                  <span>Спуск насоса Hсп:</span>
                  <span className="font-mono text-slate-900 dark:text-white font-bold">{state.pumpDepth} м</span>
                </label>
                <input
                  type="range"
                  min={500}
                  max={Math.max(600, state.depthPlast)}
                  step={10}
                  value={state.pumpDepth}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    updateState({ pumpDepth: val, nktLength: val });
                  }}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 mt-1"
                />
              </div>
              {state.levelInputMode === 'tmsp' ? (
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 flex justify-between">
                    <span>Давление ТМСП (динам.):</span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">
                      {state.tmspPDyn} атм → Hдин = {state.dynLevel} м
                    </span>
                  </label>
                  <input
                    type="range"
                    min={Math.max(1, Math.round(state.pZatr))}
                    max={Math.max(50, Math.round(state.tmspPStat))}
                    step={1}
                    value={state.tmspPDyn}
                    onChange={(e) => updateState({ tmspPDyn: Number(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-1"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 flex justify-between">
                    <span>Динамический уровень Hдин:</span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">{state.dynLevel} м</span>
                  </label>
                  <input
                    type="range"
                    min={100}
                    max={Math.max(200, state.pumpDepth - 50)}
                    step={10}
                    value={state.dynLevel}
                    onChange={(e) => updateState({ dynLevel: Number(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-1"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Key Hydromechanical Status Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 transition-colors">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <Gauge className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Гидростатические напоры
              </h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/70 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Столб жидкости над приёмом:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {Math.max(0, state.pumpDepth - state.dynLevel)} м
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/70 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Расстояние насос — пласт:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {Math.max(0, state.depthPlast - state.pumpDepth)} м
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/70 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Давление на приёме насоса:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  {calc.hydraulics.pPr.toFixed(1)} атм
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 dark:text-slate-400">Забойное давление Pзаб:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
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
