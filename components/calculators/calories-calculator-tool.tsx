'use client';

import { useState } from 'react';
import {
  CalculatorField,
  CalculatorNumberInput,
  CalculatorSection,
  CalculatorSelect,
  CalculatorStat,
} from './calculator-ui';

export function CaloriesCalculatorTool() {
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(175);
  const [activity, setActivity] = useState<number>(1.2);

  // Mifflin-St Jeor Equation
  const bmr =
    gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const tdee = bmr * activity;
  const valid = [age, weight, height, activity, tdee].every(Number.isFinite) && age >= 18 && age <= 120 && weight > 0 && height > 0 && bmr > 0;
  const calories = (value: number) => valid && value > 0 ? `${Math.round(value)} kcal` : '-';

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <CalculatorSection
        title="Personal Metrics"
        description="Enter your details to calculate calorie needs."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <CalculatorField label="Age">
            <CalculatorNumberInput
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
            />
          </CalculatorField>
          <CalculatorField label="Gender">
            <CalculatorSelect value={gender} onChange={(e) => setGender(e.target.value as any)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </CalculatorSelect>
          </CalculatorField>
          <CalculatorField label="Weight (kg)">
            <CalculatorNumberInput
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
          </CalculatorField>
          <CalculatorField label="Height (cm)">
            <CalculatorNumberInput
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </CalculatorField>
          <div className="sm:col-span-2">
            <CalculatorField label="Activity Level">
              <CalculatorSelect value={activity} onChange={(e) => setActivity(Number(e.target.value))}>
                <option value={1.2}>Sedentary (Office job)</option>
                <option value={1.375}>Lightly Active (1-2 days/week)</option>
                <option value={1.55}>Moderately Active (3-5 days/week)</option>
                <option value={1.725}>Very Active (6-7 days/week)</option>
                <option value={1.9}>Extra Active (Athlete/Physical job)</option>
              </CalculatorSelect>
            </CalculatorField>
          </div>
        </div>
      </CalculatorSection>

      <CalculatorSection title="Daily Calories" description="Estimates for maintenance and weight goals.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <CalculatorStat
              label="Maintenance (TDEE)"
              value={calories(tdee)}
              tone="highlight"
            />
          </div>
          <CalculatorStat label="Weight Loss (-500)" value={calories(tdee - 500)} />
          <CalculatorStat label="Weight Gain (+500)" value={calories(tdee + 500)} />
          <CalculatorStat label="BMR (Base)" value={calories(bmr)} />
        </div>
        <p className="mt-6 text-xs leading-5 theme-muted-2">
          Note: These are estimates based on standard formulas. Individual metabolism can vary. Consult a nutritionist for a personalized plan.
        </p>
      </CalculatorSection>
    </div>
  );
}
