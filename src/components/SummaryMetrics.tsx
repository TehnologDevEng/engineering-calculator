import React from 'react';
import { FullCalculations } from '../types';
import { 
  Clock, 
  Pipette, 
  Gauge, 
  Flame, 
  Zap, 
  Cpu,
  Info
} from 'lucide-react';

interface SummaryMetricsProps {
  calc: FullCalculations;
}

export const SummaryMetrics: React.FC<SummaryMetricsProps> = ({ calc }) => {
  const { pkv, nkt, hydraulics, electro } = calc;

  return (
    <div className="mb-6">
      {/* Header bar explaining HUD */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <span>Сводная панель оперативного контроля технологических параметров УЭЦН</span>
          <span className="hidden sm:inline-block text-[11px] text-slate-500 font-normal">
            (обновляется в реальном времени из всех расчётных модулей)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* 1. PKV Cycle */}
        <div 
          className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-amber-500/50 transition shadow-sm"
          title="Режим периодической кратковременной эксплуатации (ПКВ): время откачки / накопления и число пусков в сутки"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">1. Режим ПКВ</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="my-1">
            <div className="text-xs text-slate-400">Откачка / Пауза:</div>
            <div className="text-sm sm:text-base font-extrabold text-white font-mono">
              {pkv.tPumpHours.toFixed(1)} ч / {pkv.tAccumHours.toFixed(1)} ч
            </div>
          </div>
          <div className="text-[11px] text-amber-300/90 font-medium border-t border-slate-800/80 pt-1 flex justify-between">
            <span>Пусков:</span>
            <span className="font-bold text-white">{pkv.startsPerDay.toFixed(1)} /сут</span>
          </div>
        </div>

        {/* 2. NKT Friction */}
        <div 
          className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-purple-500/50 transition shadow-sm"
          title="Гидравлические потери на трение в колонне НКТ и скорость восходящего потока для выноса шлама"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">2. Поток в НКТ</span>
            <Pipette className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="my-1">
            <div className="text-xs text-slate-400">Потери трения:</div>
            <div className="text-sm sm:text-base font-extrabold text-white font-mono">
              {nkt.deltaPAtm.toFixed(2)} атм
            </div>
          </div>
          <div className="text-[11px] text-purple-300/90 font-medium border-t border-slate-800/80 pt-1 flex justify-between">
            <span>Скорость:</span>
            <span className="font-bold text-white">{nkt.vNkt.toFixed(2)} м/с</span>
          </div>
        </div>

        {/* 3. Pump Intake Pressure */}
        <div 
          className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-blue-500/50 transition shadow-sm"
          title="Давление флюида на приёме насоса и запас до давления насыщения нефти газом (Pнас)"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">3. Приём Pпр</span>
            <Gauge className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="my-1">
            <div className="text-xs text-slate-400">Давление приёма:</div>
            <div className="text-sm sm:text-base font-extrabold text-white font-mono">
              {hydraulics.pPr.toFixed(1)} атм
            </div>
          </div>
          <div className="text-[11px] border-t border-slate-800/80 pt-1 flex justify-between">
            <span className="text-slate-400">До Pнас:</span>
            <span className={`font-bold ${hydraulics.deltaSat >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {hydraulics.deltaSat >= 0 ? `+${hydraulics.deltaSat.toFixed(1)}` : `${hydraulics.deltaSat.toFixed(1)}`} атм
            </span>
          </div>
        </div>

        {/* 4. Gas Fraction */}
        <div 
          className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-amber-500/50 transition shadow-sm"
          title="Объемная доля свободного газа на приёме насоса (βвх) и рекомендуемое оборудование защиты"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">4. Газ βвх</span>
            <Flame className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="my-1">
            <div className="text-xs text-slate-400">Доля газа на входе:</div>
            <div className={`text-sm sm:text-base font-extrabold font-mono ${
              hydraulics.betaIn < 15 ? 'text-emerald-400' : hydraulics.betaIn < 25 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {hydraulics.betaIn.toFixed(1)} %
            </div>
          </div>
          <div className="text-[11px] border-t border-slate-800/80 pt-1 flex justify-between truncate">
            <span className="text-slate-400">Защита:</span>
            <span className="font-bold text-white truncate ml-1">
              {hydraulics.betaIn < 15 ? 'Норма' : hydraulics.betaIn <= 50 ? 'МН-ГС5' : 'ГС-10'}
            </span>
          </div>
        </div>

        {/* 5. TMPN Tap */}
        <div 
          className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-yellow-500/50 transition shadow-sm"
          title="Расчётная отпайка трансформатора ТМПН с компенсацией падения напряжения в кабеле"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-yellow-300">5. Отпайка ТМПН</span>
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <div className="my-1">
            <div className="text-xs text-slate-400">Расчётное Uотп:</div>
            <div className="text-sm sm:text-base font-extrabold text-white font-mono">
              {electro.tapPp} В
            </div>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-1 flex justify-between">
            <span>ΔUкаб:</span>
            <span className="font-bold text-yellow-400">{Math.round(electro.deltaU)} В ({electro.deltaUPct.toFixed(1)}%)</span>
          </div>
        </div>

        {/* 6. Recommended SU */}
        <div 
          className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-cyan-500/50 transition shadow-sm"
          title="Рекомендованная станция управления (СУ) с частотным приводом (ЧРП) с запасом по току ПЭД"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">6. Подбор СУ (ЧРП)</span>
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="my-1">
            <div className="text-[10px] text-slate-400 flex items-center justify-between">
              <span>Реком. модель:</span>
              <span className="text-[9px] px-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                {calc.electro.topSUs[0]?.maker || 'Триол'}
              </span>
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-white truncate font-mono">
              {calc.electro.topSUs[0]?.name || 'СУ-160'}
            </div>
          </div>
          <div className="text-[11px] border-t border-slate-800/80 pt-1 flex justify-between">
            <span className="text-slate-400">Ток Iном:</span>
            <span className="font-bold text-emerald-400 font-mono">
              {calc.electro.topSUs[0]?.current || 160} А (+{Math.max(0, Math.round(calc.electro.topSUs[0]?.margin || 15))}%)
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
