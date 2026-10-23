export const testerApps = {
  dhebevoice: {
    icon: '/dhebevoice-app-icon.png',
    name: 'DhebeVoice', privacyPath: '/dhebevoice/privacy-policy/#website-testers',
    communityEyebrow: 'THE EARLY LISTENERS',
    communityIntro: 'A small community helping DhebeVoice find its voice.',
  },
  rivetprep: {
    icon: '/rivetprep-app-icon-v3.webp',
    name: 'RivetPrep', privacyPath: '/apps/rivetprep/tester-privacy/#website-testers',
    communityEyebrow: 'LEARN. TEST. IMPROVE.',
    communityIntro: 'Help make an offline study companion clearer and easier to use.',
  },
  rostercairn: {
    icon: '/rostercairn-app-icon-v3.svg',
    name: 'RosterCairn', privacyPath: '/apps/rostercairn/tester-privacy/#website-testers',
    communityEyebrow: 'BUILT WITH SHIFT WORKERS',
    communityIntro: 'Help shape a more useful shift planner and work ledger.',
  },
} as const;

export type TesterAppId = keyof typeof testerApps;
