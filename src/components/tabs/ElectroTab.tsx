import { NumericInput } from "../NumericInput";
import React from 'react';
import { WellState, ElectroResults } from '../../types';
import { Zap, Cpu, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { CABLE_TYPES } from '../../data/constants';

interface ElectroTabProps {
  state: WellState;
  electro: ElectroResults;
  onChange: (updates: Partial<WellState>) => void;
}

export const ElectroTab: React.FC<ElectroTabProps> = ({ state, electro, onChange }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Column: Electrical Inputs */}
      <div className="lg:col-span-5 space-y-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wide">
                Электрооборудование УЭЦН
              </h2>
            </div>
            <span className="text-[11px] font-semibold bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 px-2 py-0.5 rounded-full">
              Электрокомплекс
            </span>
          </div>

          {/* Section 1: PED Motor */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider">
              1. Погружной электродвигатель (ПЭД)
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Мощность ПЭД <span className="text-blue-400 font-mono">кВт</span>
                </label>
                <NumericInput
                  
                  
                  value={state.pedPower}
                  onChange={val => onChange({ pedPower: val })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Номин. ток Iном <span className="text-blue-400 font-mono">А</span>
                </label>
                <NumericInput
                  
                  
                  value={state.pedCurrent}
                  onChange={val => onChange({ pedCurrent: val })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-yellow-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Номин. напряжение <span className="text-blue-400 font-mono">В</span>
                </label>
                <NumericInput
                  
                  
                  value={state.pedVoltage}
                  onChange={val => onChange({ pedVoltage: val })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Коэффициент cos φ
                </label>
                <NumericInput
                  
                  
                  
                  
                  value={state.pedCosPhi}
                  onChange={val => onChange({ pedCosPhi: val })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-yellow-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Cable Line */}
          <div className="space-y-3 pt-4 border-t border-slate-800/80">
            <div className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider">
              2. Кабельная линия
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Марка кабеля
              </label>
              <select
                value={state.cableType}
                onChange={(e) => onChange({ cableType: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-yellow-500 focus:outline-none"
              >
                {CABLE_TYPES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Сечение жил
                </label>
                <select
                  value={state.cableCross}
                  onChange={val => onChange({ cableCross: val })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-yellow-500 focus:outline-none"
                >
                  <option value="10">10 мм² (R₂₀ = 1.83 Ом/км)</option>
                  <option value="16">16 мм² (R₂₀ = 1.15 Ом/км)</option>
                  <option value="25">25 мм² (R₂₀ = 0.73 Ом/км)</option>
                  <option value="35">35 мм² (R₂₀ = 0.52 Ом/км)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Длина кабеля <span className="text-blue-400 font-mono">м</span>
                </label>
                <NumericInput
                  
                  
                  value={state.cableLength}
                  onChange={val => onChange({ cableLength: val })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-yellow-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Температура на приеме <span className="text-blue-400 font-mono">°C</span>
              </label>
              <NumericInput
                
                
                value={state.wellTemp}
                onChange={val => onChange({ wellTemp: val })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-yellow-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 3: TMPN & Grid */}
          <div className="space-y-3 pt-4 border-t border-slate-800/80">
            <div className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider">
              3. Трансформатор ТМПН и сеть
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Мощность ТМПН
                </label>
                <select
                  value={state.tmpnKva}
                  onChange={val => onChange({ tmpnKva: val })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-yellow-500 focus:outline-none"
                >
                  <option value="100">ТМПН-100 кВА</option>
                  <option value="160">ТМПН-160 кВА</option>
                  <option value="250">ТМПН-250 кВА</option>
                  <option value="400">ТМПН-400 кВА</option>
                  <option value="630">ТМПН-630 кВА</option>
                  <option value="1000">ТМПН-1000 кВА</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Напряжение сети <span className="text-blue-400 font-mono">В</span>
                </label>
                <NumericInput
                  
                  
                  value={state.gridVoltage}
                  onChange={val => onChange({ gridVoltage: val })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-yellow-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Right Column: Electrical Calculations & Tap Tables */}
      <div className="lg:col-span-7 space-y-5">
        
        {/* Losses & Required Voltage */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Потери в кабеле и требуемое напряжение
            </h3>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
              electro.deltaUPct <= 15
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}>
              {electro.deltaUPct <= 15 ? 'Норма по падению U' : 'Превышение ΔU > 15%!'}
            </span>
          </div>

          <div className="divide-y divide-slate-800/80 text-xs">
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-400">Средняя температура кабеля Tср:</span>
              <span className="font-mono font-bold text-slate-200">{electro.tAvgCable.toFixed(1)} °C</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-400">Сопротивление фазы с нагревом меди Rф:</span>
              <span className="font-mono font-bold text-slate-200">{electro.rTotalPhase.toFixed(2)} Ом</span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-400">Плотность тока в жиле j:</span>
              <span className="font-mono font-semibold text-slate-200">{electro.currentDensity.toFixed(2)} А/мм²</span>
            </div>

            <div className="py-2.5 flex justify-between items-center bg-slate-950/40 px-2 rounded-lg">
              <span className="text-slate-300 font-medium">Падение линейного напряжения в кабеле ΔU:</span>
              <span className="font-mono font-bold text-yellow-400 text-sm">
                {Math.round(electro.deltaU)} В ({electro.deltaUPct.toFixed(1)}%)
              </span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <span className="text-slate-400">Активные потери мощности в кабеле ΔP:</span>
              <span className="font-mono font-bold text-slate-200">{electro.deltaPkw.toFixed(2)} кВт</span>
            </div>

            <div className="py-2.5 flex justify-between items-center bg-slate-950/40 px-2 rounded-lg">
              <span className="text-slate-300 font-medium">Требуемое напряжение на выходе ТМПН (вторичка):</span>
              <span className="font-mono font-bold text-blue-400 text-sm">{electro.reqUSec} В</span>
            </div>
          </div>
        </div>

        {/* TMPN 4-Step Taps */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Расчет 4-х ступеней регулировочных отпаек ТМПН
            </h3>
            <span className="text-xs font-mono font-semibold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/30">
              ТМПН-{state.tmpnKva}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2 pr-2">Ступень</th>
                  <th className="py-2 px-2">Напряжение</th>
                  <th className="py-2 px-2">Режим / Назначение</th>
                  <th className="py-2 px-2">Iдоп ТМПН</th>
                  <th className="py-2 px-2">Запас U</th>
                  <th className="py-2 pl-2">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 font-mono">
                {electro.taps.map(tap => (
                  <tr key={tap.num} className={tap.isOptimal ? 'bg-blue-950/30 font-semibold' : ''}>
                    <td className="py-2.5 pr-2">#{tap.num}</td>
                    <td className="py-2.5 px-2 font-bold text-blue-400">{tap.tapU} В</td>
                    <td className="py-2.5 px-2 font-sans text-slate-300">{tap.role}</td>
                    <td className="py-2.5 px-2 text-slate-300">{tap.iAllow} А</td>
                    <td className="py-2.5 px-2">
                      <span className={tap.marginU >= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                        {tap.marginU >= 0 ? `+${tap.marginU}` : tap.marginU}%
                      </span>
                    </td>
                    <td className="py-2.5 pl-2">
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold border ${
                        tap.isOptimal
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {tap.isOptimal ? 'Рекомендована' : 'Резерв'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
            <span className="text-slate-400">Коэффициент загрузки трансформатора:</span>
            <span className={`font-mono font-bold ${
              electro.tmpnLoadPct > 90 ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {electro.tmpnLoadPct.toFixed(1)}% ({electro.tmpnLoadPct > 90 ? 'Перегрузка' : 'Норма'})
            </span>
          </div>
        </div>

        {/* Control Station (SU) Sizing */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>Подбор Станции Управления (СУ)</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-blue-500/10 text-blue-400 border-blue-500/30">
              Первичная сеть 380 В
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Ток первичной цепи СУ (380 В):</span>
              <span className="text-base font-extrabold text-white font-mono">
                {Math.round(electro.primaryCurrent)} А
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Требуемый номин. ток СУ (+15%):</span>
              <span className="text-base font-extrabold text-yellow-400 font-mono">
                ≥ {Math.round(electro.reqCurrentSU)} А
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2 pr-2">Ранг</th>
                  <th className="py-2 px-2">Модель СУ</th>
                  <th className="py-2 px-2">Тип</th>
                  <th className="py-2 px-2">Iном</th>
                  <th className="py-2 px-2">Pном</th>
                  <th className="py-2 pl-2">Запас</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 font-mono">
                {electro.topSUs.map((su, idx) => (
                  <tr key={su.name} className={idx === 0 ? 'bg-blue-950/20 font-semibold' : ''}>
                    <td className="py-2.5 pr-2 font-sans text-slate-400">ТОП-{idx + 1}</td>
                    <td className="py-2.5 px-2">
                      <div className="font-bold text-white">{su.name}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{su.maker}</div>
                    </td>
                    <td className="py-2.5 px-2 font-sans">
                      <span className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded text-[10px]">
                        {su.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-white">{su.current} А</td>
                    <td className="py-2.5 px-2 text-slate-300">{su.power} кВт</td>
                    <td className="py-2.5 pl-2 font-bold text-emerald-400">+{Math.round(su.margin)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
