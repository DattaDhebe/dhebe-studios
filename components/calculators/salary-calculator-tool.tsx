'use client';

import { useState } from 'react';
import {
  CalculatorField,
  CalculatorNumberInput,
  CalculatorSection,
  CalculatorStat,
} from './calculator-ui';

export function SalaryCalculatorTool() {
  const [gross, setGross] = useState<number>(100000);
  const [taxRate, setTaxRate] = useState<number>(10);
  const [deductions, setDeductions] = useState<number>(2000);

  const taxAmount = (gross * taxRate) / 100;
  const netSalary = gross - taxAmount - deductions;
  const valid = [gross, taxRate, deductions].every(Number.isFinite) && gross >= 0 && taxRate >= 0 && taxRate <= 100 && deductions >= 0 && netSalary >= 0;

  const fmt = (val: number) =>
    !valid ? '-' : new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <CalculatorSection
        title="Income & Deductions"
        description="Enter your monthly gross salary and expected deductions."
      >
        <div className="space-y-4">
          <CalculatorField label="Monthly Gross Salary" hint="Salary before any taxes or deductions">
            <CalculatorNumberInput
              type="number"
              value={gross}
              onChange={(e) => setGross(Number(e.target.value))}
            />
          </CalculatorField>
          <CalculatorField label="Income Tax (%)" hint="Estimated monthly tax percentage">
            <CalculatorNumberInput
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
            />
          </CalculatorField>
          <CalculatorField label="Other Deductions" hint="PF, insurance, or other fixed costs">
            <CalculatorNumberInput
              type="number"
              value={deductions}
              onChange={(e) => setDeductions(Number(e.target.value))}
            />
          </CalculatorField>
        </div>
      </CalculatorSection>

      <CalculatorSection title="Take-Home Pay" description="Your estimated net monthly income.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <CalculatorStat label="Net Monthly Salary" value={fmt(netSalary)} tone="highlight" />
          </div>
          <CalculatorStat label="Gross Income" value={fmt(gross)} />
          <CalculatorStat label="Income Tax" value={fmt(taxAmount)} />
          <CalculatorStat label="Deductions" value={fmt(deductions)} />
          <div className="sm:col-span-2">
             <CalculatorStat label="Annual Net Pay" value={fmt(netSalary * 12)} />
          </div>
        </div>
        <p className="mt-6 text-xs leading-5 theme-muted-2">
          Note: This is a simplified estimate. Actual take-home pay depends on specific tax slabs, exemptions, and local labor laws.
        </p>
      </CalculatorSection>
    </div>
  );
}
