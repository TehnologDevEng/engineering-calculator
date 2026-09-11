export type ActiveTab = 
  | 'well-scheme'
  | 'pkv'
  | 'nkt'
  | 'hydraulics'
  | 'electro'
  | 'cooling-kill'
  | 'choke'
  | 'volumes'
  | 'charts'
  | 'report'
  | 'reference';

export interface AnnulusInterval {
  id: string;
  casingDe: number; // mm
  casingS: number;  // mm
  tubingDn: number; // mm
  length: number;   // m
}

export interface TubingInterval {
  id: string;
  tubingDn: number; // mm
  tubingS: number;  // mm
  length: number;   // m
}

export interface WellState {
  // General well metadata
  wellName: string;
  clusterName: string;
  engineerName: string;

  // Module 1: PKV (Periodic well operation - strictly PKV)
  pkvQplast: number;     // m3/day
  pkvQpump: number;      // m3/day
  pkvHstat: number;      // m
  pkvHdyn: number;       // m
  pkvCasingId: number;   // mm
  pkvTubingD: number;    // mm (60, 73, 89)
  pkvMaxStarts: number;  // starts per day max
  pkvMinCoolMin: number; // min cooling pause in minutes
  pkvInputMode: 'echo' | 'tms';
  pkvPtmsStart: number;  // atm (Pressure at intake before start)
  pkvPtmsStop: number;   // atm (Pressure at intake before stop)
  pkvCustomTon?: number; // min
  pkvCustomToff?: number; // min

  // Module 2: NKT (Tubing)
  nktSize: number;       // 60, 73, 89
  nktSteelGrade: 'D' | 'K' | 'E' | 'L' | 'M';
  nktLength: number;     // m
  nktType: 'smooth' | 'upset' | 'coated';
  nktFlowQ: number;      // m3/day
  nktViscosity: number;  // cSt
  nktDensity: number;    // kg/m3
  nktEspWeight: number;  // kg

  // Module 3: Hydraulics & Inflow
  pPlast: number;        // atm
  pSat: number;          // atm
  gasFactor: number;     // m3/m3
  depthPlast: number;    // m
  flowRate: number;      // m3/day
  dynLevel: number;      // m
  pumpDepth: number;     // m
  pZatr: number;         // atm
  pBuf: number;          // atm
  waterCut: number;      // %
  oilDensity: number;    // kg/m3
  waterDensity: number;  // kg/m3
  frequency: number;     // Hz (VFD)
  measuredPtube: number; // atm (for verification)
  kprMode: number;       // 0: Kpr, 1: Q, 2: Ppl, 3: Pzab
  customKpr: number;     // m3/(day*atm)

  // Module 4: Electrical Equipment
  pedPower: number;      // kW
  pedCurrent: number;    // A
  pedVoltage: number;    // V
  pedCosPhi: number;     // 0..1
  pedType: 'uni' | 'async' | 'ved';
  pedVendor: string;
  cableType: string;
  cableCross: number;    // 10, 16, 25, 35, 50, 70, 95 mm2
  cableLength: number;   // m
  wellTemp: number;      // °C
  tmpnKva: number;       // 63, 100, 160, 250, 400, 630, 1000
  gridVoltage: number;   // V (typically 380)
  tapTypeCoeff: number;  // 1.0 (std AD) or 1.2 (VED)
  vfdFreq: number;       // Hz (up to 200 Hz for VED)

  // Module 5: Cooling & Well Killing
  casingId: number;      // mm
  pedDiameter: number;   // 103, 117, 130 mm
  coolingShroud: boolean;
  pedEfficiency: number; // % (typically 88%)
  allowedDeltaT: number; // °C (typically 5°C)
  fluidHeatCapacity: number; // J/(kg*C) (typically 4200)
  killSafetyMargin: number; // 1.05, 1.08, 1.10, 1.15
  tubingSize: number;    // 60, 73, 89

  // Module 6: Choke
  chokeQ: number;        // m3/day
  chokeDp: number;       // atm
  chokeRho: number;      // kg/m3
  chokeC: number;        // 0.68

  // Module 7: Volumes
  annulusIntervals: AnnulusInterval[];
  tubingIntervals: TubingInterval[];
}

export interface PkvResults {
  deltaH: number;
  sAnnulusM2: number;
  sAnnulusLM: number;
  vCycle: number;
  tAccumHours: number;
  tAccumMin: number;
  tPumpHours: number;
  tPumpMin: number;
  tCycleHours: number;
  kCycle: number;
  startsPerDay: number;
  actualDailyQ: number;
  isOptimal: boolean;
  warningMessage?: string;
  recommendedTonMin?: number;
  recommendedToffMin?: number;
  calcHstat?: number;
  calcHdyn?: number;
  coolingRecDeltaH?: number;
  coolingRecHdyn?: number;
  coolingRecPtms?: number;
}

export interface NktResults {
  dInnerMm: number;
  dOuterMm: number;
  vNkt: number;
  reynolds: number;
  flowRegime: string;
  lambda: number;
  hLossM: number;
  deltaPAtm: number;
  deltaPMpa: number;
  sandCarryStatus: 'good' | 'fair' | 'danger';
  sandCarryText: string;
  pipeWeightAirKg: number;
  pipeWeightFluidKg: number;
  totalTensionKg: number;
  totalTensionKn: number;
  tensionAllowKn: number;
  safetyFactor: number;
  isStrengthOk: boolean;
}

export interface HydraulicsResults {
  rhoMix: number;
  pPr: number;
  deltaSat: number;
  pZab: number;
  depression: number;
  kpr: number;
  potentialQ: number;
  freeGasVol: number;
  betaIn: number;
  gasEquipRecommendation: string;
  gasRiskLevel: 'low' | 'medium' | 'high';
  scaledQ: number;
  scaledH: number;
  scaledPower: number;
  calculatedDynLevelFromPt: number;
  calculatedPtFromDynLevel: number;
  levelDiscrepancyM: number;
  isDiscrepancyOk: boolean;
  kprModeResult: number;
}

export interface TapOption {
  num: number;
  tapU: number;
  role: string;
  label: string;
  iAllow: number;
  marginU: number;
  isOptimal: boolean;
}

export interface SuRecommendation {
  name: string;
  maker: string;
  type: string;
  current: number;
  power: number;
  margin: number;
  voltage: string;
  protection: string;
  filter: string;
  tms: string;
  tempRange: string;
  overload: string;
  recTmpn: string;
}

export interface ElectroResults {
  tAvgCable: number;
  rTotalPhase: number;
  currentDensity: number;
  deltaU: number;
  deltaUPct: number;
  deltaPkw: number;
  reqUSec: number;
  taps: TapOption[];
  recommendedTap: string;
  apparentPowerKva: number;
  activePowerKw: number;
  tmpnLoadPct: number;
  primaryCurrent: number;
  reqCurrentSU: number;
  topSUs: SuRecommendation[];
  tapPp: number;
  tap50: number;
  tapF: number;
  tapVed: number;
  selectedTmpnModel: string;
  selectedTmpnWarning?: string;
  cableMaxCurrent: number;
  cableLoadPct: number;
  isCableOk: boolean;
}

export interface CoolingKillResults {
  sAnnulusCm2: number;
  velocity: number;
  minRequiredVelocity: number;
  isCoolingOk: boolean;
  coolingMessage: string;
  heatLossKw: number;
  qMinCoolingM3Day: number;
  qMinCoolingSafeM3Day: number;
  isThermalCoolingOk: boolean;
  rhoKillGCm3: number;
  rhoKillKgM3: number;
  fluidType: string;
  requiredSaltMassKgPerM3: number;
  vTubing: number;
  vAnnulus: number;
  vTotalWell: number;
  vKillReq: number;
}

export interface ChokeResults {
  calcDiameterMm: number;
  areaMm2: number;
  stdChokeMm: number;
  statusText: string;
}

export interface VolumesResults {
  totalAnnulusVolM3: number;
  totalAnnulusLengthM: number;
  totalTubingVolM3: number;
  totalTubingLengthM: number;
  oilMassTonsDay: number;
}

export interface FullCalculations {
  pkv: PkvResults;
  nkt: NktResults;
  hydraulics: HydraulicsResults;
  electro: ElectroResults;
  coolingKill: CoolingKillResults;
  choke: ChokeResults;
  volumes: VolumesResults;
}
