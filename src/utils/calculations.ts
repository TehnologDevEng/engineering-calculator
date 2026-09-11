import {
  WellState,
  PkvResults,
  NktResults,
  HydraulicsResults,
  ElectroResults,
  CoolingKillResults,
  ChokeResults,
  VolumesResults,
  FullCalculations,
  TapOption,
  SuRecommendation,
} from '../types';
import {
  SU_FULL_CATALOG,
  TMPN_TABLE,
  CABLE_RES_MAP,
  CABLE_IMAX_BASE,
  STD_CHOKES,
  NKT_CATALOGUE,
  STEEL_GRADE_FACTORS,
} from '../data/constants';

export function calculatePkv(state: WellState): PkvResults {
  let hStat = state.pkvHstat;
  let hDyn = state.pkvHdyn;
  let rhoMix = 1000;

  if (state.pkvInputMode === 'tms') {
    const waterFrac = state.waterCut / 100;
    rhoMix = state.oilDensity * (1 - waterFrac) + state.waterDensity * waterFrac;
    
    // P_tms is pressure at intake. 
    // H = Lpump - (Ptms * 101325) / (rhoMix * 9.81)
    hStat = Math.max(0, state.pumpDepth - (state.pkvPtmsStart * 101325) / (rhoMix * 9.81));
    hDyn = Math.max(0, state.pumpDepth - (state.pkvPtmsStop * 101325) / (rhoMix * 9.81));
  }

  const deltaH = Math.max(10, hDyn - hStat);

  // Annular cross section: S = pi/4 * (D_casing^2 - d_tubing_outer^2)
  const sAnnulusM2 = (Math.PI / 4) * (Math.pow(state.pkvCasingId / 1000, 2) - Math.pow(state.pkvTubingD / 1000, 2));
  const sAnnulusLM = sAnnulusM2 * 1000;

  // Volume accumulated in one cycle:
  const vCycle = deltaH * sAnnulusM2;

  // Rates in m3/hour
  const qPlHour = Math.max(0.01, state.pkvQplast / 24);
  const qPumpHour = Math.max(0.01, state.pkvQpump / 24);

  // Accumulation time
  const tAccumHours = vCycle / qPlHour;
  const tAccumMin = Math.round(tAccumHours * 60);

  // Pumping time: pump extracts accumulated volume while reservoir keeps feeding
  const netPumpRateHour = Math.max(0.05, qPumpHour - qPlHour);
  const tPumpHours = vCycle / netPumpRateHour;
  const tPumpMin = Math.round(tPumpHours * 60);

  // Total cycle
  const tCycleHours = tAccumHours + tPumpHours;
  const kCycle = tPumpHours / tCycleHours;
  const startsPerDay = 24 / Math.max(0.1, tCycleHours);
  const actualDailyQ = state.pkvQpump * kCycle;

  // Recommended times for user's desired starts
  const targetTcycleMin = 1440 / Math.max(1, state.pkvMaxStarts);
  const qRatio = state.pkvQplast / Math.max(1, state.pkvQpump);
  const recommendedTonMin = Math.round(qRatio * targetTcycleMin);
  const recommendedToffMin = Math.round(targetTcycleMin - recommendedTonMin);

  let isOptimal = true;
  let warningMessage: string | undefined;
  
  let coolingRecDeltaH: number | undefined;
  let coolingRecHdyn: number | undefined;
  let coolingRecPtms: number | undefined;

  if (startsPerDay > state.pkvMaxStarts) {
    isOptimal = false;
    warningMessage = `Число пусков (${startsPerDay.toFixed(1)}/сут) превышает лимит СУ (${state.pkvMaxStarts}/сут). Увеличьте интервал уровней ΔH или снизьте подачу насоса.`;
  } else if (state.pkvMinCoolMin > 0 && tAccumMin < state.pkvMinCoolMin) {
    isOptimal = false;
    
    // Auto-recommendation calculations
    const requiredTaccumHours = state.pkvMinCoolMin / 60;
    const requiredVcycle = requiredTaccumHours * qPlHour;
    coolingRecDeltaH = requiredVcycle / Math.max(0.001, sAnnulusM2);
    coolingRecHdyn = hStat + coolingRecDeltaH;
    
    if (state.pkvInputMode === 'tms') {
      coolingRecPtms = (state.pumpDepth - coolingRecHdyn) * rhoMix * 9.81 / 101325;
      warningMessage = `Внимание! Расчетное время паузы (${tAccumMin} мин) меньше минимального времени остывания ПЭД (${state.pkvMinCoolMin} мин). Для обеспечения безопасного остывания увеличьте перепад давлений (снизьте уставку отключения до ${Math.max(0, coolingRecPtms).toFixed(1)} атм).`;
    } else {
      warningMessage = `Внимание! Расчетное время паузы (${tAccumMin} мин) меньше минимального времени остывания ПЭД (${state.pkvMinCoolMin} мин). Для обеспечения безопасного остывания увеличьте ΔH до ${Math.round(coolingRecDeltaH)} м (установите Hдин.отк = ${Math.round(coolingRecHdyn)} м).`;
    }
  }

  return {
    deltaH,
    sAnnulusM2,
    sAnnulusLM,
    vCycle,
    tAccumHours,
    tAccumMin,
    tPumpHours,
    tPumpMin,
    tCycleHours,
    kCycle,
    startsPerDay,
    actualDailyQ,
    isOptimal,
    warningMessage,
    recommendedTonMin,
    recommendedToffMin,
    calcHstat: hStat,
    calcHdyn: hDyn,
    coolingRecDeltaH,
    coolingRecHdyn,
    coolingRecPtms,
  };
}

export function calculateNkt(state: WellState): NktResults {
  const catalogEntry = NKT_CATALOGUE.find(item => item.size === state.nktSize) || NKT_CATALOGUE[1];
  const steelFactor = STEEL_GRADE_FACTORS[state.nktSteelGrade] || STEEL_GRADE_FACTORS['D'];

  const dInnerMm = catalogEntry.innerD;
  const dOuterMm = catalogEntry.outerD;
  const weightPerMeterKg = catalogEntry.weight;
  const tensionAllowKn = Math.round(catalogEntry.yieldKn * steelFactor.factor);

  // Flow velocity
  const sNktInnerM2 = (Math.PI / 4) * Math.pow(dInnerMm / 1000, 2);
  const qNktM3s = state.nktFlowQ / 86400;
  const vNkt = qNktM3s / sNktInnerM2;

  // Reynolds
  const kinematicViscM2s = state.nktViscosity * 1e-6;
  const reynolds = (vNkt * (dInnerMm / 1000)) / kinematicViscM2s;

  let lambda: number;
  let flowRegime: string;

  if (reynolds < 2320) {
    lambda = 64 / Math.max(1, reynolds);
    flowRegime = `Ламинарный (Re = ${Math.round(reynolds)})`;
  } else {
    flowRegime = `Турбулентный (Re = ${Math.round(reynolds)})`;
    const relRoughness = state.nktType === 'coated' ? 0.01 / dInnerMm : 0.05 / dInnerMm;
    lambda = 0.11 * Math.pow(relRoughness + (68 / reynolds), 0.25);
  }

  // Darcy-Weisbach head loss
  const hLossM = lambda * (state.nktLength / (dInnerMm / 1000)) * (Math.pow(vNkt, 2) / (2 * 9.81));
  const deltaPAtm = (state.nktDensity * 9.81 * hLossM) / 100000;
  const deltaPMpa = deltaPAtm * 0.101325;

  let sandCarryStatus: 'good' | 'fair' | 'danger' = 'good';
  let sandCarryText = 'Отличный вынос механических примесей и парафина (v ≥ 0.8 м/с)';
  if (vNkt < 0.5) {
    sandCarryStatus = 'danger';
    sandCarryText = 'Риск выпадения мехпримесей и парафинизации (v < 0.5 м/с)';
  } else if (vNkt < 0.8) {
    sandCarryStatus = 'fair';
    sandCarryText = 'Удовлетворительный вынос (v = 0.5...0.8 м/с)';
  }

  // Strength calculation
  const pipeWeightAirKg = weightPerMeterKg * state.nktLength;
  const buoyancyFactor = 1 - (state.nktDensity / 7850);
  const pipeWeightFluidKg = pipeWeightAirKg * buoyancyFactor;
  const totalTensionKg = pipeWeightFluidKg + state.nktEspWeight;
  const totalTensionKn = (totalTensionKg * 9.81) / 1000;
  const safetyFactor = tensionAllowKn / totalTensionKn;
  const isStrengthOk = safetyFactor >= 1.5;

  return {
    dInnerMm,
    dOuterMm,
    vNkt,
    reynolds,
    flowRegime,
    lambda,
    hLossM,
    deltaPAtm,
    deltaPMpa,
    sandCarryStatus,
    sandCarryText,
    pipeWeightAirKg,
    pipeWeightFluidKg,
    totalTensionKg,
    totalTensionKn,
    tensionAllowKn,
    safetyFactor,
    isStrengthOk,
  };
}

export function calculateHydraulics(state: WellState): HydraulicsResults {
  const waterFrac = state.waterCut / 100;
  const rhoMix = state.oilDensity * (1 - waterFrac) + state.waterDensity * waterFrac;

  // Pump intake pressure
  const liquidColumnH = Math.max(0, state.pumpDepth - state.dynLevel);
  const pColumnLiquid = (rhoMix * 9.81 * liquidColumnH) / 101325;
  const pPr = state.pZatr + pColumnLiquid;
  const deltaSat = pPr - state.pSat;

  // Bottomhole pressure
  const columnToPlast = Math.max(0, state.depthPlast - state.pumpDepth);
  const pColumnPlast = (rhoMix * 9.81 * columnToPlast) / 101325;
  const pZab = pPr + pColumnPlast;
  const depression = Math.max(0.1, state.pPlast - pZab);
  const kpr = state.flowRate / depression;
  const potentialQ = Math.round(kpr * (state.pPlast - state.pSat));

  // 4 Modes of Kpr
  let kprModeResult = 0;
  if (state.kprMode === 0) {
    kprModeResult = depression > 0 ? state.flowRate / depression : 0;
  } else if (state.kprMode === 1) {
    kprModeResult = state.customKpr * depression; // Q
  } else if (state.kprMode === 2) {
    kprModeResult = state.customKpr > 0 ? (state.flowRate / state.customKpr) + pZab : pZab; // Ppl
  } else if (state.kprMode === 3) {
    kprModeResult = state.customKpr > 0 ? state.pPlast - (state.flowRate / state.customKpr) : pZab; // Pzab
  }

  // Verification of dynamic level vs tubing pressure
  // Hcalc = Lpump - Pt * 101325 / (rho * g)
  const calculatedDynLevelFromPt = Math.max(0, state.pumpDepth - (state.measuredPtube * 101325) / (rhoMix * 9.81));
  const calculatedPtFromDynLevel = Math.max(0, (state.pumpDepth - state.dynLevel) * rhoMix * 9.81 / 101325);
  const levelDiscrepancyM = Math.round(Math.abs(state.dynLevel - calculatedDynLevelFromPt));
  const isDiscrepancyOk = levelDiscrepancyM <= 100;

  // Free gas on pump intake
  let freeGasVol = 0;
  let betaIn = 0;
  if (pPr < state.pSat) {
    const gasSolubilityIntake = (pPr / state.pSat) * state.gasFactor;
    const gasReleased = Math.max(0, state.gasFactor - gasSolubilityIntake);
    const qGasStd = state.flowRate * (1 - waterFrac) * gasReleased;
    const bg = (1 / Math.max(1, pPr)) * ((273 + state.wellTemp) / 293);
    freeGasVol = qGasStd * bg;
    betaIn = (freeGasVol / (state.flowRate + freeGasVol)) * 100;
  }

  let gasRiskLevel: 'low' | 'medium' | 'high' = 'low';
  let gasEquipRecommendation = 'Штатный входной модуль (входная сетка)';
  if (betaIn >= 25) {
    gasRiskLevel = 'high';
    gasEquipRecommendation = 'Диспергатор + Газосепаратор центробежный (МН-ГСД)';
  } else if (betaIn >= 10) {
    gasRiskLevel = 'medium';
    gasEquipRecommendation = 'Газосепаратор центробежный (МН-ГС5)';
  }

  // VFD Similarity
  const freqRatio = state.frequency / 50;
  const scaledQ = state.flowRate * freqRatio;
  const baseHead = state.dynLevel + Math.round((state.pBuf * 101325) / (rhoMix * 9.81));
  const scaledH = Math.round(baseHead * Math.pow(freqRatio, 2));
  const scaledPower = parseFloat((state.pedPower * Math.pow(freqRatio, 3)).toFixed(1));

  return {
    rhoMix,
    pPr,
    deltaSat,
    pZab,
    depression,
    kpr,
    potentialQ,
    freeGasVol,
    betaIn,
    gasEquipRecommendation,
    gasRiskLevel,
    scaledQ,
    scaledH,
    scaledPower,
    calculatedDynLevelFromPt,
    calculatedPtFromDynLevel,
    levelDiscrepancyM,
    isDiscrepancyOk,
    kprModeResult,
  };
}

export function calculateElectro(state: WellState): ElectroResults {
  const tWellHead = 20;
  const tAvgCable = (tWellHead + state.wellTemp) / 2;
  const r20 = CABLE_RES_MAP[state.cableCross] || 1.15;
  const alphaCu = 0.00426;

  const rPhasePerKm = r20 * (1 + alphaCu * (tAvgCable - 20));
  const rTotalPhase = rPhasePerKm * (state.cableLength / 1000);
  const currentDensity = state.pedCurrent / state.cableCross;

  // Reactance of cable
  const xPhase = 0.08 * (state.cableLength / 1000);
  const sinPhi = Math.sqrt(Math.max(0, 1 - Math.pow(state.pedCosPhi, 2)));

  // Delta U in cable
  const deltaU = Math.sqrt(3) * state.pedCurrent * (rTotalPhase * state.pedCosPhi + xPhase * sinPhi);
  const deltaUPct = (deltaU / state.pedVoltage) * 100;
  const deltaPkw = (3 * Math.pow(state.pedCurrent, 2) * rTotalPhase) / 1000;

  const reqUSec = Math.round(state.pedVoltage + deltaU);

  // Exact v3.2 taps:
  const tapPp = Math.round(state.pedVoltage + deltaU);
  const tap50 = Math.round(tapPp + 30);
  const tapF = Math.round(tapPp * (state.vfdFreq / 50) + 30);
  const tapVed = Math.round(tapF * state.tapTypeCoeff);

  // 4 taps of TMPN transformer
  const baseTapU = Math.round(reqUSec / 20) * 20;
  const taps: TapOption[] = [
    {
      num: 1,
      tapU: baseTapU - 60,
      role: 'Пониженное U (напряжение кустовой сети > 400 В)',
      label: 'Ступень 1 (-5%)',
      iAllow: Math.round((state.tmpnKva * 1000) / (Math.sqrt(3) * (baseTapU - 60))),
      marginU: Math.round((((baseTapU - 60) - reqUSec) / reqUSec) * 100),
      isOptimal: false,
    },
    {
      num: 2,
      tapU: baseTapU,
      role: 'Основная отпайка (Расчетная норма)',
      label: 'Ступень 2 (Норма)',
      iAllow: Math.round((state.tmpnKva * 1000) / (Math.sqrt(3) * baseTapU)),
      marginU: Math.round(((baseTapU - reqUSec) / reqUSec) * 100),
      isOptimal: true,
    },
    {
      num: 3,
      tapU: baseTapU + 60,
      role: 'Повышенное U (просадка питающей сети < 360 В)',
      label: 'Ступень 3 (+5%)',
      iAllow: Math.round((state.tmpnKva * 1000) / (Math.sqrt(3) * (baseTapU + 60))),
      marginU: Math.round((((baseTapU + 60) - reqUSec) / reqUSec) * 100),
      isOptimal: false,
    },
    {
      num: 4,
      tapU: baseTapU + 120,
      role: 'Максимальная (тяжелый пуск / вязкая эмульсия)',
      label: 'Ступень 4 (+10%)',
      iAllow: Math.round((state.tmpnKva * 1000) / (Math.sqrt(3) * (baseTapU + 120))),
      marginU: Math.round((((baseTapU + 120) - reqUSec) / reqUSec) * 100),
      isOptimal: false,
    },
  ];

  const recommendedTap = `Ступень #2 (${baseTapU} В)`;
  const apparentPowerKva = (Math.sqrt(3) * reqUSec * state.pedCurrent) / 1000;
  const activePowerKw = apparentPowerKva * state.pedCosPhi;
  const tmpnLoadPct = (apparentPowerKva / state.tmpnKva) * 100;

  // Primary 380V network current
  const primaryCurrent = (apparentPowerKva * 1000) / (Math.sqrt(3) * state.gridVoltage);
  const reqCurrentSU = primaryCurrent * 1.15;

  // Select TMPN model based on power and voltage
  const tmpnSReq = apparentPowerKva * 1.1;
  let selectedTmpn = TMPN_TABLE.find(t => t.s >= tmpnSReq && t.i >= reqCurrentSU && t.uMax * 1000 >= tapVed);
  let selectedTmpnWarning: string | undefined;
  if (!selectedTmpn) {
    selectedTmpn = TMPN_TABLE.find(t => t.s >= tmpnSReq && t.i >= reqCurrentSU);
    if (selectedTmpn) {
      selectedTmpnWarning = `Напряжение отпайки (${tapVed} В) превышает Uвн.макс трансформатора (${selectedTmpn.uMax * 1000} В)`;
    }
  }
  const selectedTmpnModel = selectedTmpn ? `${selectedTmpn.model} (${selectedTmpn.s} кВА)` : 'ТМПН > 1000 кВА (или 6/10 кВ)';

  // Top 3 SUs filtered by motor type and vendor
  const vendorPriority: Record<string, number> = { 'Электон': 1, 'Эталон': 2, 'Борец': 3, 'Триол': 4, 'Новомет': 5 };
  const filteredSUs = SU_FULL_CATALOG.filter(item => {
    if (state.pedVendor !== 'all') {
      const vendorNameMap: Record<string, string> = {
        triol: 'Триол',
        elekton: 'Электон',
        borets: 'Борец',
        novomet: 'Новомет',
        etalon: 'Эталон',
      };
      if (item.vendor !== vendorNameMap[state.pedVendor]) return false;
    }
    if (state.pedType === 'ved' && !item.type.includes('ВЭД') && !item.type.includes('УД')) return false;
    if (state.pedType === 'async' && item.type.includes('ВЭД') && !item.type.includes('УД') && !item.type.includes('АД')) return false;
    return item.current >= reqCurrentSU;
  });

  const sortedSUs = [...filteredSUs].sort((a, b) => {
    const pa = vendorPriority[a.vendor] ?? 99;
    const pb = vendorPriority[b.vendor] ?? 99;
    if (pa !== pb) return pa - pb;
    return a.current - b.current;
  });

  const topSUs: SuRecommendation[] = sortedSUs.slice(0, 3).map(su => ({
    name: su.model,
    maker: su.vendor,
    type: su.type,
    current: su.current,
    power: Math.round((su.current * 380 * Math.sqrt(3) * 0.85) / 1000),
    margin: Math.round(((su.current - reqCurrentSU) / reqCurrentSU) * 100),
    voltage: su.voltage,
    protection: su.protection,
    filter: su.filter,
    tms: su.tms,
    tempRange: su.tempRange,
    overload: su.overload,
    recTmpn: su.recTmpn,
  }));

  // Cable max current adjusted for well temperature
  const baseI = CABLE_IMAX_BASE[state.cableCross] || 90;
  const kt = state.wellTemp <= 25 ? 1.0 :
             state.wellTemp <= 35 ? 0.91 :
             state.wellTemp <= 45 ? 0.82 :
             state.wellTemp <= 55 ? 0.71 :
             state.wellTemp <= 70 ? 0.58 : 0.50;
  const cableMaxCurrent = Math.round(baseI * kt);
  const cableLoadPct = Math.round((state.pedCurrent / Math.max(1, cableMaxCurrent)) * 100);
  const isCableOk = state.pedCurrent <= cableMaxCurrent;

  return {
    tAvgCable,
    rTotalPhase,
    currentDensity,
    deltaU,
    deltaUPct,
    deltaPkw,
    reqUSec,
    taps,
    recommendedTap,
    apparentPowerKva,
    activePowerKw,
    tmpnLoadPct,
    primaryCurrent,
    reqCurrentSU,
    topSUs,
    tapPp,
    tap50,
    tapF,
    tapVed,
    selectedTmpnModel,
    selectedTmpnWarning,
    cableMaxCurrent,
    cableLoadPct,
    isCableOk,
  };
}

export function calculateCoolingKill(state: WellState, scaledQ: number): CoolingKillResults {
  const casingInternalD = state.coolingShroud ? 122 : state.casingId;
  const sAnnulusM2 = (Math.PI / 4) * (Math.pow(casingInternalD / 1000, 2) - Math.pow(state.pedDiameter / 1000, 2));
  const sAnnulusCm2 = sAnnulusM2 * 10000;
  const qM3s = scaledQ / 86400;
  const velocity = qM3s / Math.max(0.0001, sAnnulusM2);

  const minRequiredVelocity = state.waterCut > 50 ? 0.10 : 0.15;
  const isCoolingOk = velocity >= minRequiredVelocity;

  let coolingMessage = `Скорость ${velocity.toFixed(2)} м/с достаточна для интенсивного теплосъема (норма ≥ ${minRequiredVelocity} м/с).`;
  if (!isCoolingOk) {
    coolingMessage = `Внимание! Скорость омывания (${velocity.toFixed(2)} м/с) ниже нормы (${minRequiredVelocity} м/с). Установите кожух охлаждения для предотвращения перегрева ПЭД.`;
  }

  // Thermal balance of cooling
  const heatLossKw = state.pedPower * (1 - (state.pedEfficiency / 100));
  const qMinCoolingM3Day = (heatLossKw * 1000 / (state.fluidHeatCapacity * state.allowedDeltaT)) * 86400 / 1000;
  const qMinCoolingSafeM3Day = qMinCoolingM3Day * 1.2;
  const isThermalCoolingOk = scaledQ >= qMinCoolingSafeM3Day;

  // Well killing calculations - strictly NO "рассол"
  const rhoKillGCm3 = (10 * state.pPlast * state.killSafetyMargin) / state.depthPlast;
  const rhoKillKgM3 = Math.round(rhoKillGCm3 * 1000);

  let fluidType = 'Техническая вода (сеноман)';
  let requiredSaltMassKgPerM3 = 0;
  if (rhoKillGCm3 > 1.02 && rhoKillGCm3 <= 1.18) {
    fluidType = 'Водный раствор хлорида натрия (NaCl)';
    requiredSaltMassKgPerM3 = Math.round((rhoKillKgM3 - 1000) * 1.6);
  } else if (rhoKillGCm3 > 1.18 && rhoKillGCm3 <= 1.36) {
    fluidType = 'Водный раствор хлорида кальция (CaCl₂)';
    requiredSaltMassKgPerM3 = Math.round((rhoKillKgM3 - 1000) * 1.4);
  } else if (rhoKillGCm3 > 1.36) {
    fluidType = 'Тяжелая солевая композиция (CaCl₂ + CaBr₂)';
    requiredSaltMassKgPerM3 = Math.round((rhoKillKgM3 - 1000) * 1.3);
  }

  const tubingEntry = NKT_CATALOGUE.find(t => t.size === state.tubingSize) || NKT_CATALOGUE[1];
  const tubingInnerM = tubingEntry.innerD / 1000;
  const tubingOuterM = tubingEntry.outerD / 1000;
  const casingInnerM = state.casingId / 1000;

  const vTubing = (Math.PI / 4) * Math.pow(tubingInnerM, 2) * state.pumpDepth;
  const vAnnulus = (Math.PI / 4) * (Math.pow(casingInnerM, 2) - Math.pow(tubingOuterM, 2)) * state.pumpDepth;
  const vBelowPump = (Math.PI / 4) * Math.pow(casingInnerM, 2) * Math.max(0, state.depthPlast - state.pumpDepth);
  const vTotalWell = vTubing + vAnnulus + vBelowPump;
  const vKillReq = vTotalWell * 1.25;

  return {
    sAnnulusCm2,
    velocity,
    minRequiredVelocity,
    isCoolingOk,
    coolingMessage,
    heatLossKw,
    qMinCoolingM3Day,
    qMinCoolingSafeM3Day,
    isThermalCoolingOk,
    rhoKillGCm3,
    rhoKillKgM3,
    fluidType,
    requiredSaltMassKgPerM3,
    vTubing,
    vAnnulus,
    vTotalWell,
    vKillReq,
  };
}

export function calculateChoke(state: WellState): ChokeResults {
  const q = state.chokeQ || state.flowRate || 80;
  const dp = Math.max(0.1, state.chokeDp || 15);
  const rho = Math.max(500, state.chokeRho || 950);
  const C = state.chokeC || 0.68;

  // A = (Q / 86400) / (C * sqrt(2 * dp * 101325 / rho))
  const deltaPPa = dp * 101325;
  const flowM3s = q / 86400;
  const areaM2 = flowM3s / (C * Math.sqrt(2 * deltaPPa / rho));
  const calcDiameterMm = Math.sqrt((4 * areaM2) / Math.PI) * 1000;
  const areaMm2 = areaM2 * 1e6;

  const stdChoke = STD_CHOKES.find(d => d >= calcDiameterMm) || STD_CHOKES[STD_CHOKES.length - 1];
  const statusText = calcDiameterMm <= 50 ? `Рекомендован типовой штуцер ${stdChoke} мм` : 'Необходим штуцер > 50 мм';

  return {
    calcDiameterMm,
    areaMm2,
    stdChokeMm: stdChoke,
    statusText,
  };
}

export function calculateVolumes(state: WellState): VolumesResults {
  let totalAnnulusVolM3 = 0;
  let totalAnnulusLengthM = 0;

  state.annulusIntervals.forEach(item => {
    const dCasingInner = item.casingDe - 2 * item.casingS;
    if (dCasingInner > item.tubingDn && item.length > 0) {
      const vol = (Math.PI / 4) * (Math.pow(dCasingInner / 1000, 2) - Math.pow(item.tubingDn / 1000, 2)) * item.length;
      totalAnnulusVolM3 += vol;
      totalAnnulusLengthM += item.length;
    }
  });

  let totalTubingVolM3 = 0;
  let totalTubingLengthM = 0;

  state.tubingIntervals.forEach(item => {
    const dTubingInner = item.tubingDn - 2 * item.tubingS;
    if (dTubingInner > 0 && item.length > 0) {
      const vol = (Math.PI / 4) * Math.pow(dTubingInner / 1000, 2) * item.length;
      totalTubingVolM3 += vol;
      totalTubingLengthM += item.length;
    }
  });

  const waterFrac = state.waterCut / 100;
  const oilMassTonsDay = state.flowRate * (1 - waterFrac) * (state.oilDensity / 1000);

  return {
    totalAnnulusVolM3,
    totalAnnulusLengthM,
    totalTubingVolM3,
    totalTubingLengthM,
    oilMassTonsDay,
  };
}

export function calculateAll(state: WellState): FullCalculations {
  const pkv = calculatePkv(state);
  const nkt = calculateNkt(state);
  const hydraulics = calculateHydraulics(state);
  const electro = calculateElectro(state);
  const coolingKill = calculateCoolingKill(state, hydraulics.scaledQ);
  const choke = calculateChoke(state);
  const volumes = calculateVolumes(state);

  return {
    pkv,
    nkt,
    hydraulics,
    electro,
    coolingKill,
    choke,
    volumes,
  };
}

