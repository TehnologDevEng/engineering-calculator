import React from 'react';
import { WellState, HydraulicsResults } from '../../types';
import { Activity, Sliders, CheckCircle2, Target } from 'lucide-react';

interface PumpCurveChartProps {
  state: WellState;
  hydraulics: HydraulicsResults;
  onFrequencyChange: (freq: number) => void;
}

export const PumpCurveChart: React.FC<PumpCurveChartProps> = ({
  state,
  hydraulics,
  onFrequencyChange,
}) => {
  const currentFreq = state.frequency;
  const { scaledQ, scaledH } = hydraulics;

  const isVed = state.pedType === 'ved' || currentFreq > 65;
  const maxAllowedFreq = isVed ? 200 : 70;
  const frequencies = isVed ? [40, 50, 75, 100, 150, 200] : [40, 45, 50, 55, 60];

  // SVG coordinate dimensions
  const svgW = 750;
  const svgH = 320;
  const padL = 65;
  const padR = 40;
  const padT = 30;
  const padB = 45;

  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;

  // Max ranges: Q from 0 to 200+ m3/day, H up to scaled max
  const maxFreqRatio = (isVed ? 200 : 65) / 50;
  const maxQ = Math.max(180, Math.ceil((state.flowRate * maxFreqRatio * 1.25) / 20) * 20);
  const maxH = Math.max(2500, Math.ceil((scaledH * 1.35) / 500) * 500);

  const getX = (q: number) => padL + Math.min(1, Math.max(0, q / maxQ)) * chartW;
  const getY = (h: number) => padT + (1 - Math.min(1, Math.max(0, h / maxH))) * chartH;

  // Nominal 50Hz Head curve approximation:
  const baseQ = state.flowRate;
  const baseHead = state.dynLevel + Math.round((state.pBuf * 100000) / (hydraulics.rhoMix * 9.81));
  const h0_50 = baseHead * 1.3;
  const a_coeff = (h0_50 - baseHead) / Math.max(10, Math.pow(baseQ, 2));

  const generateCurvePath = (freq: number) => {
    const k = freq / 50;
    const points: string[] = [];
    const maxQforFreq = maxQ * k;
    const step = maxQforFreq / 30;

    for (let q = 0; q <= maxQforFreq; q += step) {
      const qNom = q / k;
      const hNom = Math.max(0, h0_50 - a_coeff * Math.pow(qNom, 2));
      const hFreq = Math.pow(k, 2) * hNom;

      const px = getX(q);
      const py = getY(hFreq);
      if (py > padT + chartH || px > padL + chartW) break;
      points.push(`${px.toFixed(1)},${py.toFixed(1)}`);
    }

    return points.length > 0 ? `M ${points.join(' L ')}` : '';
  };

  // Optimal operating zone (around nominal rate: 0.75 * Qnom to 1.25 * Qnom)
  const optQmin = baseQ * (currentFreq / 50) * 0.8;
  const optQmax = baseQ * (currentFreq / 50) * 1.2;

  const optRectX1 = getX(optQmin);
  const optRectX2 = getX(optQmax);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">
            Напорно-расходная характеристика насоса Q-H и регулирование ЧРП
          </h3>
        </div>

        {/* Live Frequency Controller on chart header */}
        <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <Sliders className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs text-slate-300 font-medium">
            {isVed ? 'Частота ВЭД:' : 'Частота АД:'}
          </span>
          <span className="font-mono font-bold text-blue-400 text-xs w-14">{currentFreq} Гц</span>
          <input
            type="range"
            min="35"
            max={maxAllowedFreq}
            step="1"
            value={currentFreq}
            onChange={(e) => onFrequencyChange(parseInt(e.target.value, 10))}
            className="w-28 accent-blue-500 cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 font-mono">
            35–{maxAllowedFreq}Гц
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full min-w-[650px] h-auto select-none">
          <defs>
            <linearGradient id="optZoneGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Optimal efficiency zone background */}
          <rect
            x={optRectX1}
            y={padT}
            width={Math.max(10, optRectX2 - optRectX1)}
            height={chartH}
            fill="url(#optZoneGrad)"
          />
          <text
            x={(optRectX1 + optRectX2) / 2}
            y={padT + 16}
            textAnchor="middle"
            fill="#34d399"
            fontSize="9"
            fontWeight="bold"
          >
            Зона оптимума КПД
          </text>

          {/* Horizontal Grid lines (Head H) */}
          {[0, 500, 1000, 1500, 2000, maxH].filter(h => h <= maxH).map(h => {
            const y = getY(h);
            return (
              <g key={h}>
                <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="#1e293b" strokeWidth="1" />
                <text x={padL - 8} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                  {h}
                </text>
              </g>
            );
          })}

          {/* Vertical Grid lines (Flow Q) */}
          {[0, 30, 60, 90, 120, 150, 180, maxQ].filter(q => q <= maxQ).map(q => {
            const x = getX(q);
            return (
              <g key={q}>
                <line x1={x} y1={padT} x2={x} y2={padT + chartH} stroke="#1e293b" strokeWidth="1" />
                <text x={x} y={svgH - padB + 16} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                  {q}
                </text>
              </g>
            );
          })}

          {/* Family of Frequency curves */}
          {frequencies.map(freq => {
            const isSelected = freq === currentFreq;
            const path = generateCurvePath(freq);
            if (!path) return null;

            return (
              <g key={freq}>
                <path
                  d={path}
                  fill="none"
                  stroke={isSelected ? '#38bdf8' : '#475569'}
                  strokeWidth={isSelected ? 3 : 1.5}
                  strokeDasharray={isSelected ? undefined : '4 3'}
                />
                {/* Frequency label at end of curve */}
                <text
                  x={getX(maxQ * (freq / 50) * 0.92)}
                  y={getY(h0_50 * Math.pow(freq / 50, 2) * 0.35)}
                  fill={isSelected ? '#38bdf8' : '#64748b'}
                  fontSize="9.5"
                  fontFamily="monospace"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                >
                  {freq}Гц
                </text>
              </g>
            );
          })}

          {/* Current Dynamic Curve if not matching presets */}
          {!frequencies.includes(currentFreq) && (
            <path
              d={generateCurvePath(currentFreq)}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
            />
          )}

          {/* Current Operating Point marker (Q_rab, H_rab) */}
          <g transform={`translate(${getX(scaledQ)}, ${getY(scaledH)})`}>
            {/* Crosshairs */}
            <line x1={-getX(scaledQ) + padL} y1="0" x2="0" y2="0" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="0" y1="0" x2="0" y2={svgH - padB - getY(scaledH)} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />

            {/* Target circle */}
            <circle cx="0" cy="0" r="8" fill="#f59e0b" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="0" cy="0" r="3.5" fill="#ffffff" />

            {/* Operating point tooltip badge */}
            <rect x="12" y="-28" width="135" height="34" rx="6" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="20" y="-14" fill="#ffffff" fontSize="9" fontWeight="bold">
              Рабочая точка ({currentFreq} Гц)
            </text>
            <text x="20" y="-2" fill="#fbbf24" fontSize="9" fontFamily="monospace">
              Q={scaledQ.toFixed(1)} м³/с, H={scaledH}м
            </text>
          </g>

          {/* Axis Labels */}
          <text x={padL} y={padT - 12} fill="#cbd5e1" fontSize="11" fontWeight="bold">
            Напор H (м)
          </text>
          <text x={svgW - padR} y={svgH - 8} textAnchor="end" fill="#cbd5e1" fontSize="11" fontWeight="bold">
            Подача Q (м³/сут)
          </text>
        </svg>
      </div>

      {/* Point metrics info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
        <div>
          <span className="text-slate-400 block">Подача насоса Q(f):</span>
          <span className="font-mono font-bold text-blue-400 text-sm">{scaledQ.toFixed(1)} м³/сут</span>
        </div>
        <div>
          <span className="text-slate-400 block">Развиваемый напор H(f):</span>
          <span className="font-mono font-bold text-purple-400 text-sm">{scaledH} м</span>
        </div>
        <div>
          <span className="text-slate-400 block">Мощность на валу N(f):</span>
          <span className="font-mono font-bold text-emerald-400 text-sm">{hydraulics.scaledPower} кВт</span>
        </div>
        <div>
          <span className="text-slate-400 block">Регулирование ЧРП:</span>
          <span className="font-mono font-bold text-yellow-400 text-sm">{currentFreq} Гц ({(currentFreq / 50).toFixed(2)})</span>
        </div>
      </div>
    </div>
  );
};
