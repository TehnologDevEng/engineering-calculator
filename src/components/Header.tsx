import React from 'react';
import { WellState } from '../types';
import { WELL_PRESETS } from '../data/constants';
import {
  RotateCcw,
  Save,
  Printer,
  SlidersHorizontal,
  Sun,
  Moon,
  FolderOpen,
} from 'lucide-react';

interface HeaderProps {
  state: WellState;
  theme: 'light' | 'dark';
  savedCount: number;
  onToggleTheme: () => void;
  onOpenWellsModal: () => void;
  onReset: () => void;
  onSave: () => void;
  onPrint: () => void;
  onApplyPreset: (presetState: Partial<WellState>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  theme,
  savedCount,
  onToggleTheme,
  onOpenWellsModal,
  onReset,
  onSave,
  onPrint,
  onApplyPreset,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md print:hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          {/* Brand & Active Well */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-blue-600 text-white font-extrabold text-xs px-2.5 py-1.5 rounded-lg tracking-wider uppercase shrink-0">
              УЭЦН PRO
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
                  Инженерный калькулятор технолога
                </h1>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">
                  · Скв. {state.wellName} ({state.clusterName})
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block truncate">
                Схема · ПКВ · НКТ · Приток и газ · СУ и ТМПН · Охлаждение и глушение · Штуцер
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center flex-wrap gap-2 w-full lg:w-auto justify-between lg:justify-end">
            {/* Presets Dropdown */}
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <select
                aria-label="Выбрать готовый тип скважины"
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2.5 py-1.5 font-medium outline-none focus:border-blue-500 transition cursor-pointer max-w-[210px]"
                onChange={(e) => {
                  const preset = WELL_PRESETS.find((p) => p.id === e.target.value);
                  if (preset) onApplyPreset(preset.state);
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  Типовой сценарий...
                </option>
                {WELL_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={onOpenWellsModal}
                title="Сохранённые скважины и обмен JSON"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition whitespace-nowrap shrink-0"
              >
                <FolderOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="hidden sm:inline">База ({savedCount})</span>
              </button>

              <button
                type="button"
                onClick={onSave}
                title="Сохранить текущую скважину в базе браузера"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition whitespace-nowrap shrink-0"
              >
                <Save className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Сохранить</span>
              </button>

              <button
                type="button"
                onClick={onReset}
                title="Сброс к эталонным значениям"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span className="hidden md:inline">Сброс</span>
              </button>

              <button
                type="button"
                onClick={onToggleTheme}
                title={theme === 'dark' ? 'Включить светлую тему (для дневного света)' : 'Включить тёмную тему'}
                aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition whitespace-nowrap shrink-0"
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                )}
                <span className="hidden xl:inline">{theme === 'dark' ? 'День' : 'Ночь'}</span>
              </button>

              <button
                type="button"
                onClick={onPrint}
                title="Открыть протокол и распечатать в PDF"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition whitespace-nowrap shrink-0"
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
