import { NumericInput } from "../NumericInput";
import React from 'react';
import { WellState, HydraulicsResults } from '../../types';
import { Gauge, Flame, Sliders, CheckCircle2, AlertTriangle, HelpCircle, Download, Activity } from 'lucide-react';

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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-1">
            Модуль 03 · Пласт и забой
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Приток пласта, давление приёма Pпр и газосодержание βвх
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Комплексный расчёт давления на приёме насоса, депрессии, продуктивности (4 режима), проверка эхограммы и подбор антигазовой защиты
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Параметры пласта и скважины
                </h3>
              </div>
              <span className="text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono">
                Pпл & Газ
              </span>
            </div>

            {/* Section 1: Inflow & Reservoir */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                1. Пластовые условия и насыщение
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pпл <span className="text-blue-400 font-mono">атм</span>
                  </label>
                  <NumericInput
                    
                    
                    value={state.pPlast}
                    onChange={(e) => onChange({ pPlast: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-blue-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">Пластовое давление</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pнас <span className="text-blue-400 font-mono">атм</span>
                  </label>
                  <NumericInput
                    
                    
                    value={state.pSat}
                    onChange={(e) => onChange({ pSat: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-blue-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">Давление насыщения нефти</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Газовый фактор G₀ <span className="text-blue-400 font-mono">м³/м³</span>
                  </label>
                  <NumericInput
                    
                    
                    value={state.gasFactor}
                    onChange={(e) => onChange({ gasFactor: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Глубина пласта Hпл <span className="text-blue-400 font-mono">м</span>
                  </label>
                  <NumericInput
                    
                    
                    value={state.depthPlast}
                    onChange={(e) => onChange({ depthPlast: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Well and Wellhead */}
            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                2. Режим работы скважины
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Дебит жидкости Q <span className="text-blue-400 font-mono">м³/сут</span>
                  </label>
                  <NumericInput
                    
                    
                    value={state.flowRate}
                    onChange={(e) => onChange({ flowRate: parseFloat(e.target.value) || 0, nktFlowQ: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Динам. уровень Hдин <span className="text-blue-400 font-mono">м</span>
                  </label>
                  <NumericInput
                    
                    
                    value={state.dynLevel}
                    onChange={(e) => onChange({ dynLevel: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Спуск насоса Hсп <span className="text-blue-400 font-mono">м</span>
                  </label>
                  <NumericInput
                    
                    
                    value={state.pumpDepth}
                    onChange={(e) => onChange({ pumpDepth: parseFloat(e.target.value) || 0, nktLength: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Обводненность W <span className="text-blue-400 font-mono">%</span>
                  </label>
                  <NumericInput
                    
                    
                    
                    
                    value={state.waterCut}
                    onChange={(e) => onChange({ waterCut: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pзатр <span className="text-blue-400 font-mono">атм</span>
                  </label>
                  <NumericInput
                    
                    
                    value={state.pZatr}
                    onChange={(e) => onChange({ pZatr: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pбуф <span className="text-blue-400 font-mono">атм</span>
                  </label>
                  <NumericInput
                    
                    
                    value={state.pBuf}
                    onChange={(e) => onChange({ pBuf: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Cross-validation via measured Tubing Pressure */}
            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center justify-between">
                <span>3. Контроль уровня по давлению в НКТ</span>
                <Activity className="w-3.5 h-3.5" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Замер давления в трубе Pкт (датчик ТМС / манометр) <span className="text-blue-400 font-mono">атм</span>
                </label>
                <NumericInput
                  
                  
                  value={state.measuredPtube}
                  onChange={(e) => onChange({ measuredPtube: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className={`p-2.5 rounded-lg border text-xs ${
                hydraulics.isDiscrepancyOk
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                  : 'bg-rose-950/20 border-rose-800/40 text-rose-300'
              }`}>
                <div className="flex justify-between items-center">
                  <span>Расчётный Hдин по Pкт:</span>
                  <span className="font-mono font-bold">{Math.round(hydraulics.calculatedDynLevelFromPt)} м</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span>Расхождение с эхограммой:</span>
                  <span className="font-mono font-bold">
                    {hydraulics.levelDiscrepancyM} м {hydraulics.isDiscrepancyOk ? '(в норме ≤ 100 м)' : '(ВНИМАНИЕ: расхождение > 100 м!)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 4: VFD frequency */}
            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5" />
                  4. Частота тока СУ (ЧРП)
                </span>
                <span className="font-mono font-bold text-white text-sm bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                  {state.frequency} Гц
                </span>
              </div>

              <input
                type="range"
                min="35"
                max="65"
                step="1"
                value={state.frequency}
                onChange={(e) => onChange({ frequency: parseInt(e.target.value, 10) || 50 })}
                className="w-full accent-blue-500 cursor-pointer"
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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                Инженерные режимы расчёта продуктивности Кпр
              </h3>
              <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                Режим {state.kprMode + 1} из 4
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 0, label: 'Расчёт Кпр', sub: 'по Q и депрессии' },
                { id: 1, label: 'Расчёт Дебита Q', sub: 'по Кпр' },
                { id: 2, label: 'Расчёт Pпл', sub: 'по Q и Кпр' },
                { id: 3, label: 'Расчёт Pзаб', sub: 'по Q и Кпр' },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => onChange({ kprMode: m.id })}
                  className={`p-2 rounded-xl text-left border transition ${
                    state.kprMode === m.id
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold">{m.label}</div>
                  <div className="text-[10px] text-slate-500 truncate">{m.sub}</div>
                </button>
              ))}
            </div>

            {state.kprMode !== 0 && (
              <div className="mt-2 flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <label className="text-xs text-slate-300 font-semibold">
                  Заданный Кпр (м³/сут/атм):
                </label>
                <NumericInput
                  
                  
                  value={state.customKpr}
                  onChange={(e) => onChange({ customKpr: parseFloat(e.target.value) || 0.1 })}
                  className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-white outline-none"
                />
                <span className="text-xs text-blue-400 font-mono font-bold">
                  Результат: {hydraulics.kprModeResult.toFixed(1)} {state.kprMode === 1 ? 'м³/сут' : 'атм'}
                </span>
              </div>
            )}
          </div>

          {/* Pressure & Inflow Results */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                Расчет забойного давления и продуктивности
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                Приток стабилен
              </span>
            </div>

            <div className="divide-y divide-slate-800/80 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Средняя плотность жидкости ρсм:</span>
                <span className="font-mono font-bold text-slate-200">{Math.round(hydraulics.rhoMix)} кг/м³</span>
              </div>

              <div className="py-2.5 flex justify-between items-center bg-slate-950/40 px-2 rounded-lg">
                <span className="text-slate-300 font-medium">Давление на приеме насоса Pпр:</span>
                <span className="font-mono font-bold text-blue-400 text-sm">{hydraulics.pPr.toFixed(1)} атм</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Запас над давлением насыщения (Pпр - Pнас):</span>
                <span className={`font-mono font-bold text-sm ${
                  hydraulics.deltaSat >= 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {hydraulics.deltaSat >= 0 ? `+${hydraulics.deltaSat.toFixed(1)} атм (Однофазный)` : `${hydraulics.deltaSat.toFixed(1)} атм (Выделение газа)`}
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center bg-slate-950/40 px-2 rounded-lg">
                <span className="text-slate-300 font-medium">Забойное давление Pзаб:</span>
                <span className="font-mono font-bold text-white text-sm">{hydraulics.pZab.toFixed(1)} атм</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Депрессия на пласт (Pпл - Pзаб):</span>
                <span className="font-mono font-semibold text-slate-200">{hydraulics.depression.toFixed(1)} атм</span>
              </div>

              <div className="py-2.5 flex justify-between items-center bg-slate-950/40 px-2 rounded-lg">
                <span className="text-slate-300 font-medium">Коэффициент продуктивности Кпр:</span>
                <span className="font-mono font-bold text-blue-400 text-sm">{hydraulics.kpr.toFixed(2)} м³/(сут·атм)</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Потенциальный дебит при Pзаб = Pнас:</span>
                <span className="font-mono font-bold text-slate-200">{hydraulics.potentialQ} м³/сут</span>
              </div>
            </div>
          </div>

          {/* Free Gas on Intake Module */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Свободный газ на входе насоса (βвх)</span>
              </h3>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                hydraulics.gasRiskLevel === 'low'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : hydraulics.gasRiskLevel === 'medium'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}>
                {hydraulics.gasRiskLevel === 'low' ? 'Газ в норме' : hydraulics.gasRiskLevel === 'medium' ? 'Умеренный газ' : 'Высокий газ!'}
              </span>
            </div>

            <div className="divide-y divide-slate-800/80 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Объем свободного газа в рабочих условиях:</span>
                <span className="font-mono font-bold text-slate-200">{hydraulics.freeGasVol.toFixed(1)} м³/сут</span>
              </div>

              <div className="py-2.5 flex justify-between items-center bg-slate-950/40 px-2 rounded-lg">
                <span className="text-slate-300 font-medium">Объемное газосодержание на приеме βвх:</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{hydraulics.betaIn.toFixed(1)} %</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Рекомендованный входной модуль:</span>
                <span className="font-semibold text-blue-400">{hydraulics.gasEquipRecommendation}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl text-xs text-amber-200">
              {hydraulics.betaIn < 15 ? (
                <p>✓ Газосодержание низкое (β &lt; 15%). Срыв подачи исключен, стандартная входная сетка работает надежно.</p>
              ) : hydraulics.betaIn <= 50 ? (
                <p>⚠ Газосодержание умеренное (15-50%). Для исключения пульсаций тока и срыва подачи необходим газосепаратор типа МН-ГС5.</p>
              ) : (
                <p className="text-rose-300">🚨 Высокое газосодержание (&gt; 50%)! Требуется модуль газосепаратора-диспергатора ГС-10 или насос в антигазовом исполнении (ЭЦНГД).</p>
              )}
            </div>
          </div>

          {/* VFD Scaling Laws */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                Пересчет параметров по законам подобия ЧРП (f = {state.frequency} Гц)
              </h3>
              <span className="text-xs font-mono font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                f/50 = {(state.frequency / 50).toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Дебит Q(f)</div>
                <div className="text-base font-extrabold text-blue-400 font-mono mt-1">
                  {hydraulics.scaledQ.toFixed(1)} <span className="text-xs">м³/сут</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Напор H(f)</div>
                <div className="text-base font-extrabold text-purple-400 font-mono mt-1">
                  {hydraulics.scaledH} <span className="text-xs">м</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Мощность N(f)</div>
                <div className="text-base font-extrabold text-emerald-400 font-mono mt-1">
                  {hydraulics.scaledPower} <span className="text-xs">кВт</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Guide Details */}
      <details className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 leading-relaxed">
        <summary className="font-semibold text-blue-400 cursor-pointer select-none flex items-center gap-1.5 hover:text-blue-300">
          <HelpCircle className="w-4 h-4" />
          📘 Методика расчёта притока, депрессии и свободного газа на приёме
        </summary>
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
          <p>
            Давление на приёме насоса определяется суммой давления в затрубном пространстве на устье Pзатр и гидростатического давления столба смеси над приёмом:
          </p>
          <p className="font-mono text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-800">
            Pпр = Pзатр + ρсм · g · (Hсп - Hдин) / 101325
          </p>
          <p>
            Если давление на приёме опускается ниже давления насыщения Pнас, из нефти начинает интенсивно выделяться свободный попутный газ. При достижении газосодержания βвх &gt; 15% насосные ступени стандартных центробежных насосов теряют напор, а при βвх &gt; 25% наступает срыв подачи. Применение газосепаратора обеспечивает гравитационно-вихревое отделение газовой фазы и её сброс в затрубное пространство.
          </p>
        </div>
      </details>
    </div>
  );
};

