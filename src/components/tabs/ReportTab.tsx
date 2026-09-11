import React from 'react';
import { WellState, FullCalculations } from '../../types';
import { Printer, Download, FileText, CheckCircle2 } from 'lucide-react';

interface ReportTabProps {
  state: WellState;
  calc: FullCalculations;
  onChange: (updates: Partial<WellState>) => void;
}

export const ReportTab: React.FC<ReportTabProps> = ({ state, calc, onChange }) => {
  const { pkv, nkt, hydraulics, electro, coolingKill } = calc;
  const currentDate = new Date().toLocaleDateString('ru-RU');

  const reportItems = [
    { cat: 'Режим ПКВ', param: 'Период откачки (работа насоса Tотк)', unit: 'ч (мин)', val: `${pkv.tPumpHours.toFixed(2)} ч (${pkv.tPumpMin} мин)`, norm: 'По программе' },
    { cat: 'Режим ПКВ', param: 'Период накопления (пауза ПЭД Tпауз)', unit: 'ч (мин)', val: `${pkv.tAccumHours.toFixed(2)} ч (${pkv.tAccumMin} мин)`, norm: 'Остывание ПЭД' },
    { cat: 'Режим ПКВ', param: 'Число пусков в сутки', unit: 'пуск/сут', val: pkv.startsPerDay.toFixed(1), norm: `≤ ${state.pkvMaxStarts}` },
    { cat: 'Режим ПКВ', param: 'Откачиваемый объем за цикл Vцикл', unit: 'м³', val: pkv.vCycle.toFixed(2), norm: 'Объем столба ΔH' },
    { cat: 'Колонна НКТ', param: 'Потери давления на трение ΔPтр', unit: 'атм', val: nkt.deltaPAtm.toFixed(2), norm: 'Формула Альтшуля' },
    { cat: 'Колонна НКТ', param: 'Скорость восходящего потока в НКТ', unit: 'м/с', val: nkt.vNkt.toFixed(2), norm: 'Норма ≥ 0.5 м/с' },
    { cat: 'Колонна НКТ', param: 'Запас прочности на страгивание kзап', unit: 'д.ед.', val: nkt.safetyFactor.toFixed(2), norm: '≥ 1.50' },
    { cat: 'Пласт и забой', param: 'Забойное давление Pзаб', unit: 'атм', val: hydraulics.pZab.toFixed(1), norm: 'Расчетное' },
    { cat: 'Пласт и забой', param: 'Коэффициент продуктивности Кпр', unit: 'м³/(сут·атм)', val: hydraulics.kpr.toFixed(2), norm: 'Индикаторный' },
    { cat: 'Прием насоса', param: 'Давление на приеме Pпр', unit: 'атм', val: hydraulics.pPr.toFixed(1), norm: '≥ 25 атм' },
    { cat: 'Прием насоса', param: 'Газосодержание на приеме βвх', unit: '%', val: `${hydraulics.betaIn.toFixed(1)}%`, norm: '< 25%' },
    { cat: 'Прием насоса', param: 'Рекомендованная комплектация входа', unit: '-', val: hydraulics.gasEquipRecommendation, norm: 'По βвх' },
    { cat: 'Электрокомплекс', param: 'Падение напряжения в кабеле ΔU', unit: 'В (%)', val: `${Math.round(electro.deltaU)} В (${electro.deltaUPct.toFixed(1)}%)`, norm: '≤ 15%' },
    { cat: 'Электрокомплекс', param: 'Рекомендуемая отпайка ТМПН', unit: 'В', val: `${electro.recommendedTap} В`, norm: 'Ступень 2' },
    { cat: 'Электрокомплекс', param: 'Рекомендованная СУ', unit: '-', val: electro.topSUs[0]?.name || 'СУ 160А', norm: 'Запас по току' },
    { cat: 'Охлаждение ПЭД', param: 'Скорость омывания корпуса электродвигателя', unit: 'м/с', val: coolingKill.velocity.toFixed(2), norm: `≥ ${coolingKill.minRequiredVelocity.toFixed(2)} м/с` },
    { cat: 'Глушение скважины', param: 'Плотность жидкости глушения ρглуш', unit: 'г/см³', val: `${coolingKill.rhoKillGCm3.toFixed(2)} (${coolingKill.rhoKillKgM3} кг/м³)`, norm: `kзап = ${state.killSafetyMargin}` },
    { cat: 'Глушение скважины', param: 'Тип жидкости глушения (ЖГ)', unit: '-', val: coolingKill.fluidType, norm: 'По плотности' },
    { cat: 'Глушение скважины', param: 'Потребный объем глушения (1.25 V)', unit: 'м³', val: coolingKill.vKillReq.toFixed(1), norm: 'НКТ + затруб' },
    { cat: 'Устьевой штуцер', param: 'Расчётный диаметр диафрагмы', unit: 'мм', val: `${calc.choke.dCalcMm.toFixed(2)} мм`, norm: 'По дебиту Q' },
    { cat: 'Устьевой штуцер', param: 'Рекомендуемый стандартный штуцер', unit: 'мм', val: `${calc.choke.recommendedChoke.dMm} мм`, norm: 'ГОСТ / РД' },
    { cat: 'Объёмы скважины', param: 'Внутренний объём колонны НКТ', unit: 'м³', val: `${calc.volumes.vTubingTotal.toFixed(2)} м³`, norm: 'Ступени НКТ' },
    { cat: 'Объёмы скважины', param: 'Объём кольцевого пространства', unit: 'м³', val: `${calc.volumes.vAnnulusTotal.toFixed(2)} м³`, norm: 'Затруб' },
    { cat: 'Объёмы скважины', param: 'Полный объём ствола скважины', unit: 'м³', val: `${calc.volumes.vWellTotal.toFixed(2)} м³`, norm: 'До забоя' },
  ];

  const exportCSV = () => {
    let csv = 'Категория;Параметр;Ед. изм.;Значение;Норматив / Примечание\n';
    reportItems.forEach(r => {
      csv += `"${r.cat}";"${r.param}";"${r.unit}";"${r.val}";"${r.norm}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `УЭЦН_Протокол_Скв_${state.wellName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 print:bg-white print:border-none print:text-black print:p-0">
      
      {/* Header of Report */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 print:border-slate-300">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-blue-400 print:text-black" />
            <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide print:text-black">
              Сводный технологический паспорт-протокол УЭЦН
            </h2>
          </div>
          <p className="text-xs text-slate-400 print:text-slate-600">
            Официальный инженерный расчёт режимов и оборудования погружной насосной установки
          </p>
          <div className="text-[11px] text-blue-400 print:text-slate-700 mt-1">
            Разработка и алгоритмы: <span className="font-bold text-white print:text-black">Носар Андрей</span> (nosar.andrey@gmail.com)
          </div>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Экспорт CSV</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Печать</span>
          </button>
        </div>
      </div>

      {/* Passport Meta Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs print:bg-slate-100 print:border-slate-300 print:text-black">
        <div>
          <label className="text-slate-400 block mb-1 print:text-slate-600">Кустовая площадка:</label>
          <input
            type="text"
            value={state.clusterName}
            onChange={(e) => onChange({ clusterName: e.target.value })}
            className="bg-transparent font-bold text-white border-b border-dashed border-slate-700 focus:border-blue-500 focus:outline-none w-full print:text-black print:border-none"
          />
        </div>

        <div>
          <label className="text-slate-400 block mb-1 print:text-slate-600">Номер скважины:</label>
          <input
            type="text"
            value={state.wellName}
            onChange={(e) => onChange({ wellName: e.target.value })}
            className="bg-transparent font-bold text-white border-b border-dashed border-slate-700 focus:border-blue-500 focus:outline-none w-full print:text-black print:border-none"
          />
        </div>

        <div>
          <label className="text-slate-400 block mb-1 print:text-slate-600">Инженер-технолог / Дата:</label>
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={state.engineerName}
              onChange={(e) => onChange({ engineerName: e.target.value })}
              className="bg-transparent font-bold text-white border-b border-dashed border-slate-700 focus:border-blue-500 focus:outline-none print:text-black print:border-none"
            />
            <span className="font-mono text-slate-400 print:text-slate-600">{currentDate}</span>
          </div>
        </div>
      </div>

      {/* Protocol Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] print:border-slate-400 print:text-slate-700">
              <th className="py-2.5 pr-3">Узел / Модуль</th>
              <th className="py-2.5 px-3">Технологический параметр</th>
              <th className="py-2.5 px-3">Ед. изм.</th>
              <th className="py-2.5 px-3">Расчётное значение</th>
              <th className="py-2.5 pl-3">Норматив / Примечание</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70 font-mono print:divide-slate-300 print:text-black">
            {reportItems.map((r, idx) => (
              <tr key={idx} className="hover:bg-slate-800/20">
                <td className="py-2.5 pr-3 font-sans font-bold text-slate-300 print:text-black">{r.cat}</td>
                <td className="py-2.5 px-3 font-sans text-slate-200 print:text-black">{r.param}</td>
                <td className="py-2.5 px-3 text-slate-400 print:text-slate-600">{r.unit}</td>
                <td className="py-2.5 px-3 font-bold text-blue-400 print:text-black">{r.val}</td>
                <td className="py-2.5 pl-3 font-sans text-slate-400 print:text-slate-700">{r.norm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
