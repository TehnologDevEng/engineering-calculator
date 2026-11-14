import React from 'react';
import { WellState, PkvResults } from '../../types';
import { Clock, TrendingUp, Play, Pause, AlertCircle } from 'lucide-react';

interface PkvCycleChartProps {
  state: WellState;
  pkv: PkvResults;
}

export const PkvCycleChart: React.FC<PkvCycleChartProps> = ({ state, pkv }) => {
  const { tPumpHours, tAccumHours, tCycleHours, deltaH, actualDailyQ } = pkv;
  // Use calculated values from pkv if available (for TMS mode), otherwise fallback to state
  const pkvHstat = pkv.calcHstat ?? state.pkvHstat;
  const pkvHdyn = pkv.calcHdyn ?? state.pkvHdyn;

  // Chart coordinate space: 24 hours on X axis (0 to 24)
  // Y axis: Depth in meters (from pkvHstat - 100 to pkvHdyn + 100)
  const svgW = 750;
  const svgH = 280;
  const padL = 65;
  const padR = 25;
  const padT = 30;
  const padB = 40;

  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;

  const yMin = Math.max(0, pkvHstat - 100);
  const yMax = pkvHdyn + 100;

  const getX = (hour: number) => {
    return padL + (hour / 24) * chartW;
  };

  const getY = (depth: number) => {
    return padT + ((depth - yMin) / (yMax - yMin)) * chartH;
  };

  // Generate sawtooth points for 24 hours:
  // Starts at Hstat (level at top).
  // During tPumpHours: level drops (depth increases) from Hstat to Hdyn.
  // During tAccumHours: level rises (depth decreases) from Hdyn back to Hstat.
  const pathPoints: { x: number; y: number; type: 'pump' | 'accum' }[] = [];
  const phaseRects: { x: number; w: number; isPump: boolean }[] = [];

  let currentH = 0;
  while (currentH < 24) {
    // 1. Pumping phase (from currentH to currentH + tPumpHours)
    const pumpEnd = Math.min(24, currentH + tPumpHours);
    const pumpFraction = (pumpEnd - currentH) / Math.max(0.01, tPumpHours);
    const endDepthPump = pkvHstat + (pkvHdyn - pkvHstat) * pumpFraction;

    phaseRects.push({
      x: getX(currentH),
      w: getX(pumpEnd) - getX(currentH),
      isPump: true,
    });

    if (currentH === 0) {
      pathPoints.push({ x: getX(0), y: getY(pkvHstat), type: 'pump' });
    }
    pathPoints.push({ x: getX(pumpEnd), y: getY(endDepthPump), type: 'pump' });

    currentH = pumpEnd;
    if (currentH >= 24) break;

    // 2. Accumulation phase (from currentH to currentH + tAccumHours)
    const accumEnd = Math.min(24, currentH + tAccumHours);
    const accumFraction = (accumEnd - currentH) / Math.max(0.01, tAccumHours);
    const endDepthAccum = pkvHdyn - (pkvHdyn - pkvHstat) * accumFraction;

    phaseRects.push({
      x: getX(currentH),
      w: getX(accumEnd) - getX(currentH),
      isPump: false,
    });

    pathPoints.push({ x: getX(accumEnd), y: getY(endDepthAccum), type: 'accum' });
    currentH = accumEnd;
  }

  const pathD = pathPoints.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">
            График изменения динамического уровня во времени H(t) за сутки
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/40 border border-emerald-400" />
            Откачка ({tPumpHours.toFixed(1)}ч)
          </span>
          <span className="flex items-center gap-1 text-amber-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/40 border border-amber-400" />
            Пауза накопления ({tAccumHours.toFixed(1)}ч)
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full min-w-[650px] h-auto select-none">
          <defs>
            <linearGradient id="pumpAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="accumAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Phase Background rectangles */}
          {phaseRects.map((r, idx) => (
            <rect
              key={idx}
              x={r.x}
              y={padT}
              width={r.w}
              height={chartH}
              fill={r.isPump ? 'url(#pumpAreaGrad)' : 'url(#accumAreaGrad)'}
            />
          ))}

          {/* Grid lines horizontal (Depths) */}
          {[pkvHstat, (pkvHstat + pkvHdyn) / 2, pkvHdyn].map((d, i) => {
            const y = getY(d);
            return (
              <g key={i}>
                <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="#334155" strokeDasharray="3 3" strokeWidth="1" />
                <text x={padL - 8} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                  {Math.round(d)} м
                </text>
              </g>
            );
          })}

          {/* Grid lines vertical (Hours) */}
          {[0, 4, 8, 12, 16, 20, 24].map(h => {
            const x = getX(h);
            return (
              <g key={h}>
                <line x1={x} y1={padT} x2={x} y2={padT + chartH} stroke="#1e293b" strokeWidth="1" />
                <text x={x} y={svgH - padB + 16} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                  {h}:00
                </text>
              </g>
            );
          })}

          {/* Static level reference line */}
          <line
            x1={padL}
            y1={getY(pkvHstat)}
            x2={svgW - padR}
            y2={getY(pkvHstat)}
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <text x={svgW - padR} y={getY(pkvHstat) - 6} textAnchor="end" fill="#f59e0b" fontSize="9" fontWeight="bold">
            Hстат = {Math.round(pkvHstat)}м
          </text>

          {/* Dynamic level reference line */}
          <line
            x1={padL}
            y1={getY(pkvHdyn)}
            x2={svgW - padR}
            y2={getY(pkvHdyn)}
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <text x={svgW - padR} y={getY(pkvHdyn) + 14} textAnchor="end" fill="#38bdf8" fontSize="9" fontWeight="bold">
            Hдин = {Math.round(pkvHdyn)}м
          </text>

          {/* Sawtooth Path */}
          <path
            d={pathD}
            fill="none"
            stroke="#60a5fa"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points markers */}
          {pathPoints.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r="4"
              fill={pt.type === 'pump' ? '#10b981' : '#f59e0b'}
              stroke="#0f172a"
              strokeWidth="2"
            />
          ))}

          {/* Axis Labels */}
          <text x={padL} y={padT - 12} fill="#cbd5e1" fontSize="11" fontWeight="bold">
            Глубина уровня H (м)
          </text>
          <text x={svgW - padR} y={svgH - 8} textAnchor="end" fill="#cbd5e1" fontSize="11" fontWeight="bold">
            Время суток (часы)
          </text>
        </svg>
      </div>

      {/* Cycle summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
        <div>
          <span className="text-slate-400 block">Период одного цикла:</span>
          <span className="font-mono font-bold text-white text-sm">{tCycleHours.toFixed(2)} ч</span>
        </div>
        <div>
          <span className="text-slate-400 block">Количество пусков:</span>
          <span className="font-mono font-bold text-amber-400 text-sm">{pkv.startsPerDay.toFixed(1)} / сут</span>
        </div>
        <div>
          <span className="text-slate-400 block">Перепад уровня ΔH:</span>
          <span className="font-mono font-bold text-blue-400 text-sm">{deltaH.toFixed(0)} м</span>
        </div>
        <div>
          <span className="text-slate-400 block">Добыча за сутки:</span>
          <span className="font-mono font-bold text-emerald-400 text-sm">{actualDailyQ.toFixed(1)} м³/сут</span>
        </div>
      </div>
    </div>
  );
};
