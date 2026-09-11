import React, { useState, useMemo, useCallback, Suspense } from 'react';
import { WellState, ActiveTab } from './types';
import { DEFAULT_WELL_STATE } from './data/constants';
import { calculateAll } from './utils/calculations';
import { Header } from './components/Header';
import { SummaryMetrics } from './components/SummaryMetrics';
import { Footer } from './components/Footer';
import { 
  Layers, Clock, Pipette, Gauge, Zap, Snowflake, 
  Sliders, Database, FileText, BookOpen, CheckCircle2, BarChart3
} from 'lucide-react';

// Lazy load tabs to reduce initial bundle size
const WellSchemeTab = React.lazy(() => import('./components/tabs/WellSchemeTab').then(m => ({ default: m.WellSchemeTab })));
const PkvTab = React.lazy(() => import('./components/tabs/PkvTab').then(m => ({ default: m.PkvTab })));
const NktTab = React.lazy(() => import('./components/tabs/NktTab').then(m => ({ default: m.NktTab })));
const HydraulicsTab = React.lazy(() => import('./components/tabs/HydraulicsTab').then(m => ({ default: m.HydraulicsTab })));
const ElectroTab = React.lazy(() => import('./components/tabs/ElectroTab').then(m => ({ default: m.ElectroTab })));
const CoolingKillTab = React.lazy(() => import('./components/tabs/CoolingKillTab').then(m => ({ default: m.CoolingKillTab })));
const ChokeTab = React.lazy(() => import('./components/tabs/ChokeTab').then(m => ({ default: m.ChokeTab })));
const VolumesTab = React.lazy(() => import('./components/tabs/VolumesTab').then(m => ({ default: m.VolumesTab })));
const ChartsTab = React.lazy(() => import('./components/tabs/ChartsTab').then(m => ({ default: m.ChartsTab })));
const ReportTab = React.lazy(() => import('./components/tabs/ReportTab').then(m => ({ default: m.ReportTab })));
const ReferenceTab = React.lazy(() => import('./components/tabs/ReferenceTab').then(m => ({ default: m.ReferenceTab })));

const STORAGE_KEY = 'esp_technologist_calc_v4_state';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('well-scheme');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize state from localStorage if available
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

  // Automatically recalculate all modules whenever inputs change
  const calc = useMemo(() => calculateAll(wellState), [wellState]);

  // useCallback prevents re-rendering all tabs when updating state
  const handleUpdateState = useCallback((updates: Partial<WellState>) => {
    setWellState(prev => ({ ...prev, ...updates }));
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  const handleSave = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wellState));
      showToast('Параметры скважины успешно сохранены в памяти браузера!');
    } catch (e) {
      console.error('Save failed:', e);
    }
  }, [wellState, showToast]);

  const handleReset = useCallback(() => {
    if (window.confirm('Сбросить все введённые параметры к исходным эталонным значениям?')) {
      localStorage.removeItem(STORAGE_KEY);
      setWellState(DEFAULT_WELL_STATE);
      showToast('Все значения сброшены к эталону.');
    }
  }, [showToast]);

  const handleApplyPreset = useCallback((presetState: Partial<WellState>) => {
    setWellState(prev => ({ ...prev, ...presetState }));
    showToast('Параметры выбранного типа скважины успешно загружены!');
  }, [showToast]);

  const handlePrint = useCallback(() => {
    setActiveTab('report');
    setTimeout(() => {
      window.print();
    }, 250);
  }, []);

  const tabsConfig = [
    { id: 'well-scheme' as ActiveTab, label: '📐 Схема скважины', icon: Layers, color: 'text-sky-400' },
    { id: 'pkv' as ActiveTab, label: '1. Режим ПКВ', icon: Clock, color: 'text-amber-400' },
    { id: 'nkt' as ActiveTab, label: '2. Трубы НКТ', icon: Pipette, color: 'text-purple-400' },
    { id: 'hydraulics' as ActiveTab, label: '3. Гидравлика & Приток', icon: Gauge, color: 'text-blue-400' },
    { id: 'electro' as ActiveTab, label: '4. СУ & ТМПН', icon: Zap, color: 'text-yellow-400' },
    { id: 'cooling-kill' as ActiveTab, label: '5. Охлаждение & Глушение', icon: Snowflake, color: 'text-cyan-400' },
    { id: 'choke' as ActiveTab, label: '6. Штуцер', icon: Sliders, color: 'text-indigo-400' },
    { id: 'volumes' as ActiveTab, label: '7. Объёмы скважины', icon: Database, color: 'text-emerald-400' },
    { id: 'charts' as ActiveTab, label: '📊 Кривые насоса Q-H', icon: BarChart3, color: 'text-teal-400' },
    { id: 'report' as ActiveTab, label: '📋 Сводный протокол', icon: FileText, color: 'text-emerald-400' },
    { id: 'reference' as ActiveTab, label: 'Справочник', icon: BookOpen, color: 'text-slate-400' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white pb-16">
      
      {/* Top Fixed Header */}
      <Header
        state={wellState}
        onUpdateState={handleUpdateState}
        onReset={handleReset}
        onSave={handleSave}
        onPrint={handlePrint}
        onApplyPreset={handleApplyPreset}
      />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5 flex-1">
        
        {/* Top Key Metrics Banner */}
        <SummaryMetrics calc={calc} />

        {/* Tab Navigation Bar */}
        <nav className="flex items-center gap-1.5 border-b border-slate-800 mb-6 overflow-x-auto pb-1 scrollbar-none print:hidden">
          {tabsConfig.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition whitespace-nowrap border-b-2 ${
                  isActive
                    ? 'bg-slate-900 text-white border-blue-500 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Active Tab View */}
        <section>
          <Suspense fallback={<div className="p-8 text-center text-slate-400">Загрузка...</div>}>
          {activeTab === 'well-scheme' && (
            <WellSchemeTab
              state={wellState}
              calc={calc}
              updateState={handleUpdateState}
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

          {activeTab === 'electro' && (
            <ElectroTab
              state={wellState}
              electro={calc.electro}
              onChange={handleUpdateState}
            />
          )}

          {activeTab === 'cooling-kill' && (
            <CoolingKillTab
              state={wellState}
              coolingKill={calc.coolingKill}
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
            />
          )}

          {activeTab === 'report' && (
            <ReportTab
              state={wellState}
              calc={calc}
              onChange={handleUpdateState}
            />
          )}

          {activeTab === 'reference' && (
            <ReferenceTab />
          )}
        </Suspense>
        </section>

      </main>

      {/* Footer with Developer Attribution */}
      <Footer />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
