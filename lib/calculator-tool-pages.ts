import type { Metadata } from 'next';
import { SITE_NAME, siteRoute } from '@/lib/site';

export interface CalculatorFaqEntry {
  question: string;
  answer: string;
}

export interface CalculatorCopySection {
  title: string;
  body: string;
}

export interface CalculatorKeywordGroup {
  title: string;
  items: string[];
  note?: string;
}

export interface CalculatorToolPageEntry {
  slug: string;
  path: string;
  id: string;
  label: string;
  description: string;
  longDescription: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  sections: CalculatorCopySection[];
  keywordGroups: CalculatorKeywordGroup[];
  faqs: CalculatorFaqEntry[];
}

export const calculatorToolPages: CalculatorToolPageEntry[] = [
  {
    slug: 'age-calculator',
    path: '/age-calculator/',
    id: 'age',
    label: 'Age Calculator',
    description: 'Calculate exact age in years, months, weeks, and days online.',
    longDescription:
      'Use date of birth and an as-of date to calculate exact age and the next birthday countdown.',
    seoTitle: 'Age Calculator - Calculate Age from Date of Birth',
    metaDescription:
      'Use this free age calculator to calculate your exact age in years, months, and days from your date of birth.',
    keywords: [
      'age calculator',
      'age calculator online',
      'age calculator by date of birth',
      'date of birth calculator',
      'dob calculator',
      'calculate age',
      'calculate age from date of birth',
      'exact age calculator',
      'age calculator in years months days',
      'birthday calculator',
      'how old am i',
      'age difference calculator',
      'age calculator by dob',
      'age calculator in hindi',
      'age calculator india',
      'उम्र कैलकुलेटर',
      'janam tarikh se age calculator',
      'date of birth se age calculator',
    ],
    sections: [
      {
        title: 'Age calculator by date of birth',
        body:
          'Use this free age calculator online to calculate age from date of birth and get exact results in years, months, and days. It works well as a dob calculator for personal records, job forms, school applications, and birthday planning.',
      },
      {
        title: 'Calculate age from DOB in seconds',
        body:
          'Enter your date of birth and choose the comparison date to calculate age instantly. The tool measures the full calendar difference, which makes it useful when someone searches for how old am I, age calculator by dob, or age calculator in years months days.',
      },
      {
        title: 'Popular age calculator searches in India',
        body:
          'Many users search for age calculator India, age calculator in Hindi, janam tarikh se age calculator, or date of birth se age calculator. This page keeps the workflow simple and mobile-friendly so exact age details are easy to read anywhere.',
      },
    ],
    keywordGroups: [
      {
        title: 'Related searches',
        items: [
          'age calculator online',
          'date of birth calculator',
          'dob calculator',
          'calculate age from date of birth',
          'exact age calculator',
          'birthday calculator',
          'how old am i',
          'age calculator by dob',
        ],
      },
      {
        title: 'India search phrases',
        items: [
          'age calculator in hindi',
          'age calculator india',
          'उम्र कैलकुलेटर',
          'janam tarikh se age calculator',
          'date of birth se age calculator',
        ],
      },
    ],
    faqs: [
      {
        question: 'How to calculate age from date of birth?',
        answer:
          'Enter your date of birth and the date you want to compare against. The calculator measures the exact calendar difference and shows your age in years, months, and days.',
      },
      {
        question: 'What does this exact age calculator show?',
        answer:
          'It shows exact age, total months, total weeks, total days, and how many days remain until the next birthday.',
      },
      {
        question: 'Can I use this dob calculator for forms in India?',
        answer:
          'Yes. This age calculator is useful when you need a quick age check for school, exam, hiring, insurance, or general date of birth verification in India.',
      },
      {
        question: 'Is this an age difference calculator too?',
        answer:
          'This page is focused on age from date of birth. You can still compare two people by checking each birth date separately against the same reference date.',
      },
    ],
  },
  {
    slug: 'bmi-calculator',
    path: '/bmi-calculator/',
    id: 'bmi',
    label: 'BMI Calculator',
    description: 'Calculate BMI online with metric or imperial units.',
    longDescription:
      'Find body mass index instantly and compare it with healthy weight ranges.',
    seoTitle: 'BMI Calculator - Calculate Body Mass Index Online',
    metaDescription:
      'Calculate your BMI using height and weight. Check your body mass index and know if you are underweight, normal, overweight, or obese.',
    keywords: [
      'bmi calculator',
      'bmi calculator online',
      'body mass index calculator',
      'calculate bmi',
      'bmi calculator kg cm',
      'bmi calculator for men',
      'bmi calculator for women',
      'bmi calculator for kids',
      'bmi chart',
      'healthy weight calculator',
      'ideal weight calculator',
      'height weight calculator',
      'bmi calculator india',
    ],
    sections: [
      {
        title: 'BMI calculator kg cm and body mass index calculator',
        body:
          'This BMI calculator helps you calculate BMI from height and weight in either metric or imperial units. It is a practical body mass index calculator for anyone searching for a quick BMI calculator online or BMI calculator kg cm workflow.',
      },
      {
        title: 'Healthy weight calculator and BMI chart guide',
        body:
          'The result includes a healthy weight range for your height, which makes the page useful as a healthy weight calculator, height weight calculator, and ideal weight calculator. BMI is a screening tool, so it should be read alongside broader health context.',
      },
      {
        title: 'BMI calculator India for men and women',
        body:
          'Many people search for BMI calculator India, BMI calculator for men, or BMI calculator for women. The same BMI formula is used for adults, while interpretation for children usually depends on age- and sex-specific BMI chart references.',
      },
    ],
    keywordGroups: [
      {
        title: 'Related searches',
        items: [
          'bmi calculator online',
          'body mass index calculator',
          'calculate bmi',
          'bmi calculator kg cm',
          'healthy weight calculator',
          'ideal weight calculator',
          'height weight calculator',
          'bmi calculator india',
        ],
      },
      {
        title: 'Popular variants',
        items: [
          'bmi calculator for men',
          'bmi calculator for women',
          'bmi chart',
          'bmi calculator for kids',
        ],
        note:
          'This tool is best for adult BMI checks. Child BMI assessment usually needs age-specific chart interpretation.',
      },
    ],
    faqs: [
      {
        question: 'How to calculate BMI?',
        answer:
          'BMI is calculated from your weight and height. In metric units, BMI equals weight in kilograms divided by height in meters squared.',
      },
      {
        question: 'What is a normal BMI range?',
        answer:
          'For most adults, a BMI from 18.5 to 24.9 is considered the healthy range. Lower values indicate underweight and higher values indicate overweight or obesity bands.',
      },
      {
        question: 'Can I use this BMI calculator kg cm in India?',
        answer:
          'Yes. The calculator supports kilogram and centimeter inputs directly, which makes it convenient for common BMI calculator India searches.',
      },
      {
        question: 'Is this BMI calculator for kids too?',
        answer:
          'This page is best for adults. Children and teenagers usually need age- and sex-based BMI chart interpretation rather than adult BMI ranges alone.',
      },
    ],
  },
  {
    slug: 'percentage-calculator',
    path: '/percentage-calculator/',
    id: 'percentage',
    label: 'Percentage Calculator',
    description: 'Calculate percentages, percent change, and ratios online.',
    longDescription:
      'Solve common percentage questions for shopping, finance, and classroom use in one calculator.',
    seoTitle: 'Percentage Calculator - Calculate Percentage Online',
    metaDescription:
      'Use this free percentage calculator to calculate percentage, percentage increase, percentage decrease, marks percentage, and discounts.',
    keywords: [
      'percentage calculator',
      'percent calculator',
      'calculate percentage',
      'percentage increase calculator',
      'percentage decrease calculator',
      'percentage change calculator',
      'marks percentage calculator',
      'percentage of marks calculator',
      'discount percentage calculator',
      'percentage difference calculator',
      'what is percentage',
      'how to calculate percentage',
      'percentage formula',
      'percentage calculator for marks',
      'cgpa to percentage calculator',
      'exam percentage calculator',
    ],
    sections: [
      {
        title: 'Percentage calculator for marks, discounts, and everyday math',
        body:
          'This percentage calculator is built for common calculations like percent of a number, percentage increase, percentage decrease, and percentage change. It also works well as a marks percentage calculator for exam scores and academic totals.',
      },
      {
        title: 'How to calculate percentage quickly',
        body:
          'Choose the type of problem you want to solve, then enter the two values. The tool covers calculate percentage questions, discount percentage calculator use cases, and percentage difference calculator checks without needing manual percentage formula work.',
      },
      {
        title: 'Student percentage calculator use cases',
        body:
          'Students often search for percentage calculator for marks, percentage of marks calculator, or exam percentage calculator. This tool handles direct marks percentage math, while institution-specific CGPA to percentage rules can vary by board or university.',
      },
    ],
    keywordGroups: [
      {
        title: 'Related searches',
        items: [
          'percent calculator',
          'calculate percentage',
          'percentage increase calculator',
          'percentage decrease calculator',
          'percentage change calculator',
          'discount percentage calculator',
          'percentage difference calculator',
          'how to calculate percentage',
        ],
      },
      {
        title: 'Student searches',
        items: [
          'marks percentage calculator',
          'percentage calculator for marks',
          'percentage of marks calculator',
          'exam percentage calculator',
          'cgpa to percentage calculator',
        ],
        note:
          'This tool supports direct percentage math. CGPA to percentage may depend on your school or university formula.',
      },
    ],
    faqs: [
      {
        question: 'How to calculate percentage of marks?',
        answer:
          'Divide the marks obtained by total marks, then multiply by 100. This calculator does that instantly when you enter the part and whole values.',
      },
      {
        question: 'Can this percentage calculator show increase or decrease?',
        answer:
          'Yes. Switch to percentage change mode to calculate percentage increase or percentage decrease between two values.',
      },
      {
        question: 'Is this also a discount percentage calculator?',
        answer:
          'Yes. You can use it to work out sale discounts, markups, and percent-off comparisons by choosing the right values.',
      },
      {
        question: 'Does this page convert CGPA to percentage?',
        answer:
          'Not directly. CGPA to percentage often depends on the formula used by a specific school, board, or university.',
      },
    ],
  },
  {
    slug: 'emi-calculator',
    path: '/emi-calculator/',
    id: 'emi',
    label: 'EMI Calculator',
    description: 'Calculate monthly EMI, interest, and total loan repayment online.',
    longDescription:
      'Estimate loan EMIs with principal, interest rate, and tenure inputs.',
    seoTitle: 'EMI Calculator - Calculate Loan EMI Online',
    metaDescription:
      'Calculate monthly EMI for home loan, personal loan, and car loan. Check total interest and total payment instantly.',
    keywords: [
      'emi calculator',
      'loan emi calculator',
      'emi calculator online',
      'home loan emi calculator',
      'personal loan emi calculator',
      'car loan emi calculator',
      'loan calculator',
      'home loan calculator',
      'personal loan calculator',
      'car loan calculator',
      'emi calculator india',
      'monthly emi calculator',
      'loan interest calculator',
      'emi calculator with interest',
      'home loan emi calculator india',
      'personal loan emi calculator india',
      'car loan emi calculator india',
      'emi calculator for 5 lakh loan',
      'emi calculator for 10 lakh loan',
      'emi calculator with prepayment',
      'reducing balance emi calculator',
    ],
    sections: [
      {
        title: 'Loan EMI calculator for home, personal, and car loans',
        body:
          'Use this EMI calculator online to estimate monthly EMI, total interest, and total repayment for home loan, personal loan, and car loan planning. It is useful whether you search for a loan EMI calculator, monthly EMI calculator, or loan interest calculator.',
      },
      {
        title: 'EMI calculator India for fast monthly planning',
        body:
          'The tool works well for common EMI calculator India searches such as home loan EMI calculator India, personal loan EMI calculator India, and car loan EMI calculator India. Enter the loan amount, annual interest rate, and tenure to see the repayment summary instantly.',
      },
      {
        title: 'Understand EMI with interest before you borrow',
        body:
          'This page helps you compare repayment scenarios for popular searches like EMI calculator for 5 lakh loan or EMI calculator for 10 lakh loan. It focuses on standard fixed-rate EMI calculations so you can get a reliable starting estimate before applying.',
      },
    ],
    keywordGroups: [
      {
        title: 'Related searches',
        items: [
          'loan emi calculator',
          'emi calculator online',
          'home loan emi calculator',
          'personal loan emi calculator',
          'car loan emi calculator',
          'monthly emi calculator',
          'loan interest calculator',
          'emi calculator with interest',
        ],
      },
      {
        title: 'Long-tail searches',
        items: [
          'home loan emi calculator india',
          'personal loan emi calculator india',
          'car loan emi calculator india',
          'emi calculator for 5 lakh loan',
          'emi calculator for 10 lakh loan',
          'emi calculator with prepayment',
          'reducing balance emi calculator',
        ],
        note:
          'This version handles standard EMI calculations. Prepayment and advanced reducing-balance variations may need a more specialized loan planner.',
      },
    ],
    faqs: [
      {
        question: 'How is EMI calculated?',
        answer:
          'EMI is calculated from the principal amount, interest rate, and loan tenure. The formula converts the total loan cost into equal monthly installments for the selected period.',
      },
      {
        question: 'Can I use this for home loan, personal loan, and car loan EMI?',
        answer:
          'Yes. The same calculator can be used for home loan EMI calculator, personal loan EMI calculator, and car loan EMI calculator scenarios.',
      },
      {
        question: 'Does this EMI calculator show total interest and total payment?',
        answer:
          'Yes. Along with monthly EMI, the page also shows total repayment and the total interest paid over the full tenure.',
      },
      {
        question: 'Does this page support EMI calculator with prepayment?',
        answer:
          'Not yet. The current version is designed for standard fixed-rate EMI calculations without prepayment schedules.',
      },
    ],
  },
  {
    slug: 'sip-calculator',
    path: '/sip-calculator/',
    id: 'sip',
    label: 'SIP Calculator',
    description: 'Calculate SIP returns and maturity value online.',
    longDescription:
      'Project mutual fund SIP growth with monthly investments and annual return assumptions.',
    seoTitle: 'SIP Calculator - Calculate Mutual Fund SIP Returns',
    metaDescription:
      'Use this SIP calculator to estimate mutual fund returns based on monthly investment, expected return rate, and investment period.',
    keywords: [
      'sip calculator',
      'sip calculator online',
      'sip return calculator',
      'mutual fund sip calculator',
      'sip investment calculator',
      'sip calculator india',
      'monthly sip calculator',
      'sip maturity calculator',
      'sip calculator with inflation',
      'step up sip calculator',
      'sip calculator with annual increase',
      'mutual fund calculator',
      'investment calculator',
      'sip calculator for 10 years',
      'sip calculator for 15 years',
      'sip calculator for 20 years',
      'sip calculator 5000 per month',
      'sip calculator 10000 per month',
      'how much sip to invest',
      'sip returns calculator india',
    ],
    sections: [
      {
        title: 'Mutual fund SIP calculator for monthly investing',
        body:
          'Use this SIP calculator online to estimate mutual fund SIP returns from a monthly contribution, expected return rate, and investment period. It works as a SIP investment calculator, monthly SIP calculator, and SIP maturity calculator in one page.',
      },
      {
        title: 'SIP calculator India for 10, 15, or 20 year planning',
        body:
          'This page is useful for popular searches like SIP calculator India, SIP calculator for 10 years, SIP calculator for 15 years, and SIP calculator for 20 years. It helps you compare investment horizons and see how long-term compounding can change final value.',
      },
      {
        title: 'Estimate SIP returns for 5000 or 10000 per month',
        body:
          'Whether you want a SIP calculator 5000 per month or SIP calculator 10000 per month, the idea is the same: adjust monthly investment, expected return, and duration until the return projection fits your goal. It is a practical starting point when you ask how much SIP to invest.',
      },
    ],
    keywordGroups: [
      {
        title: 'Related searches',
        items: [
          'sip calculator online',
          'sip return calculator',
          'mutual fund sip calculator',
          'sip investment calculator',
          'monthly sip calculator',
          'sip maturity calculator',
          'mutual fund calculator',
          'investment calculator',
        ],
      },
      {
        title: 'Long-tail searches',
        items: [
          'sip calculator india',
          'sip calculator for 10 years',
          'sip calculator for 15 years',
          'sip calculator for 20 years',
          'sip calculator 5000 per month',
          'sip calculator 10000 per month',
          'sip calculator with inflation',
          'step up sip calculator',
          'sip calculator with annual increase',
          'sip returns calculator india',
        ],
        note:
          'The current calculator uses a fixed monthly SIP and expected return. Step-up SIP and inflation-adjusted models can be added separately later.',
      },
    ],
    faqs: [
      {
        question: 'How is SIP return calculated?',
        answer:
          'SIP return is estimated from the monthly investment amount, expected annual return, and the total investment period. The calculator compounds the expected growth over the selected months.',
      },
      {
        question: 'Can I use this as a mutual fund SIP calculator?',
        answer:
          'Yes. It is designed for standard mutual fund SIP planning and shows maturity value, total invested amount, and estimated returns.',
      },
      {
        question: 'Does this SIP calculator work for 5000 or 10000 per month?',
        answer:
          'Yes. You can enter any monthly amount, including common searches like SIP calculator 5000 per month or SIP calculator 10000 per month.',
      },
      {
        question: 'Does this page support step up SIP or inflation?',
        answer:
          'Not yet. The current version focuses on a fixed monthly SIP amount and expected annual return for a clean baseline estimate.',
      },
    ],
  },
  {
    slug: 'gst-calculator',
    path: '/gst-calculator/',
    id: 'gst',
    label: 'GST Calculator',
    description: 'Add or remove GST online with CGST and SGST breakup.',
    longDescription:
      'Calculate GST-inclusive and GST-exclusive prices for invoices, billing, and quoting.',
    seoTitle: 'GST Calculator India - Add or Remove GST Online',
    metaDescription:
      'Calculate GST online for 5%, 12%, 18%, and 28% rates. Add GST or remove GST from any amount instantly.',
    keywords: [
      'gst calculator',
      'gst calculator online',
      'gst calculator india',
      'calculate gst',
      'gst amount calculator',
      'add gst calculator',
      'remove gst calculator',
      'gst inclusive calculator',
      'gst exclusive calculator',
      'gst tax calculator',
      'gst percentage calculator',
      '18 gst calculator',
      '12 gst calculator',
      '5 gst calculator',
      '28 gst calculator',
      'gst calculator for invoice',
      'gst calculator for business',
      'gst calculator with tax',
      'reverse gst calculator',
      'gst calculation formula',
      'how to calculate gst',
    ],
    sections: [
      {
        title: 'GST calculator India for adding or removing tax',
        body:
          'Use this GST calculator online to add GST to a base amount or remove GST from a total amount. It is useful for business quotes, invoices, purchase comparisons, and everyday GST calculator India needs.',
      },
      {
        title: 'GST inclusive calculator and GST exclusive calculator',
        body:
          'The page works as both a GST inclusive calculator and a GST exclusive calculator. Enter any rate, including common slabs such as 5%, 12%, 18%, and 28%, to calculate GST instantly with CGST and SGST breakup.',
      },
      {
        title: 'Calculate GST for invoice and business pricing',
        body:
          'Many users search for add GST calculator, remove GST calculator, reverse GST calculator, or GST calculator for invoice. This tool simplifies that workflow so you can understand taxable value, GST amount, and gross amount without doing the GST calculation formula manually.',
      },
    ],
    keywordGroups: [
      {
        title: 'Related searches',
        items: [
          'gst calculator online',
          'gst calculator india',
          'calculate gst',
          'gst amount calculator',
          'add gst calculator',
          'remove gst calculator',
          'gst inclusive calculator',
          'gst exclusive calculator',
        ],
      },
      {
        title: 'Business searches',
        items: [
          'gst tax calculator',
          'gst percentage calculator',
          '18 gst calculator',
          '12 gst calculator',
          '5 gst calculator',
          '28 gst calculator',
          'gst calculator for invoice',
          'gst calculator for business',
          'reverse gst calculator',
          'gst calculation formula',
        ],
      },
    ],
    faqs: [
      {
        question: 'How to calculate GST from total amount?',
        answer:
          'Choose the remove GST mode, enter the gross amount, and select the GST rate. The calculator will separate the taxable base amount and the GST amount automatically.',
      },
      {
        question: 'Can I add GST and remove GST on the same page?',
        answer:
          'Yes. Switch between add GST and remove GST modes to handle both inclusive and exclusive price calculations.',
      },
      {
        question: 'Does this GST calculator support 5%, 12%, 18%, and 28%?',
        answer:
          'Yes. You can enter any GST rate, including the common 5%, 12%, 18%, and 28% slabs used in India.',
      },
      {
        question: 'Is this useful for invoice or business calculations?',
        answer:
          'Yes. The tool is useful for GST calculator for invoice, quoting, billing, and general business pricing checks.',
      },
    ],
  },
  {
    slug: 'loan-calculator',
    path: '/loan-calculator/',
    id: 'loan',
    label: 'Loan Calculator',
    description: 'Calculate loan interest, total cost, and payoff schedule.',
    longDescription:
      'Go beyond EMI to understand total interest costs and amortization for home or car loans.',
    seoTitle: 'Loan Calculator - Calculate Total Interest and Payoff',
    metaDescription:
      'Free online loan calculator to estimate total interest, monthly payments, and full repayment schedules.',
    keywords: [
      'loan calculator',
      'loan interest calculator',
      'total loan cost calculator',
      'loan payoff calculator',
      'amortization calculator',
      'home loan interest calculator',
      'car loan calculator',
    ],
    sections: [
      {
        title: 'Calculate total loan cost',
        body:
          'Understand the full cost of your loan by calculating interest and principal breakdown.',
      },
    ],
    keywordGroups: [],
    faqs: [
      {
        question: 'What is a loan calculator?',
        answer: 'It helps you understand the total cost of borrowing money.',
      },
    ],
  },
  {
    slug: 'salary-calculator',
    path: '/salary-calculator/',
    id: 'salary',
    label: 'Salary Calculator',
    description: 'Calculate net take-home pay after tax and deductions.',
    longDescription: 'Estimate your monthly or annual disposable income after standard deductions.',
    seoTitle: 'Salary Calculator - Net Pay and Take-Home Pay Estimator',
    metaDescription:
      'Calculate your take-home pay after tax and other common deductions with this free tool.',
    keywords: ['salary calculator', 'take home pay calculator', 'net salary calculator'],
    sections: [
      {
        title: 'Estimate your net pay',
        body: 'Enter your gross salary to see a breakdown of tax and net pay.',
      },
    ],
    keywordGroups: [],
    faqs: [],
  },
  {
    slug: 'date-difference-calculator',
    path: '/date-difference-calculator/',
    id: 'date-diff',
    label: 'Date Difference',
    description: 'Find the number of days between any two dates.',
    longDescription: 'Calculate the exact duration between dates in years, months, and days.',
    seoTitle: 'Date Difference Calculator - Days Between Dates',
    metaDescription: 'Calculate the exact time difference between two dates online.',
    keywords: ['date difference', 'days between dates', 'duration calculator'],
    sections: [],
    keywordGroups: [],
    faqs: [],
  },
  {
    slug: 'pregnancy-due-date-calculator',
    path: '/pregnancy-due-date-calculator/',
    id: 'pregnancy',
    label: 'Pregnancy Due Date',
    description: 'Calculate your estimated baby delivery date.',
    longDescription: 'Estimate your EDD using your last period or conception date.',
    seoTitle: 'Pregnancy Due Date Calculator - EDD Estimator',
    metaDescription: 'Calculate your estimated pregnancy due date with this free tool.',
    keywords: ['pregnancy calculator', 'due date calculator', 'edd calculator'],
    sections: [],
    keywordGroups: [],
    faqs: [],
  },
  {
    slug: 'calories-calculator',
    path: '/calories-calculator/',
    id: 'calories',
    label: 'Calories Calculator',
    description: 'Estimate daily calorie needs based on activity.',
    longDescription: 'Calculate your BMR and TDEE to understand your energy needs.',
    seoTitle: 'Calories Calculator - Daily Calorie Needs Estimator',
    metaDescription: 'Estimate how many calories you need daily to maintain or lose weight.',
    keywords: ['calorie calculator', 'bmr calculator', 'daily calorie needs'],
    sections: [],
    keywordGroups: [],
    faqs: [],
  },
  {
    slug: 'circle',
    path: '/tools/circle/',
    id: 'circle',
    label: 'Circle Calculator',
    description: 'Calculate circle area, circumference, diameter, and radius online.',
    longDescription:
      'Free circle calculator to calculate area, circumference, diameter, and radius online.',
    seoTitle: 'Circle Calculator - Calculate Area, Circumference & Diameter',
    metaDescription:
      'Free circle calculator to calculate area, circumference, diameter, and radius online.',
    keywords: [
      'circle calculator',
      'calculate circle area',
      'circle circumference calculator',
      'diameter of circle calculator',
      'radius of circle calculator',
    ],
    sections: [
      {
        title: 'Calculate circle properties instantly',
        body:
          'Use this free circle calculator to find the area, circumference, diameter, and radius of any circle. Simply enter one known value and the tool will calculate the rest using standard geometric formulas.',
      },
    ],
    keywordGroups: [],
    faqs: [
      {
        question: 'How to calculate circle area?',
        answer: 'The area of a circle is calculated using the formula πr², where r is the radius.',
      },
      {
        question: 'How to find circle circumference?',
        answer: 'The circumference is found using 2πr or πd, where r is radius and d is diameter.',
      },
    ],
  },
];

export function buildCalculatorToolMetadata(tool: CalculatorToolPageEntry): Metadata {
  return {
    title: tool.seoTitle,
    description: tool.metaDescription,
    keywords: tool.keywords,
    alternates: {
      canonical: siteRoute(tool.path),
    },
    openGraph: { images: ['/social-preview.png'],
      title: `${tool.seoTitle} | Calculator Studio`,
      description: tool.metaDescription,
      url: siteRoute(tool.path),
      type: 'website',
      siteName: SITE_NAME,
    },
    twitter: { images: ['/social-preview.png'],
      card: 'summary_large_image',
      title: `${tool.seoTitle} | Calculator Studio`,
      description: tool.metaDescription,
    },
  };
}

export function getCalculatorToolPageBySlug(slug: string) {
  return calculatorToolPages.find((tool) => tool.slug === slug);
}

export function getCalculatorToolPageById(id: string) {
  return calculatorToolPages.find((tool) => tool.id === id);
}
