import React from 'react';
import { WellState } from '../types';
import { WELL_PRESETS } from '../data/constants';
import { 
  RotateCcw, 
  Save, 
  Printer, 
  SlidersHorizontal,
  FileSpreadsheet
} from 'lucide-react';

interface HeaderProps {
  state: WellState;
  onUpdateState: (updates: Partial<WellState>) => void;
  onReset: () => void;
  onSave: () => void;
  onPrint: () => void;
  onApplyPreset: (presetState: Partial<WellState>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  onUpdateState,
  onReset,
  onSave,
  onPrint,
  onApplyPreset,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-xs px-2.5 py-1.5 rounded-lg shadow-sm tracking-wider uppercase flex items-center gap-1.5">
              <span>УЭЦН</span>
              <span className="bg-blue-400/30 text-[10px] px-1 rounded">PRO v4.2</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Инженерный калькулятор технолога
                </h1>
                <span className="hidden sm:inline-block text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-mono">
                  Скв. {state.wellName} ({state.clusterName})
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Комплекс расчётов: ПВ/ПКВ · НКТ · Приток & Газ · СУ & ТМПН · Охлаждение & Глушение
              </p>
            </div>
          </div>

          {/* Presets & Actions */}
          <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-between md:justify-end">
            
            {/* Presets Dropdown */}
            <div className="relative flex items-center">
              <span className="text-xs text-slate-400 mr-2 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
                Пресет:
              </span>
              <select
                className="bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 font-medium outline-none focus:border-blue-500 transition cursor-pointer"
                onChange={(e) => {
                  const preset = WELL_PRESETS.find(p => p.id === e.target.value);
                  if (preset) onApplyPreset(preset.state);
                }}
                defaultValue=""
              >
                <option value="" disabled>-- Выбрать тип скважины --</option>
                {WELL_PRESETS.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onReset}
                title="Сброс к эталонным значениям"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Сброс</span>
              </button>

              <button
                type="button"
                onClick={onSave}
                title="Сохранить параметры в браузере"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition"
              >
                <Save className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Сохранить</span>
              </button>

              <button
                type="button"
                onClick={onPrint}
                title="Распечатать или сохранить протокол в PDF"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Отчёт / PDF</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
