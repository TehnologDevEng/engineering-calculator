import React from 'react';
import { ActiveTab, FullCalculations } from '../types';
import { Clock, Pipette, Gauge, TrendingUp, Zap, Cpu, ArrowUpRight } from 'lucide-react';

interface SummaryMetricsProps {
  calc: FullCalculations;
  activeTab: ActiveTab;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const SummaryMetrics: React.FC<SummaryMetricsProps> = ({
  calc,
  activeTab,
  onNavigateTab,
}) => {
  const { pkv, nkt, hydraulics, headMargin, coolingKill, electro } = calc;

  const cards: {
    id: ActiveTab;
    title: string;
    icon: React.FC<{ className?: string }>;
    accentText: string;
    label: string;
    value: string;
    valueColor?: string;
    footerLabel: string;
    footerValue: string;
    footerColor?: string;
    hasWarning?: boolean;
    tooltip: string;
  }[] = [
    {
      id: 'head-margin',
      title: '1. Напор и ПЭД',
      icon: TrendingUp,
      accentText: 'text-sky-600 dark:text-sky-400',
      label: 'Запас напора',
      value: `${headMargin.headMarginM > 0 ? '+' : ''}${headMargin.headMarginM} м`,
      valueColor:
        headMargin.status === 'deficit'
          ? 'text-rose-600 dark:text-rose-400'
          : headMargin.status === 'low'
          ? 'text-amber-600 dark:text-amber-400'
          : 'text-emerald-600 dark:text-emerald-400',
      footerLabel: 'Омыв ПЭД:',
      footerValue: coolingKill.isCoolingOk
        ? `${coolingKill.velocity.toFixed(2)} м/с`
        : `${coolingKill.velocity.toFixed(2)} м/с · перегрев`,
      footerColor: coolingKill.isCoolingOk
        ? 'text-slate-900 dark:text-white'
        : 'text-rose-600 dark:text-rose-400',
      hasWarning: headMargin.status === 'deficit' || !coolingKill.isCoolingOk,
      tooltip: 'Открыть расчёт запаса напора и охлаждения ПЭД',
    },
    {
      id: 'hydraulics',
      title: '2. Приток и газ',
      icon: Gauge,
      accentText: 'text-blue-600 dark:text-blue-400',
      label: 'Давление Pпр',
      value: `${hydraulics.pPr.toFixed(1)} атм`,
      footerLabel: 'Газ βвх:',
      footerValue: `${hydraulics.betaIn.toFixed(1)} %`,
      footerColor:
        hydraulics.betaIn < 15
          ? 'text-emerald-600 dark:text-emerald-400'
          : hydraulics.betaIn < 25
          ? 'text-amber-600 dark:text-amber-400'
          : 'text-rose-600 dark:text-rose-400',
      hasWarning: hydraulics.betaIn >= 25,
      tooltip: 'Открыть расчёт притока, Pпр и газозащиты',
    },
    {
      id: 'nkt',
      title: '3. НКТ и глушение',
      icon: Pipette,
      accentText: 'text-purple-600 dark:text-purple-400',
      label: 'Потери трения',
      value: `${nkt.deltaPAtm.toFixed(2)} атм`,
      footerLabel: 'ЖГ ρглуш:',
      footerValue: `${coolingKill.rhoKillGCm3.toFixed(2)} г/см³`,
      footerColor:
        !nkt.isStrengthOk || nkt.sandCarryStatus === 'danger'
          ? 'text-rose-600 dark:text-rose-400'
          : 'text-slate-900 dark:text-white',
      hasWarning: !nkt.isStrengthOk || nkt.sandCarryStatus === 'danger',
      tooltip: 'Открыть расчёт НКТ, прочности и глушения скважины',
    },
    {
      id: 'pkv',
      title: '4. Режим ПКВ',
      icon: Clock,
      accentText: 'text-amber-600 dark:text-amber-400',
      label: 'Откачка / Пауза',
      value: `${pkv.tPumpHours.toFixed(1)} ч / ${pkv.tAccumHours.toFixed(1)} ч`,
      footerLabel: pkv.isOptimal ? 'Пусков:' : 'Проблема:',
      footerValue: pkv.isOptimal ? `${pkv.startsPerDay.toFixed(1)} /сут` : `${pkv.startsPerDay.toFixed(1)}/сут · уточнить`,
      footerColor: pkv.isOptimal ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400',
      hasWarning: !pkv.isOptimal,
      tooltip: 'Открыть расчёт периодического режима ПКВ',
    },
    {
      id: 'electro',
      title: '5. Отпайка ТМПН',
      icon: Zap,
      accentText: 'text-yellow-600 dark:text-yellow-400',
      label: 'Расчётное Uотп',
      value: `${electro.tapPp} В`,
      footerLabel: 'ΔUкаб:',
      footerValue: `${Math.round(electro.deltaU)} В (${electro.deltaUPct.toFixed(1)}%)`,
      footerColor:
        electro.deltaUPct > 15
          ? 'text-rose-600 dark:text-rose-400'
          : 'text-yellow-700 dark:text-yellow-400',
      hasWarning: electro.deltaUPct > 15 || !electro.isCableOk,
      tooltip: 'Открыть подбор кабеля и отпайки ТМПН',
    },
    {
      id: 'electro',
      title: '6. Подбор СУ',
      icon: Cpu,
      accentText: 'text-cyan-600 dark:text-cyan-400',
      label: electro.topSUs[0]?.maker || 'Триол',
      value: electro.topSUs[0]?.name || 'СУ-160',
      footerLabel: 'Ток Iном:',
      footerValue: `${electro.topSUs[0]?.current || 160} А (+${Math.max(0, Math.round(electro.topSUs[0]?.margin || 15))}%)`,
      footerColor: 'text-emerald-600 dark:text-emerald-400',
      tooltip: 'Посмотреть рекомендованные станции управления',
    },
  ];

  return (
    <div className="mb-6 print:hidden">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          const isCurrent = activeTab === card.id;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onNavigateTab(card.id)}
              title={card.tooltip}
              className={`group text-left rounded-xl p-3 flex flex-col justify-between transition border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                card.hasWarning
                  ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-300 dark:border-rose-500/40 hover:border-rose-500'
                  : isCurrent
                  ? 'bg-blue-50/70 dark:bg-slate-900 border-blue-400 dark:border-blue-500/60'
                  : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className={`text-[11px] font-bold uppercase tracking-wider truncate ${card.accentText}`}>
                  {card.title}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <Icon className={`w-3.5 h-3.5 ${card.accentText}`} />
                  <ArrowUpRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="my-1 min-w-0">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{card.label}</div>
                <div
                  className={`text-sm font-extrabold font-mono truncate ${
                    card.valueColor || 'text-slate-900 dark:text-white'
                  }`}
                >
                  {card.value}
                </div>
              </div>

              <div className="text-[11px] border-t border-slate-200/80 dark:border-slate-800/80 pt-1.5 flex justify-between gap-1">
                <span className="text-slate-500 dark:text-slate-400 shrink-0">{card.footerLabel}</span>
                <span className={`font-bold font-mono truncate ${card.footerColor || 'text-slate-900 dark:text-white'}`}>
                  {card.footerValue}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
