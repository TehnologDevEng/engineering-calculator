import { NumericInput } from "../NumericInput";
import React from 'react';
import { WellState, PkvResults } from '../../types';
import { Clock, CheckCircle2, AlertTriangle, Lightbulb, HelpCircle, Download } from 'lucide-react';
import { PkvCycleChart } from '../charts/PkvCycleChart';

interface PkvTabProps {
  state: WellState;
  pkv: PkvResults;
  onChange: (updates: Partial<WellState>) => void;
}

export const PkvTab: React.FC<PkvTabProps> = ({ state, pkv, onChange }) => {
  const loadExample = () => {
    onChange({
      pkvQplast: 22,
      pkvQpump: 80,
      pkvHstat: 850,
      pkvHdyn: 1350,
      pkvCasingId: 130,
      pkvTubingD: 73,
      pkvMaxStarts: 8,
      pkvMinCoolMin: 45,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1">
            Модуль 01 · Периодический фонд
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Расчёт параметров режима ПКВ (Периодической кратковременной эксплуатации)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Определение времени накопления и откачки для скважин с притоком ниже минимальной устойчивой подачи УЭЦН
          </p>
        </div>
        <button
          onClick={loadExample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          📥 Пример
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Исходные параметры ПКВ
                </h3>
              </div>
              <span className="text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                Режим ПКВ
              </span>
            </div>

            {/* Section 1: Rates */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                1. Характеристики притока и подачи насоса
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Приток пласта Qпл <span className="text-blue-400 font-mono">м³/сут</span>
                  </label>
                  <NumericInput
                    
                    
                    
                    value={state.pkvQplast}
                    onChange={val => onChange({ pkvQplast: val })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">Дебит по замеру АГЗУ</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Подача насоса Qнас <span className="text-blue-400 font-mono">м³/сут</span>
                  </label>
                  <NumericInput
                    
                    
                    
                    value={state.pkvQpump}
                    onChange={val => onChange({ pkvQpump: val })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">Номинал насоса в точке</span>
                </div>
              </div>
            </div>

            {/* Section 2: Levels and Geometry */}
            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                2. Уровни и геометрия затрубного пространства
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hстат (верхний) <span className="text-blue-400 font-mono">м</span>
                  </label>
                  <NumericInput
                    
                    
                    value={state.pkvHstat}
                    onChange={val => onChange({ pkvHstat: val })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">Уровень перед пуском</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hдин.отк (нижний) <span className="text-blue-400 font-mono">м</span>
                  </label>
                  <NumericInput
                    
                    
                    value={state.pkvHdyn}
                    onChange={val => onChange({ pkvHdyn: val })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">Уровень перед остановкой</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Внутр. диам. ЭК Dвн <span className="text-blue-400 font-mono">мм</span>
                  </label>
                  <NumericInput
                    
                    
                    value={state.pkvCasingId}
                    onChange={val => onChange({ pkvCasingId: val })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Диаметр колонны НКТ
                  </label>
                  <select
                    value={state.pkvTubingD}
                    onChange={val => onChange({ pkvTubingD: val })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
                  >
                    <option value="60">60 мм (НКТ 60)</option>
                    <option value="73">73 мм (НКТ 73)</option>
                    <option value="89">89 мм (НКТ 89)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Limits */}
            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                3. Технологические ограничения программы СУ
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Макс. пусков в сутки
                  </label>
                  <NumericInput
                    
                    
                    
                    value={state.pkvMaxStarts}
                    onChange={val => onChange({ pkvMaxStarts: val })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">Ресурс ПЭД и контактора</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Мин. пауза остывания <span className="text-blue-400 font-mono">мин</span>
                  </label>
                  <NumericInput
                    
                    
                    
                    value={state.pkvMinCoolMin}
                    onChange={val => onChange({ pkvMinCoolMin: val })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">Для рассеяния тепла</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Calculated Results & Settings Table */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Results Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <span>Параметры цикла откачки и накопления</span>
              </h3>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
                pkv.isOptimal
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}>
                {pkv.isOptimal ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Режим ПКВ оптимален</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Требует корректировки</span>
                  </>
                )}
              </span>
            </div>

            <div className="divide-y divide-slate-800/80 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Столб накопления жидкости ΔH:</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{pkv.deltaH.toFixed(0)} м</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Удельная емкость затруба:</span>
                <span className="font-mono font-semibold text-slate-200">
                  {pkv.sAnnulusLM.toFixed(2)} л/м ({pkv.sAnnulusM2.toFixed(4)} м³/м)
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Объём жидкости за 1 цикл Vцикл:</span>
                <span className="font-mono font-bold text-blue-400 text-sm">{pkv.vCycle.toFixed(2)} м³</span>
              </div>

              <div className="py-2.5 flex justify-between items-center bg-slate-950/40 px-2 rounded-lg">
                <span className="text-slate-300 font-medium">Время паузы накопления Tнак (ПЭД откл.):</span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {pkv.tAccumHours.toFixed(2)} ч ({pkv.tAccumMin} мин)
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center bg-slate-950/40 px-2 rounded-lg">
                <span className="text-slate-300 font-medium">Время откачки Tотк (ПЭД включен):</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {pkv.tPumpHours.toFixed(2)} ч ({pkv.tPumpMin} мин)
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Полный период одного цикла Tобщ:</span>
                <span className="font-mono font-semibold text-slate-200">{pkv.tCycleHours.toFixed(2)} ч</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Коэффициент цикличности Кц:</span>
                <span className="font-mono font-semibold text-slate-200">
                  {pkv.kCycle.toFixed(3)} ({(pkv.kCycle * 100).toFixed(1)}%)
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Количество пусков насоса в сутки:</span>
                <span className={`font-mono font-bold text-sm ${
                  pkv.startsPerDay <= state.pkvMaxStarts ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {pkv.startsPerDay.toFixed(1)} пусков/сут
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Ожидаемая суточная добыча Qсут:</span>
                <span className="font-mono font-bold text-white text-sm">{pkv.actualDailyQ.toFixed(1)} м³/сут</span>
              </div>
            </div>

            {/* Feedback Callout */}
            <div className={`mt-4 p-3.5 rounded-xl border text-xs leading-relaxed ${
              pkv.isOptimal
                ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                : 'bg-amber-950/20 border-amber-800/40 text-amber-200'
            }`}>
              {pkv.isOptimal ? (
                <p>
                  <strong>Расчет сбалансирован:</strong> Насос производительностью {state.pkvQpump} м³/сут откачивает накопленный объем {pkv.vCycle.toFixed(2)} м³ за {pkv.tPumpHours.toFixed(2)} ч. Пауза {pkv.tAccumHours.toFixed(2)} ч достаточна для тепловой стабилизации ПЭД. Количество включений ({pkv.startsPerDay.toFixed(1)}/сут) в пределах установленной нормы.
                </p>
              ) : (
                <p>
                  <strong>Внимание:</strong> {pkv.warningMessage}
                </p>
              )}
            </div>
          </div>

          {/* SU Settings Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                Технологические уставки для Станции Управления (СУ)
              </h3>
              <span className="text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono">
                Таймеры СУ
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-2 pr-3">Параметр уставки</th>
                    <th className="py-2 px-3">Ед. изм.</th>
                    <th className="py-2 px-3">Значение</th>
                    <th className="py-2 pl-3">Назначение</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 font-mono">
                  <tr>
                    <td className="py-2.5 pr-3 font-sans font-semibold text-white">Таймер работы насоса (Tотк)</td>
                    <td className="py-2.5 px-3 text-slate-400">мин / ч</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-400">{pkv.tPumpMin} мин ({pkv.tPumpHours.toFixed(2)} ч)</td>
                    <td className="py-2.5 pl-3 font-sans text-slate-400">Откачка столба ΔH</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-3 font-sans font-semibold text-white">Таймер паузы накопления (Tпауз)</td>
                    <td className="py-2.5 px-3 text-slate-400">мин / ч</td>
                    <td className="py-2.5 px-3 font-bold text-amber-400">{pkv.tAccumMin} мин ({pkv.tAccumHours.toFixed(2)} ч)</td>
                    <td className="py-2.5 pl-3 font-sans text-slate-400">Приток пласта + остывание</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-3 font-sans font-semibold text-white">Период одного цикла</td>
                    <td className="py-2.5 px-3 text-slate-400">час</td>
                    <td className="py-2.5 px-3 font-bold text-blue-400">{pkv.tCycleHours.toFixed(2)} ч</td>
                    <td className="py-2.5 pl-3 font-sans text-slate-400">Tотк + Tпауз</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-3 font-sans font-semibold text-white">Число циклов в сутки</td>
                    <td className="py-2.5 px-3 text-slate-400">цикл/сут</td>
                    <td className="py-2.5 px-3 font-bold text-slate-200">{pkv.startsPerDay.toFixed(1)}</td>
                    <td className="py-2.5 pl-3 font-sans text-slate-400">Лимит: до {state.pkvMaxStarts}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {pkv.recommendedTonMin && (
              <div className="mt-3 p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs flex items-center justify-between text-slate-300">
                <span>Рекомендация для ровно {state.pkvMaxStarts} пусков/сут:</span>
                <span className="font-mono font-bold text-amber-300">
                  Tотк = {pkv.recommendedTonMin} мин, Tпаузы = {pkv.recommendedToffMin} мин
                </span>
              </div>
            )}

            <div className="mt-4 p-3 bg-blue-950/20 border border-blue-900/40 rounded-xl flex items-start gap-2.5 text-xs text-blue-200">
              <Lightbulb className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <p>
                <strong>Инженерный совет:</strong> Если СУ оборудована частотным преобразователем (ЧРП), снижение частоты до 40–42 Гц позволяет уменьшить подачу насоса, увеличить время непрерывной откачки и улучшить охлаждение ПЭД при сниженных пусковых токах.
              </p>
            </div>

          </div>

        </div>

        {/* Embedded 24-hour cycle chart */}
        <div className="col-span-1 lg:col-span-12">
          <PkvCycleChart state={state} pkv={pkv} />
        </div>

      </div>

      {/* Guide Details */}
      <details className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 leading-relaxed">
        <summary className="font-semibold text-amber-400 cursor-pointer select-none flex items-center gap-1.5 hover:text-amber-300">
          <HelpCircle className="w-4 h-4" />
          📘 Методика и физический смысл расчёта режима ПКВ
        </summary>
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
          <p>
            Режим периодической кратковременной эксплуатации (ПКВ) применяется на малодебитных скважинах, где пластовый приток Qпл существенно меньше минимальной подачи насоса Qнас из рабочей зоны. При непрерывной откачке насос быстро срывает подачу по Z-потоку или газу, перегревается и отключается защитой ЗСП/ЗПП.
          </p>
          <p>
            В режиме ПКВ скважина накапливает столб флюида ΔH = Hдин.отк - Hстат при остановленном насосе за время накопления Tнак = Vцикл / Qпл, после чего насос включается и откачивает накопившийся объем за время откачки Tотк = Vцикл / (Qнас - Qпл).
          </p>
        </div>
      </details>
    </div>
  );
};

