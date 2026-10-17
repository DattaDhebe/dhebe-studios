const dayInMs = 24 * 60 * 60 * 1000;

const shortDateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 2,
});

export interface AgeCalculationResult {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  nextBirthdayInDays: number;
  nextBirthdayLabel: string;
  isBirthdayToday: boolean;
}

export interface BmiCalculationResult {
  bmi: number;
  category: string;
  healthyWeightMinKg: number;
  healthyWeightMaxKg: number;
}

export interface EmiCalculationResult {
  emi: number;
  totalPayment: number;
  totalInterest: number;
}

export interface SipCalculationResult {
  maturityValue: number;
  totalInvested: number;
  estimatedReturns: number;
}

export interface GstCalculationResult {
  baseAmount: number;
  gstAmount: number;
  grossAmount: number;
  cgstAmount: number;
  sgstAmount: number;
}

function getDaysInMonth(year: number, monthIndex: number) {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

function parseIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [yearString, monthString, dayString] = value.split('-');
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null;
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function addCalendarYears(date: Date, years: number) {
  const targetYear = date.getUTCFullYear() + years;
  const targetMonth = date.getUTCMonth();
  const targetDay = Math.min(date.getUTCDate(), getDaysInMonth(targetYear, targetMonth));

  return new Date(Date.UTC(targetYear, targetMonth, targetDay));
}

function addCalendarMonths(date: Date, months: number) {
  const totalMonths = date.getUTCFullYear() * 12 + date.getUTCMonth() + months;
  const targetYear = Math.floor(totalMonths / 12);
  const targetMonth = totalMonths % 12;
  const targetDay = Math.min(date.getUTCDate(), getDaysInMonth(targetYear, targetMonth));

  return new Date(Date.UTC(targetYear, targetMonth, targetDay));
}

function diffDays(start: Date, end: Date) {
  return Math.floor((end.getTime() - start.getTime()) / dayInMs);
}

function getRecurringDate(source: Date, year: number) {
  const targetMonth = source.getUTCMonth();
  const targetDay = Math.min(source.getUTCDate(), getDaysInMonth(year, targetMonth));

  return new Date(Date.UTC(year, targetMonth, targetDay));
}

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function formatNumber(value: number, maximumFractionDigits = 2) {
  if (maximumFractionDigits === 2) {
    return numberFormatter.format(value);
  }

  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits,
  }).format(value);
}

export function formatPercent(value: number) {
  return `${percentFormatter.format(value)}%`;
}

export function formatDateLabel(value: string) {
  const date = parseIsoDate(value);

  return date ? shortDateFormatter.format(date) : value;
}

export function calculateAge(dateOfBirthValue: string, asOfValue: string): AgeCalculationResult | null {
  const birthDate = parseIsoDate(dateOfBirthValue);
  const asOfDate = parseIsoDate(asOfValue);

  if (!birthDate || !asOfDate || birthDate.getTime() > asOfDate.getTime()) {
    return null;
  }

  let years = 0;
  while (addCalendarYears(birthDate, years + 1).getTime() <= asOfDate.getTime()) {
    years += 1;
  }

  const yearAnchor = addCalendarYears(birthDate, years);

  let months = 0;
  while (addCalendarMonths(yearAnchor, months + 1).getTime() <= asOfDate.getTime()) {
    months += 1;
  }

  const monthAnchor = addCalendarMonths(yearAnchor, months);
  const totalDays = diffDays(birthDate, asOfDate);
  const nextBirthday = (() => {
    const currentYearBirthday = getRecurringDate(birthDate, asOfDate.getUTCFullYear());
    if (currentYearBirthday.getTime() >= asOfDate.getTime()) {
      return currentYearBirthday;
    }

    return getRecurringDate(birthDate, asOfDate.getUTCFullYear() + 1);
  })();

  return {
    years,
    months,
    days: diffDays(monthAnchor, asOfDate),
    totalMonths: years * 12 + months,
    totalWeeks: Math.floor(totalDays / 7),
    totalDays,
    nextBirthdayInDays: diffDays(asOfDate, nextBirthday),
    nextBirthdayLabel: shortDateFormatter.format(nextBirthday),
    isBirthdayToday: nextBirthday.getTime() === asOfDate.getTime(),
  };
}

export function calculateBmiMetric(weightKg: number, heightCm: number): BmiCalculationResult | null {
  if (![weightKg, heightCm].every(Number.isFinite) || weightKg <= 0 || heightCm <= 0) {
    return null;
  }

  const heightMeters = heightCm / 100;
  const bmi = weightKg / (heightMeters * heightMeters);

  return {
    bmi,
    category: getBmiCategory(bmi),
    healthyWeightMinKg: 18.5 * heightMeters * heightMeters,
    healthyWeightMaxKg: 24.9 * heightMeters * heightMeters,
  };
}

export function calculateBmiImperial(weightLb: number, totalInches: number): BmiCalculationResult | null {
  if (![weightLb, totalInches].every(Number.isFinite) || weightLb <= 0 || totalInches <= 0) {
    return null;
  }

  const bmi = (703 * weightLb) / (totalInches * totalInches);
  const heightMeters = totalInches * 0.0254;

  return {
    bmi,
    category: getBmiCategory(bmi),
    healthyWeightMinKg: 18.5 * heightMeters * heightMeters,
    healthyWeightMaxKg: 24.9 * heightMeters * heightMeters,
  };
}

export function getBmiCategory(bmi: number) {
  if (bmi < 18.5) {
    return 'Underweight';
  }

  if (bmi < 25) {
    return 'Healthy weight';
  }

  if (bmi < 30) {
    return 'Overweight';
  }

  return 'Obesity';
}

export function calculatePercentageOf(percent: number, value: number) {
  if (!Number.isFinite(percent) || !Number.isFinite(value)) {
    return null;
  }

  return (percent / 100) * value;
}

export function calculateWhatPercent(part: number, whole: number) {
  if (!Number.isFinite(part) || !Number.isFinite(whole) || whole === 0) {
    return null;
  }

  return (part / whole) * 100;
}

export function calculatePercentageChange(fromValue: number, toValue: number) {
  if (!Number.isFinite(fromValue) || !Number.isFinite(toValue) || fromValue === 0) {
    return null;
  }

  return ((toValue - fromValue) / fromValue) * 100;
}

export function calculateEmi(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number,
): EmiCalculationResult | null {
  if (![principal, annualInterestRate, tenureMonths].every(Number.isFinite) || principal <= 0 || annualInterestRate < 0 || !Number.isInteger(tenureMonths) || tenureMonths <= 0) {
    return null;
  }

  const monthlyRate = annualInterestRate / 12 / 100;

  if (monthlyRate === 0) {
    const emi = principal / tenureMonths;
    return {
      emi,
      totalPayment: principal,
      totalInterest: 0,
    };
  }

  const denominator = -Math.expm1(-tenureMonths * Math.log1p(monthlyRate));
  const emi = (principal * monthlyRate) / denominator;
  const totalPayment = emi * tenureMonths;

  return {
    emi,
    totalPayment,
    totalInterest: totalPayment - principal,
  };
}

export function calculateSip(
  monthlyInvestment: number,
  annualReturnRate: number,
  tenureMonths: number,
): SipCalculationResult | null {
  if (![monthlyInvestment, annualReturnRate, tenureMonths].every(Number.isFinite) || monthlyInvestment <= 0 || annualReturnRate < 0 || !Number.isInteger(tenureMonths) || tenureMonths <= 0) {
    return null;
  }

  const monthlyRate = annualReturnRate / 12 / 100;
  const totalInvested = monthlyInvestment * tenureMonths;

  if (monthlyRate === 0) {
    return {
      maturityValue: totalInvested,
      totalInvested,
      estimatedReturns: 0,
    };
  }

  const growth = Math.expm1(tenureMonths * Math.log1p(monthlyRate));
  const maturityValue = monthlyInvestment * ((growth / monthlyRate) * (1 + monthlyRate));
  if (!Number.isFinite(maturityValue)) return null;

  return {
    maturityValue,
    totalInvested,
    estimatedReturns: maturityValue - totalInvested,
  };
}

export function calculateGstFromBase(baseAmount: number, gstRate: number): GstCalculationResult | null {
  if (![baseAmount, gstRate].every(Number.isFinite) || baseAmount < 0 || gstRate < 0) {
    return null;
  }

  const gstAmount = (baseAmount * gstRate) / 100;

  return {
    baseAmount,
    gstAmount,
    grossAmount: baseAmount + gstAmount,
    cgstAmount: gstAmount / 2,
    sgstAmount: gstAmount / 2,
  };
}

export function calculateGstFromGross(grossAmount: number, gstRate: number): GstCalculationResult | null {
  if (![grossAmount, gstRate].every(Number.isFinite) || grossAmount < 0 || gstRate < 0) {
    return null;
  }

  const baseAmount = grossAmount / (1 + gstRate / 100);
  const gstAmount = grossAmount - baseAmount;

  return {
    baseAmount,
    gstAmount,
    grossAmount,
    cgstAmount: gstAmount / 2,
    sgstAmount: gstAmount / 2,
  };
}
