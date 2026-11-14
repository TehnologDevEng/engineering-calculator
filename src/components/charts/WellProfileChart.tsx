import React, { useState } from 'react';
import { WellState, FullCalculations } from '../../types';
import { Layers, Info, Shield, Droplets, Flame, Gauge } from 'lucide-react';

interface WellProfileChartProps {
  state: WellState;
  calc: FullCalculations;
}

export const WellProfileChart: React.FC<WellProfileChartProps> = ({ state, calc }) => {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const { depthPlast, pumpDepth, dynLevel, pkvHstat } = state;
  const maxDepth = Math.max(depthPlast + 150, 2500);

  // SVG coordinates mapping:
  // Top: 40px (wellhead = 0m)
  // Bottom: 560px (maxDepth)
  const svgH = 600;
  const svgW = 420;
  const topY = 50;
  const bottomY = 550;

  const getY = (depth: number) => {
    return topY + (depth / maxDepth) * (bottomY - topY);
  };

  const yStat = getY(pkvHstat);
  const yDyn = getY(dynLevel);
  const yPump = getY(pumpDepth);
  const yPlast = getY(depthPlast);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">
            Интерактивный чертёж-профиль ствола скважины
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
          Hпл = {state.depthPlast} м
        </span>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        
        {/* SVG Drawing Canvas */}
        <div className="w-full lg:w-3/5 flex justify-center">
          <svg
            viewBox={`0 0 ${svgW} ${svgH}`}
            className="w-full max-w-[420px] h-auto select-none overflow-visible"
          >
            <defs>
              {/* Pattern for casing cement / rock */}
              <pattern id="rockPattern" width="12" height="12" patternUnits="userSpaceOnUse">
                <path d="M 0,12 l 12,-12 M 0,0 l 12,12" stroke="#1e293b" strokeWidth="1" />
              </pattern>

              {/* Gradient for liquid column */}
              <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.85" />
              </linearGradient>

              {/* Gradient for gas zone */}
              <linearGradient id="gasGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.30" />
              </linearGradient>
            </defs>

            {/* Depth axis line */}
            <line x1="38" y1={topY} x2="38" y2={bottomY} stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
            
            {/* Depth tick marks */}
            {[0, 500, 1000, 1500, 2000, Math.round(depthPlast)].map(d => {
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

            {/* Casing Background (Rock formation) */}
            <rect x="75" y={topY} width="22" height={bottomY - topY} fill="url(#rockPattern)" />
            <rect x="223" y={topY} width="22" height={bottomY - topY} fill="url(#rockPattern)" />

            {/* Casing outer walls (ЭК) */}
            <line x1="97" y1={topY} x2="97" y2={bottomY} stroke="#475569" strokeWidth="3" />
            <line x1="223" y1={topY} x2="223" y2={bottomY} stroke="#475569" strokeWidth="3" />

            {/* Gas space in annulus above dyn level */}
            <rect
              x="98"
              y={topY}
              width="124"
              height={Math.max(0, yDyn - topY)}
              fill="url(#gasGrad)"
              className="transition-colors cursor-pointer"
              onMouseEnter={() => setHoveredZone('gas')}
              onMouseLeave={() => setHoveredZone(null)}
            />

            {/* Liquid column in casing below dyn level */}
            <rect
              x="98"
              y={yDyn}
              width="124"
              height={Math.max(0, bottomY - yDyn)}
              fill="url(#liquidGrad)"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredZone('liquid')}
              onMouseLeave={() => setHoveredZone(null)}
            />

            {/* Tubing pipe (НКТ) */}
            <rect
              x="151"
              y={topY}
              width="18"
              height={Math.max(0, yPump - topY - 35)}
              fill="#334155"
              stroke="#64748b"
              strokeWidth="1"
            />
            {/* Fluid inside tubing */}
            <rect
              x="153"
              y={topY}
              width="14"
              height={Math.max(0, yPump - topY - 35)}
              fill="#0284c7"
              opacity="0.8"
            />

            {/* Power cable running down alongside tubing */}
            <path
              d={`M 174 ${topY} L 174 ${yPump + 40}`}
              stroke="#eab308"
              strokeWidth="2.5"
              strokeDasharray="8 3"
            />

            {/* Wellhead (Устьевая арматура) */}
            <g transform="translate(130, 20)">
              {/* Christmas tree cross */}
              <rect x="15" y="10" width="30" height="20" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" rx="3" />
              <line x1="5" y1="20" x2="55" y2="20" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="5" cy="20" r="4" fill="#0284c7" />
              <circle cx="55" cy="20" r="4" fill="#f59e0b" />
              <text x="30" y="8" textAnchor="middle" fill="#f8fafc" fontSize="8" fontWeight="bold">
                Устье (АУ)
              </text>
            </g>

            {/* Dynamic Level Marker (Hдин) */}
            <g transform={`translate(70, ${yDyn})`}>
              <line x1="27" y1="0" x2="153" y2="0" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
              <polygon points="15,0 25,-4 25,4" fill="#38bdf8" />
              <text x="10" y="3" textAnchor="end" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                Hдин ({dynLevel}м)
              </text>
            </g>

            {/* Static Level Marker (Hстат) */}
            <g transform={`translate(70, ${yStat})`}>
              <line x1="27" y1="0" x2="153" y2="0" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
              <text x="10" y="3" textAnchor="end" fill="#f59e0b" fontSize="9" fontFamily="monospace">
                Hстат ({pkvHstat}м)
              </text>
            </g>

            {/* ESP Assembly (УЭЦН компоновка) */}
            <g transform={`translate(144, ${yPump - 35})`}>
              {/* Pump Section (ЭЦН) */}
              <rect x="4" y="0" width="24" height="28" fill="#1e40af" stroke="#60a5fa" strokeWidth="1.5" rx="2" />
              <text x="16" y="17" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">ЭЦН</text>

              {/* Intake Module / Gas Separator */}
              <rect x="6" y="29" width="20" height="12" fill={calc.hydraulics.betaIn >= 10 ? '#b45309' : '#0284c7'} stroke="#cbd5e1" strokeWidth="1" rx="1" />
              <circle cx="16" cy="35" r="2.5" fill="#f8fafc" />

              {/* Protector / Seal section */}
              <rect x="7" y="42" width="18" height="10" fill="#334155" stroke="#94a3b8" strokeWidth="1" />

              {/* Motor Section (ПЭД) */}
              <rect x="5" y="53" width="22" height="34" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" rx="2" />
              <text x="16" y="73" textAnchor="middle" fill="#38bdf8" fontSize="7.5" fontWeight="bold">ПЭД</text>

              {/* Optional Cooling Shroud */}
              {state.coolingShroud && (
                <rect x="2" y="50" width="28" height="40" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 2" rx="3" />
              )}
            </g>

            {/* Pump Depth Marker */}
            <g transform={`translate(230, ${yPump})`}>
              <line x1="-7" y1="0" x2="35" y2="0" stroke="#60a5fa" strokeWidth="1.5" />
              <text x="40" y="3" fill="#60a5fa" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                Hсп: {pumpDepth}м (Pпр = {calc.hydraulics.pPr.toFixed(1)} атм)
              </text>
            </g>

            {/* Perforation Zone (Интервал перфорации пласта) */}
            <g transform={`translate(94, ${yPlast - 15})`}>
              {/* Perforation holes in casing */}
              {[-8, -2, 4, 10, 16, 22].map((offY, i) => (
                <g key={i}>
                  <circle cx="2" cy={offY} r="2" fill="#ef4444" />
                  <circle cx="130" cy={offY} r="2" fill="#ef4444" />
                  {/* Inflow arrows */}
                  <path d={`M -10 ${offY} L -2 ${offY}`} stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrow)" />
                  <path d={`M 142 ${offY} L 134 ${offY}`} stroke="#ef4444" strokeWidth="1.5" />
                </g>
              ))}
              <rect x="5" y="-12" width="122" height="38" fill="#ef4444" fillOpacity="0.1" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" />
              <text x="66" y="10" textAnchor="middle" fill="#fca5a5" fontSize="8" fontWeight="bold">
                Пласт / ВРП ({depthPlast}м)
              </text>
            </g>

            {/* Bottomhole Pressure Marker */}
            <g transform={`translate(230, ${yPlast})`}>
              <line x1="-7" y1="0" x2="35" y2="0" stroke="#ef4444" strokeWidth="1.5" />
              <text x="40" y="3" fill="#fca5a5" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                Pзаб = {calc.hydraulics.pZab.toFixed(1)} атм
              </text>
            </g>

          </svg>
        </div>

        {/* Legend & Pressure Breakdown Panel */}
        <div className="w-full lg:w-2/5 space-y-3 text-xs">
          
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] block border-b border-slate-800 pb-1.5">
              Карта пластовых давлений
            </span>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Pбуф (на выкиде):</span>
              <span className="font-mono font-bold text-cyan-400">{state.pBuf} атм</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Pзатр (в затрубе):</span>
              <span className="font-mono font-bold text-amber-400">{state.pZatr} атм</span>
            </div>

            <div className="flex justify-between items-center py-1 bg-slate-900/60 px-2 rounded">
              <span className="text-slate-200 font-semibold">Pпр (прием насоса):</span>
              <span className="font-mono font-bold text-blue-400">{calc.hydraulics.pPr.toFixed(1)} атм</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Pнас (давл. насыщения):</span>
              <span className="font-mono font-semibold text-slate-300">{state.pSat} атм</span>
            </div>

            <div className="flex justify-between items-center py-1 bg-slate-900/60 px-2 rounded">
              <span className="text-slate-200 font-semibold">Pзаб (забойное):</span>
              <span className="font-mono font-bold text-rose-400">{calc.hydraulics.pZab.toFixed(1)} атм</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Pпл (пластовое):</span>
              <span className="font-mono font-bold text-emerald-400">{state.pPlast} атм</span>
            </div>

            <div className="flex justify-between items-center py-1 text-slate-300">
              <span>Депрессия (Pпл - Pзаб):</span>
              <span className="font-mono font-bold text-amber-300">{calc.hydraulics.depression.toFixed(1)} атм</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-[11px] text-slate-400">
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[10px] block border-b border-slate-800 pb-1.5">
              Элементы компоновки УЭЦН
            </span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-600 shrink-0" />
              <span>Насос ЭЦН (подвеска на глубине {pumpDepth} м)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-600 shrink-0" />
              <span>Входной узел: {calc.hydraulics.gasEquipRecommendation}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-800 border border-cyan-400 shrink-0" />
              <span>ПЭД {state.pedPower} кВт ({state.coolingShroud ? 'с кожухом' : 'без кожуха'})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-yellow-400 shrink-0" />
              <span>Кабель {state.cableType} ({state.cableCross} мм²)</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
