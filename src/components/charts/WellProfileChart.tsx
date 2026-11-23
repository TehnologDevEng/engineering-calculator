import React, { useState } from 'react';
import { ActiveTab, WellState, FullCalculations } from '../../types';
import { Layers, MousePointerClick } from 'lucide-react';

interface WellProfileChartProps {
  state: WellState;
  calc: FullCalculations;
  onNavigateTab?: (tab: ActiveTab) => void;
}

const ZONE_META: Record<string, { label: string; tab?: ActiveTab }> = {
  wellhead: { label: 'Устьевая арматура и штуцер → открыть расчёт штуцера', tab: 'choke' },
  nkt: { label: 'Колонна НКТ → открыть расчёт НКТ и глушения скважины', tab: 'nkt' },
  cable: { label: 'Силовой кабель → открыть расчёт СУ, ТМПН и потерь ΔU', tab: 'electro' },
  levels: { label: 'Динамический и статический уровни → открыть режим ПКВ', tab: 'pkv' },
  esp: { label: 'ЭЦН → открыть расчёт запаса напора и охлаждения ПЭД', tab: 'head-margin' },
  ped: { label: 'Электродвигатель ПЭД → открыть охлаждение ПЭД и запас напора', tab: 'head-margin' },
  plast: { label: 'Продуктивный пласт (ВРП) → открыть расчёт притока и газа βвх', tab: 'hydraulics' },
};

export const WellProfileChart: React.FC<WellProfileChartProps> = ({
  state,
  calc,
  onNavigateTab,
}) => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const { depthPlast, pumpDepth, dynLevel, pkvHstat } = state;
  const maxDepth = Math.max(depthPlast + 150, 2500);

  const svgH = 600;
  const svgW = 440;
  const topY = 50;
  const bottomY = 550;

  const getY = (depth: number) => topY + (Math.min(maxDepth, Math.max(0, depth)) / maxDepth) * (bottomY - topY);

  const yStat = getY(pkvHstat);
  const yDyn = getY(dynLevel);
  const yPump = getY(pumpDepth);
  const yPlast = getY(depthPlast);

  const hasGasRisk = calc.hydraulics.betaIn >= 15;
  const hasCoolingRisk = !calc.coolingKill.isCoolingOk;
  const activeHint = hoveredZone ? ZONE_META[hoveredZone]?.label : null;

  const handleZoneClick = (zone: string) => {
    const target = ZONE_META[zone]?.tab;
    if (target && onNavigateTab) {
      onNavigateTab(target);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
            Интерактивный чертёж ствола скважины
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
          Hпл = {state.depthPlast} м
        </span>
      </div>

      {onNavigateTab && (
        <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
          <MousePointerClick className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="truncate">
            {activeHint || 'Нажмите на любой узел на схеме (устье, НКТ, кабель, ЭЦН, ПЭД или пласт), чтобы сразу открыть его расчёт'}
          </span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* SVG Drawing Canvas (stays deep blueprint canvas for crisp instrument readability) */}
        <div className="w-full lg:w-3/5 flex justify-center bg-slate-950 rounded-xl p-3 border border-slate-800">
          <svg
            viewBox={`0 0 ${svgW} ${svgH}`}
            className="w-full max-w-[430px] h-auto select-none overflow-visible"
          >
            <defs>
              <pattern id="rockPattern" width="12" height="12" patternUnits="userSpaceOnUse">
                <path d="M 0,12 l 12,-12 M 0,0 l 12,12" stroke="#1e293b" strokeWidth="1" />
              </pattern>
              <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="gasGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.30" />
              </linearGradient>
            </defs>

            {/* Depth axis line */}
            <line x1="38" y1={topY} x2="38" y2={bottomY} stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />

            {[0, 500, 1000, 1500, 2000, Math.round(depthPlast)].map((d) => {
              const y = getY(d);
              if (y > bottomY + 5) return null;
              return (
                <g key={d}>
                  <line x1="32" y1={y} x2="44" y2={y} stroke="#64748b" strokeWidth="1.5" />
                  <text x="28" y={y + 3} textAnchor="end" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                    {d}м
                  </text>
                </g>
              );
            })}

            {/* Casing Background */}
            <rect x="75" y={topY} width="22" height={bottomY - topY} fill="url(#rockPattern)" />
            <rect x="223" y={topY} width="22" height={bottomY - topY} fill="url(#rockPattern)" />

            {/* Casing outer walls */}
            <line x1="97" y1={topY} x2="97" y2={bottomY} stroke="#475569" strokeWidth="3" />
            <line x1="223" y1={topY} x2="223" y2={bottomY} stroke="#475569" strokeWidth="3" />

            {/* Gas & Liquid columns */}
            <rect x="98" y={topY} width="124" height={Math.max(0, yDyn - topY)} fill="url(#gasGrad)" />
            <rect x="98" y={yDyn} width="124" height={Math.max(0, bottomY - yDyn)} fill="url(#liquidGrad)" />

            {/* Tubing pipe (НКТ) - Clickable */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredZone('nkt')}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => handleZoneClick('nkt')}
            >
              <rect
                x="151"
                y={topY}
                width="18"
                height={Math.max(0, yPump - topY - 35)}
                fill="#334155"
                stroke={hoveredZone === 'nkt' ? '#c084fc' : '#64748b'}
                strokeWidth={hoveredZone === 'nkt' ? '2' : '1'}
              />
              <rect
                x="153"
                y={topY}
                width="14"
                height={Math.max(0, yPump - topY - 35)}
                fill="#0284c7"
                opacity="0.8"
              />
            </g>

            {/* Power cable - Clickable */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredZone('cable')}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => handleZoneClick('cable')}
            >
              <path
                d={`M 174 ${topY} L 174 ${yPump + 40}`}
                stroke={hoveredZone === 'cable' ? '#fde047' : '#eab308'}
                strokeWidth={hoveredZone === 'cable' ? '4' : '2.5'}
                strokeDasharray="8 3"
              />
              <path d={`M 174 ${topY} L 174 ${yPump + 40}`} stroke="transparent" strokeWidth="14" />
            </g>

            {/* Wellhead (Устье) - Clickable */}
            <g
              transform="translate(130, 20)"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredZone('wellhead')}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => handleZoneClick('wellhead')}
            >
              <rect
                x="15"
                y="10"
                width="30"
                height="20"
                fill="#1e293b"
                stroke={hoveredZone === 'wellhead' ? '#60a5fa' : '#38bdf8'}
                strokeWidth={hoveredZone === 'wellhead' ? '2.5' : '1.5'}
                rx="3"
              />
              <line x1="5" y1="20" x2="55" y2="20" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="5" cy="20" r="4" fill="#0284c7" />
              <circle cx="55" cy="20" r="4" fill="#f59e0b" />
              <text x="30" y="8" textAnchor="middle" fill="#f8fafc" fontSize="8.5" fontWeight="bold">
                Устье (Штуцер)
              </text>
            </g>

            {/* Dynamic & Static Level Markers - Clickable */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredZone('levels')}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => handleZoneClick('levels')}
            >
              <g transform={`translate(70, ${yDyn})`}>
                <line x1="27" y1="0" x2="153" y2="0" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
                <polygon points="15,0 25,-4 25,4" fill="#38bdf8" />
                <text x="10" y="3" textAnchor="end" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  Hдин ({dynLevel}м)
                </text>
              </g>

              <g transform={`translate(70, ${yStat})`}>
                <line x1="27" y1="0" x2="153" y2="0" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                <text x="10" y="3" textAnchor="end" fill="#f59e0b" fontSize="9" fontFamily="monospace">
                  Hстат ({pkvHstat}м)
                </text>
              </g>
            </g>

            {/* ESP Assembly */}
            <g transform={`translate(144, ${yPump - 35})`}>
              {/* Pump + Intake - Clickable */}
              <g
                className="cursor-pointer"
                onMouseEnter={() => setHoveredZone('esp')}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={() => handleZoneClick('esp')}
              >
                <rect
                  x="4"
                  y="0"
                  width="24"
                  height="28"
                  fill="#1e40af"
                  stroke={hoveredZone === 'esp' ? '#93c5fd' : '#60a5fa'}
                  strokeWidth={hoveredZone === 'esp' ? '2.5' : '1.5'}
                  rx="2"
                />
                <text x="16" y="17" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                  ЭЦН
                </text>

                <rect
                  x="6"
                  y="29"
                  width="20"
                  height="12"
                  fill={hasGasRisk ? '#d97706' : '#0284c7'}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  rx="1"
                />
                <circle cx="16" cy="35" r="2.5" fill="#f8fafc" />

                {/* Gas bubbles indicator if betaIn >= 15% */}
                {hasGasRisk && (
                  <g>
                    <circle cx="-4" cy="30" r="2.2" fill="#fbbf24" opacity="0.9" />
                    <circle cx="-8" cy="22" r="1.8" fill="#fbbf24" opacity="0.7" />
                    <circle cx="36" cy="33" r="2.2" fill="#fbbf24" opacity="0.9" />
                    <circle cx="40" cy="25" r="1.6" fill="#fbbf24" opacity="0.7" />
                  </g>
                )}
              </g>

              {/* Protector */}
              <rect x="7" y="42" width="18" height="10" fill="#334155" stroke="#94a3b8" strokeWidth="1" />

              {/* Motor Section (ПЭД) - Clickable */}
              <g
                className="cursor-pointer"
                onMouseEnter={() => setHoveredZone('ped')}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={() => handleZoneClick('ped')}
              >
                <rect
                  x="5"
                  y="53"
                  width="22"
                  height="34"
                  fill={hasCoolingRisk ? '#450a0a' : '#0f172a'}
                  stroke={hasCoolingRisk ? '#f43f5e' : hoveredZone === 'ped' ? '#7dd3fc' : '#38bdf8'}
                  strokeWidth={hoveredZone === 'ped' || hasCoolingRisk ? '2' : '1.5'}
                  rx="2"
                />
                <text
                  x="16"
                  y="73"
                  textAnchor="middle"
                  fill={hasCoolingRisk ? '#fda4af' : '#38bdf8'}
                  fontSize="7.5"
                  fontWeight="bold"
                >
                  ПЭД
                </text>
                {state.coolingShroud && (
                  <rect
                    x="2"
                    y="50"
                    width="28"
                    height="40"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                    rx="3"
                  />
                )}
              </g>
            </g>

            {/* Pump Depth Marker */}
            <g transform={`translate(230, ${yPump})`}>
              <line x1="-7" y1="0" x2="28" y2="0" stroke="#60a5fa" strokeWidth="1.5" />
              <text x="33" y="3" fill="#60a5fa" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                Hсп: {pumpDepth}м ({calc.hydraulics.pPr.toFixed(1)} атм)
              </text>
            </g>

            {/* Perforation Zone - Clickable */}
            <g
              transform={`translate(94, ${yPlast - 15})`}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredZone('plast')}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => handleZoneClick('plast')}
            >
              {[-8, -2, 4, 10, 16, 22].map((offY, i) => (
                <g key={i}>
                  <circle cx="2" cy={offY} r="2" fill="#ef4444" />
                  <circle cx="130" cy={offY} r="2" fill="#ef4444" />
                  <path d={`M -10 ${offY} L -2 ${offY}`} stroke="#ef4444" strokeWidth="1.5" />
                  <path d={`M 142 ${offY} L 134 ${offY}`} stroke="#ef4444" strokeWidth="1.5" />
                </g>
              ))}
              <rect
                x="5"
                y="-12"
                width="122"
                height="38"
                fill="#ef4444"
                fillOpacity={hoveredZone === 'plast' ? '0.2' : '0.1'}
                stroke="#ef4444"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <text x="66" y="10" textAnchor="middle" fill="#fca5a5" fontSize="8" fontWeight="bold">
                Пласт / ВРП ({depthPlast}м)
              </text>
            </g>

            {/* Bottomhole Pressure Marker */}
            <g transform={`translate(230, ${yPlast})`}>
              <line x1="-7" y1="0" x2="28" y2="0" stroke="#ef4444" strokeWidth="1.5" />
              <text x="33" y="3" fill="#fca5a5" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                Pзаб = {calc.hydraulics.pZab.toFixed(1)} атм
              </text>
            </g>
          </svg>
        </div>

        {/* Legend & Pressure Breakdown Panel */}
        <div className="w-full lg:w-2/5 space-y-3 text-xs">
          <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] block border-b border-slate-200 dark:border-slate-800 pb-1.5">
              Карта давлений по стволу
            </span>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 dark:text-slate-400">Pбуф (на выкиде):</span>
              <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{state.pBuf} атм</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 dark:text-slate-400">Pзатр (в затрубе):</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{state.pZatr} атм</span>
            </div>

            <div className="flex justify-between items-center py-1.5 bg-white dark:bg-slate-900/80 px-2.5 rounded-lg border border-slate-200/70 dark:border-slate-800">
              <span className="text-slate-800 dark:text-slate-200 font-semibold">Pпр (приём насоса):</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                {calc.hydraulics.pPr.toFixed(1)} атм
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 dark:text-slate-400">Pнас (давл. насыщения):</span>
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{state.pSat} атм</span>
            </div>

            <div className="flex justify-between items-center py-1.5 bg-white dark:bg-slate-900/80 px-2.5 rounded-lg border border-slate-200/70 dark:border-slate-800">
              <span className="text-slate-800 dark:text-slate-200 font-semibold">Pзаб (забойное):</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                {calc.hydraulics.pZab.toFixed(1)} атм
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 dark:text-slate-400">Pпл (пластовое):</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{state.pPlast} атм</span>
            </div>

            <div className="flex justify-between items-center py-1 text-slate-700 dark:text-slate-300">
              <span>Депрессия (Pпл − Pзаб):</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-300">
                {calc.hydraulics.depression.toFixed(1)} атм
              </span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-[11px] text-slate-600 dark:text-slate-400">
            <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px] block border-b border-slate-200 dark:border-slate-800 pb-1.5">
              Компоновка УЭЦН (кликабельно на схеме)
            </span>
            <button
              type="button"
              onClick={() => handleZoneClick('esp')}
              className="w-full flex items-center gap-2 text-left hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              <span className="w-3 h-3 rounded bg-blue-600 shrink-0" />
              <span>Насос ЭЦН на глубине {pumpDepth} м</span>
            </button>
            <button
              type="button"
              onClick={() => handleZoneClick('esp')}
              className="w-full flex items-center gap-2 text-left hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              <span className="w-3 h-3 rounded bg-amber-600 shrink-0" />
              <span>Входной узел: {calc.hydraulics.gasEquipRecommendation}</span>
            </button>
            <button
              type="button"
              onClick={() => handleZoneClick('ped')}
              className="w-full flex items-center gap-2 text-left hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              <span
                className={`w-3 h-3 rounded shrink-0 border ${
                  hasCoolingRisk ? 'bg-rose-900 border-rose-500' : 'bg-slate-800 border-cyan-400'
                }`}
              />
              <span>
                ПЭД {state.pedPower} кВт ({state.coolingShroud ? 'с кожухом' : 'без кожуха'})
                {hasCoolingRisk ? ' · ⚠ перегрев' : ''}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleZoneClick('cable')}
              className="w-full flex items-center gap-2 text-left hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              <span className="w-3 h-0.5 bg-yellow-400 shrink-0" />
              <span>
                Кабель ({state.cableCross} мм²) · ΔU = {calc.electro.deltaUPct.toFixed(1)}%
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
