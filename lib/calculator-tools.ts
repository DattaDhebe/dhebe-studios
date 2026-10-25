export interface CalculatorTool {
  id: string;
  label: string;
  description: string;
  longDescription: string;
  category: 'health' | 'everyday' | 'finance' | 'tax';
  status: 'ready' | 'soon';
}

export const calculatorTools: CalculatorTool[] = [
  { id: 'circle', label: 'Circle Calculator', description: 'Find circle area and circumference.', longDescription: 'Enter a radius or diameter to calculate circle measurements in your browser.', category: 'everyday', status: 'ready' },
  {
    id: 'age',
    label: 'Age Calculator',
    description: 'Find age in years, months, and days.',
    longDescription:
      'Calculate exact age from date of birth, including total days, total weeks, and the next birthday countdown.',
    category: 'health',
    status: 'ready',
  },
  {
    id: 'bmi',
    label: 'BMI Calculator',
    description: 'Check body mass index instantly.',
    longDescription:
      'Estimate BMI using metric or imperial units and see the current weight category with a healthy range guide.',
    category: 'health',
    status: 'ready',
  },
  {
    id: 'percentage',
    label: 'Percentage Calculator',
    description: 'Solve percent, ratio, and change problems.',
    longDescription:
      'Calculate X percent of Y, find what percent one value is of another, or measure percentage increase and decrease.',
    category: 'everyday',
    status: 'ready',
  },
  {
    id: 'emi',
    label: 'EMI Calculator',
    description: 'Estimate monthly loan payments.',
    longDescription:
      'Calculate monthly EMI, total interest, and total repayment for home, car, personal, or education loans.',
    category: 'finance',
    status: 'ready',
  },
  {
    id: 'sip',
    label: 'SIP Calculator',
    description: 'Project mutual fund SIP growth.',
    longDescription:
      'Estimate maturity value, invested amount, and expected gains for a monthly SIP plan using annual return assumptions.',
    category: 'finance',
    status: 'ready',
  },
  {
    id: 'gst',
    label: 'GST Calculator',
    description: 'Add or remove GST from any amount.',
    longDescription:
      'Calculate GST-exclusive and GST-inclusive prices with CGST and SGST breakup for common business billing flows.',
    category: 'tax',
    status: 'ready',
  },
  {
    id: 'loan',
    label: 'Loan Calculator',
    description: 'Calculate loan interest and payoff.',
    longDescription:
      'Go beyond EMI to see full loan schedules, total interest costs, and how extra payments affect your payoff date.',
    category: 'finance',
    status: 'ready',
  },
  {
    id: 'salary',
    label: 'Salary Calculator',
    description: 'Calculate net take-home pay.',
    longDescription:
      'Estimate monthly and annual take-home salary after deductions like tax, insurance, and retirement contributions.',
    category: 'finance',
    status: 'ready',
  },
  {
    id: 'date-diff',
    label: 'Date Difference',
    description: 'Calculate days between two dates.',
    longDescription:
      'Find the exact number of years, months, weeks, and days between any two dates on the calendar.',
    category: 'everyday',
    status: 'ready',
  },
  {
    id: 'pregnancy',
    label: 'Pregnancy Due Date',
    description: 'Estimate baby delivery date.',
    longDescription:
      'Calculate your estimated due date (EDD) based on the first day of your last period or conception date.',
    category: 'health',
    status: 'ready',
  },
  {
    id: 'calories',
    label: 'Calories Calculator',
    description: 'Estimate daily calorie needs.',
    longDescription:
      'Calculate your basal metabolic rate (BMR) and recommended daily calories based on your activity level.',
    category: 'health',
    status: 'ready',
  },
];

export function getCalculatorToolById(id: string) {
  return calculatorTools.find((tool) => tool.id === id);
}
