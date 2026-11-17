import React, { useRef, useState } from 'react';
import { WellState } from '../types';
import { DEFAULT_WELL_STATE } from '../data/constants';
import { X, Save, Trash2, Upload, Download, FolderOpen, Check } from 'lucide-react';

export interface SavedWellEntry {
  id: string;
  savedAt: string;
  state: WellState;
}

interface SavedWellsModalProps {
  isOpen: boolean;
  currentState: WellState;
  savedWells: SavedWellEntry[];
  onClose: () => void;
  onSaveCurrent: () => void;
  onLoadWell: (entry: SavedWellEntry) => void;
  onDeleteWell: (id: string) => void;
  onImportState: (state: WellState) => void;
}

export const SavedWellsModal: React.FC<SavedWellsModalProps> = ({
  isOpen,
  currentState,
  savedWells,
  onClose,
  onSaveCurrent,
  onLoadWell,
  onDeleteWell,
  onImportState,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportJson = () => {
    const payload = {
      app: 'UECN_PRO_CALCULATOR',
      exportedAt: new Date().toISOString(),
      wellState: currentState,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Скв_${currentState.wellName || 'расчёт'}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const candidate = parsed?.wellState ?? parsed;
        if (!candidate || typeof candidate !== 'object' || typeof candidate.pumpDepth !== 'number') {
          setImportError('Файл не похож на расчёт УЭЦН PRO (.json).');
          return;
        }
        onImportState({ ...DEFAULT_WELL_STATE, ...candidate });
        onClose();
      } catch {
        setImportError('Не удалось прочитать JSON-файл. Проверьте формат файла.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4 print:hidden">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                База скважин и обмен проектами (.json)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Сохраняйте расчёты по разным скважинам и делитесь файлом с коллегами
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg transition"
            aria-label="Закрыть окно"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5">
            <div className="text-xs">
              <div className="text-slate-500 dark:text-slate-400">Текущая скважина:</div>
              <div className="font-bold text-slate-900 dark:text-white font-mono">
                Скв. {currentState.wellName} ({currentState.clusterName}) · Q = {currentState.flowRate} м³/сут
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={onSaveCurrent}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition"
              >
                <Save className="w-3.5 h-3.5" />
                Сохранить в базу
              </button>
              <button
                type="button"
                onClick={handleExportJson}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition"
              >
                <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Экспорт .json
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition"
              >
                <Upload className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Импорт .json
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {importError && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
              {importError}
            </div>
          )}

          {/* Saved List */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              Сохранённые скважины ({savedWells.length})
            </div>

            {savedWells.length === 0 ? (
              <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                База пока пуста. Нажмите «Сохранить в базу», чтобы добавить текущую скважину и быстро переключаться между объектами.
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                {savedWells.map((entry) => {
                  const isActive =
                    entry.state.wellName === currentState.wellName &&
                    entry.state.clusterName === currentState.clusterName;
                  return (
                    <div
                      key={entry.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            Скв. {entry.state.wellName}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            · {entry.state.clusterName}
                          </span>
                          {isActive && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                              <Check className="w-3 h-3" /> Открыта
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          Q={entry.state.flowRate} м³/сут · Hсп={entry.state.pumpDepth} м · W={entry.state.waterCut}% · {entry.savedAt}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            onLoadWell(entry);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition"
                        >
                          Загрузить
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteWell(entry.id)}
                          aria-label={`Удалить скважину ${entry.state.wellName}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
