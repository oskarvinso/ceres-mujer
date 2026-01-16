
export interface HealthRecord {
  date: string;
  weight: number;
  systolic: number;
  diastolic: number;
  heartRate: number;
}

export interface PrenatalExam {
  id: string;
  name: string;
  status: 'pending' | 'normal' | 'abnormal';
  resultValue?: string;
  date?: string;
}

export interface ExamCategory {
  id: string;
  title: string;
  subtitle?: string;
  exams: PrenatalExam[];
}

export interface PrenatalControlTrack {
  id: string;
  title: string;
  hasControl: boolean;
  hasNutrition: boolean;
  hasExercise: boolean;
  completed: boolean;
}

export interface RiskFactors {
  sociodemographic: {
    age15_19: boolean;
    ageOver36: boolean;
    ageUnder15: boolean;
    lowSocioeconomic: boolean;
    workRisk: boolean;
    smoking: boolean;
    alcoholism: boolean;
    psychoactiveActive: boolean;
    multipara: boolean;
  };
  medical: {
    noRiskFactors: boolean;
    hypertensionChronic: boolean;
    hypertensionGestational: boolean;
    diabetesPreexisting: boolean;
    diabetesGestational: boolean;
    obesityIMC30_34: boolean;
    obesityIMC35_40: boolean;
    lowWeightIMC20: boolean;
    renalPathology: boolean;
    cardiacPathology: boolean;
    thyroidPathology: boolean;
    asthmaControlled: boolean;
    epilepsy: boolean;
    hiv_syphilis: boolean;
    cancerRemission: boolean;
    mentalHealthHistory: boolean;
  };
  reproductive: {
    previousAbortion2_plus: boolean;
    previousPretermBirth: boolean;
    previousPreeclampsia: boolean;
    previousCsection1_2: boolean;
    incompetenceCervical: boolean;
    ectopicHistory: boolean;
    uterineSurgery: boolean;
  };
  currentPregnancy: {
    noObstetricRiskFactors: boolean;
    multiplePregnancy: boolean;
    threatenedAbortion: boolean;
    threatenedPreterm: boolean;
    rciu: boolean;
    poly_oligohydramnios: boolean;
    hemorrhage: boolean;
    perinatalInfection: boolean;
  };
}

export interface UserProfile {
  name: string;
  lastName: string;
  documentType: 'CC' | 'CE' | 'TI' | 'PAS';
  idNumber: string;
  age: number;
  civilStatus: string;
  occupation: string;
  education: string;
  email: string;
  phone: string;
  department: string;
  municipality: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  emergencyContact: string;
  emergencyPhone: string;
  edd: string;
  gestationWeeks: number;
  height: number;
  initialWeight: number;
  initialIMC: number;
  bloodType?: string;
  weightGoal: {
    min: number;
    max: number;
    category: string;
  };
  riskFactors: RiskFactors;
  examSchedule?: ExamCategory[];
  prenatalControls?: PrenatalControlTrack[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'nutricion' | 'ropa' | 'salud' | 'libros';
  image: string;
  description: string;
}

export interface Lesson {
  id: string;
  title: string;
  category: 'yoga' | 'ejercicio' | 'cocina' | 'recreativo';
  duration: string;
  instructor: string;
  thumbnail: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}
