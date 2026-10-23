import { testerApps } from './tester-apps';

export const androidApps = {
  rivetprep: {
    name: testerApps.rivetprep.name, tone: 'rivet', icon: testerApps.rivetprep.icon,
    category: 'EducationalApplication', label: 'Offline EPA 608 study',
    headline: 'Build your study rhythm.', kicker: 'FOR CURIOUS TRADE LEARNERS',
    description: 'Make room for a little learning, wherever the day takes you. RivetPrep brings offline EPA Section 608 lessons, practice questions, and personal review tools to your Android phone.',
    shortDescription: 'Offline lessons, practice questions, and focused review for EPA Section 608 learners. Help us test the study experience.',
    appPrivacy: 'https://rivetprep.dhebe.com/privacy/',
    highlights: ['500 original practice questions with answer explanations.', '24 offline lessons across the four study sections.', 'Study plans, flashcards, notes, and custom decks.'],
    features: [
      ['Learn before you drill', 'Read bundled lessons, worked examples, key points, and glossary terms without a connection.'],
      ['Practice with purpose', 'Try quick sessions, focused section drills, bookmarks, mistake retries, and configurable timed study mocks.'],
      ['Make it yours', 'Keep private notes, build your own study decks, and use recall-first flashcards with confidence ratings.'],
      ['Find your next step', 'Review coverage and activity, follow a study plan, and return to concepts that need another look.'],
      ['Keep progress nearby', 'Learning data stays on your device. Export a backup yourself when you want to keep a separate copy.'],
      ['Help improve the material', 'Report unclear questions, confusing explanations, accessibility issues, and bugs. Subject-matter feedback is especially welcome.'],
    ],
    testingTask: 'Try a lesson, complete a practice session, and tell us where the study flow or explanation could be clearer.',
    limitationTitle: 'Independent practice, not a certification.',
    limitation: 'RivetPrep is independent of the EPA and testing providers. Its original learning content awaits qualified subject-matter review. It is not an official exam bank, an approved course, or a promise of passing. The English-language material concerns U.S. EPA Section 608; choosing another region does not change the certification content.',
    dataNote: 'Study features work offline without an app account, advertising, or tracking SDKs. Optional official reference links open in your browser. Your chosen backup provider handles any file you export to it.',
  },
  rostercairn: {
    name: testerApps.rostercairn.name, tone: 'roster', icon: testerApps.rostercairn.icon,
    category: 'ProductivityApplication', label: 'Shifts & Pay',
    headline: 'See the work. Understand the estimate.', kicker: 'MADE FOR LIFE BETWEEN SHIFTS',
    description: 'A work week is more than a row of dates. RosterCairn brings your shift calendar, actual hours, and itemized pay estimates into one Android work ledger, with no account needed for the core features.',
    shortDescription: 'Plan shifts, record actual hours, and review itemized pay estimates. Volunteer to test our Android work ledger.',
    appPrivacy: 'https://rostercairn.dhebe.com/privacy-policy.html',
    highlights: ['Week, month, and year views with reusable shift templates.', 'Keep planned hours and actual hours separately.', 'Review pay estimates and export worked statements.'],
    features: [
      ['Plan more than one date', 'Use colored templates, rotations, and multi-date planning. Preview changes, review conflicts, and undo the latest unchanged batch.'],
      ['Record what happened', 'Track actual start and finish times, breaks, overnight work, and notes without replacing the original plan.'],
      ['Follow the calculation', 'Configure hourly, salary, or per-shift estimates, dated rates, overtime, premiums, and deductions. Expand the calculation to inspect it.'],
      ['Keep useful statements', 'Export PDF, CSV, or text reports and compare your recorded take-home amount with the estimate for the same period.'],
      ['Connect by choice', 'Optional calendar connections, reminders, a home-screen widget, and document-provider backups fit around your workflow.'],
      ['Review before applying', 'On-device payslip text recognition can suggest pay-setting changes. You review them before anything is changed.'],
    ],
    testingTask: 'Plan a few sample shifts, compare planned and actual hours, and check whether the calendar and pay breakdown are easy to follow. Use fictional pay data when sharing feedback.',
    limitationTitle: 'A personal ledger, not payroll software.',
    limitation: 'Pay figures are estimates based on the rules you enter, not guaranteed earnings, official tax calculations, or an employer payslip. The current app supports one active job ledger. Check your contract and actual payslip; custom international settings do not imply automatic local payroll compliance.',
    dataNote: 'Ledger records stay on your phone unless you choose an export, calendar connection, or backup destination. A selected document provider handles cloud uploads. Google ML Kit documents separate SDK diagnostic metrics. Automatic merging between phones is not implemented.',
  },
} as const;

export type AndroidAppId = keyof typeof androidApps;
