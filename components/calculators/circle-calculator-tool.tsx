'use client';

import { useState } from 'react';
import {
  CalculatorSection,
  CalculatorField,
  CalculatorNumberInput,
  CalculatorStat,
} from './calculator-ui';

export function CircleCalculatorTool() {
  const [radius, setRadius] = useState<string>('');
  const [diameter, setDiameter] = useState<string>('');
  const [circumference, setCircumference] = useState<string>('');
  const [area, setArea] = useState<string>('');

  const calculateFromRadius = (r: number) => {
    if (!Number.isFinite(r) || r <= 0) {
      setDiameter('');
      setCircumference('');
      setArea('');
      return;
    }
    setDiameter((r * 2).toFixed(4));
    setCircumference((2 * Math.PI * r).toFixed(4));
    setArea((Math.PI * r * r).toFixed(4));
  };

  const calculateFromDiameter = (d: number) => {
    if (!Number.isFinite(d) || d <= 0) {
      setRadius('');
      setCircumference('');
      setArea('');
      return;
    }
    const r = d / 2;
    setRadius(r.toFixed(4));
    setCircumference((2 * Math.PI * r).toFixed(4));
    setArea((Math.PI * r * r).toFixed(4));
  };

  const calculateFromCircumference = (c: number) => {
    if (!Number.isFinite(c) || c <= 0) {
      setRadius('');
      setDiameter('');
      setArea('');
      return;
    }
    const r = c / (2 * Math.PI);
    setRadius(r.toFixed(4));
    setDiameter((r * 2).toFixed(4));
    setArea((Math.PI * r * r).toFixed(4));
  };

  const calculateFromArea = (a: number) => {
    if (!Number.isFinite(a) || a <= 0) {
      setRadius('');
      setDiameter('');
      setCircumference('');
      return;
    }
    const r = Math.sqrt(a / Math.PI);
    setRadius(r.toFixed(4));
    setDiameter((r * 2).toFixed(4));
    setCircumference((2 * Math.PI * r).toFixed(4));
  };

  return (
    <div className="space-y-8">
      <CalculatorSection
        title="Circle Inputs"
        description="Enter any one value to calculate the others instantly."
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <CalculatorField label="Radius">
            <CalculatorNumberInput
              value={radius}
              onChange={(e) => {
                const val = e.target.value;
                setRadius(val);
                calculateFromRadius(parseFloat(val));
              }}
              placeholder="e.g. 5"
            />
          </CalculatorField>

          <CalculatorField label="Diameter">
            <CalculatorNumberInput
              value={diameter}
              onChange={(e) => {
                const val = e.target.value;
                setDiameter(val);
                calculateFromDiameter(parseFloat(val));
              }}
              placeholder="e.g. 10"
            />
          </CalculatorField>

          <CalculatorField label="Circumference">
            <CalculatorNumberInput
              value={circumference}
              onChange={(e) => {
                const val = e.target.value;
                setCircumference(val);
                calculateFromCircumference(parseFloat(val));
              }}
              placeholder="e.g. 31.41"
            />
          </CalculatorField>

          <CalculatorField label="Area">
            <CalculatorNumberInput
              value={area}
              onChange={(e) => {
                const val = e.target.value;
                setArea(val);
                calculateFromArea(parseFloat(val));
              }}
              placeholder="e.g. 78.54"
            />
          </CalculatorField>
        </div>
      </CalculatorSection>

      <CalculatorSection title="Results Summary">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <CalculatorStat label="Radius" value={radius || '0'} tone={radius ? 'highlight' : 'default'} />
          <CalculatorStat label="Diameter" value={diameter || '0'} tone={diameter ? 'highlight' : 'default'} />
          <CalculatorStat label="Circumference" value={circumference || '0'} tone={circumference ? 'highlight' : 'default'} />
          <CalculatorStat label="Area" value={area || '0'} tone={area ? 'highlight' : 'default'} />
        </div>
      </CalculatorSection>
    </div>
  );
}
