import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { FIELD_HINTS } from '../data/fieldHints';

interface FieldHintProps {
  hintKey: keyof typeof FIELD_HINTS;
}

export const FieldHint: React.FC<FieldHintProps> = ({ hintKey }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const info = FIELD_HINTS[hintKey];

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  if (!info) return null;

  return (
    <div ref={containerRef} className="relative inline-flex items-center ml-1 align-middle">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(prev => !prev);
        }}
        aria-label={`Подсказка: ${info.title}`}
        title={`Что такое ${info.title}?`}
        className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={info.title}
          className="absolute left-0 top-6 z-50 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 shadow-xl text-left text-xs text-slate-700 dark:text-slate-200 space-y-2"
        >
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="font-bold text-slate-900 dark:text-white leading-snug">{info.title}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-0.5 rounded"
              aria-label="Закрыть подсказку"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="leading-relaxed text-slate-600 dark:text-slate-300">{info.meaning}</p>
          <div className="pt-1 space-y-1 text-[11px] bg-slate-50 dark:bg-slate-950/70 p-2 rounded-lg border border-slate-200/70 dark:border-slate-800">
            <div>
              <span className="font-semibold text-blue-700 dark:text-blue-400">Где взять: </span>
              <span className="text-slate-600 dark:text-slate-300">{info.source}</span>
            </div>
            <div>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">Ориентир: </span>
              <span className="font-mono text-slate-700 dark:text-slate-200">{info.typical}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
