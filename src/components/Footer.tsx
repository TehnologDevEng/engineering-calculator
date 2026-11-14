import React from 'react';
import { Code2, Mail, Shield, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-slate-800/80 bg-slate-950/80 text-xs text-slate-400 py-6 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: Brand and purpose */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-600/20 text-blue-400 p-1.5 rounded-lg border border-blue-500/30">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-200">
              Инженерный калькулятор технолога УЭЦН PRO v4.2
            </div>
            <div className="text-[11px] text-slate-500">
              Комплекс технологических расчётов погружных насосных установок
            </div>
          </div>
        </div>

        {/* Right: Developer Attribution */}
        <div className="flex items-center gap-4 text-[11px] bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Разработчик:</span>
            <strong className="text-white bg-blue-500/20 px-2 py-0.5 rounded text-blue-300 border border-blue-500/30">
              Носар Андрей
            </strong>
          </div>

          <a
            href="mailto:nosar.andrey@gmail.com"
            className="flex items-center gap-1 text-slate-400 hover:text-blue-400 transition"
            title="Связаться с разработчиком"
          >
            <Mail className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-mono">nosar.andrey@gmail.com</span>
          </a>
        </div>

      </div>
    </footer>
  );
};
