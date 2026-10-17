'use client';

import { useState } from 'react';
import { calculateAge } from '@/lib/calculators';
import {
  CalculatorDateInput,
  CalculatorField,
  CalculatorSection,
  CalculatorStat,
} from './calculator-ui';

export function DateDifferenceCalculatorTool() {
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [earlier, later] = [startDate, endDate].sort();
  const result = calculateAge(earlier, later);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <CalculatorSection
        title="Select Dates"
        description="Choose the two dates you want to compare."
      >
        <div className="space-y-4">
          <CalculatorField label="Start Date">
            <CalculatorDateInput
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </CalculatorField>
          <CalculatorField label="End Date">
            <CalculatorDateInput
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </CalculatorField>
        </div>
      </CalculatorSection>

      <CalculatorSection title="Duration Result" description="The exact time between the selected dates.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <CalculatorStat label="Total Days" value={result ? `${result.totalDays} days` : 'Choose both dates'} tone="highlight" />
          </div>
          <CalculatorStat label="Years" value={result ? `${result.years}` : '-'} />
          <CalculatorStat label="Months" value={result ? `${result.months}` : '-'} />
          <CalculatorStat label="Total Weeks" value={result ? `${result.totalWeeks}` : '-'} />
          <CalculatorStat label="Days" value={result ? `${result.days}` : '-'} />
        </div>
      </CalculatorSection>
    </div>
  );
}
