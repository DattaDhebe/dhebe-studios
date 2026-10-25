'use client';

import dynamic from 'next/dynamic';
import { type ComponentType } from 'react';
import { ToolWorkspace } from '@/components/tool-workspace';

const AgeCalculatorTool = dynamic(() => import('@/components/calculators/age-calculator-tool').then(mod => mod.AgeCalculatorTool));
const BmiCalculatorTool = dynamic(() => import('@/components/calculators/bmi-calculator-tool').then(mod => mod.BmiCalculatorTool));
const EmiCalculatorTool = dynamic(() => import('@/components/calculators/emi-calculator-tool').then(mod => mod.EmiCalculatorTool));
const GstCalculatorTool = dynamic(() => import('@/components/calculators/gst-calculator-tool').then(mod => mod.GstCalculatorTool));
const PercentageCalculatorTool = dynamic(() => import('@/components/calculators/percentage-calculator-tool').then(mod => mod.PercentageCalculatorTool));
const SipCalculatorTool = dynamic(() => import('@/components/calculators/sip-calculator-tool').then(mod => mod.SipCalculatorTool));
const LoanCalculatorTool = dynamic(() => import('@/components/calculators/loan-calculator-tool').then(mod => mod.LoanCalculatorTool));
const SalaryCalculatorTool = dynamic(() => import('@/components/calculators/salary-calculator-tool').then(mod => mod.SalaryCalculatorTool));
const DateDifferenceCalculatorTool = dynamic(() => import('@/components/calculators/date-difference-calculator-tool').then(mod => mod.DateDifferenceCalculatorTool));
const PregnancyCalculatorTool = dynamic(() => import('@/components/calculators/pregnancy-calculator-tool').then(mod => mod.PregnancyCalculatorTool));
const CaloriesCalculatorTool = dynamic(() => import('@/components/calculators/calories-calculator-tool').then(mod => mod.CaloriesCalculatorTool));
const CircleCalculatorTool = dynamic(() => import('@/components/calculators/circle-calculator-tool').then(mod => mod.CircleCalculatorTool));
import { calculatorToolPages } from '@/lib/calculator-tool-pages';
import { calculatorTools } from '@/lib/calculator-tools';

interface CalculatorToolsWorkbenchProps {
  initialTool?: string;
}

const toolComponents: Record<string, ComponentType> = {
  age: AgeCalculatorTool, bmi: BmiCalculatorTool, percentage: PercentageCalculatorTool,
  emi: EmiCalculatorTool, sip: SipCalculatorTool, gst: GstCalculatorTool,
  loan: LoanCalculatorTool, salary: SalaryCalculatorTool,
  'date-diff': DateDifferenceCalculatorTool, pregnancy: PregnancyCalculatorTool, calories: CaloriesCalculatorTool, circle: CircleCalculatorTool,
};

export function CalculatorToolsWorkbench({ initialTool = 'age' }: CalculatorToolsWorkbenchProps) {
  const activeTool = initialTool;
  const activeOption = calculatorTools.find(tool => tool.id === activeTool) ?? calculatorTools[0];
  const ActiveComponent = toolComponents[activeTool];
  const options = calculatorTools.map(tool => ({ ...tool, href: calculatorToolPages.find(page => page.id === tool.id)!.path }));
  return (
    <ToolWorkspace studio="Calculator Studio" studioHref="/calculator-studio/" icon="calculator" tone="calculator" title={activeOption.label} description={activeOption.longDescription} activeId={activeTool} groups={[{ label: 'All calculators', options }]}>
      {ActiveComponent ? <ActiveComponent key={activeTool} /> : null}
    </ToolWorkspace>
  );
}
