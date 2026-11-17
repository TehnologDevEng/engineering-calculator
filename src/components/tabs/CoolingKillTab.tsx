import React from 'react';
import { NumericInput } from '../NumericInput';
import { FieldHint } from '../FieldHint';
import { WellState, CoolingKillResults } from '../../types';
import { Snowflake, Droplets, Wrench } from 'lucide-react';

interface CoolingKillTabProps {
  state: WellState;
  coolingKill: CoolingKillResults;
  onChange: (updates: Partial<WellState>) => void;
}

export const CoolingKillTab: React.FC<CoolingKillTabProps> = ({ state, coolingKill, onChange }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Cooling Module Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Snowflake className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
              Охлаждение ПЭД
            </h2>
          </div>
          <span
            className={`text-xs font-semibold ${
              coolingKill.isCoolingOk
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {coolingKill.isCoolingOk ? 'Норма охлаждения' : 'Риск перегрева ПЭД!'}
          </span>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Внутр. D ЭК <span className="text-blue-600 dark:text-blue-400 font-mono">мм</span>
                <FieldHint hintKey="casingId" />
              </label>
              <NumericInput
                value={state.casingId}
                onChange={(val) => onChange({ casingId: val, pkvCasingId: val })}
                className="focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Диаметр корпуса ПЭД
              </label>
              <select
                value={state.pedDiameter}
                onChange={(e) => onChange({ pedDiameter: Number(e.target.value) })}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:border-cyan-500 focus:outline-none"
              >
                <option value="103">103 мм (Габарит 5)</option>
                <option value="117">117 мм (Габарит 5А)</option>
                <option value="130">130 мм (Габарит 6)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Кожух охлаждения (кожух-направитель потока)
            </label>
            <select
              value={state.coolingShroud ? 'yes' : 'no'}
              onChange={(e) => onChange({ coolingShroud: e.target.value === 'yes' })}
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:border-cyan-500 focus:outline-none"
            >
              <option value="no">Без кожуха (поток омывает в зазоре колонны)</option>
              <option value="yes">С кожухом охлаждения (Dвн кожуха = 122 мм)</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="divide-y divide-slate-200/80 dark:divide-slate-800/80 text-xs pt-2">
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Площадь кольцевого сечения зазора:</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
              {coolingKill.sAnnulusCm2.toFixed(1)} см²
            </span>
          </div>

          <div className="py-2.5 flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 px-2.5 rounded-lg">
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              Скорость восходящего потока омывания v:
            </span>
            <span
              className={`font-mono font-bold text-sm ${
                coolingKill.isCoolingOk ? 'text-cyan-600 dark:text-cyan-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {coolingKill.velocity.toFixed(2)} м/с
            </span>
          </div>

          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Отраслевая регламентная норма скорости:</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
              ≥ {coolingKill.minRequiredVelocity.toFixed(2)} м/с
            </span>
          </div>

          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Тепловой статус электродвигателя:</span>
            <span
              className={`font-semibold ${
                coolingKill.isCoolingOk
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {coolingKill.isCoolingOk ? 'Теплоотвод обеспечен' : 'Критический перегрев'}
            </span>
          </div>
        </div>

        <div
          className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-2.5 ${
            coolingKill.isCoolingOk
              ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40 text-rose-900 dark:text-rose-200'
          }`}
        >
          <p>{coolingKill.coolingMessage}</p>
          {!coolingKill.isCoolingOk && !state.coolingShroud && (
            <button
              type="button"
              onClick={() => onChange({ coolingShroud: true })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition shadow-xs"
            >
              <Wrench className="w-3.5 h-3.5" />
              Включить кожух охлаждения
            </button>
          )}
        </div>
      </div>

      {/* 2. Well Killing Module Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
              Глушение скважины (ПРС / КРС)
            </h2>
          </div>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 font-mono">РД 08-200-98</span>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Коэффициент запаса kзап
                <FieldHint hintKey="killSafetyMargin" />
              </label>
              <select
                value={state.killSafetyMargin}
                onChange={(e) => onChange({ killSafetyMargin: Number(e.target.value) })}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:border-blue-500 focus:outline-none"
              >
                <option value="1.05">1.05 (Запас 5% — до 1200 м)</option>
                <option value="1.08">1.08 (Запас 8% — 1200–2000 м)</option>
                <option value="1.10">1.10 (Запас 10% — свыше 2000 м)</option>
                <option value="1.15">1.15 (Запас 15% — АВПД)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Диаметр НКТ
              </label>
              <select
                value={state.tubingSize}
                onChange={(e) => {
                  const size = Number(e.target.value);
                  onChange({ tubingSize: size, nktSize: size, pkvTubingD: size });
                }}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:border-blue-500 focus:outline-none"
              >
                <option value="60">60 мм (НКТ 60)</option>
                <option value="73">73 мм (НКТ 73)</option>
                <option value="89">89 мм (НКТ 89)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="divide-y divide-slate-200/80 dark:divide-slate-800/80 text-xs pt-2">
          <div className="py-2.5 flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 px-2.5 rounded-lg">
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              Требуемая плотность ЖГ ρглуш:
            </span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
              {coolingKill.rhoKillGCm3.toFixed(2)} г/см³ ({coolingKill.rhoKillKgM3} кг/м³)
            </span>
          </div>

          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Тип технологической жидкости глушения:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{coolingKill.fluidType}</span>
          </div>

          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Внутренний объём колонны НКТ:</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
              {coolingKill.vTubing.toFixed(2)} м³
            </span>
          </div>

          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Объём кольцевого пространства (затруб):</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
              {coolingKill.vAnnulus.toFixed(2)} м³
            </span>
          </div>

          <div className="py-2.5 flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Полный объём скважины Vскв:</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
              {coolingKill.vTotalWell.toFixed(1)} м³
            </span>
          </div>

          <div className="py-2.5 flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 px-2.5 rounded-lg">
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              Потребный объём жидкости глушения (1.25 V):
            </span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              {coolingKill.vKillReq.toFixed(1)} м³
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-xl text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
          Перед началом ремонтных работ необходимо подготовить не менее{' '}
          <strong>{coolingKill.vKillReq.toFixed(1)} м³</strong> жидкости глушения плотностью{' '}
          <strong>{coolingKill.rhoKillGCm3.toFixed(2)} г/см³</strong> с контролем выравнивания плотности на выходе из
          затруба.
        </div>
      </div>
    </div>
  );
};
