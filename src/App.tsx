import React, { useState, useMemo, useCallback, useEffect, Suspense } from 'react';
import { WellState, ActiveTab } from './types';
import { DEFAULT_WELL_STATE } from './data/constants';
import { calculateAll, calculateLevelsFromTmsp } from './utils/calculations';
import { Header } from './components/Header';
import { SummaryMetrics } from './components/SummaryMetrics';
import { Footer } from './components/Footer';
import { SavedWellsModal, SavedWellEntry } from './components/SavedWellsModal';
import {
  Layers,
  Clock,
  Pipette,
  Gauge,
  Zap,
  Sliders,
  Database,
  FileText,
  BookOpen,
  CheckCircle2,
  BarChart3,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';

// Lazy load tabs to reduce initial bundle size
const WellSchemeTab = React.lazy(() =>
  import('./components/tabs/WellSchemeTab').then((m) => ({ default: m.WellSchemeTab }))
);
const PkvTab = React.lazy(() =>
  import('./components/tabs/PkvTab').then((m) => ({ default: m.PkvTab }))
);
const NktTab = React.lazy(() =>
  import('./components/tabs/NktTab').then((m) => ({ default: m.NktTab }))
);
const HydraulicsTab = React.lazy(() =>
  import('./components/tabs/HydraulicsTab').then((m) => ({ default: m.HydraulicsTab }))
);
const HeadMarginTab = React.lazy(() =>
  import('./components/tabs/HeadMarginTab').then((m) => ({ default: m.HeadMarginTab }))
);
const ElectroTab = React.lazy(() =>
  import('./components/tabs/ElectroTab').then((m) => ({ default: m.ElectroTab }))
);
const ChokeTab = React.lazy(() =>
  import('./components/tabs/ChokeTab').then((m) => ({ default: m.ChokeTab }))
);
const VolumesTab = React.lazy(() =>
  import('./components/tabs/VolumesTab').then((m) => ({ default: m.VolumesTab }))
);
const ChartsTab = React.lazy(() =>
  import('./components/tabs/ChartsTab').then((m) => ({ default: m.ChartsTab }))
);
const ReportTab = React.lazy(() =>
  import('./components/tabs/ReportTab').then((m) => ({ default: m.ReportTab }))
);
const ReferenceTab = React.lazy(() =>
  import('./components/tabs/ReferenceTab').then((m) => ({ default: m.ReferenceTab }))
);

const STORAGE_KEY = 'esp_technologist_calc_v4_state';
const WELLS_DB_KEY = 'esp_saved_wells_v1';
const THEME_KEY = 'esp_calc_theme_v1';

interface TabItem {
  id: ActiveTab;
  label: string;
  shortLabel: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  hasWarning?: boolean;
}

interface TabGroup {
  groupTitle: string;
  tabs: TabItem[];
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('well-scheme');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isWellsModalOpen, setIsWellsModalOpen] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // ignore
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Initialize well state from localStorage if available
  const [wellState, setWellState] = useState<WellState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_WELL_STATE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error restoring state:', e);
    }
    return DEFAULT_WELL_STATE;
  });

  // Saved wells database
  const [savedWells, setSavedWells] = useState<SavedWellEntry[]>(() => {
    try {
      const raw = localStorage.getItem(WELLS_DB_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const persistSavedWells = useCallback((next: SavedWellEntry[]) => {
    setSavedWells(next);
    try {
      localStorage.setItem(WELLS_DB_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Failed saving wells DB:', e);
    }
  }, []);

  // Automatically recalculate all modules whenever inputs change
  const calc = useMemo(() => calculateAll(wellState), [wellState]);

  const handleUpdateState = useCallback((updates: Partial<WellState>) => {
    setWellState((prev) => {
      const next: WellState = { ...prev, ...updates };
      const tmspTriggerKeys: (keyof WellState)[] = [
        'levelInputMode',
        'tmspPDyn',
        'tmspPStat',
        'tmspUseVertical',
        'tmspUseDensity',
        'pumpDepth',
        'headElongation',
        'pZatr',
        'waterCut',
        'oilDensity',
        'waterDensity',
      ];
      const shouldRecalcTmsp =
        next.levelInputMode === 'tmsp' &&
        tmspTriggerKeys.some((k) => k in updates);

      if (shouldRecalcTmsp) {
        const { dynLevel, statLevel } = calculateLevelsFromTmsp(next);
        next.dynLevel = dynLevel;
        next.pkvHstat = statLevel;
        next.measuredPtube = next.tmspPDyn;
        next.headPtms = next.tmspPDyn;
        next.pkvPtmsStop = next.tmspPDyn;
        next.pkvPtmsStart = next.tmspPStat;
      }
      return next;
    });
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  const upsertWellToDb = useCallback(
    (targetState: WellState) => {
      const timestamp = new Date().toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      const existingIdx = savedWells.findIndex(
        (w) =>
          w.state.wellName.trim() === targetState.wellName.trim() &&
          w.state.clusterName.trim() === targetState.clusterName.trim()
      );
      if (existingIdx >= 0) {
        const updated = [...savedWells];
        updated[existingIdx] = {
          ...updated[existingIdx],
          savedAt: timestamp,
          state: targetState,
        };
        persistSavedWells(updated);
      } else {
        const entry: SavedWellEntry = {
          id: Date.now().toString(),
          savedAt: timestamp,
          state: targetState,
        };
        persistSavedWells([entry, ...savedWells]);
      }
    },
    [savedWells, persistSavedWells]
  );

  const handleSave = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wellState));
      upsertWellToDb(wellState);
      showToast(`Скважина ${wellState.wellName} сохранена в памяти браузера и базе.`);
    } catch (e) {
      console.error('Save failed:', e);
    }
  }, [wellState, upsertWellToDb, showToast]);

  const handleSaveCurrentToModalDb = useCallback(() => {
    upsertWellToDb(wellState);
    showToast(`Скважина ${wellState.wellName} добавлена в базу.`);
  }, [wellState, upsertWellToDb, showToast]);

  const handleLoadWell = useCallback(
    (entry: SavedWellEntry) => {
      const restored = { ...DEFAULT_WELL_STATE, ...entry.state };
      setWellState(restored);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(restored));
      } catch {
        // ignore
      }
      showToast(`Загружена скважина ${restored.wellName} (${restored.clusterName}).`);
    },
    [showToast]
  );

  const handleDeleteWell = useCallback(
    (id: string) => {
      persistSavedWells(savedWells.filter((w) => w.id !== id));
      showToast('Запись удалена из базы скважин.');
    },
    [savedWells, persistSavedWells, showToast]
  );

  const handleImportState = useCallback(
    (imported: WellState) => {
      const merged = { ...DEFAULT_WELL_STATE, ...imported };
      setWellState(merged);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {
        // ignore
      }
      showToast(`Проект скв. ${merged.wellName} импортирован из файла.`);
    },
    [showToast]
  );

  const handleReset = useCallback(() => {
    setShowResetConfirm(true);
  }, []);

  const confirmReset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setWellState(DEFAULT_WELL_STATE);
    setShowResetConfirm(false);
    showToast('Все значения сброшены к эталону.');
  }, [showToast]);

  const handleApplyPreset = useCallback(
    (presetState: Partial<WellState>, presetName?: string) => {
      setWellState((prev) => ({ ...prev, ...presetState }));
      showToast(
        presetName
          ? `Загружен сценарий: ${presetName}`
          : 'Параметры выбранного типа скважины успешно загружены!'
      );
    },
    [showToast]
  );

  const handlePrint = useCallback(() => {
    setActiveTab('report');
    setTimeout(() => {
      window.print();
    }, 250);
  }, []);

  const wellSchemeWarning =
    (wellState.levelInputMode === 'tmsp' && wellState.tmspPDyn >= wellState.tmspPStat) ||
    wellState.dynLevel >= wellState.pumpDepth ||
    wellState.pumpDepth > wellState.depthPlast ||
    wellState.pkvHstat >= wellState.dynLevel ||
    wellState.pSat > wellState.pPlast;

  const hydraulicsWarning =
    calc.hydraulics.betaIn >= 25 ||
    !calc.hydraulics.isDiscrepancyOk ||
    wellState.dynLevel >= wellState.pumpDepth;

  const nktWarning = !calc.nkt.isStrengthOk || calc.nkt.sandCarryStatus === 'danger';
  const headAndPedWarning = calc.headMargin.status === 'deficit' || !calc.coolingKill.isCoolingOk;
  const electroWarning = calc.electro.deltaUPct > 15 || !calc.electro.isCableOk;
  const pkvWarning = !calc.pkv.isOptimal;

  const tabGroups: TabGroup[] = [
    {
      groupTitle: '1. Скважина и пласт',
      tabs: [
        {
          id: 'well-scheme',
          label: 'Схема скважины',
          shortLabel: 'Схема скважины (ТМСП / паспорт)',
          icon: Layers,
          color: 'text-sky-600 dark:text-sky-400',
          hasWarning: wellSchemeWarning,
        },
        {
          id: 'hydraulics',
          label: 'Приток и газ',
          shortLabel: 'Приток и газ (Pпр, βвх)',
          icon: Gauge,
          color: 'text-blue-600 dark:text-blue-400',
          hasWarning: hydraulicsWarning,
        },
      ],
    },
    {
      groupTitle: '2. Установка и НКТ',
      tabs: [
        {
          id: 'head-margin',
          label: 'Напор и ПЭД',
          shortLabel: 'Запас напора и охлаждение ПЭД',
          icon: TrendingUp,
          color: 'text-sky-600 dark:text-sky-400',
          hasWarning: headAndPedWarning,
        },
        {
          id: 'nkt',
          label: 'НКТ и глушение',
          shortLabel: 'Колонна НКТ и глушение (ПРС/КРС)',
          icon: Pipette,
          color: 'text-purple-600 dark:text-purple-400',
          hasWarning: nktWarning,
        },
        {
          id: 'volumes',
          label: 'Объёмы',
          shortLabel: 'Ступенчатые объёмы скважины',
          icon: Database,
          color: 'text-emerald-600 dark:text-emerald-400',
        },
      ],
    },
    {
      groupTitle: '3. Режимы и наземное',
      tabs: [
        {
          id: 'electro',
          label: 'СУ и ТМПН',
          shortLabel: 'Электрокомплекс (кабель, СУ, ТМПН)',
          icon: Zap,
          color: 'text-amber-600 dark:text-yellow-400',
          hasWarning: electroWarning,
        },
        {
          id: 'pkv',
          label: 'Режим ПКВ',
          shortLabel: 'Периодический режим (ПКВ)',
          icon: Clock,
          color: 'text-amber-600 dark:text-amber-400',
          hasWarning: pkvWarning,
        },
        {
          id: 'choke',
          label: 'Штуцер',
          shortLabel: 'Устьевой штуцер',
          icon: Sliders,
          color: 'text-indigo-600 dark:text-indigo-400',
        },
        {
          id: 'charts',
          label: 'Графики Q-H',
          shortLabel: 'Графики и кривые насоса Q-H',
          icon: BarChart3,
          color: 'text-teal-600 dark:text-teal-400',
        },
      ],
    },
    {
      groupTitle: '4. Итоги',
      tabs: [
        {
          id: 'report',
          label: 'Протокол',
          shortLabel: 'Сводный паспорт-протокол',
          icon: FileText,
          color: 'text-emerald-600 dark:text-emerald-400',
        },
        {
          id: 'reference',
          label: 'Справочник',
          shortLabel: 'Нормативный справочник',
          icon: BookOpen,
          color: 'text-slate-600 dark:text-slate-400',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white pb-16 transition-colors">

      {/* Top Fixed Header */}
      <Header
        state={wellState}
        theme={theme}
        savedCount={savedWells.length}
        onToggleTheme={toggleTheme}
        onOpenWellsModal={() => setIsWellsModalOpen(true)}
        onReset={handleReset}
        onSave={handleSave}
        onPrint={handlePrint}
        onApplyPreset={handleApplyPreset}
      />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5 flex-1">

        {/* Top Clickable Key Metrics Banner */}
        <SummaryMetrics
          calc={calc}
          activeTab={activeTab}
          onNavigateTab={setActiveTab}
        />

        {/* Mobile Quick Switcher */}
        <div className="sm:hidden mb-4 print:hidden">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Раздел калькулятора
          </label>
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as ActiveTab)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-500"
          >
            {tabGroups.map((grp) => (
              <optgroup key={grp.groupTitle} label={grp.groupTitle}>
                {grp.tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.hasWarning ? '⚠ ' : ''}
                    {tab.shortLabel}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Grouped Desktop Tab Navigation */}
        <nav
          aria-label="Навигация по модулям"
          className="hidden sm:flex items-stretch gap-3 overflow-x-auto pb-2 mb-6 scrollbar-none print:hidden"
        >
          {tabGroups.map((group) => (
            <div
              key={group.groupTitle}
              className="flex flex-col bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shrink-0"
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 pb-1">
                {group.groupTitle}
              </div>
              <div className="flex items-center gap-1">
                {group.tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : tab.color}`} />
                      <span>{tab.label}</span>
                      {tab.hasWarning && (
                        <AlertTriangle
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isActive ? 'text-amber-200' : 'text-amber-500 dark:text-amber-400'
                          }`}
                          aria-label="Есть замечания"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Active Tab View */}
        <section>
          <Suspense
            fallback={
              <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                Загрузка модуля...
              </div>
            }
          >
            {activeTab === 'well-scheme' && (
              <WellSchemeTab
                state={wellState}
                calc={calc}
                updateState={handleUpdateState}
                onApplyPreset={handleApplyPreset}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'pkv' && (
              <PkvTab
                state={wellState}
                pkv={calc.pkv}
                onChange={handleUpdateState}
              />
            )}

            {activeTab === 'nkt' && (
              <NktTab
                state={wellState}
                nkt={calc.nkt}
                coolingKill={calc.coolingKill}
                onChange={handleUpdateState}
              />
            )}

            {activeTab === 'hydraulics' && (
              <HydraulicsTab
                state={wellState}
                hydraulics={calc.hydraulics}
                onChange={handleUpdateState}
              />
            )}

            {activeTab === 'head-margin' && (
              <HeadMarginTab
                state={wellState}
                calc={calc}
                onChange={handleUpdateState}
              />
            )}

            {activeTab === 'electro' && (
              <ElectroTab
                state={wellState}
                electro={calc.electro}
                onChange={handleUpdateState}
              />
            )}

            {activeTab === 'choke' && (
              <ChokeTab
                state={wellState}
                calc={calc}
                updateState={handleUpdateState}
              />
            )}

            {activeTab === 'volumes' && (
              <VolumesTab
                state={wellState}
                calc={calc}
                updateState={handleUpdateState}
              />
            )}

            {activeTab === 'charts' && (
              <ChartsTab
                state={wellState}
                calc={calc}
                onChange={handleUpdateState}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'report' && (
              <ReportTab
                state={wellState}
                calc={calc}
                onChange={handleUpdateState}
              />
            )}

            {activeTab === 'reference' && <ReferenceTab />}
          </Suspense>
        </section>

      </main>

      {/* Footer with Developer Attribution */}
      <Footer />

      {/* Saved Wells Database & JSON Export/Import Modal */}
      <SavedWellsModal
        isOpen={isWellsModalOpen}
        currentState={wellState}
        savedWells={savedWells}
        onClose={() => setIsWellsModalOpen(false)}
        onSaveCurrent={handleSaveCurrentToModalDb}
        onLoadWell={handleLoadWell}
        onDeleteWell={handleDeleteWell}
        onImportState={handleImportState}
      />

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 print:hidden">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Сбросить параметры?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              Сбросить все введённые параметры к исходным эталонным значениям?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={confirmReset}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition"
              >
                Сбросить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white dark:bg-slate-900 border border-emerald-400 dark:border-emerald-500/50 text-slate-900 dark:text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
