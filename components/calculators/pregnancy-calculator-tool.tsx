'use client';

import { useState } from 'react';
import {
  CalculatorDateInput,
  CalculatorField,
  CalculatorSection,
  CalculatorStat,
} from './calculator-ui';

export function PregnancyCalculatorTool() {
  const [lastPeriod, setLastPeriod] = useState<string>(new Date().toISOString().split('T')[0]);

  const lpDate = new Date(lastPeriod);
  const edd = new Date(lpDate.getTime() + 280 * 24 * 60 * 60 * 1000); // 280 days (40 weeks)

  const today = new Date();
  const diffMs = today.getTime() - lpDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;
  const valid = Boolean(lastPeriod) && Number.isFinite(diffDays) && diffDays >= 0;

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <CalculatorSection
        title="Last Period"
        description="Enter the first day of your last menstrual period (LMP)."
      >
        <div className="space-y-4">
          <CalculatorField label="LMP Date">
            <CalculatorDateInput
              type="date"
              max={new Date().toLocaleDateString('en-CA')}
              value={lastPeriod}
              onChange={(e) => setLastPeriod(e.target.value)}
            />
          </CalculatorField>
        </div>
      </CalculatorSection>

      <CalculatorSection title="Estimates" description="Your calculated due date and current progress.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <CalculatorStat label="Estimated Due Date" value={valid ? formatDate(edd) : 'Choose a valid past date'} tone="highlight" />
          </div>
          <CalculatorStat label="Weeks Pregnant" value={valid ? `${weeks} weeks, ${days} days` : '-'} />
          <CalculatorStat label="Remaining Days" value={valid ? `${Math.max(0, 280 - diffDays)}` : '-'} />
        </div>
        <p className="mt-6 text-xs leading-5 theme-muted-2">
          Note: This is an estimation. Most babies are born between 37 and 42 weeks. Please consult with your doctor for medical advice.
        </p>
      </CalculatorSection>
    </div>
  );
}
