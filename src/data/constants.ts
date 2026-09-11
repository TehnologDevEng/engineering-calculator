import { WellState } from '../types';

export interface SuCatalogItem {
  vendor: string;
  series: string;
  model: string;
  current: number;
  type: string;
  voltage: string;
  protection: string;
  filter: string;
  tms: string;
  tempRange: string;
  overload: string;
  recTmpn: string;
}

export const SU_FULL_CATALOG: SuCatalogItem[] = [
  { vendor: 'Триол', series: 'АК06 RC', model: 'АК06-160-RC', current: 160, type: 'УД (АД/ВЭД)', voltage: '380', protection: 'IP54/NEMA3R', filter: 'Да (опц.)', tms: 'Да', tempRange: '-60…+50', overload: '125%', recTmpn: 'ТМПН-100' },
  { vendor: 'Триол', series: 'АК06 RC', model: 'АК06-250-RC', current: 250, type: 'УД (АД/ВЭД)', voltage: '380', protection: 'IP54/NEMA3R', filter: 'Да (опц.)', tms: 'Да', tempRange: '-60…+50', overload: '125%', recTmpn: 'ТМПН-160' },
  { vendor: 'Триол', series: 'АК06 RC', model: 'АК06-400-RC', current: 400, type: 'УД (АД/ВЭД)', voltage: '380', protection: 'IP54/NEMA3R', filter: 'Да (опц.)', tms: 'Да', tempRange: '-60…+50', overload: '125%', recTmpn: 'ТМПН-250' },
  { vendor: 'Триол', series: 'АК06 RC', model: 'АК06-630-RC', current: 630, type: 'УД (АД/ВЭД)', voltage: '380', protection: 'IP54/NEMA3R', filter: 'Да (опц.)', tms: 'Да', tempRange: '-60…+50', overload: '125%', recTmpn: 'ТМПН-400' },
  { vendor: 'Триол', series: 'АК06 RC', model: 'АК06-800-RC', current: 800, type: 'УД (АД/ВЭД)', voltage: '380', protection: 'IP54/NEMA3R', filter: 'Да (опц.)', tms: 'Да', tempRange: '-60…+50', overload: '125%', recTmpn: 'ТМПН-630' },
  { vendor: 'Триол', series: 'АК06 RC', model: 'АК06-1000-RC', current: 1000, type: 'УД (АД/ВЭД)', voltage: '380', protection: 'IP54/NEMA3R', filter: 'Да (опц.)', tms: 'Да', tempRange: '-60…+50', overload: '125%', recTmpn: 'ТМПН-630' },
  { vendor: 'Триол', series: 'АК06 RC', model: 'АК06-1600-RC', current: 1600, type: 'УД (АД/ВЭД)', voltage: '380', protection: 'IP54/NEMA3R', filter: 'Да', tms: 'Да', tempRange: '-60…+50', overload: '125%', recTmpn: 'ТМПН-1000' },
  { vendor: 'Триол', series: 'АК06 RC', model: 'АК06-2000-RC', current: 2000, type: 'УД (АД/ВЭД)', voltage: '380', protection: 'IP54/NEMA3R', filter: 'Да', tms: 'Да', tempRange: '-60…+50', overload: '125%', recTmpn: 'ТМПН-1000' },
  { vendor: 'Триол', series: 'АК06 LH', model: 'АК06-160-LH', current: 160, type: 'УД (АД/ВЭД)', voltage: '380/480', protection: 'IP54', filter: 'Да (IEEE519)', tms: 'Да', tempRange: '-40…+50', overload: '125%', recTmpn: 'ТМПН-100' },
  { vendor: 'Триол', series: 'АК06 LH', model: 'АК06-400-LH', current: 400, type: 'УД (АД/ВЭД)', voltage: '380/480', protection: 'IP54', filter: 'Да (IEEE519)', tms: 'Да', tempRange: '-40…+50', overload: '125%', recTmpn: 'ТМПН-250' },
  { vendor: 'Триол', series: 'АК06 LH', model: 'АК06-630-LH', current: 630, type: 'УД (АД/ВЭД)', voltage: '380/480', protection: 'IP54', filter: 'Да (IEEE519)', tms: 'Да', tempRange: '-40…+50', overload: '125%', recTmpn: 'ТМПН-400' },
  { vendor: 'Триол', series: 'АК06 LH', model: 'АК06-1000-LH', current: 1000, type: 'УД (АД/ВЭД)', voltage: '380/480', protection: 'IP54', filter: 'Да (IEEE519)', tms: 'Да', tempRange: '-40…+50', overload: '125%', recTmpn: 'ТМПН-630' },
  { vendor: 'Триол', series: 'АК06 LH', model: 'АК06-2000-LH', current: 2000, type: 'УД (АД/ВЭД)', voltage: '380/480', protection: 'IP54', filter: 'Да (АФКУ)', tms: 'Да', tempRange: '-40…+50', overload: '125%', recTmpn: 'ТМПН-1000' },

  { vendor: 'Электон', series: 'Электон-05', model: 'ЭЛЕКТОН-05-160', current: 160, type: 'АД/ВЭД', voltage: '380', protection: 'УХЛ1/ТС1', filter: 'Да (опц.)', tms: 'Да', tempRange: '-45…+40', overload: '125%/5мин', recTmpn: 'ТМПН-100' },
  { vendor: 'Электон', series: 'Электон-05', model: 'ЭЛЕКТОН-05-250', current: 250, type: 'АД/ВЭД', voltage: '380', protection: 'УХЛ1/ТС1', filter: 'Да (опц.)', tms: 'Да', tempRange: '-45…+40', overload: '125%/5мин', recTmpn: 'ТМПН-160' },
  { vendor: 'Электон', series: 'Электон-05', model: 'ЭЛЕКТОН-05-400', current: 400, type: 'АД/ВЭД', voltage: '380', protection: 'УХЛ1/ТС1', filter: 'Да (опц.)', tms: 'Да', tempRange: '-45…+40', overload: '125%/5мин', recTmpn: 'ТМПН-250' },
  { vendor: 'Электон', series: 'Электон-05', model: 'ЭЛЕКТОН-05-630', current: 630, type: 'АД/ВЭД', voltage: '380', protection: 'УХЛ1/ТС1', filter: 'Да (опц.)', tms: 'Да', tempRange: '-45…+40', overload: '125%/5мин', recTmpn: 'ТМПН-400' },
  { vendor: 'Электон', series: 'Электон-05', model: 'ЭЛЕКТОН-05-800', current: 800, type: 'АД/ВЭД', voltage: '380', protection: 'УХЛ1/ТС1', filter: 'Да', tms: 'Да', tempRange: '-45…+40', overload: '125%/5мин', recTmpn: 'ТМПН-630' },
  { vendor: 'Электон', series: 'Электон-05', model: 'ЭЛЕКТОН-05-1000', current: 1000, type: 'АД/ВЭД', voltage: '380', protection: 'УХЛ1/ТС1', filter: 'Да', tms: 'Да', tempRange: '-45…+40', overload: '125%/5мин', recTmpn: 'ТМПН-630' },
  { vendor: 'Электон', series: 'Электон-05', model: 'ЭЛЕКТОН-05-1250', current: 1250, type: 'АД/ВЭД', voltage: '380', protection: 'УХЛ1', filter: 'Да', tms: 'Да', tempRange: '-45…+40', overload: '125%/5мин', recTmpn: 'ТМПН-1000' },
  { vendor: 'Электон', series: 'Электон-05', model: 'ЭЛЕКТОН-05-1600', current: 1600, type: 'АД/ВЭД', voltage: '380', protection: 'УХЛ1', filter: 'Да', tms: 'Да', tempRange: '-45…+40', overload: '125%/5мин', recTmpn: 'ТМПН-1000' },

  { vendor: 'Электон', series: 'Электон-07', model: 'ЭЛЕКТОН-07-400', current: 400, type: 'УПП+АД', voltage: '380', protection: 'УХЛ1', filter: 'Нет', tms: 'Да', tempRange: '-45…+40', overload: '—', recTmpn: 'ТМПН-250' },
  { vendor: 'Электон', series: 'Электон-07', model: 'ЭЛЕКТОН-07-630', current: 630, type: 'УПП+АД', voltage: '380', protection: 'УХЛ1', filter: 'Нет', tms: 'Да', tempRange: '-45…+40', overload: '—', recTmpn: 'ТМПН-400' },
  { vendor: 'Электон', series: 'Электон-07', model: 'ЭЛЕКТОН-07-800', current: 800, type: 'УПП+АД', voltage: '380', protection: 'УХЛ1', filter: 'Нет', tms: 'Да', tempRange: '-45…+40', overload: '—', recTmpn: 'ТМПН-630' },
  { vendor: 'Электон', series: 'Электон-07', model: 'ЭЛЕКТОН-07-1000', current: 1000, type: 'УПП+АД', voltage: '380', protection: 'УХЛ1', filter: 'Нет', tms: 'Да', tempRange: '-45…+40', overload: '—', recTmpn: 'ТМПН-630' },

  { vendor: 'Борец', series: 'Борец-15', model: 'Борец-15-160', current: 160, type: 'УД (АД/ВЭД)', voltage: '380', protection: 'IP54/NEMA3R', filter: 'Да (встр.)', tms: 'Да', tempRange: '-55…+50', overload: '125%', recTmpn: 'ТМПН-100' },
  { vendor: 'Борец', series: 'Борец-15', model: 'Борец-15-250', current: 250, type: 'УД (АД/ВЭД)', voltage: '380', protection: 'IP54/NEMA3R', filter: 'Да (встр.)', tms: 'Да', tempRange: '-55…+50', overload: '125%', recTmpn: 'ТМПН-160' },
  { vendor: 'Борец', series: 'Борец-15', model: 'Борец-15-400', current: 400, type: 'УД (АД/ВЭД)', voltage: '380', protection: 'IP54/NEMA3R', filter: 'Да (встр.)', tms: 'Да', tempRange: '-55…+50', overload: '125%', recTmpn: 'ТМПН-250' },
  { vendor: 'Борец', series: 'Борец-15', model: 'Борец-15-630', current: 630, type: 'УД (АД/ВЭД)', voltage: '380', protection: 'IP54/NEMA3R', filter: 'Да (встр.)', tms: 'Да', tempRange: '-55…+50', overload: '125%', recTmpn: 'ТМПН-400' },
  { vendor: 'Борец', series: 'Борец-15', model: 'Борец-15-1000', current: 1000, type: 'УД (АД/ВЭД)', voltage: '380', protection: 'IP54/NEMA3R', filter: 'Да (встр.)', tms: 'Да', tempRange: '-55…+50', overload: '125%', recTmpn: 'ТМПН-630' },
  { vendor: 'Борец', series: 'Борец ПП', model: 'Борец-ПП-250', current: 250, type: 'АД (ПП)', voltage: '380', protection: 'IP54', filter: 'Нет', tms: 'Да', tempRange: '-55…+50', overload: '—', recTmpn: 'ТМПН-160' },
  { vendor: 'Борец', series: 'Борец ПП', model: 'Борец-ПП-400', current: 400, type: 'АД (ПП)', voltage: '380', protection: 'IP54', filter: 'Нет', tms: 'Да', tempRange: '-55…+50', overload: '—', recTmpn: 'ТМПН-250' },

  { vendor: 'Новомет', series: 'СУ-04', model: 'СУ-04-160', current: 160, type: 'УД (АД/ВЭД)', voltage: '380', protection: 'IP54', filter: 'Да (встр.)', tms: 'Да', tempRange: '-40…+50', overload: '125%', recTmpn: 'ТМПН-100' },
  { vendor: 'Новомет', series: 'СУ-04', model: 'СУ-04-250', current: 250, type: 'УД (АД/ВЭД)', voltage: '380', protection: 'IP54', filter: 'Да (встр.)', tms: 'Да', tempRange: '-40…+50', overload: '125%', recTmpn: 'ТМПН-160' },
  { vendor: 'Новомет', series: 'СУ-04', model: 'СУ-04-400', current: 400, type: 'УД (АД/ВЭД)', voltage: '380', protection: 'IP54', filter: 'Да (встр.)', tms: 'Да', tempRange: '-40…+50', overload: '125%', recTmpn: 'ТМПН-250' },
  { vendor: 'Новомет', series: 'СУ-04', model: 'СУ-04-630', current: 630, type: 'УД (АД/ВЭД)', voltage: '380', protection: 'IP54', filter: 'Да (встр.)', tms: 'Да', tempRange: '-40…+50', overload: '125%', recTmpn: 'ТМПН-400' },
  { vendor: 'Новомет', series: 'СУ-05', model: 'СУ-05-160', current: 160, type: 'ВЭД', voltage: '380', protection: 'IP54', filter: 'Да', tms: 'Да', tempRange: '-40…+50', overload: '125%', recTmpn: 'ТМПН-100' },
  { vendor: 'Новомет', series: 'СУ-05', model: 'СУ-05-400', current: 400, type: 'ВЭД', voltage: '380', protection: 'IP54', filter: 'Да', tms: 'Да', tempRange: '-40…+50', overload: '125%', recTmpn: 'ТМПН-250' },

  { vendor: 'Эталон', series: 'СУ ЧР АВ', model: 'СУ ЧР АВ-160', current: 160, type: 'УД (АД/ВЭД)', voltage: '380', protection: 'УХЛ1', filter: 'Да', tms: 'Да', tempRange: '-45…+45', overload: '125%', recTmpn: 'ТМПН-100' },
  { vendor: 'Эталон', series: 'СУ ЧР АВ', model: 'СУ ЧР АВ-250', current: 250, type: 'УД (АД/ВЭД)', voltage: '380', protection: 'УХЛ1', filter: 'Да', tms: 'Да', tempRange: '-45…+45', overload: '125%', recTmpn: 'ТМПН-160' },
  { vendor: 'Эталон', series: 'СУ ЧР АВ', model: 'СУ ЧР АВ-400', current: 400, type: 'УД (АД/ВЭД)', voltage: '380', protection: 'УХЛ1', filter: 'Да', tms: 'Да', tempRange: '-45…+45', overload: '125%', recTmpn: 'ТМПН-250' },
  { vendor: 'Эталон', series: 'СУ ЧР АВ', model: 'СУ ЧР АВ-630', current: 630, type: 'УД (АД/ВЭД)', voltage: '380', protection: 'УХЛ1', filter: 'Да', tms: 'Да', tempRange: '-45…+45', overload: '125%', recTmpn: 'ТМПН-400' },
  { vendor: 'Эталон', series: 'СУ ЧР АВ', model: 'СУ ЧР АВ-800', current: 800, type: 'УД (АД/ВЭД)', voltage: '380', protection: 'УХЛ1', filter: 'Да', tms: 'Да', tempRange: '-45…+45', overload: '125%', recTmpn: 'ТМПН-630' },
  { vendor: 'Эталон', series: 'СУ ЧР АВ', model: 'СУ ЧР АВ-1000', current: 1000, type: 'УД (АД/ВЭД)', voltage: '380', protection: 'УХЛ1', filter: 'Да', tms: 'Да', tempRange: '-45…+45', overload: '125%', recTmpn: 'ТМПН-630' },
  { vendor: 'Эталон', series: 'СУ ЧР АВ', model: 'СУ ЧР АВ-1400', current: 1400, type: 'УД (АД/ВЭД)', voltage: '380', protection: 'УХЛ1', filter: 'Да', tms: 'Да', tempRange: '-45…+45', overload: '125%', recTmpn: 'ТМПН-1000' },
];

export interface TmpnSpec {
  model: string;
  s: number;   // kVA
  i: number;   // A
  uMax: number;// kV
}

export const TMPN_TABLE: TmpnSpec[] = [
  { model: 'ТМПН-63', s: 63, i: 95, uMax: 2.5 },
  { model: 'ТМПН-100', s: 100, i: 152, uMax: 2.5 },
  { model: 'ТМПН-160', s: 160, i: 243, uMax: 2.5 },
  { model: 'ТМПН-250', s: 250, i: 380, uMax: 4.0 },
  { model: 'ТМПН-400', s: 400, i: 607, uMax: 4.0 },
  { model: 'ТМПН-630', s: 630, i: 957, uMax: 6.0 },
  { model: 'ТМПН-1000', s: 1000, i: 1520, uMax: 6.0 },
];

export interface VedMemoItem {
  name: string;
  po: string;
  type: string;
  start: { label: string; val: string }[];
  uf: string;
  prot: { label: string; val: string }[];
  special: string;
  password: string;
}

export const VED_MEMO: Record<string, VedMemoItem> = {
  elekton: {
    name: 'Электон-05 / Борец-15 (на базе Электон-05)',
    po: 'КСУ1 ≥ 18.41.2; КСУ2 ≥ 28.18',
    type: 'U/f (ручной выбор ВЭД из списка или ручные настройки)',
    start: [
      { label: 'F пуск (100 Гц)', val: '4 Гц' },
      { label: 'U пуск (100 Гц)', val: '30 В' },
      { label: 'F пуск (200 Гц)', val: '6 Гц' },
      { label: 'U пуск (200 Гц)', val: '45 В' },
    ],
    uf: 'Максимальная предполагаемая рабочая частота → уставка 174',
    prot: [{ label: 'МТЗ', val: '125% (по умолчанию)' }],
    special: 'Обновить ПО до начала работ. Проверить корректность автоуставок с паспортом. Расчётная отпайка — ближайшая большая на ТМПН.',
    password: '—',
  },
  novomet05: {
    name: 'Новомет СУ-05',
    po: 'КСУ-02 ≥ 2.38; ПО ЧРП ≥ 61.33',
    type: 'Векторный (рекомендован). U/f — не рекомендуется',
    start: [
      { label: 'Режим пуска', val: 'С повышенным моментом (80%)' },
      { label: 'Макс. пуск. F', val: '20 Гц' },
      { label: 'Граничная F', val: '30 Гц' },
      { label: 'Компенсация Uвых', val: '11 В' },
    ],
    uf: 'Последняя точка U/F = макс. рабочее напряжение + макс. рабочая частота',
    prot: [
      { label: 'МТЗ коэф.', val: '1,5 (по умолчанию)' },
      { label: 'cos φ срыва', val: '0,45' },
      { label: 'Пуск. время контроля', val: '5 сек' },
    ],
    special: 'Пароль сервисного меню: 3141. Отпайку ставить на 10% больше рекомендованной. Сброс уставок ЧРП перед настройкой обязателен. АВ конденсаторов — в положение ВЭД.',
    password: '3141',
  },
  novomet03: {
    name: 'Новомет СУ-03',
    po: 'КСУ-01 ≥ 10.01.7.420 (СУ-03); КСУ-02 — актуальная с сайта Новомет',
    type: 'U/f',
    start: [
      { label: 'Режим пуска', val: 'С повышенным моментом (80%)' },
      { label: 'Макс. пуск. F', val: '20 Гц' },
      { label: 'Граничная F', val: '30 Гц' },
      { label: 'Компенсация Uвых', val: '11 В' },
    ],
    uf: 'Последняя точка U/F = макс. рабочее напряжение + макс. рабочая частота',
    prot: [
      { label: 'МТЗ', val: '160%' },
      { label: 'cos φ срыва', val: '0,60' },
      { label: 'Отклонение ЭДС', val: '50%' },
      { label: 'Задержка активации', val: '5 сек' },
    ],
    special: 'Сброс уставок ЧРП паролем 0577216. Для двухсекционных ПЭД — данные на двигатель в целом, параметры секций удваиваются.',
    password: '0577216',
  },
  triol: {
    name: 'Триол / ИРЗ (контроллер УМКА)',
    po: 'КСУ-01 ≥ 32.35; КСУ-02 ≥ 37.148',
    type: 'U/f (вентильный)',
    start: [
      { label: 'F пуск (3000/50 Гц)', val: '2 Гц / 13 В' },
      { label: 'F пуск (3000/100 Гц)', val: '4 Гц / 25 В' },
      { label: 'F пуск (6000/200 Гц)', val: '6 Гц / 35 В' },
      { label: 'Темп разгона', val: '2,5 Гц/сек' },
    ],
    uf: 'Точка 4 U/F = 300–330 В. Базовая частота = Fном × 1,2. Базовое напряжение = 380 В.',
    prot: [
      { label: 'cos φ задание', val: '0,85' },
      { label: 'При нестабильности', val: 'снижать до 0,6' },
    ],
    special: 'Пароль производителя: 2404. Параметр «Наличие ДТ за СФ» — отключить.',
    password: '2404',
  },
  etalon: {
    name: 'Эталон СУ ЧР / НЭК',
    po: 'КСУ-01 ≥ 20.13/31.03; КСУ-02 ≥ 18х.14',
    type: 'U/f (регулятор: Мин. Ток)',
    start: [
      { label: 'F пуск', val: '2 Гц' },
      { label: 'Пусковой коэфф.', val: '1' },
      { label: 'Время разгона', val: '60 сек' },
      { label: 'Частота ШИМ', val: '5 кГц (≤800А) / 4 кГц (>800А)' },
    ],
    uf: 'Базовая частота = Fном. Базовое напряжение = 380 В.',
    prot: [
      { label: 'МТЗ', val: '1,5' },
      { label: 'cos φ срыва', val: '0,47' },
      { label: 'Задержка контроля cos', val: '6 сек' },
    ],
    special: 'Отпайка = «Предл. отпайка» + 10–15%. L реактора: 160/250А→100 мкГн, 400/630А→60 мкГн, 800А→50 мкГн, ≥1000А→40 мкГн.',
    password: '—',
  },
  irz: {
    name: 'ИРЗ',
    po: 'КСУ ≥ 6.2.1488; ПО ПЧ ≥ 1.13',
    type: 'Вентил. 6-пульс или вентил. синхронный',
    start: [
      { label: 'Пусковой ток', val: '100%' },
      { label: 'Частота ШИМ', val: '≥ 10 кГц' },
      { label: 'Режим компенсации Udc', val: 'ОТКЛ' },
    ],
    uf: 'Единицы измерения — Гц. Отпайка по методике РН-Юганскнефтегаз.',
    prot: [
      { label: 'cos φ срыва (синхр. режим)', val: '0,5' },
      { label: 'Время рассинхронизации', val: '5 сек' },
    ],
    special: 'При авариях на высоких частотах — корректировать П-/И- коэффициенты.',
    password: '—',
  },
  orion: {
    name: 'Орион-03',
    po: '—',
    type: 'U/f (вентильный)',
    start: [
      { label: 'F пуск', val: '4–6 Гц' },
      { label: 'Темп разгона', val: '4–10' },
      { label: 'Частота ШИМ (100 Гц)', val: '5,0 кГц' },
      { label: 'Частота ШИМ (200 Гц)', val: '7,5 кГц' },
    ],
    uf: 'Пусковая частота = 4–6 Гц. Характеристика U/f автоматически.',
    prot: [{ label: 'МТЗ', val: 'По умолчанию' }],
    special: 'Число пар полюсов: Борец=2, Новомет=2, Лепсе=3, Ритек=4, Шлюмберже=1.',
    password: '—',
  },
  borets: {
    name: 'Борец-15 (контроллер Каскад-НТ)',
    po: 'КСУ1 ≥ 3775.4; КСУ2 ≥ 18.6 (литера 6 от 28.03.21)',
    type: 'U/f (вентильный, автовыбор из списка)',
    start: [
      { label: 'Режим пуска', val: 'Плавный' },
      { label: 'Время разгона', val: '20 сек' },
      { label: 'F ШИМ', val: '5 кГц' },
      { label: 'Коммутация', val: 'sin' },
    ],
    uf: 'Расчёт U/F через меню «Расчёт U/F». Uпэд+Uкаб = Uпэд+Uкаб расч.',
    prot: [
      { label: 'ЗСУ', val: '≤ 80%' },
      { label: 'T заклинивания', val: '5 сек' },
    ],
    special: 'Используется частота вала насоса, а не ПЭД! Отпайка — реальная = установленной на ТМПН.',
    password: '—',
  },
};

export const CABLE_RES_MAP: Record<number, number> = {
  10: 1.83,
  16: 1.15,
  25: 0.727,
  35: 0.524,
  50: 0.387,
  70: 0.268,
  95: 0.193,
};

export interface CableTypeInfo {
  id: string;
  name: string;
  maxTemp: number;
  kTemp: number;
}

export const CABLE_TYPES: CableTypeInfo[] = [
  { id: 'kbp', name: 'КПБП-120 (Блок-полиэтилен, до 120°C)', maxTemp: 120, kTemp: 0.0038 },
  { id: 'kbb', name: 'КПБВ-90 (Поливинилхлорид, до 90°C)', maxTemp: 90, kTemp: 0.0039 },
  { id: 'kpp', name: 'КПпБП-130 (Сшитый полипропилен, до 130°C)', maxTemp: 130, kTemp: 0.0038 },
  { id: 'kep', name: 'КПЭБП-150 (Этилен-пропилен, до 150°C)', maxTemp: 150, kTemp: 0.0038 },
  { id: 'kef', name: 'КПЭФБП-200 (Фторопласт, до 200°C)', maxTemp: 200, kTemp: 0.0036 },
  { id: 'lead', name: 'КПснБП-230 (Свинцовая броня, до 230°C)', maxTemp: 230, kTemp: 0.0036 },
];

export const CABLE_IMAX_BASE: Record<number, number> = {
  10: 65,
  16: 90,
  25: 115,
  35: 140,
  50: 175,
  70: 215,
  95: 260,
};

export const STD_CHOKES = [2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 35, 38, 40, 45, 50];

export const NKT_CATALOGUE = [
  { size: 60, outerD: 60.3, innerD: 50.3, wall: 5.0, weight: 6.8, capL: 1.99, yieldKn: 295 },
  { size: 73, outerD: 73.0, innerD: 62.0, wall: 5.5, weight: 9.2, capL: 3.02, yieldKn: 434 },
  { size: 89, outerD: 88.9, innerD: 75.9, wall: 6.5, weight: 13.2, capL: 4.52, yieldKn: 585 },
];

export const STEEL_GRADE_FACTORS: Record<string, { factor: number; yieldMpa: number }> = {
  D: { factor: 1.0, yieldMpa: 379 },
  K: { factor: 1.29, yieldMpa: 490 },
  E: { factor: 1.45, yieldMpa: 552 },
  L: { factor: 1.72, yieldMpa: 655 },
  M: { factor: 1.91, yieldMpa: 724 },
};

export const DEFAULT_WELL_STATE: WellState = {
  wellName: '312',
  clusterName: 'Куст 14',
  engineerName: 'Технолог УЭЦН',

  // Module 1: PKV
  pkvQplast: 12,
  pkvQpump: 45,
  pkvHstat: 850,
  pkvHdyn: 1450,
  pkvCasingId: 130,
  pkvTubingD: 73,
  pkvMaxStarts: 12,
  pkvMinCoolMin: 45,
  pkvCustomTon: undefined,
  pkvCustomToff: undefined,

  // Module 2: NKT
  nktSize: 73,
  nktSteelGrade: 'D',
  nktLength: 1750,
  nktType: 'smooth',
  nktFlowQ: 85,
  nktViscosity: 14,
  nktDensity: 980,
  nktEspWeight: 1850,

  // Module 3: Hydraulics & Inflow
  pPlast: 180,
  pSat: 85,
  gasFactor: 45,
  depthPlast: 2350,
  flowRate: 85,
  dynLevel: 1420,
  pumpDepth: 1750,
  pZatr: 14,
  pBuf: 18,
  waterCut: 65,
  oilDensity: 860,
  waterDensity: 1080,
  frequency: 50,
  measuredPtube: 78,
  kprMode: 0,
  customKpr: 0.7,

  // Module 4: Electrical
  pedPower: 45,
  pedCurrent: 34,
  pedVoltage: 1050,
  pedCosPhi: 0.84,
  pedType: 'uni',
  pedVendor: 'all',
  cableType: 'kppb-130',
  cableCross: 16,
  cableLength: 1850,
  wellTemp: 78,
  tmpnKva: 250,
  gridVoltage: 380,
  tapTypeCoeff: 1.0,
  vfdFreq: 50,

  // Module 5: Cooling & Kill
  casingId: 130,
  pedDiameter: 117,
  coolingShroud: false,
  pedEfficiency: 88,
  allowedDeltaT: 5,
  fluidHeatCapacity: 4200,
  killSafetyMargin: 1.10,
  tubingSize: 73,

  // Module 6: Choke
  chokeQ: 85,
  chokeDp: 15,
  chokeRho: 980,
  chokeC: 0.68,

  // Module 7: Volumes
  annulusIntervals: [
    { id: '1', casingDe: 146, casingS: 7, tubingDn: 73, length: 1750 }
  ],
  tubingIntervals: [
    { id: '1', tubingDn: 73, tubingS: 5.5, length: 1750 }
  ],
};

export const WELL_PRESETS: { id: string; name: string; description: string; state: Partial<WellState> }[] = [
  {
    id: 'pkv_low_rate',
    name: 'Малодебитная скважина (ПКВ)',
    description: 'Низкий приток 10-15 м³/сут, периодический режим откачки насосом 45 м³/сут.',
    state: {
      pkvQplast: 12,
      pkvQpump: 45,
      flowRate: 12,
      pkvHstat: 850,
      pkvHdyn: 1450,
      pedPower: 28,
      pedCurrent: 22,
      pedVoltage: 850,
      nktFlowQ: 45,
      pedType: 'async',
    },
  },
  {
    id: 'high_gas',
    name: 'Скважина с повышенным газосодержанием',
    description: 'Газовый фактор 95 м³/м³, низкое Pпр (< Pнас), подбор газосепаратора/диспергатора.',
    state: {
      gasFactor: 95,
      pSat: 110,
      pPlast: 170,
      dynLevel: 1550,
      pumpDepth: 1700,
      pZatr: 10,
      waterCut: 40,
    },
  },
  {
    id: 'deep_ved',
    name: 'Глубокая скважина с ВЭД (до 200 Гц)',
    description: 'Вентильный привод (ВЭД), частота до 100-200 Гц, глубокий спуск 2400 м, отпайка x1.2.',
    state: {
      depthPlast: 2750,
      pumpDepth: 2400,
      nktLength: 2400,
      cableLength: 2500,
      pedPower: 75,
      pedCurrent: 48,
      pedVoltage: 1200,
      pedType: 'ved',
      vfdFreq: 100,
      tapTypeCoeff: 1.2,
      cableCross: 25,
      tmpnKva: 250,
    },
  },
  {
    id: 'high_rate_water',
    name: 'Высокодебитная обводненная (200+ м³/сут)',
    description: 'Дебит 220 м³/сут, НКТ 89 мм, обводненность 92%, интенсивное омывание ПЭД.',
    state: {
      flowRate: 220,
      nktFlowQ: 220,
      nktSize: 89,
      tubingSize: 89,
      waterCut: 92,
      pedPower: 110,
      pedCurrent: 72,
      pedVoltage: 1200,
      tmpnKva: 400,
      cableCross: 35,
    },
  },
];

