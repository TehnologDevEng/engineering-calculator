import React from 'react';
import { BookOpen, Table, FileSpreadsheet } from 'lucide-react';
import { NKT_CATALOGUE, STEEL_GRADE_FACTORS } from '../../data/constants';

export const ReferenceTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* NKT Pipes Reference */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Трубы насосно-компрессорные (ГОСТ 633-80)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2 pr-2">Диаметр</th>
                  <th className="py-2 px-2">Толщина</th>
                  <th className="py-2 px-2">dвн (мм)</th>
                  <th className="py-2 px-2">Масса 1 м</th>
                  <th className="py-2 px-2">Емкость</th>
                  <th className="py-2 pl-2">Qстраг (Д)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 font-mono">
                {NKT_CATALOGUE.map(n => (
                  <tr key={n.size}>
                    <td className="py-2.5 pr-2 font-bold text-white font-sans">{n.size} мм</td>
                    <td className="py-2.5 px-2">{n.wall.toFixed(1)} мм</td>
                    <td className="py-2.5 px-2 text-purple-300 font-bold">{n.innerD.toFixed(1)} мм</td>
                    <td className="py-2.5 px-2">{n.weight} кг</td>
                    <td className="py-2.5 px-2">{n.capL} л/м</td>
                    <td className="py-2.5 pl-2 text-blue-400 font-bold">{n.yieldKn} кН</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <strong>Группы прочности стали:</strong>
            <ul className="mt-1 space-y-1 font-mono text-[11px] text-slate-300">
              <li>• Группа «Д» — предел текучести σт = 379 МПа (k = 1.00)</li>
              <li>• Группа «К» — предел текучести σт = 490 МПа (k = 1.29)</li>
              <li>• Группа «Е» — предел текучести σт = 552 МПа (k = 1.45)</li>
              <li>• Группа «Л» — предел текучести σт = 655 МПа (k = 1.72)</li>
              <li>• Группа «М» — предел текучести σт = 724 МПа (k = 1.91)</li>
            </ul>
          </div>
        </div>

        {/* Cable Lines Reference */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Table className="w-5 h-5 text-yellow-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Кабели силовые нефтепогружные (ГОСТ Р 51777)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2 pr-2">Сечение</th>
                  <th className="py-2 px-2">R₂₀ фазы</th>
                  <th className="py-2 px-2">Iдоп.длит</th>
                  <th className="py-2 pl-2">Масса 1 км</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 font-mono">
                <tr>
                  <td className="py-2.5 pr-2 font-bold text-white">10 мм²</td>
                  <td className="py-2.5 px-2 text-yellow-300 font-bold">1.83 Ом/км</td>
                  <td className="py-2.5 px-2">42 А</td>
                  <td className="py-2.5 pl-2">~480 кг</td>
                </tr>
                <tr className="bg-slate-800/30">
                  <td className="py-2.5 pr-2 font-bold text-white">16 мм² (Стандарт)</td>
                  <td className="py-2.5 px-2 text-yellow-300 font-bold">1.15 Ом/км</td>
                  <td className="py-2.5 px-2">60 А</td>
                  <td className="py-2.5 pl-2">~670 кг</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-2 font-bold text-white">25 мм²</td>
                  <td className="py-2.5 px-2 text-yellow-300 font-bold">0.727 Ом/км</td>
                  <td className="py-2.5 px-2">80 А</td>
                  <td className="py-2.5 pl-2">~980 кг</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-2 font-bold text-white">35 мм²</td>
                  <td className="py-2.5 px-2 text-yellow-300 font-bold">0.524 Ом/км</td>
                  <td className="py-2.5 px-2">100 А</td>
                  <td className="py-2.5 pl-2">~1320 кг</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-xs text-slate-400 pt-2 border-t border-slate-800/60 leading-relaxed">
            <strong>Температурный пересчет сопротивления:</strong><br />
            <code className="text-yellow-400 font-mono text-[11px]">R(T) = R₂₀ · [1 + 0.00426 · (Tср - 20°C)]</code><br />
            Температурный индекс изоляции: КПпБП (130°C), КПБП (150°C), фторопласт (до 200°C).
          </div>
        </div>

      </div>

      {/* Normative Regulations card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-3">
          Ключевые нормативные ограничения и регламенты отрасли
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <h4 className="font-bold text-blue-400 mb-1.5">Охлаждение ПЭД</h4>
            <p className="leading-relaxed text-slate-400">
              Минимальная скорость омывания корпуса: <strong className="text-white">≥ 0.10 м/с</strong> при обводненности флюида &gt; 50% и <strong className="text-white">≥ 0.15 м/с</strong> при чистой нефти. При меньших скоростях обязательна установка кожуха охлаждения.
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <h4 className="font-bold text-amber-400 mb-1.5">Свободный газ на входе</h4>
            <p className="leading-relaxed text-slate-400">
              Допустимое газосодержание βвх без сепарации — <strong className="text-white">до 25%</strong> (для насосов с открытыми рабочими колесами). При β &gt; 25% необходим модуль газосепаратора-диспергатора.
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <h4 className="font-bold text-emerald-400 mb-1.5">Падение напряжения</h4>
            <p className="leading-relaxed text-slate-400">
              Суммарное падение напряжения в кабельной линии ΔUкаб не должно превышать <strong className="text-white">15%</strong> от номинального напряжения ПЭД для обеспечения стабильного динамического пускового момента.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
